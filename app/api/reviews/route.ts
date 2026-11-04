import { json, requireUser } from "@/lib/auth";
import { db, save, uid } from "@/lib/db";

export async function POST(req: Request) {
  const { user, res } = await requireUser();
  if (!user) return res!;
  const b = await req.json().catch(() => ({}));
  const d = db();
  const p = d.products.find((x) => x.id === b.productId);
  if (!p) return json({ error: "المنتج غير موجود" }, 404);
  const stars = Math.min(5, Math.max(1, Math.round(Number(b.stars) || 0)));
  const text = String(b.text ?? "").trim().slice(0, 400);
  if (text.length < 3) return json({ error: "اكتب رأيك في المنتج" }, 400);
  const review = {
    id: uid("r-"),
    productId: p.id,
    name: user.name.split(" ")[0],
    stars,
    text,
    createdAt: new Date().toISOString(),
  };
  d.reviews.unshift(review);
  const all = d.reviews.filter((r) => r.productId === p.id);
  p.rating = Math.round((all.reduce((s, r) => s + r.stars, 0) / all.length) * 10) / 10;
  p.reviews += 1;
  save();
  return json({ review }, 201);
}
