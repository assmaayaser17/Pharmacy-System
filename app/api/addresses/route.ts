import { json, requireUser } from "@/lib/auth";
import { db, save, uid } from "@/lib/db";
import { validateAddress } from "@/lib/address";
import type { Address } from "@/lib/types";

export async function GET() {
  const { user, res } = await requireUser();
  if (!user) return res!;
  return json({ addresses: db().addresses.filter((a) => a.userId === user.id) });
}

export async function POST(req: Request) {
  const { user, res } = await requireUser();
  if (!user) return res!;
  const body = await req.json().catch(() => ({}));
  const v = validateAddress(body);
  if (!v.ok) return json({ error: v.error }, 400);
  const d = db();
  const mine = d.addresses.filter((a) => a.userId === user.id);
  const addr: Address = {
    id: uid("a-"),
    userId: user.id,
    label: String(body.label ?? "").trim().slice(0, 30) || "عنوان جديد",
    isDefault: mine.length === 0,
    ...v.value,
  };
  d.addresses.push(addr);
  save();
  return json({ address: addr }, 201);
}
