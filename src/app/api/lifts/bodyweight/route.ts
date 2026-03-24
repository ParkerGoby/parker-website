import { NextRequest, NextResponse } from "next/server";
import { getReadableUserId, getWritableUserId } from "@/lib/lifts-auth";
import { getBodyweightForUser, logBodyweight } from "@/lib/db-lifts";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const requestedUserId = searchParams.get("userId") ?? undefined;
  const limit = Math.min(Number(searchParams.get("limit") ?? "90"), 365);
  const offset = Number(searchParams.get("offset") ?? "0");

  const userId = await getReadableUserId(requestedUserId);
  if (!userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data = await getBodyweightForUser(userId, limit, offset);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const userId = await getWritableUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { date, weight } = body ?? {};

  if (!date || typeof date !== "string") {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }
  if (typeof weight !== "number" || weight <= 0) {
    return NextResponse.json(
      { error: "weight must be a positive number" },
      { status: 400 },
    );
  }

  const entry = await logBodyweight(userId, date, weight);
  return NextResponse.json(
    { ...entry, weight: entry.weight / 10 },
    { status: 201 },
  );
}
