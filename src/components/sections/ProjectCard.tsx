import Link from 'next/link'
import { Github, ExternalLink } from 'lucide-react'
import type { Project } from '@/types'

export default function ProjectCard({ title, description, tech, url, github }: Project) {
  return (
    <article className="rounded-lg border border-cyan-800/30 p-6 transition-all hover:border-cyan-500/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-semibold">{title}</h3>
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
      <div className="mt-4 flex flex-wrap gap-2">
        {tech.map((t) => (
          <span
            key={t}
            className="rounded-full border border-cyan-800/50 bg-cyan-950 px-2.5 py-0.5 text-xs font-medium text-cyan-300"
          >
            {t}
          </span>
        ))}
      </div>
    </article>
  )
}
