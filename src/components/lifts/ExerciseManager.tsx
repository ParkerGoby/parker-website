'use client'

import { useState } from 'react'
import type { Exercise } from '@/db/schema'

const MUSCLE_GROUPS = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
  'quads', 'hamstrings', 'glutes', 'calves', 'abductors', 'adductors',
  'core', 'full_body',
] as const

function formatMuscleGroup(g: string) {
  return g.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function groupExercises(exercises: Exercise[]) {
  const groups = new Map<string, Exercise[]>()
  for (const ex of exercises) {
    const arr = groups.get(ex.muscleGroup) ?? []
    arr.push(ex)
    groups.set(ex.muscleGroup, arr)
  }
  return groups
}

interface Props {
  exercises: Exercise[]
}

export default function ExerciseManager({ exercises: initial }: Props) {
  const [exercises, setExercises] = useState(initial)
  const [name, setName] = useState('')
  const [muscleGroup, setMuscleGroup] = useState<string>('chest')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/lifts/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), muscleGroup }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Failed to create exercise')
      }
      const ex: Exercise = await res.json()
      setExercises((prev) =>
        [...prev, ex].sort((a, b) => {
          const g = a.muscleGroup.localeCompare(b.muscleGroup)
          return g !== 0 ? g : a.name.localeCompare(b.name)
        }),
      )
      setName('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setSaving(false)
    }
  }

  const grouped = groupExercises(exercises)

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleAdd}
        className="space-y-3 rounded-md border border-neutral-800/60 bg-background p-4"
      >
        <h2 className="text-sm font-semibold text-neutral-200">Add Exercise</h2>
        <div className="flex flex-wrap gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Exercise name"
            className="min-w-0 flex-1 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-600 outline-none focus:border-cyan-700"
          />
          <select
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
            className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 outline-none focus:border-cyan-700"
          >
            {MUSCLE_GROUPS.map((g) => (
              <option key={g} value={g}>
                {formatMuscleGroup(g)}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="rounded-md bg-cyan-900 px-4 py-2 text-sm font-medium text-cyan-300 transition-colors hover:bg-cyan-800 disabled:opacity-40"
          >
            {saving ? 'Adding...' : 'Add'}
          </button>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </form>

      {exercises.length === 0 ? (
        <p className="text-sm text-neutral-500">No exercises yet. Add one above.</p>
      ) : (
        <div className="space-y-5">
          {Array.from(grouped.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([group, exs]) => (
              <div key={group}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {formatMuscleGroup(group)}
                </h3>
                <div className="space-y-1">
                  {exs.map((ex) => (
                    <div
                      key={ex.id}
                      className="flex items-center rounded-md border border-neutral-800/60 bg-background px-3 py-2"
                    >
                      <span className="text-sm text-neutral-300">{ex.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
