import Image from "next/image";
import Link from "next/link";
import { BusIcon, DomeIcon, HotelIcon, PassportIcon, PlaneIcon, StarIcon, WhatsAppIcon } from "./Icons";
import { images } from "@/lib/images";
import { ROOM_BASIS, TIERS, fromPrice, type UmrahPackage } from "@/lib/packages";
import { formatPKR, whatsappLink } from "@/lib/site";

export function Stars({ n, className = "text-gold-500" }: { n: number; className?: string }) {
  return (
    <span className={`inline-flex ${className}`} aria-label={`${n} star`}>
      {Array.from({ length: n }).map((_, i) => (
        <StarIcon key={i} className="h-3.5 w-3.5" />
      ))}
    </span>
  );
}

export default function PackageCard({ p, priority = false }: { p: UmrahPackage; priority?: boolean }) {
  const img = images[p.image];
  const price = fromPrice(p);
  const href = `/umrah-packages/${p.slug}/`;

  return (
    <article className="card group flex flex-col overflow-hidden">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden" tabIndex={-1} aria-hidden>
        <Image
          src={img.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          priority={priority}
        />
        <span className="absolute left-3 top-3 rounded-full bg-haram-950/85 px-3 py-1 text-xs font-bold text-sand-50">
          {p.days} days
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-sand-50/95 px-3 py-1 text-xs font-bold text-ink-900">
          {TIERS[p.tier].label}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[1.3rem] leading-snug">
          <Link href={href} className="hover:text-haram-700">
            {p.shortName}
          </Link>
        </h3>
        <p className="mt-1 text-[0.85rem] text-ink-500">
          {p.nights.makkah} nights Makkah · {p.nights.madinah} nights Madinah
        </p>

        <dl className="mt-4 space-y-2 text-[0.88rem]">
          <div className="flex items-start gap-2">
            <dt className="w-[4.6rem] shrink-0 font-semibold text-ink-500">Makkah</dt>
            <dd className="text-ink-800">
              <Stars n={p.hotels.makkah.stars} />{" "}
              <span className="ml-1">
                {p.hotels.makkah.distance}
                {p.hotels.makkah.shuttle ? " · shuttle" : ""}
              </span>
            </dd>
          </div>
          <div className="flex items-start gap-2">
            <dt className="w-[4.6rem] shrink-0 font-semibold text-ink-500">Madinah</dt>
            <dd className="text-ink-800">
              <Stars n={p.hotels.madinah.stars} /> <span className="ml-1">{p.hotels.madinah.distance}</span>
            </dd>
          </div>
        </dl>

        <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5 text-[0.78rem] font-semibold text-haram-800" aria-label="Included">
          <li className="flex items-center gap-1">
            <PassportIcon className="h-4 w-4" /> Visa
          </li>
          <li className="flex items-center gap-1">
            <PlaneIcon className="h-4 w-4" /> Flights
          </li>
          <li className="flex items-center gap-1">
            <HotelIcon className="h-4 w-4" /> Hotels
          </li>
          <li className="flex items-center gap-1">
            <BusIcon className="h-4 w-4" /> Transport
          </li>
          {p.ziyarat && (
            <li className="flex items-center gap-1">
              <DomeIcon className="h-4 w-4" /> Ziyarat
            </li>
          )}
        </ul>

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3 border-t border-sand-200 pt-4">
            <div>
              <p className="text-[0.72rem] font-bold uppercase tracking-wider text-ink-500">From, per person</p>
              <p className="font-display text-[1.6rem] font-semibold leading-tight text-ink-950">{formatPKR(price.amount)}</p>
              <p className="text-[0.75rem] text-ink-500">
                {ROOM_BASIS[price.basis].label} room ({ROOM_BASIS[price.basis].people})
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
            <Link href={href} className="btn btn-primary !min-h-[2.7rem]">
              View package
            </Link>
            <a
              href={whatsappLink(`Assalam o Alaikum, I'm interested in the ${p.name}. Please send me the details.`)}
              className="btn btn-wa !min-h-[2.7rem] !px-3.5"
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
