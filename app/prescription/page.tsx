import type { Metadata } from "next";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import PrescriptionClient from "./PrescriptionClient";

export const metadata: Metadata = { title: "ارفع وصفتك الطبية" };

export default async function PrescriptionPage() {
  const user = await getUser();
  const list = user ? db().prescriptions.filter((p) => p.userId === user.id).reverse() : [];
  return (
    <div className="container-x py-6 lg:py-10 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl">ارفع وصفتك الطبية</h1>
        <p className="text-muted mt-1">صوّر الوصفة وارفعها، ويراجعها الصيدلاني ويجهّز لك الأدوية. ما تحتاج تدور الأدوية بنفسك.</p>
      </div>
      <PrescriptionClient loggedIn={!!user} initial={list} />
      <section className="card p-5 sm:p-6" aria-labelledby="tips">
        <h2 id="tips" className="text-xl mb-3">عشان تنقبل وصفتك</h2>
        <ul className="space-y-2 list-disc ps-6 text-[1.02rem]">
          <li>الصورة واضحة ويظهر فيها اسم الطبيب والمريض والتاريخ.</li>
          <li>الوصفة سارية وصادرة من طبيب مرخّص في المملكة.</li>
          <li>الكمية لا تزيد عن توريد ٣ أشهر، حسب أنظمة هيئة الغذاء والدواء.</li>
          <li>الأدوية المخدّرة والمؤثرات العقلية ما تُصرف أونلاين.</li>
        </ul>
      </section>
    </div>
  );
}
