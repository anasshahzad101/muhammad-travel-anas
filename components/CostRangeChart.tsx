/**
 * "What each part costs": a floating-range bar per cost, on one shared axis in
 * lakhs (how Pakistani buyers think about these sums). One series, one colour;
 * every range is also written at the bar and in the table beneath it on the
 * page, so nothing depends on colour or hover. Server-rendered, no JavaScript.
 */

export type CostRow = { label: string; min: number; max: number; median?: number };
export type CostGroup = { title: string; rows: CostRow[] };

const pkr = (n: number) => `PKR ${n.toLocaleString("en-PK")}`;

export default function CostRangeChart({ groups, checked, scaleMax = 650000 }: { groups: CostGroup[]; checked: string; scaleMax?: number }) {
  const x = (v: number) => (v / scaleMax) * 100;
  const ticks = Array.from({ length: Math.floor(scaleMax / 100000) + 1 }, (_, i) => i * 100000);

  return (
    <figure className="not-prose card reveal overflow-hidden">
      <figcaption className="border-b border-sand-200 bg-[linear-gradient(90deg,#fbf3df,#fffdf9_60%)] px-6 py-5 sm:px-8">
        <p className="font-display text-[1.7rem] leading-tight text-ink-950">What each part costs, per person</p>
        <p className="mt-1.5 text-[0.85rem] text-ink-500">
          Typical ranges across Pakistani agencies, checked {checked}. The dot marks the median where it is known.
        </p>
      </figcaption>

      <div className="px-6 pb-6 pt-6 sm:px-8 sm:pb-8">
        <div className="space-y-8">
          {groups.map((g) => (
            <div key={g.title}>
              <p className="flex items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-gold-700">
                <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-gold-500" />
                {g.title}
              </p>
              <ul className="mt-3 space-y-1">
                {g.rows.map((r) => {
                  const left = x(r.min);
                  const right = x(r.max);
                  const labelInside = right > 70;
                  return (
                    <li
                      key={r.label}
                      className="group/row -mx-2 grid items-center gap-x-4 gap-y-1.5 rounded-xl px-2 py-1.5 transition-colors duration-300 hover:bg-sand-100/70 sm:grid-cols-[11rem_minmax(0,1fr)]"
                    >
                      <span className="text-[0.88rem] font-semibold text-ink-800">
                        {r.label}
                        <span className="figure block text-[0.76rem] font-medium text-ink-500 sm:hidden">
                          {pkr(r.min)}-{r.max.toLocaleString("en-PK")}
                        </span>
                      </span>
                      <div className="relative h-7" role="img" aria-label={`${r.label}: ${pkr(r.min)} to ${pkr(r.max)}${r.median ? `, median ${pkr(r.median)}` : ""}`}>
                        {ticks.map((t) => (
                          <span key={t} aria-hidden className="absolute inset-y-0 w-px bg-sand-200" style={{ left: `${x(t)}%` }} />
                        ))}
                        <span
                          aria-hidden
                          className="absolute top-1/2 h-3 -translate-y-1/2 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 shadow-[inset_0_1px_0_rgb(255_255_255/0.35)] transition duration-300 group-hover/row:from-haram-500 group-hover/row:to-haram-700"
                          style={{ left: `${left}%`, width: `${Math.max(1.2, right - left)}%` }}
                        />
                        {r.median !== undefined && (
                          <span
                            aria-hidden
                            className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#fffdf9] bg-night-900 shadow-[0_0_0_1px_rgb(3_11_9/0.25)]"
                            style={{ left: `${x(r.median)}%` }}
                          />
                        )}
                        <span
                          aria-hidden
                          className={`figure absolute top-1/2 hidden -translate-y-1/2 whitespace-nowrap text-[0.76rem] font-semibold text-ink-600 sm:block ${labelInside ? "-translate-x-full pr-2.5" : "pl-2.5"}`}
                          style={{ left: `${labelInside ? left : right}%` }}
                        >
                          {r.min.toLocaleString("en-PK")}-{r.max.toLocaleString("en-PK")}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Axis, aligned with the bar column */}
        <div className="mt-3 grid sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-x-4" aria-hidden>
          <span className="hidden sm:block" />
          <div className="relative h-5 border-t border-sand-300">
            {ticks.map((t, i) => (
              <span
                key={t}
                className={`figure absolute top-1.5 whitespace-nowrap text-[0.7rem] text-ink-500 ${i === 0 ? "" : "-translate-x-1/2"}`}
                style={{ left: `${x(t)}%` }}
              >
                {t === 0 ? "0" : `${t / 100000} lakh`}
              </span>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
