"use client";

import Link from "next/link";
import { useState } from "react";
import { dateAr } from "@/lib/format";
import type { Prescription } from "@/lib/types";
import { useCart } from "@/components/CartProvider";
import Icon from "@/components/Icon";

export default function PrescriptionClient({ loggedIn, initial }: { loggedIn: boolean; initial: Prescription[] }) {
  const [list, setList] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useCart();

  if (!loggedIn)
    return (
      <div className="card p-8 text-center space-y-4">
        <Icon name="lock" size={40} className="mx-auto text-leaf" />
        <p className="text-lg font-semibold">سجّل دخولك برقم جوالك عشان ترفع الوصفة</p>
        <Link href="/login?next=/prescription" className="btn btn-primary btn-lg">تسجيل الدخول</Link>
      </div>
    );

  async function upload(file: File) {
    setBusy(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/prescriptions", { method: "POST", body: fd });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) return setError(d.error ?? "تعذّر رفع الملف");
    setList((l) => [d.prescription, ...l]);
    toast("وصلتنا الوصفة وراجعها الصيدلاني");
  }

  return (
    <div className="space-y-4">
      <label className="card !border-2 !border-dashed !border-leaf bg-mint-2 p-8 sm:p-12 text-center cursor-pointer block hover:bg-mint transition-colors">
        <Icon name="upload" size={48} className="mx-auto text-leaf" />
        <span className="block text-xl font-bold mt-3">{busy ? "جاري الرفع..." : "اضغط هنا لتصوير أو اختيار الوصفة"}</span>
        <span className="block text-muted mt-1">صورة JPG أو PNG أو ملف PDF، حتى ٥ ميجا</span>
        <input
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          capture="environment"
          className="sr-only"
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
      </label>
      {error && <p className="err" role="alert">{error}</p>}

      {list.length > 0 && (
        <section aria-labelledby="mine" className="card p-5">
          <h2 id="mine" className="text-lg mb-3">وصفاتي</h2>
          <ul className="divide-y divide-line">
            {list.map((r) => (
              <li key={r.id} className="py-3 flex items-center gap-3">
                <Icon name="rx" className="text-leaf shrink-0" />
                <span className="flex-1 min-w-0"><span className="block truncate">{r.fileName}</span><span className="text-sm text-muted">{dateAr(r.createdAt)}</span></span>
                <span className="badge bg-mint text-leaf-dark">تمت المراجعة</span>
              </li>
            ))}
          </ul>
          <Link href="/products?category=prescription" className="btn btn-primary w-full mt-4">اختر أدويتك واكمل الطلب</Link>
        </section>
      )}
    </div>
  );
}
