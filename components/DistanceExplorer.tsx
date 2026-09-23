"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRightIcon, BusIcon } from "./Icons";
import type { TierDistance } from "@/lib/distance";

/**
 * "The walk decides your Umrah": pick a hotel tier and see, to scale, where
 * that band of hotels sits around the Haram, how long the walk takes and what
 * five round trips a day add up to. Every distance comes from package data.
 *
 * All four tiers are server-rendered as the selector list (with their distance
 * and note), so the comparison is fully readable without JavaScript.
 */

const CX = 300;
const CY = 300;
const R0 = 50; // the mosque itself
const RMAX = 262;
const MAXD = 1300;
const rad = (m: number) => R0 + (RMAX - R0) * Math.sqrt(Math.min(m, MAXD) / MAXD);
// Trig results can differ in the last bit between Node and the browser, which
// breaks hydration on SVG attributes; round every computed coordinate.
const q = (n: number) => Math.round(n * 100) / 100;
const RINGS = [100, 400, 800, 1300];
const PACE = 67; // metres per minute, an easy pace through crowds

const fmt = (m: number) => (m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${m} m`);
const range = (a: number, b: number) => (b >= 1000 ? `${(a / 1000).toFixed(1)}-${(b / 1000).toFixed(1)} km` : `${a}-${b} m`);
const mins = (m: number) => Math.max(1, Math.round(m / PACE));
/** Ten one-way walks (five round trips) of a to b metres, as "4.5-7 km". */
const dailyKm = (a: number, b: number) => {
  const f = (m: number) => Math.round(m / 10) / 10;
  const s = (v: number) => v.toFixed(1).replace(/\.0$/, "");
  return f(a) === f(b) ? `${s(f(b))} km` : `${s(f(a))}-${s(f(b))} km`;
};

export default function DistanceExplorer({
  tiers,
  notes,
  initial = "3-star",
}: {
  tiers: TierDistance[];
  notes: Record<string, string>;
  initial?: TierDistance["tier"];
}) {
  const [city, setCity] = useState<"makkah" | "madinah">("makkah");
  const [sel, setSel] = useState(tiers.find((t) => t.tier === initial)?.tier ?? tiers[0].tier);
  const t = tiers.find((x) => x.tier === sel)!;
  const d = t[city];
  const shuttle = city === "makkah" && t.shuttle;
  const r1 = q(rad(d.min));
  const r2 = q(rad(d.max));
  const rm = q((r1 + r2) / 2);
  const angle = -38 * (Math.PI / 180);
  const pin = { x: q(CX + rm * Math.cos(angle)), y: q(CY + rm * Math.sin(angle)) };
  const gate = { x: q(CX + R0 * Math.cos(angle)), y: q(CY + R0 * Math.sin(angle)) };
  const mosque = city === "makkah" ? "Masjid al-Haram" : "Masjid an-Nabawi";

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
      {/* The map */}
      <div className="relative mx-auto aspect-square w-full max-w-[600px]">
        <svg viewBox="0 0 600 600" className="h-full w-full" role="img" aria-label={`${t.label} hotels in ${city === "makkah" ? "Makkah" : "Madinah"} are typically ${range(d.min, d.max)} from ${mosque}.`}>
          <defs>
            <radialGradient id="de-glow">
              <stop offset="0" stopColor="#e6c77f" stopOpacity="0.35" />
              <stop offset="0.4" stopColor="#d4ab5a" stopOpacity="0.08" />
              <stop offset="1" stopColor="#d4ab5a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="de-band" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f0d596" />
              <stop offset="1" stopColor="#b8893b" />
            </linearGradient>
          </defs>

          <circle cx={CX} cy={CY} r={RMAX + 30} fill="url(#de-glow)" />
          {/* Compass rays */}
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={q(CX + R0 * Math.cos(a))}
                y1={q(CY + R0 * Math.sin(a))}
                x2={q(CX + (RMAX + 18) * Math.cos(a))}
                y2={q(CY + (RMAX + 18) * Math.sin(a))}
                stroke="white"
                strokeOpacity={i % 6 === 0 ? 0.09 : 0.035}
                strokeWidth="1"
              />
            );
          })}
          {/* Distance rings */}
          {RINGS.map((m) => (
            <g key={m}>
              <circle cx={CX} cy={CY} r={q(rad(m))} fill="none" stroke="white" strokeOpacity="0.14" strokeDasharray="2 6" />
              <text x={q(CX + rad(m) * Math.cos(-2.3))} y={q(CY + rad(m) * Math.sin(-2.3))} fill="#e6c77f" fillOpacity="0.75" fontSize="12" fontWeight="700" textAnchor="middle" className="figure">
                {fmt(m)}
              </text>
            </g>
          ))}

          {/* The tier's band */}
          <circle
            cx={CX}
            cy={CY}
            r={rm}
            fill="none"
            stroke="url(#de-band)"
            strokeOpacity="0.22"
            strokeWidth={Math.max(6, r2 - r1)}
            style={{ transition: "r 800ms cubic-bezier(0.16,1,0.3,1), stroke-width 800ms cubic-bezier(0.16,1,0.3,1)" }}
          />
          <circle cx={CX} cy={CY} r={r1} fill="none" stroke="#e6c77f" strokeOpacity="0.75" strokeWidth="1.2" style={{ transition: "r 800ms cubic-bezier(0.16,1,0.3,1)" }} />
          <circle cx={CX} cy={CY} r={r2} fill="none" stroke="#e6c77f" strokeOpacity="0.75" strokeWidth="1.2" style={{ transition: "r 800ms cubic-bezier(0.16,1,0.3,1)" }} />

          {/* The walk */}
          <line x1={pin.x} y1={pin.y} x2={gate.x} y2={gate.y} stroke="#fbeecb" strokeWidth="2" strokeDasharray="3 7" strokeLinecap="round" className="de-march" style={{ transition: "all 800ms cubic-bezier(0.16,1,0.3,1)" }} />

          {/* The mosque */}
          <circle cx={CX} cy={CY} r={R0} fill="#0f2721" stroke="#d4ab5a" strokeOpacity="0.8" strokeWidth="1.2" />
          <circle cx={CX} cy={CY} r={R0 - 8} fill="none" stroke="#d4ab5a" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="1 4" />
          {city === "makkah" ? (
            <g transform={`translate(${CX} ${CY}) rotate(45)`}>
              <rect x="-12" y="-12" width="24" height="24" rx="1" fill="#030604" stroke="#e6c77f" strokeWidth="1.2" />
              <rect x="-9.5" y="-9.5" width="19" height="19" fill="none" stroke="#e6c77f" strokeOpacity="0.6" strokeWidth="0.8" />
            </g>
          ) : (
            <g transform={`translate(${CX} ${CY})`}>
              <path d="M -15 8 L -15 2 A 15 15 0 0 1 15 2 L 15 8 Z" fill="#2a8572" stroke="#bcd8cf" strokeWidth="1" />
              <line x1="0" y1="-13" x2="0" y2="-22" stroke="#e6c77f" strokeWidth="1.5" />
              <circle cx="0" cy="-23" r="2" fill="#e6c77f" />
            </g>
          )}

          {/* The hotel */}
          <g style={{ transform: `translate(${pin.x}px, ${pin.y}px)`, transition: "transform 800ms cubic-bezier(0.16,1,0.3,1)" }}>
            <circle r="16" fill="#e6c77f" fillOpacity="0.18" className="de-ping" />
            <circle r="9" fill="#e6c77f" stroke="#06120f" strokeWidth="2" />
            <rect x="-3.5" y="-4" width="7" height="8" rx="1" fill="#06120f" />
          </g>
        </svg>

        {/* Floating readout */}
        <div className="glass pointer-events-none absolute bottom-[3%] left-[2%] rounded-2xl px-4 py-3 text-left sm:px-5 sm:py-4">
          <p className="text-[0.64rem] font-extrabold uppercase tracking-[0.18em] text-gold-300">
            {t.label} · {city === "makkah" ? "Makkah" : "Madinah"}
          </p>
          <p className="figure mt-0.5 text-[1.5rem] font-extrabold leading-tight text-sand-50 sm:text-[1.8rem]">{range(d.min, d.max)}</p>
          <p className="text-[0.78rem] text-sand-200/80">to the nearest gate of {mosque}</p>
        </div>
      </div>

      {/* The controls and numbers */}
      <div>
        <div className="seg" role="group" aria-label="City">
          {(["makkah", "madinah"] as const).map((c) => (
            <button key={c} type="button" className="seg-btn" aria-pressed={city === c} onClick={() => setCity(c)}>
              {c === "makkah" ? "Makkah" : "Madinah"}
            </button>
          ))}
        </div>

        <ul className="mt-6 space-y-2.5">
          {tiers.map((x) => {
            const active = x.tier === sel;
            const dd = x[city];
            return (
              <li key={x.tier}>
                <button
                  type="button"
                  onClick={() => setSel(x.tier)}
                  aria-pressed={active}
                  className={`grid w-full grid-cols-[5.5rem_1fr] items-center gap-4 rounded-2xl border px-5 py-3.5 text-left transition duration-500 sm:grid-cols-[6.5rem_8.5rem_1fr] ${
                    active ? "border-gold-400/50 bg-white/[0.07]" : "border-white/10 hover:border-white/25 hover:bg-white/[0.03]"
                  }`}
                >
                  <span className={`font-display text-[1.45rem] font-semibold leading-none ${active ? "text-sand-50" : "text-sand-100/75"}`}>{x.label}</span>
                  <span className={`figure text-[0.95rem] font-bold ${active ? "text-gold-200" : "text-sand-200/70"}`}>
                    {range(dd.min, dd.max)}
                    {city === "makkah" && x.shuttle ? " + shuttle" : ""}
                  </span>
                  <span className={`col-span-2 text-[0.88rem] leading-snug sm:col-span-1 ${active ? "text-sand-100" : "text-sand-200/60"}`}>{notes[x.tier] ?? x.blurb}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <dl className="mt-7 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <dt className="text-[0.66rem] font-extrabold uppercase tracking-[0.16em] text-gold-300">Each way</dt>
            <dd className="figure mt-1 text-[1.6rem] font-extrabold text-sand-50">
              {shuttle ? (
                <span className="inline-flex items-center gap-2">
                  <BusIcon className="h-6 w-6 text-gold-300" /> Shuttle
                </span>
              ) : (
                `${mins(d.min)}-${mins(d.max)} min`
              )}
            </dd>
            <dd className="text-[0.78rem] text-sand-200/70">{shuttle ? `or ${mins(d.min)}-${mins(d.max)} min on foot` : "at an easy walking pace"}</dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <dt className="text-[0.66rem] font-extrabold uppercase tracking-[0.16em] text-gold-300">Five prayers a day</dt>
            <dd className="figure mt-1 text-[1.6rem] font-extrabold text-sand-50">
              {d.max <= 100 ? "Steps" : dailyKm(d.min, d.max)}
            </dd>
            <dd className="text-[0.78rem] text-sand-200/70">
              {d.max <= 100 ? "from the lobby to the courtyard" : shuttle ? "if you walk all five round trips" : "walked daily, up to five round trips"}
            </dd>
          </div>
        </dl>

        <Link href={t.href} className="link-arrow mt-7">
          See {t.label} packages <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
