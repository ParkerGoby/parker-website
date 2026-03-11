import Link from 'next/link'
import { Github, ExternalLink } from 'lucide-react'
import type { Project } from '@/types'
import GlowCard from '@/components/ui/GlowCard'
import { TagList } from '@/components/Tag'

export default function ProjectCard({ title, description, tech, url, github }: Project) {
  return (
    <GlowCard className="group">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-semibold transition-colors group-hover:text-cyan-400">{title}</h3>
        <div className="flex shrink-0 items-center gap-3">
          {github && (
            <Link
              href={github}
              aria-label={`${title} on GitHub`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 transition-colors hover:text-cyan-400"
            >
              <Github size={16} />
            </Link>
          )}
          {url && (
            <Link
              href={url}
              aria-label={`${title} live site`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 transition-colors hover:text-cyan-400"
            >
              <ExternalLink size={16} />
            </Link>
          )}
        </div>
      </div>
      <p className="mt-2 text-sm text-neutral-500">{description}</p>
      <TagList tags={tech} className="mt-4" />
    </GlowCard>
  )
}
