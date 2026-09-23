import Link from "next/link";
import CtaBand from "../CtaBand";
import DistanceExplorer from "../DistanceExplorer";
import EnquiryForm from "../EnquiryForm";
import Faq from "../Faq";
import { ArrowRightIcon } from "../Icons";
import JourneyMap from "../JourneyMap";
import JsonLd from "../JsonLd";
import PackageCard from "../PackageCard";
import PageHero from "../PageHero";
import PriceTable from "../PriceTable";
import SeasonTimeline from "../SeasonTimeline";
import SectionHeading from "../SectionHeading";
import StarPattern from "../StarPattern";
import TrustPoints from "../TrustPoints";
import { CATEGORY_GROUP_LABEL, categories, type Category } from "@/lib/categories";
import { TIER_NOTES } from "@/lib/copy";
import { formatRange, parseDistance, tierDistances } from "@/lib/distance";
import { departures, groundNote, routeDistances } from "@/lib/journey";
import { market } from "@/lib/market";
import { TIERS, cheapest, fromPrice, packages, type Tier } from "@/lib/packages";
import { itemListSchema, webPageSchema } from "@/lib/schema";
import { season } from "@/lib/season";
import { formatPKR, site } from "@/lib/site";
import { fillTokens } from "@/lib/tokens";

export default function CategoryView({ category }: { category: Category }) {
  const list = packages.filter(category.filter).sort((a, b) => a.days - b.days || fromPrice(a).amount - fromPrice(b).amount);
  const t = (s: string) => fillTokens(s, list);
  const siblings = categories.filter((c) => c.group === category.group && c.slug !== category.slug);
  const others = categories.filter((c) => c.group !== category.group);
  const low = cheapest(list);
  const shortTitle = category.h1.replace(" from Pakistan", "");

  // At-a-glance facts, all computed from the packages on this page.
  const days = list.map((p) => p.days);
  const dist = list.map((p) => parseDistance(p.hotels.makkah.distance));
  const tiersHere = (["economy", "3-star", "4-star", "5-star"] as Tier[]).filter((x) => list.some((p) => p.tier === x));
  const facts = list.length
    ? [
        { label: "From, per person", value: low ? formatPKR(low.amount) : "On request" },
        { label: "Packages", value: String(list.length) },
        { label: "Length", value: Math.min(...days) === Math.max(...days) ? `${days[0]} days` : `${Math.min(...days)}-${Math.max(...days)} days` },
        {
          label: "Makkah hotel",
          value: formatRange({ min: Math.min(...dist.map((d) => d.min)), max: Math.max(...dist.map((d) => d.max)) }),
        },
        { label: "Hotels", value: tiersHere.length === 1 ? TIERS[tiersHere[0]].label : `${TIERS[tiersHere[0]].label} to ${TIERS[tiersHere[tiersHere.length - 1]].label}` },
      ]
    : [];

  const cityId = category.group === "city" ? (category.slug as "lahore" | "karachi" | "islamabad") : null;
  const tierId = category.group === "tier" ? (category.slug as Tier) : null;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            path: `/umrah-packages/${category.slug}/`,
            title: category.h1,
            description: t(category.description),
            dateModified: season.pricesCheckedISO,
            type: "CollectionPage",
            image: category.image,
          }),
          itemListSchema(category.h1, list),
        ]}
      />

      <PageHero
        crumbs={[
          { name: "Umrah Packages", path: "/umrah-packages/" },
          { name: shortTitle, path: `/umrah-packages/${category.slug}/` },
        ]}
        eyebrow={category.eyebrow}
        title={category.h1}
        lead={category.intro.map((p) => (
          <p key={p}>{t(p)}</p>
        ))}
        image={category.image}
      >
        <div className="flex flex-wrap gap-3">
          <a href="#packages" className="btn btn-gold btn-lg">
            See {list.length} package{list.length === 1 ? "" : "s"}
            <ArrowRightIcon className="h-5 w-5" />
          </a>
          <a href="#quote" className="btn btn-ghost btn-lg">
            Get a quote
          </a>
        </div>
      </PageHero>

      {facts.length > 0 && (
        <div className="container-x relative z-10 -mt-10">
          <dl className="glass-ivory grid grid-cols-2 gap-px overflow-hidden rounded-[24px] sm:grid-cols-3 lg:grid-cols-5">
            {facts.map((f) => (
              <div key={f.label} className="bg-[#fffdf9]/60 px-5 py-4 sm:px-6">
                <dt className="text-[0.66rem] font-extrabold uppercase tracking-[0.16em] text-gold-700">{f.label}</dt>
                <dd className="figure mt-1 text-[1.15rem] font-extrabold text-ink-950">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <section id="packages" className="container-x scroll-mt-28 pt-16 pb-20">
        {list.length > 0 ? (
          <>
            <div className="reveal flex items-baseline gap-4">
              <h2 className="text-[2.3rem] leading-none">
                {list.length} package{list.length === 1 ? "" : "s"}, every price shown
              </h2>
              <span className="hidden h-px flex-1 bg-gradient-to-r from-gold-400/60 to-transparent sm:block" />
            </div>
            <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p, i) => (
                <PackageCard key={p.slug} p={p} priority={i < 3} index={i} />
              ))}
            </div>
            <div className="mt-20">
              <SectionHeading
                eyebrow={`Prices checked ${season.pricesChecked}`}
                title="Price comparison"
                intro="Per person, in PKR, including Umrah visa, return flights, hotels and transport. Prices move with airfares and hotel rates; we confirm yours in writing before you pay."
              />
              <div className="mt-8">
                <PriceTable list={list} caption={`${category.h1} - prices per person`} />
              </div>
            </div>
          </>
        ) : (
          <div className="card p-10 text-center">
            <h2 className="text-3xl">Packages for this category are being finalised</h2>
            <p className="mt-2 text-ink-600">Message us on WhatsApp and we&apos;ll quote you directly.</p>
          </div>
        )}
      </section>

      {category.sections.length > 0 && (
        <section className="section-ivory border-y border-sand-200">
          <div className="container-x grid gap-6 py-20 lg:grid-cols-2">
            {category.sections.map((s, i) => (
              <article key={s.heading} className="card reveal relative overflow-hidden p-8 sm:p-10" style={{ "--i": i } as React.CSSProperties}>
                <span aria-hidden className="absolute right-6 top-6 font-display text-[4rem] italic leading-none text-gold-400/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="max-w-md text-[2.1rem] leading-tight">{s.heading}</h2>
                <div className="mt-5 space-y-4 text-[1.03rem] leading-relaxed text-ink-700">
                  {s.body.map((b) => (
                    <p key={b}>{t(b)}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {cityId && (
        <section className="section-night grain on-dark relative overflow-hidden">
          <StarPattern id="cat-journey-lattice" className="text-gold-300 opacity-[0.035]" />
          <div className="container-x relative py-24">
            <SectionHeading
              eyebrow="The journey"
              title={`From ${cityId === "lahore" ? "Lahore" : cityId === "karachi" ? "Karachi" : "Islamabad"} to the Haram`}
              accent="the Haram"
              intro="Your flight, the distance and the typical fare, with the Haramain train or a coach between Makkah and Madinah."
            />
            <div className="mt-12">
              <JourneyMap departures={departures} initial={cityId} distances={routeDistances} groundNote={groundNote} checked={market.checked} />
            </div>
          </div>
        </section>
      )}

      {category.group === "season" && (
        <section className="container-x pt-20">
          <SeasonTimeline />
        </section>
      )}

      {tierId && (
        <section className="section-night grain on-dark relative overflow-hidden">
          <StarPattern id="cat-distance-lattice" className="text-gold-300 opacity-[0.035]" />
          <div className="container-x relative py-24">
            <SectionHeading
              eyebrow="Choosing a hotel"
              title="How far is the walk?"
              accent="walk"
              intro="You'll walk between your hotel and the Haram up to five times a day. Compare this hotel category with the others."
            />
            <div className="mt-12">
              <DistanceExplorer tiers={tierDistances()} notes={TIER_NOTES} initial={tierId} />
            </div>
          </div>
        </section>
      )}

      <section className="container-x py-20">
        <TrustPoints />
      </section>

      <section className="container-x grid gap-14 pb-20 lg:grid-cols-[1.4fr_1fr]">
        <Faq faqs={category.faqs.map((f) => ({ q: f.q, a: t(f.a) }))} />
        <div id="quote" className="scroll-mt-28 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
          <EnquiryForm whatsapp={site.contact.whatsapp} packageName={shortTitle} compact />
        </div>
      </section>

      <section className="section-ivory border-t border-sand-200">
        <div className="container-x grid gap-10 py-16 md:grid-cols-2">
          <div>
            <p className="eyebrow">{CATEGORY_GROUP_LABEL[category.group]}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {siblings.map((c) => (
                <li key={c.slug}>
                  <Link href={`/umrah-packages/${c.slug}/`} className="chip hover:border-haram-600 hover:text-haram-800">
                    {c.h1.replace(" from Pakistan", "")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">More ways to choose</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {others.map((c) => (
                <li key={c.slug}>
                  <Link href={`/umrah-packages/${c.slug}/`} className="chip hover:border-haram-600 hover:text-haram-800">
                    {c.h1.replace(" from Pakistan", "")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
