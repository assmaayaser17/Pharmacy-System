/** سعر بنمط المتاجر الكبيرة: عملة صغيرة + رقم كبير + هللات مرفوعة */
export default function Price({ value, size = "md" }: { value: number; size?: "sm" | "md" | "lg" }) {
  const fixed = Math.round(value * 100) / 100;
  const whole = Math.floor(fixed);
  const frac = Math.round((fixed - whole) * 100);
  const big = size === "lg" ? "text-[2rem]" : size === "sm" ? "text-lg" : "text-[1.6rem]";
  return (
    <span className="price leading-none" aria-label={`${fixed} ريال`}>
      <span className="text-[0.75rem] mt-[0.2em]">ر.س</span>
      <span className={`${big} font-medium`}>{whole.toLocaleString("en-US")}</span>
      <span className="text-[0.75rem] mt-[0.2em]">{String(frac).padStart(2, "0")}</span>
    </span>
  );
}
