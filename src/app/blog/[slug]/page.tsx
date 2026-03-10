import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getPostBySlug } from '@/lib/db-blog'
import { getCurrentRole } from '@/lib/auth-utils'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const result = await getPostBySlug(slug)
  if (!result) return {}
  return {
    title: result.post.title,
    description: result.post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const [result, role] = await Promise.all([getPostBySlug(slug), getCurrentRole()])

  if (!result) notFound()

  const { post, content } = result
  const formatted = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      <header className="mb-10">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
          {role === 'admin' && (
            <Link
              href={`/blog/${slug}/edit`}
              className="shrink-0 rounded-md border border-neutral-700 px-3 py-1 text-sm text-neutral-400 hover:border-cyan-500 hover:text-cyan-400 transition-colors"
            >
              Edit Blog
            </Link>
          )}
        </div>
        <p className="mt-3 text-sm text-neutral-500">
          {formatted}
          {post.readingTime && <span> · {post.readingTime}</span>}
        </p>
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium dark:bg-neutral-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </article>
  )
}
