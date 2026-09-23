import Image from "next/image";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import StarPattern, { Ornament, StarSeal } from "@/components/StarPattern";
import TrustPoints from "@/components/TrustPoints";
import AboutHeroArt from "@/components/about/AboutHeroArt";
import { ArtPlate } from "@/components/guides/Article";
import { SealArt } from "@/components/guides/GuideArt";
import {
  ArrowRightIcon,
  BusIcon,
  ClockIcon,
  DomeIcon,
  HotelIcon,
  InfoIcon,
  PassportIcon,
  PinIcon,
  PlaneIcon,
  ShieldIcon,
  WalletIcon,
  WhatsAppIcon,
} from "@/components/Icons";
import { images } from "@/lib/images";
import { pageMetadata } from "@/lib/metadata";
import { webPageSchema } from "@/lib/schema";
import { activeLicences, fullAddress, operatorDisclosure, site, whatsappLink } from "@/lib/site";

const description =
  "Muhammad Travels is a Lahore umrah travel agency serving pilgrims across Pakistan. How we price, who we are, and how to check our registration before you pay.";

export const metadata = pageMetadata({
  title: "About Muhammad Travels - Umrah Travel Agency in Lahore",
  absoluteTitle: true,
  description,
  path: "/about/",
  image: "nabawiUmbrellas",
});

/*
  The four ways we work. Each is one sentence from the page: the bold lead-in
  becomes the card title and the rest its body. The joining " - " or ", " is
  kept for screen readers and crawlers, and the body's first letter is only
  capitalised visually, so the sentence itself is unchanged.
*/
const promises = [
  {
    icon: WalletIcon,
    title: "The whole price, per person, in rupees",
    join: " - ",
    body: "visa, flights, hotels and transport together, with the room type stated.",
  },
  {
    icon: HotelIcon,
    title: "The hotel distance in metres",
    join: ", ",
    body: "or “shuttle” when it is one. The voucher you receive names the exact hotel before you pay the balance.",
  },
  {
    icon: ShieldIcon,
    title: "A written invoice before any payment",
    join: ", ",
    body: "and payment only to the bank account in our business name shown on it.",
  },
  {
    icon: PassportIcon,
    title: "Your visa, e-tickets and hotel vouchers in hand",
    join: " ",
    body: "before you leave Pakistan, with a number to call while you are in Saudi Arabia.",
  },
];

/* The services named in the "Umrah only" paragraph, as a row of marks. */
const services = [
  { icon: PassportIcon, label: "Visas" },
  { icon: PlaneIcon, label: "Flights" },
  { icon: HotelIcon, label: "Hotels" },
  { icon: BusIcon, label: "Transport" },
  { icon: DomeIcon, label: "Ziyarat" },
];

export default function AboutPage() {
  const licences = activeLicences();
  return (
    <>
      <JsonLd
        data={webPageSchema({ path: "/about/", title: "About Muhammad Travels", description, dateModified: "2026-09-23", type: "AboutPage", image: "nabawiUmbrellas" })}
      />
      <PageHero
        crumbs={[{ name: "About", path: "/about/" }]}
        eyebrow="About us"
        title="An Umrah agency that shows you everything up front"
        accent="everything up front"
        lead={
          <p>
            {site.name} arranges Umrah for pilgrims across Pakistan from our office in {site.contact.address.city}. We handle the visa, flights,
            hotels and transport as one package, and we publish the full price and the real hotel distance for every package - because that is
            exactly what families told us they couldn&apos;t get elsewhere.
          </p>
        }
        aside={<AboutHeroArt />}
      />

      {/* ─── How we work ──────────────────────────────────────────────────── */}
      <section className="container-x py-24 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
          <div className="reveal">
            <p className="eyebrow">Things you can check</p>
            <h2 className="h-section mt-4">
              How we <em className="accent">work</em>
            </h2>
          </div>
          <p className="reveal font-display text-[1.5rem] font-medium leading-[1.3] text-ink-900 sm:text-[2rem] lg:pb-1">
            Umrah is often the largest single expense a Pakistani family makes after a wedding, and it is usually paid to an agent the family has
            never met. So we run the business on things you can check rather than things you have to take on trust:
          </p>
        </div>

        <ol className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {promises.map((p, i) => (
            <li
              key={p.title}
              className="card card-hover spotlight reveal group relative flex flex-col overflow-hidden p-6 sm:p-7"
              style={{ "--i": i } as React.CSSProperties}
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-haram-600 opacity-0 transition duration-500 group-hover:opacity-100" />
              <div className="flex items-center justify-between gap-4">
                <span className="relative flex h-14 w-14 items-center justify-center">
                  <svg viewBox="0 0 56 56" className="absolute inset-0 h-full w-full text-gold-400 transition-transform duration-700 ease-out-expo group-hover:rotate-45" aria-hidden>
                    <g fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="10" y="10" width="36" height="36" />
                      <rect x="10" y="10" width="36" height="36" transform="rotate(45 28 28)" />
                    </g>
                  </svg>
                  <p.icon className="relative h-5 w-5 text-haram-800" />
                </span>
                <span aria-hidden className="font-display text-[3rem] font-medium italic leading-none text-gold-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-6 text-[0.97rem] leading-relaxed text-ink-600">
                <strong className="block font-display text-[1.5rem] font-semibold leading-[1.15] text-ink-950">{p.title}</strong>
                <span className="sr-only">{p.join}</span>
                <span className="mt-3 block first-letter:uppercase">{p.body}</span>
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ─── Umrah only ───────────────────────────────────────────────────── */}
      <section className="section-night grain on-dark relative overflow-hidden">
        <StarPattern id="about-umrah-lattice" className="text-gold-300 opacity-[0.04]" />
        <div aria-hidden className="pointer-events-none absolute -left-40 top-1/2 hidden -translate-y-1/2 text-gold-400/10 lg:block">
          <StarSeal className="h-[36rem] w-[36rem] animate-spin-slow" strokeWidth={0.4} />
        </div>
        <div className="container-x relative grid gap-14 py-24 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-16 lg:py-28">
          <div>
            <p className="eyebrow reveal">What we do</p>
            <h2 className="h-section reveal mt-4">
              Umrah <em className="accent">only</em>
            </h2>
            <p className="reveal mt-8 font-display text-[1.75rem] font-medium leading-[1.25] text-sand-50 sm:text-[2.3rem]">
              We arrange Umrah and Umrah-related services: visas, flights, hotels, transport and ziyarat.
            </p>
            <ul aria-hidden className="reveal mt-8 flex flex-wrap gap-2.5">
              {services.map((s) => (
                <li key={s.label} className="chip !px-3.5 !py-2">
                  <s.icon className="h-4 w-4 text-gold-300" />
                  {s.label}
                </li>
              ))}
            </ul>
            <div className="glass reveal mt-10 flex max-w-2xl gap-4 rounded-[22px] !bg-white/[0.04] p-5 sm:p-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-300/15 text-gold-300">
                <InfoIcon className="h-5 w-5" />
              </span>
              <p className="text-[1rem] leading-relaxed text-sand-200/90">
                <strong className="font-bold text-sand-50">We do not sell Hajj packages.</strong> In Pakistan, Hajj is arranged through the Government
                Hajj Scheme or through Hajj Group Organisers licensed by the Ministry of Religious Affairs.
              </p>
            </div>
          </div>
          <div className="reveal relative mx-auto w-full max-w-[19rem] lg:max-w-[22rem]">
            <div className="arch-frame">
              <div className="arch relative aspect-[3/4] w-full shadow-[0_50px_90px_-40px_rgb(0_0_0/0.9)]">
                <Image src={images.kaabaTowers.src} alt={images.kaabaTowers.alt} fill sizes="(min-width: 1024px) 22rem, 70vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-night-950/60 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Registration ─────────────────────────────────────────────────── */}
      <section className="section-ivory border-b border-sand-200">
        <div className="container-x grid gap-12 py-24 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-16 lg:py-28">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <p className="eyebrow reveal">Before you pay anyone</p>
            <h2 className="h-section reveal mt-4">Registration</h2>
            <p className="reveal mt-7 max-w-xl text-[1.1rem] leading-relaxed text-ink-700">
              Since July 2026, only umrah companies verified by Pakistan&apos;s Ministry of Religious Affairs (MoRA) may provide umrah services, and
              MoRA publishes the approved list.{" "}
              <strong className="font-bold text-ink-950 underline decoration-gold-400 decoration-2 underline-offset-[6px]">
                Always check an agent against it before paying.
              </strong>
            </p>
          </div>

          <div className="reveal relative overflow-hidden rounded-[28px] border border-gold-400/45 bg-[linear-gradient(165deg,#fffdf8,#f7efdf)] p-6 shadow-[0_40px_80px_-50px_rgb(20_17_13/0.6)] sm:p-9">
            <span aria-hidden className="pointer-events-none absolute inset-2 rounded-[22px] border border-gold-400/20" />
            <span aria-hidden className="pointer-events-none absolute -right-16 -top-16 text-gold-400/15">
              <StarSeal className="h-56 w-56" strokeWidth={0.6} />
            </span>
            <div className="relative flex items-center gap-4">
              <ArtPlate art={SealArt} size="sm" />
              <div>
                <p className="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-gold-700">{site.name}</p>
                <p className="mt-1 font-display text-[1.7rem] font-semibold leading-tight text-ink-950">Our registration</p>
              </div>
            </div>

            <div className="relative mt-7 space-y-5 text-[1rem] leading-relaxed text-ink-700">
              {operatorDisclosure() && (
                <p className="rounded-2xl border border-haram-600/20 bg-haram-50 px-5 py-4 text-haram-900">
                  <strong>{operatorDisclosure()}</strong>
                </p>
              )}
              {licences.length > 0 ? (
                <ul className="divide-y divide-gold-400/25 overflow-hidden rounded-2xl border border-gold-400/30 bg-[#fffdf9]">
                  {licences.map((l) => (
                    <li key={l.label} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-3.5">
                      <strong className="text-[0.95rem] text-ink-950">{l.label}:</strong> <span className="figure font-bold text-haram-800">{l.value}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-2xl border border-gold-400/30 bg-[#fffdf9] px-5 py-5">
                  <p>
                    Ask us for our registration documents on WhatsApp or at the office - we will share them before you pay anything. You should ask
                    any agent for the same.
                  </p>
                  <a
                    href={whatsappLink("Assalam o Alaikum, please share your registration documents.")}
                    className="btn btn-wa mt-5"
                    rel="nofollow"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    Ask on WhatsApp
                  </a>
                </div>
              )}
              <p className="flex gap-3 border-t border-gold-400/25 pt-5 text-[0.88rem] text-ink-500">
                <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                <span>
                  {site.name} is a private travel agency, not affiliated with the Ministry of Hajj and Umrah of Saudi Arabia, Nusuk, or the Government
                  of Pakistan. Umrah visas are issued at the discretion of the Saudi authorities.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Visit us ─────────────────────────────────────────────────────── */}
      <section className="container-x py-24 lg:py-28">
        <div className="reveal grid overflow-hidden rounded-[30px] border border-sand-300 bg-[#fffdf9] shadow-[0_40px_80px_-56px_rgb(20_17_13/0.6)] lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-7 sm:p-12">
            <p className="eyebrow">Come and meet us</p>
            <h2 className="h-section mt-4">
              Visit <em className="accent">us</em>
            </h2>
            <p className="mt-8 space-y-4 text-[1.05rem] leading-relaxed text-ink-800">
              <span className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-night-900 text-gold-300">
                  <PinIcon className="h-5 w-5" />
                </span>
                <span className="pt-2.5 font-semibold text-ink-950">{fullAddress() || `${site.contact.address.city}, Pakistan`}.</span>
              </span>{" "}
              <span className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-night-900 text-gold-300">
                  <ClockIcon className="h-5 w-5" />
                </span>
                <span className="pt-2.5">{site.contact.hoursSummary}.</span>
              </span>{" "}
              <span className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-night-900 text-gold-300">
                  <ArrowRightIcon className="h-5 w-5" />
                </span>
                <span className="pt-2.5">
                  <Link href="/contact/" className="font-semibold text-haram-800 underline decoration-gold-400 underline-offset-4 transition hover:text-haram-950">
                    Directions and contact details
                  </Link>
                  .
                </span>
              </span>
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact/" className="btn btn-primary btn-lg">
                Directions & contact
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <a href={whatsappLink("Assalam o Alaikum, I'd like to ask about Umrah packages.")} className="btn btn-wa btn-lg" rel="nofollow">
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp us
              </a>
            </div>
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-ink-500">
              <span className="h-1.5 w-1.5 rounded-full bg-wa-500 animate-pulse-dot" />
              {site.contact.whatsappHours}
            </p>
          </div>
          <div className="relative min-h-[20rem] overflow-hidden bg-night-900 lg:min-h-0">
            <Image src={images.nabawiUmbrellas.src} alt={images.nabawiUmbrellas.alt} fill sizes="(min-width: 1024px) 34vw, 92vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-night-950/70 via-night-950/10 to-transparent lg:bg-gradient-to-r lg:from-[#fffdf9] lg:via-transparent lg:to-transparent" />
            <div aria-hidden className="absolute inset-4 rounded-[22px] border border-gold-300/35" />
          </div>
        </div>

        <Ornament className="mx-auto mt-20 max-w-md" />
        <div className="mt-16">
          <TrustPoints />
        </div>
      </section>

      <CtaBand title="Speak to us before you book anywhere" />
    </>
  );
}
