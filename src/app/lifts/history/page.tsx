import type { Metadata } from 'next'
import { auth } from '@/auth'
import { getCurrentRole } from '@/lib/auth-utils'
import { getAdminUserId } from '@/lib/lifts-auth'
import { getWorkoutsForUser } from '@/lib/db-lifts'
import DataViewSwitcher from '@/components/lifts/DataViewSwitcher'
import WorkoutList from '@/components/lifts/WorkoutList'

export const metadata: Metadata = {
  title: 'Workout History',
  description: 'Full workout history.',
}

const PAGE_SIZE = 20

export default async function HistoryPage({
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

  // Fetch one extra to determine if there are more pages
  const workouts = await getWorkoutsForUser(viewedUserId, PAGE_SIZE + 1, 0)
  const hasMore = workouts.length > PAGE_SIZE
  const pageWorkouts = workouts.slice(0, PAGE_SIZE)

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Workout History</h1>

      {showSwitcher && (
        <DataViewSwitcher currentView={isViewingAdmin ? 'admin' : 'self'} />
      )}

      <WorkoutList
        initialWorkouts={pageWorkouts}
        hasMoreInitial={hasMore}
        viewedUserId={viewedUserId}
        canWrite={canWrite}
      />
    </div>
  )
}
