import Link from "next/link";
import { FREE_SHIPPING_MIN } from "@/lib/config";
import { getUser } from "@/lib/auth";
import { brands, searchProducts } from "@/lib/catalog";
import { db } from "@/lib/db";
import { CATEGORIES } from "@/lib/seed";
import Countdown from "@/components/Countdown";
import HeroCarousel from "@/components/HeroCarousel";
import Newsletter from "@/components/Newsletter";
import PickTabs from "@/components/PickTabs";
import ProductArt from "@/components/ProductArt";
import Price from "@/components/Price";
import ProductCard from "@/components/ProductCard";
import ProductRow from "@/components/ProductRow";
import PromoBanner from "@/components/PromoBanner";
import type { Product } from "@/lib/types";

function SectionHead({ id, title, sub, href, cta = "عرض الكل", extra }: { id: string; title: string; sub?: string; href?: string; cta?: string; extra?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
      <h2 id={id} className="text-xl lg:text-[1.35rem] font-bold">{title}</h2>
      {extra}
      {sub && <p className="text-muted text-[0.9rem] basis-full sm:basis-auto">{sub}</p>}
      {href && (
        <Link href={href} className="link text-[0.9rem]">
          {cta}
        </Link>
      )}
    </div>
  );
}

/** لوحة بيضاء: الوحدة الأساسية في الصفحة */
function Panel({ children, className = "", ...rest }: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={`bg-white p-4 lg:p-5 ${className}`} {...rest}>
      {children}
    </section>
  );
}

/** كرت بأربع منتجات وعنوان ورابط */
function QuadCard({ title, href, items, cta = "شاهد المزيد" }: { title: string; href: string; items: Product[]; cta?: string }) {
  return (
    <div className="bg-white p-3 sm:p-4 flex flex-col h-full">
      <h2 className="text-[1rem] sm:text-[1.25rem] font-bold leading-snug mb-3">{title}</h2>
      <ul className="grid grid-cols-2 gap-x-2 sm:gap-x-3 gap-y-2 flex-1">
        {items.slice(0, 4).map((p) => (
          <li key={p.id}>
            <Link href={`/product/${p.id}`} className="block group">
              <span className="block bg-paper">
                <ProductArt art={p.art} label="" className="w-full aspect-square p-2" />
              </span>
              <span className="text-[0.78rem] leading-tight mt-1 line-clamp-2 group-hover:text-[#c7511f]">{p.nameAr}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href={href} className="link text-[0.85rem] mt-3">{cta}</Link>
    </div>
  );
}

/** كرت بمنتج واحد كبير */
function SingleCard({ title, href, p, cta = "تسوّق الآن" }: { title: string; href: string; p: Product; cta?: string }) {
  return (
    <div className="bg-white p-3 sm:p-4 flex flex-col h-full">
      <h2 className="text-[1rem] sm:text-[1.25rem] font-bold leading-snug mb-3">{title}</h2>
      <Link href={`/product/${p.id}`} className="block flex-1 bg-paper">
        <ProductArt art={p.art} label={p.nameAr} className="w-full h-full max-h-72 aspect-square p-4" />
      </Link>
      <Link href={href} className="link text-[0.85rem] mt-3">{cta}</Link>
    </div>
  );
}

/** شريط أفقي من صور المنتجات */
function Strip({ id, title, href, items, prices = false }: { id: string; title: string; href?: string; items: Product[]; prices?: boolean }) {
  return (
    <Panel aria-labelledby={id}>
      <SectionHead id={id} title={title} href={href} cta="شاهد المزيد" />
      <ul className="scroll-x !gap-3">
        {items.map((p) => (
          <li key={p.id} className="w-40 sm:w-48">
            <Link href={`/product/${p.id}`} className="block group">
              <span className="block bg-paper">
                <ProductArt art={p.art} label={p.nameAr} className="w-full aspect-square p-3 transition-transform group-hover:scale-105" />
              </span>
              {prices && (
                <span className="block mt-1.5">
                  {p.oldPrice && p.oldPrice > p.price && (
                    <span className="badge bg-coral text-white !rounded-sm me-1">خصم <span className="num">{Math.round((1 - p.price / p.oldPrice) * 100)}%</span></span>
                  )}
                  <span className="block mt-1"><Price value={p.price} size="sm" /></span>
                  <span className="text-[0.8rem] line-clamp-1 group-hover:text-[#c7511f]">{p.nameAr}</span>
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

const BRAND_STYLES = [
  "font-extrabold tracking-tight text-[#232f3e]",
  "font-light text-[#007185]",
  "font-bold italic text-[#c45500]",
  "font-semibold text-[#cc0c39]",
  "font-black text-[#131921]",
  "font-medium text-[#0f8a5f]",
];

export default async function Home() {
  const user = await getUser();
  const saved = user ? (db().wishlist[user.id] ?? []) : [];
  const grid = (items: Product[], flash = false) => (
    <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2 lg:gap-3">
      {items.map((p) => (
        <li key={p.id} className="border border-[#e7e7e7] rounded-lg">
          <ProductCard p={p} saved={saved.includes(p.id)} loggedIn={!!user} flash={flash} />
        </li>
      ))}
    </ul>
  );

  const flash = searchProducts({ sale: "1", sort: "discount", limit: 5 }).items;
  const combos = searchProducts({ sale: "1", sort: "popular", limit: 10 }).items.filter((p) => !flash.some((f) => f.id === p.id)).slice(0, 5);
  const pick = (cat: string, n = 5) => searchProducts({ category: cat, sort: "popular", inStock: "1", limit: n }).items;
  const groups = [
    { id: "meds", label: "أدوية", items: pick("medicines") },
    { id: "dev", label: "أجهزة", items: pick("devices") },
    { id: "vit", label: "فيتامينات", items: pick("vitamins") },
    { id: "skin", label: "بشرة", items: pick("skin") },
  ];
  const fresh = searchProducts({ sort: "new", rx: "0", limit: 4 }).items;
  const trending = searchProducts({ sort: "popular", rx: "0", limit: 4 }).items;
  const onSale = searchProducts({ sale: "1", sort: "discount", limit: 4 }).items;
  const recommended = searchProducts({ sort: "rating", rx: "0", inStock: "1", limit: 5 }).items;
  const bestVit = searchProducts({ category: "vitamins", sort: "popular", limit: 12 }).items;
  const bestAll = searchProducts({ sort: "popular", rx: "0", limit: 14 }).items;
  const deals = searchProducts({ sale: "1", sort: "discount", limit: 14 }).items;
  const device = pick("devices", 1)[0];

  return (
    <div className="bg-ivory pb-16 -mb-10">
      {/* ١) البانر الرئيسي بعرض الشاشة */}
      <HeroCarousel />

      <div className="relative z-10 mx-auto max-w-[96rem] px-2 sm:px-4 space-y-5 mt-2 sm:-mt-8 lg:-mt-44">
        {/* ٢) كروت الأقسام فوق البانر */}
        <section aria-label="تسوّق حسب الاهتمام" className="grid gap-2 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <QuadCard title="أدوية بدون وصفة" href="/products?category=medicines" items={pick("medicines", 4)} />
          <QuadCard title="عناية بالبشرة بأقل الأسعار" href="/products?category=skin" items={pick("skin", 4)} />
          {device && <SingleCard title="أجهزة الضغط والسكر" href="/products?category=devices" p={device} cta="شاهد كل الأجهزة" />}
          {user ? (
            <QuadCard title="فيتامينات ومكملات" href="/products?category=vitamins" items={pick("vitamins", 4)} />
          ) : (
            <div className="flex flex-col gap-4">
              <div className="bg-white p-4">
                <h2 className="text-[1.25rem] font-bold mb-3">سجّل دخولك لأفضل تجربة</h2>
                <Link href="/login" className="btn btn-primary btn-sm w-full">تسجيل الدخول بأمان</Link>
              </div>
              <div className="bg-white p-4 flex-1 flex flex-col">
                <h2 className="text-[1.1rem] font-bold mb-2">ارفع وصفتك الطبية</h2>
                <p className="text-[0.9rem] text-muted flex-1">صوّر الوصفة ويجهّزها الصيدلاني ويتواصل معك خلال دقائق.</p>
                <Link href="/prescription" className="link text-[0.85rem] mt-2">ارفع الوصفة الآن</Link>
              </div>
            </div>
          )}
        </section>

        {/* ٣) الأكثر مبيعًا */}
        <Strip id="best" title="الأكثر مبيعًا في الصيدلية" href="/products?sort=popular" items={bestAll} />

        {/* ٤) عروض اليوم */}
        <Panel aria-labelledby="flash">
          <SectionHead id="flash" title="عروض اليوم" href="/products?sale=1&sort=discount" cta="شاهد كل العروض" extra={<Countdown />} />
          {grid(flash, true)}
        </Panel>

        <section aria-label="المزيد من الأقسام" className="grid gap-2 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <QuadCard title="كل ما يحتاجه طفلك" href="/products?category=mother-baby" items={pick("mother-baby", 4)} />
          <QuadCard title="العناية بالشعر" href="/products?category=hair" items={pick("hair", 4).concat(pick("personal", 4)).slice(0, 4)} />
          <QuadCard title="ابتسامة صحية" href="/products?category=oral" items={pick("oral", 4)} />
          <QuadCard title="إسعافات أولية للبيت" href="/products?category=first-aid" items={pick("first-aid", 4)} />
        </section>

        {/* ٥) بانر */}
        <PromoBanner
          bg="linear-gradient(100deg,#232f3e,#37475a)"
          dark
          title="صحتك أحسن مع بعض"
          sub="اطلب فيتاميناتك الشهرية وخذ خصم ١٠٪ على طلبك بالكود SHIFA10"
          cta="تسوّق الفيتامينات"
          href="/products?category=vitamins"
          arts={pick("vitamins", 3).map((p) => p.art)}
        />

        {/* ٦) خصومات بشريط أفقي */}
        <Strip id="deals" title="خصومات لا تفوّتها" href="/products?sale=1" items={deals} prices />

        {/* ٧) تسوّق حسب القسم */}
        <Panel aria-labelledby="cats">
          <SectionHead id="cats" title="تسوّق حسب القسم" href="/products" cta="كل الأقسام" />
          <ul className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/products?category=${c.slug}`} className="group flex flex-col items-center gap-1 text-center">
                  <span className="grid place-items-center rounded-full bg-paper size-24 sm:size-28 group-hover:shadow-lift transition-shadow">
                    <ProductArt art={{ kind: c.art, c1: c.c1, c2: c.c2 }} label="" className="size-20 sm:size-24" />
                  </span>
                  <span className="text-[0.88rem] leading-snug group-hover:text-[#c7511f]">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        {/* ٨) اختيارات الأسبوع */}
        <Panel aria-labelledby="picks">
          <SectionHead id="picks" title="اختيارات هذا الأسبوع" sub="منتجات يطلبها عملاؤنا أكثر من غيرها" />
          <PickTabs groups={groups} saved={saved} loggedIn={!!user} />
        </Panel>

        <Strip id="bestvit" title="الأكثر مبيعًا في الفيتامينات" href="/products?category=vitamins&sort=popular" items={bestVit} />

        {/* ٩) عروض الباقات */}
        {combos.length > 0 && (
          <Panel aria-labelledby="combo">
            <SectionHead id="combo" title="عروض الباقات الأكثر طلبًا" href="/products?sale=1&sort=popular" />
            {grid(combos)}
          </Panel>
        )}

        {/* ١٠) ثلاث قوائم */}
        <section className="grid md:grid-cols-3 gap-4" aria-label="جديد ورائج وعروض">
          {[
            { t: "وصل حديثًا", items: fresh, href: "/products?sort=new" },
            { t: "الأكثر رواجًا", items: trending, href: "/products?sort=popular" },
            { t: "تخفيضات", items: onSale, href: "/products?sale=1" },
          ].map((col) => (
            <div key={col.t} className="bg-white p-4">
              <h2 className="text-[1.25rem] font-bold mb-2">{col.t}</h2>
              <ul className="divide-y divide-[#e7e7e7]">
                {col.items.map((p) => (
                  <li key={p.id}><ProductRow p={p} /></li>
                ))}
              </ul>
              <Link href={col.href} className="link text-[0.85rem] inline-block mt-2">شاهد المزيد</Link>
            </div>
          ))}
        </section>

        {/* ١١) الماركات */}
        <Panel aria-labelledby="brands">
          <SectionHead id="brands" title="ماركات مميزة" />
          <ul className="scroll-x lg:grid lg:grid-cols-6 lg:gap-3">
            {brands().slice(0, 12).map((b, i) => (
              <li key={b} className="min-w-40 lg:min-w-0">
                <Link href={`/products?brand=${encodeURIComponent(b)}`} className={`grid place-items-center min-h-20 rounded-lg border border-line bg-white px-3 text-xl hover:shadow-lift transition-shadow ${BRAND_STYLES[i % BRAND_STYLES.length]}`}>
                  {b}
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        {/* ١٢) مختارة لك */}
        <Panel aria-labelledby="rec">
          <SectionHead id="rec" title="مختارة لك" sub="الأعلى تقييمًا من عملائنا" href="/products?sort=rating" />
          {grid(recommended)}
        </Panel>

        {/* ١٣) النشرة البريدية */}
        <Panel aria-labelledby="nl-h" className="text-center !py-8 border-y border-line">
          <h2 id="nl-h" className="text-xl font-bold">وصلك كل جديد وعروض حصرية</h2>
          <p className="text-muted text-[0.9rem] mt-1">اشترك بالنشرة وخذ خصم ١٠٪ على أول طلب. التوصيل مجاني فوق <span className="num">{FREE_SHIPPING_MIN}</span> ر.س.</p>
          <div className="flex justify-center mt-4"><Newsletter /></div>
          {!user && (
            <p className="text-[0.85rem] mt-4">
              عميل جديد؟ <Link href="/login" className="link">ابدأ من هنا.</Link>
            </p>
          )}
        </Panel>
      </div>
    </div>
  );
}
