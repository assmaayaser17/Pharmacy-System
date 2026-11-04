import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import Icon from "@/components/Icon";
import AccountClient from "./AccountClient";

export const metadata: Metadata = { title: "حسابي" };

export default async function AccountPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/account");
  const d = db();
  const addresses = d.addresses.filter((a) => a.userId === user.id);
  const orders = d.orders.filter((o) => o.userId === user.id).length;
  const wish = (d.wishlist[user.id] ?? []).length;

  const links = [
    { href: "/orders", t: "طلباتي", s: `${orders} طلب`, i: "box" },
    { href: "/wishlist", t: "المفضلة", s: `${wish} منتج`, i: "heart" },
    { href: "/prescription", t: "وصفاتي الطبية", s: "ارفع أو راجع وصفاتك", i: "rx" },
    ...(user.role === "admin" ? [{ href: "/admin", t: "لوحة الإدارة", s: "الطلبات والمنتجات", i: "shield" }] : []),
  ];

  return (
    <div className="container-x py-6 lg:py-10 max-w-4xl space-y-6">
      <h1 className="text-2xl lg:text-3xl">أهلًا {user.name.split(" ")[0]}</h1>
      <ul className="grid sm:grid-cols-2 gap-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="card p-4 flex items-center gap-4 hover:shadow-lift transition-shadow">
              <span className="grid place-items-center size-14 rounded-full bg-mint text-leaf"><Icon name={l.i} size={28} /></span>
              <span className="flex-1"><strong className="block text-lg">{l.t}</strong><span className="text-muted text-sm">{l.s}</span></span>
              <Icon name="chevron" className="text-muted rtl:rotate-180" />
            </Link>
          </li>
        ))}
      </ul>
      <AccountClient user={{ name: user.name, phone: user.phone }} addresses={addresses} />
    </div>
  );
}
