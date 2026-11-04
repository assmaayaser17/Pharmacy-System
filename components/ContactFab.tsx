import { BRAND } from "@/lib/config";
import Icon from "./Icon";

/** زر عائم: أسهل طريقة لمن لا يرتاح للتسوق من الموقع، يطلب بالواتساب أو الاتصال */
export default function ContactFab() {
  const msg = encodeURIComponent("السلام عليكم، أبغى أطلب دواء من الصيدلية");
  return (
    <div className="fixed z-40 start-3 bottom-24 lg:bottom-6 flex flex-col gap-2 items-start">
      <a
        href={`https://wa.me/${BRAND.whatsapp}?text=${msg}`}
        className="btn !bg-[#1fa855] text-white shadow-lift !min-h-12 !w-12 !p-0 2xl:!w-auto 2xl:!px-5"
        aria-label="اطلب عن طريق واتساب"
      >
        <Icon name="whatsapp" size={26} />
        <span className="hidden 2xl:inline">اطلب بالواتساب</span>
      </a>
      <a href={`tel:${BRAND.phone}`} className="btn btn-ink shadow-lift !min-h-12 !w-12 !p-0 lg:hidden" aria-label="اتصل بالصيدلية">
        <Icon name="phone" size={22} />
        <span className="hidden 2xl:inline">اتصل</span>
      </a>
    </div>
  );
}
