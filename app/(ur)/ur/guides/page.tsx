import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { organizationSchema } from "@/lib/schema";

const title = "عمرہ گائیڈز - اردو رہنمائی | محمد ٹریولز";
const description =
  "عمرہ کی مکمل اردو رہنمائی: عمرہ کرنے کا طریقہ، دعائیں، پاکستان سے خرچہ، پیکنگ لسٹ، ویکسین کے قواعد اور نسک ایپ۔";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: "/ur/guides/",
    languages: { "en-PK": "/guides/", ur: "/ur/guides/", "x-default": "/guides/" },
  },
  openGraph: { title, description, url: "/ur/guides/" },
};

const guides = [
  { href: "/ur/guides/how-to-perform-umrah/", t: "عمرہ کرنے کا طریقہ", d: "احرام، طواف، سعی اور حلق - قدم بہ قدم مکمل طریقہ، عام غلطیوں سمیت۔" },
  { href: "/ur/guides/umrah-duas/", t: "عمرہ کی دعائیں", d: "تلبیہ، طواف، صفا مروہ اور روضہ رسول ﷺ کی دعائیں - عربی متن اور اردو ترجمے کے ساتھ۔" },
  { href: "/ur/guides/umrah-cost-from-pakistan/", t: "پاکستان سے عمرہ کا خرچہ", d: "ویزا، ٹکٹ اور ہوٹل کی اصل قیمتیں اور پیسے بچانے کے پانچ طریقے۔" },
  { href: "/ur/guides/umrah-packing-list/", t: "عمرہ کے لیے سامان کی فہرست", d: "دستاویزات، احرام، ادویات اور برقی سامان - کیا لیں اور کیا نہ لیں۔" },
  { href: "/ur/guides/umrah-vaccination-requirements/", t: "ویکسین اور NADRA سرٹیفکیٹ", d: "میننجائٹس اور پولیو ویکسین کے قواعد اور سرٹیفکیٹ بنوانے کا طریقہ۔" },
  { href: "/ur/guides/nusuk-app-guide/", t: "نسک ایپ گائیڈ", d: "اکاؤنٹ بنانا، ریاض الجنت کا سلاٹ اور عام مسائل کا حل۔" },
];

export default function UrduGuides() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <section className="section-night grain on-dark">
        <div className="container-x py-16 sm:py-20">
          <p className="eyebrow">رہنمائی</p>
          <h1 className="mt-4 max-w-3xl text-[2.4rem] font-bold leading-[1.3] text-sand-50 sm:text-[3rem]">عمرہ گائیڈز - اردو میں</h1>
          <p className="mt-5 max-w-2xl text-[1.15rem] leading-[1.9] text-sand-200/90">
            عمرہ کی تیاری سے ادائیگی تک - ہر مرحلے کی سادہ، مکمل اردو رہنمائی۔
          </p>
        </div>
      </section>
      <div className="container-x py-16">
        <ul className="grid gap-6 md:grid-cols-2">
          {guides.map((g) => (
            <li key={g.href}>
              <Link href={g.href} className="card block h-full p-7 transition hover:border-gold-400">
                <p className="text-[1.35rem] font-bold text-ink-950">{g.t}</p>
                <p className="mt-2 text-[1.02rem] leading-[1.9] text-ink-700">{g.d}</p>
                <p className="mt-4 text-[0.95rem] font-bold text-haram-800">پڑھیں ←</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
