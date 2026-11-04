import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { CATEGORIES, buildProducts, buildReviews } from "./seed";
import { computeTotals } from "./pricing";
import type { Address, Order, OrderItem, OrderStatus, Prescription, Product, Review, User } from "./types";

export type DB = {
  products: Product[];
  reviews: Review[];
  users: User[];
  sessions: Record<string, string>; // token -> userId
  otps: Record<string, { code: string; expires: number }>;
  addresses: Address[];
  wishlist: Record<string, string[]>; // userId -> productIds
  orders: Order[];
  prescriptions: Prescription[];
  seq: number;
};

const DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DIR, "db.json");
export const UPLOAD_DIR = path.join(DIR, "uploads");

const g = globalThis as unknown as { __shifaDb?: DB };

export const DEMO_PHONE = "0501234567";
export const ADMIN_PHONE = "0500000000";
export const DEMO_OTP = "1234";

export const uid = (p = "") => p + crypto.randomBytes(5).toString("hex");

function item(p: Product, qty: number): OrderItem {
  return { id: p.id, nameAr: p.nameAr, size: p.size, price: p.price, qty, rx: p.rx, art: p.art };
}

function seed(): DB {
  const products = buildProducts();
  const reviews = buildReviews(products);
  const now = Date.now();
  const iso = (msAgo: number) => new Date(now - msAgo).toISOString();
  const users: User[] = [
    { id: "u-demo", name: "خالد العتيبي", phone: DEMO_PHONE, role: "customer", createdAt: iso(90 * 864e5) },
    { id: "u-admin", name: "مدير المتجر", phone: ADMIN_PHONE, role: "admin", createdAt: iso(120 * 864e5) },
  ];
  const addresses: Address[] = [
    {
      id: "a-1",
      userId: "u-demo",
      label: "البيت",
      name: "خالد العتيبي",
      phone: DEMO_PHONE,
      city: "الرياض",
      district: "حي الياسمين",
      street: "شارع الأمير محمد بن سعد",
      nationalAddress: "RYAS2345",
      landmark: "قريب من مسجد الياسمين",
      isDefault: true,
    },
  ];

  const byId = (id: string) => products.find((p) => p.id === id)!;
  const mk = (n: number, ids: [string, number][], status: OrderStatus, msAgo: number, payment: string, ship: string): Order => {
    const items = ids.map(([id, q]) => item(byId(id), q));
    const sub = items.reduce((s, i) => s + i.price * i.qty, 0);
    const t = computeTotals({ subtotal: sub, shippingId: ship, paymentId: payment });
    const flow: OrderStatus[] = ["received", "confirmed", "preparing", "out_for_delivery", "delivered"];
    const idx = flow.indexOf(status);
    const timeline = flow.slice(0, idx + 1).map((s, i) => ({ status: s, at: iso(msAgo - i * 25 * 60000) }));
    return {
      id: `o-${n}`,
      number: `SH${String(100200 + n)}`,
      userId: "u-demo",
      items,
      address: { name: "خالد العتيبي", phone: DEMO_PHONE, city: "الرياض", district: "حي الياسمين", street: "شارع الأمير محمد بن سعد", nationalAddress: "RYAS2345", landmark: "قريب من مسجد الياسمين" },
      shippingId: ship,
      paymentId: payment,
      paymentStatus: payment === "cod" ? (status === "delivered" ? "paid" : "pending") : "paid",
      status,
      subtotal: t.subtotal,
      discount: t.discount,
      shipping: t.shipping,
      codFee: t.codFee,
      total: t.total,
      vat: t.vat,
      createdAt: iso(msAgo),
      timeline,
    };
  };

  const orders: Order[] = [
    mk(3, [["p19", 1], ["p29", 1]], "preparing", 40 * 60000, "mada", "express"),
    mk(2, [["p1", 2], ["p7", 1], ["p10", 1]], "delivered", 6 * 864e5, "cod", "same_day"),
    mk(1, [["p48", 1], ["p21", 1]], "delivered", 21 * 864e5, "applepay", "standard"),
  ];

  return {
    products,
    reviews,
    users,
    sessions: {},
    otps: {},
    addresses,
    wishlist: { "u-demo": ["p19", "p48", "p29"] },
    orders,
    prescriptions: [],
    seq: 3,
  };
}

/** ألوان العبوة من القسم + ملصق (ماركة/اسم/حجم) + صورة حقيقية لو موجودة في public/products/<id>.(webp|jpg|png) */
const IMG_DIR = path.join(process.cwd(), "public", "products");
function decorate(d: DB) {
  const cats = new Map(CATEGORIES.map((c) => [c.slug, c]));
  let files: string[] = [];
  try {
    files = fs.readdirSync(IMG_DIR);
  } catch {}
  for (const p of d.products) {
    const c = cats.get(p.cat);
    const file = files.find((f) => f.replace(/\.(webp|jpe?g|png|avif)$/i, "") === p.id);
    p.art = {
      ...p.art,
      ...(c ? { c1: c.c1, c2: c.c2 } : {}),
      brand: p.brand,
      title: p.nameAr,
      sub: p.size,
      img: file ? `/products/${file}` : undefined,
    };
  }
}

export function db(): DB {
  if (g.__shifaDb) return g.__shifaDb;
  try {
    g.__shifaDb = JSON.parse(fs.readFileSync(FILE, "utf8")) as DB;
  } catch {
    g.__shifaDb = seed();
    save();
  }
  decorate(g.__shifaDb!);
  return g.__shifaDb!;
}

export function save() {
  try {
    fs.mkdirSync(DIR, { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(g.__shifaDb));
  } catch {
    // بيئات القراءة فقط (مثل Vercel): نكمل بالذاكرة
  }
}

export function resetDb() {
  g.__shifaDb = seed();
  save();
}
