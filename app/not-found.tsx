import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-20 text-center space-y-5">
      <p className="num text-7xl font-bold text-leaf">404</p>
      <h1 className="text-2xl">ما لقينا هذه الصفحة</h1>
      <p className="text-muted">ممكن الرابط تغيّر أو المنتج ما عاد متوفر.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary btn-lg">الرئيسية</Link>
        <Link href="/products" className="btn btn-ghost btn-lg">تصفّح المنتجات</Link>
      </div>
    </div>
  );
}
