import Image from "next/image";
import Link from "next/link";
import BookingSteps from "../BookingSteps";
import Breadcrumbs from "../Breadcrumbs";
import CtaBand from "../CtaBand";
import EnquiryForm from "../EnquiryForm";
import Faq from "../Faq";
import JsonLd from "../JsonLd";
import PackageCard, { Stars } from "../PackageCard";
import {
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
import { images } from "@/lib/images";
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
import { packageSchema } from "@/lib/schema";
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
      a: "Yes. Any package can be adjusted — more nights in Madinah, a closer hotel, or Madinah first. Tell us what you'd like and we'll re-quote.",
    },
  ];
}

export default function PackageView({ p }: { p: UmrahPackage }) {
  const img = images[p.image];
  const low = fromPrice(p);
  const steps = itinerary(p);
  const bases = (Object.keys(ROOM_BASIS) as RoomBasis[]).filter((b) => p.prices[b]);
  const waMessage = `Assalam o Alaikum, I'm interested in the ${p.name}. Please send me the details and available dates.`;
  const related = packages
    .filter((x) => x.slug !== p.slug && (x.days === p.days || x.tier === p.tier))
    .slice(0, 3);
  const faqs = [...(p.faqs ?? []), ...genericFaqs(p)];

  const facts = [
    { icon: CalendarIcon, label: "Duration", value: `${p.days} days`, sub: `${p.nights.makkah} Makkah · ${p.nights.madinah} Madinah` },
    { icon: HotelIcon, label: "Hotels", value: TIERS[p.tier].label, sub: `Makkah ${p.hotels.makkah.distance}` },
    { icon: PlaneIcon, label: "Flights", value: "Return included", sub: site.departures.join(" · ") },
    { icon: PassportIcon, label: "Visa", value: "Included", sub: "With mandatory insurance" },
    { icon: BusIcon, label: "Transport", value: "All transfers", sub: p.transport },
    { icon: DomeIcon, label: "Ziyarat", value: p.ziyarat ? "Included" : "Optional", sub: p.ziyarat ? "Makkah & Madinah" : "Add on request" },
  ];

  return (
    <>
      <JsonLd data={packageSchema(p)} />

      <section className="border-b border-sand-200 bg-sand-100/60">
        <div className="container-x py-8 lg:py-12">
          <Breadcrumbs
            items={[
              { name: "Umrah Packages", path: "/umrah-packages/" },
              { name: p.shortName, path: `/umrah-packages/${p.slug}/` },
            ]}
          />
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <p className="eyebrow">
                {TIERS[p.tier].label} · {p.days} days
              </p>
              <h1 className="mt-3 text-[2.2rem] leading-[1.08] sm:text-5xl">{p.name}</h1>
              <p className="mt-4 max-w-2xl text-[1.06rem] leading-relaxed text-ink-700">{p.summary}</p>
              <div className="relative mt-7 aspect-[16/9] overflow-hidden rounded-[var(--radius-card)]">
                <Image src={img.src} alt={img.alt} fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
              </div>
            </div>

            <aside className="lg:pt-2" aria-label="Price and booking">
              <div className="card p-6 lg:sticky lg:top-24">
                <p className="text-[0.75rem] font-bold uppercase tracking-wider text-ink-500">From, per person</p>
                <p className="font-display text-[2.4rem] font-semibold leading-tight text-ink-950">{formatPKR(low.amount)}</p>
                <p className="text-sm text-ink-500">
                  {ROOM_BASIS[low.basis].label} room · visa, flights, hotels & transport included
                </p>
                <table className="mt-5 w-full text-[0.93rem]">
                  <caption className="sr-only">Price per person by room type</caption>
                  <tbody>
                    {bases.map((b) => (
                      <tr key={b} className="border-b border-sand-200 last:border-0">
                        <th scope="row" className="py-2.5 text-left font-semibold text-ink-800">
                          {ROOM_BASIS[b].label}
                          <span className="block text-[0.75rem] font-normal text-ink-500">{ROOM_BASIS[b].people}</span>
                        </th>
                        <td className="py-2.5 text-right font-semibold tabular-nums text-ink-950">{formatPKR(p.prices[b]!)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-5 grid gap-2.5">
                  <a href={whatsappLink(waMessage)} className="btn btn-wa w-full !min-h-[3.1rem] text-base" rel="nofollow">
                    <WhatsAppIcon className="h-5 w-5" />
                    Ask about this package
                  </a>
                  <a href={telLink()} className="btn btn-ghost w-full">
                    <PhoneIcon className="h-4 w-4" />
                    Call {site.contact.phoneDisplay}
                  </a>
                </div>
                <p className="mt-4 text-[0.78rem] leading-relaxed text-ink-500">
                  Prices checked {season.pricesChecked}. Travel window: {p.validity}. Prices follow airfares and hotel
                  rates and are confirmed in writing before you pay. Children&apos;s prices on request.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="container-x py-12">
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {facts.map((f) => (
            <div key={f.label} className="rounded-2xl border border-sand-300 bg-white/60 p-4">
              <dt className="flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-wider text-ink-500">
                <f.icon className="h-4 w-4 text-gold-600" />
                {f.label}
              </dt>
              <dd className="mt-2 font-semibold text-ink-950">{f.value}</dd>
              <dd className="text-[0.8rem] text-ink-500">{f.sub}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="container-x grid gap-12 pb-14 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-14">
          <div>
            <h2 className="text-3xl">Why pilgrims choose this package</h2>
            <p className="mt-3 text-ink-600">Best for: {p.bestFor}</p>
            <ul className="mt-5 space-y-3">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-[1rem] text-ink-800">
                  <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-haram-700" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-3xl">Your hotels</h2>
            <p className="mt-2 text-sm text-ink-500">
              Named hotels are our usual choice for this package; the exact hotel (or an equivalent of the same category
              and distance) is confirmed on your voucher before payment.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {(["makkah", "madinah"] as const).map((city) => {
                const h = p.hotels[city];
                return (
                  <div key={city} className="card p-5">
                    <p className="text-[0.72rem] font-bold uppercase tracking-wider text-gold-700">
                      {city === "makkah" ? `Makkah · ${p.nights.makkah} nights` : `Madinah · ${p.nights.madinah} nights`}
                    </p>
                    <h3 className="mt-2 text-xl">{h.name}</h3>
                    <p className="mt-1">
                      <Stars n={h.stars} />
                    </p>
                    <dl className="mt-3 space-y-1.5 text-[0.9rem] text-ink-700">
                      <div className="flex gap-2">
                        <dt className="font-semibold">Distance:</dt>
                        <dd>
                          {h.distance}
                          {h.shuttle ? " — free shuttle to the Haram" : ""}
                        </dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="font-semibold">Meals:</dt>
                        <dd>{h.meals ?? "Room only"}</dd>
                      </div>
                    </dl>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-3xl">Day-by-day itinerary</h2>
            <ol className="mt-6 space-y-0 border-l-2 border-gold-300 pl-6">
              {steps.map((s) => (
                <li key={s.when} className="relative pb-7 last:pb-0">
                  <span className="absolute -left-[1.95rem] top-1 h-3.5 w-3.5 rounded-full border-2 border-gold-500 bg-sand-50" />
                  <p className="text-[0.75rem] font-bold uppercase tracking-wider text-gold-700">{s.when}</p>
                  <h3 className="mt-1 text-xl">{s.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-ink-700">{s.detail}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="card p-6">
              <h2 className="text-2xl">Included</h2>
              <ul className="mt-4 space-y-2.5">
                {p.includes.map((x) => (
                  <li key={x} className="flex gap-2.5 text-[0.95rem] text-ink-800">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-haram-700" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6">
              <h2 className="text-2xl">Not included</h2>
              <ul className="mt-4 space-y-2.5">
                {[...p.excludes, ...STANDARD_EXCLUDES].map((x) => (
                  <li key={x} className="flex gap-2.5 text-[0.95rem] text-ink-700">
                    <XIcon className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Faq faqs={faqs} heading="Questions about this package" />
        </div>

        <div id="quote" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
          <EnquiryForm whatsapp={site.contact.whatsapp} packageName={p.name} compact heading="Check dates & price" />
        </div>
      </section>

      <section className="border-y border-sand-200 bg-sand-100/50">
        <div className="container-x py-14">
          <h2 className="text-3xl">How booking works</h2>
          <div className="mt-8">
            <BookingSteps />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x py-14">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-3xl">Similar packages</h2>
            <Link href="/umrah-packages/" className="text-sm font-bold text-haram-800 hover:underline">
              All packages →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <PackageCard key={r.slug} p={r} />
            ))}
          </div>
        </section>
      )}

      <CtaBand title="Want this package on different dates?" message={waMessage} />
    </>
  );
}
