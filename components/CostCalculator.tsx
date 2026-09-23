"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AnimatedNumber from "./AnimatedNumber";
import { BusIcon, HotelIcon, PassportIcon, PlaneIcon, WhatsAppIcon } from "./Icons";
import { FINDER_DAYS, FINDER_ROOMS, FINDER_TIERS, matchPackage, pkr, type FinderPackage } from "@/lib/finder";
import type { RoomBasis, Tier } from "@/lib/packages";
import { trackConversion } from "@/lib/track";
import { withGreeting } from "@/lib/site";

/**
 * Umrah cost calculator. No competitor in the SERP research had one; it gives
 * pilgrims a real number in seconds and turns that number into a WhatsApp lead.
 *
 * It never invents prices: it finds the closest real package (same hotel tier,
 * nearest length) and multiplies its per-person price. The page around it is
 * server-rendered, so crawlers still get all the text.
 */

function People({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5" aria-hidden>
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} viewBox="0 0 12 16" className="h-3.5 w-2.5" fill="currentColor">
          <circle cx="6" cy="3.5" r="3" />
          <path d="M0.5 16v-3.2C0.5 9.9 2.9 8 6 8s5.5 1.9 5.5 4.8V16z" />
        </svg>
      ))}
    </span>
  );
}

export default function CostCalculator({
  packages,
  whatsapp,
  pricesChecked,
}: {
  packages: FinderPackage[];
  whatsapp: string;
  pricesChecked: string;
}) {
  const [days, setDays] = useState(15);
  const [tier, setTier] = useState<Tier>("3-star");
  const [room, setRoom] = useState<RoomBasis>("quad");
  const [adults, setAdults] = useState(2);

  const m = useMemo(() => matchPackage(packages, days, tier, room), [packages, days, tier, room]);
  const roomLabel = (r: RoomBasis) => FINDER_ROOMS.find((x) => x.id === r)!;
  const tierLabel = FINDER_TIERS.find((t) => t.id === tier)!.label;

  function onAsk() {
    if (!m) return;
    trackConversion("lead", { page: window.location.pathname, source: "calculator" });
    const text = [
      "Assalam o Alaikum, I used your Umrah cost calculator:",
      `I want: ${days} days, ${tierLabel}, ${roomLabel(room).label} room, ${adults} adult(s).`,
      `Estimate shown: ${pkr(m.perPerson)} per person, ${pkr(m.perPerson * adults)} total (${m.pkg.name}, ${roomLabel(m.usedRoom).label} room).`,
      "Please confirm the price and available dates.",
    ].join("\n");
    window.location.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(withGreeting(text))}`;
  }

  const legend = "text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-ink-500";

  return (
    <div className="card reveal overflow-hidden">
      <div className="grid lg:grid-cols-[1.25fr_1fr]">
        <div className="space-y-7 p-6 sm:p-8">
          <fieldset>
            <legend className={legend}>Number of days</legend>
            <div className="seg mt-3">
              {FINDER_DAYS.map((d) => (
                <button key={d} type="button" className="seg-btn figure min-w-[3.4rem]" aria-pressed={days === d} onClick={() => setDays(d)}>
                  {d} days
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className={legend}>Hotel</legend>
            <div className="seg mt-3">
              {FINDER_TIERS.map((t) => (
                <button key={t.id} type="button" className="seg-btn" aria-pressed={tier === t.id} onClick={() => setTier(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className={legend}>Room</legend>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {FINDER_ROOMS.map((r) => {
                const on = room === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setRoom(r.id)}
                    className={`flex flex-col items-start gap-2 rounded-2xl border px-4 py-3 text-left transition duration-300 ${
                      on ? "border-night-900 bg-night-900 text-sand-50 shadow-[0_14px_28px_-16px_rgb(3_11_9/0.8)]" : "border-sand-300 bg-[#fffdf9] text-ink-800 hover:border-haram-600"
                    }`}
                  >
                    <span className={on ? "text-gold-300" : "text-gold-600"}>
                      <People n={r.beds} />
                    </span>
                    <span className="text-[0.9rem] font-bold leading-none">{r.label}</span>
                    <span className={`text-[0.72rem] ${on ? "text-sand-200/80" : "text-ink-500"}`}>{r.people}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
          <div>
            <label htmlFor="calc-adults" className={legend}>
              Adults
            </label>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-sand-300 bg-[#fffdf9] text-xl font-bold transition hover:border-haram-600"
                onClick={() => setAdults((a) => Math.max(1, a - 1))}
                aria-label="One fewer adult"
              >
                -
              </button>
              <input
                id="calc-adults"
                type="number"
                min={1}
                max={40}
                value={adults}
                onChange={(e) => setAdults(Math.min(40, Math.max(1, Number(e.target.value) || 1)))}
                className="figure w-16 rounded-xl border border-sand-300 bg-[#fffdf9] py-2.5 text-center text-lg font-bold"
              />
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-sand-300 bg-[#fffdf9] text-xl font-bold transition hover:border-haram-600"
                onClick={() => setAdults((a) => Math.min(40, a + 1))}
                aria-label="One more adult"
              >
                +
              </button>
              <span className="text-sm text-ink-500">Children quoted separately</span>
            </div>
          </div>
        </div>

        <div className="section-night on-dark relative flex flex-col justify-between overflow-hidden p-6 sm:p-8" aria-live="polite">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-400/15 blur-3xl" />
          {m ? (
            <>
              <div className="relative">
                <p className="eyebrow">Estimated cost</p>
                <p className="mt-4 text-[2.6rem] font-extrabold leading-none text-sand-50 sm:text-[3.1rem]">
                  <AnimatedNumber value={m.perPerson * adults} prefix="PKR " />
                </p>
                <p className="figure mt-2 text-sand-200/85">
                  {pkr(m.perPerson)} per person × {adults}
                </p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="font-display text-[1.45rem] leading-tight text-sand-50">{m.pkg.shortName}</p>
                  <div className="mt-3 flex h-1.5 gap-1 overflow-hidden rounded-full" aria-hidden>
                    <span className="rounded-full bg-sand-50/80" style={{ width: `${(m.pkg.nights.makkah / (m.pkg.nights.makkah + m.pkg.nights.madinah)) * 100}%` }} />
                    <span className="flex-1 rounded-full bg-haram-500" />
                  </div>
                  <p className="mt-1.5 flex justify-between text-[0.75rem] font-semibold text-sand-200/75">
                    <span>{m.pkg.nights.makkah} nights Makkah</span>
                    <span>{m.pkg.nights.madinah} nights Madinah</span>
                  </p>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-sand-200/80">
                  {m.exact ? (
                    <>
                      Based on our <span className="font-semibold text-gold-300">{m.pkg.name}</span>.
                    </>
                  ) : (
                    <>
                      We don&apos;t publish a {days}-day {tierLabel} package with a {roomLabel(room).label.toLowerCase()} room yet. This is our
                      closest: <span className="font-semibold text-gold-300">{m.pkg.name}</span>, {roomLabel(m.usedRoom).label.toLowerCase()} room.
                      Ask us to quote your exact plan.
                    </>
                  )}{" "}
                  Prices checked {pricesChecked}.
                </p>
                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.78rem] font-semibold text-sand-100" aria-label="Included">
                  <li className="flex items-center gap-1.5">
                    <PassportIcon className="h-4 w-4 text-gold-300" /> Visa
                  </li>
                  <li className="flex items-center gap-1.5">
                    <PlaneIcon className="h-4 w-4 text-gold-300" /> Return flights
                  </li>
                  <li className="flex items-center gap-1.5">
                    <HotelIcon className="h-4 w-4 text-gold-300" /> Hotels
                  </li>
                  <li className="flex items-center gap-1.5">
                    <BusIcon className="h-4 w-4 text-gold-300" /> Transport
                  </li>
                </ul>
              </div>
              <div className="relative mt-7 grid gap-2.5">
                <button type="button" onClick={onAsk} className="btn btn-wa btn-lg w-full">
                  <WhatsAppIcon className="h-5 w-5" />
                  Confirm this price on WhatsApp
                </button>
                <Link href={`/umrah-packages/${m.pkg.slug}/`} className="btn btn-ghost w-full">
                  View the package
                </Link>
              </div>
            </>
          ) : (
            <p>Tell us your plan on WhatsApp and we&apos;ll quote it.</p>
          )}
        </div>
      </div>
    </div>
  );
}
