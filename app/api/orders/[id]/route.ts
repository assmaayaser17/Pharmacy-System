import { json, requireUser } from "@/lib/auth";
import { db, save } from "@/lib/db";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { user, res } = await requireUser();
  if (!user) return res!;
  const { id } = await ctx.params;
  const order = db().orders.find((o) => (o.id === id || o.number === id) && (o.userId === user.id || user.role === "admin"));
  if (!order) return json({ error: "الطلب غير موجود" }, 404);
  return json({ order });
}

// العميل يقدر يلغي الطلب قبل ما يبدأ التجهيز
export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { user, res } = await requireUser();
  if (!user) return res!;
  const { id } = await ctx.params;
  const d = db();
  const order = d.orders.find((o) => o.id === id && o.userId === user.id);
  if (!order) return json({ error: "الطلب غير موجود" }, 404);
  if (order.status !== "received" && order.status !== "confirmed") {
    return json({ error: "ما نقدر نلغي الطلب بعد بدء التجهيز، تواصل معنا بالاتصال أو الواتساب" }, 409);
  }
  order.status = "cancelled";
  order.timeline.push({ status: "cancelled", at: new Date().toISOString() });
  for (const i of order.items) {
    const p = d.products.find((x) => x.id === i.id);
    if (p) p.stock += i.qty;
  }
  save();
  return json({ order });
}
