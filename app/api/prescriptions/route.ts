import fs from "node:fs";
import path from "node:path";
import { json, requireUser } from "@/lib/auth";
import { UPLOAD_DIR, db, save, uid } from "@/lib/db";

const MAX = 5 * 1024 * 1024;
const OK = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["application/pdf", "pdf"],
]);

export async function GET() {
  const { user, res } = await requireUser();
  if (!user) return res!;
  return json({ items: db().prescriptions.filter((p) => p.userId === user.id).reverse() });
}

export async function POST(req: Request) {
  const { user, res } = await requireUser();
  if (!user) return res!;
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return json({ error: "اختر صورة الوصفة أو ملف PDF" }, 400);
  const ext = OK.get(file.type);
  if (!ext) return json({ error: "الملف لازم يكون صورة (JPG أو PNG) أو PDF" }, 400);
  if (file.size > MAX) return json({ error: "حجم الملف كبير، الحد الأقصى ٥ ميجا" }, 400);

  const id = uid("rx-");
  const storedAs = `${id}.${ext}`;
  try {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    fs.writeFileSync(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, storedAs), Buffer.from(await file.arrayBuffer()));
  } catch {
    // بيئة قراءة فقط: نسجّل البيانات بدون حفظ الملف (تجريبي)
  }
  const rx = {
    id,
    userId: user.id,
    fileName: file.name.slice(0, 80),
    storedAs,
    mime: file.type,
    size: file.size,
    // في التجربة: الصيدلاني يوافق تلقائيًا بعد الرفع. في الإنتاج: ربط بوصفتي / مراجعة صيدلاني.
    status: "approved" as const,
    createdAt: new Date().toISOString(),
  };
  db().prescriptions.push(rx);
  save();
  return json({ prescription: rx }, 201);
}
