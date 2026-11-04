"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";
import Icon from "./Icon";

export default function ReviewForm({ productId, loggedIn }: { productId: string; loggedIn: boolean }) {
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { toast } = useCart();

  if (!loggedIn) {
    return (
      <p className="card p-4 text-muted">
        <a href={`/login?next=/product/${productId}`} className="font-bold text-leaf underline underline-offset-4">سجّل دخولك</a>{" "}
        عشان تكتب رأيك في المنتج.
      </p>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const r = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, stars, text }),
    });
    setBusy(false);
    if (!r.ok) return setError((await r.json()).error ?? "صار خطأ، حاول مرة ثانية");
    setText("");
    toast("شكرًا لك، وصل رأيك");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card p-5 space-y-3">
      <h3 className="text-lg">اكتب رأيك</h3>
      <div role="radiogroup" aria-label="التقييم" className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={stars === n}
            aria-label={`${n} من 5`}
            onClick={() => setStars(n)}
            className="p-1"
          >
            <Icon name="star" size={34} fill={n <= stars} className={n <= stars ? "text-amber" : "text-line"} />
          </button>
        ))}
      </div>
      <label htmlFor="rv" className="sr-only">رأيك</label>
      <textarea
        id="rv"
        className="field"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="كيف كانت تجربتك مع المنتج؟"
      />
      {error && <p className="err" role="alert">{error}</p>}
      <button className="btn btn-ink" disabled={busy}>{busy ? "جاري الإرسال..." : "أرسل التقييم"}</button>
    </form>
  );
}
