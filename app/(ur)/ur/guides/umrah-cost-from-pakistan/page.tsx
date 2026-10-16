import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { Faq, GuideShell, H2, P, UL } from "@/components/ur/Guide";
import { market, pkrRange } from "@/lib/market";
import { cheapest, packages } from "@/lib/packages";
import { faqSchema } from "@/lib/schema";
import { season } from "@/lib/season";

const slug = "umrah-cost-from-pakistan";
const title = "پاکستان سے عمرہ کا خرچہ 2026-27 - مکمل تفصیل";
const description =
  "پاکستان سے عمرہ کا کل خرچہ: ویزا، ٹکٹ، ہوٹل اور سواری کی اصل قیمتیں، شہر کے حساب سے فرق اور پیسے بچانے کے طریقے - اردو میں۔";
const intro =
  "عمرہ کا خرچہ چار چیزوں سے بنتا ہے: ویزا، ہوائی ٹکٹ، ہوٹل اور سواری۔ یہ صفحہ ہر حصے کی اصل قیمت دکھاتا ہے تاکہ آپ اندازہ لگا سکیں کہ کوئی پیکج مہنگا ہے یا سستا - اور کیوں۔";

export const metadata: Metadata = {
  title: { absolute: `${title} | محمد ٹریولز` },
  description,
  alternates: {
    canonical: `/ur/guides/${slug}/`,
    languages: { "en-PK": `/guides/${slug}/`, ur: `/ur/guides/${slug}/`, "x-default": `/guides/${slug}/` },
  },
  openGraph: { title, description, url: `/ur/guides/${slug}/` },
};

const faqs = [
  { q: "سب سے کم قیمت میں عمرہ کتنے میں ہو سکتا ہے؟", a: "شیئرنگ کمرے اور اکانومی ہوٹل کے ساتھ 7 دن کا پیکج تقریباً ڈھائی لاکھ روپے فی شخص سے شروع ہوتا ہے۔ پندرہ دن کا اکانومی پیکج اس سے کچھ زیادہ ہے کیونکہ ٹکٹ اور ویزا ایک جیسے رہتے ہیں - صرف ہوٹل کے دن بڑھتے ہیں۔" },
  { q: "رمضان میں عمرہ کیوں مہنگا ہوتا ہے؟", a: "رمضان میں ٹکٹ اور ہوٹل دونوں کی مانگ سال کی سب سے زیادہ ہوتی ہے۔ خاص طور پر آخری عشرے میں قیمتیں تقریباً دگنی ہو جاتی ہیں۔" },
  { q: "بچوں کی قیمت کیا ہے؟", a: "بچوں کی قیمت عمر کے حساب سے ہوتی ہے - ٹکٹ میں رعایت ملتی ہے لیکن ویزا اور ہوٹل کا حصہ تقریباً برابر رہتا ہے۔ درست قیمت کے لیے واٹس ایپ پر عمر بتا کر پوچھیں۔" },
  { q: "قیمتیں کب بدلتی ہیں؟", a: "ٹکٹ اور ہوٹل کی قیمتوں کے ساتھ۔ ہم ہر مہینے قیمتیں دوبارہ چیک کرتے ہیں اور ادائیگی سے پہلے تحریری انوائس پر کنفرم کرتے ہیں - لکھی ہوئی قیمت بعد میں نہیں بڑھتی۔" },
];

export default function Page() {
  const lowest = cheapest(packages)!;
  return (
    <GuideShell slug={slug} title={title} intro={intro} description={description}>
      <JsonLd data={faqSchema(faqs)} />

      <H2 id="parts">خرچہ کہاں کہاں جاتا ہے؟</H2>
      <UL
        items={[
          "عمرہ ویزا مع لازمی طبی انشورنس",
          "واپسی ہوائی ٹکٹ (لاہور، کراچی یا اسلام آباد سے)",
          "مکہ اور مدینہ کے ہوٹل - فاصلہ جتنا کم، قیمت اتنی زیادہ",
          "ائیرپورٹ اور مکہ-مدینہ کی سواری",
          "کھانا (اگر ہوٹل میں شامل نہ ہو) اور ذاتی اخراجات",
        ]}
      />

      <H2 id="visa">ویزا کی قیمت</H2>
      <P>
        صرف ویزا (لازمی انشورنس سمیت) پاکستانی ایجنسیوں میں فی شخص {pkrRange(market.visa.min, market.visa.max)} کے
        قریب ملتا ہے - یہ اعداد {market.checked} میں چیک کیے گئے۔ پیکج میں ویزا کی قیمت پہلے سے شامل ہوتی ہے۔
      </P>

      <H2 id="flights">ٹکٹ کی قیمت - شہر کے حساب سے</H2>
      <P>غیر مصروف ہفتوں میں جدہ کا واپسی اکانومی ٹکٹ فی شخص تقریباً:</P>
      <UL items={market.airfare.map((a) => `${a.city} سے: ${pkrRange(a.min, a.max)}`)} />
      <P>
        دسمبر کی چھٹیوں اور رمضان میں ٹکٹ عام طور پر {market.peakAirfareUplift} تک مہنگا ہو جاتا ہے۔ کراچی سے جانے
        والے پیکج عموماً لاہور یا اسلام آباد کے مقابلے میں {pkrRange(market.karachiSaving.min, market.karachiSaving.max)} تک
        سستے ہوتے ہیں۔
      </P>

      <H2 id="packages">مکمل پیکج کی قیمت</H2>
      <P>
        ہمارے پاس {season.label} کے لیے سب سے کم قیمت کا پیکج فی شخص {lowest.amount.toLocaleString("en-PK")} روپے سے شروع
        ہوتا ہے ({lowest.basis === "sharing" ? "شیئرنگ" : "کوڈ"} کمرہ)۔ قیمت میں فرق بنانے والے تین عوامل ہیں: دنوں کی
        تعداد، ہوٹل کا درجہ اور فاصلہ، اور کمرے میں افراد کی تعداد۔ مکمل فہرست ہمارے{" "}
        <a href="/ur/umrah-packages/" className="font-bold text-haram-800 underline decoration-gold-400 underline-offset-4">
          پیکجز والے صفحے
        </a>{" "}
        پر دیکھیں۔
      </P>

      <H2 id="save">پیسے بچانے کے پانچ طریقے</H2>
      <UL
        items={[
          "کمرہ شیئر کریں - شیئرنگ اور ڈبل کمرے میں فی شخص فرق کئی لاکھ تک ہو سکتا ہے۔",
          "دسمبر اور رمضان سے بچیں - اکتوبر، نومبر اور جنوری سب سے سستے مہینے ہیں۔",
          "جلد بکنگ کرائیں - ٹکٹ کی قیمت روانگی قریب آتے آتے بڑھتی ہے۔",
          "کراچی سے روانگی کا موازنہ کریں - خاندان کے چار پانچ افراد پر مجموعی بچت نمایاں ہوتی ہے۔",
          "لمبا پیکج لیں - روزانہ کی لاگت 21 اور 28 دن کے پیکجز میں سب سے کم ہوتی ہے۔",
        ]}
      />

      <H2 id="faq">اکثر پوچھے گئے سوالات</H2>
      <Faq faqs={faqs} />
    </GuideShell>
  );
}
