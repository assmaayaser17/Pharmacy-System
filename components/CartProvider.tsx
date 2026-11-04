"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { RX_MAX_QTY } from "@/lib/config";

export type CartLine = {
  id: string;
  nameAr: string;
  size: string;
  price: number;
  qty: number;
  rx: boolean;
  cold?: boolean;
  stock: number;
  art: Product["art"];
};

type Toast = { id: number; text: string; action?: { href: string; label: string }; tone?: "ok" | "err" };

type Ctx = {
  lines: CartLine[];
  ready: boolean;
  count: number;
  subtotal: number;
  needsRx: boolean;
  add: (p: Product | CartLine, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  toast: (text: string, tone?: "ok" | "err", action?: Toast["action"]) => void;
};

const CartCtx = createContext<Ctx | null>(null);
const KEY = "shifa.cart.v1";

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart خارج CartProvider");
  return c;
}

function toLine(p: Product | CartLine, qty: number): CartLine {
  return {
    id: p.id,
    nameAr: p.nameAr,
    size: p.size,
    price: p.price,
    qty,
    rx: p.rx,
    cold: "cold" in p ? p.cold : undefined,
    stock: p.stock,
    art: p.art,
  };
}

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const tid = useRef(0);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- قراءة السلة من التخزين المحلي بعد التحميل */
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const toast = useCallback<Ctx["toast"]>((text, tone = "ok", action) => {
    const id = ++tid.current;
    setToasts((t) => [...t.slice(-2), { id, text, tone, action }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const maxFor = (l: { rx: boolean; stock: number }) => Math.min(l.stock, l.rx ? RX_MAX_QTY : 10);

  const add = useCallback<Ctx["add"]>(
    (p, qty = 1) => {
      if (p.stock <= 0) return toast("المنتج غير متوفر حاليًا", "err");
      let capped = false;
      setLines((cur) => {
        const found = cur.find((l) => l.id === p.id);
        const max = Math.min(p.stock, p.rx ? RX_MAX_QTY : 10);
        if (found) {
          const next = Math.min(found.qty + qty, max);
          capped = next === found.qty;
          return cur.map((l) => (l.id === p.id ? { ...l, qty: next, price: p.price, stock: p.stock } : l));
        }
        return [...cur, toLine(p, Math.min(qty, max))];
      });
      toast(`أضفنا «${p.nameAr}» للسلة`, "ok", { href: "/cart", label: "اعرض السلة" });
      if (capped) toast("وصلت للحد الأقصى المتاح من هذا المنتج", "err");
    },
    [toast],
  );

  const setQty = useCallback((id: string, qty: number) => {
    setLines((cur) =>
      cur
        .map((l) => (l.id === id ? { ...l, qty: Math.max(0, Math.min(qty, maxFor(l))) } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const remove = useCallback((id: string) => setLines((cur) => cur.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<Ctx>(
    () => ({
      lines,
      ready,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal: Math.round(lines.reduce((s, l) => s + l.price * l.qty, 0) * 100) / 100,
      needsRx: lines.some((l) => l.rx),
      add,
      setQty,
      remove,
      clear,
      toast,
    }),
    [lines, ready, add, setQty, remove, clear, toast],
  );

  return (
    <CartCtx.Provider value={value}>
      {children}
      <div
        className="fixed inset-x-0 bottom-24 lg:bottom-6 z-[60] flex flex-col items-center gap-2 px-4 pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`sheet-in pointer-events-auto flex items-center gap-4 rounded-full px-5 py-3 shadow-lift text-white max-w-md ${
              t.tone === "err" ? "bg-coral" : "bg-ink"
            }`}
          >
            <span className="text-[0.95rem]">{t.text}</span>
            {t.action && (
              <Link href={t.action.href} className="font-bold underline underline-offset-4 whitespace-nowrap">
                {t.action.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </CartCtx.Provider>
  );
}
