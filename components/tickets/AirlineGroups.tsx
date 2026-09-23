import { StarGlyph } from "./icons";

/**
 * The airlines on the Pakistan-Saudi route in two groups, each headed by a
 * small route drawing: one unbroken arc for direct flights, two arcs meeting
 * at a stop for one-stop options. Names only, as pills: no airline logos.
 * The dashes march along the route (a CSS animation the global
 * reduced-motion rule switches off).
 */

export type AirlineGroup = {
  kind: "direct" | "one-stop";
  title: string;
  note: string;
  airlines: readonly string[];
};

export default function AirlineGroups({ groups }: { groups: AirlineGroup[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {groups.map((g, i) => (
        <article
          key={g.kind}
          className="spotlight reveal group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-6 transition duration-500 hover:border-gold-400/35 sm:p-9"
          style={{ "--i": i } as React.CSSProperties}
        >
          <Route kind={g.kind} />

          <div className="mt-7 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <h3 className="font-display text-[1.9rem] font-semibold leading-tight text-sand-50">{g.title}</h3>
            <span className="figure rounded-full border border-gold-400/35 bg-gold-300/10 px-3 py-1 text-[0.72rem] font-bold text-gold-200">
              {g.airlines.length} airlines
            </span>
          </div>
          <p className="mt-2 text-[0.96rem] leading-relaxed text-sand-200/80">{g.note}</p>

          <ul className="mt-6 flex flex-wrap gap-2.5">
            {g.airlines.map((a) => (
              <li
                key={a}
                className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-white/[0.14] bg-white/[0.045] px-4 text-[0.95rem] font-semibold text-sand-50 transition duration-300 hover:border-gold-400/50 hover:bg-white/[0.08]"
              >
                <StarGlyph className="h-2.5 w-2.5 text-gold-300" />
                {a}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

/** A little route drawing: Pakistan to Saudi Arabia, direct or with one stop. */
function Route({ kind }: { kind: AirlineGroup["kind"] }) {
  const direct = kind === "direct";
  return (
    <div aria-hidden className="relative">
      <svg viewBox="0 0 400 96" className="h-auto w-full overflow-visible">
        {direct ? (
          <>
            <path d="M16 78 Q200 -14 384 78" fill="none" stroke="#e6c77f" strokeOpacity="0.18" strokeWidth="6" />
            <path d="M16 78 Q200 -14 384 78" fill="none" stroke="#f0d596" strokeWidth="1.6" strokeDasharray="5 5" className="de-march" />
            <g transform="translate(200 32) rotate(0)">
              <circle r="15" fill="#06120f" stroke="#e6c77f" strokeOpacity="0.5" />
              <path
                d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2Z"
                transform="translate(-8.5 -8.5) scale(0.72) rotate(45 12 12)"
                fill="none"
                stroke="#e6c77f"
                strokeWidth="1.9"
                strokeLinejoin="round"
              />
            </g>
          </>
        ) : (
          <>
            <path d="M16 78 Q108 12 200 70 Q292 12 384 78" fill="none" stroke="#e6c77f" strokeOpacity="0.18" strokeWidth="6" />
            <path d="M16 78 Q108 12 200 70 Q292 12 384 78" fill="none" stroke="#f0d596" strokeWidth="1.6" strokeDasharray="5 5" className="de-march" />
            <circle cx="200" cy="70" r="9" fill="#06120f" stroke="#e6c77f" strokeWidth="1.6" />
            <circle cx="200" cy="70" r="3.2" fill="#e6c77f" />
          </>
        )}
        <circle cx="16" cy="78" r="12" fill="#e6c77f" fillOpacity="0.14" className="de-ping" />
        <circle cx="16" cy="78" r="5" fill="#f0d596" stroke="#06120f" strokeWidth="2" />
        <circle cx="384" cy="78" r="5" fill="#f0d596" stroke="#06120f" strokeWidth="2" />
      </svg>
      <div className="mt-2 flex justify-between text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-sand-200/60">
        <span>Pakistan</span>
        <span className="text-gold-300/90">{direct ? "Direct" : "One stop"}</span>
        <span>Saudi Arabia</span>
      </div>
    </div>
  );
}
