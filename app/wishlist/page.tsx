import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = { title: "المفضلة" };

export default async function WishlistPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/wishlist");
  const d = db();
  const ids = d.wishlist[user.id] ?? [];
  const items = ids.map((id) => d.products.find((p) => p.id === id)).filter((p) => !!p);

  return (
    <div className="container-x py-6 lg:py-10">
      <h1 className="text-2xl lg:text-3xl mb-6">المفضلة</h1>
      {items.length === 0 ? (
        <div className="card p-10 text-center space-y-4">
          <p className="text-xl font-semibold">ما حفظت أي منتج للحين</p>
          <p className="text-muted">اضغط على القلب في أي منتج عشان تلقاه هنا بسرعة.</p>
          <Link href="/products" className="btn btn-primary btn-lg">تصفّح المنتجات</Link>
        </div>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
          {items.map((p) => (
            <li key={p.id}><ProductCard p={p} saved loggedIn /></li>
          ))}
        </ul>
      )}
    </div>
  );
}
