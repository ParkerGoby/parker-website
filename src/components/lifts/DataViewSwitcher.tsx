'use client'

import { useRouter, usePathname } from 'next/navigation'

interface Props {
  currentView: 'admin' | 'self'
}

export default function DataViewSwitcher({ currentView }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const switchTo = (view: 'admin' | 'self') => {
    if (view === 'admin') {
      router.push(`${pathname}?view=admin`)
    } else {
      router.push(pathname)
    }
  }

  return (
    <div className="flex rounded-md border border-neutral-800 bg-neutral-900 p-1">
      <button
        onClick={() => switchTo('self')}
        className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
          currentView === 'self'
            ? 'bg-cyan-950 text-cyan-400'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        My Progress
      </button>
      <button
        onClick={() => switchTo('admin')}
        className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
          currentView === 'admin'
            ? 'bg-cyan-950 text-cyan-400'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        Parker&apos;s Progress
      </button>
    </div>
  )
}
