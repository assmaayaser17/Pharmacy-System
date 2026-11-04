"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ArtKind } from "@/lib/types";
import Icon from "./Icon";
import ProductArt from "./ProductArt";

type Slide = {
  bg: string;
  title: string;
  sub: string;
  cta: string;
  href: string;
  kind: ArtKind;
  c1: string;
  c2: string;
  stone: string;
  eyebrow: string;
  dark?: boolean;
};

const SLIDES: Slide[] = [
  { bg: "linear-gradient(100deg, #ffe3a3 0%, #ffd27a 45%, #fbb954 100%)", eyebrow: "مكملات وفيتامينات", title: "خصم حتى ٣٠٪ على الفيتامينات", sub: "فيتامين د، أوميغا ٣، والمناعة. توصيل خلال ساعتين", cta: "تسوّق الآن", href: "/products?category=vitamins", kind: "jar", c1: "#e8890c", c2: "#fff1d6", stone: "#fff" },
  { bg: "linear-gradient(100deg, #cdeffd 0%, #9fd9f5 50%, #6fc2ea 100%)", eyebrow: "أجهزة طبية", title: "أجهزتك الصحية في بيتك", sub: "ضغط وسكر وحرارة وأكسجين، بضمان سنتين", cta: "شاهد الأجهزة", href: "/products?category=devices", kind: "device", c1: "#2b4c7e", c2: "#e1e8f2", stone: "#fff" },
  { bg: "linear-gradient(100deg, #ffe0ea 0%, #fcc3d4 50%, #f7a3bd 100%)", eyebrow: "الأم والطفل", title: "كل ما يحتاجه طفلك", sub: "حليب وحفاضات ومستلزمات الأم في مكان واحد", cta: "تسوّق الأم والطفل", href: "/products?category=mother-baby", kind: "jar", c1: "#2f95c9", c2: "#dff2fb", stone: "#fff" },
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!paused.current) setI((n) => (n + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(id);
  }, []);

  const go = (d: number) => setI((n) => (n + d + SLIDES.length) % SLIDES.length);
  return (
    <section
      aria-roledescription="شرائح عرض"
      aria-label="أبرز العروض"
      className="relative overflow-hidden h-[16rem] sm:h-[20rem] lg:h-[31rem]"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocusCapture={() => (paused.current = true)}
      onBlurCapture={() => (paused.current = false)}
    >
      {SLIDES.map((s, n) => (
        <div
          key={s.title}
          role="group"
          aria-roledescription="شريحة"
          aria-label={`${n + 1} من ${SLIDES.length}`}
          aria-hidden={n !== i}
          className={`absolute inset-0 transition-opacity duration-700 ${n === i ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          style={{ background: s.bg }}
        >
          <div className="mx-auto max-w-[96rem] h-full grid grid-cols-1 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,0.5fr)] items-start gap-2 px-11 sm:px-20 pt-5 sm:pt-8">
            <div className="min-w-0 space-y-2 sm:space-y-3 text-text">
              <span className="eyebrow !text-text/70">{s.eyebrow}</span>
              <h2 className="text-[1.35rem] sm:text-4xl lg:text-[2.7rem] font-extrabold leading-[1.2] [overflow-wrap:anywhere]">{s.title}</h2>
              <p className="text-[0.9rem] sm:text-lg text-text/80 max-w-md">{s.sub}</p>
              <Link href={s.href} tabIndex={n === i ? 0 : -1} className="btn btn-primary">
                {s.cta}
              </Link>
            </div>
            <div className="relative hidden sm:grid place-items-center min-w-0" aria-hidden="true">
              <ProductArt art={{ kind: s.kind, c1: s.c1, c2: s.c2 }} label="" className="relative w-full max-w-[13rem] drop-shadow-xl" />
            </div>
          </div>
        </div>
      ))}
      {/* تلاشي أسفل البانر في خلفية الصفحة */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-ivory pointer-events-none hidden lg:block" />
      <button onClick={() => go(-1)} aria-label="الشريحة السابقة" className="absolute start-0 top-0 h-[60%] w-10 sm:w-16 grid place-items-center text-text border-2 border-transparent focus-visible:border-white hover:bg-white/10">
        <Icon name="chevron" size={40} className="size-7 sm:size-10" />
      </button>
      <button onClick={() => go(1)} aria-label="الشريحة التالية" className="absolute end-0 top-0 h-[60%] w-10 sm:w-16 grid place-items-center text-text border-2 border-transparent focus-visible:border-white hover:bg-white/10">
        <Icon name="chevron" size={40} className="rotate-180 size-7 sm:size-10" />
      </button>
    </section>
  );
}
