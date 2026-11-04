"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";
import Icon from "./Icon";

export default function OrderActions({
  orderId,
  canCancel,
  reorder,
}: {
  orderId: string;
  canCancel: boolean;
  reorder: { product: Product; qty: number }[];
}) {
  const router = useRouter();
  const { add, toast } = useCart();
  const [busy, setBusy] = useState(false);

  async function cancel() {
    if (!confirm("متأكد إنك تبغى تلغي الطلب؟")) return;
    setBusy(true);
    const r = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
    setBusy(false);
    const d = await r.json().catch(() => ({}));
    if (!r.ok) return toast(d.error ?? "تعذّر إلغاء الطلب", "err");
    toast("تم إلغاء الطلب");
    router.refresh();
  }

  function again() {
    const ok = reorder.filter((x) => x.product.stock > 0);
    ok.forEach((x) => add(x.product, x.qty));
    if (!ok.length) toast("المنتجات غير متوفرة حاليًا", "err");
    else router.push("/cart");
  }

  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <button className="btn btn-primary" onClick={again}>
        <Icon name="cart" size={20} /> اطلبه مرة ثانية
      </button>
      <button className="btn btn-ghost" onClick={() => window.print()}>
        <Icon name="box" size={20} /> اطبع الفاتورة
      </button>
      {canCancel && (
        <button className="btn btn-ghost !text-coral !border-coral/40" onClick={cancel} disabled={busy}>
          إلغاء الطلب
        </button>
      )}
    </div>
  );
}
