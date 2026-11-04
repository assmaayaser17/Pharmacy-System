import { db } from "./db";
import { toLatinDigits } from "./format";
import type { Product } from "./types";

/** تطبيع النص العربي للبحث: يشيل التشكيل ويوحّد الألف والياء والتاء المربوطة */
export function norm(s: string): string {
  return toLatinDigits(s)
    .toLowerCase()
    .replace(/[ً-ٰٟـ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .trim();
}

export type Sort = "popular" | "price_asc" | "price_desc" | "new" | "rating" | "discount";

export type Query = {
  q?: string;
  category?: string;
  brand?: string;
  rx?: string; // "1" | "0"
  sale?: string;
  min?: number;
  max?: number;
  sort?: Sort;
  page?: number;
  inStock?: string;
  ids?: string[];
  limit?: number;
};

export function searchProducts(query: Query) {
  let list = db().products.slice();
  if (query.ids?.length) list = list.filter((p) => query.ids!.includes(p.id));
  if (query.category) list = list.filter((p) => p.cat === query.category);
  if (query.brand) list = list.filter((p) => p.brand === query.brand);
  if (query.rx === "1") list = list.filter((p) => p.rx);
  if (query.rx === "0") list = list.filter((p) => !p.rx);
  if (query.sale === "1") list = list.filter((p) => p.oldPrice && p.oldPrice > p.price);
  if (query.inStock === "1") list = list.filter((p) => p.stock > 0);
  if (query.min != null && !Number.isNaN(query.min)) list = list.filter((p) => p.price >= query.min!);
  if (query.max != null && !Number.isNaN(query.max)) list = list.filter((p) => p.price <= query.max!);

  if (query.q) {
    const terms = norm(query.q).split(" ").filter(Boolean);
    list = list.filter((p) => {
      const hay = norm([p.nameAr, p.nameEn, p.brand, p.desc, p.size, ...p.tags].join(" "));
      return terms.every((t) => hay.includes(t));
    });
  }

  const disc = (p: Product) => (p.oldPrice ? (p.oldPrice - p.price) / p.oldPrice : 0);
  const sort = query.sort ?? "popular";
  list.sort((a, b) => {
    switch (sort) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "new":
        return b.createdAt.localeCompare(a.createdAt);
      case "rating":
        return b.rating - a.rating || b.reviews - a.reviews;
      case "discount":
        return disc(b) - disc(a);
      default:
        return b.sold - a.sold;
    }
  });

  const limit = query.limit ?? 12;
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const page = Math.min(Math.max(1, query.page ?? 1), pages);
  return { items: list.slice((page - 1) * limit, page * limit), total, page, pages };
}

export function getProduct(id: string) {
  return db().products.find((p) => p.id === id) ?? null;
}

export function brands() {
  return [...new Set(db().products.map((p) => p.brand))].sort((a, b) => a.localeCompare(b, "ar"));
}

export function related(p: Product, n = 6) {
  return db()
    .products.filter((x) => x.cat === p.cat && x.id !== p.id)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, n);
}

export function parseQuery(sp: Record<string, string | string[] | undefined>): Query {
  const one = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const n = (k: string) => {
    const v = one(k);
    return v ? Number(toLatinDigits(v)) : undefined;
  };
  return {
    q: one("q") || undefined,
    category: one("category") || undefined,
    brand: one("brand") || undefined,
    rx: one("rx") || undefined,
    sale: one("sale") || undefined,
    inStock: one("inStock") || undefined,
    min: n("min"),
    max: n("max"),
    sort: (one("sort") as Sort) || undefined,
    page: n("page"),
  };
}
