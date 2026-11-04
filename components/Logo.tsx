import Link from "next/link";
import { BRAND } from "@/lib/config";

export function CapsuleMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <g transform="rotate(-40 20 20)">
        <rect x="3" y="12" width="34" height="16" rx="8" fill="#fff" stroke="#131921" strokeWidth="2.4" />
        <path d="M20 12 h9 a8 8 0 0 1 0 16 h-9z" fill="#ff9900" />
        <path d="M20 12 v16" stroke="#131921" strokeWidth="2.4" />
      </g>
    </svg>
  );
}

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0" aria-label={`${BRAND.name} - الرئيسية`}>
      <span className={`grid place-items-center size-9 rounded-full bg-white`}>
        <CapsuleMark size={30} />
      </span>
      <span className="leading-tight whitespace-nowrap">
        <span className={`block text-xl font-bold tracking-tight ${light ? "text-white" : "text-text"}`}>{BRAND.name}</span>
        <span className={`block text-[0.7rem] ${light ? "text-gold-light" : "text-gold-dark"}`}>صيدلية مرخّصة</span>
      </span>
    </Link>
  );
}
