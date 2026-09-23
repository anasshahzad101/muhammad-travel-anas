"use client";

import { useMemo, useState } from "react";
import { WhatsAppIcon } from "./Icons";
import { trackConversion } from "@/lib/track";

/**
 * Umrah cost calculator. No competitor in the SERP research had one; it gives
 * pilgrims a real number in seconds and turns that number into a WhatsApp lead.
 *
 * It never invents prices: it finds the closest real package (same hotel tier,
 * nearest length) and multiplies its per-person price. The page around it is
 * server-rendered, so crawlers still get all the text.
 */

export type CalcPackage = {
  slug: string;
  name: string;
  days: number;
  tier: "economy" | "3-star" | "4-star" | "5-star";
  prices: Partial<Record<"sharing" | "quad" | "triple" | "double", number>>;
};

const DAYS = [7, 10, 15, 21, 28];
const TIERS: { id: CalcPackage["tier"]; label: string }[] = [
  { id: "economy", label: "Economy" },
  { id: "3-star", label: "3-Star" },
  { id: "4-star", label: "4-Star" },
  { id: "5-star", label: "5-Star" },
];
const ROOMS: { id: keyof CalcPackage["prices"]; label: string }[] = [
  { id: "sharing", label: "Sharing (5–6)" },
  { id: "quad", label: "Quad (4)" },
  { id: "triple", label: "Triple (3)" },
  { id: "double", label: "Double (2)" },
];

const pkr = (n: number) => `PKR ${Math.round(n).toLocaleString("en-PK")}`;

export default function CostCalculator({
  packages,
  whatsapp,
  pricesChecked,
}: {
  packages: CalcPackage[];
  whatsapp: string;
  pricesChecked: string;
}) {
  const [days, setDays] = useState(15);
  const [tier, setTier] = useState<CalcPackage["tier"]>("3-star");
  const [room, setRoom] = useState<keyof CalcPackage["prices"]>("quad");
  const [adults, setAdults] = useState(2);

  const result = useMemo(() => {
    const sameTier = packages.filter((p) => p.tier === tier);
    if (sameTier.length === 0) return null;
    const pkg = [...sameTier].sort((a, b) => Math.abs(a.days - days) - Math.abs(b.days - days))[0];
    // Use the chosen room if the package offers it, else the nearest available basis.
    const order: (keyof CalcPackage["prices"])[] = ["sharing", "quad", "triple", "double"];
    const idx = order.indexOf(room);
    const available = order.filter((r) => pkg.prices[r]);
    const usedRoom = pkg.prices[room]
      ? room
      : [...available].sort((a, b) => Math.abs(order.indexOf(a) - idx) - Math.abs(order.indexOf(b) - idx))[0];
    const perPerson = pkg.prices[usedRoom]!;
    return { pkg, usedRoom, perPerson, total: perPerson * adults, exact: pkg.days === days && usedRoom === room };
  }, [packages, days, tier, room, adults]);

  const roomLabel = (r: string) => ROOMS.find((x) => x.id === r)?.label ?? r;

  function onAsk() {
    if (!result) return;
    trackConversion("lead", { page: window.location.pathname, source: "calculator" });
    const text = [
      "Assalam o Alaikum, I used your Umrah cost calculator:",
      `I want: ${days} days, ${TIERS.find((t) => t.id === tier)?.label}, ${roomLabel(room)} room, ${adults} adult(s).`,
      `Estimate shown: ${pkr(result.perPerson)} per person, ${pkr(result.total)} total (${result.pkg.name}, ${roomLabel(result.usedRoom)} room).`,
      "Please confirm the price and available dates.",
    ].join("\n");
    window.location.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
  }

  const pill = (active: boolean) =>
    `rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
      active ? "border-haram-800 bg-haram-900 text-sand-50" : "border-sand-300 bg-white text-ink-800 hover:border-haram-600"
    }`;

  return (
    <div className="card overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6 p-6 sm:p-7">
          <fieldset>
            <legend className="text-[0.78rem] font-bold uppercase tracking-wider text-ink-500">Number of days</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {DAYS.map((d) => (
                <button key={d} type="button" className={pill(days === d)} aria-pressed={days === d} onClick={() => setDays(d)}>
                  {d} days
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-[0.78rem] font-bold uppercase tracking-wider text-ink-500">Hotel</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {TIERS.map((t) => (
                <button key={t.id} type="button" className={pill(tier === t.id)} aria-pressed={tier === t.id} onClick={() => setTier(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-[0.78rem] font-bold uppercase tracking-wider text-ink-500">Room</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {ROOMS.map((r) => (
                <button key={r.id} type="button" className={pill(room === r.id)} aria-pressed={room === r.id} onClick={() => setRoom(r.id)}>
                  {r.label}
                </button>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="calc-adults" className="text-[0.78rem] font-bold uppercase tracking-wider text-ink-500">
              Adults
            </label>
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                className="h-10 w-10 rounded-full border border-sand-300 bg-white text-lg font-bold"
                onClick={() => setAdults((a) => Math.max(1, a - 1))}
                aria-label="One fewer adult"
              >
                −
              </button>
              <input
                id="calc-adults"
                type="number"
                min={1}
                max={40}
                value={adults}
                onChange={(e) => setAdults(Math.min(40, Math.max(1, Number(e.target.value) || 1)))}
                className="w-16 rounded-xl border border-sand-300 bg-white py-2 text-center font-semibold"
              />
              <button
                type="button"
                className="h-10 w-10 rounded-full border border-sand-300 bg-white text-lg font-bold"
                onClick={() => setAdults((a) => Math.min(40, a + 1))}
                aria-label="One more adult"
              >
                +
              </button>
              <span className="text-sm text-ink-500">Children quoted separately</span>
            </div>
          </div>
        </div>

        <div className="on-dark flex flex-col justify-between bg-haram-900 p-6 text-sand-100 sm:p-7" aria-live="polite">
          {result ? (
            <>
              <div>
                <p className="eyebrow">Estimated cost</p>
                <p className="mt-3 font-display text-4xl font-semibold text-sand-50">{pkr(result.total)}</p>
                <p className="mt-1 text-sand-200/85">
                  {pkr(result.perPerson)} per person × {adults}
                </p>
                <p className="mt-5 text-sm leading-relaxed text-sand-200/80">
                  {result.exact ? (
                    <>
                      Based on our <span className="font-semibold text-gold-300">{result.pkg.name}</span>.
                    </>
                  ) : (
                    <>
                      We don&apos;t publish a {days}-day {TIERS.find((t) => t.id === tier)?.label} package with a{" "}
                      {roomLabel(room).split(" ")[0].toLowerCase()} room yet. This is our closest:{" "}
                      <span className="font-semibold text-gold-300">{result.pkg.name}</span>,{" "}
                      {roomLabel(result.usedRoom).split(" ")[0].toLowerCase()} room — ask us to quote your exact plan.
                    </>
                  )}{" "}
                  Includes visa, return flights, hotels and transport. Prices checked {pricesChecked}.
                </p>
              </div>
              <div className="mt-6 grid gap-2">
                <button type="button" onClick={onAsk} className="btn btn-wa w-full !min-h-[3rem]">
                  <WhatsAppIcon className="h-5 w-5" />
                  Confirm this price on WhatsApp
                </button>
                <a href={`/umrah-packages/${result.pkg.slug}/`} className="btn btn-ghost w-full">
                  View the package
                </a>
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
