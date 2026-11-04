import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PAYMENTS } from "@/lib/config";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { dateAr, money, num } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/status";
import ProductArt from "@/components/ProductArt";

export const metadata: Metadata = { title: "طلباتي" };

export default async function OrdersPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/orders");
  const orders = db()
    .orders.filter((o) => o.userId === user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="container-x py-6 lg:py-10 max-w-4xl">
      <h1 className="text-2xl lg:text-3xl mb-6">طلباتي</h1>
      {orders.length === 0 ? (
        <div className="card p-10 text-center space-y-4">
          <p className="text-xl font-semibold">ما عندك طلبات للحين</p>
          <Link href="/products" className="btn btn-primary btn-lg">ابدأ التسوق</Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => {
            const st = STATUS_LABEL[o.status];
            return (
              <li key={o.id}>
                <Link href={`/orders/${o.id}`} className="card p-4 sm:p-5 block hover:shadow-lift transition-shadow">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div>
                      <strong className="num text-lg">{o.number}</strong>
                      <span className="text-muted"> · {dateAr(o.createdAt)}</span>
                    </div>
                    <span className={`badge ${st.cls}`}>{st.t}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ul className="flex -space-x-3 rtl:space-x-reverse" aria-label="المنتجات">
                      {o.items.slice(0, 4).map((i) => (
                        <li key={i.id} className="rounded-full border-2 border-white" style={{ background: i.art.c2 }}>
                          <ProductArt art={i.art} label="" className="size-14 p-1.5" />
                        </li>
                      ))}
                    </ul>
                    <span className="text-muted text-sm">{num(o.items.reduce((s, i) => s + i.qty, 0))} منتجات · {PAYMENTS.find((p) => p.id === o.paymentId)?.name}</span>
                    <strong className="num ms-auto text-lg">{money(o.total)}</strong>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
