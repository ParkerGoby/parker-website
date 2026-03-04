import Link from 'next/link'
import { Github, ExternalLink } from 'lucide-react'
import type { Project } from '@/types'

export default function ProjectCard({ title, description, tech, url, github }: Project) {
  return (
    <article className="rounded-lg border border-neutral-200 p-6 transition-shadow hover:shadow-md dark:border-neutral-800">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex shrink-0 items-center gap-3">
          {github && (
            <Link
              href={github}
              aria-label={`${title} on GitHub`}
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              <Github size={16} />
            </Link>
          )}
          {url && (
            <Link
              href={url}
              aria-label={`${title} live site`}
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              <ExternalLink size={16} />
            </Link>
          )}
        </div>
      </div>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tech.map((t) => (
          <span
            key={t}
            className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium dark:bg-neutral-800"
          >
            {t}
          </span>
        ))}
      </div>
    </article>
  )
}
