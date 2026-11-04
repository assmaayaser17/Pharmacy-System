import Link from "next/link";
import { BRAND, PAYMENTS } from "@/lib/config";
import { CATEGORIES } from "@/lib/seed";
import Icon from "./Icon";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="text-white">
      <a href="#main" className="block bg-[#37475a] hover:bg-[#485769] text-center text-[0.85rem] py-3.5">
        العودة إلى الأعلى
      </a>
      <div className="bg-ink-2">
      <div className="container-x py-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-1">
          <Logo light />
          <p className="text-[#ddd] text-[0.95rem] max-w-xs">
            {BRAND.tagline}. صيدلاني مرخّص يراجع كل طلب قبل ما يوصلك.
          </p>
          <div className="flex flex-col gap-2">
            <a href={`tel:${BRAND.phone}`} className="inline-flex items-center gap-2 font-semibold">
              <Icon name="phone" size={20} /> <span className="num">{BRAND.phone}</span>
            </a>
            <a href={`https://wa.me/${BRAND.whatsapp}`} className="inline-flex items-center gap-2 font-semibold">
              <Icon name="whatsapp" size={20} /> واتساب
            </a>
          </div>
        </div>

        <nav aria-label="الأقسام" className="space-y-3">
          <h2 className="text-base font-bold">الأقسام</h2>
          <ul className="space-y-1.5 text-[#ddd] text-[0.95rem]">
            {CATEGORIES.slice(0, 7).map((c) => (
              <li key={c.slug}>
                <Link href={`/products?category=${c.slug}`} className="hover:underline">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="مساعدة" className="space-y-3">
          <h2 className="text-base font-bold">مساعدة</h2>
          <ul className="space-y-1.5 text-[#ddd] text-[0.95rem]">
            <li><Link href="/help" className="hover:underline">كيف أطلب؟</Link></li>
            <li><Link href="/prescription" className="hover:underline">رفع الوصفة الطبية</Link></li>
            <li><Link href="/orders" className="hover:underline">تتبّع طلبي</Link></li>
            <li><Link href="/help#delivery" className="hover:underline">التوصيل والاستلام</Link></li>
            <li><Link href="/help#returns" className="hover:underline">الاسترجاع</Link></li>
          </ul>
        </nav>

        <div className="space-y-3">
          <h2 className="text-base font-bold">طرق الدفع</h2>
          <ul className="flex flex-wrap gap-2">
            {PAYMENTS.map((p) => (
              <li key={p.id} className="rounded-sm bg-white text-text px-3 py-1 text-[0.82rem]">
                {p.name}
              </li>
            ))}
          </ul>
          <p className="text-[#ccc] text-[0.85rem]">
            شركات التوصيل: مندوب الصيدلية، SMSA، ناقل، البريد السعودي
          </p>
        </div>
      </div>

      </div>
      <div className="bg-ink border-t border-[#3a4553]">
        <div className="container-x py-5 text-[0.82rem] text-[#999] space-y-1">
          <p>{BRAND.license} · {BRAND.vatNo}</p>
          <p>جميع الأسعار بالريال السعودي وشاملة ضريبة القيمة المضافة ١٥٪. الأدوية المسجّلة تُصرف بوصفة طبية سارية فقط.</p>
          <p>© {new Date().getFullYear()} {BRAND.name}. نسخة عرض تجريبية ببيانات وهمية.</p>
        </div>
      </div>
    </footer>
  );
}
