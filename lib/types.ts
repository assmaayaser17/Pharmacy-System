export type ArtKind = "box" | "bottle" | "tube" | "jar" | "sachet" | "device" | "spray";

export type Category = {
  slug: string;
  name: string;
  hint: string;
  c1: string;
  c2: string;
  art: ArtKind;
};

export type Product = {
  id: string;
  nameAr: string;
  nameEn: string;
  brand: string;
  cat: string;
  price: number; // شامل ضريبة القيمة المضافة
  oldPrice?: number;
  rx: boolean; // يحتاج وصفة طبية
  cold?: boolean; // سلسلة تبريد
  stock: number;
  rating: number;
  reviews: number;
  sold: number;
  /** brand/title/sub/img تُضاف وقت التحميل (ملصق العبوة أو صورة حقيقية) */
  art: { kind: ArtKind; c1: string; c2: string; brand?: string; title?: string; sub?: string; img?: string };
  size: string;
  desc: string;
  usage: string;
  warn: string;
  tags: string[];
  createdAt: string;
};

export type Review = {
  id: string;
  productId: string;
  name: string;
  stars: number;
  text: string;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  phone: string;
  role: "customer" | "admin";
  createdAt: string;
};

export type Address = {
  id: string;
  userId: string;
  label: string;
  name: string;
  phone: string;
  city: string;
  district: string;
  street: string;
  nationalAddress?: string; // العنوان الوطني المختصر مثل RRRD1234
  landmark?: string; // أقرب معلم / وصف الموقع
  lat?: number;
  lng?: number;
  isDefault?: boolean;
};

export type OrderStatus =
  | "received"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  id: string;
  nameAr: string;
  size: string;
  price: number;
  qty: number;
  rx: boolean;
  art: Product["art"];
};

export type Order = {
  id: string;
  number: string;
  userId: string;
  items: OrderItem[];
  address: Omit<Address, "id" | "userId" | "isDefault" | "label">;
  shippingId: string;
  paymentId: string;
  paymentStatus: "paid" | "pending" | "failed";
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shipping: number;
  codFee: number;
  total: number;
  vat: number;
  coupon?: string;
  prescriptionId?: string;
  note?: string;
  createdAt: string;
  timeline: { status: OrderStatus; at: string }[];
};

export type Prescription = {
  id: string;
  userId: string;
  fileName: string;
  storedAs: string;
  mime: string;
  size: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export type ShippingOption = {
  id: "express" | "same_day" | "standard" | "pickup";
  name: string;
  desc: string;
  eta: string;
  price: number;
  carrier: string;
  freeOver?: boolean;
};

export type PaymentMethod = {
  id: string;
  name: string;
  desc: string;
  group: "cash" | "now" | "bnpl";
  fee?: number;
  minTotal?: number;
};
