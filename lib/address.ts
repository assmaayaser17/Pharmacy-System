import { CITIES } from "./config";
import { normalizePhone, toLatinDigits } from "./format";
import type { Address } from "./types";

export function validateAddress(b: Record<string, unknown>): { ok: true; value: Omit<Address, "id" | "userId" | "isDefault" | "label"> } | { ok: false; error: string } {
  const s = (k: string, max = 120) => String(b[k] ?? "").trim().slice(0, max);
  const name = s("name", 60);
  const phone = normalizePhone(toLatinDigits(s("phone", 20)));
  const cityId = s("city", 40);
  const city = CITIES.find((c) => c.id === cityId);
  if (name.length < 2) return { ok: false, error: "اكتب اسم المستلم" };
  if (!phone) return { ok: false, error: "اكتب رقم جوال صحيح للمستلم" };
  if (!city) return { ok: false, error: "اختر المدينة" };
  const landmark = s("landmark", 200);
  const district = s("district", 80);
  const street = s("street", 120);
  if (!district && !landmark) return { ok: false, error: "اكتب اسم الحي أو وصف الموقع وأقرب معلم" };
  const national = toLatinDigits(s("nationalAddress", 10)).toUpperCase().replace(/\s/g, "");
  if (national && !/^[A-Z]{4}\d{4}$/.test(national)) return { ok: false, error: "العنوان الوطني يتكوّن من ٤ حروف و٤ أرقام مثل RYAS2345" };
  const lat = b.lat != null ? Number(b.lat) : undefined;
  const lng = b.lng != null ? Number(b.lng) : undefined;
  return {
    ok: true,
    value: {
      name,
      phone,
      city: city.name,
      district,
      street,
      nationalAddress: national || undefined,
      landmark: landmark || undefined,
      lat: lat != null && !Number.isNaN(lat) ? lat : undefined,
      lng: lng != null && !Number.isNaN(lng) ? lng : undefined,
    },
  };
}

