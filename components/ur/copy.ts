import { fromPrice, type UmrahPackage } from "@/lib/packages";
import { season } from "@/lib/season";
import { urMonthYear, WHATSAPP_HOURS_UR } from "./format";

/**
 * Urdu copy for the /ur/ package pages. Everything is generated from the same
 * lib/packages.ts data the English site uses, so prices, nights, distances and
 * inclusions can never drift between languages. Hotel names and airline names
 * stay in Latin script (with dir="ltr" in the markup) - that is how Pakistani
 * travel material writes them.
 */

export const TIER_UR: Record<string, string> = { economy: "اکانومی", "3-star": "3 سٹار", "4-star": "4 سٹار", "5-star": "5 سٹار" };
export const TIER_BLURB_UR: Record<string, string> = {
  economy: "حرم سے کچھ فاصلے پر یا شٹل کے ساتھ صاف ستھرے، سادہ ہوٹل۔",
  "3-star": "پیدل فاصلے پر آرام دہ ہوٹل - قیمت اور سہولت کا بہترین توازن۔",
  "4-star": "قریب تر، پُرسکون ہوٹل مع ناشتہ - خاندانوں اور بزرگ والدین کے لیے۔",
  "5-star": "حرم کے بالکل سامنے والے ہوٹل - لابی سے نکل کر براہ راست صحن میں۔",
};
export const BASIS_UR: Record<string, string> = { sharing: "شیئرنگ", quad: "کوڈ", triple: "ٹرپل", double: "ڈبل" };
export const BASIS_PEOPLE_UR: Record<string, string> = {
  sharing: "5-6 افراد فی کمرہ",
  quad: "4 افراد فی کمرہ",
  triple: "3 افراد فی کمرہ",
  double: "2 افراد فی کمرہ",
};

const MEALS_UR: Record<string, string> = { Breakfast: "ناشتہ شامل", "Suhoor & iftar": "سحور و افطار شامل" };
export const urMeals = (meals?: string) => (meals ? (MEALS_UR[meals] ?? meals) : null);

/** Travel windows, translated by exact match against lib/package-data.ts. */
const VALIDITY_UR: Record<string, string> = {
  "Oct 2026 - Jan 2027": "اکتوبر 2026 تا جنوری 2027",
  "Oct 2026 - Jan 2027, excluding 15-31 Dec": "اکتوبر 2026 تا جنوری 2027 (15 تا 31 دسمبر کے علاوہ)",
  "Departures 12-26 December 2026": "روانگیاں 12 تا 26 دسمبر 2026",
  "Ramadan 1448 (expected Feb-Mar 2027)": "رمضان 1448ھ (متوقع فروری تا مارچ 2027)",
};
export const urValidity = (p: UmrahPackage) => VALIDITY_UR[p.validity] ?? p.validity;

export const urFlights =
  "واپسی اکانومی پروازیں - جہاں دستیاب ہوں براہ راست جدہ یا مدینہ (سعودیا، پی آئی اے، ایئر بلیو یا فلائی ناس)، ورنہ ایک اسٹاپ کے ساتھ۔";
export const urTransport = (p: UmrahPackage) =>
  p.transport === "Private car transfers" ? "نجی گاڑی میں تمام منتقلی" : "مشترکہ ایئر کنڈیشنڈ کوچ";

/** What the price covers, generated from the package's own fields. */
export function urIncludes(p: UmrahPackage): string[] {
  const meal = urMeals(p.hotels.makkah.meals);
  const items = [
    "عمرہ ویزا مع لازمی طبی انشورنس",
    "لاہور، کراچی یا اسلام آباد سے واپسی اکانومی ٹکٹ",
    p.transport === "Private car transfers" ? "نجی گاڑی میں ائیرپورٹ اور مکہ-مدینہ منتقلی" : "ائیرپورٹ اور بین الشہری ایئر کنڈیشنڈ کوچ",
    `${p.nights.makkah} راتیں مکہ - ${TIER_UR[p.tier]} ہوٹل${meal ? ` (${meal})` : ""}`,
    `${p.nights.madinah} راتیں مدینہ - ${TIER_UR[p.tier]} ہوٹل${meal ? ` (${meal})` : ""}`,
  ];
  if (p.ziyarat) items.push("مکہ اور مدینہ کی زیارات شامل");
  return items;
}

const EXCLUDE_UR: Record<string, string> = {
  "Ziyarat (can be added)": "زیارات (شامل کی جا سکتی ہیں)",
  "Haram-view room upgrade": "حرم منظر کمرے کی اپ گریڈ",
  "I'tikaf arrangements inside the Haram (by Saudi permit)": "حرم میں اعتکاف کا انتظام (سعودی اجازت نامے کے مطابق)",
  "Suhoor and iftar (available at extra cost)": "سحور و افطار (اضافی قیمت پر دستیاب)",
};
const STANDARD_EXCLUDES_UR = [
  "کھانا، سوائے جہاں ہوٹل کے ساتھ درج ہے",
  "ذاتی اخراجات، لانڈری اور فون",
  "قربانی",
  "ائیر لائن کی حد سے زائد سامان",
  "روضہ (ریاض الجنت) اور حرم تک رسائی نسک پرمٹ کی دستیابی پر منحصر ہے",
];
export function urExcludes(p: UmrahPackage): string[] {
  return [...p.excludes.map((e) => EXCLUDE_UR[e] ?? e), ...STANDARD_EXCLUDES_UR];
}

/** One-line overview per package, from its own data. */
export function urSummary(p: UmrahPackage): string {
  return `${p.days} دن کا مکمل عمرہ پیکج: مکہ میں ${p.nights.makkah} راتیں اور مدینہ میں ${p.nights.madinah} راتیں، ${TIER_UR[p.tier]} ہوٹل۔ عمرہ ویزا، واپسی ٹکٹ، ہوٹل اور سواری - سب ایک قیمت میں۔`;
}

export function urHighlights(p: UmrahPackage): string[] {
  const out: string[] = [
    p.hotels.makkah.distance.startsWith("0") ? "مکہ کا ہوٹل حرم کے بالکل قریب" : "مکہ کے ہوٹل کا حرم سے فاصلہ میٹر میں درج ہے",
  ];
  const meal = urMeals(p.hotels.makkah.meals);
  if (meal) out.push(`دونوں ہوٹلوں میں ${meal.replace(" شامل", "")}`);
  out.push(p.transport === "Private car transfers" ? "نجی گاڑی میں منتقلی" : "مشترکہ کوچ میں منتقلی");
  out.push(p.ziyarat ? "دونوں شہروں کی زیارات شامل" : "زیارات شامل کی جا سکتی ہیں");
  if (p.season === "december") out.push("اسکول کی سرمائی چھٹیوں کے مطابق روانگیاں");
  if (p.season === "ramadan") out.push("رمضان المبارک کا پیکج");
  return out;
}

/** "Who is this for" - one Urdu line per package (keyed by slug). */
const BEST_FOR_UR: Record<string, string> = {
  "7-days-economy": "کم بجٹ میں پہلا عمرہ، یا ایک ہفتے کی چھٹی میں دوبارہ عمرہ کرنے والے زائرین کے لیے۔",
  "7-days-5-star": "مصروف پیشہ ور افراد اور جوڑوں کے لیے جو مختصر سفر میں بغیر پیدل چلے مکمل آرام چاہتے ہیں۔",
  "10-days-economy": "ایک ہفتے سے زیادہ اور پورے پندرہ دن سے کم وقت چاہنے والوں کے لیے۔",
  "10-days-3-star": "دس دن کی چھٹی والے جوڑوں اور چھوٹے خاندانوں کے لیے۔",
  "15-days-economy": "سب سے کم قیمت میں مکمل دو ہفتے کا عمرہ چاہنے والوں کے لیے۔",
  "15-days-3-star": "مناسب قیمت پر پیدل فاصلے کے ہوٹل چاہنے والے خاندانوں کے لیے - پاکستانی خاندانوں کی سب سے عام پسند۔",
  "15-days-4-star": "بزرگ والدین اور خاندانوں کے لیے - کم فاصلہ اور روزانہ ناشتہ۔",
  "15-days-5-star": "پورے پندرہ دن حرم کی دہلیز پر رہنا چاہنے والوں کے لیے۔",
  "21-days-economy": "تین ہفتے سب سے کم روزانہ لاگت پر گزارنا چاہنے والوں کے لیے۔",
  "21-days-3-star": "بزرگ والدین اور خاندانوں کے لیے جو بے جلدی تین ہفتے چاہتے ہیں۔",
  "28-days-economy": "ریٹائرڈ زائرین کے لیے جو مناسب قیمت میں ایک مہینہ عبادت چاہتے ہیں۔",
  "28-days-3-star": "دونوں حرموں کے پیدل فاصلے پر مہینہ بھر قیام چاہنے والوں کے لیے۔",
  "december-family-umrah-15-days": "اسکول جانے والے بچوں کے خاندانوں کے لیے - سرمائی چھٹیوں میں سفر۔",
  "ramadan-last-10-days-umrah": "لیلۃ القدر حرم میں تلاش کرنے والے زائرین کے لیے۔",
  "ramadan-full-month-umrah": "پورا رمضان دونوں حرموں میں گزارنا چاہنے والوں کے لیے۔",
};
export const urBestFor = (p: UmrahPackage) => BEST_FOR_UR[p.slug] ?? "";

/** Urdu itinerary generated from the night split, mirroring itinerary() in lib/packages.ts. */
export function urItinerary(p: UmrahPackage): { when: string; title: string; detail: string }[] {
  const { makkah, madinah } = p.nights;
  const range = (a: number, b: number) => (a === b ? `دن ${a}` : `دن ${a} تا ${b}`);
  const lastDay = makkah + madinah + 1;

  const makkahZiyarat = p.ziyarat
    ? "ایک صبح مکہ کی زیارات کے لیے مختص: جبل نور (غارِ حرا)، جبل ثور، منیٰ، مزدلفہ اور عرفات۔"
    : "مکہ کی زیارات معمولی اضافی رقم پر شامل کی جا سکتی ہیں۔";
  const madinahZiyarat = p.ziyarat ? "مدینہ کی زیارات بذریعہ کوچ: مسجد قباء، کوہِ احد اور شہدائے احد، مسجد قبلتین اور سبع مساجد۔" : "";

  const makkahStay = (start: number, first: boolean) => {
    const out = [
      first
        ? {
            when: `دن ${start}`,
            title: "جدہ پہنچیں، عمرہ ادا کریں",
            detail:
              "پرواز میں میقات سے پہلے احرام باندھ لیں (پرواز سے پہلے ہم یاد دہانی کراتے ہیں)۔ جدہ ائیرپورٹ پر ہمارا ڈرائیور آپ کو مکہ کے ہوٹل پہنچائے گا۔ کچھ آرام کے بعد عمرہ ادا کریں: طواف، سعی اور حلق یا تقصیر۔",
          }
        : {
            when: `دن ${start}`,
            title: "مکہ کی طرف سفر، عمرہ کی ادائیگی",
            detail:
              "ناشتے کے بعد مدینہ سے روانگی۔ راستے میں ذوالحلیفہ (بیر علی) کے میقات پر احرام باندھیں - کوچ وہاں رکتی ہے۔ مکہ کے ہوٹل میں قیام کے بعد عمرہ ادا کریں۔",
          },
    ];
    if (makkah >= 3) {
      out.push({
        when: range(start + 1, start + makkah - 1),
        title: "مکہ - مسجد الحرام میں عبادت",
        detail: `مسجد الحرام میں پنجگانہ نمازیں، اضافی طواف اور مسجد عائشہ (تنعیم) سے مزید عمرے۔ ${makkahZiyarat}`,
      });
    }
    return out;
  };

  const madinahStay = (start: number, first: boolean) => {
    const out = [
      {
        when: `دن ${start}`,
        title: first ? "مدینہ پہنچیں" : "مدینہ کی طرف سفر",
        detail: first
          ? "شہزادہ محمد بن عبدالعزیز ائیرپورٹ مدینہ پہنچ کر ہوٹل میں قیام - مسجد نبوی ﷺ کے بالکل قریب۔ عمرہ بعد میں مکہ کے سفر پر ادا ہوگا۔"
          : p.transport.toLowerCase().includes("train")
            ? "ناشتے کے بعد حرمین ہائی اسپیڈ ٹرین سے مدینہ (تقریباً ڈھائی گھنٹے) اور مسجد نبوی ﷺ کے قریب ہوٹل میں قیام۔"
            : "فجر کی نماز اور ناشتے کے بعد کوچ کے ذریعے مدینہ روانگی (5 تا 6 گھنٹے، راستے میں وقفے کے ساتھ)۔ مسجد نبوی ﷺ کے قریب ہوٹل میں قیام۔",
      },
    ];
    if (madinah >= 2) {
      out.push({
        when: range(start + 1, start + madinah - 1),
        title: "مدینہ - مسجد نبوی ﷺ اور ریاض الجنت",
        detail:
          `مسجد نبوی ﷺ میں نمازیں، روضہ مبارک پر سلام اور نسک پرمٹ سے ریاض الجنت کی زیارت (سلاٹ بکنگ میں ہم مدد کرتے ہیں، دستیابی کے تابع)۔ ${madinahZiyarat}`.trim(),
      });
    }
    return out;
  };

  const steps = p.madinahFirst
    ? [
        ...madinahStay(1, true),
        ...makkahStay(madinah + 1, false),
        {
          when: `دن ${lastDay}`,
          title: "طواف الوداع اور واپسی",
          detail: "مکہ سے روانگی سے پہلے طواف الوداع، پھر جدہ ائیرپورٹ سے پاکستان واپسی۔ زمزم کی اجازت ائیر لائن کے قوانین کے مطابق۔",
        },
      ]
    : [
        ...makkahStay(1, true),
        ...madinahStay(makkah + 1, false),
        {
          when: `دن ${lastDay}`,
          title: "واپسی کی پرواز",
          detail: "مدینہ یا جدہ سے واپسی کی پرواز (ائیر لائن کے مطابق)۔ زمزم کی اجازت ائیر لائن کے قوانین کے مطابق۔",
        },
      ];
  return steps;
}

/** Urdu FAQs per package page - generic but price-accurate, generated from data. */
export function urFaqs(p: UmrahPackage): { q: string; a: string }[] {
  const low = fromPrice(p);
  return [
    {
      q: `${p.days} دن کے اس پیکج کی قیمت میں کیا کیا شامل ہے؟`,
      a: `عمرہ ویزا مع لازمی انشورنس، لاہور، کراچی یا اسلام آباد سے واپسی ٹکٹ، مکہ میں ${p.nights.makkah} اور مدینہ میں ${p.nights.madinah} راتوں کا ہوٹل، اور مکمل سواری۔ فی شخص قیمت ${low.amount.toLocaleString("en-PK")} روپے سے شروع ہوتی ہے (${BASIS_UR[low.basis]} کمرہ)۔ قیمتیں ${urMonthYear(season.pricesCheckedISO)} میں چیک کی گئیں اور ادائیگی سے پہلے تحریری انوائس پر کنفرم کی جاتی ہیں۔`,
    },
    {
      q: "کیا کمرے کی قسم سے قیمت بدلتی ہے؟",
      a: "جی ہاں - کمرے میں جتنے کم افراد ہوں، فی شخص قیمت اتنی زیادہ ہوتی ہے۔ شیئرنگ سب سے کم قیمت اور ڈبل کمرہ سب سے زیادہ قیمت پر ہوتا ہے۔ خاندان عموماً کوڈ یا ٹرپل کمرہ ایک ساتھ لیتے ہیں۔",
    },
    {
      q: "بکنگ کیسے کروائی جائے؟",
      a: `واٹس ایپ پر پیغام بھیجیں، ہر مسافر کے پاسپورٹ (کم از کم 6 ماہ کارروائی) اور شناختی کارڈ کی صاف تصویر بھیجیں، تحریری انوائس موصول ہونے کے بعد بینک ٹرانسفر سے ادائیگی کریں۔ ای ویزا، ٹکٹ اور ہوٹل واؤچر روانگی سے پہلے واٹس ایپ پر مل جاتے ہیں۔ ${WHATSAPP_HOURS_UR}۔`,
    },
  ];
}
