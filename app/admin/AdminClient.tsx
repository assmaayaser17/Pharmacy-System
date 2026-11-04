"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ORDER_STEPS, PAYMENTS } from "@/lib/config";
import { dateAr, money } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/status";
import { useCart } from "@/components/CartProvider";

type AOrder = { id: string; number: string; customer: string; city: string; total: number; status: string; paymentId: string; createdAt: string; rx: boolean };
type AProduct = { id: string; nameAr: string; brand: string; cat: string; price: number; oldPrice?: number; stock: number; rx: boolean };

export default function AdminClient({ orders, products, categories }: { orders: AOrder[]; products: AProduct[]; categories: { slug: string; name: string }[] }) {
  const router = useRouter();
  const { toast } = useCart();
  const [tab, setTab] = useState<"orders" | "products">("orders");
  const [q, setQ] = useState("");
  const [add, setAdd] = useState({ nameAr: "", brand: "", cat: categories[0].slug, price: "", stock: "20" });

  async function setStatus(id: string, status: string) {
    const r = await fetch(`/api/admin/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    if (r.ok) {
      toast("تم تحديث حالة الطلب");
      router.refresh();
    } else toast((await r.json()).error, "err");
  }

  async function patchProduct(id: string, body: object) {
    const r = await fetch(`/api/admin/products/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (r.ok) {
      toast("تم الحفظ");
      router.refresh();
    } else toast((await r.json()).error, "err");
  }

  async function remove(id: string) {
    if (!confirm("حذف المنتج نهائيًا؟")) return;
    const r = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (r.ok) {
      toast("تم حذف المنتج");
      router.refresh();
    }
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...add, price: Number(add.price), stock: Number(add.stock) }),
    });
    const d = await r.json();
    if (!r.ok) return toast(d.error, "err");
    toast("تمت إضافة المنتج");
    setAdd({ nameAr: "", brand: "", cat: categories[0].slug, price: "", stock: "20" });
    router.refresh();
  }

  const list = products.filter((p) => !q || p.nameAr.includes(q) || p.brand.includes(q));

  return (
    <div className="space-y-4">
      <div role="tablist" className="flex gap-2">
        {(["orders", "products"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`btn ${tab === t ? "btn-ink" : "btn-ghost"}`}>
            {t === "orders" ? "الطلبات" : "المنتجات والمخزون"}
          </button>
        ))}
      </div>

      {tab === "orders" ? (
        <div className="card relative overflow-x-auto">
          <table className="w-full text-start min-w-[44rem]">
            <thead className="bg-paper text-muted text-sm">
              <tr>{["الطلب", "العميل", "المدينة", "الدفع", "الإجمالي", "الحالة"].map((h) => <th key={h} className="p-3 text-start font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="p-3">
                    <Link href={`/orders/${o.id}`} className="font-bold num hover:text-leaf">{o.number}</Link>
                    <span className="block text-xs text-muted">{dateAr(o.createdAt)} {o.rx && "· وصفة"}</span>
                  </td>
                  <td className="p-3">{o.customer}</td>
                  <td className="p-3">{o.city}</td>
                  <td className="p-3">{PAYMENTS.find((p) => p.id === o.paymentId)?.name}</td>
                  <td className="p-3 num font-semibold">{money(o.total)}</td>
                  <td className="p-3">
                    <label className="sr-only" htmlFor={`st-${o.id}`}>حالة الطلب {o.number}</label>
                    <select id={`st-${o.id}`} className={`field !min-h-10 !py-1 !w-auto ${STATUS_LABEL[o.status].cls}`} value={o.status} onChange={(e) => setStatus(o.id, e.target.value)}>
                      {ORDER_STEPS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                      <option value="cancelled">ملغي</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-4">
          <form onSubmit={addProduct} className="card p-4 grid sm:grid-cols-6 gap-3 items-end">
            <div className="sm:col-span-2"><label className="label" htmlFor="ap-n">اسم المنتج</label><input id="ap-n" className="field" value={add.nameAr} onChange={(e) => setAdd({ ...add, nameAr: e.target.value })} required /></div>
            <div><label className="label" htmlFor="ap-b">الماركة</label><input id="ap-b" className="field" value={add.brand} onChange={(e) => setAdd({ ...add, brand: e.target.value })} /></div>
            <div><label className="label" htmlFor="ap-c">القسم</label>
              <select id="ap-c" className="field" value={add.cat} onChange={(e) => setAdd({ ...add, cat: e.target.value })}>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
            </div>
            <div><label className="label" htmlFor="ap-p">السعر</label><input id="ap-p" className="field num" type="number" step="0.01" min="0" value={add.price} onChange={(e) => setAdd({ ...add, price: e.target.value })} required /></div>
            <div className="flex gap-2 items-end"><div className="flex-1"><label className="label" htmlFor="ap-s">الكمية</label><input id="ap-s" className="field num" type="number" min="0" value={add.stock} onChange={(e) => setAdd({ ...add, stock: e.target.value })} /></div><button className="btn btn-primary">أضف</button></div>
          </form>

          <input className="field max-w-sm" placeholder="ابحث في المنتجات..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="بحث في المنتجات" />

          <div className="card relative overflow-x-auto">
            <table className="w-full min-w-[40rem]">
              <thead className="bg-paper text-muted text-sm"><tr>{["المنتج", "السعر", "المخزون", ""].map((h, i) => <th key={i} className="p-3 text-start font-semibold">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-line">
                {list.map((p) => (
                  <tr key={p.id}>
                    <td className="p-3"><strong>{p.nameAr}</strong><span className="block text-xs text-muted">{p.brand} {p.rx && "· بوصفة"}</span></td>
                    <td className="p-3">
                      <input aria-label={`سعر ${p.nameAr}`} className="field num !min-h-10 !w-28" type="number" step="0.01" defaultValue={p.price} onBlur={(e) => Number(e.target.value) !== p.price && patchProduct(p.id, { price: Number(e.target.value) })} />
                    </td>
                    <td className="p-3">
                      <input aria-label={`مخزون ${p.nameAr}`} className={`field num !min-h-10 !w-24 ${p.stock <= 8 ? "!border-coral" : ""}`} type="number" min="0" defaultValue={p.stock} onBlur={(e) => Number(e.target.value) !== p.stock && patchProduct(p.id, { stock: Number(e.target.value) })} />
                    </td>
                    <td className="p-3"><button className="text-coral font-semibold underline underline-offset-4" onClick={() => remove(p.id)}>حذف</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
