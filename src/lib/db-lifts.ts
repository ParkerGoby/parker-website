import { db } from "@/db";
import { bodyweight, exercises, sets, workouts } from "@/db/schema";
import type {
  Bodyweight,
  Exercise,
  NewBodyweight,
  NewExercise,
  Workout,
} from "@/db/schema";
import { and, asc, between, desc, eq, inArray, sql } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SetRow = {
  id: number;
  workoutId: number;
  exerciseId: number;
  exerciseName: string;
  setOrder: number;
  weight: number;
  reps: number;
  isDropSet: boolean;
};

export type WorkoutWithSets = Workout & { sets: SetRow[] };

export type CreateWorkoutInput = {
  date: string;
  notes?: string;
  exercises: {
    exerciseId: number;
    sets: { weight: number; reps: number; isDropSet: boolean }[];
  }[];
};

export type ChartDataPoint = {
  date: string;
  series: { name: string; value: number }[];
};

export type BodyweightDataPoint = {
  date: string;
  weight: number;
};

// ---------------------------------------------------------------------------
// Exercises
// ---------------------------------------------------------------------------

export async function getExercisesForUser(userId: string): Promise<Exercise[]> {
  return db
    .select()
    .from(exercises)
    .where(eq(exercises.userId, userId))
    .orderBy(asc(exercises.muscleGroup), asc(exercises.name));
}

export async function createExercise(
  userId: string,
  data: { name: string; muscleGroup: string },
): Promise<Exercise> {
  const [row] = await db
    .insert(exercises)
    .values({
      name: data.name,
      muscleGroup: data.muscleGroup as NewExercise["muscleGroup"],
      userId,
    })
    .returning();
  return row;
}

// ---------------------------------------------------------------------------
// Workouts
// ---------------------------------------------------------------------------

export async function getWorkoutsForUser(
  userId: string,
  limit: number,
  offset: number,
): Promise<WorkoutWithSets[]> {
  const workoutRows = await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId))
    .orderBy(desc(workouts.date), desc(workouts.createdAt))
    .limit(limit)
    .offset(offset);

  if (workoutRows.length === 0) return [];

  const workoutIds = workoutRows.map((w) => w.id);

  const setRows = await db
    .select({
      id: sets.id,
      workoutId: sets.workoutId,
      exerciseId: sets.exerciseId,
      exerciseName: exercises.name,
      setOrder: sets.setOrder,
      weight: sets.weight,
      reps: sets.reps,
      isDropSet: sets.isDropSet,
    })
    .from(sets)
    .innerJoin(exercises, eq(sets.exerciseId, exercises.id))
    .where(inArray(sets.workoutId, workoutIds))
    .orderBy(asc(sets.setOrder));

  const setsByWorkout = new Map<number, SetRow[]>();
  for (const s of setRows) {
    const arr = setsByWorkout.get(s.workoutId) ?? [];
    arr.push(s);
    setsByWorkout.set(s.workoutId, arr);
  }

  return workoutRows.map((w) => ({
    ...w,
    sets: setsByWorkout.get(w.id) ?? [],
  }));
}

export async function createWorkout(
  userId: string,
  data: CreateWorkoutInput,
): Promise<Workout> {
  return db.transaction(async (tx) => {
    const [workout] = await tx
      .insert(workouts)
      .values({ userId, date: data.date, notes: data.notes ?? null })
      .returning();

    for (const exerciseInput of data.exercises) {
      // Verify the exercise belongs to this user
      const [ex] = await tx
        .select({ id: exercises.id })
        .from(exercises)
        .where(
          and(
            eq(exercises.id, exerciseInput.exerciseId),
            eq(exercises.userId, userId),
          ),
        )
        .limit(1);

      if (!ex) {
        throw new Error(
          `Exercise ${exerciseInput.exerciseId} not found or not owned by user`,
        );
      }

      for (let i = 0; i < exerciseInput.sets.length; i++) {
        const s = exerciseInput.sets[i];
        await tx.insert(sets).values({
          workoutId: workout.id,
          exerciseId: exerciseInput.exerciseId,
          setOrder: i + 1,
          weight: s.weight,
          reps: s.reps,
          isDropSet: s.isDropSet,
        });
      }
    }

    return workout;
  });
}

export async function deleteWorkout(id: number, userId: string): Promise<void> {
  const [workout] = await db
    .select({ id: workouts.id })
    .from(workouts)
    .where(and(eq(workouts.id, id), eq(workouts.userId, userId)))
    .limit(1);

  if (!workout) {
    throw new Error("Workout not found or not owned by user");
  }

  await db.delete(workouts).where(eq(workouts.id, id));
}

// ---------------------------------------------------------------------------
// Bodyweight
// ---------------------------------------------------------------------------

export async function getBodyweightForUser(
  userId: string,
  limit: number,
  offset: number,
): Promise<Bodyweight[]> {
  return db
    .select()
    .from(bodyweight)
    .where(eq(bodyweight.userId, userId))
    .orderBy(desc(bodyweight.date))
    .limit(limit)
    .offset(offset);
}

export async function logBodyweight(
  userId: string,
  date: string,
  weightDecimal: number,
): Promise<Bodyweight> {
  const weightTenths = Math.round(weightDecimal * 10);

  const [row] = await db
    .insert(bodyweight)
    .values({ userId, date, weight: weightTenths } as NewBodyweight)
    .onConflictDoUpdate({
      target: [bodyweight.userId, bodyweight.date],
      set: { weight: weightTenths },
    })
    .returning();

  return row;
}

// ---------------------------------------------------------------------------
// Charts
// ---------------------------------------------------------------------------

// Epley formula: weight * (1 + reps / 30)
function epley(weight: number, reps: number): number {
  return weight * (1 + reps / 30);
}

export async function getExerciseChartData(
  userId: string,
  exerciseIds: number[],
  from: string,
  to: string,
): Promise<ChartDataPoint[]> {
  if (exerciseIds.length === 0) return [];

  const rows = await db
    .select({
      date: workouts.date,
      exerciseName: exercises.name,
      weight: sets.weight,
      reps: sets.reps,
      isDropSet: sets.isDropSet,
    })
    .from(sets)
    .innerJoin(workouts, eq(sets.workoutId, workouts.id))
    .innerJoin(exercises, eq(sets.exerciseId, exercises.id))
    .where(
      and(
        eq(workouts.userId, userId),
        inArray(sets.exerciseId, exerciseIds),
        between(workouts.date, from, to),
        eq(sets.isDropSet, false),
      ),
    )
    .orderBy(asc(workouts.date));

  // Group: date → exerciseName → best 1RM
  const grouped = new Map<string, Map<string, number>>();
  for (const row of rows) {
    const oneRM = epley(row.weight, row.reps);
    const byExercise = grouped.get(row.date) ?? new Map<string, number>();
    const current = byExercise.get(row.exerciseName) ?? 0;
    if (oneRM > current) byExercise.set(row.exerciseName, oneRM);
    grouped.set(row.date, byExercise);
  }

  return Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, byExercise]) => ({
      date,
      series: Array.from(byExercise.entries()).map(([name, value]) => ({
        name,
        value: Math.round(value * 10) / 10,
      })),
    }));
}

export async function getMuscleGroupChartData(
  userId: string,
  groups: string[],
  from: string,
  to: string,
): Promise<ChartDataPoint[]> {
  if (groups.length === 0) return [];

  const rows = await db
    .select({
      date: workouts.date,
      muscleGroup: exercises.muscleGroup,
      weight: sets.weight,
      reps: sets.reps,
      isDropSet: sets.isDropSet,
    })
    .from(sets)
    .innerJoin(workouts, eq(sets.workoutId, workouts.id))
    .innerJoin(exercises, eq(sets.exerciseId, exercises.id))
    .where(
      and(
        eq(workouts.userId, userId),
        inArray(exercises.muscleGroup, groups as Exercise["muscleGroup"][]),
        between(workouts.date, from, to),
        eq(sets.isDropSet, false),
      ),
    )
    .orderBy(asc(workouts.date));

  // Group: date → muscleGroup → best 1RM per exercise, then average across exercises
  type ExerciseMap = Map<string, number>; // exerciseId→best1RM (use exerciseId key)
  const grouped = new Map<string, Map<string, ExerciseMap>>();

  for (const row of rows) {
    const oneRM = epley(row.weight, row.reps);
    const byGroup = grouped.get(row.date) ?? new Map<string, ExerciseMap>();
    // We don't have exerciseId here — use muscleGroup aggregation by weight key
    const exerciseMap = byGroup.get(row.muscleGroup) ?? new Map<string, number>();
    // Key by weight+reps combo to approximate per-exercise tracking
    const key = `${row.weight}_${row.reps}`;
    const current = exerciseMap.get(key) ?? 0;
    if (oneRM > current) exerciseMap.set(key, oneRM);
    byGroup.set(row.muscleGroup, exerciseMap);
    grouped.set(row.date, byGroup);
  }

  return Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, byGroup]) => ({
      date,
      series: Array.from(byGroup.entries()).map(([name, exerciseMap]) => {
        const values = Array.from(exerciseMap.values());
        const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
        return { name, value: Math.round(avg * 10) / 10 };
      }),
    }));
}

export async function getBodyweightChartData(
  userId: string,
  from: string,
  to: string,
): Promise<BodyweightDataPoint[]> {
  const rows = await db
    .select()
    .from(bodyweight)
    .where(
      and(eq(bodyweight.userId, userId), between(bodyweight.date, from, to)),
    )
    .orderBy(asc(bodyweight.date));

  return rows.map((r) => ({
    date: r.date,
    weight: r.weight / 10,
  }));
}

// Convenience: get today's bodyweight entry for a user (or null)
export async function getTodayBodyweight(
  userId: string,
  today: string,
): Promise<Bodyweight | null> {
  const [row] = await db
    .select()
    .from(bodyweight)
    .where(and(eq(bodyweight.userId, userId), eq(bodyweight.date, today)))
    .limit(1);
  return row ?? null;
}
