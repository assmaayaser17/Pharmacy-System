import { cookies } from "next/headers";
import { db, save, uid } from "./db";
import type { User } from "./types";

const COOKIE = "shifa_sid";

export async function getUser(): Promise<User | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const d = db();
  const userId = d.sessions[token];
  return d.users.find((u) => u.id === userId) ?? null;
}

export async function startSession(userId: string) {
  const token = uid("s_") + uid();
  const d = db();
  d.sessions[token] = userId;
  save();
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    const d = db();
    delete d.sessions[token];
    save();
  }
  jar.delete(COOKIE);
}

export function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export async function requireUser() {
  const u = await getUser();
  if (!u) return { user: null as null, res: json({ error: "سجّل دخولك أولًا" }, 401) };
  return { user: u, res: null as null };
}

export async function requireAdmin() {
  const u = await getUser();
  if (!u || u.role !== "admin") return { user: null as null, res: json({ error: "غير مصرّح" }, 403) };
  return { user: u, res: null as null };
}
