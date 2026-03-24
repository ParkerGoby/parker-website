'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Plus } from 'lucide-react'
import type { Exercise } from '@/db/schema'

const MUSCLE_GROUPS = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
  'quads', 'hamstrings', 'glutes', 'calves', 'abductors', 'adductors',
  'core', 'full_body',
] as const

function formatMuscleGroup(g: string) {
  return g.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

interface Props {
  exercises: Exercise[]
  onSelect: (exercise: Exercise) => void
  onExerciseCreated?: (exercise: Exercise) => void
}

export default function ExerciseSelector({ exercises: initialExercises, onSelect, onExerciseCreated }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newGroup, setNewGroup] = useState<string>('chest')
  const [saving, setSaving] = useState(false)
  const [exercises, setExercises] = useState(initialExercises)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch('')
        setIsCreating(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen])

  const filtered = exercises.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()),
  )

  const handleCreate = async () => {
    if (!newName.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/lifts/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), muscleGroup: newGroup }),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error ?? 'Failed to create exercise')
        return
      }
      const exercise: Exercise = await res.json()
      setExercises((prev) => [...prev, exercise])
      onExerciseCreated?.(exercise)
      onSelect(exercise)
      setIsOpen(false)
      setIsCreating(false)
      setNewName('')
      setNewGroup('chest')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-300 transition-colors hover:border-cyan-700 hover:text-cyan-300"
      >
        <Plus size={14} />
        Add Exercise
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-md border border-neutral-700 bg-neutral-900 shadow-lg">
          {!isCreating ? (
            <>
              <div className="border-b border-neutral-800 p-2">
                <div className="flex items-center gap-2 rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1.5">
                  <Search size={14} className="shrink-0 text-neutral-500" />
                  <input
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search exercises..."
                    className="w-full bg-transparent text-sm text-neutral-200 placeholder-neutral-600 outline-none"
                  />
                </div>
              </div>
              <div className="max-h-56 overflow-y-auto">
                {filtered.length === 0 && (
                  <p className="p-3 text-xs text-neutral-500">No exercises found.</p>
                )}
                {filtered.map((ex) => (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => {
                      onSelect(ex)
                      setIsOpen(false)
                      setSearch('')
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-800"
                  >
                    <span className="flex-1">{ex.name}</span>
                    <span className="text-xs text-neutral-600">{formatMuscleGroup(ex.muscleGroup)}</span>
                  </button>
                ))}
              </div>
              <div className="border-t border-neutral-800 p-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(true)}
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-cyan-400 transition-colors hover:bg-cyan-950/30"
                >
                  <Plus size={14} />
                  Create New Exercise
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 p-3">
              <p className="text-xs font-medium text-neutral-400">New Exercise</p>
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="Exercise name"
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-600 outline-none focus:border-cyan-700"
              />
              <select
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 outline-none focus:border-cyan-700"
              >
                {MUSCLE_GROUPS.map((g) => (
                  <option key={g} value={g}>
                    {formatMuscleGroup(g)}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={saving || !newName.trim()}
                  className="flex-1 rounded-md bg-cyan-900 px-3 py-1.5 text-sm font-medium text-cyan-300 transition-colors hover:bg-cyan-800 disabled:opacity-40"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false)
                    setNewName('')
                    setNewGroup('chest')
                  }}
                  className="rounded-md border border-neutral-700 px-3 py-1.5 text-sm text-neutral-400 transition-colors hover:text-neutral-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
