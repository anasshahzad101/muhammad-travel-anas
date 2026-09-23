import Link from "next/link";
import { ArrowRightIcon, PlaneIcon } from "../Icons";
import { StarGlyph } from "./icons";

/**
 * Typical return fares as one boarding pass per departure city. Each pass is
 * two pieces (the ticket and its stub) whose masks cut half a notch each, so
 * together they read as one perforated card; a drop-shadow on the wrapper
 * follows the notches. The route is written out in full for screen readers
 * and crawlers ("Karachi (KHI) - Jeddah (JED)"), and drawn as airport codes.
 */

export type FarePass = {
  city: string;
  code: string;
  airport: string;
  flight: string;
  fare: string;
  href: string;
  /** A short ribbon on the pass, e.g. "Often cheapest". */
  tag?: string;
};

const R = 13;
const cut = (y: "0" | "100%") =>
  `radial-gradient(circle ${R}px at 0 ${y}, #0000 97%, #000) left / 51% 100% no-repeat, radial-gradient(circle ${R}px at 100% ${y}, #0000 97%, #000) right / 51% 100% no-repeat`;
const CUT_BOTTOM = cut("100%");
const CUT_TOP = cut("0");

export default function FarePasses({
  passes,
  to,
  fareLabel,
  checked,
}: {
  passes: FarePass[];
  to: { city: string; code: string };
  /** The fare's label, e.g. "Return economy, per person". */
  fareLabel: string;
  checked: string;
}) {
  return (
    <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
      {passes.map((p, i) => (
        <li
          key={p.code}
          className={`reveal flex ${i === 2 ? "md:col-span-2 md:mx-auto md:w-[calc(50%-1rem)] lg:col-span-1 lg:mx-0 lg:w-auto" : ""}`}
          style={{ "--i": i } as React.CSSProperties}
        >
          <article className="group @container relative flex w-full flex-col transition-transform duration-700 ease-out-expo hover:[transform:translateY(-6px)] [filter:drop-shadow(0_1px_1px_rgb(20_17_13/0.08))_drop-shadow(0_24px_28px_rgb(20_17_13/0.17))]">
            {/* The ticket */}
            <div className="overflow-hidden rounded-t-[24px] bg-[#fffdf9]" style={{ WebkitMask: CUT_BOTTOM, mask: CUT_BOTTOM }}>
              <header className="section-night grain relative overflow-hidden px-6 pb-6 pt-5 sm:px-7">
                <div aria-hidden className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-gold-400/15 blur-2xl" />
                <div className="relative flex h-6 items-center justify-between gap-2 whitespace-nowrap text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-gold-300">
                  <span className="flex items-center gap-2">
                    <StarGlyph className="h-2.5 w-2.5 shrink-0" />
                    Umrah return
                  </span>
                  {p.tag ? <span className="rounded-full bg-gold-300 px-2.5 py-1 text-[0.6rem] tracking-[0.08em] text-ink-950">{p.tag}</span> : null}
                </div>

                <div aria-hidden className="relative mt-6 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4">
                  <span className="figure text-[2.7rem] font-extrabold leading-none tracking-[-0.02em] text-sand-50 sm:text-[3rem]">{p.code}</span>
                  <span className="relative flex items-center">
                    <span className="h-px w-full bg-[repeating-linear-gradient(90deg,rgb(230_199_127/0.55)_0_5px,transparent_5px_10px)]" />
                    <span className="absolute left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-gold-300/40 bg-night-900 text-gold-300 transition-transform duration-700 ease-out-expo group-hover:translate-x-[calc(-50%+10px)]">
                      <PlaneIcon className="h-4 w-4 rotate-45" />
                    </span>
                  </span>
                  <span className="figure text-[2.7rem] font-extrabold leading-none tracking-[-0.02em] text-sand-50 sm:text-[3rem]">{to.code}</span>
                </div>
                {/* The heading reads "Karachi (KHI) - Jeddah (JED)"; the codes are drawn large above it. */}
                <h3 className="relative mt-2 flex justify-between gap-4 font-display text-[1.2rem] font-semibold leading-none text-gold-200">
                  <span>
                    {p.city}
                    <span className="sr-only"> ({p.code}) -</span>
                  </span>{" "}
                  <span>
                    {to.city}
                    <span className="sr-only"> ({to.code})</span>
                  </span>
                </h3>
              </header>

              <dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-5 gap-y-4 px-6 pb-7 pt-5 sm:px-7">
                <div className="col-span-2">
                  <dt className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-ink-500">Departs from</dt>
                  <dd className="mt-1 text-[0.95rem] font-semibold leading-snug text-ink-900">{p.airport}</dd>
                </div>
                <div>
                  <dt className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-ink-500">Flight time</dt>
                  <dd className="figure mt-1 text-[0.95rem] font-semibold text-ink-900">{p.flight}</dd>
                </div>
                <div className="text-right">
                  <dt className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-ink-500">Class</dt>
                  <dd className="mt-1 text-[0.95rem] font-semibold text-ink-900">Economy</dd>
                </div>
              </dl>
            </div>

            {/* The stub */}
            <div className="relative flex flex-1 flex-col rounded-b-[24px] bg-[#fffdf9] px-6 pb-5 pt-6 sm:px-7" style={{ WebkitMask: CUT_TOP, mask: CUT_TOP }}>
              <span aria-hidden className="absolute left-[1.35rem] right-[1.35rem] top-0 h-0.5 bg-[repeating-linear-gradient(90deg,var(--color-sand-300)_0_7px,transparent_7px_13px)]" />
              <dl className="mb-4">
                <dt className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-gold-700">{fareLabel}</dt>
                <dd className="figure mt-1.5 whitespace-nowrap text-[clamp(1.35rem,5.6vw,1.6rem)] font-extrabold leading-none text-ink-950 md:text-[1.45rem] xl:text-[1.65rem]">
                  {p.fare}
                </dd>
                <dd className="mt-1.5 text-[0.76rem] text-ink-500">Checked {checked}</dd>
              </dl>
              <div className="mt-auto flex items-end justify-between gap-3 border-t border-sand-200 pt-3">
                <Link href={p.href} className="link-arrow min-h-11 text-[0.84rem]">
                  Umrah packages from {p.city}
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <Barcode seed={i} className="mb-2 hidden h-8 w-12 shrink-0 text-ink-800/75 @min-[22.5rem]:block" />
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}

/** Decorative barcode; widths are fixed (per pass) so server and client agree. */
function Barcode({ seed, className = "" }: { seed: number; className?: string }) {
  const base = [2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 1, 3, 2, 1, 2];
  const bars = [...base.slice(seed * 4), ...base.slice(0, seed * 4)];
  let x = 0;
  const rects = bars.map((w, k) => {
    const r = k % 2 === 0 ? <rect key={k} x={x} y={0} width={w} height={30} /> : null;
    x += w + 1;
    return r;
  });
  return (
    <svg viewBox={`0 0 ${x} 30`} preserveAspectRatio="none" className={className} fill="currentColor" aria-hidden>
      {rects}
    </svg>
  );
}
