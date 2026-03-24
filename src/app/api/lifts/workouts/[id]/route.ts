import { NextRequest, NextResponse } from "next/server";
import { getWritableUserId } from "@/lib/lifts-auth";
import { deleteWorkout } from "@/lib/db-lifts";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getWritableUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const workoutId = Number(id);
  if (isNaN(workoutId)) {
    return NextResponse.json({ error: "Invalid workout id" }, { status: 400 });
  }

  try {
    await deleteWorkout(workoutId, userId);
    return new NextResponse(null, { status: 204 });
  } catch (err: unknown) {
    const e = err as Error;
    if (e.message?.includes("not found or not owned")) {
      return NextResponse.json({ error: e.message }, { status: 404 });
    }
    throw err;
  }
}
