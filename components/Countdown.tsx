"use client";

import { useEffect, useState } from "react";

/** عدّاد تنازلي حتى منتصف الليل: عروض اليوم */
export default function Countdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(24, 0, 0, 0);
      setLeft(Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000)));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  const parts = left == null ? ["--", "--", "--"] : [pad(Math.floor(left / 3600)), pad(Math.floor((left % 3600) / 60)), pad(left % 60)];
  const labels = ["ساعة", "دقيقة", "ثانية"];
  return (
    <div className="inline-flex items-center gap-1.5 rounded-sm bg-coral px-3 py-0.5 text-white text-sm" role="timer" aria-label="الوقت المتبقي لعروض اليوم">
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1">
          <strong className="num">{p}</strong>
          <span className="text-white/80 text-xs">{labels[i]}</span>
          {i < 2 && <span className="text-white/60">:</span>}
        </span>
      ))}
    </div>
  );
}
