import type { Metadata } from 'next'
import ProjectCard from '@/components/sections/ProjectCard'
import { projects } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Things I have built.',
}

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
      <p className="mt-3 text-neutral-600 dark:text-neutral-400">Things I have built.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </div>
  )
}
