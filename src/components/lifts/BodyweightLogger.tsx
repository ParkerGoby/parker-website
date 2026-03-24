'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  todayEntry: number | null
  today: string
}

export default function BodyweightLogger({ todayEntry, today }: Props) {
  const router = useRouter()
  const [weight, setWeight] = useState(todayEntry !== null ? String(todayEntry) : '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const w = parseFloat(weight)
    if (isNaN(w) || w <= 0) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/lifts/bodyweight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: today, weight: w }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Failed to log weight')
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
      <label className="shrink-0 text-sm text-neutral-400">Today&apos;s bodyweight</label>
      <input
        type="number"
        inputMode="decimal"
        step="0.1"
        min="0"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder="lbs"
        className="w-24 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 outline-none focus:border-cyan-700"
      />
      <button
        type="submit"
        disabled={saving || !weight}
        className="rounded-md border border-cyan-700/50 bg-cyan-950 px-3 py-2 text-sm text-cyan-300 transition-colors hover:bg-cyan-900 disabled:opacity-40"
      >
        {saving ? 'Saving...' : saved ? 'Saved!' : todayEntry !== null ? 'Update' : 'Log'}
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </form>
  )
}
