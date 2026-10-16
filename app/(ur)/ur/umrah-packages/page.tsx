import type { Metadata } from "next";
import { WhatsAppIcon } from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import { WHATSAPP_HOURS_UR, urMonthYear } from "@/components/ur/format";
import { packages, fromPrice, ROOM_BASIS, TIERS } from "@/lib/packages";
import { organizationSchema } from "@/lib/schema";
import { season } from "@/lib/season";
import { whatsappLink } from "@/lib/site";

/**
 * /ur/umrah-packages/ - the full price list in Urdu. Rows are generated from
 * lib/packages.ts, so prices match the English site (and its schema) exactly.
 * Package detail pages stay English for now; every row offers WhatsApp in Urdu.
 */

const title = `عمرہ پیکجز اور قیمتیں ${season.label} | محمد ٹریولز`;
const description =
  "تمام عمرہ پیکجز کی قیمتیں پاکستان سے 2026-27: 7، 15، 21 اور 28 دن کے پیکجز، اکانومی سے 5 سٹار، فی شخص قیمت روپے میں - ویزا، ٹکٹ، ہوٹل اور سواری شامل۔";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: "/ur/umrah-packages/",
    languages: { "en-PK": "/umrah-packages/", ur: "/ur/umrah-packages/", "x-default": "/umrah-packages/" },
  },
  openGraph: { title, description, url: "/ur/umrah-packages/" },
};

const TIER_UR: Record<string, string> = { economy: "اکانومی", "3-star": "3 سٹار", "4-star": "4 سٹار", "5-star": "5 سٹار" };
const BASIS_UR: Record<string, string> = { sharing: "شیئرنگ", quad: "کوڈ", triple: "ٹرپل", double: "ڈبل" };

const groups: { title: string; test: (days: number, seasonal: boolean) => boolean }[] = [
  { title: "7 دن کے پیکجز", test: (d, s) => !s && d <= 8 },
  { title: "15 دن کے پیکجز", test: (d, s) => !s && d > 8 && d <= 16 },
  { title: "21 دن کے پیکجز", test: (d, s) => !s && d > 16 && d <= 24 },
  { title: "28 دن کے پیکجز", test: (d, s) => !s && d > 24 },
  { title: "دسمبر اور رمضان کے پیکجز", test: (_d, s) => s },
];

export default function UrduPackages() {
  const wa = (name: string, days: number) =>
    whatsappLink(`السلام علیکم، مجھے ${days} دن کے پیکج (${name}) کی قیمت اور تفصیل چاہئے۔`);

  return (
    <>
      <JsonLd data={organizationSchema()} />

      <section className="section-night grain on-dark">
        <div className="container-x py-16 sm:py-20">
          <p className="eyebrow">مکمل فہرست</p>
          <h1 className="mt-4 max-w-3xl text-[2.4rem] font-bold leading-[1.3] text-sand-50 sm:text-[3rem]">
            عمرہ پیکجز اور قیمتیں {season.label}
          </h1>
          <p className="mt-5 max-w-2xl text-[1.15rem] leading-[1.9] text-sand-200/90">
            فی شخص قیمت روپے میں، جس میں عمرہ ویزا، واپسی ٹکٹ، مکہ اور مدینہ کے ہوٹل اور سواری شامل ہے۔ قیمتیں{" "}
            {urMonthYear(season.pricesCheckedISO)} میں چیک کی گئیں اور ادائیگی سے پہلے تحریری انوائس پر کنفرم کی جاتی ہیں۔
          </p>
        </div>
      </section>

      <div className="container-x space-y-14 py-16">
        {groups.map((g) => {
          const list = packages.filter((p) => g.test(p.days, Boolean(p.season)));
          if (!list.length) return null;
          return (
            <section key={g.title}>
              <h2 className="text-[1.9rem] font-bold text-ink-950">{g.title}</h2>
              <ul className="mt-6 divide-y divide-sand-200 overflow-hidden rounded-[24px] border border-sand-300 bg-[#fffdf9]">
                {list.map((p) => {
                  const low = fromPrice(p);
                  return (
                    <li key={p.slug} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-5 sm:px-7">
                      <div className="min-w-0">
                        <p className="text-[1.25rem] font-bold text-ink-950">
                          {p.days} دن - {TIER_UR[p.tier] ?? TIERS[p.tier].label}
                        </p>
                        <p className="mt-1 text-[0.98rem] leading-[1.8] text-ink-600">
                          مکہ {p.nights.makkah} راتیں، مدینہ {p.nights.madinah} راتیں · ہوٹل حرم سے{" "}
                          <span dir="ltr" className="figure" style={{ fontFamily: "var(--font-body)" }}>
                            {p.hotels.makkah.distance}
                          </span>{" "}
                          · کمرہ: {BASIS_UR[low.basis] ?? ROOM_BASIS[low.basis].label}
                        </p>
                      </div>
                      <div className="flex items-center gap-5">
                        <p className="text-[1.05rem] font-bold text-haram-800">
                          <span className="figure" dir="ltr" style={{ fontFamily: "var(--font-body)" }}>
                            PKR {low.amount.toLocaleString("en-PK")}
                          </span>{" "}
                          <span className="text-[0.85rem] font-semibold text-ink-500">فی شخص سے</span>
                        </p>
                        <a href={wa(p.name, p.days)} rel="nofollow" className="btn btn-gold min-h-11 !px-4 text-[0.95rem]">
                          <WhatsAppIcon className="h-4 w-4" />
                          قیمت پوچھیں
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        <p className="max-w-2xl text-[1.05rem] leading-[1.9] text-ink-600">
          ہر پیکج کی مزید تفصیل - ہوٹلوں کے نام، پروازیں اور دن بہ دن پروگرام - ابھی انگریزی صفحات پر ہے۔ اردو میں مکمل
          تفصیل کے لیے واٹس ایپ پر رابطہ کریں: {WHATSAPP_HOURS_UR}۔
        </p>
      </div>
    </>
  );
}
