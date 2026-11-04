"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CITIES } from "@/lib/config";
import type { Address } from "@/lib/types";
import { useCart } from "@/components/CartProvider";
import Icon from "@/components/Icon";

export default function AccountClient({ user, addresses }: { user: { name: string; phone: string }; addresses: Address[] }) {
  const router = useRouter();
  const { toast } = useCart();
  const [name, setName] = useState(user.name);
  const [adding, setAdding] = useState(false);
  const [err, setErr] = useState("");
  const [f, setF] = useState({ label: "", name: user.name, phone: user.phone, city: "", district: "", street: "", nationalAddress: "", landmark: "" });

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
    const d = await r.json();
    if (!r.ok) return toast(d.error, "err");
    toast("تم حفظ اسمك");
    router.refresh();
  }

  async function addAddress(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const r = await fetch("/api/addresses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    const d = await r.json();
    if (!r.ok) return setErr(d.error);
    setAdding(false);
    toast("تمت إضافة العنوان");
    router.refresh();
  }

  async function del(id: string) {
    const r = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    if (r.ok) {
      toast("تم حذف العنوان");
      router.refresh();
    }
  }
  async function makeDefault(id: string) {
    const r = await fetch(`/api/addresses/${id}`, { method: "PATCH" });
    if (r.ok) router.refresh();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  }

  const up = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }));

  return (
    <>
      <section className="card p-5 sm:p-6" aria-labelledby="prof">
        <h2 id="prof" className="text-xl mb-4">بياناتي</h2>
        <form onSubmit={saveName} className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
          <div><label className="label" htmlFor="pn">الاسم</label><input id="pn" className="field" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><label className="label" htmlFor="pp">الجوال</label><input id="pp" className="field num text-start" dir="ltr" value={user.phone} readOnly /></div>
          <button className="btn btn-ink">حفظ</button>
        </form>
      </section>

      <section className="card p-5 sm:p-6" aria-labelledby="addrs">
        <div className="flex items-center justify-between mb-4">
          <h2 id="addrs" className="text-xl">عناويني</h2>
          {!adding && <button className="btn btn-ghost btn-sm" onClick={() => setAdding(true)}><Icon name="plus" size={18} /> عنوان جديد</button>}
        </div>

        {addresses.length === 0 && !adding && <p className="text-muted">ما عندك عناوين محفوظة.</p>}
        <ul className="grid sm:grid-cols-2 gap-3">
          {addresses.map((a) => (
            <li key={a.id} className="rounded-2xl border-2 border-line p-4 space-y-1">
              <div className="flex items-center justify-between">
                <strong>{a.label}</strong>
                {a.isDefault ? <span className="badge bg-mint text-leaf-dark">الأساسي</span> : (
                  <button className="text-leaf font-semibold underline underline-offset-4" onClick={() => makeDefault(a.id)}>اجعله أساسي</button>
                )}
              </div>
              <p>{a.city}{a.district ? `، ${a.district}` : ""}</p>
              {a.landmark && <p className="text-sm text-muted">{a.landmark}</p>}
              {a.nationalAddress && <p className="text-sm">العنوان الوطني: <span className="num font-semibold">{a.nationalAddress}</span></p>}
              <button className="text-coral font-semibold underline underline-offset-4 min-h-10" onClick={() => del(a.id)}>حذف</button>
            </li>
          ))}
        </ul>

        {adding && (
          <form onSubmit={addAddress} className="grid sm:grid-cols-2 gap-4 mt-4 border-t border-line pt-5">
            <div><label className="label" htmlFor="al">اسم العنوان</label><input id="al" className="field" placeholder="البيت، العمل، المزرعة..." value={f.label} onChange={(e) => up("label", e.target.value)} /></div>
            <div><label className="label" htmlFor="an">اسم المستلم</label><input id="an" className="field" value={f.name} onChange={(e) => up("name", e.target.value)} /></div>
            <div><label className="label" htmlFor="ap">جوال المستلم</label><input id="ap" className="field num text-start" dir="ltr" value={f.phone} onChange={(e) => up("phone", e.target.value)} /></div>
            <div>
              <label className="label" htmlFor="ac">المدينة</label>
              <select id="ac" className="field" value={f.city} onChange={(e) => up("city", e.target.value)}>
                <option value="">اختر المدينة</option>
                {CITIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><label className="label" htmlFor="ad">الحي أو القرية</label><input id="ad" className="field" value={f.district} onChange={(e) => up("district", e.target.value)} /></div>
            <div><label className="label" htmlFor="ana">العنوان الوطني (اختياري)</label><input id="ana" className="field num text-start uppercase" dir="ltr" maxLength={8} placeholder="RYAS2345" value={f.nationalAddress} onChange={(e) => up("nationalAddress", e.target.value)} /></div>
            <div className="sm:col-span-2"><label className="label" htmlFor="alm">وصف الموقع وأقرب معلم</label><textarea id="alm" rows={2} className="field" value={f.landmark} onChange={(e) => up("landmark", e.target.value)} /></div>
            {err && <p className="err sm:col-span-2" role="alert">{err}</p>}
            <div className="sm:col-span-2 flex gap-2">
              <button className="btn btn-primary">احفظ العنوان</button>
              <button type="button" className="btn btn-ghost" onClick={() => setAdding(false)}>إلغاء</button>
            </div>
          </form>
        )}
      </section>

      <button onClick={logout} className="btn btn-ghost w-full sm:w-auto">تسجيل الخروج</button>
    </>
  );
}
