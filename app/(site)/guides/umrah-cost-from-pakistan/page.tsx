import Link from "next/link";
import CostCalculator from "@/components/CostCalculator";
import CostRangeChart from "@/components/CostRangeChart";
import Faq from "@/components/Faq";
import GuideLayout from "@/components/GuideLayout";
import PriceTable from "@/components/PriceTable";
import StarPattern from "@/components/StarPattern";
import { CalendarIcon, ClockIcon, HotelIcon, PlaneIcon, ShieldIcon, UsersIcon } from "@/components/Icons";
import { Callout, Chapter, Prose } from "@/components/guides/Article";
import { AskArt, CalculatorArt, RangeArt, SlidersArt, StarArt, TagArt } from "@/components/guides/GuideArt";
import { HeroCard } from "@/components/guides/GuideHeroArt";
import { market, pkrRange } from "@/lib/market";
import { pageMetadata } from "@/lib/metadata";
import { toFinderList } from "@/lib/finder";
import { cheapest, fromPrice, packages } from "@/lib/packages";
import { season } from "@/lib/season";
import { formatPKR, site } from "@/lib/site";

const path = "/guides/umrah-cost-from-pakistan/";
const title = `Umrah Cost from Pakistan in 2026: Full Breakdown`;
const description =
  "How much Umrah costs from Pakistan in 2026: prices by length and hotel, what the visa, flights and hotels cost, and hidden charges to ask about.";

export const metadata = pageMetadata({ title, description, path, image: "kaabaWide" });

export default function UmrahCostGuide() {
  const low = cheapest(packages)!;
  const std = packages.filter((p) => !p.season);
  const fifteen3 = packages.find((p) => p.slug === "15-days-3-star");
  const fiveStar = packages.filter((p) => p.tier === "5-star").map((p) => fromPrice(p).amount);
  const ramadan = packages.filter((p) => p.season === "ramadan").map((p) => fromPrice(p).amount);
  const v = market.visa;
  const upper = fifteen3 ? formatPKR(fifteen3.prices.double!) : "PKR 420,000";

  const faqs = [
    {
      q: "What is the minimum cost of Umrah from Pakistan?",
      a: `A complete package with visa, return flights, hotels and transport starts from about ${formatPKR(low.amount)} per person with us (7 days, economy, ${low.basis} room). Offers far below the market usually leave out flights, the visa or transport.`,
    },
    {
      q: "How much is Umrah for a family of four?",
      a: fifteen3
        ? `For a 15 day 3-star package in a quad room, four adults pay ${formatPKR(fifteen3.prices.quad! * 4)} in total (${formatPKR(fifteen3.prices.quad!)} each). Children are priced by age.`
        : "Multiply the per-person quad price by four; children are priced by age.",
    },
    {
      q: "Is Umrah cheaper from Karachi?",
      a: `Usually, yes: the same package from Karachi typically costs ${pkrRange(market.karachiSaving.min, market.karachiSaving.max)} less than from Lahore or Islamabad, because the flight is shorter and fares are lower.`,
    },
    {
      q: "How much extra money should I take?",
      a: "Meals are not included in most packages, so budget for food, a local SIM, laundry, extra transport and gifts. Many pilgrims carry a few hundred Saudi riyals in cash and use a card for the rest.",
    },
  ];

  /* What moves the price: each factor as a card. The words are the article's own. */
  const drivers = [
    {
      icon: HotelIcon,
      title: "Hotel distance from the Haram.",
      body: (
        <>
          The jump from economy (1 km+, often a shuttle) to a Clock Tower hotel can double the price. See{" "}
          <Link href="/umrah-packages/economy/">economy</Link> vs <Link href="/umrah-packages/5-star/">5-star packages</Link>.
        </>
      ),
    },
    {
      icon: UsersIcon,
      title: "People per room.",
      body: <>Sharing (5-6) is cheapest, then quad, triple and double. A double room costs roughly 20% more per person than quad.</>,
    },
    {
      icon: CalendarIcon,
      title: "Season.",
      body: <>December holidays and Ramadan push flights and hotels up; the months after the season reopens following Hajj are usually cheapest.</>,
    },
    {
      icon: ClockIcon,
      title: "Length.",
      body: (
        <>
          The visa and flights cost the same for 7 or 28 days, so longer trips cost much less per day - compare{" "}
          <Link href="/umrah-packages/15-days/">15 days</Link> and <Link href="/umrah-packages/21-days/">21 days</Link>.
        </>
      ),
    },
    {
      icon: PlaneIcon,
      title: "Departure city.",
      body: <>Karachi is usually {pkrRange(market.karachiSaving.min, market.karachiSaving.max)} cheaper than Lahore or Islamabad.</>,
    },
  ];

  /* The questions to ask any agent. */
  const questions = [
    {
      q: "Are flights included?",
      a: (
        <>
          Many &ldquo;Umrah packages from Pakistan&rdquo; are land-only; the flight can add <span className="figure">{pkrRange(market.airfare[0].min, market.airfare[2].max)}</span>.
        </>
      ),
    },
    { q: "What is the price basis?", a: <>&ldquo;Sharing&rdquo; is 5-6 to a room. Compare quad with quad.</> },
    { q: "How far is the hotel, in metres?", a: <>Some agents sell a 1.6 km shuttle hotel as 5-star.</> },
    { q: "Is transport both ways?", a: <>Some packages include only one-way transfers.</> },
    { q: "Are there service charges or “processing fees” on top?", a: <>Ask for a written invoice showing the total.</> },
  ];

  return (
    <GuideLayout
      title={title}
      lead={`A complete Umrah from Pakistan - visa, return flights, hotels and transport - costs from about ${formatPKR(low.amount)} per person with us in ${season.pricesChecked}. Here is what each part costs, what changes the price, and the charges to ask about before you pay.`}
      path={path}
      image="kaabaWide"
      toc={[
        { id: "answer", label: "The short answer" },
        { id: "prices", label: "Package prices" },
        { id: "breakdown", label: "Cost breakdown" },
        { id: "drivers", label: "What changes the price" },
        { id: "hidden", label: "Hidden costs" },
        { id: "calculator", label: "Calculator" },
        { id: "faq", label: "Questions" },
      ]}
      published="2026-09-23"
      updated={season.pricesCheckedISO}
      description={description}
      heroCard={<HeroCard label="From, per person" value={formatPKR(low.amount)} sub="Visa, return flights, hotels and transport" />}
    >
      {/* ─── The short answer ─────────────────────────────────────────────── */}
      <Chapter id="answer" title="The short answer" eyebrow="The answer first" art={StarArt} first>
        <p className="reveal max-w-[44rem] border-l-2 border-gold-500 pl-5 text-[1.15rem] leading-[1.75] text-ink-800 sm:pl-7 sm:text-[1.25rem]">
          <strong className="font-bold text-ink-950">
            In {season.pricesChecked}, a complete Umrah from Pakistan costs about {formatPKR(low.amount)} to {upper} per person
          </strong>{" "}
          for 7 to 15 days in economy or 3-star hotels, including the visa, return flights, hotels and transport. 5-star packages start around{" "}
          {formatPKR(Math.min(...fiveStar))}, and Ramadan packages from {formatPKR(Math.min(...ramadan))}. Prices are per person and depend on how
          many share a room.
        </p>
        <div className="section-night grain on-dark reveal relative overflow-hidden rounded-[28px]">
          <StarPattern id="cost-answer-lattice" className="text-gold-300 opacity-[0.04]" />
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-gold-400/15 blur-3xl" />
          <dl className="relative grid divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="p-6 sm:p-7">
              <dt className="text-[0.66rem] font-extrabold uppercase leading-relaxed tracking-[0.18em] text-gold-300 sm:min-h-[2.4rem]">
                7 to 15 days, economy or <span className="whitespace-nowrap">3-star</span>
              </dt>
              <dd className="figure mt-3 text-[1.9rem] font-extrabold leading-none text-sand-50 xl:text-[2.1rem]">{formatPKR(low.amount)}</dd>
              <dd className="figure mt-2 text-[0.9rem] text-sand-200/80">to {upper}</dd>
            </div>
            <div className="p-6 sm:p-7">
              <dt className="text-[0.66rem] font-extrabold uppercase leading-relaxed tracking-[0.18em] text-gold-300 sm:min-h-[2.4rem]">5-star packages start around</dt>
              <dd className="figure mt-3 text-[1.9rem] font-extrabold leading-none text-sand-50 xl:text-[2.1rem]">{formatPKR(Math.min(...fiveStar))}</dd>
            </div>
            <div className="p-6 sm:p-7">
              <dt className="text-[0.66rem] font-extrabold uppercase leading-relaxed tracking-[0.18em] text-gold-300 sm:min-h-[2.4rem]">Ramadan packages from</dt>
              <dd className="figure mt-3 text-[1.9rem] font-extrabold leading-none text-sand-50 xl:text-[2.1rem]">{formatPKR(Math.min(...ramadan))}</dd>
            </div>
          </dl>
          <p className="relative border-t border-white/10 px-6 py-4 text-[0.8rem] text-sand-200/70 sm:px-7">
            Per person · visa, return flights, hotels and transport included · prices checked {season.pricesChecked}
          </p>
        </div>
      </Chapter>

      {/* ─── Package prices ───────────────────────────────────────────────── */}
      <Chapter id="prices" title={`Our package prices (${season.pricesChecked})`} eyebrow="Our prices" art={TagArt}>
        <Prose>
          <p>Every price below includes the Umrah visa, return flights from Pakistan, hotels and transport.</p>
        </Prose>
        <div className="not-prose">
          <PriceTable list={std} caption="Umrah package prices per person, PKR" />
        </div>
      </Chapter>

      {/* ─── Where the money goes ─────────────────────────────────────────── */}
      <Chapter id="breakdown" title="Where the money goes" eyebrow="Market figures" art={RangeArt}>
        <Prose>
          <p>
            These are typical market figures across Pakistani agencies, checked {market.checked}. They show why packages cost what they do.
          </p>
        </Prose>
        <CostRangeChart
          checked={market.checked}
          groups={[
            {
              title: "Visa and flights",
              rows: [
                { label: "Umrah visa + insurance", min: v.min, max: v.max },
                ...market.airfare.map((a) => ({ label: `Return flight, ${a.city}`, min: a.min, max: a.max })),
              ],
            },
            {
              title: "15 days of hotels, visa and transport (no flights)",
              rows: (["economy", "3-star", "4-star", "5-star"] as const).map((t) => {
                const [min, median, max] = market.landOnly15[t];
                return { label: t === "economy" ? "Economy" : t.replace("-star", "-Star"), min, median, max };
              }),
            },
          ]}
        />
        <div className="card reveal overflow-hidden">
          <table className="w-full border-collapse text-left text-[0.95rem]">
            <thead className="max-md:sr-only">
              <tr className="text-[0.7rem] uppercase tracking-[0.14em] text-gold-700">
                <th scope="col" className="w-[30%] border-b border-sand-200 bg-sand-100 px-5 py-3.5 font-extrabold sm:px-6">
                  Cost
                </th>
                <th scope="col" className="w-[30%] border-b border-sand-200 bg-sand-100 px-4 py-3.5 font-extrabold">
                  Typical price per person
                </th>
                <th scope="col" className="border-b border-sand-200 bg-sand-100 px-4 py-3.5 font-extrabold sm:pr-6">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="[&>tr:last-child>td]:border-b-0 [&>tr:last-child]:border-b-0">
              <tr className="align-top transition-colors hover:bg-sand-100/60 max-md:block max-md:border-b max-md:border-sand-200 max-md:px-5 max-md:py-4">
                <td className="font-semibold text-ink-950 max-md:block md:border-b md:border-sand-200 md:px-6 md:py-4">Umrah visa + insurance</td>
                <td className="figure font-bold text-haram-800 max-md:mt-1 max-md:block md:border-b md:border-sand-200 md:px-4 md:py-4">{pkrRange(v.min, v.max)}</td>
                <td className="text-[0.9rem] leading-relaxed text-ink-600 max-md:mt-1.5 max-md:block md:border-b md:border-sand-200 md:px-4 md:py-4 md:pr-6">
                  Includes the Saudi visa fee and the mandatory health insurance.
                </td>
              </tr>
              {market.airfare.map((a) => (
                <tr key={a.code} className="align-top transition-colors hover:bg-sand-100/60 max-md:block max-md:border-b max-md:border-sand-200 max-md:px-5 max-md:py-4">
                  <td className="font-semibold text-ink-950 max-md:block md:border-b md:border-sand-200 md:px-6 md:py-4">Return flight, {a.city}-Jeddah</td>
                  <td className="figure font-bold text-haram-800 max-md:mt-1 max-md:block md:border-b md:border-sand-200 md:px-4 md:py-4">{pkrRange(a.min, a.max)}</td>
                  <td className="text-[0.9rem] leading-relaxed text-ink-600 max-md:mt-1.5 max-md:block md:border-b md:border-sand-200 md:px-4 md:py-4 md:pr-6">
                    Economy, outside peak weeks. December and Ramadan are often {market.peakAirfareUplift} higher.
                  </td>
                </tr>
              ))}
              <tr className="align-top transition-colors hover:bg-sand-100/60 max-md:block max-md:px-5 max-md:py-4">
                <td className="font-semibold text-ink-950 max-md:block md:border-b md:border-sand-200 md:px-6 md:py-4">Hotels + visa + transport, 15 days (no flights)</td>
                <td className="figure font-bold leading-relaxed text-haram-800 max-md:mt-1 max-md:block md:border-b md:border-sand-200 md:px-4 md:py-4">
                  Economy {formatPKR(market.landOnly15.economy[0])}+ · 3-star ~{formatPKR(market.landOnly15["3-star"][1])} · 4-star ~
                  {formatPKR(market.landOnly15["4-star"][1])} · 5-star ~{formatPKR(market.landOnly15["5-star"][1])}
                </td>
                <td className="text-[0.9rem] leading-relaxed text-ink-600 max-md:mt-1.5 max-md:block md:border-b md:border-sand-200 md:px-4 md:py-4 md:pr-6">
                  Mostly quad basis. Hotel distance is the biggest single driver of price.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Chapter>

      {/* ─── What changes the price ───────────────────────────────────────── */}
      <Chapter id="drivers" title="What changes the price" eyebrow="Five factors" art={SlidersArt}>
        <ol className="grid gap-4 sm:grid-cols-2">
          {drivers.map((d, i) => (
            <li
              key={d.title}
              className={`card card-hover spotlight reveal flex flex-col p-6 sm:p-7 ${i === drivers.length - 1 ? "sm:col-span-2" : ""}`}
              style={{ "--i": i % 2 } as React.CSSProperties}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="relative flex h-14 w-14 items-center justify-center">
                  <svg viewBox="0 0 56 56" className="absolute inset-0 h-full w-full text-gold-400" aria-hidden>
                    <g fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="10" y="10" width="36" height="36" />
                      <rect x="10" y="10" width="36" height="36" transform="rotate(45 28 28)" />
                    </g>
                  </svg>
                  <d.icon className="relative h-5 w-5 text-haram-800" />
                </span>
                <span aria-hidden className="font-display text-[2.6rem] font-medium italic leading-none text-gold-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-5 text-[0.98rem] leading-relaxed text-ink-700 [&_a]:font-semibold [&_a]:text-haram-800 [&_a]:underline [&_a]:decoration-gold-400 [&_a]:underline-offset-4 [&_a:hover]:text-haram-950">
                <strong className="block font-display text-[1.55rem] font-semibold leading-tight text-ink-950">{d.title}</strong>{" "}
                <span className="mt-2 block">{d.body}</span>
              </p>
            </li>
          ))}
        </ol>
      </Chapter>

      {/* ─── Hidden costs ─────────────────────────────────────────────────── */}
      <Chapter id="hidden" title="Hidden costs to ask about before paying anyone" eyebrow="Before you pay" art={AskArt}>
        <ul className="reveal divide-y divide-sand-200 overflow-hidden rounded-[24px] border border-gold-400/40 bg-[#fffdf9] shadow-[0_28px_50px_-42px_rgb(20_17_13/0.55)]">
          {questions.map((x, i) => (
            <li key={x.q} className="flex gap-4 px-5 py-5 transition-colors hover:bg-sand-100/50 sm:gap-5 sm:px-7">
              <span
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-400/60 bg-[linear-gradient(160deg,#fbf3df,#fffdf9)] font-display text-[1.35rem] font-semibold text-gold-700"
              >
                ?
              </span>
              <p className="min-w-0 text-[0.98rem] leading-relaxed text-ink-700">
                <span aria-hidden className="figure mr-2 text-[0.72rem] font-extrabold tracking-[0.12em] text-gold-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <strong className="text-[1.05rem] text-ink-950">{x.q}</strong> <span className="mt-1 block">{x.a}</span>
              </p>
            </li>
          ))}
        </ul>
        <Callout icon={ShieldIcon}>
          With us, every package page shows the hotel distance, the room basis and everything included - and you get a written invoice before
          paying. See <Link href="/umrah-packages/">all Umrah packages</Link>.
        </Callout>
      </Chapter>

      {/* ─── Calculator ───────────────────────────────────────────────────── */}
      <Chapter id="calculator" title="Umrah cost calculator" eyebrow="Your own numbers" art={CalculatorArt}>
        <div className="not-prose">
          <CostCalculator packages={toFinderList(packages)} whatsapp={site.contact.whatsapp} pricesChecked={season.pricesChecked} />
        </div>
      </Chapter>

      <div id="faq" className="not-prose mt-24 scroll-mt-24 sm:mt-32">
        <Faq faqs={faqs} heading="Umrah cost questions" />
      </div>
    </GuideLayout>
  );
}
