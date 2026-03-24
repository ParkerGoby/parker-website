'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import type { WorkoutWithSets, SetRow } from '@/lib/db-lifts'

function groupByExercise(sets: SetRow[]) {
  const order: number[] = []
  const map = new Map<number, { name: string; rows: SetRow[] }>()
  for (const s of sets) {
    if (!map.has(s.exerciseId)) {
      order.push(s.exerciseId)
      map.set(s.exerciseId, { name: s.exerciseName, rows: [] })
    }
    map.get(s.exerciseId)!.rows.push(s)
  }
  return order.map((id) => {
    const e = map.get(id)!
    return { name: e.name, sets: e.rows.slice().sort((a, b) => a.setOrder - b.setOrder) }
  })
}

function formatSet(s: SetRow) {
  return `${s.isDropSet ? 'd' : ''}${s.weight}x${s.reps}`
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

interface Props {
  workout: WorkoutWithSets
  readOnly: boolean
  onDeleted?: (id: number) => void
}

export default function WorkoutCard({ workout, readOnly, onDeleted }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const exercises = groupByExercise(workout.sets)

  const handleDelete = async () => {
    if (!confirm('Delete this workout?')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/lifts/workouts/${workout.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      if (onDeleted) {
        onDeleted(workout.id)
      } else {
        router.refresh()
      }
    } catch {
      setDeleting(false)
    }
  }

  return (
    <div className="rounded-md border border-neutral-800/60 bg-background p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-neutral-300">{formatDate(workout.date)}</p>
          {exercises.length === 0 ? (
            <p className="mt-1 text-xs text-neutral-600">No sets recorded.</p>
          ) : (
            <div className="mt-1.5 space-y-0.5">
              {exercises.map((ex) => (
                <p key={ex.name} className="text-sm text-neutral-400">
                  <span className="font-medium text-neutral-300">{ex.name}:</span>{' '}
                  {ex.sets.map(formatSet).join(', ')}
                </p>
              ))}
            </div>
          )}
          {workout.notes && (
            <p className="mt-2 text-xs italic text-neutral-600">{workout.notes}</p>
          )}
        </div>
        {!readOnly && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="shrink-0 text-neutral-700 transition-colors hover:text-red-400 disabled:opacity-40"
            aria-label="Delete workout"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  )
}
