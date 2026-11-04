import Link from "next/link";
import type { Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/seed";
import { discountPct, money, num } from "@/lib/format";
import AddToCart from "./AddToCart";
import { FREE_SHIPPING_MIN } from "@/lib/config";
import Price from "./Price";
import Stars from "./Stars";
import ProductArt from "./ProductArt";
import WishlistButton from "./WishlistButton";

export default function ProductCard({
  p,
  saved = false,
  loggedIn = false,
  flash = false,
}: {
  p: Product;
  saved?: boolean;
  loggedIn?: boolean;
  flash?: boolean;
}) {
  const off = discountPct(p.price, p.oldPrice);
  const cat = CATEGORIES.find((c) => c.slug === p.cat);
  const soldPct = Math.min(96, Math.max(8, Math.round((p.sold / (p.sold + p.stock * 6)) * 100)));
  return (
    <article className="group flex flex-col h-full bg-white rounded-lg overflow-hidden">
      <div className="relative bg-paper">
        <Link href={`/product/${p.id}`} aria-label={p.nameAr} className="block">
          <ProductArt art={p.art} label={p.nameAr} className="w-full aspect-square p-4 sm:p-5" />
        </Link>
        <div className="absolute top-2 inset-x-2 flex items-start justify-between gap-2 pointer-events-none">
          <div className="flex flex-wrap gap-1 items-start max-w-[75%]">
            {p.rx && <span className="badge bg-ink-2 text-white">بوصفة</span>}
            {p.tags.includes("الأكثر طلبًا") && <span className="badge bg-[#e47911] text-white !rounded-none !rounded-e-md">الأكثر مبيعًا</span>}
            {p.cold && <span className="badge bg-sky text-leaf-dark">مبرّد</span>}
          </div>
          <div className="pointer-events-auto">
            <WishlistButton productId={p.id} initial={saved} loggedIn={loggedIn} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 p-2.5 sm:p-3 grow min-w-0">
        <h3 className="text-[0.9rem] sm:text-[0.95rem] leading-snug font-normal line-clamp-2">
          <Link href={`/product/${p.id}`} className="text-text hover:text-[#c7511f]">
            {p.brand} {p.nameAr}، {p.size}
          </Link>
        </h3>
        <Stars rating={p.rating} reviews={p.reviews} />
        <span className="hidden sm:block text-[0.8rem] text-muted">{cat?.name}</span>

        {off > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            <span className="badge bg-coral text-white !rounded-sm">خصم <span className="num">{num(off)}%</span></span>
            <span className="hidden sm:inline text-[0.8rem] font-bold text-coral">{flash ? "عرض لفترة محدودة" : "عرض"}</span>
          </div>
        )}
        <div className="flex items-end gap-2 flex-wrap mt-1">
          <Price value={p.price} />
          {p.oldPrice && p.oldPrice > p.price && (
            <span className="text-[0.8rem] text-muted">
              <span className="hidden sm:inline">السعر السابق: </span><span className="line-through num">{money(p.oldPrice)}</span>
            </span>
          )}
        </div>
        <p className="hidden sm:block text-[0.82rem] text-text">
          توصيل <strong>مجاني</strong> للطلبات فوق <span className="num">{num(FREE_SHIPPING_MIN)}</span> ر.س
        </p>

        <div className="mt-auto pt-2">
          {flash && p.stock > 0 && (
            <div className="mb-2">
              <div className="h-2 rounded-full bg-[#e3e6e6] overflow-hidden" aria-hidden="true">
                <div className="h-full rounded-full bg-coral" style={{ width: `${soldPct}%` }} />
              </div>
              <p className="text-[0.78rem] text-muted mt-0.5"><span className="num">{soldPct}%</span> تم بيعه</p>
            </div>
          )}
          {p.stock > 0 && p.stock <= 8 && <p className="text-[0.82rem] text-coral mb-1.5">باقي <span className="num">{num(p.stock)}</span> فقط، اطلب الآن</p>}
          <AddToCart product={p} compact />
        </div>
      </div>
    </article>
  );
}
