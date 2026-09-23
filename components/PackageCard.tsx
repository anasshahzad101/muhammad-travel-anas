import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, BusIcon, DomeIcon, HotelIcon, PassportIcon, PlaneIcon, StarIcon, WhatsAppIcon } from "./Icons";
import { formatRange, formatWalk, parseDistance } from "@/lib/distance";
import { images } from "@/lib/images";
import { ROOM_BASIS, TIERS, fromPrice, type UmrahPackage } from "@/lib/packages";
import { formatPKR, whatsappLink } from "@/lib/site";

export function Stars({ n, className = "text-gold-500" }: { n: number; className?: string }) {
  return (
    <span className={`inline-flex gap-px ${className}`} role="img" aria-label={`${n} star`}>
      {Array.from({ length: n }).map((_, i) => (
        <StarIcon key={i} className="h-3.5 w-3.5" />
      ))}
    </span>
  );
}

/** The furthest hotel on the site, so every meter shares one scale. */
const SCALE_M = 1300;

/** A to-scale bar: where this hotel's distance band sits between the Haram gate and 1.3 km. */
export function DistanceMeter({ distance, label, shuttle = false }: { distance: string; label: string; shuttle?: boolean }) {
  const r = parseDistance(distance);
  const left = (r.min / SCALE_M) * 100;
  const width = Math.max(4, ((r.max - r.min) / SCALE_M) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-[0.8rem]">
        <span className="font-semibold text-ink-600">{label}</span>
        <span className="figure font-semibold text-ink-900">
          {formatRange(r)}
          <span className="font-medium text-ink-500"> · {shuttle ? "shuttle" : formatWalk(r)}</span>
        </span>
      </div>
      <div className="relative mt-1.5 h-1.5 rounded-full bg-sand-200" aria-hidden>
        <span className="absolute inset-y-0 rounded-full bg-gradient-to-r from-gold-400 to-gold-600" style={{ left: `${left}%`, width: `${width}%` }} />
        <span className="absolute -left-0.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-sand-50 bg-night-900" />
      </div>
    </div>
  );
}

/** Makkah and Madinah nights as one proportional bar. */
export function NightsBar({ p, onDark = false }: { p: UmrahPackage; onDark?: boolean }) {
  const total = p.nights.makkah + p.nights.madinah;
  const first = p.madinahFirst ? "madinah" : "makkah";
  const order = first === "makkah" ? (["makkah", "madinah"] as const) : (["madinah", "makkah"] as const);
  return (
    <div>
      <div className="flex h-1.5 gap-1 overflow-hidden rounded-full" aria-hidden>
        {order.map((c) => (
          <span
            key={c}
            className={c === "makkah" ? `rounded-full ${onDark ? "bg-sand-100/85" : "bg-night-800"}` : "rounded-full bg-haram-500"}
            style={{ width: `${(p.nights[c] / total) * 100}%` }}
          />
        ))}
      </div>
      <p className={`mt-1.5 flex justify-between text-[0.76rem] font-semibold ${onDark ? "text-sand-200/80" : "text-ink-500"}`}>
        {order.map((c) => (
          <span key={c}>
            {p.nights[c]} nights {c === "makkah" ? "Makkah" : "Madinah"}
          </span>
        ))}
      </p>
    </div>
  );
}

export default function PackageCard({ p, priority = false, index = 0 }: { p: UmrahPackage; priority?: boolean; index?: number }) {
  const img = images[p.image];
  const price = fromPrice(p);
  const href = `/umrah-packages/${p.slug}/`;

  return (
    <article className="card card-hover reveal group flex flex-col overflow-hidden" style={{ "--i": index % 3 } as React.CSSProperties}>
      <Link href={href} className="relative block aspect-[16/11] overflow-hidden" tabIndex={-1} aria-hidden>
        <Image
          src={img.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-[1.4s] ease-out-expo group-hover:scale-[1.06]"
          loading={priority ? "eager" : "lazy"}
        />
        <span className="absolute inset-0 bg-gradient-to-t from-night-950/80 via-night-950/10 to-night-950/20" />
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-night-950/60 px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-sand-50 backdrop-blur-md">
          {p.days} days
        </span>
        <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-sand-50/95 px-3 py-1 text-[0.74rem] font-bold text-ink-900">
          {TIERS[p.tier].label}
        </span>
        {p.season && (
          <span className="absolute bottom-4 left-4 rounded-full bg-gold-400 px-3 py-1 text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-ink-950">
            {p.season === "ramadan" ? "Ramadan 2027" : "December 2026"}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[1.7rem] leading-[1.05]">
            <Link href={href} className="transition hover:text-haram-700">
              {p.shortName}
            </Link>
          </h3>
          <Stars n={p.hotels.makkah.stars} className="mt-2 shrink-0 text-gold-500" />
        </div>

        <div className="mt-4">
          <NightsBar p={p} />
        </div>

        <div className="mt-4 space-y-3">
          <DistanceMeter label="Makkah hotel" distance={p.hotels.makkah.distance} shuttle={p.hotels.makkah.shuttle} />
          <DistanceMeter label="Madinah hotel" distance={p.hotels.madinah.distance} />
        </div>

        <ul className="mt-5 flex flex-wrap gap-x-3.5 gap-y-1.5 text-[0.76rem] font-semibold text-haram-800" aria-label="Included">
          <li className="flex items-center gap-1">
            <PassportIcon className="h-4 w-4 text-gold-600" /> Visa
          </li>
          <li className="flex items-center gap-1">
            <PlaneIcon className="h-4 w-4 text-gold-600" /> Flights
          </li>
          <li className="flex items-center gap-1">
            <HotelIcon className="h-4 w-4 text-gold-600" /> Hotels
          </li>
          <li className="flex items-center gap-1">
            <BusIcon className="h-4 w-4 text-gold-600" /> Transport
          </li>
          {p.ziyarat && (
            <li className="flex items-center gap-1">
              <DomeIcon className="h-4 w-4 text-gold-600" /> Ziyarat
            </li>
          )}
        </ul>

        <div className="mt-auto pt-6">
          <div className="flex items-end justify-between gap-3 border-t border-sand-200 pt-5">
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-ink-500">From, per person</p>
              <p className="figure mt-1 text-[1.65rem] font-extrabold leading-none text-ink-950">{formatPKR(price.amount)}</p>
              <p className="mt-1.5 text-[0.75rem] text-ink-500">
                {ROOM_BASIS[price.basis].label} room ({ROOM_BASIS[price.basis].people})
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
            <Link href={href} className="btn btn-primary !min-h-[2.85rem]">
              View package
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <a
              href={whatsappLink(`Assalam o Alaikum, I'm interested in the ${p.name}. Please send me the details.`)}
              className="btn btn-wa !min-h-[2.85rem] !px-3.5"
              rel="nofollow"
              aria-label={`Ask about the ${p.shortName} on WhatsApp`}
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
