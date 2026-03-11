import Link from 'next/link'
import { SOCIAL_LINKS } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <p className="text-sm text-neutral-500">
          &copy; {new Date().getFullYear()} Parker G
        </p>
        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              <Icon size={18} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
