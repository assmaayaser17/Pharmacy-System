import { num } from "@/lib/format";

/** نجوم التقييم البرتقالية مع عدد المراجعات */
export default function Stars({ rating, reviews, size = 15 }: { rating: number; reviews?: number; size?: number }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[0.85rem]" aria-label={`التقييم ${rating} من 5`}>
      <span className="num font-medium text-text">{rating.toFixed(1)}</span>
      <span className="relative inline-block shrink-0 leading-none" style={{ width: size * 5, height: size }} aria-hidden="true">
        <svg width={size * 5} height={size} viewBox="0 0 100 20" className="absolute inset-0">
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} transform={`translate(${i * 20} 0)`} d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9 4.8 17.7l1-5.9L1.5 7.7l5.9-.8z" fill="#fff" stroke="#de7921" strokeWidth="1.2" />
          ))}
        </svg>
        <span className="absolute inset-y-0 start-0 overflow-hidden" style={{ width: `${pct}%` }}>
          <svg width={size * 5} height={size} viewBox="0 0 100 20" className="absolute inset-y-0 start-0 rtl:right-0">
            {[0, 1, 2, 3, 4].map((i) => (
              <path key={i} transform={`translate(${(4 - i) * 20} 0)`} d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9 4.8 17.7l1-5.9L1.5 7.7l5.9-.8z" fill="#ffa41c" stroke="#de7921" strokeWidth="1.2" />
            ))}
          </svg>
        </span>
      </span>
      {reviews != null && <span className="link num">({num(reviews)})</span>}
    </span>
  );
}
