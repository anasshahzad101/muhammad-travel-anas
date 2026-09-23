import { StarSeal } from "../StarPattern";
import { StarFrame } from "./icons";

/**
 * The two time limits on one Umrah visa, drawn to scale on a single ruler:
 * a 30-day window to enter, then up to 90 days in the country (one tick per
 * day, 1:3). The rules themselves are the two text blocks; the ruler only
 * illustrates them, so it is hidden from assistive tech.
 */
export function VisaWindow({
  entry,
  stay,
}: {
  entry: { title: string; body: React.ReactNode };
  stay: { title: string; body: React.ReactNode };
}) {
  const ENTRY = 30;
  const STAY = 90;
  const total = ENTRY + STAY;
  const split = (ENTRY / total) * 100;
  const tick = (from: number, to: number) =>
    Array.from({ length: to - from }, (_, k) => {
      const day = from + k;
      const x = day * 10 + 5;
      return `M${x} ${(day - from + 1) % 10 === 0 ? 0 : 7}V20`;
    }).join("");

  return (
    <div className="spotlight reveal relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] p-6 sm:p-9 lg:p-11">
      <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gold-400/10 blur-[80px]" />

      {/* The ruler */}
      <div aria-hidden className="relative">
        <div className="flex text-[0.68rem] font-extrabold uppercase tracking-[0.16em]">
          <span className="text-gold-300" style={{ width: `${split}%` }}>
            <span className="figure">{ENTRY}</span> days
          </span>
          <span className="pl-3 text-haram-200">
            Up to <span className="figure">{STAY}</span> days
          </span>
        </div>
        <div className="relative mt-3">
          <div className="flex h-3 overflow-hidden rounded-full">
            <span className="h-full bg-gradient-to-r from-gold-500 to-gold-300" style={{ width: `${split}%` }} />
            <span className="h-full flex-1 bg-gradient-to-r from-haram-500 to-haram-600/40" />
          </div>
          {[
            { at: 0, shift: 0, fill: "bg-gold-300" },
            { at: split, shift: 10, fill: "bg-sand-50" },
            { at: 100, shift: 20, fill: "bg-haram-200" },
          ].map((m) => (
            <span
              key={m.at}
              className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-[3px] border-night-800 ${m.fill} shadow-[0_0_0_5px_rgb(230_199_127/0.14)]`}
              style={{ left: `calc(${m.at}% - ${m.shift}px)` }}
            />
          ))}
        </div>
        <svg viewBox={`0 0 ${total * 10} 20`} preserveAspectRatio="none" className="mt-2.5 block h-4 w-full" fill="none" strokeWidth="1">
          <path d={tick(0, ENTRY)} stroke="#e6c77f" strokeOpacity="0.75" vectorEffect="non-scaling-stroke" />
          <path d={tick(ENTRY, total)} stroke="#9fc7ba" strokeOpacity="0.5" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="relative mt-2 h-4 text-[0.72rem] font-semibold text-sand-200/70">
          <span className="absolute left-0 whitespace-nowrap">Visa issued</span>
          <span className="absolute whitespace-nowrap" style={{ left: `calc(${split}% + 12px)` }}>
            You enter
          </span>
          <span className="absolute right-0 whitespace-nowrap">You leave</span>
        </div>
      </div>

      {/* The two rules */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-12">
        {[
          { ...entry, n: ENTRY, tone: "text-foil", dot: "bg-gold-300" },
          { ...stay, n: STAY, tone: "text-haram-200", dot: "bg-haram-200" },
        ].map((r) => (
          <div key={r.title} className="flex gap-5">
            <p aria-hidden className={`figure shrink-0 text-[3.6rem] font-extralight leading-[0.8] sm:text-[4.6rem] ${r.tone}`}>
              {r.n}
            </p>
            <div>
              <h3 className="flex items-center gap-2.5 font-display text-[1.55rem] font-semibold leading-tight text-sand-50">
                <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${r.dot}`} />
                {r.title}
              </h3>
              <p className="mt-2 text-[0.98rem] leading-relaxed text-sand-200/80 [&_strong]:font-semibold [&_strong]:text-sand-50">{r.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * One rule on a night section: star-framed icon, title, and the rule itself.
 * `statement` sets a one-line rule large, in the display serif, with a seal
 * behind it, so a short card holds its own next to longer ones.
 */
export function RuleCard({
  icon: Icon,
  title,
  children,
  badge,
  footer,
  statement = false,
  className = "",
  index = 0,
}: {
  icon: (p: { className?: string }) => React.ReactNode;
  title: string;
  children: React.ReactNode;
  badge?: React.ReactNode;
  /** Pinned to the bottom of the card. */
  footer?: React.ReactNode;
  statement?: boolean;
  className?: string;
  index?: number;
}) {
  return (
    <article
      className={`spotlight reveal group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-white/[0.03] p-6 transition duration-500 hover:border-gold-400/40 sm:p-7 ${className}`}
      style={{ "--i": index } as React.CSSProperties}
    >
      {statement ? (
        <StarSeal className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 text-gold-300/[0.09] transition-transform duration-[1.6s] ease-out-expo group-hover:rotate-45" strokeWidth={0.7} />
      ) : null}
      <div className="relative flex items-start justify-between gap-4">
        <StarFrame onDark>
          <Icon className="h-5 w-5" />
        </StarFrame>
        {badge}
      </div>
      <h3 className="relative mt-5 font-display text-[1.5rem] font-semibold leading-tight text-sand-50">{title}</h3>
      <div
        className={`relative mt-2.5 [&_strong]:text-sand-50 ${
          statement
            ? "max-w-[18rem] font-display text-[1.75rem] font-medium italic leading-[1.2] text-gold-200 [&_strong]:font-semibold [&_strong]:not-italic"
            : "text-[0.96rem] leading-relaxed text-sand-200/80 [&_strong]:font-semibold"
        }`}
      >
        {children}
      </div>
      {footer ? <div className="relative mt-auto pt-6">{footer}</div> : null}
    </article>
  );
}
