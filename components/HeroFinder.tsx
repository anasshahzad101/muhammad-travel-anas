"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AnimatedNumber from "./AnimatedNumber";
import { ArrowRightIcon, WhatsAppIcon } from "./Icons";
import { FINDER_DAYS, FINDER_ROOMS, FINDER_TIERS, matchPackage, pkr, type FinderPackage } from "@/lib/finder";
import type { RoomBasis, Tier } from "@/lib/packages";
import { withGreeting } from "@/lib/site";

/**
 * The hero's package finder: three choices, one real package and its real
 * price. The server renders the default choice (15 days, 3-star, quad), so the
 * HTML already contains a complete, quotable answer before any JavaScript runs.
 */
export default function HeroFinder({ packages, whatsapp }: { packages: FinderPackage[]; whatsapp: string }) {
  const [days, setDays] = useState(15);
  const [tier, setTier] = useState<Tier>("3-star");
  const [room, setRoom] = useState<RoomBasis>("quad");
  const m = useMemo(() => matchPackage(packages, days, tier, room), [packages, days, tier, room]);

  const roomLabel = (r: RoomBasis) => FINDER_ROOMS.find((x) => x.id === r)!;
  const waText = m
    ? [
        "Assalam o Alaikum, I found this on your website:",
        `${m.pkg.name}, ${roomLabel(m.usedRoom).label} room, ${pkr(m.perPerson)} per person.`,
        "Please send me available dates.",
      ].join("\n")
    : "Assalam o Alaikum, I'd like to ask about Umrah packages.";

  return (
    <div className="glass-ivory on-light relative rounded-[28px] p-5 text-ink-900 sm:p-7" role="group" aria-labelledby="finder-title">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p id="finder-title" className="eyebrow">
          Find your package
        </p>
        <p className="text-[0.78rem] text-ink-500">Per person · visa, flights, hotels & transport included</p>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-[auto_auto_1fr] md:gap-7">
        <fieldset>
          <legend className="text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-ink-500">Days</legend>
          <div className="seg mt-2">
            {FINDER_DAYS.map((d) => (
              <button key={d} type="button" className="seg-btn figure min-w-[2.9rem]" aria-pressed={days === d} onClick={() => setDays(d)}>
                {d}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-ink-500">Hotel</legend>
          <div className="seg mt-2">
            {FINDER_TIERS.map((t) => (
              <button key={t.id} type="button" className="seg-btn" aria-pressed={tier === t.id} onClick={() => setTier(t.id)} aria-label={t.label}>
                {t.short}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-ink-500">Room</legend>
          <div className="seg mt-2">
            {FINDER_ROOMS.map((r) => (
              <button key={r.id} type="button" className="seg-btn" aria-pressed={room === r.id} onClick={() => setRoom(r.id)} title={r.people}>
                {r.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-6 border-t border-sand-300/80 pt-5" aria-live="polite">
        {m ? (
          <div className="grid items-center gap-5 md:grid-cols-[1fr_auto_auto] md:gap-8">
            <div className="min-w-0">
              <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-gold-700">{m.exact ? "Your package" : "Closest package"}</p>
              <p className="mt-1 font-display text-[1.7rem] font-semibold leading-tight text-ink-950">{m.pkg.shortName}</p>
              <p className="mt-1 text-[0.84rem] text-ink-600">
                {m.pkg.nights.makkah} nights Makkah · {m.pkg.nights.madinah} nights Madinah · Makkah hotel{" "}
                <span className="figure">{m.pkg.makkahDistance}</span>
                {m.exact ? "" : " · ask us to quote your exact plan"}
              </p>
            </div>
            <div className="md:text-right">
              <p className="text-[2.1rem] font-extrabold leading-none text-ink-950 sm:text-[2.4rem]">
                <AnimatedNumber value={m.perPerson} prefix="PKR " />
              </p>
              <p className="mt-1.5 text-[0.8rem] text-ink-500">
                per person · {roomLabel(m.usedRoom).label} room ({roomLabel(m.usedRoom).people})
              </p>
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Link href={`/umrah-packages/${m.pkg.slug}/`} className="btn btn-primary btn-lg">
                View package
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(withGreeting(waText))}`}
                className="btn btn-wa btn-lg !px-4"
                rel="nofollow"
                aria-label="Ask about this package on WhatsApp"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        ) : (
          <p className="text-ink-600">Tell us your plan on WhatsApp and we&apos;ll quote it.</p>
        )}
      </div>
    </div>
  );
}
