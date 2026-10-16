import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { WhatsAppIcon, ArrowRightIcon } from "@/components/Icons";
import {
  BASIS_PEOPLE_UR,
  BASIS_UR,
  TIER_BLURB_UR,
  TIER_UR,
  urBestFor,
  urExcludes,
  urFaqs,
  urFlights,
  urHighlights,
  urIncludes,
  urItinerary,
  urMeals,
  urSummary,
  urTransport,
  urValidity,
} from "@/components/ur/copy";
import { urMonthYear } from "@/components/ur/format";
import { ROOM_BASIS, fromPrice, getPackage, packages, type UmrahPackage } from "@/lib/packages";
import { breadcrumbSchema, faqSchema, organizationSchema, priceValidUntil } from "@/lib/schema";
import { season } from "@/lib/season";
import { site, whatsappLink } from "@/lib/site";

/**
 * /ur/umrah-packages/[slug]/ - the Urdu twin of every English package page.
 * All numbers, nights, distances, inclusions and the itinerary are generated
 * from lib/packages.ts via components/ur/copy.ts, so the Urdu pages can never
 * disagree with the English ones. hreflang pairs both directions.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return packages.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getPackage(slug);
  if (!p) return {};
  const low = fromPrice(p);
  const title = `${p.days} دن عمرہ پیکج ${TIER_UR[p.tier]} ${season.label} | محمد ٹریولز`;
  const description = `${p.days} دن: مکہ ${p.nights.makkah} راتیں اور مدینہ ${p.nights.madinah} راتیں، ${TIER_UR[p.tier]} ہوٹل۔ ویزا، واپسی ٹکٹ اور سواری شامل - فی شخص PKR ${low.amount.toLocaleString("en-PK")} سے (${BASIS_UR[low.basis]} کمرہ)۔`;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `/ur/umrah-packages/${p.slug}/`,
      languages: { "en-PK": `/umrah-packages/${p.slug}/`, ur: `/ur/umrah-packages/${p.slug}/`, "x-default": `/umrah-packages/${p.slug}/` },
    },
    openGraph: { title, description, url: `/ur/umrah-packages/${p.slug}/` },
  };
}

function pkr(amount: number) {
  return (
    <span className="figure" dir="ltr" style={{ fontFamily: "var(--font-body)" }}>
      PKR {amount.toLocaleString("en-PK")}
    </span>
  );
}

function HotelCard({ city, nights, hotel }: { city: string; nights: number; hotel: UmrahPackage["hotels"]["makkah"] }) {
  const meals = urMeals(hotel.meals);
  return (
    <li className="card p-7">
      <p className="eyebrow">
        {city} · {nights} راتیں
      </p>
      <p className="mt-3 text-[1.25rem] font-bold text-ink-950">
        <span dir="ltr" className="inline-block" style={{ fontFamily: "var(--font-body)" }}>
          {hotel.name}
        </span>
      </p>
      <ul className="mt-3 space-y-1.5 text-[1rem] leading-[1.9] text-ink-700">
        <li>{hotel.stars} سٹار - &quot;یا اسی درجے کا ہوٹل&quot; (درست ہوٹل بکنگ واؤچر پر کنفرم ہوتا ہے)</li>
        <li>
          حرم سے فاصلہ:{" "}
          <span dir="ltr" className="figure" style={{ fontFamily: "var(--font-body)" }}>
            {hotel.distance}
          </span>
        </li>
        {hotel.shuttle && <li>حرم کے لیے مفت شٹل سروس</li>}
        <li>{meals ?? "صرف کمرہ (کھانا شامل نہیں)"}</li>
      </ul>
    </li>
  );
}

export default async function UrduPackagePage({ params }: Props) {
  const { slug } = await params;
  const p = getPackage(slug);
  if (!p) notFound();

  const low = fromPrice(p);
  const path = `/ur/umrah-packages/${p.slug}/`;
  const wa = whatsappLink(`السلام علیکم، مجھے ${p.days} دن کے پیکج (${p.name}) کی بکنگ کے بارے میں معلومات چاہئیں۔`);
  const faqs = urFaqs(p);
  const itinerary = urItinerary(p);
  const bases = (Object.keys(ROOM_BASIS) as (keyof typeof ROOM_BASIS)[]).filter((b) => p.prices[b]);

  const amounts = Object.values(p.prices).filter((v): v is number => typeof v === "number");
  const tripSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: `${p.days} دن عمرہ پیکج (${TIER_UR[p.tier]}) - محمد ٹریولز`,
    description: urSummary(p),
    url: `${site.url}${path}`,
    touristType: "Umrah pilgrims",
    provider: { "@id": `${site.url}/#organization` },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: low.amount,
      highPrice: Math.max(...amounts),
      priceCurrency: site.currency,
      offerCount: amounts.length,
      priceValidUntil: priceValidUntil(),
      url: `${site.url}${path}`,
    },
  };

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          tripSchema,
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "سرورق", path: "/ur/" },
            { name: "عمرہ پیکجز", path: "/ur/umrah-packages/" },
            { name: `${p.days} دن ${TIER_UR[p.tier]}`, path },
          ]),
        ]}
      />

      {/* ─── Hero ─── */}
      <section className="section-night grain on-dark">
        <div className="container-x py-14 sm:py-18">
          <nav aria-label="breadcrumb" className="text-[0.9rem] text-sand-200/70">
            <Link href="/ur/" className="hover:text-gold-300">سرورق</Link>
            <span aria-hidden className="mx-2 text-gold-500/50">/</span>
            <Link href="/ur/umrah-packages/" className="hover:text-gold-300">عمرہ پیکجز</Link>
            <span aria-hidden className="mx-2 text-gold-500/50">/</span>
            <span className="text-sand-100">{p.days} دن {TIER_UR[p.tier]}</span>
          </nav>
          <h1 className="mt-6 max-w-3xl text-[2.2rem] font-bold leading-[1.35] text-sand-50 sm:text-[3rem]">
            {p.days} دن کا عمرہ پیکج - {TIER_UR[p.tier]}
          </h1>
          <p className="mt-3 text-[1.15rem] text-gold-300">{TIER_BLURB_UR[p.tier]}</p>
          <p className="mt-5 max-w-2xl text-[1.15rem] leading-[1.95] text-sand-200/90">{urSummary(p)}</p>
          <ul className="mt-7 flex flex-wrap gap-x-8 gap-y-2 text-[1rem] text-sand-100">
            <li>مکہ {p.nights.makkah} راتیں · مدینہ {p.nights.madinah} راتیں</li>
            <li>روانگی: {urValidity(p)}</li>
            <li>{p.madinahFirst ? "پہلے مدینہ، پھر مکہ" : "پہلے مکہ، پھر مدینہ"}</li>
          </ul>
          <p className="mt-8 text-[1.3rem] font-bold text-sand-50">
            {pkr(low.amount)} <span className="text-[0.95rem] font-semibold text-sand-200/80">فی شخص سے شروع ({BASIS_UR[low.basis]} کمرہ)</span>
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href={wa} rel="nofollow" className="btn btn-gold btn-lg">
              <WhatsAppIcon className="h-5 w-5" />
              واٹس ایپ پر بکنگ کرائیں
            </a>
            <Link href="/ur/umrah-packages/" className="btn btn-ghost btn-lg">
              تمام پیکجز سے موازنہ
              <ArrowRightIcon className="h-5 w-5 -scale-x-100" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Prices ─── */}
      <section className="container-x py-16">
        <h2 className="text-[2rem] font-bold text-ink-950">قیمتیں - کمرے کی قسم کے مطابق</h2>
        <p className="mt-3 max-w-2xl text-[1.05rem] leading-[1.9] text-ink-700">
          فی شخص قیمت روپے میں، {urMonthYear(season.pricesCheckedISO)} میں چیک شدہ۔ ادائیگی سے پہلے تحریری انوائس پر کنفرم کی جاتی ہے۔
        </p>
        <div className="mt-8 overflow-x-auto rounded-[24px] border border-sand-300 bg-[#fffdf9]">
          <table className="w-full min-w-[34rem] text-right">
            <thead>
              <tr className="border-b border-sand-200 text-[0.95rem] text-ink-600">
                <th className="px-5 py-4 font-bold">کمرہ</th>
                <th className="px-5 py-4 font-bold">افراد</th>
                <th className="px-5 py-4 font-bold">فی شخص قیمت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200">
              {bases.map((b) => (
                <tr key={b}>
                  <td className="px-5 py-4 text-[1.1rem] font-bold text-ink-950">{BASIS_UR[b]}</td>
                  <td className="px-5 py-4 text-[1rem] text-ink-700">{BASIS_PEOPLE_UR[b]}</td>
                  <td className="px-5 py-4 text-[1.05rem] font-bold text-haram-800">{pkr(p.prices[b]!)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── Highlights + hotels ─── */}
      <section className="section-ivory border-y border-sand-200">
        <div className="container-x py-16">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-[2rem] font-bold text-ink-950">اس پیکج کی خاص باتیں</h2>
              <ul className="mt-6 space-y-3 text-[1.1rem] leading-[1.9] text-ink-800">
                {urHighlights(p).map((h) => (
                  <li key={h} className="flex items-start gap-3">
                    <svg viewBox="0 0 24 24" className="mt-2 h-3 w-3 shrink-0 text-gold-500" fill="currentColor" aria-hidden>
                      <path d="M12 0l2.6 6.3L21 3.5l-2.8 6.4L24 12l-5.8 2.1L21 20.5l-6.4-2.8L12 24l-2.6-6.3L3 20.5l2.8-6.4L0 12l5.8-2.1L3 3.5l6.4 2.8z" />
                    </svg>
                    {h}
                  </li>
                ))}
              </ul>
              {urBestFor(p) && (
                <p className="mt-6 rounded-2xl border border-gold-300 bg-gold-100/50 px-5 py-4 text-[1.05rem] leading-[1.9] text-ink-800">
                  <strong>کس کے لیے بہترین:</strong> {urBestFor(p)}
                </p>
              )}
            </div>
            <div>
              <h2 className="text-[2rem] font-bold text-ink-950">ہوٹل</h2>
              <ul className="mt-6 space-y-5">
                <HotelCard city="مکہ المکرمہ" nights={p.nights.makkah} hotel={p.hotels.makkah} />
                <HotelCard city="مدینہ منورہ" nights={p.nights.madinah} hotel={p.hotels.madinah} />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Includes / excludes ─── */}
      <section className="container-x py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-[1.8rem] font-bold text-ink-950">قیمت میں شامل ہے</h2>
            <ul className="mt-5 list-disc space-y-2 pr-6 text-[1.05rem] leading-[1.9] text-ink-800 marker:text-haram-700">
              {urIncludes(p).map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p className="mt-5 text-[1rem] leading-[1.9] text-ink-600">
              <strong>پروازیں:</strong> {urFlights} <strong>سواری:</strong> {urTransport(p)}۔
            </p>
          </div>
          <div>
            <h2 className="text-[1.8rem] font-bold text-ink-950">شامل نہیں ہے</h2>
            <ul className="mt-5 list-disc space-y-2 pr-6 text-[1.05rem] leading-[1.9] text-ink-700 marker:text-sand-400">
              {urExcludes(p).map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── Itinerary ─── */}
      <section className="section-ivory border-y border-sand-200">
        <div className="container-x py-16">
          <h2 className="text-[2rem] font-bold text-ink-950">دن بہ دن پروگرام</h2>
          <ol className="mt-8 space-y-6 border-r-2 border-gold-300 pr-6">
            {itinerary.map((s) => (
              <li key={s.when}>
                <p className="text-[0.95rem] font-bold text-haram-800">{s.when}</p>
                <p className="mt-1 text-[1.2rem] font-bold text-ink-950">{s.title}</p>
                <p className="mt-1.5 max-w-2xl text-[1.02rem] leading-[1.95] text-ink-700">{s.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── FAQs ─── */}
      <section className="container-x py-16">
        <h2 className="text-[2rem] font-bold text-ink-950">اکثر پوچھے گئے سوالات</h2>
        <div className="mt-8 space-y-4">
          {faqs.map((f) => (
            <details key={f.q} className="card group px-6 py-5">
              <summary className="cursor-pointer list-none text-[1.15rem] font-bold text-ink-950">{f.q}</summary>
              <p className="mt-3 text-[1.05rem] leading-[1.95] text-ink-700">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-[1.05rem] leading-[1.9] text-ink-600">
          مزید تفصیل اور مکمل انگریزی صفحہ:{" "}
          <Link href={`/umrah-packages/${p.slug}/`} hrefLang="en-PK" className="font-bold text-haram-800 underline decoration-gold-400 underline-offset-4" style={{ fontFamily: "var(--font-body)" }}>
            {p.name}
          </Link>
        </p>
      </section>

      {/* ─── CTA ─── */}
      <section className="section-night grain on-dark">
        <div className="container-x flex flex-col items-start gap-8 py-16 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[2rem] font-bold leading-tight text-sand-50">اس پیکج کی بکنگ یا سوال؟</h2>
            <p className="mt-3 max-w-xl text-[1.1rem] leading-[1.9] text-sand-200/85">
              تاریخیں، کمرے یا قیمت کے بارے میں پوچھیں - جواب اردو میں ملے گا۔ قیمتیں {urMonthYear(season.pricesCheckedISO)} میں چیک کی گئیں۔
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
