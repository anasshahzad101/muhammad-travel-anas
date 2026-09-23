/**
 * The seven lengths of sa'i drawn out: Safa on the left, Marwah on the right,
 * one arrow per length, ending at Marwah. It only pictures what the text
 * says ("Safa to Marwah is one, Marwah back to Safa is two, and so on").
 */

function Hill({ label, end = false }: { label: string; end?: boolean }) {
  return (
    <span className="flex flex-col items-center">
      <svg viewBox="0 0 40 18" className="h-4 w-9 text-gold-600" aria-hidden>
        <path d="M2 17c4-11 32-11 36 0Z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <span className={`mt-1 text-[0.68rem] font-extrabold uppercase tracking-[0.16em] ${end ? "text-haram-800" : "text-gold-700"}`}>{label}</span>
    </span>
  );
}

export default function SaiDiagram({ label }: { label: string }) {
  const lengths = [1, 2, 3, 4, 5, 6, 7];
  const cols = "grid grid-cols-[3.6rem_minmax(0,1fr)_3.6rem] sm:grid-cols-[5rem_minmax(0,1fr)_5rem]";
  return (
    <figure role="img" aria-label={label} className="reveal rounded-[24px] border border-sand-300 bg-[#fffdf9] px-4 py-6 shadow-[0_24px_50px_-42px_rgb(20_17_13/0.5)] sm:px-7 sm:py-8">
      <div className={`${cols} items-end`}>
        <Hill label="Safa" />
        <span />
        <Hill label="Marwah" end />
      </div>
      <div className="relative mt-3">
        {/* The two ends as pillars running the height of the walk. */}
        <div aria-hidden className={`pointer-events-none absolute inset-0 ${cols}`}>
          <span className="mx-auto h-full w-2.5 rounded-full bg-gradient-to-b from-gold-300/80 to-gold-400/40" />
          <span />
          <span className="mx-auto h-full w-2.5 rounded-full bg-gradient-to-b from-haram-500/50 to-haram-600/30" />
        </div>
        <ol className="relative space-y-1.5 py-1">
          {lengths.map((n) => {
            const toMarwah = n % 2 === 1;
            const last = n === lengths.length;
            return (
              <li key={n} className={`${cols} items-center`}>
                <span />
                <span className="relative flex h-8 items-center">
                  <span className={`h-[2px] w-full rounded-full ${last ? "bg-gradient-to-r from-gold-400 to-haram-600" : "bg-sand-300"}`} />
                  <svg
                    viewBox="0 0 10 12"
                    className={`absolute top-1/2 h-3 w-2.5 -translate-y-1/2 ${toMarwah ? "right-0" : "left-0 rotate-180"} ${last ? "text-haram-700" : "text-ink-400"}`}
                    aria-hidden
                  >
                    <path d="M1 1l8 5-8 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span
                    className={`figure absolute left-1/2 top-1/2 flex h-6 min-w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full px-1.5 text-[0.72rem] font-extrabold ${
                      last ? "bg-night-900 text-gold-300" : "border border-sand-300 bg-[#fffdf9] text-ink-600"
                    }`}
                  >
                    {n}
                  </span>
                </span>
                <span />
              </li>
            );
          })}
        </ol>
      </div>
    </figure>
  );
}
