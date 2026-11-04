"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { CITIES, PAYMENTS } from "@/lib/config";
import { money } from "@/lib/format";
import { computeTotals, shippingOptionsFor } from "@/lib/pricing";
import type { Address, Prescription } from "@/lib/types";
import { useCart } from "@/components/CartProvider";
import Icon from "@/components/Icon";
import ProductArt from "@/components/ProductArt";

type Props = {
  user: { name: string; phone: string };
  addresses: Address[];
  prescriptions: Prescription[];
};

type Form = {
  name: string;
  phone: string;
  city: string; // city id
  district: string;
  street: string;
  nationalAddress: string;
  landmark: string;
  lat?: number;
  lng?: number;
};

function Section({ n, title, children, done }: { n: number; title: string; children: React.ReactNode; done?: boolean }) {
  return (
    <section className="card p-5 sm:p-6 space-y-4" aria-labelledby={`s${n}`}>
      <h2 id={`s${n}`} className="text-xl flex items-center gap-3">
        <span className={`num grid place-items-center size-9 rounded-full text-base font-bold ${done ? "bg-leaf text-white" : "bg-ink text-white"}`}>
          {done ? <Icon name="check" size={20} /> : n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function CheckoutClient({ user, addresses, prescriptions: initialRx }: Props) {
  const router = useRouter();
  const { lines, ready, subtotal, needsRx, clear, toast } = useCart();
  const hasCold = lines.some((l) => l.cold);

  const def = addresses.find((a) => a.isDefault) ?? addresses[0];
  const cityIdOf = (name?: string) => CITIES.find((c) => c.name === name)?.id ?? "";
  const [selected, setSelected] = useState<string>(def?.id ?? "new");
  const [form, setForm] = useState<Form>(
    def
      ? {
          name: def.name,
          phone: def.phone,
          city: cityIdOf(def.city),
          district: def.district,
          street: def.street,
          nationalAddress: def.nationalAddress ?? "",
          landmark: def.landmark ?? "",
          lat: def.lat,
          lng: def.lng,
        }
      : { name: user.name, phone: user.phone, city: "", district: "", street: "", nationalAddress: "", landmark: "" },
  );
  const [saveAddr, setSaveAddr] = useState(addresses.length === 0);
  const [shippingId, setShippingId] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [note, setNote] = useState("");
  const [rxList, setRxList] = useState(initialRx);
  const [rxId, setRxId] = useState(initialRx[0]?.id ?? "");
  const [rxBusy, setRxBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);
  const [gateway, setGateway] = useState(false);
  const [locating, setLocating] = useState(false);
  const placing = useRef(false);

  const options = useMemo(() => {
    const all = form.city ? shippingOptionsFor(form.city) : [];
    return hasCold ? all.filter((o) => o.id !== "standard") : all;
  }, [form.city, hasCold]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!options.length) return setShippingId("");
    if (!options.some((o) => o.id === shippingId)) setShippingId(options[0].id);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [options, shippingId]);

  const totals = computeTotals({ subtotal, shippingId, paymentId, coupon: appliedCoupon });
  const pay = PAYMENTS.find((p) => p.id === paymentId);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  function pickAddress(id: string) {
    setSelected(id);
    if (id === "new") {
      setForm({ name: user.name, phone: user.phone, city: "", district: "", street: "", nationalAddress: "", landmark: "" });
      setSaveAddr(true);
      return;
    }
    const a = addresses.find((x) => x.id === id)!;
    setForm({
      name: a.name,
      phone: a.phone,
      city: cityIdOf(a.city),
      district: a.district,
      street: a.street,
      nationalAddress: a.nationalAddress ?? "",
      landmark: a.landmark ?? "",
      lat: a.lat,
      lng: a.lng,
    });
    setSaveAddr(false);
    setErrors({});
  }

  function locate() {
    if (!navigator.geolocation) return toast("جوالك ما يدعم تحديد الموقع", "err");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setForm((f) => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude }));
        toast("تم تحديد موقعك، يساعد المندوب يوصلك أسرع");
      },
      () => {
        setLocating(false);
        toast("ما قدرنا نحدد موقعك. اكتب أقرب معلم بدل ذلك", "err");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function uploadRx(file: File) {
    setRxBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/prescriptions", { method: "POST", body: fd });
    const d = await r.json().catch(() => ({}));
    setRxBusy(false);
    if (!r.ok) return setErrors((e) => ({ ...e, rx: d.error ?? "تعذّر رفع الملف" }));
    setRxList((l) => [d.prescription, ...l]);
    setRxId(d.prescription.id);
    setErrors((e) => ({ ...e, rx: "" }));
    toast("وصلتنا الوصفة وراجعها الصيدلاني");
  }

  async function applyCoupon() {
    const r = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: coupon, subtotal }),
    });
    const d = await r.json();
    if (d.valid) {
      setAppliedCoupon(d.code);
      setErrors((e) => ({ ...e, coupon: "" }));
      toast(`تم تطبيق الكود: ${d.label}`);
    } else {
      setAppliedCoupon("");
      setErrors((e) => ({ ...e, coupon: d.error }));
    }
  }

  function validate() {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "اكتب اسم المستلم";
    if (!/^(05\d{8}|\+?9665\d{8}|5\d{8})$/.test(form.phone.replace(/[\s-]/g, ""))) e.phone = "اكتب رقم جوال سعودي صحيح مثل 05xxxxxxxx";
    if (!form.city) e.city = "اختر المدينة";
    if (!form.district.trim() && !form.landmark.trim()) e.landmark = "اكتب اسم الحي أو وصف الموقع وأقرب معلم";
    if (form.nationalAddress && !/^[A-Za-z]{4}\d{4}$/.test(form.nationalAddress.trim())) e.nationalAddress = "العنوان الوطني ٤ حروف و٤ أرقام مثل RYAS2345";
    if (needsRx && !rxId) e.rx = "ارفع صورة الوصفة الطبية عشان نكمل";
    if (!shippingId) e.shipping = "اختر طريقة التوصيل";
    if (!paymentId) e.payment = "اختر طريقة الدفع";
    if (pay?.minTotal && totals.total < pay.minTotal) e.payment = `${pay.name} متاحة للطلبات من ${pay.minTotal} ر.س`;
    setErrors(e);
    if (Object.keys(e).length) {
      const first = document.querySelector("[data-err='1']") ?? document.querySelector(".err");
      setTimeout(() => (document.querySelector("[data-err='1']") ?? first)?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
    }
    return Object.keys(e).length === 0;
  }

  function submit() {
    setServerError("");
    if (!validate()) return;
    if (paymentId === "cod") return placeOrder();
    setGateway(true);
  }

  async function placeOrder(token?: string) {
    if (placing.current) return;
    placing.current = true;
    setBusy(true);
    setServerError("");
    try {
      if (saveAddr) {
        await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, label: "عنوان التوصيل" }),
        });
      }
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ id: l.id, qty: l.qty })),
          address: form,
          shippingId,
          paymentId,
          paymentToken: token,
          coupon: appliedCoupon || undefined,
          prescriptionId: needsRx ? rxId : undefined,
          note: note || undefined,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        setGateway(false);
        setServerError(d.error ?? "ما قدرنا نكمل الطلب، حاول مرة ثانية");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      clear();
      router.replace(`/orders/${d.order.id}?new=1`);
      router.refresh();
    } finally {
      placing.current = false;
      setBusy(false);
    }
  }

  if (!ready) return <div className="container-x py-16 text-center text-muted">جاري التحميل...</div>;
  if (lines.length === 0)
    return (
      <div className="container-x py-16 text-center space-y-4">
        <h1 className="text-2xl">سلتك فاضية</h1>
        <Link href="/products" className="btn btn-primary btn-lg">تصفّح المنتجات</Link>
      </div>
    );

  const fieldErr = (k: string) => (errors[k] ? <p className="err mt-1" data-err="1" role="alert">{errors[k]}</p> : null);
  const payGroups: { id: "cash" | "now" | "bnpl"; title: string }[] = [
    { id: "cash", title: "كاش" },
    { id: "now", title: "ادفع الآن" },
    { id: "bnpl", title: "قسّمها بدون فوائد" },
  ];

  return (
    <div className="container-x py-6 lg:py-10">
      <h1 className="text-2xl lg:text-3xl mb-1">إتمام الطلب</h1>
      <p className="text-muted mb-6">كل شيء في صفحة وحدة، وما تحتاج تعبّي إلا المطلوب.</p>

      {serverError && (
        <div className="rounded-2xl bg-coral-soft text-coral p-4 mb-5 font-medium" role="alert">{serverError}</div>
      )}

      <div className="grid lg:grid-cols-[1fr_24rem] gap-6 items-start">
        <div className="space-y-5">
          {/* ١) العنوان */}
          <Section n={1} title="وين نوصّل الطلب؟" done={!!form.city && (!!form.district || !!form.landmark)}>
            {addresses.length > 0 && (
              <div role="radiogroup" aria-label="عناوينك المحفوظة" className="grid sm:grid-cols-2 gap-2">
                {addresses.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    role="radio"
                    aria-checked={selected === a.id}
                    onClick={() => pickAddress(a.id)}
                    className={`text-start rounded-2xl border-2 p-3 transition-colors ${selected === a.id ? "border-leaf bg-mint-2" : "border-line bg-white"}`}
                  >
                    <strong className="block">{a.label}</strong>
                    <span className="text-sm text-muted">{a.city}، {a.district || a.landmark}</span>
                  </button>
                ))}
                <button
                  type="button"
                  role="radio"
                  aria-checked={selected === "new"}
                  onClick={() => pickAddress("new")}
                  className={`text-start rounded-2xl border-2 border-dashed p-3 ${selected === "new" ? "border-leaf bg-mint-2" : "border-line bg-white"}`}
                >
                  <strong className="flex items-center gap-1"><Icon name="plus" size={18} /> عنوان جديد</strong>
                </button>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="c-name" className="label">اسم المستلم</label>
                <input id="c-name" className="field" autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} />
                {fieldErr("name")}
              </div>
              <div>
                <label htmlFor="c-phone" className="label">جوال المستلم</label>
                <input id="c-phone" className="field num text-start" dir="ltr" inputMode="tel" autoComplete="tel" placeholder="05xxxxxxxx" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                {fieldErr("phone")}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="c-city" className="label">المدينة</label>
                <select id="c-city" className="field" value={form.city} onChange={(e) => set("city", e.target.value)}>
                  <option value="">اختر المدينة</option>
                  {CITIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <p className="hint mt-1">قريتك أو هجرتك مو في القائمة؟ اختر «قرية أو هجرة» واكتب اسمها في وصف الموقع، ونوصلك بالتوصيل العادي.</p>
                {fieldErr("city")}
              </div>
              <div>
                <label htmlFor="c-district" className="label">الحي أو القرية</label>
                <input id="c-district" className="field" value={form.district} onChange={(e) => set("district", e.target.value)} />
              </div>
              <div>
                <label htmlFor="c-street" className="label">الشارع (اختياري)</label>
                <input id="c-street" className="field" value={form.street} onChange={(e) => set("street", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="c-land" className="label">وصف الموقع وأقرب معلم</label>
                <textarea
                  id="c-land"
                  rows={2}
                  className="field"
                  placeholder="مثال: بعد مسجد الرحمة، البيت الأخضر على يمين الطريق الترابي"
                  value={form.landmark}
                  onChange={(e) => set("landmark", e.target.value)}
                />
                {fieldErr("landmark")}
              </div>
              <div>
                <label htmlFor="c-na" className="label">العنوان الوطني (اختياري)</label>
                <input id="c-na" className="field num text-start uppercase" dir="ltr" maxLength={8} placeholder="RYAS2345" value={form.nationalAddress} onChange={(e) => set("nationalAddress", e.target.value)} />
                {fieldErr("nationalAddress")}
              </div>
              <div className="flex flex-col justify-end">
                <button type="button" onClick={locate} disabled={locating} className="btn btn-ghost">
                  <Icon name="locate" size={22} />
                  {locating ? "جاري التحديد..." : form.lat ? "تم تحديد موقعك ✓" : "شارك موقعي الحالي"}
                </button>
              </div>
            </div>

            {(selected === "new" || addresses.length === 0) && (
              <label className="flex items-center gap-3 min-h-11 cursor-pointer">
                <input type="checkbox" className="size-5 accent-[#007185]" checked={saveAddr} onChange={(e) => setSaveAddr(e.target.checked)} />
                احفظ هذا العنوان للطلبات الجاية
              </label>
            )}
          </Section>

          {/* ٢) الوصفة */}
          {needsRx && (
            <Section n={2} title="الوصفة الطبية" done={!!rxId}>
              <p className="text-muted">في طلبك دواء يحتاج وصفة. صوّر الوصفة بوضوح (يظهر اسم الطبيب والتاريخ) وارفعها، والصيدلاني يراجعها.</p>
              {rxList.length > 0 && (
                <div role="radiogroup" aria-label="وصفاتك" className="space-y-2">
                  {rxList.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      role="radio"
                      aria-checked={rxId === r.id}
                      onClick={() => setRxId(r.id)}
                      className={`w-full text-start rounded-2xl border-2 p-3 flex items-center gap-3 ${rxId === r.id ? "border-leaf bg-mint-2" : "border-line bg-white"}`}
                    >
                      <Icon name="rx" className="text-leaf shrink-0" />
                      <span className="flex-1 min-w-0 truncate">{r.fileName}</span>
                      <span className="badge bg-mint text-leaf-dark">تمت المراجعة</span>
                    </button>
                  ))}
                </div>
              )}
              <label className="btn btn-ghost w-full cursor-pointer">
                <Icon name="upload" />
                {rxBusy ? "جاري الرفع..." : rxList.length ? "ارفع وصفة ثانية" : "اختر صورة الوصفة أو صوّرها"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  capture="environment"
                  className="sr-only"
                  disabled={rxBusy}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadRx(f);
                    e.target.value = "";
                  }}
                />
              </label>
              {fieldErr("rx")}
            </Section>
          )}

          {/* ٣) التوصيل */}
          <Section n={needsRx ? 3 : 2} title="طريقة التوصيل" done={!!shippingId}>
            {!form.city ? (
              <p className="text-muted">اختر المدينة أولًا عشان نعرض لك الخيارات المتاحة.</p>
            ) : (
              <div role="radiogroup" aria-label="طريقة التوصيل" className="space-y-2">
                {options.map((o) => {
                  const price = computeTotals({ subtotal, shippingId: o.id, coupon: appliedCoupon }).shipping;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      role="radio"
                      aria-checked={shippingId === o.id}
                      onClick={() => { setShippingId(o.id); setErrors((e) => ({ ...e, shipping: "" })); }}
                      className={`w-full text-start rounded-2xl border-2 p-4 flex items-center gap-3 ${shippingId === o.id ? "border-leaf bg-mint-2" : "border-line bg-white"}`}
                    >
                      <span className={`grid place-items-center size-6 rounded-full border-2 shrink-0 ${shippingId === o.id ? "border-leaf bg-leaf text-white" : "border-line"}`}>
                        {shippingId === o.id && <Icon name="check" size={14} />}
                      </span>
                      <span className="flex-1">
                        <strong className="block">{o.name} <span className="text-leaf font-medium">· {o.eta}</span></strong>
                        <span className="text-sm text-muted">{o.desc}</span>
                      </span>
                      <strong className="num whitespace-nowrap">{price === 0 ? "مجاني" : money(price)}</strong>
                    </button>
                  );
                })}
                {hasCold && <p className="hint">سلتك فيها دواء يُحفظ مبرّدًا، فالتوصيل العادي غير متاح له.</p>}
              </div>
            )}
            {fieldErr("shipping")}
          </Section>

          {/* ٤) الدفع */}
          <Section n={needsRx ? 4 : 3} title="طريقة الدفع" done={!!paymentId}>
            <div className="space-y-4">
              {payGroups.map((g) => (
                <div key={g.id}>
                  <p className="font-semibold text-muted mb-2">{g.title}</p>
                  <div role="radiogroup" aria-label={g.title} className="grid sm:grid-cols-2 gap-2">
                    {PAYMENTS.filter((p) => p.group === g.id).map((p) => {
                      const disabled = !!p.minTotal && totals.total < p.minTotal;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          role="radio"
                          aria-checked={paymentId === p.id}
                          disabled={disabled}
                          onClick={() => { setPaymentId(p.id); setErrors((e) => ({ ...e, payment: "" })); }}
                          className={`text-start rounded-2xl border-2 p-3.5 flex items-center gap-3 disabled:opacity-50 ${paymentId === p.id ? "border-leaf bg-mint-2" : "border-line bg-white"}`}
                        >
                          <span className={`grid place-items-center size-6 rounded-full border-2 shrink-0 ${paymentId === p.id ? "border-leaf bg-leaf text-white" : "border-line"}`}>
                            {paymentId === p.id && <Icon name="check" size={14} />}
                          </span>
                          <span className="flex-1">
                            <strong className="block">{p.name}</strong>
                            <span className="text-sm text-muted">
                              {disabled ? `للطلبات من ${p.minTotal} ر.س` : p.desc}
                              {p.fee ? ` · رسوم ${p.fee} ر.س` : ""}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {fieldErr("payment")}
          </Section>

          {/* كود الخصم والملاحظات */}
          <section className="card p-5 sm:p-6 grid sm:grid-cols-2 gap-5" aria-label="خصم وملاحظات">
            <div>
              <label htmlFor="coupon" className="label">عندك كود خصم؟</label>
              <div className="flex gap-2">
                <input id="coupon" className="field uppercase" dir="ltr" placeholder="SHIFA10" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                <button type="button" className="btn btn-ink" onClick={applyCoupon} disabled={!coupon.trim()}>طبّق</button>
              </div>
              {errors.coupon && <p className="err mt-1" role="alert">{errors.coupon}</p>}
              {appliedCoupon && <p className="text-leaf font-semibold mt-1">تم تطبيق {appliedCoupon}</p>}
            </div>
            <div>
              <label htmlFor="note" className="label">ملاحظات للمندوب (اختياري)</label>
              <textarea id="note" rows={2} className="field" placeholder="مثال: اتصل قبل ما توصل" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          </section>
        </div>

        {/* الملخص */}
        <aside className="card p-5 space-y-4 lg:sticky lg:top-28">
          <h2 className="text-xl">طلبك</h2>
          <ul className="space-y-3 max-h-64 overflow-auto pe-1">
            {lines.map((l) => (
              <li key={l.id} className="flex items-center gap-3">
                <span className="rounded-xl shrink-0" style={{ background: l.art.c2 }}>
                  <ProductArt art={l.art} label="" className="size-14 p-1" />
                </span>
                <span className="flex-1 min-w-0 text-[0.92rem] leading-snug">
                  {l.nameAr}
                  <span className="block text-muted text-sm">× <span className="num">{l.qty}</span></span>
                </span>
                <span className="num font-semibold text-sm">{money(l.price * l.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 border-t border-line pt-4">
            <div className="flex justify-between"><dt>المنتجات</dt><dd className="num">{money(totals.subtotal)}</dd></div>
            {totals.discount > 0 && <div className="flex justify-between text-leaf"><dt>الخصم</dt><dd className="num">- {money(totals.discount)}</dd></div>}
            <div className="flex justify-between"><dt>التوصيل</dt><dd className="num">{!shippingId ? "—" : totals.shipping === 0 ? "مجاني" : money(totals.shipping)}</dd></div>
            {totals.codFee > 0 && <div className="flex justify-between"><dt>رسوم الدفع عند الاستلام</dt><dd className="num">{money(totals.codFee)}</dd></div>}
            <div className="flex justify-between text-xl font-bold border-t border-line pt-3"><dt>الإجمالي</dt><dd className="num">{money(totals.total)}</dd></div>
            <div className="flex justify-between text-sm text-muted"><dt>منها ضريبة القيمة المضافة ١٥٪</dt><dd className="num">{money(totals.vat)}</dd></div>
          </dl>
          <button className="btn btn-primary btn-lg w-full" onClick={submit} disabled={busy}>
            {busy ? "جاري تأكيد الطلب..." : paymentId === "cod" ? "أكّد الطلب" : paymentId ? `ادفع ${money(totals.total)}` : "أكّد الطلب"}
          </button>
          <p className="hint text-center flex items-center justify-center gap-1.5"><Icon name="lock" size={16} /> بياناتك وعملية الدفع محمية</p>
        </aside>
      </div>

      {gateway && pay && (
        <MockGateway
          methodId={pay.id}
          methodName={pay.name}
          amount={totals.total}
          busy={busy}
          onClose={() => setGateway(false)}
          onSuccess={() => placeOrder(`mock_ok_${Date.now()}`)}
        />
      )}
    </div>
  );
}

/** بوابة دفع تجريبية: في الإنتاج تُستبدل بـ HyperPay / Moyasar / Tap / Checkout.com */
function MockGateway({
  methodId,
  methodName,
  amount,
  busy,
  onClose,
  onSuccess,
}: {
  methodId: string;
  methodName: string;
  amount: number;
  busy: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [failed, setFailed] = useState(false);
  const isCard = methodId === "card" || methodId === "mada";
  const bnpl = methodId === "tamara" || methodId === "tabby";
  const parts = methodId === "tamara" ? 3 : 4;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] bg-ink/60 grid place-items-end sm:place-items-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-label="الدفع">
      <div className="sheet-in bg-white w-full sm:max-w-md rounded-t-[28px] sm:rounded-[28px] p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl">الدفع عبر {methodName}</h2>
            <p className="text-sm text-muted">بوابة تجريبية، ما يتم خصم أي مبلغ فعلي</p>
          </div>
          <button onClick={onClose} className="grid place-items-center size-11 rounded-full hover:bg-paper" aria-label="إغلاق"><Icon name="close" /></button>
        </div>

        <div className="rounded-2xl bg-mint-2 p-4 flex justify-between items-center">
          <span>المبلغ</span>
          <strong className="num text-2xl">{money(amount)}</strong>
        </div>

        {isCard && (
          <div className="space-y-3">
            <div>
              <label className="label" htmlFor="cn">رقم البطاقة</label>
              <input id="cn" className="field num text-start" dir="ltr" defaultValue="4111 1111 1111 1111" inputMode="numeric" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label" htmlFor="ce">الانتهاء</label><input id="ce" className="field num text-start" dir="ltr" defaultValue="12/29" /></div>
              <div><label className="label" htmlFor="cv">CVV</label><input id="cv" className="field num text-start" dir="ltr" defaultValue="123" inputMode="numeric" /></div>
            </div>
          </div>
        )}
        {methodId === "applepay" && <p className="rounded-2xl bg-paper p-4 text-center">اضغط الزر وأكّد بـ Face ID أو Touch ID (محاكاة)</p>}
        {methodId === "stcpay" && <p className="rounded-2xl bg-paper p-4 text-center">سيصلك إشعار على تطبيق stc pay لتأكيد الدفع (محاكاة)</p>}
        {bnpl && (
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(5rem,1fr))] gap-2 text-center text-sm" aria-label="جدول الدفعات">
            {Array.from({ length: parts }, (_, i) => (
              <li key={i} className="rounded-2xl bg-paper p-3">
                <span className="block text-muted">{i === 0 ? "اليوم" : `بعد ${i} شهر`}</span>
                <strong className="num">{money(Math.round((amount / parts) * 100) / 100)}</strong>
              </li>
            ))}
          </ul>
        )}

        {failed && <p className="err" role="alert">ما تمت عملية الدفع. تأكد من بيانات البطاقة أو جرّب طريقة ثانية.</p>}

        <button className="btn btn-primary btn-lg w-full" onClick={onSuccess} disabled={busy}>
          {busy ? "جاري المعالجة..." : `ادفع ${money(amount)}`}
        </button>
        <button className="text-muted underline underline-offset-4 w-full min-h-10" onClick={() => setFailed(true)}>
          جرّب حالة فشل الدفع
        </button>
      </div>
    </div>
  );
}
