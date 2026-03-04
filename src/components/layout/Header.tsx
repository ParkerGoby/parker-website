import Link from 'next/link'
import Navigation from './Navigation'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight hover:opacity-80">
          Parker G
        </Link>
        <Navigation />
      </div>
    </header>
  )
}
