import { season } from "@/lib/season";

/**
 * The 1448H Umrah season as a small calendar chart: month columns, the December
 * holidays and Ramadan as bands on the track, and the Saudi deadlines that close
 * the season before Hajj as numbered pins. Every date comes from lib/season.ts.
 *
 * The deadlines sit close together, so the pins hang below the track in two
 * staggered rows (they never collide, even at phone width) and the legend
 * underneath names them. That legend is also what screen readers and crawlers
 * read; the chart itself is aria-hidden.
 */

const t = (iso: string) => Date.parse(`${iso}T00:00:00Z`);

export default function SeasonTimeline({ onDark = false }: { onDark?: boolean }) {
  const start = t("2026-10-01");
  const end = t("2027-06-01");
  const pos = (iso: string) => ((t(iso) - start) / (end - start)) * 100;
  const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"].map((m, i) => ({
    m,
    x: pos(new Date(Date.UTC(2026, 9 + i, 1)).toISOString().slice(0, 10)),
  }));
  const p = season.umrahPause;
  const markers = [
    { n: 1, iso: p.lastVisaISO, label: "Last Umrah visa", date: p.lastVisa },
    { n: 2, iso: p.lastEntryISO, label: "Last entry to Saudi Arabia", date: p.lastEntry },
    { n: 3, iso: p.finalDepartureISO, label: "Final departure", date: p.finalDeparture },
    { n: 4, iso: p.nextSeasonISO, label: "Next season", date: `expected ${p.nextSeasonExpected}` },
  ];
  const holidays = { a: pos(season.decemberHolidaysISO.start), b: pos(season.decemberHolidaysISO.end) };
  const ramadan = { a: pos(season.ramadan.startISO), b: pos(season.ramadan.endISO) };
  const closed = pos(p.finalDepartureISO);

  const tone = onDark
    ? {
        frame: "border-white/10 bg-white/[0.03]",
        title: "text-sand-50",
        muted: "text-sand-200/60",
        ink: "text-sand-100",
        grid: "bg-white/[0.07]",
        track: "bg-white/[0.08]",
        stem: "bg-gold-300/50",
        badge: "bg-gold-300 text-night-900 ring-night-900",
        legend: "border-white/10 bg-white/[0.03]",
        holiday: "border-gold-300/60 bg-gold-400/45",
        ramadan: "border-haram-200/40 bg-haram-500/60",
      }
    : {
        frame: "border-sand-300 bg-[#fffdf9] shadow-[0_18px_40px_-30px_rgb(20_17_13/0.35)]",
        title: "text-ink-950",
        muted: "text-ink-500",
        ink: "text-ink-900",
        grid: "bg-sand-300/60",
        track: "bg-sand-200",
        stem: "bg-gold-500/60",
        badge: "bg-night-900 text-gold-300 ring-[#fffdf9]",
        legend: "border-sand-200 bg-sand-50",
        holiday: "border-gold-500/60 bg-gold-300/60",
        ramadan: "border-haram-600/40 bg-haram-600/45",
      };
  const badge = `figure flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-extrabold ring-[3px] ${tone.badge}`;

  return (
    <figure className={`not-prose reveal relative overflow-hidden rounded-[26px] border p-6 sm:p-8 ${tone.frame}`}>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5">
        <span className={`font-display text-[1.65rem] font-semibold leading-tight ${tone.title}`}>The {season.hijriYear}H Umrah season</span>
        <span className={`text-[0.8rem] ${tone.muted}`}>Islamic dates are expected, subject to moon sighting</span>
      </figcaption>

      <div aria-hidden className="relative mt-8 h-[9.5rem] sm:h-[9rem]">
        {/* Month columns */}
        {months.map((m) => (
          <span key={m.m} className="absolute inset-y-0" style={{ left: `${m.x}%` }}>
            <span className={`absolute inset-y-0 left-0 w-px ${tone.grid}`} />
            <span className={`absolute left-1.5 top-0 text-[0.68rem] font-bold uppercase tracking-[0.08em] ${tone.muted}`}>{m.m}</span>
          </span>
        ))}

        {/* Band labels: the holidays label ends at its band, Ramadan's starts at its band, so they never meet. */}
        <span
          className={`absolute top-[1.55rem] whitespace-nowrap text-[0.7rem] font-extrabold ${tone.ink}`}
          style={{ right: `${100 - holidays.b}%` }}
        >
          School holidays
        </span>
        <span className={`absolute top-[1.55rem] whitespace-nowrap text-[0.7rem] font-extrabold ${tone.ink}`} style={{ left: `${ramadan.a}%` }}>
          Ramadan
        </span>

        {/* Track: open for Umrah until the final departure date, then closed until the next season. */}
        <div className={`absolute inset-x-0 top-[3.1rem] h-2 rounded-full ${tone.track}`} />
        <div
          className="absolute left-0 top-[3.1rem] h-2 rounded-full bg-gradient-to-r from-haram-500 via-haram-500/70 to-haram-500/30"
          style={{ width: `${closed}%` }}
        />
        <div
          className={`absolute top-[2.6rem] h-5 rounded-md border ${tone.holiday}`}
          style={{ left: `${holidays.a}%`, width: `${Math.max(holidays.b - holidays.a, 1.6)}%` }}
        />
        <div className={`absolute top-[2.6rem] h-5 rounded-md border ${tone.ramadan}`} style={{ left: `${ramadan.a}%`, width: `${ramadan.b - ramadan.a}%` }} />

        {/* Deadline pins, staggered in two rows below the track. */}
        {markers.map((mk, i) => {
          const low = i % 2 === 1;
          return (
            <span key={mk.n} className="absolute top-[3.35rem] -translate-x-1/2" style={{ left: `${pos(mk.iso)}%` }}>
              <span className={`mx-auto block w-px ${tone.stem} ${low ? "h-[3.4rem]" : "h-[1.6rem]"}`} />
              <span className={badge}>{mk.n}</span>
            </span>
          );
        })}
      </div>

      <ul className={`mt-6 grid gap-2 text-[0.9rem] sm:grid-cols-2 ${tone.ink}`}>
        {markers.map((mk) => (
          <li key={mk.n} className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 ${tone.legend}`}>
            <span className={badge} aria-hidden>
              {mk.n}
            </span>
            <span className="leading-snug">
              <span className="font-bold">{mk.label}:</span> {mk.date}
            </span>
          </li>
        ))}
        <li className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 ${tone.legend}`}>
          <span aria-hidden className={`h-3.5 w-6 shrink-0 rounded border ${tone.ramadan}`} />
          <span className="leading-snug">
            <span className="font-bold">Ramadan:</span> expected {season.ramadan.short}
          </span>
        </li>
        <li className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 ${tone.legend}`}>
          <span aria-hidden className={`h-3.5 w-6 shrink-0 rounded border ${tone.holiday}`} />
          <span className="leading-snug">
            <span className="font-bold">School holidays:</span> from about 21 December
          </span>
        </li>
      </ul>
    </figure>
  );
}
