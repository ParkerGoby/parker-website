import type { Project } from '@/types'

export const projects: Project[] = [
  {
    title: 'Monitower',
    description:
      'Lightweight observability demo that simulates an e-commerce microservice environment with built-in fault injection. Trigger realistic failure scenarios and watch issues propagate in real time — no cloud infrastructure required.',
    tech: ['Go', 'Next.js', 'TypeScript', 'Tailwind CSS', 'SQLite', 'Recharts'],
    github: 'https://github.com/ParkerGoby/Monitower',
  },
  {
    title: 'Parker Portfolio',
    description: 'Personal portfolio and blog built with Next.js, TypeScript, and Tailwind CSS.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'MDX'],
    github: 'https://github.com/ParkerGoby/parker-website',
  },
]
