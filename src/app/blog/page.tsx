import type { Metadata } from 'next'
import BlogCard from '@/components/sections/BlogCard'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Writing about software engineering and things I learn.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
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
