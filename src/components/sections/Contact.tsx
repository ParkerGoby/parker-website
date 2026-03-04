import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'

export default function Contact() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-2xl font-bold tracking-tight">Get in Touch</h2>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400">
          I&apos;m always open to new opportunities and conversations. Reach out through any of the
          channels below.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href="mailto:parker@example.com"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
          >
            <Mail size={16} />
            parker@example.com
          </Link>
          <Link
            href="https://github.com/parkerg"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
          >
            <Github size={16} />
            github.com/parkerg
          </Link>
          <Link
            href="https://linkedin.com/in/parkerg"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
          >
            <Linkedin size={16} />
            linkedin.com/in/parkerg
          </Link>
        </div>
      </div>
    </section>
  )
}
