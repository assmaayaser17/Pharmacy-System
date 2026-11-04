import Link from "next/link";
import type { Product } from "@/lib/types";
import { money } from "@/lib/format";
import ProductArt from "./ProductArt";

/** صف مصغّر لقوائم «جديد / الأكثر رواجًا / عروض» */
export default function ProductRow({ p }: { p: Product }) {
  return (
    <Link href={`/product/${p.id}`} className="group flex items-center gap-3 py-2.5">
      <span className="bg-paper shrink-0"><ProductArt art={p.art} label="" className="size-20 p-1" /></span>
      <span className="min-w-0 flex-1 leading-snug">
        <span className="text-[0.9rem] line-clamp-2 group-hover:text-[#c7511f]">{p.nameAr}</span>
        <span className="flex items-baseline gap-2">
          <strong className="num font-medium text-coral">{money(p.price)}</strong>
          {p.oldPrice && <span className="text-sm text-muted line-through num">{money(p.oldPrice)}</span>}
        </span>
      </span>
    </Link>
  );
}
