import Image from "next/image";
import Link from "next/link";
import BookingSteps from "@/components/BookingSteps";
import CtaBand from "@/components/CtaBand";
import DaysUntil from "@/components/DaysUntil";
import DistanceExplorer from "@/components/DistanceExplorer";
import EnquiryForm from "@/components/EnquiryForm";
import Faq from "@/components/Faq";
import HeroFinder from "@/components/HeroFinder";
import JourneyMap from "@/components/JourneyMap";
import JsonLd from "@/components/JsonLd";
import PackageCard from "@/components/PackageCard";
import PriceTable from "@/components/PriceTable";
import PriceTicker from "@/components/PriceTicker";
import RitesExperience from "@/components/RitesExperience";
import SectionHeading from "@/components/SectionHeading";
import StarPattern, { Ornament } from "@/components/StarPattern";
import TrustPoints from "@/components/TrustPoints";
import { ArrowRightIcon, PinIcon, WhatsAppIcon } from "@/components/Icons";
import { categories } from "@/lib/categories";
import { TIER_NOTES } from "@/lib/copy";
import { tierDistances } from "@/lib/distance";
import { toFinderList } from "@/lib/finder";
import { images } from "@/lib/images";
import { departures, groundNote, routeDistances } from "@/lib/journey";
import { market } from "@/lib/market";
import { ROOM_BASIS, TIERS, cheapest, fromPrice, packages } from "@/lib/packages";
import { ritesCopy } from "@/lib/rites";
import { itemListSchema, webPageSchema } from "@/lib/schema";
import { season } from "@/lib/season";
import { formatPKR, fullAddress, site, whatsappLink } from "@/lib/site";

export default function HomePage() {
  const featured = packages.filter((p) => p.featured);
  const overall = cheapest(packages)!;
  const durations = categories.filter((c) => c.group === "duration");
  const tableList = packages
    .filter((p) => !p.season && [7, 15, 21, 28].includes(p.days))
    .sort((a, b) => a.days - b.days || fromTierOrder(a.tier) - fromTierOrder(b.tier));
  const popular = packages.find((p) => p.slug === "15-days-3-star");
  const popularPrice = popular ? fromPrice(popular).amount : overall.amount;

  const ticker = [
    ...durations.map((c) => {
      const low = cheapest(packages.filter(c.filter));
      return { label: `${c.slug.split("-")[0]} days`, value: low ? `from ${formatPKR(low.amount)}` : "on request", href: `/umrah-packages/${c.slug}/` };
    }),
    ...categories
      .filter((c) => ["5-star", "december", "ramadan"].includes(c.slug))
      .map((c) => {
        const low = cheapest(packages.filter(c.filter));
        return {
          label: c.slug === "5-star" ? "5-Star" : c.slug === "december" ? "December 2026" : "Ramadan 2027",
          value: low ? `from ${formatPKR(low.amount)}` : "on request",
          href: `/umrah-packages/${c.slug}/`,
        };
      }),
  ];

  const rites = ritesCopy();

  const faqs = [
    {
      q: "How much does an Umrah package cost from Pakistan in 2026?",
      a: `Our complete packages start from ${formatPKR(overall.amount)} per person (${ROOM_BASIS[overall.basis].label.toLowerCase()} room), including the Umrah visa, return flights, hotels in Makkah and Madinah, and transport. A 15 day 3-star package - the most popular choice - is higher, and 5-star and Ramadan packages cost the most. See the price table above for every package.`,
    },
    {
      q: "What is included in an Umrah package?",
      a: "The Umrah visa with its mandatory insurance, return economy flights from Pakistan, hotels in Makkah and Madinah for the stated nights, and all transfers (airport, and Makkah to Madinah). Most packages also include ziyarat in both cities. Meals are included only where the hotel says so.",
    },
    {
      q: "How long does the Umrah visa take?",
      a: "Usually a few working days once we have your documents and payment, though the Saudi authorities control processing. Apply at least two to three weeks before you want to fly; for December and Ramadan, much earlier.",
    },
    {
      q: "Which documents do I need for Umrah from Pakistan?",
      a: "A passport valid for at least six months, your CNIC, a recent photo with a white background, and the required vaccinations (meningitis, and polio for travellers from Pakistan) on a NADRA-linked vaccination certificate, now required at Karachi airport with other airports to follow. We confirm the current list when you book, as the rules are changing.",
    },
    {
      q: "Can women perform Umrah without a mahram?",
      a: "Saudi Arabia currently allows women to perform Umrah without a mahram. Families often still prefer to travel together, and we'll place women travelling without family in rooms with other women.",
    },
    {
      q: "Do you only serve Lahore?",
      a: `Our office is in ${site.contact.address.city}, but we book pilgrims from anywhere in Pakistan on WhatsApp and phone, with flights from Lahore, Karachi and Islamabad.`,
    },
    {
      q: "When is the best time to go for Umrah?",
      a: `October to early December is mild and good value. December holidays and Ramadan (expected ${season.ramadan.short}) are the busiest and most expensive, so book those early.`,
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            path: "/",
            title: `Umrah Packages from Pakistan ${season.label}`,
            description: site.description,
            dateModified: season.pricesCheckedISO,
            image: "kaabaTowers",
          }),
          itemListSchema("Umrah packages from Pakistan", featured),
        ]}
      />

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="section-night grain on-dark relative -mt-[var(--header-h)] overflow-hidden pt-[var(--header-h)]">
        <div aria-hidden className="light-rays" />
        <StarPattern id="hero-lattice" className="text-gold-300 opacity-[0.045] [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]" />
        <div aria-hidden className="pointer-events-none absolute -right-40 top-10 h-[40rem] w-[40rem] rounded-full bg-haram-600/20 blur-[120px]" />

        <div className="container-x relative grid gap-14 pb-12 pt-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-12 lg:pb-16 lg:pt-16">
          <div>
            <p className="arabic wipe-rtl text-left text-[1.85rem] leading-[1.5] text-gold-300 sm:text-[2.2rem]" lang="ar">
              لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ
            </p>
            <h1 className="h-display rise mt-3 text-[3.05rem] text-sand-50 sm:text-[4.4rem] lg:text-[5.2rem] xl:text-[5.7rem]" style={{ "--d": 1 } as React.CSSProperties}>
              Umrah Packages from Pakistan <span className="text-foil italic">{season.label}</span>
            </h1>
            <p className="rise mt-7 max-w-xl text-[1.1rem] leading-relaxed text-sand-200/85" style={{ "--d": 2 } as React.CSSProperties}>
              Visa, return flights, hotels near the Haram and transport - in one per-person price, in rupees. 7 to 28
              day packages from Lahore, Karachi and Islamabad, from{" "}
              <strong className="figure font-bold text-gold-200">{formatPKR(overall.amount)}</strong>.
            </p>
            <ul className="rise mt-7 grid max-w-xl gap-x-6 gap-y-2.5 text-[0.95rem] text-sand-100 sm:grid-cols-2" style={{ "--d": 3 } as React.CSSProperties}>
              {["Hotel distance stated in metres", "Written invoice before you pay", "Economy to 5-star, every price shown", `Office in ${site.contact.address.city}`].map((x) => (
                <li key={x} className="flex items-center gap-2.5">
                  <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0 text-gold-300" fill="currentColor" aria-hidden>
                    <path d="M12 0l2.6 6.3L21 3.5l-2.8 6.4L24 12l-5.8 2.1L21 20.5l-6.4-2.8L12 24l-2.6-6.3L3 20.5l2.8-6.4L0 12l5.8-2.1L3 3.5l6.4 2.8z" />
                  </svg>
                  {x}
                </li>
              ))}
            </ul>
            <div className="rise mt-9 flex flex-col gap-3 sm:flex-row" style={{ "--d": 4 } as React.CSSProperties}>
              <Link href="/umrah-packages/" className="btn btn-gold btn-lg">
                See all packages & prices
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <a href={whatsappLink("Assalam o Alaikum, I'd like to ask about Umrah packages.")} className="btn btn-ghost btn-lg" rel="nofollow">
                <WhatsAppIcon className="h-5 w-5 text-wa-400" />
                Ask on WhatsApp
              </a>
            </div>
          </div>

          <div className="rise relative mx-auto w-full max-w-[25rem] lg:max-w-[27rem]" style={{ "--d": 2 } as React.CSSProperties}>
            <div className="arch-frame">
              <div className="arch relative aspect-[4/5] w-full shadow-[0_50px_90px_-40px_rgb(0_0_0/0.9)]">
                <Image
                  src={images.kaabaTowers.src}
                  alt={images.kaabaTowers.alt}
                  fill
                  loading="eager"
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 27rem, 92vw"
                  className="ken-burns object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night-950/70 via-transparent to-night-950/10" />
              </div>
            </div>
            {popular && (
              <div className="glass animate-float absolute -left-3 top-[16%] rounded-2xl !bg-night-900/70 px-4 py-3 sm:-left-10">
                <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-gold-300">{TIERS[popular.tier].label} hotel, Makkah</p>
                <p className="figure text-[1.15rem] font-extrabold text-sand-50">{popular.hotels.makkah.distance}</p>
                <p className="text-[0.72rem] text-sand-200/80">from the Haram, stated in metres</p>
              </div>
            )}
            {popular && (
              <Link
                href={`/umrah-packages/${popular.slug}/`}
                className="glass-ivory group absolute -bottom-5 right-0 flex items-center gap-4 rounded-2xl px-5 py-4 transition hover:-translate-y-1 sm:-right-8"
              >
                <span>
                  <span className="block text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-gold-700">Most popular</span>
                  <span className="block font-display text-[1.3rem] font-semibold leading-tight text-ink-950">{popular.shortName}</span>
                </span>
                <span className="text-right">
                  <span className="block text-[0.68rem] text-ink-500">from</span>
                  <span className="figure block text-[1.15rem] font-extrabold text-haram-800">{formatPKR(popularPrice)}</span>
                </span>
              </Link>
            )}
          </div>
        </div>

        <div className="container-x relative pb-10">
          <HeroFinder packages={toFinderList(packages)} whatsapp={site.contact.whatsapp} />
        </div>

        <PriceTicker items={ticker} />
      </section>

      {/* ─── Choose by days ───────────────────────────────────────────────── */}
      <section className="container-x pt-24">
        <SectionHeading
          eyebrow="Choose by length"
          title="How many days do you have?"
          accent="days"
          intro="Every package includes the visa, return flights, hotels and transport. Pick a length to see the options."
        />
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {durations.map((c, i) => {
            const list = packages.filter(c.filter);
            const low = cheapest(list);
            const n = c.slug.split("-")[0];
            return (
              <li key={c.slug} className={`reveal ${i === durations.length - 1 ? "col-span-2 sm:col-span-1" : ""}`} style={{ "--i": i } as React.CSSProperties}>
                <Link
                  href={`/umrah-packages/${c.slug}/`}
                  className="spotlight group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-sand-300 bg-[#fffdf9] p-6 transition duration-500 ease-out-expo hover:-translate-y-1.5 hover:border-gold-400/70 hover:shadow-[0_30px_60px_-34px_rgb(20_17_13/0.45)]"
                >
                  <span
                    aria-hidden
                    className="arch absolute right-5 top-5 h-20 w-14 border border-gold-400/35 bg-gradient-to-b from-gold-100/60 to-transparent transition duration-700 ease-out-expo group-hover:h-24 group-hover:border-gold-400/70"
                  />
                  <span className="relative font-display text-[4.2rem] font-medium leading-[0.85] text-ink-950">{n}</span>
                  <span className="relative mt-1 text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-gold-700">days</span>
                  <span className="relative mt-6 text-[0.78rem] text-ink-500">from</span>
                  <span className="figure relative text-[1.05rem] font-extrabold text-ink-900">{low ? formatPKR(low.amount) : "On request"}</span>
                  <span className="link-arrow relative mt-4 text-sm">
                    View <ArrowRightIcon className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ─── Featured packages ────────────────────────────────────────────── */}
      <section className="container-x py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Umrah packages 2026-27"
            title="Popular Umrah packages"
            accent="Umrah"
            intro="Named hotel categories, real walking distances and the full price per person - before you ever message us."
          />
          <Link href="/umrah-packages/" className="btn btn-ghost reveal shrink-0">
            Compare all {packages.length} packages
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {featured.slice(0, 6).map((p, i) => (
            <PackageCard key={p.slug} p={p} index={i} />
          ))}
        </div>
      </section>

      {/* ─── Price table ──────────────────────────────────────────────────── */}
      <section className="section-ivory border-y border-sand-200">
        <div className="container-x py-24">
          <SectionHeading
            eyebrow="Prices at a glance"
            title="Umrah package prices from Pakistan"
            accent="prices"
            intro="Per person in PKR, including Umrah visa, return flights, hotels and transport. Confirmed in writing before you pay."
          />
          <div className="mt-10">
            <PriceTable list={tableList} caption={`Umrah package prices ${season.label}, per person`} />
          </div>
          <p className="reveal mt-5 text-sm text-ink-600">
            Seasonal packages:{" "}
            <Link href="/umrah-packages/december/" className="font-bold text-haram-800 underline decoration-gold-400 underline-offset-4">
              December 2026
            </Link>{" "}
            ·{" "}
            <Link href="/umrah-packages/ramadan/" className="font-bold text-haram-800 underline decoration-gold-400 underline-offset-4">
              Ramadan 2027
            </Link>{" "}
            · Visa only? See{" "}
            <Link href="/umrah-visa/" className="font-bold text-haram-800 underline decoration-gold-400 underline-offset-4">
              Umrah visa price
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ─── Hotel distance explorer ──────────────────────────────────────── */}
      <section className="section-night grain on-dark relative overflow-hidden">
        <StarPattern id="distance-lattice" className="text-gold-300 opacity-[0.035]" />
        <div className="container-x relative py-24 lg:py-28">
          <SectionHeading
            eyebrow="Choosing a hotel"
            title="The hotel decides your Umrah"
            accent="hotel"
            intro="You'll walk between your hotel and the Haram up to five times a day. That walk - not the star rating - is what to choose on."
          />
          <div className="mt-12">
            <DistanceExplorer tiers={tierDistances()} notes={TIER_NOTES} />
          </div>
          <p className="reveal mt-10 text-sm text-sand-200/60">
            Typical distances to Masjid al-Haram. Madinah hotels are usually closer at every level. Walking times assume an
            easy pace of about 4 km/h.
          </p>

          <div className="hairline my-24" />

          <SectionHeading
            eyebrow="The journey"
            title="From your city to the Haram"
            accent="the Haram"
            intro="Return flights from Lahore, Karachi and Islamabad to Jeddah or Madinah, then the Haramain train or a coach between the two holy cities. Choose where you fly from."
          />
          <div className="mt-12">
            <JourneyMap departures={departures} distances={routeDistances} groundNote={groundNote} checked={market.checked} />
          </div>
        </div>
      </section>

      {/* ─── Trust ────────────────────────────────────────────────────────── */}
      <section className="container-x py-24">
        <SectionHeading
          eyebrow="Why Muhammad Travels"
          title="Umrah booked the transparent way"
          accent="transparent"
          intro="Most complaints about Umrah agents come down to three things: a hotel further than promised, charges added at the end, and nobody answering the phone in Makkah. We built our packages around avoiding all three."
        />
        <div className="mt-12">
          <TrustPoints />
        </div>
      </section>

      {/* ─── The rites ────────────────────────────────────────────────────── */}
      <section className="section-night grain on-dark relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        <div className="container-x relative py-24 lg:py-28">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Before you go"
              title="Umrah in four steps"
              accent="four steps"
              intro="Umrah has four parts: enter ihram with the intention, perform tawaf around the Kaaba, walk sa'i between Safa and Marwah, then shave or trim your hair. Tap a step to see it."
            />
            <Link href="/guides/how-to-perform-umrah/" className="link-arrow reveal shrink-0">
              The full guide, with every dua <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-14">
            <RitesExperience copy={rites} />
          </div>
        </div>
      </section>

      {/* ─── Seasons ──────────────────────────────────────────────────────── */}
      <section className="container-x py-24">
        <SectionHeading
          eyebrow="Seasons"
          title="December and Ramadan Umrah"
          accent="Ramadan"
          intro="December holidays and Ramadan are the busiest and most expensive times to go, so book those early."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {[
            {
              href: "/umrah-packages/december/",
              eyebrow: "Winter holidays",
              title: "December Umrah 2026",
              body: "The family favourite: school holidays and the mildest weather of the year. Direct flights and walking-distance hotels go first - book by October.",
              img: images.nabawiWide,
              countdown: null as string | null,
            },
            {
              href: "/umrah-packages/ramadan/",
              eyebrow: `Expected ${season.ramadan.short}`,
              title: "Ramadan Umrah 2027",
              body: "Last ten nights or the full month. The most sought-after dates of the year - Ramadan bookings are open now.",
              img: images.kaabaNight,
              countdown: season.ramadan.startISO,
            },
          ].map((s, i) => (
            <Link
              key={s.href}
              href={s.href}
              className="reveal on-dark group relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-[28px] p-8 sm:p-10"
              style={{ "--i": i } as React.CSSProperties}
            >
              <Image src={s.img.src} alt="" fill sizes="(min-width: 768px) 46vw, 92vw" className="object-cover transition duration-[1.6s] ease-out-expo group-hover:scale-[1.06]" />
              <div className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/70 to-night-950/5" />
              <div className="absolute inset-3 rounded-[22px] border border-gold-300/25 transition duration-700 group-hover:inset-4 group-hover:border-gold-300/50" />
              <div className="relative">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="eyebrow">{s.eyebrow}</p>
                  {s.countdown && <DaysUntil iso={s.countdown} className="rounded-full bg-gold-300 px-2.5 py-0.5 text-[0.78rem] text-ink-950" />}
                </div>
                <h3 className="mt-3 text-[2.3rem] leading-none text-sand-50 sm:text-[3rem]">{s.title}</h3>
                <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-sand-100/90">{s.body}</p>
                <span className="link-arrow mt-5">
                  See packages <ArrowRightIcon className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────────────────────── */}
      <section className="section-ivory border-y border-sand-200">
        <div className="container-x py-24">
          <SectionHeading eyebrow="Booking" title="From enquiry to Makkah in four steps" accent="Makkah" />
          <div className="mt-14">
            <BookingSteps />
          </div>
        </div>
      </section>

      {/* ─── FAQ + form ───────────────────────────────────────────────────── */}
      <section className="container-x grid gap-14 py-24 lg:grid-cols-[1.4fr_1fr]">
        <Faq faqs={faqs} heading="Umrah from Pakistan: common questions" />
        <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
          <EnquiryForm whatsapp={site.contact.whatsapp} compact />
        </div>
      </section>

      {/* ─── Guides ───────────────────────────────────────────────────────── */}
      <section className="section-ivory border-t border-sand-200">
        <div className="container-x py-20">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Prepare" title="Before you go" />
            <Link href="/guides/" className="link-arrow reveal shrink-0">
              All guides <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { t: "How to perform Umrah", d: "Every step from ihram to halq, with the duas in Arabic and English.", href: "/guides/how-to-perform-umrah/", img: images.kaabaCourtyard },
              { t: "Umrah duas", d: "The talbiyah and the duas for tawaf, sa'i and entering the Haram.", href: "/guides/umrah-duas/", img: images.kaabaNight },
              { t: "Umrah cost from Pakistan", d: "What a complete Umrah really costs in 2026, line by line.", href: "/guides/umrah-cost-from-pakistan/", img: images.clockTower },
            ].map(({ t, d, href, img }, i) => (
              <li key={href} className="reveal" style={{ "--i": i } as React.CSSProperties}>
                <Link href={href} className="card card-hover group flex h-full flex-col overflow-hidden">
                  <span className="relative block aspect-[16/9] overflow-hidden">
                    <Image src={img.src} alt="" fill sizes="(min-width: 768px) 32vw, 92vw" className="object-cover transition duration-[1.4s] ease-out-expo group-hover:scale-[1.06]" />
                  </span>
                  <span className="flex flex-1 flex-col p-6">
                    <h3 className="text-[1.6rem] leading-tight transition group-hover:text-haram-800">{t}</h3>
                    <span className="mt-2 text-[0.95rem] text-ink-600">{d}</span>
                    <span className="link-arrow mt-auto pt-5 text-sm">
                      Read <ArrowRightIcon className="h-4 w-4" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Office ───────────────────────────────────────────────────────── */}
      <section className="container-x py-20">
        <div className="card reveal flex flex-col gap-6 overflow-hidden p-8 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-night-900 text-gold-300">
              <PinIcon className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-[2rem] leading-tight">Visit our {site.contact.address.city} office</h2>
              <p className="mt-1 text-ink-600">
                {fullAddress() || `${site.contact.address.city}, Pakistan`} · {site.contact.hoursSummary}
              </p>
            </div>
          </div>
          <Link href="/contact/" className="btn btn-primary shrink-0">
            Directions & contact
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <Ornament className="mx-auto mt-20 max-w-md" />
      </section>

      <CtaBand />
    </>
  );
}

function fromTierOrder(t: string): number {
  return ["economy", "3-star", "4-star", "5-star"].indexOf(t);
}
