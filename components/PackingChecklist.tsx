"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "./Icons";
import { ArtPlate } from "./guides/Article";
import { BagArt, ClothesArt, HealthArt, IhramArt, MoneyArt, PassportArt } from "./guides/GuideArt";

/**
 * The packing list as a real checklist. Ticks are kept in this browser only
 * (localStorage), so a pilgrim can pack over several evenings. The server
 * renders every item unticked, so the full list is in the HTML.
 *
 * Each list is a card with its own progress ring; a sticky bar at the top
 * keeps the running total and the WhatsApp share in reach.
 */

export type PackingList = { id: string; label: string; items: string[] };

const KEY = "mt-packing-v1";

const ART: Record<string, React.ComponentType<{ className?: string }>> = {
  documents: PassportArt,
  ihram: IhramArt,
  clothes: ClothesArt,
  health: HealthArt,
  money: MoneyArt,
  extras: BagArt,
};

/** A small progress ring; full and green when a list is done. */
function Ring({ got, total, size = 44 }: { got: number; total: number; size?: number }) {
  const r = size / 2 - 3;
  const c = 2 * Math.PI * r;
  const done = got === total;
  return (
    <span className="relative flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth="3" className="text-sand-200" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - got / total)}
          className={`transition-[stroke-dashoffset,color] duration-700 ease-out-expo ${done ? "text-haram-600" : "text-gold-500"}`}
        />
      </svg>
      {done ? (
        <svg viewBox="0 0 24 24" className="relative h-5 w-5 text-haram-700" fill="none" stroke="currentColor" strokeWidth={2.6} aria-hidden>
          <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <span className="figure relative text-[0.72rem] font-extrabold text-ink-800">
          {got}/{total}
        </span>
      )}
    </span>
  );
}

export default function PackingChecklist({ lists }: { lists: PackingList[] }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const total = lists.reduce((n, l) => n + l.items.length, 0);
  const count = Object.values(done).filter(Boolean).length;
  const all = count === total;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved) setDone(JSON.parse(saved));
    } catch {
      // Storage can be unavailable (private mode); the list still works for this visit.
    }
  }, []);

  function toggle(key: string) {
    setDone((d) => {
      const next = { ...d, [key]: !d[key] };
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  function reset() {
    setDone({});
    try {
      window.localStorage.removeItem(KEY);
    } catch {}
  }

  const shareText = ["Umrah packing list", ...lists.flatMap((l) => [``, `${l.label}:`, ...l.items.map((i) => `- ${i}`)])].join("\n");

  return (
    <div>
      <div className="not-prose sticky top-[calc(var(--header-h)+0.75rem)] z-20 rounded-[22px] border border-sand-300 bg-[#fffdf9]/95 px-4 py-3 shadow-[0_22px_44px_-30px_rgb(20_17_13/0.55)] backdrop-blur sm:px-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <Ring got={count} total={total} size={46} />
          <div className="min-w-0 flex-1">
            <p className="text-[0.95rem] font-bold text-ink-900" aria-live="polite">
              <span className="figure">{count}</span> of <span className="figure">{total}</span> packed
            </p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sand-200" aria-hidden>
              <span
                className={`block h-full rounded-full bg-gradient-to-r transition-[width] duration-700 ease-out-expo ${all ? "from-haram-500 to-haram-700" : "from-gold-300 via-gold-400 to-haram-600"}`}
                style={{ width: `${(count / total) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {count > 0 && (
              <button
                type="button"
                onClick={reset}
                className="min-h-11 rounded-full px-3 text-[0.8rem] font-bold text-ink-500 transition hover:bg-sand-100 hover:text-ink-900 sm:pointer-fine:min-h-9"
              >
                Reset
              </button>
            )}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="nofollow noopener"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-wa-500 px-4 text-[0.8rem] font-bold text-wa-950 transition hover:bg-wa-400 sm:pointer-fine:min-h-10"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Send the list
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {lists.map((l, n) => {
          const got = l.items.filter((i) => done[`${l.id}:${i}`]).length;
          const complete = got === l.items.length;
          const A = ART[l.id] ?? BagArt;
          return (
            <section
              key={l.id}
              className={`not-prose overflow-hidden rounded-[26px] border bg-[#fffdf9] shadow-[0_28px_50px_-42px_rgb(20_17_13/0.55)] transition-colors duration-500 ${
                complete ? "border-haram-600/35" : "border-sand-300"
              }`}
            >
              <header
                className={`flex items-center gap-4 border-b px-5 py-4 transition-colors duration-500 sm:gap-5 sm:px-6 ${
                  complete ? "border-haram-600/15 bg-haram-50" : "border-sand-200 bg-[linear-gradient(90deg,#fbf3df,#fffdf9_70%)]"
                }`}
              >
                <ArtPlate art={A} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="figure text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-gold-700">
                    List {n + 1} of {lists.length}
                  </p>
                  <h2 id={l.id} className="mt-1 scroll-mt-[calc(var(--header-h)+7rem)] text-[1.65rem] leading-tight sm:text-[2rem]">
                    {l.label}
                  </h2>
                </div>
                <span aria-label={`${got} of ${l.items.length} packed`} role="img">
                  <Ring got={got} total={l.items.length} />
                </span>
              </header>
              <ul className="divide-y divide-sand-200">
                {l.items.map((i) => {
                  const k = `${l.id}:${i}`;
                  const on = Boolean(done[k]);
                  return (
                    <li key={i}>
                      <label
                        className={`group flex min-h-14 cursor-pointer items-start gap-4 px-5 py-4 transition-colors duration-300 sm:px-6 ${
                          on ? "bg-haram-50/60" : "hover:bg-sand-100/60"
                        }`}
                      >
                        <input type="checkbox" checked={on} onChange={() => toggle(k)} className="peer sr-only" />
                        <span
                          aria-hidden
                          className={`mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-[1.5px] transition duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-gold-500 peer-focus-visible:ring-offset-2 ${
                            on ? "scale-105 border-haram-700 bg-haram-700 text-sand-50" : "border-sand-400 bg-white group-hover:border-gold-500"
                          }`}
                        >
                          <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-opacity duration-200 ${on ? "opacity-100" : "opacity-0"}`} fill="none" stroke="currentColor" strokeWidth={3}>
                            <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className={`text-[1rem] leading-relaxed transition-colors duration-300 ${on ? "text-ink-500 line-through decoration-haram-600/40" : "text-ink-800"}`}>
                          {i}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
