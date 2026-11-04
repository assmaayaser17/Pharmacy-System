"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function post(url: string, body: object) {
    setBusy(true);
    setError("");
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) {
      setError(data.error ?? "صار خطأ، حاول مرة ثانية");
      return null;
    }
    return data;
  }

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    const d = await post("/api/auth/otp", { phone });
    if (d) {
      setPhone(d.phone);
      setIsNew(d.isNew);
      setStep("code");
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    const d = await post("/api/auth/verify", { phone, code, name });
    if (d) {
      router.replace(next);
      router.refresh();
    }
  }

  return step === "phone" ? (
    <form onSubmit={sendCode} className="space-y-5" noValidate>
      <div>
        <h1 className="text-2xl">أهلًا بك</h1>
        <p className="text-muted mt-1">اكتب رقم جوالك ونرسل لك رمز دخول، بدون كلمة مرور.</p>
      </div>
      <div>
        <label htmlFor="phone" className="label">رقم الجوال</label>
        <input
          id="phone"
          className="field num text-start text-xl tracking-wide"
          dir="ltr"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="05xxxxxxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoFocus
        />
      </div>
      {error && <p className="err" role="alert">{error}</p>}
      <button className="btn btn-primary btn-lg w-full" disabled={busy}>{busy ? "جاري الإرسال..." : "أرسل لي الرمز"}</button>
      <p className="hint rounded-2xl bg-mint-2 p-3">
        نسخة تجربة: جرّب <strong className="num">0501234567</strong> (عميل) أو <strong className="num">0500000000</strong> (مدير). الرمز دائمًا <strong className="num">1234</strong>.
      </p>
    </form>
  ) : (
    <form onSubmit={verify} className="space-y-5" noValidate>
      <div>
        <h1 className="text-2xl">اكتب الرمز</h1>
        <p className="text-muted mt-1">أرسلنا رمزًا من ٤ أرقام إلى <span className="num font-semibold">{phone}</span></p>
      </div>
      {isNew && (
        <div>
          <label htmlFor="name" className="label">اسمك</label>
          <input id="name" className="field" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: محمد العتيبي" />
        </div>
      )}
      <div>
        <label htmlFor="code" className="label">رمز التحقق</label>
        <input
          id="code"
          className="field num text-center text-3xl tracking-[0.5em]"
          dir="ltr"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={4}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoFocus
        />
      </div>
      {error && <p className="err" role="alert">{error}</p>}
      <button className="btn btn-primary btn-lg w-full" disabled={busy}>{busy ? "جاري التحقق..." : "ادخل"}</button>
      <button type="button" className="btn btn-ghost w-full" onClick={() => { setStep("phone"); setCode(""); setError(""); }}>
        غيّر الرقم
      </button>
    </form>
  );
}
