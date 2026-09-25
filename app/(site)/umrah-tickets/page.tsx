import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import DaysUntil from "@/components/DaysUntil";
import EnquiryForm from "@/components/EnquiryForm";
import Faq from "@/components/Faq";
import { ArrowRightIcon, CalendarIcon, DomeIcon, PassportIcon } from "@/components/Icons";
import JourneyMap from "@/components/JourneyMap";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import StarPattern from "@/components/StarPattern";
import AirlineGroups from "@/components/tickets/AirlineGroups";
import FarePasses, { type FarePass } from "@/components/tickets/FarePasses";
import TipCards from "@/components/tickets/TipCards";
import { IhramIcon, LuggageIcon, TrendUpIcon } from "@/components/tickets/icons";
import { departures, groundNote, routeDistances } from "@/lib/journey";
import { webPageSchema } from "@/lib/schema";
import { market, pkrRange } from "@/lib/market";
import { pageMetadata } from "@/lib/metadata";
import { season } from "@/lib/season";
import { site } from "@/lib/site";

const path = "/umrah-tickets/";

const description = "Umrah ticket prices from Lahore, Karachi and Islamabad to Jeddah and Madinah: typical return fares, airlines, baggage and Zamzam rules.";

export const metadata = pageMetadata({
  title: "Umrah Tickets from Pakistan - Lahore, Karachi & Islamabad to Jeddah Fares",
  description,
  path,
  image: "kaabaWide",
});

const airlines = {
  direct: ["Saudia", "PIA", "Airblue", "Fly Jinnah", "flynas"],
  oneStop: ["Emirates", "Qatar Airways", "Etihad", "Oman Air", "Air Arabia", "Turkish Airlines", "SalamAir"],
};

/** One boarding pass per departure city: fares from lib/market, airport and flight time from lib/journey. */
const lowestFare = Math.min(...market.airfare.map((a) => a.min));
const passes: FarePass[] = market.airfare.flatMap((a) => {
  const d = departures.find((x) => x.city === a.city);
  if (!d) return [];
  return [
    {
      city: a.city,
      code: a.code,
      airport: d.airport.replace(/\s*\([A-Z]{3}\)$/, ""),
      flight: d.flight,
      fare: pkrRange(a.min, a.max),
      href: d.href,
      tag: a.min === lowestFare ? "Often cheapest" : undefined,
    },
  ];
});

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
      a: "Airlines don't allow Zamzam in checked suitcases. Pilgrims can usually carry one sealed 5-litre container according to the airline's rules - we confirm it for your flight.",
    },
  ];

  return (
    <>
      <JsonLd
        data={webPageSchema({ path, title: "Umrah Tickets from Pakistan", description, dateModified: season.pricesCheckedISO, image: "kaabaWide" })}
      />
      <PageHero
        crumbs={[{ name: "Umrah Tickets", path }]}
        eyebrow={`Fares checked ${market.checked}`}
        title="Umrah Tickets from Pakistan"
        accent="Tickets"
        lead={
          <p>
            We book return Umrah flights from Lahore, Karachi and Islamabad to Jeddah and Madinah - on their own, or as part of a{" "}
            <Link href="/umrah-packages/" className="font-semibold text-gold-300 underline decoration-gold-400/60 underline-offset-4">
              complete Umrah package
            </Link>{" "}
            with visa, hotels and transport. Fares change daily, so send us your dates for today&apos;s price.
          </p>
        }
        image="kaabaWide"
      />

      <section className="section-night grain on-dark relative overflow-hidden border-t border-gold-400/15">
        <StarPattern id="tickets-journey-lattice" className="text-gold-300 opacity-[0.035]" />
        <div className="container-x relative py-20">
          <SectionHeading
            eyebrow="Routes"
            title="Where you'll fly"
            accent="fly"
            intro="Choose your departure city to see the route, the flight time and the typical return fare."
          />
          <div className="mt-12">
            <JourneyMap departures={departures} distances={routeDistances} groundNote={groundNote} checked={market.checked} />
          </div>
        </div>
      </section>

      {/* ─── Fares: one boarding pass per city ────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -right-40 top-24 h-[30rem] w-[30rem] rounded-full bg-gold-200/40 blur-[120px]" />
        <div className="container-x relative py-20 lg:py-28">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading id="fares" eyebrow="By departure city" title="Typical return fares" accent="return fares" />
            <a href="#quote" className="btn btn-primary reveal shrink-0 self-start md:self-auto">
              Get today&apos;s fare
              <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-12">
            <FarePasses passes={passes} to={{ city: "Jeddah", code: "JED" }} fareLabel="Return economy, per person" checked={market.checked} />
          </div>

          <ul className="reveal mt-12 grid overflow-hidden rounded-[24px] border border-sand-300 bg-[#fffdf9] shadow-[0_18px_40px_-32px_rgb(20_17_13/0.4)] max-lg:divide-y max-lg:divide-sand-200 lg:grid-cols-3 lg:divide-x lg:divide-sand-200">
            {[
              {
                icon: CalendarIcon,
                body: <>Market ranges outside peak weeks, checked {market.checked}.</>,
              },
              {
                icon: TrendUpIcon,
                body: (
                  <>
                    December holidays and Ramadan are often <strong className="figure font-extrabold text-ink-950">{market.peakAirfareUplift}</strong> higher, and fuel
                    surcharges can change at short notice while Gulf airspace is disrupted.
                  </>
                ),
              },
              {
                icon: DomeIcon,
                body: <>Madinah fares are similar to Jeddah on most airlines.</>,
              },
            ].map((n, i) => (
              <li key={i} className="flex gap-4 p-6 sm:p-7">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand-100 text-gold-700 ring-1 ring-sand-300">
                  <n.icon className="h-[1.1rem] w-[1.1rem]" />
                </span>
                <p className="text-[0.95rem] leading-relaxed text-ink-700">{n.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Airlines ─────────────────────────────────────────────────────── */}
      <section className="section-night grain on-dark relative overflow-hidden">
        <StarPattern id="tickets-airlines-lattice" className="text-gold-300 opacity-[0.035]" />
        <div aria-hidden className="pointer-events-none absolute -left-40 bottom-0 h-[34rem] w-[34rem] rounded-full bg-haram-600/20 blur-[120px]" />
        <div className="container-x relative py-20 lg:py-28">
          <SectionHeading id="airlines" eyebrow="Who flies the route" title="Airlines" accent="Airlines" />
          <div className="mt-12">
            <AirlineGroups
              groups={[
                { kind: "direct", title: "Direct flights", note: "Routes vary by city and day.", airlines: airlines.direct },
                { kind: "one-stop", title: "One-stop options", note: "Often cheaper when direct fares are high.", airlines: airlines.oneStop },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ─── Booking tips ─────────────────────────────────────────────────── */}
      <section className="section-ivory border-b border-sand-200">
        <div className="container-x py-20 lg:py-28">
          <SectionHeading id="tips" eyebrow="Before you book" title="Booking tips for Umrah flights" accent="tips" />
          <div className="mt-12">
            <TipCards
              tips={[
                {
                  icon: PassportIcon,
                  title: "Flights before the visa",
                  body: "Book flights before the visa: the visa must be used within 30 days of issue.",
                },
                {
                  icon: IhramIcon,
                  title: "Ihram before boarding",
                  body: "Put on ihram before boarding (or before the miqat announcement) if you land in Jeddah and go straight to Makkah.",
                  extra: (
                    <Link href="/guides/how-to-perform-umrah/" className="link-arrow min-h-11 text-sm">
                      How to perform Umrah <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  ),
                },
                {
                  icon: LuggageIcon,
                  title: "Baggage allowance",
                  body: (
                    <>
                      Check the baggage allowance on the e-ticket - typically <strong className="figure">20-30 kg</strong> checked plus{" "}
                      <strong className="figure">7 kg</strong> hand baggage in economy.
                    </>
                  ),
                  extra: (
                    <div aria-hidden className="flex flex-wrap gap-3">
                      {[
                        { w: "20-30 kg", l: "Checked" },
                        { w: "7 kg", l: "Hand baggage" },
                      ].map((tag) => (
                        <span
                          key={tag.l}
                          className="relative inline-flex items-center gap-3 rounded-[10px] rounded-l-[22px] border border-gold-400/50 bg-gold-100/70 py-2 pl-3.5 pr-5 shadow-[0_8px_16px_-12px_rgb(122_86_31/0.6)]"
                        >
                          <span className="h-3 w-3 rounded-full border border-gold-600/50 bg-[#fffdf9] shadow-[inset_0_1px_2px_rgb(20_17_13/0.2)]" />
                          <span>
                            <span className="figure block text-[1.1rem] font-extrabold leading-tight text-ink-950">{tag.w}</span>
                            <span className="block text-[0.66rem] font-extrabold uppercase tracking-[0.16em] text-gold-700">{tag.l}</span>
                          </span>
                        </span>
                      ))}
                    </div>
                  ),
                },
                {
                  icon: CalendarIcon,
                  title: "Return before the deadline",
                  body: (
                    <>
                      This season&apos;s last Umrah entry is <strong className="figure">{season.umrahPause.lastEntry}</strong> and the final departure is{" "}
                      <strong className="figure">{season.umrahPause.finalDeparture}</strong>; return flights must be before that.
                    </>
                  ),
                  extra: (
                    <div aria-hidden className="flex flex-wrap items-center gap-3 rounded-2xl border border-sand-300 bg-sand-50 px-4 py-3">
                      <span className="text-[0.64rem] font-extrabold uppercase tracking-[0.16em] text-gold-700">Final departure</span>
                      <span className="figure text-[1.05rem] font-extrabold text-ink-950">{season.umrahPause.finalDeparture}</span>
                      <DaysUntil iso={season.umrahPause.finalDepartureISO} className="ml-auto rounded-full bg-night-900 px-2.5 py-0.5 text-[0.76rem] text-gold-200" />
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ─── Questions + enquiry ──────────────────────────────────────────── */}
      <section className="container-x grid gap-14 py-20 lg:grid-cols-[1.4fr_1fr] lg:py-24">
        <Faq faqs={faqs} heading="Umrah ticket questions" />
        <div id="quote" className="scroll-mt-28 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
          <EnquiryForm whatsapp={site.contact.whatsapp} packageName="Umrah return ticket" compact heading="Get today's fare" />
        </div>
      </section>

      <CtaBand title="Flights, visa and hotels together?" body="A package usually costs less than booking each part separately. Tell us your dates and we'll quote both ways." />
    </>
  );
}
