import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, COD_FEE, FREE_SHIPPING_MIN, RX_MAX_QTY, SHIPPING } from "@/lib/config";
import Icon from "@/components/Icon";

export const metadata: Metadata = { title: "كيف أطلب؟ ومساعدة" };

const faq = [
  { q: "هل أقدر أدفع كاش لما يوصلني الطلب؟", a: `نعم، الدفع عند الاستلام متاح لكل المدن برسوم ${COD_FEE} ر.س. تدفع كاش أو بالشبكة للمندوب.` },
  { q: "وأنا ساكن في قرية بعيدة، توصلون لي؟", a: "نعم. اختر «قرية أو هجرة أو مركز» من قائمة المدن، واكتب اسم القرية وأقرب معلم. نوصل بالتوصيل العادي عبر ناقل أو البريد السعودي خلال ٢ – ٤ أيام." },
  { q: "كيف أطلب دواء بوصفة طبية؟", a: `ارفع صورة الوصفة من صفحة «ارفع وصفتك» أو في خطوة الدفع. يراجعها الصيدلاني قبل التجهيز. الحد الأقصى ${RX_MAX_QTY} علب لكل دواء في الطلب الواحد.` },
  { q: "ما أعرف أسوي حساب، وش أسوي؟", a: "ما تحتاج كلمة مرور. بس اكتب رقم جوالك وأدخل الرمز اللي يوصلك. أو راسلنا واتساب أو اتصل ونجهّز لك الطلب." },
  { q: "هل أقدر أرجّع المنتج؟", a: "المنتجات غير الدوائية يمكن إرجاعها خلال ١٤ يوم إذا كانت مغلقة وبحالتها. الأدوية ما تُرجع لأسباب تتعلق بسلامتك، إلا إذا وصلك منتج تالف أو خاطئ." },
  { q: "كيف أتابع طلبي؟", a: "من صفحة «طلباتي» تشوف كل مرحلة، ورقم الشحنة لما يخرج الطلب للتوصيل." },
];

export default function HelpPage() {
  return (
    <div className="container-x py-6 lg:py-10 max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl">كيف أطلب؟</h1>
        <p className="text-muted mt-1">ثلاث طرق، اختر اللي تريحك.</p>
      </div>

      <ul className="grid md:grid-cols-3 gap-4">
        <li className="card p-5 space-y-3">
          <Icon name="search" size={34} className="text-leaf" />
          <h2 className="text-xl">من الموقع</h2>
          <p className="text-muted">ابحث عن الدواء أو اختر القسم، وأضفه للسلة، وأكمل الطلب بخطوات بسيطة.</p>
          <Link href="/products" className="btn btn-primary w-full">تصفّح المنتجات</Link>
        </li>
        <li className="card p-5 space-y-3">
          <Icon name="whatsapp" size={34} className="text-[#1fa855]" />
          <h2 className="text-xl">بالواتساب</h2>
          <p className="text-muted">أرسل اسم الدواء أو صورة الوصفة، والصيدلاني يجهّز لك الطلب ويرسل لك الرابط.</p>
          <a href={`https://wa.me/${BRAND.whatsapp}`} className="btn w-full !bg-[#1fa855] text-white">افتح واتساب</a>
        </li>
        <li className="card p-5 space-y-3">
          <Icon name="phone" size={34} className="text-ink" />
          <h2 className="text-xl">بالاتصال</h2>
          <p className="text-muted">كلّم الصيدلاني مباشرة واسأله عن أي دواء قبل الطلب.</p>
          <a href={`tel:${BRAND.phone}`} className="btn btn-ink w-full"><span className="num">{BRAND.phone}</span></a>
        </li>
      </ul>

      <section id="delivery" className="card p-5 sm:p-6" aria-labelledby="del">
        <h2 id="del" className="text-xl mb-4">التوصيل والاستلام</h2>
        <ul className="space-y-3">
          {SHIPPING.map((s) => (
            <li key={s.id} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3 last:border-0 last:pb-0">
              <span><strong>{s.name}</strong> <span className="text-muted">· {s.desc}</span></span>
              <span className="num font-semibold">{s.price === 0 ? "مجاني" : `${s.price} ر.س`}</span>
            </li>
          ))}
        </ul>
        <p className="hint mt-3">التوصيل مجاني للطلبات فوق {FREE_SHIPPING_MIN} ر.س (عدا التوصيل السريع).</p>
      </section>

      <section id="returns" aria-labelledby="faq">
        <h2 id="faq" className="text-xl mb-3">أسئلة شائعة</h2>
        <div className="space-y-2">
          {faq.map((f) => (
            <details key={f.q} className="card p-4 group">
              <summary className="cursor-pointer font-semibold list-none flex items-center justify-between gap-3 min-h-8">
                {f.q}
                <Icon name="plus" className="shrink-0 group-open:rotate-45 transition-transform" />
              </summary>
              <p className="text-muted mt-3">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
