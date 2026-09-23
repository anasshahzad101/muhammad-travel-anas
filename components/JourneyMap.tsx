"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRightIcon, PlaneIcon } from "./Icons";
import { CITIES, FLIGHT_ARCS, LAND_PATH, MAP_VIEWBOX, PATH_LENGTHS, RAIL_PATH, SEA_LABELS, type CityId } from "@/lib/geo-map";
import { graticule, nightLights } from "@/lib/night-lights";

/**
 * The journey from Pakistan, to scale, as a night satellite would see it: the
 * region's cities as points of light, the flights to Jeddah and Madinah drawn
 * in gold, and the Haramain railway linking Makkah, Jeddah and Madinah.
 *
 * "Play the flight" turns it into the moving map from a seat-back screen: the
 * view follows the plane from take-off to Jeddah while the distance and time
 * to go count down, with the local time at both ends.
 *
 * Deliberately a landmass with no borders drawn: no political lines, just the
 * coast, the lights, the cities and the routes.
 */

export type DepartureFacts = {
  id: "lahore" | "karachi" | "islamabad";
  city: string;
  airport: string;
  flight: string;
  fare: string;
  href: string;
};

const LABEL_POS = { saudi: { x: 300, y: 318 }, pakistan: { x: 736, y: 214 } };
const VB_W = 1000;
const VB_H = 560;

const reducedStore = {
  subscribe(cb: () => void) {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  },
  get: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  // The server (and hydration) assume reduced motion, so no moving plane is in the HTML.
  server: () => true,
};

// The night lights and graticule are built in the browser only: ~60 KB of dots
// that would otherwise ship in every page's HTML. Hydration renders without them.
type Lights = ReturnType<typeof nightLights> & { grid: string };
let lightsCache: Lights | null = null;
const lightsStore = {
  subscribe: () => () => {},
  get: () => (lightsCache ??= { ...nightLights(), grid: graticule() }),
  server: (): Lights | null => null,
};

const km = (n: number) => `${(Math.round(n / 50) * 50).toLocaleString("en-PK")} km`;

// A small airliner, nose along +x, about 17 units long.
const PLANE =
  "M8.2,0C8.2,-0.75 7.5,-1.05 6.4,-1.05L1.6,-1.05L-2.6,-7.8L-4.3,-7.8L-2.3,-1.05L-6.1,-1.05L-7.9,-3.8L-9.1,-3.8L-8.3,-0.7L-9,0L-8.3,0.7L-9.1,3.8L-7.9,3.8L-6.1,1.05L-2.3,1.05L-4.3,7.8L-2.6,7.8L1.6,1.05L6.4,1.05C7.5,1.05 8.2,0.75 8.2,0Z";

type Pt = [number, number];
type Arc = { a: Pt; c: Pt; b: Pt };

function parseArc(d: string): Arc {
  const n = (d.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  return { a: [n[0], n[1]], c: [n[2], n[3]], b: [n[4], n[5]] };
}
const at = ({ a, c, b }: Arc, t: number): Pt => {
  const u = 1 - t;
  return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]];
};
const slope = ({ a, c, b }: Arc, t: number): Pt => [2 * (1 - t) * (c[0] - a[0]) + 2 * t * (b[0] - c[0]), 2 * (1 - t) * (c[1] - a[1]) + 2 * t * (b[1] - c[1])];
/** The first part of the arc, up to t, as its own quadratic curve (de Casteljau). */
const partial = (arc: Arc, t: number) => {
  const cp: Pt = [arc.a[0] + (arc.c[0] - arc.a[0]) * t, arc.a[1] + (arc.c[1] - arc.a[1]) * t];
  const e = at(arc, t);
  return `M${arc.a[0]},${arc.a[1]}Q${cp[0].toFixed(1)},${cp[1].toFixed(1)},${e[0].toFixed(1)},${e[1].toFixed(1)}`;
};
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** "About 5 hours" -> 300 minutes; "About 4½ hours" -> 270. */
function flightMinutes(text: string) {
  const m = text.match(/(\d+)(½)?/);
  return m ? (Number(m[1]) + (m[2] ? 0.5 : 0)) * 60 : 300;
}
const clock = (zone: string) => new Intl.DateTimeFormat("en-GB", { timeZone: zone, hour: "2-digit", minute: "2-digit" }).format(new Date());
const hm = (min: number) => {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return h ? `${h} h ${String(m).padStart(2, "0")} min` : `${m} min`;
};

const LABEL_PLACE: Record<CityId, string> = {
  jeddah: "translate(-112%,-50%)",
  makkah: "translate(14%,10%)",
  madinah: "translate(-112%,-60%)",
  lahore: "translate(18%,-40%)",
  islamabad: "translate(18%,-70%)",
  karachi: "translate(-20%,40%)",
};
const isOrigin = (id: CityId) => id === "lahore" || id === "karachi" || id === "islamabad";

// Timings of the played flight, in seconds.
const T_IN = 1.8; // zoom from the whole map onto the departure city
const T_FLY = 12.5; // take-off to touchdown
const T_HOLD = 1.6; // on the ground at Jeddah
const T_OUT = 1.8; // back out to the whole map
const FLY_FROM = 0.9;

export default function JourneyMap({
  departures,
  initial = "lahore",
  distances,
  groundNote,
  checked,
}: {
  departures: DepartureFacts[];
  initial?: DepartureFacts["id"];
  distances: Record<string, number>;
  groundNote: string;
  checked: string;
}) {
  const [city, setCity] = useState<DepartureFacts["id"]>(initial);
  const [flying, setFlying] = useState(false);
  const [landed, setLanded] = useState(false);
  const reduced = useSyncExternalStore(reducedStore.subscribe, reducedStore.get, reducedStore.server);
  const lights = useSyncExternalStore(lightsStore.subscribe, lightsStore.get, lightsStore.server);
  const d = departures.find((x) => x.id === city)!;
  const active = (["jeddah", "madinah"] as const).map((to) => ({ to, key: `${city}-${to}` }));
  const code = d.airport.match(/\(([A-Z]{3})\)/)?.[1] ?? "";

  const svgRef = useRef<SVGSVGElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const labelRefs = useRef<Partial<Record<CityId, HTMLSpanElement | null>>>({});
  const hudRefs = useRef<Record<"left" | "time" | "home" | "away", HTMLElement | null>>({ left: null, time: null, home: null, away: null });
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  /** Put the camera (a viewBox) on the map and keep the HTML labels pinned to their cities. */
  function frame(cx: number, cy: number, w: number) {
    const width = clamp(w, 120, VB_W);
    const height = width * (VB_H / VB_W);
    const x0 = clamp(cx - width / 2, 0, VB_W - width);
    const y0 = clamp(cy - height / 2, 0, VB_H - height);
    svgRef.current?.setAttribute("viewBox", `${x0.toFixed(2)} ${y0.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)}`);
    for (const id of Object.keys(CITIES) as CityId[]) {
      const el = labelRefs.current[id];
      if (!el) continue;
      const lx = ((CITIES[id].x - x0) / width) * 100;
      const ly = ((CITIES[id].y - y0) / height) * 100;
      el.style.left = `${lx}%`;
      el.style.top = `${ly}%`;
      el.style.opacity = lx < 2 || lx > 98 || ly < 3 || ly > 97 ? "0" : "";
    }
  }

  function stop() {
    cancelAnimationFrame(raf.current);
    frame(VB_W / 2, VB_H / 2, VB_W);
    setFlying(false);
    setLanded(false);
  }

  function play() {
    if (flying) return stop();
    const arc = parseArc(FLIGHT_ARCS[`${city}-jeddah`]);
    const total = distances[`${city}-jeddah`];
    const minutes = flightMinutes(d.flight);
    const jed = CITIES.jeddah;
    const arrive = { x: jed.x + 30, y: jed.y - 20, w: 300 };
    const whole = { x: VB_W / 2, y: VB_H / 2, w: VB_W };
    setFlying(true);
    setLanded(false);
    let start = 0;
    let lastHud = 0;
    let touched = false;
    const step = (now: number) => {
      if (!start) start = now;
      const e = (now - start) / 1000;
      const fly = clamp((e - FLY_FROM) / T_FLY, 0, 1);
      const s = ease(fly);
      const [px, py] = at(arc, s);
      const [dx, dy] = slope(arc, s);
      const len = Math.hypot(dx, dy) || 1;
      // Follow the plane, looking a little ahead of it
      const follow = { x: px + (dx / len) * 60, y: py + (dy / len) * 40, w: 400 };
      let cam = follow;
      if (e < T_IN) {
        const k = ease(e / T_IN);
        cam = { x: lerp(whole.x, follow.x, k), y: lerp(whole.y, follow.y, k), w: lerp(whole.w, follow.w, k) };
      } else if (fly > 0.82) {
        const k = ease(clamp((fly - 0.82) / 0.18, 0, 1));
        cam = { x: lerp(follow.x, arrive.x, k), y: lerp(follow.y, arrive.y, k), w: lerp(follow.w, arrive.w, k) };
      }
      const tEnd = FLY_FROM + T_FLY;
      if (e > tEnd + T_HOLD) {
        const k = ease(clamp((e - tEnd - T_HOLD) / T_OUT, 0, 1));
        cam = { x: lerp(arrive.x, whole.x, k), y: lerp(arrive.y, whole.y, k), w: lerp(arrive.w, whole.w, k) };
      }
      frame(cam.x, cam.y, cam.w);
      // The plane, turned along its track, shrinking a touch as it lands
      const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
      const scale = 1.25 - Math.max(0, fly - 0.9) * 3;
      planeRef.current?.setAttribute("transform", `translate(${px.toFixed(2)} ${py.toFixed(2)}) rotate(${ang.toFixed(1)}) scale(${scale.toFixed(3)})`);
      planeRef.current?.setAttribute("opacity", fly >= 1 ? String(clamp(1 - (e - tEnd) / 0.6, 0, 1)) : "1");
      const flown = partial(arc, Math.max(0.001, s));
      trailRef.current?.setAttribute("d", flown);
      trackRef.current?.setAttribute("d", flown);
      if (now - lastHud > 90 || fly >= 1) {
        lastHud = now;
        const h = hudRefs.current;
        if (h.left) h.left.textContent = `${(Math.round((total * (1 - s)) / 10) * 10).toLocaleString("en-PK")} km`;
        if (h.time) h.time.textContent = fly >= 1 ? "Arrived" : hm(minutes * (1 - s));
        if (h.home) h.home.textContent = clock("Asia/Karachi");
        if (h.away) h.away.textContent = clock("Asia/Riyadh");
      }
      if (fly >= 1 && !touched) {
        touched = true;
        setLanded(true);
      }
      if (e < tEnd + T_HOLD + T_OUT) raf.current = requestAnimationFrame(step);
      else {
        frame(whole.x, whole.y, whole.w);
        setFlying(false);
      }
    };
    raf.current = requestAnimationFrame(step);
  }

  function pick(id: DepartureFacts["id"]) {
    if (flying) stop();
    setLanded(false);
    setCity(id);
  }

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-14">
      <div>
        <div className="relative">
          <svg
            ref={svgRef}
            viewBox={MAP_VIEWBOX}
            className="h-auto w-full [mask-image:radial-gradient(ellipse_52%_54%_at_50%_50%,#000_58%,transparent_100%)]"
            role="img"
            aria-label={`Night map of flights from ${d.city} to Jeddah and Madinah, and the Haramain railway between Makkah, Jeddah and Madinah.`}
          >
            <defs>
              <pattern id="jm-dots" width="7" height="7" patternUnits="userSpaceOnUse">
                <circle cx="3.5" cy="3.5" r="1.05" fill="#e6c77f" fillOpacity="0.1" />
              </pattern>
              <radialGradient id="jm-bloom">
                <stop offset="0" stopColor="#ffd28a" stopOpacity="0.55" />
                <stop offset="0.35" stopColor="#ffb45e" stopOpacity="0.18" />
                <stop offset="1" stopColor="#ffb45e" stopOpacity="0" />
              </radialGradient>
              <filter id="jm-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" />
              </filter>
              {/* The coastline is ~20 KB of path data: define it once, draw it several times. */}
              <path id="jm-land" d={LAND_PATH} />
            </defs>

            {/* Deep sea, the graticule showing on the water, then the land */}
            <rect x="-20" y="-20" width="1040" height="600" fill="#041119" />
            {lights && <path d={lights.grid} fill="none" stroke="#8fc3d6" strokeOpacity="0.1" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />}
            <use href="#jm-land" fill="#0d1a16" />
            <use href="#jm-land" fill="url(#jm-dots)" />
            <use href="#jm-land" fill="none" stroke="#6fb8cc" strokeOpacity="0.14" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            <use href="#jm-land" fill="none" stroke="#d4ab5a" strokeOpacity="0.3" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />

            {/* The region at night: city lights and the busiest corridors */}
            {lights && (
              <g aria-hidden>
                {lights.blooms.map((b, i) => (
                  <circle key={i} cx={b.x} cy={b.y} r={b.r} fill="url(#jm-bloom)" />
                ))}
                <path d={lights.field} fill="none" stroke="#ffb45e" strokeOpacity="0.4" strokeWidth="1.3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                <path d={lights.core} fill="none" stroke="#ffc978" strokeOpacity="0.14" strokeWidth="6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                <path d={lights.core} fill="none" stroke="#ffe8bf" strokeOpacity="0.9" strokeWidth="1.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </g>
            )}

            {SEA_LABELS.filter((s) => s.name === "Red Sea" || s.name === "Arabian Sea").map((s) => (
              <text
                key={s.name}
                x={s.x}
                y={s.y}
                transform={s.rotate ? `rotate(${s.rotate} ${s.x} ${s.y})` : undefined}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#9fc7ba"
                fillOpacity="0.5"
                fontSize="11"
                letterSpacing="4"
                fontStyle="italic"
              >
                {s.name.toUpperCase()}
              </text>
            ))}
            <g opacity={flying ? 0 : 1} style={{ transition: "opacity 700ms" }}>
              <text x={LABEL_POS.saudi.x} y={LABEL_POS.saudi.y} textAnchor="middle" fill="#fbf7ef" fillOpacity="0.24" fontSize="13" fontWeight="700" letterSpacing="6">
                SAUDI ARABIA
              </text>
              <text x={LABEL_POS.pakistan.x} y={LABEL_POS.pakistan.y} textAnchor="middle" fill="#fbf7ef" fillOpacity="0.24" fontSize="13" fontWeight="700" letterSpacing="6">
                PAKISTAN
              </text>
            </g>

            {/* Every route, faint */}
            {Object.entries(FLIGHT_ARCS).map(([k, path]) => (
              <path key={k} d={path} fill="none" stroke="#e6c77f" strokeOpacity={k.startsWith(city) ? 0 : 0.16} strokeWidth="1" strokeDasharray="3 5" />
            ))}

            {/* The chosen city's routes draw in */}
            {active.map(({ key }, i) => (
              <g key={key} opacity={flying && i === 1 ? 0.35 : 1} style={{ transition: "opacity 600ms" }}>
                <path d={FLIGHT_ARCS[key]} fill="none" stroke="#e6c77f" strokeOpacity={flying ? 0.14 : 0.5} strokeWidth="5" filter="url(#jm-glow)" />
                <path
                  d={FLIGHT_ARCS[key]}
                  fill="none"
                  stroke="#f0d596"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeOpacity={flying && i === 0 ? 0.25 : 1}
                  className="draw-in"
                  style={{ "--len": Math.ceil(PATH_LENGTHS[key]) + 2, "--d": i * 2 } as React.CSSProperties}
                />
                {/* Planes on their way, turning along the arc */}
                {!reduced && !flying && (
                  <g>
                    <circle r="9" fill="#e6c77f" fillOpacity="0.18">
                      <animateMotion dur={`${6 + i * 1.2}s`} repeatCount="indefinite" path={FLIGHT_ARCS[key]} begin={`${2 + i * 0.6}s`} />
                    </circle>
                    <path d={PLANE} fill="#fffaf0" transform="scale(0.9)">
                      <animateMotion dur={`${6 + i * 1.2}s`} repeatCount="indefinite" path={FLIGHT_ARCS[key]} begin={`${2 + i * 0.6}s`} rotate="auto" />
                    </path>
                  </g>
                )}
              </g>
            ))}

            {/* Haramain railway */}
            <path d={RAIL_PATH} fill="none" stroke="#fbf7ef" strokeOpacity="0.85" strokeWidth="2" strokeLinecap="round" />

            {/* The played flight: the track flown so far, and the plane */}
            {flying && (
              <g>
                <path ref={trailRef} fill="none" stroke="#f0d596" strokeOpacity="0.5" strokeWidth="6" filter="url(#jm-glow)" />
                <path ref={trackRef} fill="none" stroke="#fff3d6" strokeWidth="1.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                <g ref={planeRef} transform={`translate(${CITIES[city].x} ${CITIES[city].y})`}>
                  <circle r="14" fill="#ffe7b0" fillOpacity="0.16" />
                  <circle r="7" fill="#ffe7b0" fillOpacity="0.22" />
                  <path d={PLANE} fill="#fffaf0" stroke="#06120f" strokeWidth="0.4" />
                  <circle cx="-3.2" cy="-7.4" r="0.8" fill="#ff5a5a" />
                  <circle cx="-3.2" cy="7.4" r="0.8" fill="#5dff96" />
                </g>
              </g>
            )}

            {/* Cities */}
            {(Object.keys(CITIES) as CityId[]).map((id) => {
              const c = CITIES[id];
              const origin = isOrigin(id);
              const on = id === city || !origin;
              return (
                <g key={id}>
                  {on && <circle cx={c.x} cy={c.y} r={origin ? 13 : 9} fill="#e6c77f" fillOpacity="0.14" className="de-ping" />}
                  {landed && id === "jeddah" && <circle cx={c.x} cy={c.y} r="16" fill="none" stroke="#f0d596" strokeWidth="1" className="de-ping" />}
                  <circle cx={c.x} cy={c.y} r={origin ? 4.5 : 3.6} fill={on ? "#f0d596" : "#6f8f84"} stroke="#06120f" strokeWidth="1.5" />
                </g>
              );
            })}
          </svg>

          {/* City labels as HTML, so they stay crisp at any size. */}
          {(Object.keys(CITIES) as CityId[]).map((id) => {
            const c = CITIES[id];
            const origin = isOrigin(id);
            return (
              <span
                key={id}
                ref={(el) => {
                  labelRefs.current[id] = el;
                }}
                aria-hidden
                className={`pointer-events-none absolute whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide transition-opacity duration-300 sm:text-[12px] ${
                  origin && id !== city ? "text-sand-200/50" : "bg-night-950/70 text-sand-50 backdrop-blur-sm"
                }`}
                style={{ left: `${c.x / 10}%`, top: `${(c.y / 560) * 100}%`, transform: LABEL_PLACE[id] }}
              >
                {c.name}
              </span>
            );
          })}

          {!reduced && (
            <button
              type="button"
              onClick={play}
              aria-pressed={flying}
              className="absolute left-2 top-2 inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-night-950/80 py-1.5 pl-1.5 pr-3.5 text-[0.78rem] font-bold text-gold-200 backdrop-blur-md transition hover:border-gold-300 hover:text-gold-100 sm:left-4 sm:top-4"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-gold-300 text-night-950">
                {flying ? (
                  <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden>
                    <rect x="2" y="2" width="8" height="8" rx="1" fill="currentColor" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 12 12" className="ml-0.5 h-2.5 w-2.5" aria-hidden>
                    <path d="M2.5 1.5v9l8-4.5z" fill="currentColor" />
                  </svg>
                )}
              </span>
              {flying ? "Stop" : "Play the flight"}
            </button>
          )}

          {/* The seat-back screen: what's left of the flight, and the time at both ends */}
          {flying && (
            <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 rounded-2xl border border-white/10 bg-night-950/85 px-4 py-3 backdrop-blur-md sm:absolute sm:inset-x-6 sm:bottom-3 sm:mt-0 sm:grid-cols-4" aria-live="off">
              <HudItem label={landed ? "Landed" : `${code} to JED`}>
                {landed ? (
                  <span className="text-gold-200">Jeddah</span>
                ) : (
                  <span ref={(el) => void (hudRefs.current.left = el)} className="figure">
                    {km(distances[`${city}-jeddah`])}
                  </span>
                )}
              </HudItem>
              <HudItem label="Time to go">
                <span ref={(el) => void (hudRefs.current.time = el)} className="figure">
                  {landed ? "Arrived" : d.flight}
                </span>
              </HudItem>
              <HudItem label={`Time in ${d.city}`}>
                <span ref={(el) => void (hudRefs.current.home = el)} className="figure" />
              </HudItem>
              <HudItem label="Time in Makkah">
                <span ref={(el) => void (hudRefs.current.away = el)} className="figure" />
              </HudItem>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="seg" role="group" aria-label="Departure city">
          {departures.map((x) => (
            <button key={x.id} type="button" className="seg-btn" aria-pressed={city === x.id} onClick={() => pick(x.id)}>
              {x.city}
            </button>
          ))}
        </div>

        <p className="mt-7 flex items-center gap-3 font-display text-[2.1rem] leading-tight text-sand-50">
          {d.city}
          <PlaneIcon className="h-6 w-6 text-gold-300" />
          Jeddah
        </p>
        <p className="mt-1 text-[0.9rem] text-sand-200/70">{d.airport}</p>

        <dl className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <dt className="text-[0.64rem] font-extrabold uppercase tracking-[0.16em] text-gold-300">Flight time</dt>
            <dd className="mt-1 text-[1.25rem] font-extrabold text-sand-50">{d.flight}</dd>
            <dd className="text-[0.76rem] text-sand-200/60">direct, to Jeddah or Madinah</dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <dt className="text-[0.64rem] font-extrabold uppercase tracking-[0.16em] text-gold-300">Distance</dt>
            <dd className="figure mt-1 text-[1.25rem] font-extrabold text-sand-50">{km(distances[`${city}-jeddah`])}</dd>
            <dd className="text-[0.76rem] text-sand-200/60">
              to Jeddah · <span className="figure">{km(distances[`${city}-madinah`])}</span> to Madinah
            </dd>
          </div>
          <div className="col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <dt className="text-[0.64rem] font-extrabold uppercase tracking-[0.16em] text-gold-300">Typical return fare</dt>
            <dd className="figure mt-1 text-[1.25rem] font-extrabold text-sand-50">{d.fare}</dd>
            <dd className="text-[0.76rem] text-sand-200/60">Market range outside peak weeks, checked {checked}. Included in every package.</dd>
          </div>
        </dl>

        <p className="mt-5 flex gap-3 text-[0.9rem] leading-relaxed text-sand-200/80">
          <span aria-hidden className="mt-2 h-0.5 w-5 shrink-0 rounded bg-sand-50/80" />
          {groundNote}
        </p>

        <Link href={d.href} className="link-arrow mt-6">
          Umrah packages from {d.city} <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function HudItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-[0.58rem] font-extrabold uppercase tracking-[0.18em] text-gold-300/90">{label}</p>
      <p className="mt-0.5 truncate text-[0.98rem] font-extrabold text-sand-50 tabular-nums">{children}</p>
    </div>
  );
}
