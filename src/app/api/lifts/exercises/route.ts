import { NextRequest, NextResponse } from "next/server";
import { getReadableUserId, getWritableUserId } from "@/lib/lifts-auth";
import { createExercise, getExercisesForUser } from "@/lib/db-lifts";

const VALID_MUSCLE_GROUPS = [
  "chest", "back", "shoulders", "biceps", "triceps", "forearms",
  "quads", "hamstrings", "glutes", "calves", "abductors", "adductors",
  "core", "full_body",
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const requestedUserId = searchParams.get("userId") ?? undefined;

  const userId = await getReadableUserId(requestedUserId);
  if (!userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data = await getExercisesForUser(userId);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const userId = await getWritableUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, muscleGroup } = body ?? {};

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  if (!muscleGroup || !VALID_MUSCLE_GROUPS.includes(muscleGroup)) {
    return NextResponse.json({ error: "Invalid muscleGroup" }, { status: 400 });
  }

  try {
    const exercise = await createExercise(userId, {
      name: name.trim(),
      muscleGroup,
    });
    return NextResponse.json(exercise, { status: 201 });
  } catch (err: unknown) {
    const pgErr = err as { code?: string };
    if (pgErr?.code === "23505") {
      return NextResponse.json(
        { error: "Exercise with this name already exists" },
        { status: 409 },
      );
    }
    throw err;
  }
}
