import { json, requireAdmin } from "@/lib/auth";
import { CATEGORIES } from "@/lib/seed";
import { db, save } from "@/lib/db";
import type { Product } from "@/lib/types";

export async function POST(req: Request) {
  const { user, res } = await requireAdmin();
  if (!user) return res!;
  const b = await req.json().catch(() => ({}));
  const cat = CATEGORIES.find((c) => c.slug === b.cat);
  const nameAr = String(b.nameAr ?? "").trim();
  const price = Number(b.price);
  if (!nameAr || !cat || !(price > 0)) return json({ error: "الاسم والقسم والسعر مطلوبة" }, 400);
  const d = db();
  const n = d.products.reduce((m, p) => Math.max(m, Number(p.id.slice(1)) || 0), 0) + 1;
  const p: Product = {
    id: `p${n}`,
    nameAr,
    nameEn: String(b.nameEn ?? "").trim() || nameAr,
    brand: String(b.brand ?? "").trim() || "عام",
    cat: cat.slug,
    price,
    oldPrice: Number(b.oldPrice) > price ? Number(b.oldPrice) : undefined,
    rx: !!b.rx || cat.slug === "prescription",
    stock: Math.max(0, Math.floor(Number(b.stock) || 0)),
    rating: 4.5,
    reviews: 0,
    sold: 0,
    art: { kind: cat.art, c1: cat.c1, c2: cat.c2 },
    size: String(b.size ?? "").trim() || "قطعة",
    desc: String(b.desc ?? "").trim() || "وصف المنتج قريبًا.",
    usage: "استخدمه حسب إرشادات العبوة أو حسب توجيه الصيدلاني.",
    warn: "يحفظ بعيدًا عن متناول الأطفال.",
    tags: [],
    createdAt: new Date().toISOString(),
  };
  d.products.unshift(p);
  save();
  return json({ product: p }, 201);
}
