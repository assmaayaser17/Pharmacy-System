import { getUser, json, requireUser } from "@/lib/auth";
import { db, save } from "@/lib/db";

export async function GET() {
  const user = await getUser();
  if (!user) return json({ user: null });
  const d = db();
  return json({
    user,
    addresses: d.addresses.filter((a) => a.userId === user.id),
    wishlist: d.wishlist[user.id] ?? [],
  });
}

export async function PATCH(req: Request) {
  const { user, res } = await requireUser();
  if (!user) return res!;
  const body = await req.json().catch(() => ({}));
  const name = String(body.name ?? "").trim().slice(0, 60);
  if (name.length < 2) return json({ error: "اكتب اسمك (حرفين على الأقل)" }, 400);
  user.name = name;
  save();
  return json({ ok: true, user });
}
