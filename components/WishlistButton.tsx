"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";
import Icon from "./Icon";

export default function WishlistButton({
  productId,
  initial,
  loggedIn,
  withLabel = false,
}: {
  productId: string;
  initial: boolean;
  loggedIn: boolean;
  withLabel?: boolean;
}) {
  const [saved, setSaved] = useState(initial);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const { toast } = useCart();

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!loggedIn) {
      toast("سجّل دخولك عشان تحفظ المنتج في المفضلة", "err", { href: "/login?next=/wishlist", label: "تسجيل الدخول" });
      return;
    }
    setBusy(true);
    const r = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    setBusy(false);
    if (r.ok) {
      const d = await r.json();
      setSaved(d.saved);
      toast(d.saved ? "حفظناه في المفضلة" : "شلناه من المفضلة");
      router.refresh();
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      aria-pressed={saved}
      aria-label={saved ? "شيل من المفضلة" : "احفظ في المفضلة"}
      className={
        withLabel
          ? "btn btn-ghost"
          : "grid place-items-center size-11 rounded-full bg-white/95 border border-line hover:border-coral transition-colors"
      }
    >
      <Icon name="heart" fill={saved} className={saved ? "text-coral" : "text-ink"} size={21} />
      {withLabel && (saved ? "في المفضلة" : "احفظ للمفضلة")}
    </button>
  );
}
