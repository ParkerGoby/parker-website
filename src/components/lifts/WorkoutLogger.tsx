'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import ExerciseSelector from './ExerciseSelector'
import type { Exercise } from '@/db/schema'

type SetInput = { weight: string; reps: string; isDropSet: boolean }
type ExerciseRow = { exerciseId: number; name: string; sets: SetInput[] }

const defaultSet = (): SetInput => ({ weight: '', reps: '', isDropSet: false })

interface Props {
  exercises: Exercise[]
  today: string
}

export default function WorkoutLogger({ exercises, today }: Props) {
  const router = useRouter()
  const [date, setDate] = useState(today)
  const [rows, setRows] = useState<ExerciseRow[]>([])
  const [allExercises, setAllExercises] = useState(exercises)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addExercise = (ex: Exercise) => {
    setRows((prev) => [...prev, { exerciseId: ex.id, name: ex.name, sets: [defaultSet()] }])
  }

  const removeExercise = (idx: number) => {
    setRows((prev) => prev.filter((_, i) => i !== idx))
  }

  const addSet = (exIdx: number) => {
    setRows((prev) =>
      prev.map((row, i) => (i === exIdx ? { ...row, sets: [...row.sets, defaultSet()] } : row)),
    )
  }

  const removeSet = (exIdx: number, setIdx: number) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === exIdx ? { ...row, sets: row.sets.filter((_, si) => si !== setIdx) } : row,
      ),
    )
  }

  const updateSet = (exIdx: number, setIdx: number, update: Partial<SetInput>) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === exIdx
          ? { ...row, sets: row.sets.map((s, si) => (si === setIdx ? { ...s, ...update } : s)) }
          : row,
      ),
    )
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError(null)
    try {
      const exercises = rows
        .map((r) => ({
          exerciseId: r.exerciseId,
          sets: r.sets
            .filter((s) => s.weight !== '' && s.reps !== '')
            .map((s) => ({ weight: Number(s.weight), reps: Number(s.reps), isDropSet: s.isDropSet })),
        }))
        .filter((e) => e.sets.length > 0)

      if (exercises.length === 0) {
        setError('Add at least one set before saving.')
        setSaving(false)
        return
      }

      const res = await fetch('/api/lifts/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, exercises }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Failed to save workout')
      }
      setRows([])
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4 rounded-md border border-neutral-800/60 bg-background p-4">
      <h2 className="text-sm font-semibold text-neutral-200">Log Workout</h2>

      <div>
        <label className="mb-1 block text-xs text-neutral-500">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 outline-none focus:border-cyan-700"
        />
      </div>

      {rows.length > 0 && (
        <div className="space-y-5">
          {rows.map((row, exIdx) => (
            <div key={exIdx} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-200">{row.name}</span>
                <button
                  type="button"
                  onClick={() => removeExercise(exIdx)}
                  className="text-neutral-600 transition-colors hover:text-red-400"
                  aria-label={`Remove ${row.name}`}
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-2">
                {row.sets.map((set, setIdx) => (
                  <div key={setIdx} className="flex items-center gap-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={set.weight}
                      onChange={(e) => updateSet(exIdx, setIdx, { weight: e.target.value })}
                      placeholder="lbs"
                      className="w-20 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-sm text-neutral-200 outline-none focus:border-cyan-700"
                    />
                    <input
                      type="number"
                      inputMode="numeric"
                      value={set.reps}
                      onChange={(e) => updateSet(exIdx, setIdx, { reps: e.target.value })}
                      placeholder="reps"
                      className="w-20 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-sm text-neutral-200 outline-none focus:border-cyan-700"
                    />
                    <button
                      type="button"
                      onClick={() => updateSet(exIdx, setIdx, { isDropSet: !set.isDropSet })}
                      className={`rounded-md border px-2.5 py-2.5 text-xs font-medium transition-colors ${
                        set.isDropSet
                          ? 'border-cyan-700 bg-cyan-950 text-cyan-400'
                          : 'border-neutral-700 bg-neutral-800 text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      drop
                    </button>
                    {row.sets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSet(exIdx, setIdx)}
                        className="text-neutral-600 transition-colors hover:text-red-400"
                        aria-label="Remove set"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addSet(exIdx)}
                className="text-xs text-neutral-500 transition-colors hover:text-cyan-400"
              >
                + Add Set
              </button>
            </div>
          ))}
        </div>
      )}

      <ExerciseSelector
        exercises={allExercises}
        onSelect={addExercise}
        onExerciseCreated={(ex) => setAllExercises((prev) => [...prev, ex])}
      />

      {error && <p className="text-sm text-red-400">{error}</p>}
      {success && <p className="text-sm text-green-400">Workout saved!</p>}

      {rows.length > 0 && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="w-full rounded-md bg-cyan-900 px-4 py-3 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-800 disabled:opacity-40"
        >
          {saving ? 'Saving...' : 'Save Workout'}
        </button>
      )}
    </div>
  )
}
