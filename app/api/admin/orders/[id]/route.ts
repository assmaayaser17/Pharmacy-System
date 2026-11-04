import { json, requireAdmin } from "@/lib/auth";
import { db, save } from "@/lib/db";
import type { OrderStatus } from "@/lib/types";

const VALID: OrderStatus[] = ["received", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { user, res } = await requireAdmin();
  if (!user) return res!;
  const { id } = await ctx.params;
  const { status } = await req.json().catch(() => ({ status: "" }));
  if (!VALID.includes(status)) return json({ error: "حالة غير صحيحة" }, 400);
  const d = db();
  const o = d.orders.find((x) => x.id === id);
  if (!o) return json({ error: "الطلب غير موجود" }, 404);
  if (o.status !== status) {
    o.status = status;
    o.timeline.push({ status, at: new Date().toISOString() });
    if (status === "delivered" && o.paymentId === "cod") o.paymentStatus = "paid";
    if (status === "cancelled") {
      for (const i of o.items) {
        const p = d.products.find((x) => x.id === i.id);
        if (p) p.stock += i.qty;
      }
    }
  }
  save();
  return json({ order: o });
}
