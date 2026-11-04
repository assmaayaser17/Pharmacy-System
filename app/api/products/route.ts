import { json } from "@/lib/auth";
import { parseQuery, searchProducts } from "@/lib/catalog";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sp = Object.fromEntries(url.searchParams.entries());
  const query = parseQuery(sp);
  const ids = url.searchParams.get("ids");
  if (ids) query.ids = ids.split(",").filter(Boolean);
  query.limit = Math.min(Number(url.searchParams.get("limit") ?? 12) || 12, 60);
  return json(searchProducts(query));
}
