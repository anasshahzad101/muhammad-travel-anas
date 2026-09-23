import Link from "next/link";
import CostCalculator from "@/components/CostCalculator";
import Faq from "@/components/Faq";
import GuideLayout from "@/components/GuideLayout";
import PriceTable from "@/components/PriceTable";
import { market, pkrRange } from "@/lib/market";
import { pageMetadata } from "@/lib/metadata";
import { calculatorPackages, cheapest, fromPrice, packages } from "@/lib/packages";
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

  return (
    <GuideLayout
      title={title}
      lead={`A complete Umrah from Pakistan — visa, return flights, hotels and transport — costs from about ${formatPKR(low.amount)} per person with us in ${season.pricesChecked}. Here is what each part costs, what changes the price, and the charges to ask about before you pay.`}
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
    >
      <h2 id="answer">The short answer</h2>
      <p>
        <strong>
          In {season.pricesChecked}, a complete Umrah from Pakistan costs about {formatPKR(low.amount)} to{" "}
          {fifteen3 ? formatPKR(fifteen3.prices.double!) : "PKR 420,000"} per person
        </strong>{" "}
        for 7 to 15 days in economy or 3-star hotels, including the visa, return flights, hotels and transport. 5-star
        packages start around {formatPKR(Math.min(...fiveStar))}, and Ramadan packages from{" "}
        {formatPKR(Math.min(...ramadan))}. Prices are per person and depend on how many share a room.
      </p>

      <h2 id="prices">Our package prices ({season.pricesChecked})</h2>
      <p>Every price below includes the Umrah visa, return flights from Pakistan, hotels and transport.</p>
      <div className="not-prose">
        <PriceTable list={std} caption="Umrah package prices per person, PKR" />
      </div>

      <h2 id="breakdown">Where the money goes</h2>
      <p>
        These are typical market figures across Pakistani agencies, checked {market.checked}. They show why packages cost
        what they do.
      </p>
      <table>
        <thead>
          <tr>
            <th>Cost</th>
            <th>Typical price per person</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Umrah visa + insurance</td>
            <td>{pkrRange(v.min, v.max)}</td>
            <td>Includes the Saudi visa fee and the mandatory health insurance. Sold only through licensed operators.</td>
          </tr>
          {market.airfare.map((a) => (
            <tr key={a.code}>
              <td>Return flight, {a.city}–Jeddah</td>
              <td>{pkrRange(a.min, a.max)}</td>
              <td>Economy, outside peak weeks. December and Ramadan are often {market.peakAirfareUplift} higher.</td>
            </tr>
          ))}
          <tr>
            <td>Hotels + visa + transport, 15 days (no flights)</td>
            <td>
              Economy {formatPKR(market.landOnly15.economy[0])}+ · 3-star ~{formatPKR(market.landOnly15["3-star"][1])} ·
              4-star ~{formatPKR(market.landOnly15["4-star"][1])} · 5-star ~{formatPKR(market.landOnly15["5-star"][1])}
            </td>
            <td>Mostly quad basis. Hotel distance is the biggest single driver of price.</td>
          </tr>
        </tbody>
      </table>

      <h2 id="drivers">What changes the price</h2>
      <ol>
        <li>
          <strong>Hotel distance from the Haram.</strong> The jump from economy (1 km+, often a shuttle) to a Clock Tower
          hotel can double the price. See <Link href="/umrah-packages/economy/">economy</Link> vs{" "}
          <Link href="/umrah-packages/5-star/">5-star packages</Link>.
        </li>
        <li>
          <strong>People per room.</strong> Sharing (5–6) is cheapest, then quad, triple and double. A double room costs
          roughly 20% more per person than quad.
        </li>
        <li>
          <strong>Season.</strong> December holidays and Ramadan push flights and hotels up; the months after the season
          reopens following Hajj are usually cheapest.
        </li>
        <li>
          <strong>Length.</strong> The visa and flights cost the same for 7 or 28 days, so longer trips cost much less per
          day — compare <Link href="/umrah-packages/15-days/">15 days</Link> and{" "}
          <Link href="/umrah-packages/21-days/">21 days</Link>.
        </li>
        <li>
          <strong>Departure city.</strong> Karachi is usually {pkrRange(market.karachiSaving.min, market.karachiSaving.max)}{" "}
          cheaper than Lahore or Islamabad.
        </li>
      </ol>

      <h2 id="hidden">Hidden costs to ask about before paying anyone</h2>
      <ul>
        <li>
          <strong>Are flights included?</strong> Many &ldquo;Umrah packages from Pakistan&rdquo; are land-only; the flight
          can add {pkrRange(market.airfare[0].min, market.airfare[2].max)}.
        </li>
        <li>
          <strong>What is the price basis?</strong> &ldquo;Sharing&rdquo; is 5–6 to a room. Compare quad with quad.
        </li>
        <li>
          <strong>How far is the hotel, in metres?</strong> Some agents sell a 1.6 km shuttle hotel as 5-star.
        </li>
        <li>
          <strong>Is transport both ways?</strong> Some packages include only one-way transfers.
        </li>
        <li>
          <strong>Are there service charges or &ldquo;processing fees&rdquo; on top?</strong> Ask for a written invoice
          showing the total.
        </li>
      </ul>
      <p>
        With us, every package page shows the hotel distance, the room basis and everything included — and you get a
        written invoice before paying. See <Link href="/umrah-packages/">all Umrah packages</Link>.
      </p>

      <h2 id="calculator">Umrah cost calculator</h2>
      <div className="not-prose">
        <CostCalculator packages={calculatorPackages()} whatsapp={site.contact.whatsapp} pricesChecked={season.pricesChecked} />
      </div>

      <div id="faq" className="not-prose scroll-mt-24 pt-6">
        <Faq faqs={faqs} heading="Umrah cost questions" />
      </div>
    </GuideLayout>
  );
}
