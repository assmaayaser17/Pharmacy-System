import type { Metadata } from "next";
import Link from "next/link";
import { getUser } from "@/lib/auth";
import { brands, parseQuery, searchProducts } from "@/lib/catalog";
import { db } from "@/lib/db";
import { num } from "@/lib/format";
import { CATEGORIES } from "@/lib/seed";
import Icon from "@/components/Icon";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = { title: "المنتجات" };

type SP = Promise<Record<string, string | string[] | undefined>>;

const SORTS = [
  ["popular", "الأكثر طلبًا"],
  ["price_asc", "السعر: الأقل أولًا"],
  ["price_desc", "السعر: الأعلى أولًا"],
  ["discount", "أعلى خصم"],
  ["rating", "الأعلى تقييمًا"],
  ["new", "الأحدث"],
] as const;

function href(sp: Record<string, string | string[] | undefined>, patch: Record<string, string | undefined>) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...sp, ...patch })) {
    const val = Array.isArray(v) ? v[0] : v;
    if (val) p.set(k, val);
  }
  const s = p.toString();
  return s ? `/products?${s}` : "/products";
}

export default async function Products({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = parseQuery(sp);
  const user = await getUser();
  const saved = user ? (db().wishlist[user.id] ?? []) : [];
  const res = searchProducts({ ...q, limit: 12 });
  const cat = CATEGORIES.find((c) => c.slug === q.category);

  const chips: { label: string; remove: string }[] = [];
  if (q.q) chips.push({ label: `بحث: ${q.q}`, remove: href(sp, { q: undefined, page: undefined }) });
  if (cat) chips.push({ label: cat.name, remove: href(sp, { category: undefined, page: undefined }) });
  if (q.brand) chips.push({ label: q.brand, remove: href(sp, { brand: undefined, page: undefined }) });
  if (q.rx === "1") chips.push({ label: "بوصفة طبية", remove: href(sp, { rx: undefined, page: undefined }) });
  if (q.rx === "0") chips.push({ label: "بدون وصفة", remove: href(sp, { rx: undefined, page: undefined }) });
  if (q.sale === "1") chips.push({ label: "العروض فقط", remove: href(sp, { sale: undefined, page: undefined }) });
  if (q.inStock === "1") chips.push({ label: "المتوفر فقط", remove: href(sp, { inStock: undefined, page: undefined }) });
  if (q.min != null || q.max != null)
    chips.push({ label: `السعر ${q.min ?? 0} – ${q.max ?? "∞"} ر.س`, remove: href(sp, { min: undefined, max: undefined, page: undefined }) });

  const title = q.q ? `نتائج «${q.q}»` : cat ? cat.name : q.sale === "1" ? "العروض" : "كل المنتجات";

  const filters = (
    <form action="/products" className="space-y-6">
      {q.q && <input type="hidden" name="q" value={q.q} />}
      <fieldset>
        <legend className="font-bold mb-2">القسم</legend>
        <ul className="space-y-1">
          <li>
            <label className="flex items-center gap-2.5 min-h-10 cursor-pointer">
              <input type="radio" name="category" value="" defaultChecked={!q.category} className="size-5 accent-[#007185]" />
              الكل
            </label>
          </li>
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <label className="flex items-center gap-2.5 min-h-10 cursor-pointer">
                <input type="radio" name="category" value={c.slug} defaultChecked={q.category === c.slug} className="size-5 accent-[#007185]" />
                {c.name}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <div>
        <label htmlFor="brand" className="font-bold block mb-2">الماركة</label>
        <select id="brand" name="brand" defaultValue={q.brand ?? ""} className="field">
          <option value="">كل الماركات</option>
          {brands().map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="rx" className="font-bold block mb-2">نوع الدواء</label>
        <select id="rx" name="rx" defaultValue={q.rx ?? ""} className="field">
          <option value="">الكل</option>
          <option value="0">بدون وصفة</option>
          <option value="1">بوصفة طبية</option>
        </select>
      </div>

      <fieldset>
        <legend className="font-bold mb-2">السعر (ر.س)</legend>
        <div className="flex items-center gap-2">
          <input name="min" type="number" inputMode="numeric" min={0} placeholder="من" defaultValue={q.min ?? ""} className="field" aria-label="أقل سعر" />
          <span>-</span>
          <input name="max" type="number" inputMode="numeric" min={0} placeholder="إلى" defaultValue={q.max ?? ""} className="field" aria-label="أعلى سعر" />
        </div>
      </fieldset>

      <div className="space-y-1">
        <label className="flex items-center gap-2.5 min-h-10 cursor-pointer">
          <input type="checkbox" name="sale" value="1" defaultChecked={q.sale === "1"} className="size-5 accent-[#007185]" />
          العروض فقط
        </label>
        <label className="flex items-center gap-2.5 min-h-10 cursor-pointer">
          <input type="checkbox" name="inStock" value="1" defaultChecked={q.inStock === "1"} className="size-5 accent-[#007185]" />
          المتوفر فقط
        </label>
      </div>

      <input type="hidden" name="sort" value={q.sort ?? "popular"} />
      <div className="flex gap-2">
        <button className="btn btn-primary flex-1">طبّق</button>
        <Link href="/products" className="btn btn-ghost">مسح</Link>
      </div>
    </form>
  );

  return (
    <div className="container-x py-6 lg:py-8">
      <nav aria-label="مسار التصفح" className="text-sm text-muted mb-3">
        <Link href="/" className="hover:underline">الرئيسية</Link> <span aria-hidden>›</span> {title}
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl lg:text-3xl">{title}</h1>
          <p className="text-muted">
            <span className="num">{num(res.total)}</span> منتج
          </p>
        </div>
        <form action="/products" className="flex items-center gap-2 w-full sm:w-auto">
          {Object.entries(sp).map(([k, v]) =>
            k === "sort" || k === "page" ? null : <input key={k} type="hidden" name={k} value={Array.isArray(v) ? v[0] : (v ?? "")} />,
          )}
          <label htmlFor="sort" className="font-semibold shrink-0">ترتيب:</label>
          <select id="sort" name="sort" defaultValue={q.sort ?? "popular"} className="field !min-h-10 flex-1 sm:flex-none sm:!w-auto min-w-0">
            {SORTS.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <button className="btn btn-ink btn-sm shrink-0">تطبيق</button>
        </form>
      </div>

      {chips.length > 0 && (
        <ul className="flex flex-wrap gap-2 mb-4" aria-label="الفلاتر المطبّقة">
          {chips.map((c) => (
            <li key={c.label}>
              <Link href={c.remove} className="chip !bg-mint !border-mint" aria-label={`شيل الفلتر ${c.label}`}>
                {c.label} <Icon name="close" size={16} />
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="grid lg:grid-cols-[17rem_1fr] gap-8 items-start">
        <aside className="lg:sticky lg:top-28">
          <details className="lg:hidden card p-4 mb-2 group">
            <summary className="btn btn-ghost w-full cursor-pointer list-none">
              <Icon name="filter" size={20} /> الفلاتر
            </summary>
            <div className="pt-5">{filters}</div>
          </details>
          <div className="hidden lg:block card p-5">{filters}</div>
        </aside>

        <section aria-label="نتائج البحث">
          {res.items.length === 0 ? (
            <div className="card p-10 text-center space-y-4">
              <p className="text-xl font-semibold">ما لقينا منتجات تطابق بحثك</p>
              <p className="text-muted">جرّب كلمة ثانية أو امسح الفلاتر. وإذا تبغى دواء معيّن راسلنا ونوفّره لك.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/products" className="btn btn-primary">اعرض كل المنتجات</Link>
                <Link href="/help" className="btn btn-ghost">كلّم الصيدلاني</Link>
              </div>
            </div>
          ) : (
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
              {res.items.map((p) => (
                <li key={p.id}>
                  <ProductCard p={p} saved={saved.includes(p.id)} loggedIn={!!user} />
                </li>
              ))}
            </ul>
          )}

          {res.pages > 1 && (
            <nav aria-label="الصفحات" className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {res.page > 1 && (
                <Link href={href(sp, { page: String(res.page - 1) })} className="btn btn-ghost">السابق</Link>
              )}
              {Array.from({ length: res.pages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={href(sp, { page: String(n) })}
                  aria-current={n === res.page ? "page" : undefined}
                  className={`btn num !min-w-12 !px-0 ${n === res.page ? "btn-ink" : "btn-ghost"}`}
                >
                  {n}
                </Link>
              ))}
              {res.page < res.pages && (
                <Link href={href(sp, { page: String(res.page + 1) })} className="btn btn-ghost">التالي</Link>
              )}
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
