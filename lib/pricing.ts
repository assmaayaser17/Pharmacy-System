import { CITIES, COD_FEE, COUPONS, FREE_SHIPPING_MIN, PAYMENTS, SHIPPING, VAT_RATE } from "./config";
import type { ShippingOption } from "./types";

export type Totals = {
  subtotal: number;
  discount: number;
  shipping: number;
  codFee: number;
  total: number;
  vat: number;
  freeShippingGap: number;
  couponError?: string;
};

const r2 = (n: number) => Math.round(n * 100) / 100;

export function shippingOptionsFor(cityId: string): ShippingOption[] {
  const city = CITIES.find((c) => c.id === cityId);
  if (!city) return SHIPPING.filter((s) => s.id === "standard");
  return SHIPPING.filter((s) => {
    if (s.id === "express") return city.express;
    if (s.id === "same_day") return city.sameDay;
    if (s.id === "pickup") return city.pickup;
    return true;
  });
}

export function computeTotals(input: {
  subtotal: number;
  shippingId?: string;
  paymentId?: string;
  coupon?: string;
}): Totals {
  const subtotal = r2(input.subtotal);
  let discount = 0;
  let couponError: string | undefined;
  let freeshipCoupon = false;

  if (input.coupon) {
    const c = COUPONS[input.coupon.trim().toUpperCase()];
    if (!c) couponError = "كود الخصم غير صحيح";
    else if (subtotal < c.min) couponError = `الكود يشتغل على طلبات من ${c.min} ر.س`;
    else if (c.type === "percent") discount = Math.min((subtotal * c.value) / 100, c.max ?? Infinity);
    else if (c.type === "fixed") discount = c.value;
    else freeshipCoupon = true;
  }
  discount = r2(Math.min(discount, subtotal));

  const afterDiscount = subtotal - discount;
  const ship = SHIPPING.find((s) => s.id === input.shippingId);
  let shipping = ship?.price ?? 0;
  if (ship?.freeOver && afterDiscount >= FREE_SHIPPING_MIN) shipping = 0;
  if (freeshipCoupon && ship && ship.id !== "express") shipping = 0;

  const pay = PAYMENTS.find((p) => p.id === input.paymentId);
  const codFee = pay?.id === "cod" ? COD_FEE : 0;

  const total = r2(afterDiscount + shipping + codFee);
  // الأسعار شاملة الضريبة: نستخرج قيمة الضريبة من الإجمالي
  const vat = r2((total * VAT_RATE) / (1 + VAT_RATE));
  return {
    subtotal,
    discount,
    shipping,
    codFee,
    total,
    vat,
    freeShippingGap: Math.max(0, r2(FREE_SHIPPING_MIN - afterDiscount)),
    couponError,
  };
}
