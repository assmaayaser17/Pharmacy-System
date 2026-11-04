import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BRAND, ORDER_STEPS, PAYMENTS, SHIPPING } from "@/lib/config";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { dateTimeAr, money, num } from "@/lib/format";
import Icon from "@/components/Icon";
import OrderActions from "@/components/OrderActions";
import ProductArt from "@/components/ProductArt";

export const metadata: Metadata = { title: "تفاصيل الطلب" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ new?: string }> };

export default async function OrderPage({ params, searchParams }: Props) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const user = await getUser();
  if (!user) redirect(`/login?next=/orders/${id}`);
  const d = db();
  const order = d.orders.find((o) => (o.id === id || o.number === id) && (o.userId === user.id || user.role === "admin"));
  if (!order) notFound();

  const cancelled = order.status === "cancelled";
  const stepIdx = ORDER_STEPS.findIndex((s) => s.id === order.status);
  const ship = SHIPPING.find((s) => s.id === order.shippingId);
  const pay = PAYMENTS.find((p) => p.id === order.paymentId);
  const reorder = order.items
    .map((i) => ({ product: d.products.find((p) => p.id === i.id)!, qty: i.qty }))
    .filter((x) => x.product);
  const trackingPrefix: Record<string, string> = { express: "SHX", same_day: "SMS", standard: "NQL" };
  const tracking = trackingPrefix[order.shippingId] ? `${trackingPrefix[order.shippingId]}${order.number.slice(2)}KSA` : null;
  const atOf = (s: string) => order.timeline.find((t) => t.status === s)?.at;

  return (
    <div className="container-x py-6 lg:py-10 max-w-5xl">
      {sp.new === "1" && (
        <div className="rounded-3xl bg-leaf text-white p-6 mb-6 flex gap-4 items-center print:hidden">
          <span className="grid place-items-center size-14 rounded-full bg-white text-leaf shrink-0"><Icon name="check" size={32} /></span>
          <div>
            <h1 className="text-2xl">وصلنا طلبك، شكرًا لك</h1>
            <p className="text-white/90">رقم طلبك <strong className="num">{order.number}</strong>. {order.paymentId === "cod" ? "جهّز المبلغ لما يوصلك المندوب." : "تم الدفع بنجاح."}</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          {sp.new !== "1" && <h1 className="text-2xl lg:text-3xl">طلب <span className="num">{order.number}</span></h1>}
          <p className="text-muted">{dateTimeAr(order.createdAt)}</p>
        </div>
        <OrderActions orderId={order.id} canCancel={order.status === "received" || order.status === "confirmed"} reorder={reorder} />
      </div>

      <section className="card p-5 sm:p-6 mb-5" aria-labelledby="track">
        <h2 id="track" className="text-xl mb-5">تتبّع الطلب</h2>
        {cancelled ? (
          <p className="rounded-2xl bg-coral-soft text-coral p-4 font-semibold">تم إلغاء هذا الطلب.</p>
        ) : (
          <ol className="space-y-0">
            {ORDER_STEPS.map((s, i) => {
              const done = i <= stepIdx;
              const current = i === stepIdx;
              const at = atOf(s.id);
              return (
                <li key={s.id} className="flex gap-4" aria-current={current ? "step" : undefined}>
                  <div className="flex flex-col items-center">
                    <span className={`grid place-items-center size-9 rounded-full shrink-0 ${done ? "bg-leaf text-white" : "bg-paper text-muted border-2 border-line"} ${current && order.status !== "delivered" ? "ring-4 ring-leaf/25" : ""}`}>
                      {done ? <Icon name="check" size={18} /> : <span className="num text-sm">{i + 1}</span>}
                    </span>
                    {i < ORDER_STEPS.length - 1 && <span className={`w-0.5 grow min-h-8 ${i < stepIdx ? "bg-leaf" : "bg-line"}`} />}
                  </div>
                  <div className="pb-5">
                    <strong className={done ? "" : "text-muted"}>{s.name}</strong>
                    <p className="text-sm text-muted">{at ? dateTimeAr(at) : s.desc}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
        {tracking && !cancelled && (
          <p className="mt-2 rounded-2xl bg-mint-2 p-3 text-[0.95rem]">
            شركة التوصيل: <strong>{ship?.carrier}</strong> · رقم الشحنة: <strong className="num">{tracking}</strong>
          </p>
        )}
      </section>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <section className="card p-5" aria-labelledby="addr">
          <h2 id="addr" className="text-lg mb-3 flex items-center gap-2"><Icon name="pin" className="text-leaf" /> عنوان التوصيل</h2>
          <p className="font-semibold">{order.address.name}</p>
          <p className="num text-muted" dir="ltr" style={{ textAlign: "start" }}>{order.address.phone}</p>
          <p className="mt-2">{order.address.city}{order.address.district ? `، ${order.address.district}` : ""}{order.address.street ? `، ${order.address.street}` : ""}</p>
          {order.address.landmark && <p className="text-muted">{order.address.landmark}</p>}
          {order.address.nationalAddress && <p className="mt-1 text-sm">العنوان الوطني: <span className="num font-semibold">{order.address.nationalAddress}</span></p>}
        </section>
        <section className="card p-5" aria-labelledby="pay">
          <h2 id="pay" className="text-lg mb-3 flex items-center gap-2"><Icon name="card" className="text-leaf" /> التوصيل والدفع</h2>
          <p><strong>{ship?.name}</strong> <span className="text-muted">· {ship?.eta}</span></p>
          <p className="mt-2">{pay?.name}{" "}
            <span className={`badge ${order.paymentStatus === "paid" ? "bg-mint text-leaf-dark" : "bg-amber-soft text-[#c45500]"}`}>
              {order.paymentStatus === "paid" ? "مدفوع" : "يُدفع عند الاستلام"}
            </span>
          </p>
          {order.note && <p className="text-muted mt-2">ملاحظتك: {order.note}</p>}
        </section>
      </div>

      <section className="card p-5 sm:p-6" aria-labelledby="items">
        <h2 id="items" className="text-xl mb-4">المنتجات</h2>
        <ul className="divide-y divide-line">
          {order.items.map((i) => (
            <li key={i.id} className="flex items-center gap-3 py-3">
              <span className="rounded-xl shrink-0" style={{ background: i.art.c2 }}><ProductArt art={i.art} label="" className="size-16 p-1" /></span>
              <span className="flex-1 min-w-0">
                <Link href={`/product/${i.id}`} className="font-semibold hover:text-leaf">{i.nameAr}</Link>
                <span className="block text-sm text-muted">{i.size} · {money(i.price)} × <span className="num">{num(i.qty)}</span></span>
              </span>
              <strong className="num">{money(i.price * i.qty)}</strong>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-line pt-4 max-w-sm ms-auto">
          <div className="flex justify-between"><dt>المنتجات</dt><dd className="num">{money(order.subtotal)}</dd></div>
          {order.discount > 0 && <div className="flex justify-between text-leaf"><dt>الخصم {order.coupon ? `(${order.coupon})` : ""}</dt><dd className="num">- {money(order.discount)}</dd></div>}
          <div className="flex justify-between"><dt>التوصيل</dt><dd className="num">{order.shipping === 0 ? "مجاني" : money(order.shipping)}</dd></div>
          {order.codFee > 0 && <div className="flex justify-between"><dt>رسوم الدفع عند الاستلام</dt><dd className="num">{money(order.codFee)}</dd></div>}
          <div className="flex justify-between text-xl font-bold border-t border-line pt-3"><dt>الإجمالي</dt><dd className="num">{money(order.total)}</dd></div>
          <div className="flex justify-between text-sm text-muted"><dt>منها ضريبة القيمة المضافة ١٥٪</dt><dd className="num">{money(order.vat)}</dd></div>
        </dl>
        <p className="hint mt-4 hidden print:block">{BRAND.name} · {BRAND.vatNo}</p>
      </section>

      <p className="text-center mt-6 print:hidden">
        تحتاج مساعدة؟ <a className="font-bold text-leaf underline underline-offset-4" href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(`استفسار عن الطلب ${order.number}`)}`}>راسلنا واتساب</a>
        {" "}أو اتصل <a className="font-bold text-leaf num" href={`tel:${BRAND.phone}`}>{BRAND.phone}</a>
      </p>
    </div>
  );
}
