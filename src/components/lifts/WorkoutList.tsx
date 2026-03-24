'use client'

import { useState } from 'react'
import WorkoutCard from './WorkoutCard'
import type { WorkoutWithSets } from '@/lib/db-lifts'

interface Props {
  initialWorkouts: WorkoutWithSets[]
  hasMoreInitial: boolean
  viewedUserId: string
  canWrite: boolean
}

export default function WorkoutList({ initialWorkouts, hasMoreInitial, viewedUserId, canWrite }: Props) {
  const [workouts, setWorkouts] = useState(initialWorkouts)
  const [hasMore, setHasMore] = useState(hasMoreInitial)
  const [loading, setLoading] = useState(false)

  const loadMore = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        userId: viewedUserId,
        limit: '21',
        offset: String(workouts.length),
      })
      const res = await fetch(`/api/lifts/workouts?${params}`)
      const data: WorkoutWithSets[] = await res.json()
      setHasMore(data.length > 20)
      setWorkouts((prev) => [...prev, ...data.slice(0, 20)])
    } finally {
      setLoading(false)
    }
  }

  if (workouts.length === 0) {
    return <p className="text-sm text-neutral-500">No workouts logged yet.</p>
  }

  return (
    <div className="space-y-3">
      {workouts.map((w) => (
        <WorkoutCard
          key={w.id}
          workout={w}
          readOnly={!canWrite}
          onDeleted={(id) => setWorkouts((prev) => prev.filter((w) => w.id !== id))}
        />
      ))}
      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="w-full rounded-md border border-neutral-700 py-2.5 text-sm text-neutral-400 transition-colors hover:border-neutral-600 hover:text-neutral-200 disabled:opacity-40"
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  )
}
