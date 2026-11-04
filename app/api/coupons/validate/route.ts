import { COUPONS } from "@/lib/config";
import { json } from "@/lib/auth";
import { computeTotals } from "@/lib/pricing";

export async function POST(req: Request) {
  const { code, subtotal } = await req.json().catch(() => ({ code: "", subtotal: 0 }));
  const key = String(code ?? "").trim().toUpperCase();
  const c = COUPONS[key];
  if (!c) return json({ valid: false, error: "كود الخصم غير صحيح" }, 200);
  const t = computeTotals({ subtotal: Number(subtotal) || 0, coupon: key });
  if (t.couponError) return json({ valid: false, error: t.couponError }, 200);
  return json({ valid: true, code: key, label: c.label, discount: t.discount });
}
