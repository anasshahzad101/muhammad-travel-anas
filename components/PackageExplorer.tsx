"use client";

import { useMemo, useState } from "react";
import type { Tier } from "@/lib/packages";

/**
 * Live filters over the full package list. The cards themselves are rendered on
 * the server and passed in as nodes; this component only decides which to show.
 * Its initial state shows everything, so the static HTML is the complete list,
 * grouped by length under real headings.
 */

export type ExplorerItem = { key: string; tier: Tier; days: number; price: number; node: React.ReactNode };
export type ExplorerGroup = { id: string; title: string; items: ExplorerItem[] };

const TIERS: { id: "all" | Tier; label: string }[] = [
  { id: "all", label: "All hotels" },
  { id: "economy", label: "Economy" },
  { id: "3-star", label: "3-Star" },
  { id: "4-star", label: "4-Star" },
  { id: "5-star", label: "5-Star" },
];

export default function PackageExplorer({ groups }: { groups: ExplorerGroup[] }) {
  const all = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const prices = all.map((i) => i.price);
  const min = Math.floor(Math.min(...prices) / 5000) * 5000;
  const max = Math.ceil(Math.max(...prices) / 5000) * 5000;
  const [tier, setTier] = useState<"all" | Tier>("all");
  const [budget, setBudget] = useState(max);
  const [sort, setSort] = useState<"days" | "price">("days");

  const match = (i: ExplorerItem) => (tier === "all" || i.tier === tier) && i.price <= budget;
  const shown = all.filter(match).length;
  const pct = ((budget - min) / (max - min)) * 100;

  return (
    <div>
      <div className="card sticky top-[calc(var(--header-h)+0.75rem)] z-20 flex flex-col gap-5 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="seg" role="group" aria-label="Hotel">
          {TIERS.map((t) => (
            <button key={t.id} type="button" className="seg-btn" aria-pressed={tier === t.id} onClick={() => setTier(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <label className="flex min-w-[15rem] flex-col gap-1.5">
            <span className="flex items-baseline justify-between gap-4 text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-ink-500">
              Budget per person
              <span className="figure text-[0.85rem] normal-case tracking-normal text-ink-950">up to PKR {budget.toLocaleString("en-PK")}</span>
            </span>
            <input
              type="range"
              min={min}
              max={max}
              step={5000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="range-gold"
              style={{ "--pct": `${pct}%` } as React.CSSProperties}
            />
          </label>
          <div className="seg" role="group" aria-label="Sort">
            <button type="button" className="seg-btn" aria-pressed={sort === "days"} onClick={() => setSort("days")}>
              By length
            </button>
            <button type="button" className="seg-btn" aria-pressed={sort === "price"} onClick={() => setSort("price")}>
              Lowest price
            </button>
          </div>
        </div>
      </div>

      <p className="mt-5 text-sm text-ink-500" aria-live="polite">
        Showing <span className="figure font-bold text-ink-900">{shown}</span> of <span className="figure">{all.length}</span> packages
        {shown === 0 && " - try a higher budget or another hotel"}
      </p>

      {sort === "price" ? (
        <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {all
            .filter(match)
            .sort((a, b) => a.price - b.price)
            .map((i) => (
              <div key={i.key}>{i.node}</div>
            ))}
        </div>
      ) : (
        groups.map((g) => {
          const items = g.items.filter(match);
          if (items.length === 0) return null;
          return (
            <section key={g.id} id={g.id} className="scroll-mt-40 pt-14">
              <div className="flex items-baseline gap-4">
                <h3 className="text-[2.3rem] leading-none">{g.title}</h3>
                <span className="h-px flex-1 bg-gradient-to-r from-gold-400/60 to-transparent" />
                <span className="figure text-sm font-bold text-ink-500">
                  {items.length} package{items.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="mt-7 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((i) => (
                  <div key={i.key}>{i.node}</div>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
