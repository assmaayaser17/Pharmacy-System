import { json } from "@/lib/auth";
import { DEMO_OTP, db, save } from "@/lib/db";
import { normalizePhone, toLatinDigits } from "@/lib/format";

// نسخة تجريبية: الرمز دائمًا 1234. في الإنتاج يُستبدل بمزوّد رسائل (Unifonic / Taqnyat) أو نفاذ.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const phone = normalizePhone(toLatinDigits(String(body.phone ?? "")));
  if (!phone) return json({ error: "اكتب رقم جوال سعودي صحيح مثل 05xxxxxxxx" }, 400);
  const d = db();
  d.otps[phone] = { code: DEMO_OTP, expires: Date.now() + 5 * 60_000 };
  save();
  const exists = d.users.some((u) => u.phone === phone);
  return json({ ok: true, phone, isNew: !exists, demoCode: DEMO_OTP });
}
