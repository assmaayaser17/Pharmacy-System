"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function PickTabs({
  groups,
  saved,
  loggedIn,
}: {
  groups: { id: string; label: string; items: Product[] }[];
  saved: string[];
  loggedIn: boolean;
}) {
  const [active, setActive] = useState(groups[0].id);
  const current = groups.find((g) => g.id === active) ?? groups[0];
  return (
    <div>
      <div role="tablist" aria-label="اختيارات الأسبوع" className="flex flex-wrap gap-2 mb-5">
        {groups.map((g) => (
          <button
            key={g.id}
            role="tab"
            aria-selected={g.id === active}
            onClick={() => setActive(g.id)}
            className={`chip !min-h-11 ${g.id === active ? "!border-leaf !text-leaf-dark !bg-mint font-semibold" : ""}`}
          >
            {g.label}
          </button>
        ))}
      </div>
      <ul role="tabpanel" className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2 lg:gap-3">
        {current.items.map((p) => (
          <li key={p.id} className="border border-[#e7e7e7] rounded-lg">
            <ProductCard p={p} saved={saved.includes(p.id)} loggedIn={loggedIn} />
          </li>
        ))}
      </ul>
    </div>
  );
}
