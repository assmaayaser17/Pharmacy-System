import Link from "next/link";
import type { Product } from "@/lib/types";
import ProductArt from "./ProductArt";

type Art = Product["art"];

/** بانر ترويجي: نص + زر + رسومات منتجات بالكود */
export default function PromoBanner({
  bg,
  title,
  sub,
  cta,
  href,
  arts,
  dark = false,
  className = "",
}: {
  bg: string;
  title: string;
  sub?: string;
  cta: string;
  href: string;
  arts: Art[];
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: bg }}>
      <div className="relative z-10 flex items-center gap-3 p-6 sm:p-9 min-h-48">
        <div className={`flex-1 space-y-3 ${dark ? "text-white" : "text-text"}`}>
          <h3 className="text-2xl sm:text-[2rem] font-extrabold leading-tight max-w-[18ch]">{title}</h3>
          {sub && <p className={`text-[0.95rem] ${dark ? "text-white/85" : "text-text/75"}`}>{sub}</p>}
          <Link href={href} className="btn btn-primary btn-sm">
            {cta}
          </Link>
        </div>
        <div className="flex items-end -space-x-6 rtl:space-x-reverse shrink-0" aria-hidden="true">
          {arts.map((a, i) => (
            <ProductArt key={i} art={a} label="" className={`${i === 0 ? "" : "hidden sm:block"} ${i === 1 ? "size-32 sm:size-44 relative z-10" : "size-24 sm:size-32"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
