"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const { toast } = useCart();
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast("اكتب بريدًا إلكترونيًا صحيحًا", "err");
    toast("تم اشتراكك، ستصلك أحدث العروض");
    setEmail("");
  }
  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
      <label htmlFor="nl" className="sr-only">البريد الإلكتروني</label>
      <input
        id="nl"
        type="email"
        dir="ltr"
        placeholder="name@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="field !min-h-10 text-start"
      />
      <button className="btn btn-primary btn-sm !min-h-10 whitespace-nowrap">اشترك</button>
    </form>
  );
}
