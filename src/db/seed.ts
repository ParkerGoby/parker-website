import { db } from './index'
import { posts, users, exercises, workouts, sets, bodyweight } from './schema'
import type { NewExercise } from './schema'
import { eq } from 'drizzle-orm'

const examplePost = {
  slug: 'hello-world',
  title: 'Hello World',
  date: '2026-03-06',
  excerpt: 'My first post — an introduction to this blog and what I plan to write about.',
  content: `# Hello World

Welcome to my blog! I'm Parker, and this is the first post on my personal site.

## What I'll Write About

I plan to cover a range of topics including:

- **Web development** — Next.js, TypeScript, and modern frontend patterns
- **Systems programming** — Rust, performance, and low-level topics
- **Projects** — deep dives into things I'm building

## Why a Blog?

Writing forces clarity. When you can't explain something simply, you probably don't understand it well enough yet. This blog is as much for me as it is for anyone who stumbles across it.

Stay tuned for more posts.
`,
  tags: ['meta', 'intro'],
  published: true,
  readingTime: '2 min read',
}

// Exercises to seed for the admin user
const SEED_EXERCISES: Omit<NewExercise, 'userId'>[] = [
  { name: 'Squat', muscleGroup: 'quads' },
  { name: 'Bench Press', muscleGroup: 'chest' },
  { name: 'Deadlift', muscleGroup: 'back' },
  { name: 'Overhead Press', muscleGroup: 'shoulders' },
  { name: 'Barbell Row', muscleGroup: 'back' },
  { name: 'Leg Press', muscleGroup: 'quads' },
  { name: 'Leg Extension', muscleGroup: 'quads' },
  { name: 'Leg Curl', muscleGroup: 'hamstrings' },
  { name: 'Hip Abductor', muscleGroup: 'abductors' },
  { name: 'Hip Adductor', muscleGroup: 'adductors' },
  { name: 'Hack Squat', muscleGroup: 'quads' },
  { name: 'Lat Pulldown', muscleGroup: 'back' },
  { name: 'Cable Row', muscleGroup: 'back' },
  { name: 'Bicep Curl', muscleGroup: 'biceps' },
  { name: 'Tricep Pushdown', muscleGroup: 'triceps' },
  { name: 'Lateral Raise', muscleGroup: 'shoulders' },
  { name: 'Face Pull', muscleGroup: 'shoulders' },
]

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

async function seedLifts(adminId: string) {
  // Insert exercises (idempotent via unique constraint)
  const insertedExercises = await db
    .insert(exercises)
    .values(SEED_EXERCISES.map((e) => ({ ...e, userId: adminId })))
    .onConflictDoNothing()
    .returning()

  // Build a name→id map (includes pre-existing exercises)
  const allExercises = await db
    .select({ id: exercises.id, name: exercises.name })
    .from(exercises)
    .where(eq(exercises.userId, adminId))

  const exId = (name: string) => allExercises.find((e) => e.name === name)?.id ?? 0

  console.log(`  Exercises: ${insertedExercises.length} inserted (${allExercises.length} total)`)

  // Only seed workouts if none exist yet for admin
  const existingWorkouts = await db
    .select({ id: workouts.id })
    .from(workouts)
    .where(eq(workouts.userId, adminId))
    .limit(1)

  if (existingWorkouts.length > 0) {
    console.log('  Workouts: already seeded, skipping')
  } else {
    // Seed ~12 workouts over the past 30 days
    type WorkoutSeed = {
      daysBack: number
      exercises: { name: string; sets: { weight: number; reps: number; isDropSet: boolean }[] }[]
    }

    const workoutSeeds: WorkoutSeed[] = [
      {
        daysBack: 28,
        exercises: [
          {
            name: 'Squat',
            sets: [
              { weight: 135, reps: 10, isDropSet: false },
              { weight: 135, reps: 8, isDropSet: false },
              { weight: 95, reps: 8, isDropSet: true },
            ],
          },
          {
            name: 'Leg Press',
            sets: [
              { weight: 180, reps: 12, isDropSet: false },
              { weight: 180, reps: 10, isDropSet: false },
            ],
          },
          { name: 'Leg Extension', sets: [{ weight: 80, reps: 12, isDropSet: false }, { weight: 80, reps: 10, isDropSet: false }] },
          { name: 'Leg Curl', sets: [{ weight: 70, reps: 12, isDropSet: false }, { weight: 70, reps: 10, isDropSet: false }] },
        ],
      },
      {
        daysBack: 26,
        exercises: [
          {
            name: 'Bench Press',
            sets: [
              { weight: 135, reps: 10, isDropSet: false },
              { weight: 135, reps: 8, isDropSet: false },
              { weight: 95, reps: 8, isDropSet: true },
            ],
          },
          { name: 'Overhead Press', sets: [{ weight: 85, reps: 8, isDropSet: false }, { weight: 85, reps: 7, isDropSet: false }] },
          { name: 'Lateral Raise', sets: [{ weight: 20, reps: 15, isDropSet: false }, { weight: 20, reps: 12, isDropSet: false }] },
          { name: 'Tricep Pushdown', sets: [{ weight: 50, reps: 12, isDropSet: false }, { weight: 50, reps: 10, isDropSet: false }] },
        ],
      },
      {
        daysBack: 24,
        exercises: [
          {
            name: 'Deadlift',
            sets: [
              { weight: 185, reps: 8, isDropSet: false },
              { weight: 185, reps: 6, isDropSet: false },
            ],
          },
          { name: 'Barbell Row', sets: [{ weight: 115, reps: 10, isDropSet: false }, { weight: 115, reps: 8, isDropSet: false }] },
          { name: 'Lat Pulldown', sets: [{ weight: 100, reps: 10, isDropSet: false }, { weight: 100, reps: 9, isDropSet: false }] },
          { name: 'Bicep Curl', sets: [{ weight: 35, reps: 12, isDropSet: false }, { weight: 35, reps: 10, isDropSet: false }] },
        ],
      },
      {
        daysBack: 21,
        exercises: [
          { name: 'Squat', sets: [{ weight: 145, reps: 10, isDropSet: false }, { weight: 145, reps: 8, isDropSet: false }, { weight: 100, reps: 8, isDropSet: true }] },
          { name: 'Hack Squat', sets: [{ weight: 135, reps: 10, isDropSet: false }, { weight: 135, reps: 8, isDropSet: false }] },
          { name: 'Hip Abductor', sets: [{ weight: 100, reps: 15, isDropSet: false }, { weight: 100, reps: 12, isDropSet: false }] },
          { name: 'Hip Adductor', sets: [{ weight: 100, reps: 15, isDropSet: false }, { weight: 100, reps: 12, isDropSet: false }] },
        ],
      },
      {
        daysBack: 19,
        exercises: [
          { name: 'Bench Press', sets: [{ weight: 140, reps: 10, isDropSet: false }, { weight: 140, reps: 8, isDropSet: false }, { weight: 100, reps: 8, isDropSet: true }] },
          { name: 'Face Pull', sets: [{ weight: 40, reps: 15, isDropSet: false }, { weight: 40, reps: 12, isDropSet: false }] },
          { name: 'Lateral Raise', sets: [{ weight: 22, reps: 12, isDropSet: false }, { weight: 22, reps: 10, isDropSet: false }] },
          { name: 'Tricep Pushdown', sets: [{ weight: 55, reps: 12, isDropSet: false }, { weight: 55, reps: 10, isDropSet: false }] },
        ],
      },
      {
        daysBack: 17,
        exercises: [
          { name: 'Deadlift', sets: [{ weight: 195, reps: 6, isDropSet: false }, { weight: 195, reps: 5, isDropSet: false }] },
          { name: 'Cable Row', sets: [{ weight: 110, reps: 10, isDropSet: false }, { weight: 110, reps: 9, isDropSet: false }] },
          { name: 'Lat Pulldown', sets: [{ weight: 105, reps: 10, isDropSet: false }, { weight: 105, reps: 8, isDropSet: false }] },
          { name: 'Bicep Curl', sets: [{ weight: 37, reps: 12, isDropSet: false }, { weight: 37, reps: 10, isDropSet: false }] },
        ],
      },
      {
        daysBack: 14,
        exercises: [
          { name: 'Squat', sets: [{ weight: 150, reps: 8, isDropSet: false }, { weight: 150, reps: 8, isDropSet: false }, { weight: 105, reps: 8, isDropSet: true }] },
          { name: 'Leg Press', sets: [{ weight: 200, reps: 12, isDropSet: false }, { weight: 200, reps: 10, isDropSet: false }] },
          { name: 'Leg Curl', sets: [{ weight: 75, reps: 12, isDropSet: false }, { weight: 75, reps: 10, isDropSet: false }] },
        ],
      },
      {
        daysBack: 12,
        exercises: [
          { name: 'Bench Press', sets: [{ weight: 145, reps: 10, isDropSet: false }, { weight: 145, reps: 8, isDropSet: false }, { weight: 105, reps: 7, isDropSet: true }] },
          { name: 'Overhead Press', sets: [{ weight: 90, reps: 8, isDropSet: false }, { weight: 90, reps: 7, isDropSet: false }] },
          { name: 'Face Pull', sets: [{ weight: 42, reps: 15, isDropSet: false }, { weight: 42, reps: 12, isDropSet: false }] },
          { name: 'Tricep Pushdown', sets: [{ weight: 57, reps: 12, isDropSet: false }, { weight: 57, reps: 10, isDropSet: false }] },
        ],
      },
      {
        daysBack: 10,
        exercises: [
          { name: 'Deadlift', sets: [{ weight: 205, reps: 5, isDropSet: false }, { weight: 205, reps: 5, isDropSet: false }] },
          { name: 'Barbell Row', sets: [{ weight: 120, reps: 10, isDropSet: false }, { weight: 120, reps: 8, isDropSet: false }] },
          { name: 'Cable Row', sets: [{ weight: 115, reps: 10, isDropSet: false }, { weight: 115, reps: 9, isDropSet: false }] },
          { name: 'Bicep Curl', sets: [{ weight: 40, reps: 12, isDropSet: false }, { weight: 40, reps: 10, isDropSet: false }] },
        ],
      },
      {
        daysBack: 7,
        exercises: [
          { name: 'Squat', sets: [{ weight: 155, reps: 8, isDropSet: false }, { weight: 155, reps: 7, isDropSet: false }, { weight: 110, reps: 8, isDropSet: true }] },
          { name: 'Hack Squat', sets: [{ weight: 145, reps: 10, isDropSet: false }, { weight: 145, reps: 8, isDropSet: false }] },
          { name: 'Hip Abductor', sets: [{ weight: 105, reps: 15, isDropSet: false }, { weight: 105, reps: 12, isDropSet: false }] },
          { name: 'Hip Adductor', sets: [{ weight: 105, reps: 15, isDropSet: false }, { weight: 105, reps: 12, isDropSet: false }] },
        ],
      },
      {
        daysBack: 5,
        exercises: [
          { name: 'Bench Press', sets: [{ weight: 150, reps: 8, isDropSet: false }, { weight: 150, reps: 7, isDropSet: false }, { weight: 110, reps: 7, isDropSet: true }] },
          { name: 'Overhead Press', sets: [{ weight: 92, reps: 8, isDropSet: false }, { weight: 92, reps: 7, isDropSet: false }] },
          { name: 'Lateral Raise', sets: [{ weight: 25, reps: 12, isDropSet: false }, { weight: 25, reps: 10, isDropSet: false }] },
          { name: 'Tricep Pushdown', sets: [{ weight: 60, reps: 12, isDropSet: false }, { weight: 60, reps: 10, isDropSet: false }] },
        ],
      },
      {
        daysBack: 3,
        exercises: [
          { name: 'Deadlift', sets: [{ weight: 210, reps: 5, isDropSet: false }, { weight: 210, reps: 4, isDropSet: false }] },
          { name: 'Lat Pulldown', sets: [{ weight: 110, reps: 10, isDropSet: false }, { weight: 110, reps: 8, isDropSet: false }] },
          { name: 'Cable Row', sets: [{ weight: 120, reps: 10, isDropSet: false }, { weight: 120, reps: 8, isDropSet: false }] },
          { name: 'Bicep Curl', sets: [{ weight: 42, reps: 12, isDropSet: false }, { weight: 42, reps: 10, isDropSet: false }] },
        ],
      },
    ]

    for (const ws of workoutSeeds) {
      const [workout] = await db
        .insert(workouts)
        .values({ userId: adminId, date: daysAgo(ws.daysBack) })
        .returning()

      for (const ex of ws.exercises) {
        const exerciseId = exId(ex.name)
        if (!exerciseId) continue
        for (let i = 0; i < ex.sets.length; i++) {
          await db.insert(sets).values({
            workoutId: workout.id,
            exerciseId,
            setOrder: i + 1,
            weight: ex.sets[i].weight,
            reps: ex.sets[i].reps,
            isDropSet: ex.sets[i].isDropSet,
          })
        }
      }
    }
    console.log(`  Workouts: ${workoutSeeds.length} seeded`)
  }

  // Seed bodyweight entries (idempotent via unique constraint)
  const bwEntries = Array.from({ length: 30 }, (_, i) => ({
    userId: adminId,
    date: daysAgo(30 - i),
    // Simulate gradual weight change: start ~1870 tenths (187 lbs), trend down slightly
    weight: Math.round(1870 - i * 0.5 + (Math.random() * 10 - 5)),
  }))

  const insertedBW = await db
    .insert(bodyweight)
    .values(bwEntries)
    .onConflictDoNothing()
    .returning()
  console.log(`  Bodyweight: ${insertedBW.length} entries inserted`)
}

async function seed() {
  console.log('Seeding database...')

  await db.insert(posts).values(examplePost).onConflictDoNothing()
  console.log('Blog post: seeded')

  // Seed lift data for admin user if they exist
  const [admin] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.role, 'admin'))
    .limit(1)

  if (!admin) {
    console.log('Lifts: no admin user found, skipping lift seed')
  } else {
    console.log('Lifts:')
    await seedLifts(admin.id)
  }

  console.log('Done.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
