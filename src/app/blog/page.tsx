import type { Metadata } from 'next'
import Link from 'next/link'
import BlogCard from '@/components/sections/BlogCard'
import { getAllPublishedPosts } from '@/lib/db-blog'
import { getCurrentRole } from '@/lib/auth-utils'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Writing about software engineering and things I learn.',
}

export default async function BlogPage() {
  const [posts, role] = await Promise.all([getAllPublishedPosts(), getCurrentRole()])
  const isAdmin = role === 'admin'

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        {isAdmin && (
          <Link
            href="/blog/new"
            className="inline-flex items-center gap-1.5 rounded-md border border-cyan-500/70 bg-neutral-800 px-4 py-2 text-sm text-white transition-colors hover:border-cyan-400 hover:bg-cyan-950 hover:text-cyan-300"
          >
            + Add Blog
          </Link>
        )}
      </div>
      <p className="mt-3 text-neutral-600 dark:text-neutral-400">
        Writing about software engineering and things I learn.
      </p>
      {posts.length === 0 ? (
        <p className="mt-10 text-neutral-500">No posts published yet.</p>
      ) : (
        <div className="mt-10 flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800">
          {posts.map((post) => (
            <div key={post.slug} className="py-6 first:pt-0 last:pb-0">
              <BlogCard {...post} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
