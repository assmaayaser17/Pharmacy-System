import { json, requireUser } from "@/lib/auth";
import { db, save } from "@/lib/db";

export async function GET() {
  const { user, res } = await requireUser();
  if (!user) return res!;
  return json({ ids: db().wishlist[user.id] ?? [] });
}

// تبديل: لو المنتج في المفضلة يشيله، وإلا يضيفه
export async function POST(req: Request) {
  const { user, res } = await requireUser();
  if (!user) return res!;
  const { productId } = await req.json().catch(() => ({ productId: "" }));
  const d = db();
  if (!d.products.some((p) => p.id === productId)) return json({ error: "المنتج غير موجود" }, 404);
  const list = d.wishlist[user.id] ?? [];
  const has = list.includes(productId);
  d.wishlist[user.id] = has ? list.filter((x) => x !== productId) : [...list, productId];
  save();
  return json({ saved: !has, ids: d.wishlist[user.id] });
}
