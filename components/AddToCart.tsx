"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { RX_MAX_QTY } from "@/lib/config";
import { useCart } from "./CartProvider";
import Icon from "./Icon";

/** زر إضافة للسلة. compact = للكروت، وإلا مع عدّاد كمية كبير */
export default function AddToCart({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { add, lines, setQty } = useCart();
  const [qty, setLocalQty] = useState(1);
  const inCart = lines.find((l) => l.id === product.id);
  const max = Math.min(product.stock, product.rx ? RX_MAX_QTY : 10);
  const out = product.stock <= 0;

  if (out) {
    return (
      <button className="btn btn-ghost w-full" disabled>
        غير متوفر حاليًا
      </button>
    );
  }

  if (compact) {
    if (inCart) {
      return (
        <div className="flex items-center justify-between rounded-full border-[3px] border-yellow bg-white p-0.5 w-full">
          <button className="btn btn-sm !min-h-9 !w-9 !p-0 !shadow-none hover:bg-[#f0f2f2]" aria-label="زوّد الكمية" onClick={() => setQty(product.id, inCart.qty + 1)}>
            <Icon name="plus" size={18} />
          </button>
          <span className="num font-bold text-lg">{inCart.qty}</span>
          <button className="btn btn-sm !min-h-9 !w-9 !p-0 !shadow-none hover:bg-[#f0f2f2]" aria-label="قلّل الكمية" onClick={() => setQty(product.id, inCart.qty - 1)}>
            <Icon name={inCart.qty === 1 ? "trash" : "minus"} size={18} />
          </button>
        </div>
      );
    }
    return (
      <button className="btn btn-primary btn-sm !min-h-10 w-full !px-2 whitespace-nowrap" onClick={() => add(product, 1)}>
        أضف إلى السلة
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-full border border-line bg-[#f0f2f2] shadow-[0_2px_5px_rgba(15,17,17,.15)]">
        <button className="btn btn-ghost !border-0 !w-12 !p-0" aria-label="قلّل الكمية" onClick={() => setLocalQty((q) => Math.max(1, q - 1))}>
          <Icon name="minus" />
        </button>
        <span className="num w-10 text-center text-lg font-bold" aria-live="polite">
          {qty}
        </span>
        <button className="btn btn-ghost !border-0 !w-12 !p-0" aria-label="زوّد الكمية" onClick={() => setLocalQty((q) => Math.min(max, q + 1))}>
          <Icon name="plus" />
        </button>
      </div>
      <button className="btn btn-primary btn-lg flex-1 min-w-48" onClick={() => add(product, qty)}>
        أضف إلى السلة
      </button>
    </div>
  );
}
