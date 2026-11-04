import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BRAND, FREE_SHIPPING_MIN } from "@/lib/config";
import { getUser } from "@/lib/auth";
import { getProduct, related } from "@/lib/catalog";
import { db } from "@/lib/db";
import { dateAr, discountPct, money, num } from "@/lib/format";
import { CATEGORIES } from "@/lib/seed";
import AddToCart from "@/components/AddToCart";
import Icon from "@/components/Icon";
import ProductArt from "@/components/ProductArt";
import ProductCard from "@/components/ProductCard";
import ReviewForm from "@/components/ReviewForm";
import WishlistButton from "@/components/WishlistButton";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = getProduct(id);
  return { title: p ? p.nameAr : "منتج غير موجود", description: p?.desc };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) notFound();
  const user = await getUser();
  const d = db();
  const saved = user ? (d.wishlist[user.id] ?? []) : [];
  const reviews = d.reviews.filter((r) => r.productId === p.id).slice(0, 8);
  const cat = CATEGORIES.find((c) => c.slug === p.cat)!;
  const off = discountPct(p.price, p.oldPrice);
  const rel = related(p, 4);

  return (
    <div className="container-x py-6 lg:py-8">
      <nav aria-label="مسار التصفح" className="text-sm text-muted mb-4">
        <Link href="/" className="hover:underline">الرئيسية</Link> <span aria-hidden>›</span>{" "}
        <Link href={`/products?category=${cat.slug}`} className="hover:underline">{cat.name}</Link> <span aria-hidden>›</span> {p.nameAr}
      </nav>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-start">
        <div className="rounded-2xl border border-line bg-white relative overflow-hidden">
          <ProductArt art={p.art} label={p.nameAr} className="w-full aspect-square max-h-[34rem] p-10 mx-auto" />
          <div className="absolute top-4 start-4 flex flex-col gap-2 items-start">
            {off > 0 && <span className="badge bg-coral text-white text-sm">خصم <span className="num">{num(off)}%</span></span>}
            {p.rx && <span className="badge bg-ink text-white text-sm"><Icon name="rx" size={15} /> بوصفة طبية</span>}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <Link href={`/products?brand=${encodeURIComponent(p.brand)}`} className="text-muted hover:underline">{p.brand}</Link>
            <h1 className="text-3xl lg:text-[2.2rem] mt-1">{p.nameAr}</h1>
            <p className="text-muted mt-1">{p.nameEn} · {p.size}</p>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <Icon name="star" size={20} fill className="text-amber" />
              <span className="num font-bold text-base">{p.rating}</span>
              <a href="#reviews" className="text-muted underline underline-offset-4">{num(p.reviews)} تقييم</a>
              <span className="text-muted">· بيع منه <span className="num">{num(p.sold)}</span></span>
            </div>
          </div>

          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-4xl font-bold num">{money(p.price)}</span>
            {p.oldPrice && p.oldPrice > p.price && <span className="text-xl text-muted line-through num">{money(p.oldPrice)}</span>}
            <span className="text-sm text-muted">شامل ضريبة القيمة المضافة ١٥٪</span>
          </div>

          {p.rx && (
            <div className="rounded-2xl bg-amber-soft p-4 flex gap-3">
              <Icon name="rx" size={28} className="shrink-0 text-[#c45500]" />
              <p className="text-[0.97rem]">
                هذا الدواء يُصرف <strong>بوصفة طبية</strong>. تضيفه للسلة، وقبل الدفع ترفع صورة الوصفة ويراجعها الصيدلاني.
                {" "}
                <Link href="/prescription" className="font-bold underline underline-offset-4">ارفع الوصفة الآن</Link>
              </p>
            </div>
          )}
          {p.cold && (
            <div className="rounded-2xl bg-[#e4eae6] p-4 flex gap-3">
              <Icon name="shield" size={28} className="shrink-0 text-[#005f6b]" />
              <p className="text-[0.97rem]">يُحفظ مبرّدًا، ويوصل بالتوصيل السريع أو توصيل اليوم أو الاستلام من الفرع فقط.</p>
            </div>
          )}

          <p className={`font-semibold ${p.stock > 0 ? "text-leaf" : "text-coral"}`}>
            {p.stock > 8 ? "متوفر" : p.stock > 0 ? `باقي ${num(p.stock)} فقط` : "غير متوفر حاليًا"}
          </p>

          <AddToCart product={p} />

          <div className="flex flex-wrap gap-3">
            <WishlistButton productId={p.id} initial={saved.includes(p.id)} loggedIn={!!user} withLabel />
            <a
              href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(`السلام عليكم، عندي استفسار عن: ${p.nameAr}`)}`}
              className="btn btn-ghost"
            >
              <Icon name="whatsapp" /> اسأل الصيدلاني
            </a>
          </div>

          <ul className="grid sm:grid-cols-2 gap-3 pt-2">
            <li className="flex gap-3 items-start"><Icon name="truck" className="text-leaf shrink-0" /> <span>توصيل مجاني فوق {FREE_SHIPPING_MIN} ر.س</span></li>
            <li className="flex gap-3 items-start"><Icon name="shield" className="text-leaf shrink-0" /> <span>منتج أصلي من مورّد مرخّص</span></li>
            <li className="flex gap-3 items-start"><Icon name="box" className="text-leaf shrink-0" /> <span>استرجاع خلال ١٤ يوم للمنتجات غير الدوائية</span></li>
            <li className="flex gap-3 items-start"><Icon name="card" className="text-leaf shrink-0" /> <span>ادفع كاش أو تقسيط بتمارا وتابي</span></li>
          </ul>
        </div>
      </div>

      <section className="grid md:grid-cols-3 gap-4 mt-12" aria-label="تفاصيل المنتج">
        <div className="card p-5"><h2 className="text-lg mb-2">نبذة</h2><p className="text-muted">{p.desc}</p></div>
        <div className="card p-5"><h2 className="text-lg mb-2">طريقة الاستخدام</h2><p className="text-muted">{p.usage}</p></div>
        <div className="card p-5"><h2 className="text-lg mb-2">تنبيهات</h2><p className="text-muted">{p.warn}</p></div>
      </section>

      <section id="reviews" className="mt-12 grid lg:grid-cols-[1fr_24rem] gap-8 items-start" aria-labelledby="rv-h">
        <div>
          <h2 id="rv-h" className="text-2xl mb-4">آراء العملاء</h2>
          <ul className="space-y-3">
            {reviews.map((r) => (
              <li key={r.id} className="card p-4">
                <div className="flex items-center justify-between gap-3">
                  <strong>{r.name}</strong>
                  <span className="text-sm text-muted">{dateAr(r.createdAt)}</span>
                </div>
                <div className="flex gap-0.5 my-1" aria-label={`${r.stars} من 5`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Icon key={n} name="star" size={17} fill={n <= r.stars} className={n <= r.stars ? "text-amber" : "text-line"} />
                  ))}
                </div>
                <p>{r.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <ReviewForm productId={p.id} loggedIn={!!user} />
      </section>

      {rel.length > 0 && (
        <section className="mt-14" aria-labelledby="rel">
          <h2 id="rel" className="text-2xl mb-4">منتجات مشابهة</h2>
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {rel.map((x) => (
              <li key={x.id}>
                <ProductCard p={x} saved={saved.includes(x.id)} loggedIn={!!user} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
