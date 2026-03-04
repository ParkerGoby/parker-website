import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <p className="text-sm text-neutral-500">
          &copy; {new Date().getFullYear()} Parker G
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/ParkerGoby"
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <Github size={18} />
          </Link>
          <Link
            href="https://www.linkedin.com/in/parker-goby-b0336a25b/"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <Linkedin size={18} />
          </Link>
          <Link
            href="mailto:parkergoby1@gmail.com"
            aria-label="Email"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <Mail size={18} />
          </Link>
        </div>
      </div>
    </footer>
  )
}
