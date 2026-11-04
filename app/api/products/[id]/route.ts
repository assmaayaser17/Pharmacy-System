import { json } from "@/lib/auth";
import { getProduct, related } from "@/lib/catalog";
import { db } from "@/lib/db";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const product = getProduct(id);
  if (!product) return json({ error: "المنتج غير موجود" }, 404);
  const reviews = db().reviews.filter((r) => r.productId === id);
  return json({ product, reviews, related: related(product) });
}
