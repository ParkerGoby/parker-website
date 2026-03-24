import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { getCurrentRole } from '@/lib/auth-utils'
import { getExercisesForUser } from '@/lib/db-lifts'
import ExerciseManager from '@/components/lifts/ExerciseManager'

export const metadata: Metadata = {
  title: 'My Exercises',
  description: 'Manage your exercise library.',
}

export default async function ExercisesPage() {
  const role = await getCurrentRole()
  if (role === 'guest') {
    redirect('/lifts')
  }

  const session = await auth()
  const userId = session!.user!.id!
  const exercises = await getExercisesForUser(userId)

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">My Exercises</h1>
      <ExerciseManager exercises={exercises} />
    </div>
  )
}
