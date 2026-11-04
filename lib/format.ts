const nf = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** السعر بالريال: 12.5 → "12.50 ر.س" */
export function money(n: number): string {
  const fixed = Math.round(n * 100) / 100;
  const hasDecimals = Math.abs(fixed - Math.round(fixed)) > 0.001;
  return `${hasDecimals ? fixed.toFixed(2) : nf.format(fixed)} ر.س`;
}

export function num(n: number): string {
  return nf.format(n);
}

const dateFmt = new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-latn", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const timeFmt = new Intl.DateTimeFormat("ar-SA-u-nu-latn", {
  hour: "numeric",
  minute: "2-digit",
});

export function dateAr(iso: string): string {
  return dateFmt.format(new Date(iso));
}
export function dateTimeAr(iso: string): string {
  const d = new Date(iso);
  return `${dateFmt.format(d)} - ${timeFmt.format(d)}`;
}

export function discountPct(price: number, old?: number): number {
  if (!old || old <= price) return 0;
  return Math.round(((old - price) / old) * 100);
}

/** يقبل 05xxxxxxxx أو +9665xxxxxxxx أو 9665xxxxxxxx ويرجع 05xxxxxxxx */
export function normalizePhone(input: string): string | null {
  const d = input.replace(/[^\d]/g, "").replace(/^00/, "");
  const arabicFixed = d;
  if (/^05\d{8}$/.test(arabicFixed)) return arabicFixed;
  if (/^9665\d{8}$/.test(arabicFixed)) return "0" + arabicFixed.slice(3);
  if (/^5\d{8}$/.test(arabicFixed)) return "0" + arabicFixed;
  return null;
}

/** يحوّل الأرقام العربية الهندية (٠١٢) إلى لاتينية */
export function toLatinDigits(s: string): string {
  return s
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}
