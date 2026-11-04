import type { ArtKind, Category, Product, Review } from "./types";

export const CATEGORIES: Category[] = [
  { slug: "medicines", name: "أدوية بدون وصفة", hint: "صداع، برد، حساسية", c1: "#0f8a5f", c2: "#e3f4ec", art: "box" },
  { slug: "prescription", name: "أدوية بوصفة طبية", hint: "ارفع وصفتك وننجزها", c1: "#14406b", c2: "#e1eaf4", art: "box" },
  { slug: "vitamins", name: "فيتامينات ومكملات", hint: "طاقة ومناعة", c1: "#e8890c", c2: "#fff1d6", art: "jar" },
  { slug: "skin", name: "العناية بالبشرة", hint: "شمس، ترطيب، علاج", c1: "#d4577a", c2: "#fde6eb", art: "tube" },
  { slug: "hair", name: "العناية بالشعر", hint: "قشرة وتساقط", c1: "#6c4fc9", c2: "#ece6fb", art: "bottle" },
  { slug: "mother-baby", name: "الأم والطفل", hint: "حليب، حفاضات، حمل", c1: "#2f95c9", c2: "#dff2fb", art: "jar" },
  { slug: "oral", name: "العناية بالفم والأسنان", hint: "معاجين وغسول", c1: "#16a3a0", c2: "#ddf5f4", art: "tube" },
  { slug: "devices", name: "أجهزة ومستلزمات طبية", hint: "ضغط، سكر، حرارة", c1: "#2b4c7e", c2: "#e1e8f2", art: "device" },
  { slug: "personal", name: "العناية الشخصية", hint: "نظافة وانتعاش", c1: "#e0483d", c2: "#fde4e1", art: "spray" },
  { slug: "diet", name: "التغذية الصحية", hint: "بروتين وبدائل سكر", c1: "#5f9a2f", c2: "#eaf4de", art: "jar" },
  { slug: "first-aid", name: "الإسعافات الأولية", hint: "جروح وكمادات", c1: "#c8302f", c2: "#fbe3e3", art: "box" },
];

type Row = [
  id: number,
  cat: string,
  brand: string,
  nameAr: string,
  nameEn: string,
  price: number,
  old: number | null,
  kind: ArtKind,
  size: string,
  desc: string,
  opts?: { rx?: boolean; cold?: boolean; stock?: number; tags?: string[] },
];

const rows: Row[] = [
  // أدوية بدون وصفة
  [1, "medicines", "نيوفارم", "باراسيتامول ٥٠٠ مجم", "Paracetamol 500 mg", 9.5, null, "box", "٢٤ قرص", "خافض للحرارة ومسكن للآلام الخفيفة إلى المتوسطة مثل الصداع وآلام الأسنان."],
  [2, "medicines", "نيوفارم", "إيبوبروفين ٤٠٠ مجم", "Ibuprofen 400 mg", 14, null, "box", "٢٠ قرص", "مسكن ومضاد للالتهاب، يُستخدم لآلام العضلات والمفاصل وآلام الدورة."],
  [3, "medicines", "ليتل كير", "شراب كحة للأطفال", "Kids cough syrup", 22, 26, "bottle", "١٢٠ مل", "شراب بنكهة الفراولة يساعد على تهدئة الكحة عند الأطفال.", { tags: ["أطفال"] }],
  [4, "medicines", "أكوا فيت", "بخاخ أنف محلول ملحي", "Saline nasal spray", 18, null, "spray", "٣٠ مل", "ينظّف الأنف ويخفف الاحتقان، مناسب للكبار والأطفال."],
  [5, "medicines", "جاستروكير", "مضاد حموضة أقراص للمضغ", "Antacid chewable tablets", 16.5, null, "box", "٢٤ قرص", "راحة سريعة من الحموضة وحرقة المعدة بعد الأكل."],
  [6, "medicines", "أكوا فيت", "أملاح معالجة الجفاف", "Oral rehydration salts", 13, null, "sachet", "١٠ أكياس", "تعوّض السوائل والأملاح عند الإسهال أو القيء أو الإجهاد الحراري."],
  [7, "medicines", "نيوفارم", "سيتريزين ١٠ مجم للحساسية", "Cetirizine 10 mg", 15, null, "box", "١٠ أقراص", "يخفف أعراض حساسية الأنف والعيون مثل العطس والحكة وسيلان الأنف."],
  [8, "medicines", "أيه كير", "قطرة عين مرطبة", "Lubricating eye drops", 28, 33, "bottle", "١٠ مل", "ترطب العين الجافة وتريح من الاحمرار والتعب."],
  [9, "medicines", "فلكس", "جل مسكن للمفاصل والعضلات", "Pain relief gel", 24, 29, "tube", "٥٠ جم", "جل موضعي يُدلك به مكان الألم، مناسب بعد المجهود."],
  [10, "medicines", "ثروت إيز", "أقراص استحلاب للحلق", "Throat lozenges", 12, null, "box", "١٦ قرص", "تلطف التهاب الحلق وتخفف الجفاف والخشونة."],
  // أدوية بوصفة
  [11, "prescription", "ميدلاب", "ميتفورمين ٥٠٠ مجم", "Metformin 500 mg", 18, null, "box", "٦٠ قرص", "دواء لعلاج السكري من النوع الثاني.", { rx: true }],
  [12, "prescription", "ميدلاب", "أملوديبين ٥ مجم", "Amlodipine 5 mg", 21, null, "box", "٣٠ قرص", "دواء لعلاج ارتفاع ضغط الدم.", { rx: true }],
  [13, "prescription", "ميدلاب", "أتورفاستاتين ٢٠ مجم", "Atorvastatin 20 mg", 39, null, "box", "٣٠ قرص", "دواء لخفض الكوليسترول في الدم.", { rx: true }],
  [14, "prescription", "ميدلاب", "أموكسيسيلين ٥٠٠ مجم", "Amoxicillin 500 mg", 24, null, "box", "١٦ كبسولة", "مضاد حيوي لعلاج بعض أنواع العدوى البكتيرية.", { rx: true }],
  [15, "prescription", "جاستروكير", "أوميبرازول ٢٠ مجم", "Omeprazole 20 mg", 27, null, "box", "٢٨ كبسولة", "لعلاج ارتجاع المريء وقرحة المعدة.", { rx: true }],
  [16, "prescription", "ميدلاب", "ليفوثيروكسين ١٠٠ مكغ", "Levothyroxine 100 mcg", 22, null, "box", "٥٠ قرص", "لعلاج خمول الغدة الدرقية.", { rx: true }],
  [17, "prescription", "ريسب كير", "بخاخ سالبيوتامول", "Salbutamol inhaler", 17, null, "spray", "١٠٠ جرعة", "بخاخ إسعافي لتوسيع الشعب الهوائية عند الربو.", { rx: true }],
  [18, "prescription", "ميدلاب", "إنسولين قلم جاهز", "Insulin prefilled pen", 96, null, "device", "٣ مل", "يُحفظ في الثلاجة. يُصرف بوصفة طبية فقط.", { rx: true, cold: true, stock: 14 }],
  // فيتامينات
  [19, "vitamins", "فيتاكور", "فيتامين د٣ ٥٠٠٠ وحدة", "Vitamin D3 5000 IU", 59, 75, "jar", "٦٠ كبسولة", "يدعم صحة العظام والمناعة، ومناسب لمن يقل تعرضه للشمس.", { tags: ["الأكثر طلبًا"] }],
  [20, "vitamins", "فيتاكور", "فيتامين سي ١٠٠٠ مجم فوار", "Vitamin C 1000 mg effervescent", 32, null, "tube", "٢٠ قرص", "أقراص فوارة بنكهة البرتقال لدعم المناعة."],
  [21, "vitamins", "أوشن بيور", "أوميغا ٣ زيت السمك", "Omega-3 fish oil", 89, 105, "jar", "٩٠ كبسولة", "يدعم صحة القلب والدماغ والنظر."],
  [22, "vitamins", "فيتاكور", "حديد مع فيتامين سي", "Iron + vitamin C", 45, null, "box", "٣٠ كبسولة", "مكمل غذائي للحديد، لطيف على المعدة."],
  [23, "vitamins", "فيتاكور", "مالتي فيتامين للرجال", "Multivitamin for men", 79, null, "jar", "٦٠ قرص", "تركيبة يومية متكاملة من الفيتامينات والمعادن."],
  [24, "vitamins", "فيتاكور", "مالتي فيتامين للنساء", "Multivitamin for women", 79, null, "jar", "٦٠ قرص", "تركيبة يومية تناسب احتياج المرأة مع الحديد وحمض الفوليك."],
  [25, "vitamins", "أوشن بيور", "مغنيسيوم ٤٠٠ مجم", "Magnesium 400 mg", 52, null, "jar", "٦٠ قرص", "يدعم العضلات والأعصاب وجودة النوم."],
  [26, "vitamins", "فيتاكور", "زنك ٥٠ مجم", "Zinc 50 mg", 38, 44, "jar", "٦٠ قرص", "معدن أساسي للمناعة وصحة الجلد والشعر."],
  [27, "vitamins", "فيتاكور", "كالسيوم مع فيتامين د", "Calcium + vitamin D", 48, null, "jar", "٦٠ قرص", "لدعم العظام والأسنان، مناسب لكبار السن."],
  [28, "vitamins", "جات فلورا", "بروبيوتيك للهضم", "Probiotic", 95, 110, "box", "٣٠ كبسولة", "بكتيريا نافعة تدعم توازن الجهاز الهضمي."],
  // بشرة
  [29, "skin", "ديرماليف", "واقي شمس SPF 50", "Sunscreen SPF 50", 69, 85, "tube", "٥٠ مل", "حماية عالية من الأشعة، خفيف على البشرة وبدون أثر أبيض.", { tags: ["الأكثر طلبًا"] }],
  [30, "skin", "ديرماليف", "مرطب للبشرة الجافة", "Moisturizing cream", 44, null, "jar", "٢٥٠ مل", "ترطيب يدوم طوال اليوم، مناسب للوجه والجسم."],
  [31, "skin", "ديرماليف", "غسول وجه للبشرة الدهنية", "Oily skin face wash", 36, null, "bottle", "٢٠٠ مل", "ينظف المسام ويقلل اللمعان بدون جفاف."],
  [32, "skin", "ديرماليف", "سيروم فيتامين سي", "Vitamin C serum", 98, 120, "bottle", "٣٠ مل", "يوحّد لون البشرة ويعطيها نضارة."],
  [33, "skin", "ديرماليف", "كريم للهالات السوداء", "Dark circles eye cream", 57, null, "tube", "١٥ مل", "كريم لطيف لمنطقة العين يخفف الهالات مع الاستمرار."],
  [34, "skin", "فوت كير", "كريم للقدم المتشققة", "Cracked heel cream", 25, null, "tube", "٧٥ مل", "يرطب ويعالج جفاف وتشقق الكعب."],
  // شعر
  [35, "hair", "هير لاب", "شامبو ضد القشرة", "Anti-dandruff shampoo", 41, null, "bottle", "٢٥٠ مل", "يقلل القشرة والحكة من أول استخدامات."],
  [36, "hair", "هير لاب", "سيروم تقوية الشعر", "Hair strengthening serum", 64, 79, "bottle", "١٠٠ مل", "يغذي فروة الرأس ويدعم كثافة الشعر."],
  [37, "hair", "هير لاب", "زيت الأرغان للشعر", "Argan hair oil", 48, null, "bottle", "١٠٠ مل", "يلمّع الشعر ويحميه من الجفاف والتقصف."],
  // أم وطفل
  [38, "mother-baby", "بيبي نست", "حليب أطفال المرحلة الأولى", "Infant formula stage 1", 49, null, "jar", "٤٠٠ جم", "حليب للرضع من الولادة حتى ٦ أشهر عند عدم توفر الرضاعة الطبيعية."],
  [39, "mother-baby", "بيبي نست", "حفاضات مقاس ٤", "Diapers size 4", 79, 92, "box", "٥٦ حفاضة", "حفاضات ناعمة تمتص بسرعة وتدوم الليل كاملًا.", { tags: ["عرض"] }],
  [40, "mother-baby", "بيبي نست", "مناديل مبللة للأطفال", "Baby wipes", 12, null, "sachet", "٨٠ منديل", "مناديل خالية من الكحول والعطور القوية."],
  [41, "mother-baby", "بيبي نست", "كريم الحفاض", "Diaper rash cream", 23, null, "tube", "١٠٠ جم", "يحمي ويهدئ التهابات الحفاض."],
  [42, "mother-baby", "فيتاكور", "فيتامينات الحمل", "Prenatal vitamins", 68, null, "jar", "٣٠ كبسولة", "تحتوي حمض الفوليك والحديد لدعم الحمل."],
  [43, "mother-baby", "بيبي نست", "مضخة حليب يدوية", "Manual breast pump", 120, 145, "device", "قطعة", "مضخة هادئة وسهلة التنظيف."],
  // فم
  [44, "oral", "ديننتا", "معجون أسنان للأسنان الحساسة", "Sensitive teeth toothpaste", 21, null, "tube", "١٠٠ مل", "يخفف الحساسية مع الاستخدام اليومي."],
  [45, "oral", "ديننتا", "غسول فم بدون كحول", "Alcohol-free mouthwash", 27, null, "bottle", "٥٠٠ مل", "انتعاش للفم بدون حرقة."],
  [46, "oral", "ديننتا", "فرشاة أسنان ناعمة", "Soft toothbrush", 11, null, "device", "قطعة", "شعيرات ناعمة لطيفة على اللثة."],
  [47, "oral", "ديننتا", "خيط أسنان", "Dental floss", 9, null, "box", "٥٠ متر", "خيط شمعي ينزلق بسهولة بين الأسنان."],
  // أجهزة
  [48, "devices", "ميدسينس", "جهاز ضغط الدم للذراع", "Upper arm blood pressure monitor", 189, 230, "device", "جهاز", "شاشة كبيرة وذاكرة للقراءات ونطق صوتي، مناسب لكبار السن.", { tags: ["الأكثر طلبًا"] }],
  [49, "devices", "ميدسينس", "جهاز قياس السكر مع ٢٥ شريط", "Glucose meter + 25 strips", 99, null, "device", "جهاز + ٢٥ شريط", "نتيجة خلال ٥ ثوانٍ بقطرة دم صغيرة."],
  [50, "devices", "ميدسينس", "ميزان حرارة رقمي", "Digital thermometer", 29, null, "device", "قطعة", "قراءة سريعة ودقيقة مع صوت تنبيه."],
  [51, "devices", "ميدسينس", "جهاز قياس الأكسجين بالإصبع", "Fingertip pulse oximeter", 69, 85, "device", "جهاز", "يقيس نسبة الأكسجين ونبض القلب."],
  [52, "devices", "ميدسينس", "كمامات طبية", "Medical face masks", 19, null, "box", "٥٠ قطعة", "ثلاث طبقات مع مشبك للأنف."],
  // شخصية
  [53, "personal", "فريش", "مزيل عرق بخاخ", "Deodorant spray", 18, null, "spray", "١٥٠ مل", "حماية تدوم ٤٨ ساعة بدون أملاح الألمنيوم."],
  [54, "personal", "فريش", "غسول جسم مرطب", "Moisturizing body wash", 29, null, "bottle", "٤٠٠ مل", "ينظف بلطف ويحافظ على رطوبة الجلد."],
  [55, "personal", "فريش", "مناديل معقمة", "Sanitizing wipes", 15, null, "box", "١٠٠ منديل", "للأيدي والأسطح."],
  // تغذية
  [56, "diet", "فيت لاب", "بروتين مصل اللبن", "Whey protein", 249, 299, "jar", "٢ كجم", "بنكهة الشوكولاتة، ٢٤ جم بروتين للحصة.", { stock: 6 }],
  [57, "diet", "فيت لاب", "بديل سكر ستيفيا", "Stevia sweetener", 24, null, "box", "١٠٠ كيس", "سكر طبيعي المصدر بدون سعرات."],
  [58, "diet", "فيت لاب", "ألياف طبيعية للهضم", "Psyllium husk fiber", 36, null, "jar", "٢٠٠ جم", "يساعد على انتظام الهضم عند شربه مع الماء."],
  // إسعافات
  [59, "first-aid", "سيف كير", "لاصق جروح متنوع", "Adhesive bandages", 10, null, "box", "٤٠ قطعة", "مقاومة للماء بأحجام مختلفة."],
  [60, "first-aid", "سيف كير", "معقم جروح", "Wound antiseptic", 14, null, "bottle", "١٠٠ مل", "لتنظيف وتعقيم الجروح الصغيرة."],
  [61, "first-aid", "سيف كير", "شاش معقم", "Sterile gauze pads", 8, null, "box", "١٠ قطع", "قطع شاش معقمة ومغلفة فرديًا."],
  [62, "first-aid", "سيف كير", "كمادة باردة وساخنة", "Hot/cold pack", 22, null, "box", "قطعة", "تُستخدم للإصابات الرياضية وآلام الظهر.", { stock: 0 }],
];

const usageDefault = "استخدمه حسب إرشادات العبوة أو حسب توجيه الصيدلاني.";
const warnDefault = "يحفظ بعيدًا عن متناول الأطفال وفي مكان بارد وجاف. استشر الصيدلاني أو الطبيب عند الحمل أو الرضاعة أو وجود أمراض مزمنة.";
const warnRx = "يُصرف بوصفة طبية سارية فقط. لا تغيّر الجرعة أو توقف الدواء بدون استشارة طبيبك.";

function hash(n: number) {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function buildProducts(): Product[] {
  const cat = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]));
  return rows.map(([id, c, brand, nameAr, nameEn, price, old, kind, size, desc, o]) => {
    const h = hash(id);
    const rx = !!o?.rx;
    const day = Math.floor(h * 90);
    return {
      id: `p${id}`,
      nameAr,
      nameEn,
      brand,
      cat: c,
      price,
      oldPrice: old ?? undefined,
      rx,
      cold: o?.cold,
      stock: o?.stock ?? 20 + Math.floor(h * 100),
      rating: Math.round((4 + h * 0.95) * 10) / 10,
      reviews: 8 + Math.floor(h * 240),
      sold: 30 + Math.floor(hash(id + 3) * 1800),
      art: { kind, c1: cat[c].c1, c2: cat[c].c2 },
      size,
      desc,
      usage: rx ? "حسب ما وصفه الطبيب." : usageDefault,
      warn: rx ? warnRx : warnDefault,
      tags: o?.tags ?? [],
      createdAt: new Date(Date.UTC(2026, 10, 1) - day * 86400000).toISOString(),
    };
  });
}

const NAMES = ["خالد", "نورة", "عبدالله", "سارة", "محمد", "ريم", "فهد", "هند", "سلطان", "لولوة", "ماجد", "أم سلمان"];
const TEXTS = [
  "وصلني الطلب بسرعة والتغليف ممتاز.",
  "المنتج أصلي وسعره أحسن من الصيدلية القريبة.",
  "تعاملهم راقي والصيدلاني رد عليّ بسرعة.",
  "جربته وأعجبني، بكرر الطلب إن شاء الله.",
  "ممتاز، تاريخ الصلاحية بعيد.",
  "الشحن وصل لقريتنا بدون مشاكل.",
];

export function buildReviews(products: Product[]): Review[] {
  const out: Review[] = [];
  for (const p of products) {
    const n = 2 + Math.floor(hash(Number(p.id.slice(1)) + 7) * 2);
    for (let i = 0; i < n; i++) {
      const h = hash(Number(p.id.slice(1)) * 10 + i);
      out.push({
        id: `r-${p.id}-${i}`,
        productId: p.id,
        name: NAMES[Math.floor(h * NAMES.length)],
        stars: h > 0.75 ? 4 : 5,
        text: TEXTS[Math.floor(hash(h * 100) * TEXTS.length)],
        createdAt: new Date(Date.UTC(2026, 9, 1) - Math.floor(h * 60) * 86400000).toISOString(),
      });
    }
  }
  return out;
}
