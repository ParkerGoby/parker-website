import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'

export default function Hero() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Hi, I&apos;m Parker.
        </h1>
        <p className="mt-4 text-xl text-neutral-600 dark:text-neutral-400">
          Software Engineer building things on the web.
        </p>
        <p className="mt-4 max-w-xl text-neutral-600 dark:text-neutral-400">
          I enjoy working with TypeScript, React, and modern web tooling. I write about what I learn
          and build along the way.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link
            href="https://github.com/parkerg"
            aria-label="GitHub"
            className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            <Github size={16} />
            GitHub
          </Link>
          <Link
            href="https://linkedin.com/in/parkerg"
            aria-label="LinkedIn"
            className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            <Linkedin size={16} />
            LinkedIn
          </Link>
          <Link
            href="mailto:parker@example.com"
            aria-label="Email"
            className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            <Mail size={16} />
            Email
          </Link>
        </div>
      </div>
    </section>
  )
}
