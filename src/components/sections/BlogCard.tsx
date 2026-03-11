import Link from 'next/link'
import type { Post } from '@/types'
import GlowCard from '@/components/ui/GlowCard'
import { TagList } from '@/components/Tag'
import { formatDate } from '@/lib/utils'

type BlogCardProps = Pick<Post, 'title' | 'date' | 'excerpt' | 'slug' | 'readingTime' | 'tags'>

export default function BlogCard({ title, date, excerpt, slug, readingTime, tags }: BlogCardProps) {
  const formatted = formatDate(date)

  return (
    <GlowCard className="group">
      <Link href={`/blog/${slug}`} className="block">
        <h3 className="font-semibold transition-colors group-hover:text-cyan-400">{title}</h3>
        <p className="mt-1 text-sm text-neutral-500">
          {formatted}
          {readingTime && <span> · {readingTime}</span>}
        </p>
        <p className="mt-2 text-sm text-neutral-500">{excerpt}</p>
      </Link>
      <TagList tags={tags} className="mt-3" />
    </GlowCard>
  )
}
