import Link from 'next/link'
import type { Post } from '@/types'

type BlogCardProps = Pick<Post, 'title' | 'date' | 'excerpt' | 'slug' | 'readingTime' | 'tags'>

export default function BlogCard({ title, date, excerpt, slug, readingTime, tags }: BlogCardProps) {
  const formatted = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article>
      <Link href={`/blog/${slug}`} className="group block">
        <h3 className="font-semibold transition-colors group-hover:text-cyan-400">{title}</h3>
        <p className="mt-1 text-sm text-neutral-500">
          {formatted}
          {readingTime && <span> · {readingTime}</span>}
        </p>
        <p className="mt-2 text-sm text-neutral-500">{excerpt}</p>
      </Link>
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-teal-800/50 bg-teal-950 px-2.5 py-0.5 text-xs font-medium text-teal-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
