import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import EnquiryForm from "@/components/EnquiryForm";
import Faq from "@/components/Faq";
import { market, pkrRange } from "@/lib/market";
import { pageMetadata } from "@/lib/metadata";
import { season } from "@/lib/season";
import { site } from "@/lib/site";

const path = "/umrah-tickets/";

export const metadata = pageMetadata({
  title: "Umrah Tickets from Pakistan — Lahore, Karachi & Islamabad to Jeddah Fares",
  description: "Umrah ticket prices from Lahore, Karachi and Islamabad to Jeddah and Madinah: typical return fares, airlines, baggage and Zamzam rules.",
  path,
  image: "kaabaWide",
});

const airlines = {
  direct: ["Saudia", "PIA", "Airblue", "Fly Jinnah", "flynas"],
  oneStop: ["Emirates", "Qatar Airways", "Etihad", "Oman Air", "Air Arabia", "Turkish Airlines", "SalamAir"],
};

export default function UmrahTicketsPage() {
  const faqs = [
    {
      q: "What is the Umrah ticket price from Pakistan?",
      a: `Return economy fares to Jeddah typically run ${pkrRange(market.airfare[0].min, market.airfare[0].max)} from Karachi and ${pkrRange(market.airfare[1].min, market.airfare[1].max)} from Lahore outside peak weeks (checked ${market.checked}). December and Ramadan fares are often ${market.peakAirfareUplift} higher.`,
    },
    {
      q: "Is it cheaper to fly from Karachi?",
      a: "Usually. Karachi has the shortest flight to Jeddah and the most competition, so fares are often lower than from Lahore or Islamabad.",
    },
    {
      q: "Should I fly to Jeddah or Madinah?",
      a: "Jeddah if you want to perform Umrah on arrival; Madinah if you'd rather start with Madinah and travel to Makkah in ihram later. Open-jaw tickets (in to one, out of the other) avoid a long drive back.",
    },
    {
      q: "Do I need the ticket before the visa?",
      a: "Yes, in practice. The Umrah visa must be used within 30 days of issue, so we confirm your flights first and apply for the visa close to departure.",
    },
    {
      q: "How much Zamzam can I bring back?",
      a: "Airlines don't allow Zamzam in checked suitcases. Pilgrims can usually carry one sealed 5-litre container according to the airline's rules — we confirm it for your flight.",
    },
  ];

  return (
    <>
      <section className="border-b border-sand-200 bg-sand-100/60">
        <div className="container-x py-10 lg:py-14">
          <Breadcrumbs items={[{ name: "Umrah Tickets", path }]} />
          <p className="eyebrow mt-6">Fares checked {market.checked}</p>
          <h1 className="mt-3 max-w-3xl text-[2.3rem] leading-[1.08] sm:text-5xl">Umrah Tickets from Pakistan</h1>
          <p className="mt-5 max-w-2xl text-[1.06rem] leading-relaxed text-ink-700">
            We book return Umrah flights from Lahore, Karachi and Islamabad to Jeddah and Madinah — on their own, or as part
            of a <Link href="/umrah-packages/" className="font-semibold text-haram-800 underline">complete Umrah package</Link>{" "}
            with visa, hotels and transport. Fares change daily, so send us your dates for today&apos;s price.
          </p>
        </div>
      </section>

      <div className="container-x grid gap-12 py-12 lg:grid-cols-[1.5fr_1fr]">
        <article className="prose-mt min-w-0">
          <h2 id="fares">Typical return fares</h2>
          <table>
            <thead>
              <tr>
                <th>Route</th>
                <th>Return economy, per person</th>
              </tr>
            </thead>
            <tbody>
              {market.airfare.map((a) => (
                <tr key={a.code}>
                  <td>
                    {a.city} ({a.code}) – Jeddah (JED)
                  </td>
                  <td>{pkrRange(a.min, a.max)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            Market ranges outside peak weeks, checked {market.checked}. December holidays and Ramadan are often{" "}
            {market.peakAirfareUplift} higher, and fuel surcharges can change at short notice while Gulf airspace is
            disrupted. Madinah fares are similar to Jeddah on most airlines.
          </p>

          <h2 id="airlines">Airlines</h2>
          <p>
            <strong>Direct flights:</strong> {airlines.direct.join(", ")} (routes vary by city and day).
          </p>
          <p>
            <strong>One-stop options</strong>, often cheaper when direct fares are high: {airlines.oneStop.join(", ")}.
          </p>

          <h2 id="tips">Booking tips for Umrah flights</h2>
          <ul>
            <li>Book flights before the visa: the visa must be used within 30 days of issue.</li>
            <li>
              Put on ihram before boarding (or before the miqat announcement) if you land in Jeddah and go straight to
              Makkah.
            </li>
            <li>Check the baggage allowance on the e-ticket — typically 20–30 kg checked plus 7 kg hand baggage in economy.</li>
            <li>
              This season&apos;s last Umrah entry is {season.umrahPause.lastEntry} and the final departure is{" "}
              {season.umrahPause.finalDeparture}; return flights must be before that.
            </li>
          </ul>

          <div className="not-prose pt-6">
            <Faq faqs={faqs} heading="Umrah ticket questions" />
          </div>
        </article>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <EnquiryForm whatsapp={site.contact.whatsapp} packageName="Umrah return ticket" compact heading="Get today's fare" />
        </div>
      </div>

      <CtaBand title="Flights, visa and hotels together?" body="A package usually costs less than booking each part separately. Tell us your dates and we'll quote both ways." />
    </>
  );
}
