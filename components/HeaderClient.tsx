"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { money } from "@/lib/format";
import Icon from "./Icon";

export function CartBadge() {
  const { count, ready } = useCart();
  return (
    <Link
      href="/cart"
      className="relative flex items-end gap-1 px-2 py-1.5 rounded-sm border border-transparent hover:border-white text-white"
      aria-label={`السلة${ready && count ? `، فيها ${count} منتج` : ""}`}
    >
      <span className="relative">
        <Icon name="cart" size={32} />
        <span className="num absolute -top-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 text-gold font-bold text-[0.95rem]">
          {ready ? count : 0}
        </span>
      </span>
      <span className="hidden sm:inline font-bold text-[0.9rem] pb-0.5">السلة</span>
    </Link>
  );
}

/** تكبير الخط: مهم لكبار السن ولمن يصعب عليه القراءة */
export function FontSizeToggle() {
  const [big, setBig] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBig(document.documentElement.dataset.big === "1");
  }, []);
  function toggle() {
    const next = !big;
    setBig(next);
    if (next) document.documentElement.dataset.big = "1";
    else delete document.documentElement.dataset.big;
    try {
      localStorage.setItem("shifa.big", next ? "1" : "0");
    } catch {}
  }
  return (
    <button
      onClick={toggle}
      aria-pressed={big}
      className="inline-flex items-center gap-1.5 rounded-sm border border-transparent hover:border-white px-2 py-1.5 text-[0.85rem]"
    >
      <Icon name="text" size={18} />
      {big ? "خط عادي" : "كبّر الخط"}
    </button>
  );
}

export function BottomNav({ loggedIn }: { loggedIn: boolean }) {
  const path = usePathname();
  const { count, ready } = useCart();
  const items = [
    { href: "/", label: "الرئيسية", icon: "home" },
    { href: "/products", label: "الأقسام", icon: "grid" },
    { href: "/prescription", label: "الوصفة", icon: "upload", hero: true },
    { href: "/cart", label: "السلة", icon: "cart", badge: ready ? count : 0 },
    { href: loggedIn ? "/account" : "/login", label: loggedIn ? "حسابي" : "دخول", icon: "user" },
  ];
  if (path.startsWith("/admin") || path.startsWith("/checkout")) return null;
  return (
    <nav
      aria-label="التنقل الرئيسي"
      className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white border-t border-line shadow-[0_-2px_6px_rgba(0,0,0,.08)] pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-5 items-end px-1">
        {items.map((it) => {
          const active = it.href === "/" ? path === "/" : path.startsWith(it.href);
          return (
            <li key={it.href} className="flex justify-center">
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-col items-center gap-0.5 py-2 text-[0.78rem] font-medium min-w-16 ${
                  active ? "text-leaf border-t-2 border-leaf -mt-px" : "text-muted"
                }`}
              >
                {it.hero ? (
                  <span className="grid place-items-center size-14 -mt-6 rounded-full bg-gold text-text shadow-lift border-4 border-white">
                    <Icon name={it.icon} size={26} />
                  </span>
                ) : (
                  <span className="relative">
                    <Icon name={it.icon} size={26} />
                    {it.badge ? (
                      <span className="num absolute -top-1.5 -end-2.5 min-w-5 h-5 px-1 grid place-items-center rounded-full bg-gold text-text text-[0.7rem] font-bold">
                        {it.badge}
                      </span>
                    ) : null}
                  </span>
                )}
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
