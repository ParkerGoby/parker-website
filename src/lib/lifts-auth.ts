import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAdminUserId(): Promise<string> {
  const [admin] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.role, "admin"))
    .limit(1);
  if (!admin) throw new Error("Admin user not found");
  return admin.id;
}

// Returns the userId whose data should be read, or null if not allowed.
export async function getReadableUserId(
  requestedUserId?: string,
): Promise<string | null> {
  const session = await auth();
  const adminId = await getAdminUserId();

  if (!requestedUserId) {
    return session?.user?.id ?? adminId;
  }

  if (requestedUserId === adminId) return adminId;

  if (session?.user?.id === requestedUserId) return requestedUserId;

  return null;
}

// Returns the authenticated user's ID, or null if not logged in.
export async function getWritableUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}
