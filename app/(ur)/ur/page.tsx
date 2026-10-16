import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { WhatsAppIcon, ArrowRightIcon } from "@/components/Icons";
import { WHATSAPP_HOURS_UR, urDate, urMonthYear } from "@/components/ur/format";
import { packages, fromPrice, ROOM_BASIS, TIERS, type UmrahPackage } from "@/lib/packages";
import { organizationSchema } from "@/lib/schema";
import { season } from "@/lib/season";
import { whatsappLink } from "@/lib/site";

/**
 * The Urdu homepage (/ur/). Prices, hotel distances and dates come from the
 * same lib/ data as the English site, so they can never drift. The scaffold is
 * deliberately small - this page and /ur/umrah-packages/ - but everything a
 * first-time Urdu visitor needs to decide and to contact us is here.
 */

const title = `پاکستان سے عمرہ پیکجز ${season.label} | محمد ٹریولز`;
const description =
  "پاکستان سے عمرہ پیکجز 2026-27: عمرہ ویزا، واپسی ٹکٹ، حرم کے قریب ہوٹل اور سواری، سب ایک قیمت میں۔ 7 سے 28 دن کے پیکجز، لاہور، کراچی اور اسلام آباد سے روانگی۔";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: "/ur/",
    languages: { "en-PK": "/", ur: "/ur/", "x-default": "/" },
  },
  openGraph: { title, description, url: "/ur/" },
};

/** Prices stay in the sans with Latin digits, per the site rule for figures. */
function pkr(amount: number) {
  return (
    <span className="figure" dir="ltr" style={{ fontFamily: "var(--font-body)" }}>
      PKR {amount.toLocaleString("en-PK")}
    </span>
  );
}

const TIER_UR: Record<string, string> = { economy: "اکانومی", "3-star": "3 سٹار", "4-star": "4 سٹار", "5-star": "5 سٹار" };
const BASIS_UR: Record<string, string> = { sharing: "شیئرنگ", quad: "کوڈ", triple: "ٹرپل", double: "ڈبل" };

function PackageRow({ p }: { p: UmrahPackage }) {
  const low = fromPrice(p);
  return (
    <li className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-4 sm:px-6">
      <div>
        <p className="text-[1.2rem] font-bold text-ink-950">
          {p.days} دن - {TIER_UR[p.tier] ?? TIERS[p.tier].label}
        </p>
        <p className="mt-0.5 text-[0.95rem] text-ink-600">
          مکہ {p.nights.makkah} راتیں، مدینہ {p.nights.madinah} راتیں · حرم سے فاصلہ:{" "}
          <span dir="ltr" className="figure" style={{ fontFamily: "var(--font-body)" }}>
            {p.hotels.makkah.distance}
          </span>
        </p>
      </div>
      <p className="text-[1.05rem] font-bold text-haram-800">
        {pkr(low.amount)} <span className="text-[0.85rem] font-semibold text-ink-500">فی شخص سے شروع ({BASIS_UR[low.basis]} کمرہ)</span>
      </p>
    </li>
  );
}

export default function UrduHome() {
  const featured = packages.filter((p) => p.featured).slice(0, 6);
  const wa = whatsappLink("السلام علیکم، مجھے عمرہ پیکج کے بارے میں معلومات چاہئیں۔");

  return (
    <>
      <JsonLd data={organizationSchema()} />

      {/* ─── Hero ─── */}
      <section className="section-night grain on-dark relative overflow-hidden">
        <div className="container-x py-20 sm:py-24">
          <p className="text-[1.7rem] leading-[1.6] text-gold-300" lang="ar">
            لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ
          </p>
          <h1 className="mt-4 max-w-3xl text-[2.6rem] font-bold leading-[1.25] text-sand-50 sm:text-[3.4rem]">
            پاکستان سے عمرہ پیکجز <span className="text-foil">{season.label}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[1.2rem] leading-[1.9] text-sand-200/90">
            عمرہ ویزا، واپسی ٹکٹ، حرم کے قریب ہوٹل اور مکمل سواری - سب کچھ ایک قیمت میں، روپے میں۔ 7 سے 28 دن کے پیکجز،
            لاہور، کراچی اور اسلام آباد سے روانگی۔
          </p>
          <ul className="mt-8 grid max-w-2xl gap-x-8 gap-y-3 text-[1.05rem] text-sand-100 sm:grid-cols-2">
            {["ہوٹل کا فاصلہ میٹر میں لکھا ہوا", "ادائیگی سے پہلے تحریری انوائس", "اکانومی سے 5 سٹار - ہر قیمت سامنے", "دفتر لاہور میں، بکنگ پورے پاکستان سے"].map((x) => (
              <li key={x} className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0 text-gold-300" fill="currentColor" aria-hidden>
                  <path d="M12 0l2.6 6.3L21 3.5l-2.8 6.4L24 12l-5.8 2.1L21 20.5l-6.4-2.8L12 24l-2.6-6.3L3 20.5l2.8-6.4L0 12l5.8-2.1L3 3.5l6.4 2.8z" />
                </svg>
                {x}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/ur/umrah-packages/" className="btn btn-gold btn-lg">
              تمام پیکجز اور قیمتیں دیکھیں
              <ArrowRightIcon className="h-5 w-5 -scale-x-100" />
            </Link>
            <a href={wa} rel="nofollow" className="btn btn-ghost btn-lg">
              <WhatsAppIcon className="h-5 w-5 text-wa-400" />
              واٹس ایپ پر پوچھیں
            </a>
          </div>
        </div>
      </section>

      {/* ─── Prices ─── */}
      <section className="container-x py-20">
        <p className="eyebrow">مشہور پیکجز</p>
        <h2 className="mt-4 text-[2.2rem] font-bold leading-tight text-ink-950">عمرہ پیکجز کی قیمتیں، پاکستان سے</h2>
        <p className="mt-4 max-w-2xl text-[1.1rem] leading-[1.9] text-ink-700">
          فی شخص قیمت روپے میں، جس میں عمرہ ویزا، واپسی ٹکٹ، مکہ اور مدینہ کے ہوٹل اور سواری شامل ہے۔ قیمتیں{" "}
          {urMonthYear(season.pricesCheckedISO)} میں چیک کی گئیں اور ادائیگی سے پہلے تحریری طور پر کنفرم کی جاتی ہیں۔
        </p>
        <ul className="mt-10 divide-y divide-sand-200 overflow-hidden rounded-[24px] border border-sand-300 bg-[#fffdf9]">
          {featured.map((p) => (
            <PackageRow key={p.slug} p={p} />
          ))}
        </ul>
        <p className="mt-6 text-[1.05rem]">
          <Link href="/ur/umrah-packages/" className="font-bold text-haram-800 underline decoration-gold-400 underline-offset-4">
            تمام {packages.length} پیکجز کی مکمل فہرست اور قیمتیں
          </Link>
        </p>
      </section>

      {/* ─── Trust ─── */}
      <section className="section-ivory border-y border-sand-200">
        <div className="container-x py-20">
          <h2 className="text-[2.2rem] font-bold leading-tight text-ink-950">محمد ٹریولز ہی کیوں؟</h2>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { t: "فاصلہ میٹر میں", d: "ہر پیکج میں مکہ کے ہوٹل کا حرم سے فاصلہ میٹر میں لکھا ہوتا ہے - وعدے نہیں، پیمائش۔" },
              { t: "ادائیگی سے پہلے تحریری انوائس", d: "جو قیمت لکھی ہے وہی قیمت ہے۔ آخر میں اضافی چارجز نہیں۔" },
              { t: "سعودیہ میں بھی رابطہ", d: "مکہ میں بھی ہماری ٹیم سے رابطہ ممکن ہے - فون اور واٹس ایپ پر۔" },
            ].map((x) => (
              <li key={x.t} className="card p-7">
                <p className="text-[1.35rem] font-bold text-ink-950">{x.t}</p>
                <p className="mt-3 text-[1.05rem] leading-[1.9] text-ink-700">{x.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Seasons + guides note ─── */}
      <section className="container-x py-20">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-8">
            <p className="eyebrow">رمضان {season.hijriYear}ھ</p>
            <p className="mt-3 text-[1.6rem] font-bold text-ink-950">رمضان عمرہ {season.label.split("-")[1]}</p>
            <p className="mt-3 text-[1.05rem] leading-[1.9] text-ink-700">
              رمضان متوقع ہے {urDate(season.ramadan.startISO)} تا {urDate(season.ramadan.endISO)}۔ سال کی مصروف ترین اور مہنگی ترین تاریخیں -
              بکنگ ابھی کھلی ہے۔
            </p>
          </div>
          <div className="card p-8">
            <p className="eyebrow">رہنمائی</p>
            <p className="mt-3 text-[1.6rem] font-bold text-ink-950">عمرہ کیسے ادا کریں؟</p>
            <p className="mt-3 text-[1.05rem] leading-[1.9] text-ink-700">
              عمرہ کے طریقے، دعائیں، قیمتوں کی تفصیل اور پیکنگ لسٹ - تفصیلی رہنمائی ابھی{" "}
              <Link href="/guides/" hrefLang="en-PK" className="font-bold text-haram-800 underline decoration-gold-400 underline-offset-4" style={{ fontFamily: "var(--font-body)" }}>
                انگریزی میں دستیاب ہے
              </Link>
              ، اردو ترجمہ جلد آرہا ہے۔
            </p>
          </div>
        </div>
      </section>

      {/* ─── Contact band ─── */}
      <section className="section-night grain on-dark">
        <div className="container-x flex flex-col items-start gap-8 py-20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[2.2rem] font-bold leading-tight text-sand-50">سوالیہ ہے؟ واٹس ایپ پر پوچھیں</h2>
            <p className="mt-3 max-w-xl text-[1.1rem] leading-[1.9] text-sand-200/85">
              ویزا، تاریخوں، قیمتوں یا کمرے کے بارے میں - کوئی بھی سوال۔ {WHATSAPP_HOURS_UR}۔
            </p>
          </div>
          <a href={wa} rel="nofollow" className="btn btn-gold btn-lg shrink-0">
            <WhatsAppIcon className="h-5 w-5" />
            واٹس ایپ پر بات کریں
          </a>
        </div>
      </section>
    </>
  );
}
