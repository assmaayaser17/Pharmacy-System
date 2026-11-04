import type { PaymentMethod, ShippingOption } from "./types";

// ⚙️ كل بيانات الهوية في مكان واحد — غيّرها لما العميل يعتمد الاسم الحقيقي
export const BRAND = {
  name: "صيدلية شفاء",
  tagline: "دواؤك يوصلك وين ما كنت",
  phone: "920000000",
  whatsapp: "966500000000",
  email: "care@shifa-pharmacy.example",
  license: "ترخيص وزارة الصحة رقم ٠٠٠٠٠٠ (بيانات تجريبية)",
  vatNo: "الرقم الضريبي ٣٠٠٠٠٠٠٠٠٠٠٠٠٠٣ (تجريبي)",
};

export const VAT_RATE = 0.15;
export const FREE_SHIPPING_MIN = 199;
export const COD_FEE = 10;
export const RX_MAX_QTY = 3; // الحد الأقصى لكمية الدواء بوصفة (تقريبًا توريد ٣ أشهر)

export type City = {
  id: string;
  name: string;
  region: string;
  express: boolean;
  sameDay: boolean;
  pickup: boolean;
};

export const CITIES: City[] = [
  { id: "riyadh", name: "الرياض", region: "الرياض", express: true, sameDay: true, pickup: true },
  { id: "jeddah", name: "جدة", region: "مكة المكرمة", express: true, sameDay: true, pickup: true },
  { id: "makkah", name: "مكة المكرمة", region: "مكة المكرمة", express: true, sameDay: true, pickup: false },
  { id: "madinah", name: "المدينة المنورة", region: "المدينة المنورة", express: true, sameDay: true, pickup: true },
  { id: "dammam", name: "الدمام", region: "الشرقية", express: true, sameDay: true, pickup: true },
  { id: "khobar", name: "الخبر", region: "الشرقية", express: true, sameDay: true, pickup: false },
  { id: "dhahran", name: "الظهران", region: "الشرقية", express: true, sameDay: true, pickup: false },
  { id: "hofuf", name: "الهفوف", region: "الشرقية", express: false, sameDay: true, pickup: false },
  { id: "jubail", name: "الجبيل", region: "الشرقية", express: false, sameDay: true, pickup: false },
  { id: "taif", name: "الطائف", region: "مكة المكرمة", express: false, sameDay: true, pickup: false },
  { id: "buraidah", name: "بريدة", region: "القصيم", express: false, sameDay: true, pickup: false },
  { id: "abha", name: "أبها", region: "عسير", express: false, sameDay: true, pickup: false },
  { id: "khamis", name: "خميس مشيط", region: "عسير", express: false, sameDay: true, pickup: false },
  { id: "tabuk", name: "تبوك", region: "تبوك", express: false, sameDay: false, pickup: false },
  { id: "hail", name: "حائل", region: "حائل", express: false, sameDay: false, pickup: false },
  { id: "jazan", name: "جازان", region: "جازان", express: false, sameDay: false, pickup: false },
  { id: "najran", name: "نجران", region: "نجران", express: false, sameDay: false, pickup: false },
  { id: "arar", name: "عرعر", region: "الحدود الشمالية", express: false, sameDay: false, pickup: false },
  { id: "sakaka", name: "سكاكا", region: "الجوف", express: false, sameDay: false, pickup: false },
  { id: "baha", name: "الباحة", region: "الباحة", express: false, sameDay: false, pickup: false },
  { id: "other", name: "قرية أو هجرة أو مركز (غير مدرج)", region: "أخرى", express: false, sameDay: false, pickup: false },
];

export const SHIPPING: ShippingOption[] = [
  {
    id: "express",
    name: "توصيل سريع",
    desc: "مندوب الصيدلية يوصلك خلال ساعتين",
    eta: "خلال ساعتين",
    price: 25,
    carrier: "مندوب الصيدلية",
  },
  {
    id: "same_day",
    name: "توصيل اليوم",
    desc: "اطلب قبل ٤ العصر ويوصلك نفس اليوم",
    eta: "نفس اليوم",
    price: 15,
    carrier: "SMSA",
    freeOver: true,
  },
  {
    id: "standard",
    name: "توصيل عادي لكل المملكة",
    desc: "يوصل حتى القرى والمراكز، وتقدر تتابعه برقم الشحنة",
    eta: "٢ – ٤ أيام",
    price: 20,
    carrier: "ناقل / البريد السعودي",
    freeOver: true,
  },
  {
    id: "pickup",
    name: "استلام من الفرع",
    desc: "تجي تستلم طلبك من أقرب فرع، بدون رسوم",
    eta: "جاهز بعد ساعة",
    price: 0,
    carrier: "فرع الصيدلية",
  },
];

export const PAYMENTS: PaymentMethod[] = [
  { id: "cod", name: "الدفع عند الاستلام", desc: "كاش أو شبكة مع المندوب", group: "cash", fee: COD_FEE },
  { id: "mada", name: "مدى", desc: "بطاقة مدى البنكية", group: "now" },
  { id: "applepay", name: "Apple Pay", desc: "ادفع بلمسة من جوالك", group: "now" },
  { id: "stcpay", name: "stc pay", desc: "من محفظتك الرقمية", group: "now" },
  { id: "card", name: "بطاقة ائتمانية", desc: "Visa / Mastercard", group: "now" },
  { id: "tamara", name: "تمارا", desc: "قسّمها على ٣ دفعات بدون فوائد", group: "bnpl", minTotal: 100 },
  { id: "tabby", name: "تابي", desc: "قسّمها على ٤ دفعات بدون فوائد", group: "bnpl", minTotal: 100 },
];

export const COUPONS: Record<string, { label: string; type: "percent" | "fixed" | "freeship"; value: number; min: number; max?: number }> = {
  SHIFA10: { label: "خصم ١٠٪ (أقصى خصم ٥٠ ر.س)", type: "percent", value: 10, min: 50, max: 50 },
  FIRST20: { label: "خصم ٢٠ ر.س لأول طلب", type: "fixed", value: 20, min: 100 },
  FREESHIP: { label: "شحن مجاني", type: "freeship", value: 0, min: 0 },
};

export const ORDER_STEPS: { id: string; name: string; desc: string }[] = [
  { id: "received", name: "استلمنا طلبك", desc: "وصلنا طلبك وجاري مراجعته" },
  { id: "confirmed", name: "راجعه الصيدلاني", desc: "تأكدنا من الأدوية والوصفة" },
  { id: "preparing", name: "نجهّز طلبك", desc: "نغلّف الطلب بعناية" },
  { id: "out_for_delivery", name: "في الطريق إليك", desc: "الطلب مع المندوب" },
  { id: "delivered", name: "تم التسليم", desc: "الحمد لله على السلامة" },
];
