import { NextRequest, NextResponse } from "next/server";
import { getReadableUserId, getWritableUserId } from "@/lib/lifts-auth";
import { createWorkout, getWorkoutsForUser } from "@/lib/db-lifts";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const requestedUserId = searchParams.get("userId") ?? undefined;
  const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 100);
  const offset = Number(searchParams.get("offset") ?? "0");

  const userId = await getReadableUserId(requestedUserId);
  if (!userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data = await getWorkoutsForUser(userId, limit, offset);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const userId = await getWritableUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { date, notes, exercises } = body ?? {};

  if (!date || typeof date !== "string") {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }
  if (!Array.isArray(exercises) || exercises.length === 0) {
    return NextResponse.json(
      { error: "exercises must be a non-empty array" },
      { status: 400 },
    );
  }

  try {
    const workout = await createWorkout(userId, { date, notes, exercises });
    return NextResponse.json(workout, { status: 201 });
  } catch (err: unknown) {
    const e = err as Error;
    if (e.message?.includes("not found or not owned")) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    throw err;
  }
}
