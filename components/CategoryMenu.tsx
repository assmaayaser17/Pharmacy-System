"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES } from "@/lib/seed";
import Icon from "./Icon";

export default function CategoryMenu() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [path]);

  useEffect(() => {
    if (!open) return;
    const click = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", click);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", click);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  return (
    <div ref={box} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className="inline-flex items-center gap-1.5 min-h-10 px-2.5 rounded-sm border border-transparent hover:border-white font-bold whitespace-nowrap"
      >
        <Icon name="menu" size={20} /> الكل
      </button>
      {open && <div className="fixed inset-0 bg-black/60 z-[55]" onClick={() => setOpen(false)} aria-hidden="true" />}
      {open && (
        <ul className="fixed start-0 top-0 bottom-0 w-80 max-w-[85vw] overflow-y-auto bg-white text-text shadow-2xl z-[60] sheet-in">
          <li className="bg-ink-2 text-white px-6 py-4 text-lg font-bold flex items-center justify-between">
            تسوّق حسب القسم
            <button onClick={() => setOpen(false)} aria-label="إغلاق" className="grid place-items-center size-9 rounded-full hover:bg-white/10"><Icon name="close" size={22} /></button>
          </li>
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link href={`/products?category=${c.slug}`} className="flex items-center gap-3 px-6 py-3 hover:bg-[#eaeded]">
                <span className="size-3 rounded-full shrink-0" style={{ background: c.c1 }} />
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
