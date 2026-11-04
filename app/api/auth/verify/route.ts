import { json, startSession } from "@/lib/auth";
import { db, save, uid } from "@/lib/db";
import { normalizePhone, toLatinDigits } from "@/lib/format";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const phone = normalizePhone(toLatinDigits(String(body.phone ?? "")));
  const code = toLatinDigits(String(body.code ?? "")).trim();
  if (!phone) return json({ error: "رقم الجوال غير صحيح" }, 400);

  const d = db();
  const otp = d.otps[phone];
  if (!otp || otp.expires < Date.now()) return json({ error: "انتهت صلاحية الرمز، اطلب رمزًا جديدًا" }, 400);
  if (otp.code !== code) return json({ error: "الرمز غير صحيح، حاول مرة ثانية" }, 400);

  let user = d.users.find((u) => u.phone === phone);
  if (!user) {
    const name = String(body.name ?? "").trim().slice(0, 60);
    user = { id: uid("u-"), name: name || "عميلنا العزيز", phone, role: "customer", createdAt: new Date().toISOString() };
    d.users.push(user);
  }
  delete d.otps[phone];
  save();
  await startSession(user.id);
  return json({ ok: true, user: { id: user.id, name: user.name, role: user.role } });
}
