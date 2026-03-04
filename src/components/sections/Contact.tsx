import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'

export default function Contact() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-2xl font-bold tracking-tight">Get in Touch</h2>
        <div className="mt-1 h-0.5 w-8 bg-gradient-to-r from-cyan-400 to-teal-400" />
        <p className="mt-3 text-neutral-500">
          I&apos;m always open to new opportunities and conversations. Reach out through any of the
          channels below.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href="mailto:parkergoby1@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition-colors hover:text-cyan-400"
          >
            <Mail size={16} />
            parkergoby1@gmail.com
          </Link>
          <Link
            href="https://github.com/ParkerGoby"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition-colors hover:text-cyan-400"
          >
            <Github size={16} />
            github.com/ParkerGoby
          </Link>
          <Link
            href="https://www.linkedin.com/in/parker-goby-b0336a25b/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition-colors hover:text-cyan-400"
          >
            <Linkedin size={16} />
            linkedin.com/in/parker-goby-b0336a25b
          </Link>
        </div>
      </div>
    </section>
  )
}
