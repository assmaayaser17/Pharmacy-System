import Link from "next/link";
import { BRAND } from "@/lib/config";
import type { User } from "@/lib/types";
import { CATEGORIES } from "@/lib/seed";
import CategoryMenu from "./CategoryMenu";
import { CartBadge, FontSizeToggle } from "./HeaderClient";
import Icon from "./Icon";
import Logo from "./Logo";

const NAV = [
  { href: "/products", label: "كل المنتجات" },
  { href: "/products?category=medicines", label: "أدوية بدون وصفة" },
  { href: "/products?category=vitamins", label: "فيتامينات" },
  { href: "/products?category=skin", label: "العناية بالبشرة" },
  { href: "/products?category=mother-baby", label: "الأم والطفل" },
  { href: "/products?category=devices", label: "أجهزة طبية" },
  { href: "/help", label: "كيف أطلب؟" },
];

function SearchForm() {
  return (
    <form action="/products" role="search" className="flex w-full rounded-md overflow-hidden focus-within:ring-[3px] focus-within:ring-gold">
      <label htmlFor="q" className="sr-only">
        ابحث عن دواء أو منتج
      </label>
      <select name="category" aria-label="القسم" className="hidden md:block bg-[#e6e6e6] text-text text-sm px-2 border-e border-line hover:bg-[#d4d4d4] cursor-pointer max-w-36">
        <option value="">كل الأقسام</option>
        {CATEGORIES.map((c) => (
          <option key={c.slug} value={c.slug}>{c.name}</option>
        ))}
      </select>
      <input
        id="q"
        name="q"
        type="search"
        autoComplete="off"
        placeholder="ابحث في صيدلية شفاء"
        className="flex-1 min-w-0 min-h-11 bg-white text-text px-3 outline-none placeholder:text-muted"
      />
      <button type="submit" aria-label="بحث" className="grid place-items-center w-12 bg-gold-light text-text hover:bg-gold">
        <Icon name="search" size={22} />
      </button>
    </form>
  );
}

function NavLink({ href, top, main, className = "" }: { href: string; top: string; main: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={`flex flex-col justify-center leading-tight px-2 py-1.5 rounded-sm border border-transparent hover:border-white whitespace-nowrap ${className}`}>
      <span className="text-[0.75rem] text-[#ccc] max-w-36 truncate">{top}</span>
      <span className="text-[0.9rem] font-bold">{main}</span>
    </Link>
  );
}

export default function Header({ user }: { user: User | null }) {
  return (
    <header className="text-white">
      {/* الصف الرئيسي */}
      <div className="sticky top-0 z-40 bg-ink">
        <div className="px-3 lg:px-4 py-2 flex flex-wrap lg:flex-nowrap items-center gap-x-3 gap-y-2">
          <div className="rounded-sm border border-transparent hover:border-white px-1 py-1">
            <Logo light />
          </div>
          <Link href="/help#delivery" className="hidden xl:flex items-center gap-1 px-2 py-1.5 rounded-sm border border-transparent hover:border-white leading-tight">
            <Icon name="truck" size={20} />
            <span>
              <span className="block text-[0.75rem] text-[#ccc]">التوصيل إلى</span>
              <span className="block text-[0.9rem] font-bold">كل مدن المملكة</span>
            </span>
          </Link>
          <div className="order-3 lg:order-none w-full lg:w-auto lg:flex-1">
            <SearchForm />
          </div>
          <nav aria-label="حسابي" className="ms-auto flex items-center gap-1">
            <div className="hidden xl:block whitespace-nowrap"><FontSizeToggle /></div>
            <NavLink
              href={user ? "/account" : "/login"}
              top={user ? `أهلًا، ${user.name.split(" ")[0]}` : "أهلًا، سجّل دخولك"}
              main="الحساب والقوائم"
              className="hidden lg:flex"
            />
            <NavLink href="/orders" top="المرتجعات" main="والطلبات" className="hidden xl:flex" />
            <CartBadge />
          </nav>
        </div>
      </div>

      {/* شريط التنقل */}
      <div className="bg-ink-2">
        <nav aria-label="الأقسام" className="px-2 lg:px-3">
          <ul className="scroll-x items-center !gap-0 text-[0.9rem]">
            <li><CategoryMenu /></li>
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="inline-flex items-center min-h-10 px-2.5 rounded-sm border border-transparent hover:border-white whitespace-nowrap">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/products?sale=1" className="inline-flex items-center min-h-10 px-2.5 rounded-sm border border-transparent hover:border-white whitespace-nowrap">
                عروض اليوم
              </Link>
            </li>
            <li className="ms-auto hidden xl:block">
              <Link href="/prescription" className="inline-flex items-center gap-1.5 min-h-10 px-2.5 rounded-sm border border-transparent hover:border-white whitespace-nowrap font-bold">
                <Icon name="rx" size={18} /> اطلب بالوصفة الطبية
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="bg-[#37475a] text-[0.85rem] py-1 px-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
        <span className="xl:hidden"><FontSizeToggle /></span>
      <p>
        خصم ١٠٪ على طلبك الأول بالكود <span className="font-bold num text-gold-light">SHIFA10</span> · خدمة العملاء{" "}
        <a href={`tel:${BRAND.phone}`} className="num font-bold hover:underline">{BRAND.phone}</a>
      </p>
      </div>
    </header>
  );
}
