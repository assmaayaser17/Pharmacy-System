import type { Product } from "@/lib/types";

/**
 * صورة المنتج.
 * - لو فيه صورة حقيقية (art.img من مجلد public/products) نعرضها.
 * - وإلا نرسم عبوة واقعية بالكود (SVG) عليها اسم الماركة والمنتج والحجم،
 *   فالمتجر يبان كامل بدون أي صور محمية بحقوق، وتُستبدل بصور العميل لاحقًا.
 */

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
};

/** تقسيم الاسم لسطرين قصيرين يناسبان الملصق */
function lines(t: string | undefined, max: number): string[] {
  if (!t) return [];
  const words = t.split(/\s+/);
  const out: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length <= max) cur = (cur + " " + w).trim();
    else {
      if (cur) out.push(cur);
      cur = w;
    }
    if (out.length === 2) break;
  }
  if (out.length < 2 && cur) out.push(cur);
  if (out.length === 2 && out[1].length > max) out[1] = out[1].slice(0, max - 1) + "…";
  return out.slice(0, 2);
}

export default function ProductArt({
  art,
  label,
  className = "",
}: {
  art: Product["art"];
  label?: string;
  className?: string;
}) {
  if (art.img) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={art.img} alt={label ?? ""} className={`object-contain mix-blend-multiply ${className}`} loading="lazy" />
    );
  }

  const { kind, c1, c2, brand, title, sub } = art;
  const id = "pa" + hash(kind + c1 + c2 + (title ?? ""));
  const shine = `url(#${id}s)`;
  const capG = `url(#${id}c)`;
  const name = lines(title, kind === "box" || kind === "device" ? 13 : 11);
  const ink = "#0f1111";

  /** ملصق: ماركة + اسم + حجم، متمركز حول cx */
  const Label = ({ cx, y, w, small = false }: { cx: number; y: number; w: number; small?: boolean }) => (
    <g direction="rtl" textAnchor="middle" style={{ fontFamily: "inherit" }}>
      {brand && (
        <text x={cx} y={y} fontSize={small ? 8 : 9.5} fontWeight="800" fill={c1} textLength={brand.length > 9 ? w - 10 : undefined} lengthAdjust="spacingAndGlyphs">
          {brand}
        </text>
      )}
      {name.map((l, i) => (
        <text key={i} x={cx} y={y + (small ? 12 : 14) + i * (small ? 10 : 12)} fontSize={small ? 8.5 : 10.5} fontWeight="700" fill={ink}>
          {l}
        </text>
      ))}
      {sub && (
        <text x={cx} y={y + (small ? 12 : 14) + name.length * (small ? 10 : 12) + 2} fontSize={small ? 7 : 8} fill="#565959">
          {sub}
        </text>
      )}
    </g>
  );

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label={label ?? "صورة المنتج"}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* إضاءة أسطوانية: حواف أغمق، لمعة قرب اليسار */}
        <linearGradient id={`${id}s`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.22" />
          <stop offset="0.1" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.22" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id={`${id}c`} x1="0" x2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="0.25" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.45" stopColor={c1} />
          <stop offset="1" stopColor="#000" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id={`${id}g`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}f`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#ececec" />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="181" rx="64" ry="7" fill={`url(#${id}g)`} />

      {kind === "box" && (
        <g>
          {/* جانب + سطح + وجه العلبة */}
          <path d="M138 40 l20 -10 v130 l-20 18z" fill={c1} />
          <path d="M138 40 l20 -10 v130 l-20 18z" fill="#000" opacity="0.28" />
          <path d="M42 40 l20 -10 h96 l-20 10z" fill={c1} />
          <path d="M42 40 l20 -10 h96 l-20 10z" fill="#fff" opacity="0.35" />
          <rect x="42" y="40" width="96" height="138" fill={`url(#${id}f)`} />
          <rect x="42" y="40" width="96" height="30" fill={c1} />
          <path d="M42 70 h96 v6 q-48 10 -96 0z" fill={c1} opacity="0.85" />
          <rect x="42" y="160" width="96" height="18" fill={c2} />
          <rect x="42" y="160" width="96" height="3" fill={c1} />
          <circle cx="58" cy="55" r="7" fill="#fff" opacity="0.9" />
          <path d="M54.5 55 h7 M58 51.5 v7" stroke={c1} strokeWidth="2.4" strokeLinecap="round" />
          <Label cx={90} y={96} w={90} />
          <rect x="42" y="40" width="96" height="138" fill="none" stroke="#000" strokeOpacity="0.08" />
        </g>
      )}

      {kind === "bottle" && (
        <g>
          <rect x="82" y="16" width="36" height="26" rx="4" fill={capG} />
          <path d="M84 22 h32 M84 28 h32 M84 34 h32" stroke="#000" strokeOpacity="0.12" />
          <path d="M86 42 h28 v8 q14 4 22 16 v104 q0 10 -10 10 h-52 q-10 0 -10 -10 v-104 q8 -12 22 -16z" fill="#fafafa" />
          <path d="M86 42 h28 v8 q14 4 22 16 v104 q0 10 -10 10 h-52 q-10 0 -10 -10 v-104 q8 -12 22 -16z" fill={c2} opacity="0.55" />
          <rect x="64" y="84" width="72" height="72" fill="#fff" />
          <rect x="64" y="84" width="72" height="9" fill={c1} />
          <rect x="64" y="150" width="72" height="6" fill={c1} />
          <Label cx={100} y={108} w={68} small />
          <path d="M86 42 h28 v8 q14 4 22 16 v104 q0 10 -10 10 h-52 q-10 0 -10 -10 v-104 q8 -12 22 -16z" fill={shine} />
        </g>
      )}

      {kind === "tube" && (
        <g>
          <rect x="84" y="18" width="32" height="24" rx="3" fill={capG} />
          <path d="M84 24 h32 M84 30 h32 M84 36 h32" stroke="#000" strokeOpacity="0.12" />
          <path d="M80 42 h40 l14 10 l-6 120 h-56 l-6 -120z" fill="#fbfbfb" />
          <path d="M66 52 h68 l-1 14 h-66z" fill={c1} opacity="0.9" />
          <path d="M71 150 h58 l-1 22 h-56z" fill={c2} />
          <path d="M70 168 h60 l0 12 h-60z" fill={c1} />
          <path d="M70 172 h60 M70 176 h60" stroke="#fff" strokeOpacity="0.4" />
          <Label cx={100} y={88} w={60} small />
          <path d="M80 42 h40 l14 10 l-6 120 h-56 l-6 -120z" fill={shine} />
        </g>
      )}

      {kind === "jar" && (
        <g>
          <rect x="48" y="26" width="104" height="30" rx="5" fill={capG} />
          <path d="M52 32 v20 M60 32 v20 M68 32 v20 M76 32 v20 M84 32 v20 M92 32 v20 M100 32 v20 M108 32 v20 M116 32 v20 M124 32 v20 M132 32 v20 M140 32 v20 M148 32 v20" stroke="#000" strokeOpacity="0.1" />
          <path d="M52 56 h96 q8 0 8 10 v104 q0 10 -12 10 h-88 q-12 0 -12 -10 v-104 q0 -10 8 -10z" fill="#fafafa" />
          <path d="M52 56 h96 q8 0 8 10 v104 q0 10 -12 10 h-88 q-12 0 -12 -10 v-104 q0 -10 8 -10z" fill={c2} opacity="0.5" />
          <rect x="44" y="82" width="112" height="76" fill="#fff" />
          <rect x="44" y="82" width="112" height="10" fill={c1} />
          <rect x="44" y="152" width="112" height="6" fill={c1} />
          <circle cx="140" cy="104" r="8" fill={c1} />
          <path d="M136 104 h8 M140 100 v8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
          <Label cx={94} y={110} w={84} />
          <path d="M52 56 h96 q8 0 8 10 v104 q0 10 -12 10 h-88 q-12 0 -12 -10 v-104 q0 -10 8 -10z" fill={shine} />
        </g>
      )}

      {kind === "sachet" && (
        <g>
          <path d="M54 24 h92 v12 l-3 3 v128 l3 3 v12 h-92 v-12 l3 -3 v-128 l-3 -3z" fill="#fbfbfb" />
          <path d="M54 24 h92 v18 h-92z" fill={c1} />
          <path d="M54 164 h92 v18 h-92z" fill={c1} />
          <path d="M54 28 h92 M54 32 h92 M54 36 h92 M54 170 h92 M54 174 h92 M54 178 h92" stroke="#fff" strokeOpacity="0.35" />
          <circle cx="100" cy="138" r="14" fill={c2} />
          <path d="M100 130 v16 M92 138 h16" stroke={c1} strokeWidth="4" strokeLinecap="round" />
          <Label cx={100} y={68} w={84} />
          <path d="M54 24 h92 v158 h-92z" fill={shine} opacity="0.7" />
        </g>
      )}

      {kind === "device" && (
        <g>
          <rect x="34" y="44" width="132" height="132" rx="22" fill="#f6f6f6" />
          <rect x="34" y="44" width="132" height="132" rx="22" fill={shine} opacity="0.6" />
          <rect x="34" y="44" width="132" height="132" rx="22" fill="none" stroke="#000" strokeOpacity="0.12" />
          <rect x="48" y="58" width="104" height="58" rx="8" fill="#20272b" />
          <rect x="52" y="62" width="96" height="50" rx="6" fill="#b9d3c8" />
          <text x="140" y="94" textAnchor="end" fontSize="26" fontWeight="800" fill="#1d2b25" direction="ltr" style={{ fontFamily: "ui-monospace, monospace" }}>120</text>
          <text x="62" y="80" fontSize="9" fontWeight="700" fill="#1d2b25" direction="ltr">SYS</text>
          <text x="140" y="108" textAnchor="end" fontSize="11" fontWeight="700" fill="#1d2b25" direction="ltr" style={{ fontFamily: "ui-monospace, monospace" }}>80 · 72♥</text>
          <circle cx="100" cy="146" r="14" fill={c1} />
          <circle cx="100" cy="146" r="14" fill="#fff" opacity="0.15" />
          <circle cx="66" cy="146" r="6" fill="#d5d9d9" />
          <circle cx="134" cy="146" r="6" fill="#d5d9d9" />
          {brand && (
            <text x="100" y="170" textAnchor="middle" fontSize="9" fontWeight="800" fill={c1} direction="rtl">{brand}</text>
          )}
        </g>
      )}

      {kind === "spray" && (
        <g>
          <path d="M84 14 h32 v12 h-10 v10 h-22z" fill={capG} />
          <rect x="114" y="18" width="10" height="4" rx="2" fill="#565959" />
          <rect x="80" y="36" width="40" height="16" rx="3" fill="#e3e6e6" />
          <path d="M70 52 h60 q6 0 6 8 v110 q0 10 -10 10 h-52 q-10 0 -10 -10 v-110 q0 -8 6 -8z" fill="#fafafa" />
          <path d="M70 52 h60 q6 0 6 8 v110 q0 10 -10 10 h-52 q-10 0 -10 -10 v-110 q0 -8 6 -8z" fill={c2} opacity="0.5" />
          <rect x="64" y="84" width="72" height="70" fill="#fff" />
          <rect x="64" y="84" width="72" height="8" fill={c1} />
          <rect x="64" y="148" width="72" height="6" fill={c1} />
          <Label cx={100} y={106} w={68} small />
          <path d="M70 52 h60 q6 0 6 8 v110 q0 10 -10 10 h-52 q-10 0 -10 -10 v-110 q0 -8 6 -8z" fill={shine} />
        </g>
      )}
    </svg>
  );
}
