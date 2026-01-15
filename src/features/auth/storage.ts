import type { User } from "./types";

type UserRecord = User & { password: string };

const USERS_KEY = "auth:users";

/**
 * Чистим старые артефакты от предыдущих версий (чтобы ничего не “запоминалось”).
 */
export function clearLegacyAuthArtifacts() {
  localStorage.removeItem("token");
  localStorage.removeItem("auth:session");
}

function safeParse<T>(raw: string | null): T | null {
  try {
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function ensureSeedUsers() {
  clearLegacyAuthArtifacts();

  const users = safeParse<UserRecord[]>(localStorage.getItem(USERS_KEY)) ?? [];

  // seed admin/admin (email = "admin", password = "admin")
  const hasAdmin = users.some((u) => u.email === "admin");
  if (!hasAdmin) {
    users.push({
      id: "U_admin",
      email: "admin",
      name: "Admin",
      password: "admin",
    });
  }

  write(USERS_KEY, users);
}

export function readUsers(): UserRecord[] {
  ensureSeedUsers();
  return safeParse<UserRecord[]>(localStorage.getItem(USERS_KEY)) ?? [];
}

export function findUserByEmail(emailLower: string): UserRecord | null {
  const users = readUsers();
  return users.find((u) => u.email === emailLower) ?? null;
}

export function toPublicUser(rec: UserRecord): User {
  const { password: _pw, ...user } = rec;
  return user;
}
