'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export default function PrivacyDisclaimer() {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('lifts-privacy-dismissed') === '1'
  })

  if (dismissed) return null

  return (
    <div className="relative rounded-md border border-cyan-800/50 bg-cyan-950/20 px-4 py-3 text-sm text-neutral-400">
      <button
        onClick={() => {
          localStorage.setItem('lifts-privacy-dismissed', '1')
          setDismissed(true)
        }}
        className="absolute right-2 top-2 text-neutral-600 transition-colors hover:text-neutral-300"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
      <p className="pr-6">
        Your data is private — only you can see it. Full disclosure: as the site admin, I have
        database access and could theoretically view any data, but I have no interest in doing so.
      </p>
    </div>
  )
}
