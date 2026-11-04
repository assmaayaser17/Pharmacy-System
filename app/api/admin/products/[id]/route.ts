import { json, requireAdmin } from "@/lib/auth";
import { db, save } from "@/lib/db";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { user, res } = await requireAdmin();
  if (!user) return res!;
  const { id } = await ctx.params;
  const p = db().products.find((x) => x.id === id);
  if (!p) return json({ error: "المنتج غير موجود" }, 404);
  const b = await req.json().catch(() => ({}));
  if (b.price != null) {
    const v = Number(b.price);
    if (!(v > 0)) return json({ error: "السعر غير صحيح" }, 400);
    p.price = v;
  }
  if (b.oldPrice !== undefined) p.oldPrice = Number(b.oldPrice) > p.price ? Number(b.oldPrice) : undefined;
  if (b.stock != null) p.stock = Math.max(0, Math.floor(Number(b.stock) || 0));
  if (typeof b.nameAr === "string" && b.nameAr.trim()) p.nameAr = b.nameAr.trim();
  save();
  return json({ product: p });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { user, res } = await requireAdmin();
  if (!user) return res!;
  const { id } = await ctx.params;
  const d = db();
  d.products = d.products.filter((p) => p.id !== id);
  save();
  return json({ ok: true });
}
