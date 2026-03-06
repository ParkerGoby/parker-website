import { auth } from "@/auth";

type Role = "guest" | "viewer" | "admin";

const roleLevels: Record<Role, number> = {
  guest: 0,
  viewer: 1,
  admin: 2,
};

export async function getCurrentRole(): Promise<Role> {
  const session = await auth();
  if (!session?.user) return "guest";
  return (session.user.role as Role) ?? "viewer";
}

export async function requireAdmin(): Promise<void> {
  const role = await getCurrentRole();
  if (role !== "admin") {
    throw new Error("Forbidden: admin role required");
  }
}

export function hasPermission(role: Role, required: Role): boolean {
  return roleLevels[role] >= roleLevels[required];
}
