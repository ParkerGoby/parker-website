import { NextRequest, NextResponse } from "next/server";
import { getReadableUserId } from "@/lib/lifts-auth";
import {
  getBodyweightChartData,
  getExerciseChartData,
  getMuscleGroupChartData,
} from "@/lib/db-lifts";

const VALID_TYPES = ["exercise", "muscle_group", "bodyweight"] as const;
type ChartType = (typeof VALID_TYPES)[number];

function defaultFrom(): string {
  const d = new Date();
  d.setDate(d.getDate() - 90);
  return d.toISOString().split("T")[0];
}

function defaultTo(): string {
  return new Date().toISOString().split("T")[0];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const requestedUserId = searchParams.get("userId") ?? undefined;

  const userId = await getReadableUserId(requestedUserId);
  if (!userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const type = searchParams.get("type") as ChartType | null;
  if (!type || !VALID_TYPES.includes(type)) {
    return NextResponse.json(
      { error: "type must be one of: exercise, muscle_group, bodyweight" },
      { status: 400 },
    );
  }

  const from = searchParams.get("from") ?? defaultFrom();
  const to = searchParams.get("to") ?? defaultTo();

  if (type === "bodyweight") {
    const data = await getBodyweightChartData(userId, from, to);
    return NextResponse.json(data);
  }

  if (type === "exercise") {
    const raw = searchParams.get("exerciseIds") ?? "";
    const exerciseIds = raw
      .split(",")
      .map(Number)
      .filter((n) => !isNaN(n) && n > 0);
    if (exerciseIds.length === 0) {
      return NextResponse.json(
        { error: "exerciseIds is required for type=exercise" },
        { status: 400 },
      );
    }
    const data = await getExerciseChartData(userId, exerciseIds, from, to);
    return NextResponse.json(data);
  }

  // type === "muscle_group"
  const raw = searchParams.get("muscleGroups") ?? "";
  const muscleGroups = raw.split(",").filter(Boolean);
  if (muscleGroups.length === 0) {
    return NextResponse.json(
      { error: "muscleGroups is required for type=muscle_group" },
      { status: 400 },
    );
  }
  const data = await getMuscleGroupChartData(userId, muscleGroups, from, to);
  return NextResponse.json(data);
}
