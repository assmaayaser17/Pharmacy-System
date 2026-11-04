export const STATUS_LABEL: Record<string, { t: string; cls: string }> = {
  received: { t: "استلمنا طلبك", cls: "bg-amber-soft text-[#c45500]" },
  confirmed: { t: "تمت المراجعة", cls: "bg-amber-soft text-[#c45500]" },
  preparing: { t: "قيد التجهيز", cls: "bg-[#e4eae6] text-[#005f6b]" },
  out_for_delivery: { t: "في الطريق إليك", cls: "bg-[#e4eae6] text-[#005f6b]" },
  delivered: { t: "تم التسليم", cls: "bg-mint text-leaf-dark" },
  cancelled: { t: "ملغي", cls: "bg-coral-soft text-coral" },
};
