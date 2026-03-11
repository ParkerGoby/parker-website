import Link from 'next/link'
import SectionHeader from '@/components/SectionHeader'
import { SOCIAL_LINKS } from '@/lib/constants'

export default function Contact() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeader title="Get in Touch" />
        <p className="mt-3 text-neutral-500">
          I&apos;m always open to new opportunities and conversations. Reach out through any of the
          channels below.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
          {SOCIAL_LINKS.map(({ href, displayText, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition-colors hover:text-cyan-400"
            >
              <Icon size={16} />
              {displayText}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
