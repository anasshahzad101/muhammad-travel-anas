"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { dayBefore, dayLabel, pkDay } from "@/lib/leads/format";
import { leadStatus, type Lead, type LeadStatus } from "@/lib/leads/types";
import { STATUS_META, STATUS_ORDER } from "./status";

/**
 * Leads per day, stacked by status (sent / direct / did not send / no number). Each
 * lead counts once, on the day of its latest activity, so the columns add up
 * to the tiles above. Hover or arrow keys show a day's numbers; "Table" shows
 * them all without hovering.
 */

const H = 188;
const PAD = { top: 12, right: 8, bottom: 26, left: 30 };
const GRID = "#ece5d6";

type Day = { day: string; counts: Record<LeadStatus, number>; total: number };

/** 1, 2, 5, 10, 20, 50 ... the smallest clean step that fits the max in about four gridlines. */
function niceMax(max: number): { top: number; step: number } {
  if (max <= 4) return { top: Math.max(max, 1), step: 1 };
  const raw = max / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((f) => f * mag).find((s) => s >= raw) ?? 10 * mag;
  return { top: Math.ceil(max / step) * step, step };
}

/** A column segment: square at the bottom, 4px rounded at the top when it is the cap. */
function segment(x: number, y: number, w: number, h: number, cap: boolean): string {
  const r = cap ? Math.min(4, w / 2, h) : 0;
  const b = y + h;
  return `M${x},${b}V${y + r}${r ? `Q${x},${y} ${x + r},${y}` : ""}H${x + w - r}${r ? `Q${x + w},${y} ${x + w},${y + r}` : ""}V${b}Z`;
}

const round = (n: number) => Math.round(n * 10) / 10;

export default function LeadsChart({
  leads,
  days: span,
  today,
  dateOf = (l) => l.updatedAt,
}: {
  leads: Lead[];
  days: number;
  today: string;
  /** Which timestamp puts a lead on a day; the dashboard passes "last touched by visitor or team". */
  dateOf?: (l: Lead) => string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(720);
  const [active, setActive] = useState<number | null>(null);
  const [asTable, setAsTable] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
    // The chart div remounts when switching back from the table, so observe it again.
  }, [asTable]);

  const days: Day[] = useMemo(() => {
    const list: Day[] = Array.from({ length: span }, (_, i) => ({
      day: dayBefore(today, span - 1 - i),
      counts: { sent: 0, unsent: 0, direct: 0, anonymous: 0 },
      total: 0,
    }));
    const index = new Map(list.map((d, i) => [d.day, i]));
    for (const l of leads) {
      const i = index.get(pkDay(dateOf(l)));
      if (i === undefined) continue;
      list[i].counts[leadStatus(l)] += 1;
      list[i].total += 1;
    }
    return list;
  }, [leads, span, today, dateOf]);

  const max = Math.max(0, ...days.map((d) => d.total));
  const { top, step } = niceMax(max);
  const plotW = width - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const band = plotW / days.length;
  const barW = Math.max(3, Math.min(24, band * 0.62));
  const y = (v: number) => PAD.top + plotH - (v / top) * plotH;
  const ticks = Array.from({ length: Math.floor(top / step) + 1 }, (_, i) => i * step);
  // Label every nth day so labels sit at least ~64px apart; the latest day always gets one.
  const every = Math.max(1, Math.ceil(64 / band));

  const hovered = active !== null ? days[active] : null;
  const tipLeft = active !== null ? Math.min(Math.max(PAD.left + band * active + band / 2, 90), width - 90) : 0;

  function onKey(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    setActive((a) => {
      if (e.key === "Home") return 0;
      if (e.key === "End") return days.length - 1;
      const start = a ?? days.length - 1;
      return Math.max(0, Math.min(days.length - 1, start + (e.key === "ArrowRight" ? 1 : -1)));
    });
  }

  return (
    <section className="rounded-2xl border border-sand-200 bg-[#fffdf9] p-4 shadow-[0_1px_2px_rgb(20_17_13/0.04)] sm:p-5" aria-labelledby="chart-h">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="chart-h" className="font-body text-[0.95rem] font-bold tracking-normal text-ink-900">
            Leads per day
          </h2>
          <p className="mt-0.5 text-xs text-ink-500">Last {span} days, by latest activity, Pakistan time</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-600" aria-label="Legend">
            {STATUS_ORDER.map((s) => (
              <li key={s} className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: STATUS_META[s].mark }} aria-hidden />
                {STATUS_META[s].label}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setAsTable((t) => !t)}
            aria-pressed={asTable}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-ink-500 ring-1 ring-sand-300 transition hover:bg-sand-100 hover:text-ink-800"
          >
            {asTable ? "Chart" : "Table"}
          </button>
        </div>
      </div>

      {asTable ? (
        <div className="mt-4 max-h-60 overflow-auto rounded-xl ring-1 ring-sand-200">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-sand-100 text-ink-500">
              <tr>
                <th className="px-3 py-2 font-semibold">Day</th>
                {STATUS_ORDER.map((s) => (
                  <th key={s} className="px-3 py-2 text-right font-semibold">
                    {STATUS_META[s].label}
                  </th>
                ))}
                <th className="px-3 py-2 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200 tabular-nums text-ink-800">
              {[...days].reverse().map((d) => (
                <tr key={d.day}>
                  <td className="px-3 py-1.5">{dayLabel(d.day)}</td>
                  {STATUS_ORDER.map((s) => (
                    <td key={s} className="px-3 py-1.5 text-right">
                      {d.counts[s]}
                    </td>
                  ))}
                  <td className="px-3 py-1.5 text-right font-semibold">{d.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div ref={wrap} className="relative mt-3" onPointerLeave={() => setActive(null)}>
          <svg
            width={width}
            height={H}
            className="block max-w-full"
            role="img"
            tabIndex={0}
            onKeyDown={onKey}
            onBlur={() => setActive(null)}
            aria-label={`Leads per day for the last ${span} days. ${days.reduce((n, d) => n + d.total, 0)} in total. Use the arrow keys to read each day, or switch to the table.`}
          >
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD.left} x2={width - PAD.right} y1={round(y(t))} y2={round(y(t))} stroke={GRID} strokeWidth={1} shapeRendering="crispEdges" />
                <text x={PAD.left - 8} y={round(y(t)) + 3.5} textAnchor="end" className="fill-ink-400 text-[10px] tabular-nums">
                  {t}
                </text>
              </g>
            ))}
            {days.map((d, i) => {
              const x = round(PAD.left + band * i + (band - barW) / 2);
              let acc = 0;
              const parts = STATUS_ORDER.filter((s) => d.counts[s] > 0);
              return (
                <g key={d.day} opacity={active === null || active === i ? 1 : 0.45} className="transition-opacity duration-150">
                  {parts.map((s, j) => {
                    const v = d.counts[s];
                    const yTop = y(acc + v);
                    const yBottom = y(acc);
                    acc += v;
                    // 2px surface gap between stacked segments, taken off the bottom of each upper one.
                    const h = Math.max(1, yBottom - yTop - (j > 0 ? 2 : 0));
                    return <path key={s} d={segment(x, round(yTop), round(barW), round(h), j === parts.length - 1)} fill={STATUS_META[s].mark} />;
                  })}
                  {(i % every === (days.length - 1) % every || i === days.length - 1) && (
                    // The latest day sits at the right edge: anchor its label to the end so it isn't clipped.
                    <text
                      x={i === days.length - 1 ? width - PAD.right : round(PAD.left + band * i + band / 2)}
                      y={H - 8}
                      textAnchor={i === days.length - 1 ? "end" : "middle"}
                      className="fill-ink-400 text-[10px]"
                    >
                      {dayLabel(d.day)}
                    </text>
                  )}
                  {/* The hit area is the whole day's band, not just the painted column. */}
                  <rect
                    x={round(PAD.left + band * i)}
                    y={PAD.top}
                    width={round(band)}
                    height={plotH}
                    fill="transparent"
                    onPointerEnter={() => setActive(i)}
                    onPointerDown={() => setActive(i)}
                  />
                </g>
              );
            })}
            <line x1={PAD.left} x2={width - PAD.right} y1={y(0)} y2={y(0)} stroke="#d9cfbb" strokeWidth={1} shapeRendering="crispEdges" />
          </svg>

          {hovered && (
            <div
              className="pointer-events-none absolute top-0 z-10 w-44 -translate-x-1/2 rounded-xl bg-night-950 px-3 py-2.5 text-xs text-sand-100 shadow-[0_12px_30px_-10px_rgb(0_0_0/0.6)]"
              style={{ left: tipLeft }}
              role="status"
            >
              <p className="font-semibold text-sand-50">{dayLabel(hovered.day)}</p>
              <ul className="mt-1.5 space-y-1">
                {[...STATUS_ORDER].reverse().map((s) => (
                  <li key={s} className="flex items-center gap-2">
                    <span className="h-0.5 w-3 rounded-full" style={{ background: STATUS_META[s].mark }} aria-hidden />
                    <span className="w-5 text-right font-bold tabular-nums text-white">{hovered.counts[s]}</span>
                    <span className="text-sand-200/75">{STATUS_META[s].label}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-1.5 border-t border-white/10 pt-1.5 text-sand-200/75">
                <span className="font-bold tabular-nums text-white">{hovered.total}</span> total
              </p>
            </div>
          )}
          {max === 0 && (
            <p className="pointer-events-none absolute inset-0 grid place-items-center pb-6 text-sm text-ink-400">No leads in this period yet</p>
          )}
        </div>
      )}
    </section>
  );
}
