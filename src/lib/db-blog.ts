import { db } from '@/db'
import { posts } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'
import type { Post } from '@/types'

function toPost(row: typeof posts.$inferSelect): Post {
  return {
    slug: row.slug,
    title: row.title,
    date: row.date,
    excerpt: row.excerpt,
    tags: row.tags ?? [],
    published: row.published ?? false,
    readingTime: row.readingTime ?? undefined,
  }
}

export async function getRecentPosts(limit = 3): Promise<Post[]> {
  const rows = await db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt))
    .limit(limit)
  return rows.map(toPost)
}

export async function getAllPublishedPosts(): Promise<Post[]> {
  const rows = await db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt))
  return rows.map(toPost)
}

export async function getPostBySlug(
  slug: string,
): Promise<{ post: Post; content: string } | null> {
  const [row] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1)
  if (!row || !row.published) return null
  return { post: toPost(row), content: row.content }
}
