import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/auth'
import { getCurrentRole } from '@/lib/auth-utils'
import { getAdminUserId } from '@/lib/lifts-auth'
import { getWorkoutsForUser, getExercisesForUser, getTodayBodyweight } from '@/lib/db-lifts'
import DataViewSwitcher from '@/components/lifts/DataViewSwitcher'
import PrivacyDisclaimer from '@/components/lifts/PrivacyDisclaimer'
import BodyweightLogger from '@/components/lifts/BodyweightLogger'
import WorkoutLogger from '@/components/lifts/WorkoutLogger'
import WorkoutCard from '@/components/lifts/WorkoutCard'

export const metadata: Metadata = {
  title: 'Lifts',
  description: 'Workout tracker and progress log.',
}

export default async function LiftsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>
}) {
  const params = await searchParams
  const [role, session] = await Promise.all([getCurrentRole(), auth()])
  const isAdmin = role === 'admin'
  const isAuthenticated = role !== 'guest'
  const userId = session?.user?.id

  const adminId = await getAdminUserId()

  let viewedUserId: string
  let isViewingAdmin: boolean

  if (!isAuthenticated) {
    viewedUserId = adminId
    isViewingAdmin = true
  } else if (isAdmin) {
    viewedUserId = userId!
    isViewingAdmin = false
  } else {
    isViewingAdmin = params.view === 'admin'
    viewedUserId = isViewingAdmin ? adminId : userId!
  }

  const canWrite = isAuthenticated && viewedUserId === userId
  const showSwitcher = isAuthenticated && !isAdmin
  const showDisclaimer = isAuthenticated && !isAdmin && !isViewingAdmin

  const today = new Date().toISOString().split('T')[0]

  const [recentWorkouts, todayBW, userExercises] = await Promise.all([
    getWorkoutsForUser(viewedUserId, 5, 0),
    canWrite ? getTodayBodyweight(userId!, today) : null,
    canWrite ? getExercisesForUser(userId!) : [],
  ])

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Lifts</h1>
        {isAuthenticated && (
          <Link
            href="/lifts/exercises"
            className="text-sm text-neutral-500 transition-colors hover:text-cyan-400"
          >
            Manage exercises
          </Link>
        )}
      </div>

      {showSwitcher && (
        <DataViewSwitcher currentView={isViewingAdmin ? 'admin' : 'self'} />
      )}

      {showDisclaimer && <PrivacyDisclaimer />}

      {canWrite && (
        <>
          <div className="rounded-md border border-neutral-800/60 bg-background p-4">
            <BodyweightLogger todayEntry={todayBW ? todayBW.weight / 10 : null} today={today} />
          </div>
          <WorkoutLogger exercises={userExercises} today={today} />
        </>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Workouts</h2>
          <Link href="/lifts/history" className="text-sm text-neutral-500 transition-colors hover:text-cyan-400">
            View all
          </Link>
        </div>
        {recentWorkouts.length === 0 ? (
          <p className="text-sm text-neutral-500">No workouts logged yet.</p>
        ) : (
          <div className="space-y-3">
            {recentWorkouts.map((w) => (
              <WorkoutCard key={w.id} workout={w} readOnly={!canWrite} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
