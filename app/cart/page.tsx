"use client";

import Link from "next/link";
import { FREE_SHIPPING_MIN } from "@/lib/config";
import { money, num } from "@/lib/format";
import { useCart } from "@/components/CartProvider";
import Icon from "@/components/Icon";
import ProductArt from "@/components/ProductArt";

export default function CartPage() {
  const { lines, ready, subtotal, setQty, remove, needsRx, clear } = useCart();
  const gap = Math.max(0, FREE_SHIPPING_MIN - subtotal);
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_MIN) * 100));

  if (!ready) return <div className="container-x py-16 text-center text-muted">جاري تحميل السلة...</div>;

  if (lines.length === 0) {
    return (
      <div className="container-x py-16 text-center space-y-5">
        <span className="mx-auto grid place-items-center size-24 rounded-full bg-mint text-leaf">
          <Icon name="cart" size={44} />
        </span>
        <h1 className="text-2xl">سلتك فاضية</h1>
        <p className="text-muted">ابدأ بإضافة المنتجات اللي تحتاجها، أو ارفع وصفتك الطبية.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/products" className="btn btn-primary btn-lg">تصفّح المنتجات</Link>
          <Link href="/prescription" className="btn btn-ghost btn-lg">ارفع وصفتك</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-6 lg:py-10">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl lg:text-3xl">سلة المشتريات <span className="text-muted text-xl">({num(lines.length)})</span></h1>
        <button onClick={clear} className="text-coral font-semibold underline underline-offset-4 min-h-10 whitespace-nowrap">أفرغ السلة</button>
      </div>

      <div className="grid lg:grid-cols-[1fr_24rem] gap-6 items-start">
        <ul className="space-y-3 min-w-0">
          {lines.map((l) => (
            <li key={l.id} className="card p-3 sm:p-4 flex gap-3 sm:gap-4">
              <Link href={`/product/${l.id}`} className="rounded-lg shrink-0 bg-paper self-start">
                <ProductArt art={l.art} label={l.nameAr} className="size-20 sm:size-28 p-1.5 sm:p-2" />
              </Link>
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="flex justify-between gap-2">
                  <div className="min-w-0">
                    <Link href={`/product/${l.id}`} className="font-semibold leading-snug hover:text-leaf block">{l.nameAr}</Link>
                    <p className="text-sm text-muted">{l.size}</p>
                    {l.rx && <span className="badge bg-ink text-white mt-1 whitespace-nowrap"><Icon name="rx" size={14} /> بوصفة طبية</span>}
                  </div>
                  <button onClick={() => remove(l.id)} aria-label={`احذف ${l.nameAr}`} className="grid place-items-center size-11 rounded-full hover:bg-coral-soft text-coral shrink-0">
                    <Icon name="trash" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-auto">
                  <div className="flex items-center rounded-full border-2 border-line">
                    <button className="size-10 sm:size-11 grid place-items-center" aria-label="قلّل" onClick={() => setQty(l.id, l.qty - 1)}><Icon name="minus" size={20} /></button>
                    <span className="num w-8 sm:w-9 text-center font-bold" aria-live="polite">{l.qty}</span>
                    <button className="size-10 sm:size-11 grid place-items-center" aria-label="زوّد" onClick={() => setQty(l.id, l.qty + 1)}><Icon name="plus" size={20} /></button>
                  </div>
                  <strong className="num text-lg">{money(l.price * l.qty)}</strong>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="card p-4 sm:p-5 space-y-4 lg:sticky lg:top-28 min-w-0">
          <h2 className="text-xl">ملخص الطلب</h2>

          <div>
            {gap > 0 ? (
              <p className="text-[0.95rem]">أضف بـ <strong className="num">{money(gap)}</strong> وتحصل على <strong>توصيل مجاني</strong></p>
            ) : (
              <p className="text-leaf font-semibold">مبروك! طلبك مؤهل للتوصيل المجاني</p>
            )}
            <div className="h-3 rounded-full bg-mint mt-2 overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full bg-leaf rounded-full transition-[width] duration-300" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <dl className="space-y-2 text-[1.02rem]">
            <div className="flex justify-between"><dt>مجموع المنتجات</dt><dd className="num font-semibold">{money(subtotal)}</dd></div>
            <div className="flex justify-between text-muted text-sm"><dt>الشحن والخصم</dt><dd>يظهر في الخطوة التالية</dd></div>
          </dl>
          <p className="hint">الأسعار شاملة ضريبة القيمة المضافة ١٥٪</p>

          {needsRx && (
            <div className="rounded-2xl bg-amber-soft p-3 text-[0.92rem] flex gap-2">
              <Icon name="rx" className="shrink-0 text-[#c45500]" />
              <span>سلتك فيها دواء بوصفة. بتحتاج ترفع صورة الوصفة في خطوة الدفع.</span>
            </div>
          )}

          <Link href="/checkout" className="btn btn-primary btn-lg w-full">أكمل الطلب</Link>
          <Link href="/products" className="btn btn-ghost w-full">كمّل التسوق</Link>
        </aside>
      </div>
    </div>
  );
}
