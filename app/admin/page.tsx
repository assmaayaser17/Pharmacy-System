import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { money, num } from "@/lib/format";
import { CATEGORIES } from "@/lib/seed";
import AdminClient from "./AdminClient";

export const metadata: Metadata = { title: "لوحة الإدارة" };

export default async function AdminPage() {
  const user = await getUser();
  if (!user || user.role !== "admin") redirect("/login?next=/admin");
  const d = db();
  const live = d.orders.filter((o) => o.status !== "cancelled");
  const revenue = live.reduce((s, o) => s + o.total, 0);
  const open = d.orders.filter((o) => ["received", "confirmed", "preparing", "out_for_delivery"].includes(o.status)).length;
  const low = d.products.filter((p) => p.stock <= 8).length;

  const orders = [...d.orders]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((o) => ({
      id: o.id,
      number: o.number,
      customer: d.users.find((u) => u.id === o.userId)?.name ?? o.address.name,
      city: o.address.city,
      total: o.total,
      status: o.status,
      paymentId: o.paymentId,
      createdAt: o.createdAt,
      rx: o.items.some((i) => i.rx),
    }));

  const stats = [
    { t: "إيراد الطلبات", v: money(revenue) },
    { t: "كل الطلبات", v: num(d.orders.length) },
    { t: "طلبات مفتوحة", v: num(open) },
    { t: "منتجات قاربت على النفاد", v: num(low) },
  ];

  return (
    <div className="container-x py-6 lg:py-10 space-y-6">
      <h1 className="text-2xl lg:text-3xl">لوحة الإدارة</h1>
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <li key={s.t} className="card p-4">
            <p className="text-muted text-sm">{s.t}</p>
            <p className="num text-2xl font-bold mt-1">{s.v}</p>
          </li>
        ))}
      </ul>
      <AdminClient
        orders={orders}
        products={d.products.map((p) => ({ id: p.id, nameAr: p.nameAr, brand: p.brand, cat: p.cat, price: p.price, oldPrice: p.oldPrice, stock: p.stock, rx: p.rx }))}
        categories={CATEGORIES.map((c) => ({ slug: c.slug, name: c.name }))}
      />
    </div>
  );
}
