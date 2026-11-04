import { json } from "@/lib/auth";
import { computeTotals, shippingOptionsFor } from "@/lib/pricing";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const city = url.searchParams.get("city") ?? "";
  const subtotal = Number(url.searchParams.get("subtotal") ?? 0) || 0;
  const options = shippingOptionsFor(city).map((o) => ({
    ...o,
    price: computeTotals({ subtotal, shippingId: o.id }).shipping,
  }));
  return json({ options });
}
