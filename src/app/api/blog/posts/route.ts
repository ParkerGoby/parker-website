import { NextRequest, NextResponse } from 'next/server'
import readingTime from 'reading-time'
import { requireAdmin } from '@/lib/auth-utils'
import { db } from '@/db'
import { posts } from '@/db/schema'

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Forbidden: admin role required' }, { status: 403 })
  }

  const body = await req.json()
  const { title, excerpt, content, tags, published } = body

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const stats = readingTime(content)
  const readingTimeStr = stats.text
  const date = new Date().toISOString().split('T')[0]

  try {
    const [post] = await db
      .insert(posts)
      .values({ slug, title, date, excerpt, content, tags, published, readingTime: readingTimeStr })
      .returning()

    return NextResponse.json({ slug: post.slug }, { status: 201 })
  } catch (err: unknown) {
    const pgErr = err as { code?: string }
    if (pgErr?.code === '23505') {
      return NextResponse.json({ error: 'A post with this title already exists' }, { status: 409 })
    }
    throw err
  }
}
