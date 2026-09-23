import Image from "next/image";
import Link from "next/link";
import BookingSteps from "@/components/BookingSteps";
import CtaBand from "@/components/CtaBand";
import EnquiryForm from "@/components/EnquiryForm";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import PackageCard from "@/components/PackageCard";
import PriceTable from "@/components/PriceTable";
import SectionHeading from "@/components/SectionHeading";
import StarPattern from "@/components/StarPattern";
import TrustPoints from "@/components/TrustPoints";
import { ArrowRightIcon, CheckIcon, PinIcon, WhatsAppIcon } from "@/components/Icons";
import { categories } from "@/lib/categories";
import { images } from "@/lib/images";
import { ROOM_BASIS, cheapest, packages } from "@/lib/packages";
import { itemListSchema } from "@/lib/schema";
import { season } from "@/lib/season";
import { formatPKR, fullAddress, site, whatsappLink } from "@/lib/site";

export default function HomePage() {
  const featured = packages.filter((p) => p.featured);
  const overall = cheapest(packages)!;
  const durations = categories.filter((c) => c.group === "duration");
  const tableList = packages
    .filter((p) => !p.season && [7, 15, 21, 28].includes(p.days))
    .sort((a, b) => a.days - b.days || fromTierOrder(a.tier) - fromTierOrder(b.tier));

  const faqs = [
    {
      q: "How much does an Umrah package cost from Pakistan in 2026?",
      a: `Our complete packages start from ${formatPKR(overall.amount)} per person (${ROOM_BASIS[overall.basis].label.toLowerCase()} room), including the Umrah visa, return flights, hotels in Makkah and Madinah, and transport. A 15 day 3-star package — the most popular choice — is higher, and 5-star and Ramadan packages cost the most. See the price table above for every package.`,
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
      <JsonLd data={itemListSchema("Umrah packages from Pakistan", featured)} />

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-sand-200 bg-gradient-to-b from-sand-100 to-sand-50">
        <div className="container-x grid gap-10 pb-14 pt-10 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-14 lg:pb-20 lg:pt-16">
          <div>
            <p className="arabic text-[1.55rem] text-gold-700" lang="ar">
              لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ
            </p>
            <h1 className="mt-2 text-[2.6rem] leading-[1.04] sm:text-6xl lg:text-[4.1rem]">
              Umrah Packages from Pakistan <span className="text-haram-700">{season.label}</span>
            </h1>
            <p className="mt-6 max-w-xl text-[1.1rem] leading-relaxed text-ink-700">
              Visa, return flights, hotels near the Haram and transport — in one per-person price, in rupees. 7 to 28
              day packages from Lahore, Karachi and Islamabad, from <strong className="text-ink-950">{formatPKR(overall.amount)}</strong>.
            </p>
            <ul className="mt-6 grid gap-2 text-[0.98rem] text-ink-800 sm:grid-cols-2">
              {[
                "Hotel distance stated in metres",
                "Written invoice before you pay",
                "Economy to 5-star, every price shown",
                `Office in ${site.contact.address.city}`,
              ].map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <CheckIcon className="h-5 w-5 shrink-0 text-haram-700" />
                  {x}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/umrah-packages/" className="btn btn-primary !min-h-[3.2rem] !px-7 text-base">
                See all packages & prices
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <a
                href={whatsappLink("Assalam o Alaikum, I'd like to ask about Umrah packages.")}
                className="btn btn-wa !min-h-[3.2rem] !px-7 text-base"
                rel="nofollow"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Ask on WhatsApp
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="arch relative aspect-[4/5] w-full shadow-[0_30px_60px_-30px_rgb(6_36_31/0.55)]">
              <Image
                src={images.kaabaTowers.src}
                alt={images.kaabaTowers.alt}
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 92vw"
                className="object-cover"
              />
            </div>
            <div className="card absolute -bottom-6 left-3 right-3 flex items-center justify-between gap-3 px-5 py-4 sm:left-auto sm:right-[-0.5rem] sm:w-72">
              <div>
                <p className="text-[0.7rem] font-bold uppercase tracking-wider text-ink-500">Most popular</p>
                <p className="font-display text-lg font-semibold leading-tight">15 Days 3-Star</p>
              </div>
              <Link href="/umrah-packages/15-days-3-star/" className="text-right">
                <span className="block text-[0.7rem] text-ink-500">from</span>
                <span className="font-display text-xl font-semibold text-haram-800">
                  {formatPKR(packages.find((p) => p.slug === "15-days-3-star")?.prices.quad ?? overall.amount)}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Choose by days ───────────────────────────────────────────────── */}
      <section className="container-x pt-20">
        <SectionHeading
          eyebrow="Choose by length"
          title="How many days do you have?"
          intro="Every package includes the visa, return flights, hotels and transport. Pick a length to see the options."
        />
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {durations.map((c) => {
            const list = packages.filter(c.filter);
            const low = cheapest(list);
            return (
              <li key={c.slug}>
                <Link
                  href={`/umrah-packages/${c.slug}/`}
                  className="group flex h-full flex-col rounded-2xl border border-sand-300 bg-white/70 p-5 transition hover:border-haram-600 hover:bg-white"
                >
                  <span className="font-display text-4xl font-semibold text-ink-950">{c.slug.split("-")[0]}</span>
                  <span className="text-sm font-semibold uppercase tracking-wider text-gold-700">days</span>
                  <span className="mt-4 text-[0.8rem] text-ink-500">from</span>
                  <span className="font-semibold text-ink-900">{low ? formatPKR(low.amount) : "On request"}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-haram-800">
                    View <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ─── Featured packages ────────────────────────────────────────────── */}
      <section className="container-x py-20">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Umrah packages 2026–27"
            title="Popular Umrah packages"
            intro="Named hotel categories, real walking distances and the full price per person — before you ever message us."
          />
          <Link href="/umrah-packages/" className="btn btn-ghost shrink-0">
            Compare all {packages.length} packages
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.slice(0, 6).map((p, i) => (
            <PackageCard key={p.slug} p={p} priority={i < 2} />
          ))}
        </div>
      </section>

      {/* ─── Price table ──────────────────────────────────────────────────── */}
      <section className="border-y border-sand-200 bg-white/50">
        <div className="container-x py-20">
          <SectionHeading
            eyebrow="Prices at a glance"
            title="Umrah package prices from Pakistan"
            intro="Per person in PKR, including Umrah visa, return flights, hotels and transport. Confirmed in writing before you pay."
          />
          <div className="mt-8">
            <PriceTable list={tableList} caption={`Umrah package prices ${season.label}, per person`} />
          </div>
          <p className="mt-4 text-sm text-ink-500">
            Seasonal packages: <Link href="/umrah-packages/december/" className="font-semibold text-haram-800 underline">December 2026</Link> ·{" "}
            <Link href="/umrah-packages/ramadan/" className="font-semibold text-haram-800 underline">Ramadan 2027</Link> ·
            Visa only? See <Link href="/umrah-visa/" className="font-semibold text-haram-800 underline">Umrah visa price</Link>.
          </p>
        </div>
      </section>

      {/* ─── Trust ────────────────────────────────────────────────────────── */}
      <section className="container-x py-20">
        <SectionHeading
          eyebrow="Why Muhammad Travels"
          title="Umrah booked the transparent way"
          intro="Most complaints about Umrah agents come down to three things: a hotel further than promised, charges added at the end, and nobody answering the phone in Makkah. We built our packages around avoiding all three."
        />
        <div className="mt-10">
          <TrustPoints />
        </div>
      </section>

      {/* ─── Seasons ──────────────────────────────────────────────────────── */}
      <section className="on-dark relative overflow-hidden bg-haram-900 text-sand-100">
        <StarPattern id="season-lattice" className="text-gold-300 opacity-[0.07]" />
        <div className="container-x relative grid gap-6 py-20 md:grid-cols-2">
          {[
            {
              href: "/umrah-packages/december/",
              eyebrow: "Winter holidays",
              title: "December Umrah 2026",
              body: "The family favourite: school holidays and the mildest weather of the year. Direct flights and walking-distance hotels go first — book by October.",
              img: images.nabawiWide,
            },
            {
              href: "/umrah-packages/ramadan/",
              eyebrow: `Expected ${season.ramadan.short}`,
              title: "Ramadan Umrah 2027",
              body: "Last ten nights or the full month. The most sought-after dates of the year — Ramadan bookings are open now.",
              img: images.kaabaNight,
            },
          ].map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group relative flex min-h-[20rem] flex-col justify-end overflow-hidden rounded-[var(--radius-card)] p-7"
            >
              <Image src={s.img.src} alt="" fill sizes="(min-width: 768px) 45vw, 92vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-t from-haram-950 via-haram-950/70 to-haram-950/10" />
              <div className="relative">
                <p className="eyebrow">{s.eyebrow}</p>
                <h2 className="mt-2 text-3xl text-sand-50 sm:text-4xl">{s.title}</h2>
                <p className="mt-3 max-w-md text-[0.98rem] leading-relaxed text-sand-100/90">{s.body}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 font-bold text-gold-300">
                  See packages <ArrowRightIcon className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────────────────────── */}
      <section className="container-x py-20">
        <SectionHeading eyebrow="Booking" title="From enquiry to Makkah in four steps" />
        <div className="mt-10">
          <BookingSteps />
        </div>
      </section>

      {/* ─── Hotel tiers explainer ────────────────────────────────────────── */}
      <section className="border-y border-sand-200 bg-sand-100/60">
        <div className="container-x grid gap-12 py-20 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div className="arch relative mx-auto aspect-[4/5] w-full max-w-sm">
            <Image src={images.clockTower.src} alt={images.clockTower.alt} fill sizes="(min-width: 1024px) 30vw, 80vw" className="object-cover" />
          </div>
          <div>
            <SectionHeading
              eyebrow="Choosing a hotel"
              title="The hotel decides your Umrah"
              intro="You'll walk between your hotel and the Haram up to five times a day. That walk — not the star rating — is what to choose on."
            />
            <dl className="mt-8 divide-y divide-sand-300 border-y border-sand-300">
              {[
                ["Economy", "1.1 – 1.3 km + shuttle", "Lowest price; best for fit, younger pilgrims.", "/umrah-packages/economy/"],
                ["3-Star", "450 – 700 m", "Walking distance; what most families choose.", "/umrah-packages/3-star/"],
                ["4-Star", "150 – 400 m", "Short walk and breakfast; best with elderly parents.", "/umrah-packages/4-star/"],
                ["5-Star", "0 – 100 m", "Clock Tower and front-row hotels; step into the courtyard.", "/umrah-packages/5-star/"],
              ].map(([tier, dist, note, href]) => (
                <div key={tier} className="grid grid-cols-[6rem_1fr] gap-4 py-4 sm:grid-cols-[7rem_10rem_1fr]">
                  <dt className="font-display text-xl font-semibold">
                    <Link href={href} className="hover:text-haram-700 hover:underline">
                      {tier}
                    </Link>
                  </dt>
                  <dd className="font-semibold text-haram-800">{dist}</dd>
                  <dd className="col-span-2 text-[0.95rem] text-ink-600 sm:col-span-1">{note}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-sm text-ink-500">Typical distances to Masjid al-Haram. Madinah hotels are usually closer at every level.</p>
          </div>
        </div>
      </section>

      {/* ─── FAQ + form ───────────────────────────────────────────────────── */}
      <section className="container-x grid gap-12 py-20 lg:grid-cols-[1.4fr_1fr]">
        <Faq faqs={faqs} heading="Umrah from Pakistan: common questions" />
        <div className="lg:sticky lg:top-24 lg:self-start">
          <EnquiryForm whatsapp={site.contact.whatsapp} compact />
        </div>
      </section>

      {/* ─── Guides ───────────────────────────────────────────────────────── */}
      <section className="border-t border-sand-200 bg-white/50">
        <div className="container-x py-16">
          <SectionHeading eyebrow="Prepare" title="Before you go" />
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["How to perform Umrah", "Every step from ihram to halq, with the duas in Arabic and English.", "/guides/how-to-perform-umrah/"],
              ["Umrah duas", "The talbiyah and the duas for tawaf, sa'i and entering the Haram.", "/guides/umrah-duas/"],
              ["Umrah cost from Pakistan", "What a complete Umrah really costs in 2026, line by line.", "/guides/umrah-cost-from-pakistan/"],
            ].map(([t, d, href]) => (
              <li key={href}>
                <Link href={href} className="group block h-full rounded-2xl border border-sand-300 bg-sand-50 p-6 hover:border-haram-600">
                  <h3 className="text-xl group-hover:text-haram-800">{t}</h3>
                  <p className="mt-2 text-[0.95rem] text-ink-600">{d}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-haram-800">
                    Read <ArrowRightIcon className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Office ───────────────────────────────────────────────────────── */}
      <section className="container-x py-16">
        <div className="card flex flex-col gap-6 p-7 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-haram-50 text-haram-800">
              <PinIcon className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-2xl">Visit our {site.contact.address.city} office</h2>
              <p className="mt-1 text-ink-600">
                {fullAddress() || `${site.contact.address.city}, Pakistan`} · {site.contact.hoursSummary}
              </p>
            </div>
          </div>
          <Link href="/contact/" className="btn btn-primary shrink-0">
            Directions & contact
          </Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

function fromTierOrder(t: string): number {
  return ["economy", "3-star", "4-star", "5-star"].indexOf(t);
}
