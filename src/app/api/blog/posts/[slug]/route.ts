import { NextRequest, NextResponse } from 'next/server'
import readingTime from 'reading-time'
import { requireAdmin } from '@/lib/auth-utils'
import { db } from '@/db'
import { posts } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Forbidden: admin role required' }, { status: 403 })
  }

  const { slug } = await params
  const body = await req.json()
  const { title, excerpt, content, tags, published } = body

  const stats = readingTime(content)
  const readingTimeStr = stats.text

  const [updated] = await db
    .update(posts)
    .set({ title, excerpt, content, tags, published, readingTime: readingTimeStr })
    .where(eq(posts.slug, slug))
    .returning()

  if (!updated) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  return NextResponse.json({ slug: updated.slug }, { status: 200 })
}
