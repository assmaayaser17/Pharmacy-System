import { CITIES, PAYMENTS, RX_MAX_QTY } from "@/lib/config";
import { json, requireUser } from "@/lib/auth";
import { db, save, uid } from "@/lib/db";
import { validateAddress } from "@/lib/address";
import { computeTotals, shippingOptionsFor } from "@/lib/pricing";
import type { Order, OrderItem } from "@/lib/types";

export async function GET() {
  const { user, res } = await requireUser();
  if (!user) return res!;
  const orders = db()
    .orders.filter((o) => o.userId === user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return json({ orders });
}

export async function POST(req: Request) {
  const { user, res } = await requireUser();
  if (!user) return res!;
  const body = await req.json().catch(() => null);
  if (!body) return json({ error: "بيانات الطلب غير صحيحة" }, 400);
  const d = db();

  // 1) المنتجات: نعيد حساب الأسعار من السيرفر ولا نثق بأسعار المتصفح
  const raw: { id: string; qty: number }[] = Array.isArray(body.items) ? body.items : [];
  if (!raw.length) return json({ error: "السلة فاضية" }, 400);
  const items: OrderItem[] = [];
  for (const r of raw) {
    const p = d.products.find((x) => x.id === r.id);
    const qty = Math.floor(Number(r.qty));
    if (!p || !(qty > 0)) return json({ error: "في منتج غير صحيح في السلة" }, 400);
    if (p.stock < qty) return json({ error: p.stock === 0 ? `«${p.nameAr}» غير متوفر حاليًا` : `المتوفر من «${p.nameAr}» ${p.stock} فقط` }, 409);
    if (p.rx && qty > RX_MAX_QTY) return json({ error: `الحد الأقصى لـ«${p.nameAr}» ${RX_MAX_QTY} علب لكل طلب` }, 400);
    items.push({ id: p.id, nameAr: p.nameAr, size: p.size, price: p.price, qty, rx: p.rx, art: p.art });
  }

  // 2) الوصفة الطبية للأدوية التي تحتاجها
  const needsRx = items.some((i) => i.rx);
  let prescriptionId: string | undefined;
  if (needsRx) {
    const rx = d.prescriptions.find((p) => p.id === body.prescriptionId && p.userId === user.id);
    if (!rx) return json({ error: "طلبك فيه دواء يحتاج وصفة طبية، ارفع صورة الوصفة أولًا" }, 400);
    if (rx.status === "rejected") return json({ error: "الوصفة غير مقبولة، ارفع وصفة سارية" }, 400);
    prescriptionId = rx.id;
  }

  // 3) العنوان والتوصيل
  const v = validateAddress(body.address ?? {});
  if (!v.ok) return json({ error: v.error }, 400);
  const city = CITIES.find((c) => c.name === v.value.city)!;
  const allowed = shippingOptionsFor(city.id);
  const shippingId = String(body.shippingId ?? "");
  if (!allowed.some((s) => s.id === shippingId)) return json({ error: "طريقة التوصيل غير متاحة لمدينتك" }, 400);
  if (items.some((i) => d.products.find((p) => p.id === i.id)?.cold) && shippingId === "standard") {
    return json({ error: "أدوية التبريد (مثل الإنسولين) تُوصَّل بالتوصيل السريع أو توصيل اليوم أو الاستلام من الفرع فقط" }, 400);
  }

  // 4) الدفع (بوابة تجريبية)
  const paymentId = String(body.paymentId ?? "");
  const pay = PAYMENTS.find((p) => p.id === paymentId);
  if (!pay) return json({ error: "اختر طريقة الدفع" }, 400);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const t = computeTotals({ subtotal, shippingId, paymentId, coupon: body.coupon });
  if (t.couponError) return json({ error: t.couponError }, 400);
  if (pay.minTotal && t.total < pay.minTotal) return json({ error: `${pay.name} متاحة للطلبات من ${pay.minTotal} ر.س` }, 400);
  if (shippingId === "pickup" && paymentId === "cod") {
    // مسموح: الدفع عند الاستلام من الفرع
  }
  if (pay.id !== "cod" && !String(body.paymentToken ?? "").startsWith("mock_ok_")) {
    return json({ error: "ما تمت عملية الدفع، حاول مرة ثانية" }, 402);
  }

  // 5) إنشاء الطلب وخصم المخزون
  for (const i of items) d.products.find((p) => p.id === i.id)!.stock -= i.qty;
  d.seq += 1;
  const now = new Date().toISOString();
  const order: Order = {
    id: uid("o-"),
    number: `SH${100200 + d.seq}`,
    userId: user.id,
    items,
    address: v.value,
    shippingId,
    paymentId,
    paymentStatus: pay.id === "cod" ? "pending" : "paid",
    status: "received",
    subtotal: t.subtotal,
    discount: t.discount,
    shipping: t.shipping,
    codFee: t.codFee,
    total: t.total,
    vat: t.vat,
    coupon: body.coupon ? String(body.coupon).toUpperCase() : undefined,
    prescriptionId,
    note: String(body.note ?? "").slice(0, 300) || undefined,
    createdAt: now,
    timeline: [{ status: "received", at: now }],
  };
  d.orders.push(order);
  save();
  return json({ order }, 201);
}
