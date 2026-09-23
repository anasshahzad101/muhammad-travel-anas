import Link from "next/link";
import BookingSteps from "../BookingSteps";
import CtaBand from "../CtaBand";
import EnquiryForm from "../EnquiryForm";
import Faq from "../Faq";
import JsonLd from "../JsonLd";
import PackageCard, { DistanceMeter, NightsBar, Stars } from "../PackageCard";
import PageHero from "../PageHero";
import SectionHeading from "../SectionHeading";
import {
  ArrowRightIcon,
  BusIcon,
  CalendarIcon,
  CheckIcon,
  DomeIcon,
  HotelIcon,
  PassportIcon,
  PhoneIcon,
  PlaneIcon,
  WhatsAppIcon,
  XIcon,
} from "../Icons";
import {
  ROOM_BASIS,
  STANDARD_EXCLUDES,
  TIERS,
  fromPrice,
  itinerary,
  packages,
  type RoomBasis,
  type UmrahPackage,
} from "@/lib/packages";
import { packageId, packageSchema, webPageSchema } from "@/lib/schema";
import { season } from "@/lib/season";
import { formatPKR, site, telLink, whatsappLink } from "@/lib/site";

function genericFaqs(p: UmrahPackage) {
  const low = fromPrice(p);
  return [
    {
      q: `How much is the ${p.shortName}?`,
      a: `From ${formatPKR(low.amount)} per person in a ${ROOM_BASIS[low.basis].label.toLowerCase()} room (${ROOM_BASIS[low.basis].people}). The price includes the Umrah visa, return flights, ${p.nights.makkah} nights in Makkah, ${p.nights.madinah} nights in Madinah and transport. We confirm the final price in writing before you pay.`,
    },
    {
      q: "Is the Umrah visa included?",
      a: "Yes. The visa fee and its mandatory insurance are included in the package price, and we submit the application for you once documents and payment are received.",
    },
    {
      q: "Which airline will I fly?",
      a: `${p.flights} The airline and flight times are confirmed on your e-ticket before you pay the balance.`,
    },
    {
      q: "Can I change the hotels or the number of nights?",
      a: "Yes. Any package can be adjusted - more nights in Madinah, a closer hotel, or Madinah first. Tell us what you'd like and we'll re-quote.",
    },
  ];
}

export default function PackageView({ p }: { p: UmrahPackage }) {
  const low = fromPrice(p);
  const steps = itinerary(p);
  const bases = (Object.keys(ROOM_BASIS) as RoomBasis[]).filter((b) => p.prices[b]);
  const waMessage = `Assalam o Alaikum, I'm interested in the ${p.name}. Please send me the details and available dates.`;
  const related = packages.filter((x) => x.slug !== p.slug && (x.days === p.days || x.tier === p.tier)).slice(0, 3);
  const faqs = [...(p.faqs ?? []), ...genericFaqs(p)];

  const facts = [
    { icon: CalendarIcon, label: "Duration", value: `${p.days} days`, sub: `${p.nights.makkah} Makkah · ${p.nights.madinah} Madinah` },
    { icon: HotelIcon, label: "Hotels", value: TIERS[p.tier].label, sub: `Makkah ${p.hotels.makkah.distance}` },
    { icon: PlaneIcon, label: "Flights", value: "Return included", sub: site.departures.join(" · ") },
    { icon: PassportIcon, label: "Visa", value: "Included", sub: "With mandatory insurance" },
    { icon: BusIcon, label: "Transport", value: "All transfers", sub: p.transport },
    { icon: DomeIcon, label: "Ziyarat", value: p.ziyarat ? "Included" : "Optional", sub: p.ziyarat ? "Makkah & Madinah" : "Add on request" },
  ];

  const priceCard = (
    <aside aria-label="Price and booking" className="glass-ivory on-light rounded-[28px] p-6 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-ink-500">From, per person</p>
        {p.season && (
          <span className="rounded-full bg-gold-300 px-2.5 py-0.5 text-[0.66rem] font-extrabold uppercase tracking-[0.12em] text-ink-950">
            {p.season === "ramadan" ? "Ramadan 2027" : "December 2026"}
          </span>
        )}
      </div>
      <p className="figure mt-1 text-[2.6rem] font-extrabold leading-none text-ink-950">{formatPKR(low.amount)}</p>
      <p className="mt-2 text-sm text-ink-500">{ROOM_BASIS[low.basis].label} room · visa, flights, hotels & transport included</p>
      <table className="mt-5 w-full text-[0.93rem]">
        <caption className="sr-only">Price per person by room type</caption>
        <tbody>
          {bases.map((b) => (
            <tr key={b} className="border-b border-sand-200 last:border-0">
              <th scope="row" className="py-2.5 text-left font-semibold text-ink-800">
                {ROOM_BASIS[b].label}
                <span className="block text-[0.74rem] font-normal text-ink-500">{ROOM_BASIS[b].people}</span>
              </th>
              <td className="figure py-2.5 text-right font-bold text-ink-950">{formatPKR(p.prices[b]!)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-5 grid gap-2.5">
        <a href={whatsappLink(waMessage)} className="btn btn-wa btn-lg w-full" rel="nofollow">
          <WhatsAppIcon className="h-5 w-5" />
          Ask about this package
        </a>
        <a href={telLink()} className="btn btn-ghost w-full">
          <PhoneIcon className="h-4 w-4" />
          Call <span className="figure">{site.contact.phoneDisplay}</span>
        </a>
      </div>
      <p className="mt-4 text-[0.76rem] leading-relaxed text-ink-500">
        Prices checked {season.pricesChecked}. Travel window: {p.validity}. Prices follow airfares and hotel rates and are confirmed in writing
        before you pay. Children&apos;s prices on request.
      </p>
    </aside>
  );

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            path: `/umrah-packages/${p.slug}/`,
            title: p.name,
            description: p.summary,
            dateModified: season.pricesCheckedISO,
            image: p.image,
            about: packageId(p),
            mainEntity: packageId(p),
          }),
          packageSchema(p),
        ]}
      />

      <PageHero
        crumbs={[
          { name: "Umrah Packages", path: "/umrah-packages/" },
          { name: p.shortName, path: `/umrah-packages/${p.slug}/` },
        ]}
        eyebrow={`${TIERS[p.tier].label} · ${p.days} days`}
        title={p.name}
        lead={<p>{p.summary}</p>}
        aside={priceCard}
        backdrop={p.image}
      >
        <div className="max-w-md">
          <NightsBar p={p} onDark />
        </div>
      </PageHero>

      <div className="container-x relative z-10 -mt-10">
        <dl className="glass-ivory grid grid-cols-2 gap-px overflow-hidden rounded-[24px] md:grid-cols-3 lg:grid-cols-6">
          {facts.map((f) => (
            <div key={f.label} className="bg-[#fffdf9]/60 px-5 py-4">
              <dt className="flex items-center gap-2 text-[0.66rem] font-extrabold uppercase tracking-[0.16em] text-gold-700">
                <f.icon className="h-4 w-4" />
                {f.label}
              </dt>
              <dd className="mt-1.5 font-bold text-ink-950">{f.value}</dd>
              <dd className="text-[0.78rem] text-ink-500">{f.sub}</dd>
            </div>
          ))}
        </dl>
      </div>

      <section className="container-x grid gap-14 py-20 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-20">
          <div className="reveal">
            <h2 className="h-section !text-[clamp(2rem,1.5rem+1.6vw,2.9rem)]">Why pilgrims choose this package</h2>
            <p className="mt-3 text-ink-600">
              <span className="font-semibold text-ink-900">Best for:</span> {p.bestFor}
            </p>
            <ul className="mt-6 space-y-3">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-3 rounded-2xl border border-sand-300 bg-[#fffdf9] p-4 text-[1rem] text-ink-800">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-haram-50 text-haram-700">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="h-section reveal !text-[clamp(2rem,1.5rem+1.6vw,2.9rem)]">Your hotels</h2>
            <p className="reveal mt-3 text-sm text-ink-500">
              Named hotels are our usual choice for this package; the exact hotel (or an equivalent of the same category and distance) is
              confirmed on your voucher before payment.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {(["makkah", "madinah"] as const).map((city, i) => {
                const h = p.hotels[city];
                return (
                  <div key={city} className="card card-hover reveal overflow-hidden" style={{ "--i": i } as React.CSSProperties}>
                    <div className={`h-1.5 ${city === "makkah" ? "bg-night-900" : "bg-haram-500"}`} />
                    <div className="p-6">
                      <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-gold-700">
                        {city === "makkah" ? `Makkah · ${p.nights.makkah} nights` : `Madinah · ${p.nights.madinah} nights`}
                      </p>
                      <h3 className="mt-2 text-[1.6rem] leading-tight">{h.name}</h3>
                      <p className="mt-1.5">
                        <Stars n={h.stars} />
                      </p>
                      <div className="mt-5">
                        <DistanceMeter label="To the Haram" distance={h.distance} shuttle={h.shuttle} />
                      </div>
                      <dl className="mt-4 space-y-1.5 text-[0.9rem] text-ink-700">
                        <div className="flex gap-2">
                          <dt className="font-semibold">Distance:</dt>
                          <dd>
                            {h.distance}
                            {h.shuttle ? " - free shuttle to the Haram" : ""}
                          </dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="font-semibold">Meals:</dt>
                          <dd>{h.meals ?? "Room only"}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="h-section reveal !text-[clamp(2rem,1.5rem+1.6vw,2.9rem)]">Day-by-day itinerary</h2>
            <ol className="relative mt-8">
              <span aria-hidden className="absolute bottom-3 left-[0.95rem] top-3 w-px bg-gradient-to-b from-gold-400 via-gold-300/60 to-haram-500/60" />
              {steps.map((s) => (
                <li key={s.when} className="reveal relative pb-6 pl-12 last:pb-0" style={{ "--i": 0 } as React.CSSProperties}>
                  <span aria-hidden className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border border-gold-400/70 bg-sand-50 shadow-[0_0_0_5px_var(--color-sand-50)]">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-gold-600" fill="currentColor">
                      <path d="M12 0l2.6 6.3L21 3.5l-2.8 6.4L24 12l-5.8 2.1L21 20.5l-6.4-2.8L12 24l-2.6-6.3L3 20.5l2.8-6.4L0 12l5.8-2.1L3 3.5l6.4 2.8z" />
                    </svg>
                  </span>
                  <div className="rounded-2xl border border-sand-300 bg-[#fffdf9] p-5 transition hover:border-gold-400/60">
                    <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-gold-700">{s.when}</p>
                    <h3 className="mt-1 text-[1.45rem] leading-tight">{s.title}</h3>
                    <p className="mt-2 leading-relaxed text-ink-700">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="card reveal p-7">
              <h2 className="text-[1.9rem]">Included</h2>
              <ul className="mt-5 space-y-3">
                {p.includes.map((x) => (
                  <li key={x} className="flex gap-3 text-[0.95rem] text-ink-800">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-haram-50 text-haram-700">
                      <CheckIcon className="h-3.5 w-3.5" />
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card reveal p-7" style={{ "--i": 1 } as React.CSSProperties}>
              <h2 className="text-[1.9rem]">Not included</h2>
              <ul className="mt-5 space-y-3">
                {[...p.excludes, ...STANDARD_EXCLUDES].map((x) => (
                  <li key={x} className="flex gap-3 text-[0.95rem] text-ink-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sand-200 text-ink-500">
                      <XIcon className="h-3 w-3" />
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Faq faqs={faqs} heading="Questions about this package" />
        </div>

        <div id="quote" className="scroll-mt-28 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
          <EnquiryForm whatsapp={site.contact.whatsapp} packageName={p.name} compact heading="Check dates & price" />
        </div>
      </section>

      <section className="section-ivory border-y border-sand-200">
        <div className="container-x py-20">
          <SectionHeading eyebrow="Booking" title="How booking works" accent="booking" />
          <div className="mt-12">
            <BookingSteps />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x py-20">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading eyebrow="You may also like" title="Similar packages" accent="Similar" />
            <Link href="/umrah-packages/" className="link-arrow reveal shrink-0 text-sm">
              All packages <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r, i) => (
              <PackageCard key={r.slug} p={r} index={i} />
            ))}
          </div>
        </section>
      )}

      <CtaBand title="Want this package on different dates?" message={waMessage} />
    </>
  );
}
