import { json, requireUser } from "@/lib/auth";
import { db, save } from "@/lib/db";

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { user, res } = await requireUser();
  if (!user) return res!;
  const { id } = await ctx.params;
  const d = db();
  const before = d.addresses.length;
  d.addresses = d.addresses.filter((a) => !(a.id === id && a.userId === user.id));
  if (d.addresses.length === before) return json({ error: "العنوان غير موجود" }, 404);
  const mine = d.addresses.filter((a) => a.userId === user.id);
  if (mine.length && !mine.some((a) => a.isDefault)) mine[0].isDefault = true;
  save();
  return json({ ok: true });
}

export async function PATCH(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { user, res } = await requireUser();
  if (!user) return res!;
  const { id } = await ctx.params;
  const d = db();
  const target = d.addresses.find((a) => a.id === id && a.userId === user.id);
  if (!target) return json({ error: "العنوان غير موجود" }, 404);
  d.addresses.filter((a) => a.userId === user.id).forEach((a) => (a.isDefault = a.id === id));
  save();
  return json({ ok: true });
}
