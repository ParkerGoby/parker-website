import Link from 'next/link'
import { SOCIAL_LINKS } from '@/lib/constants'

export default function Hero() {
  return (
    <section className="relative py-20 sm:py-28">
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[400px] w-[600px] rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Hi, I&apos;m{' '}
          <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Parker.
          </span>
        </h1>
        <p className="mt-4 text-xl text-neutral-300">
          Software Engineer | Pursuing an MBA
        </p>
        <p className="mt-4 max-w-xl text-neutral-500">
          I build web apps with TypeScript and React, and microservices in the cloud with Python. I write about
          software, disc golf, fitness, and everything I&apos;m learning along the way.
        </p>
        <div className="mt-8 flex items-center gap-4">
          {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-cyan-500/40 px-4 py-2 text-sm transition-colors hover:bg-cyan-950 hover:border-cyan-400 hover:text-cyan-300"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
