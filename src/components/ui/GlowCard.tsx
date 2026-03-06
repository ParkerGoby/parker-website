import type { ReactNode } from 'react'

export default function GlowCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <article
      className={`h-full rounded-lg border border-cyan-800/30 p-6 transition-all hover:border-cyan-500/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] ${className ?? ''}`}
    >
      {children}
    </article>
  )
}
