/**
 * Booking tips as numbered cards on an ivory section: star-framed icon, a short
 * title and the tip itself, with room for a small illustration under it.
 */

export type Tip = {
  icon: (p: { className?: string }) => React.ReactNode;
  title: string;
  body: React.ReactNode;
  extra?: React.ReactNode;
};

export default function TipCards({ tips }: { tips: Tip[] }) {
  return (
    <ul className="grid gap-5 md:grid-cols-2">
      {tips.map((t, i) => (
        <li
          key={t.title}
          className="card spotlight reveal group flex flex-col overflow-hidden p-6 transition-[transform,border-color,box-shadow] duration-500 ease-out-expo hover:border-gold-400/60 hover:[transform:translateY(-4px)] sm:p-8"
          style={{ "--i": i % 2 } as React.CSSProperties}
        >
          <div className="flex items-start justify-between gap-4">
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center">
              <svg viewBox="0 0 56 56" className="absolute inset-0 h-full w-full text-gold-400 transition-transform duration-700 ease-out-expo group-hover:rotate-45" aria-hidden>
                <g fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="10" y="10" width="36" height="36" />
                  <rect x="10" y="10" width="36" height="36" transform="rotate(45 28 28)" />
                </g>
              </svg>
              <t.icon className="relative h-5 w-5 text-haram-800" />
            </span>
            <span aria-hidden className="figure text-[2.6rem] font-extralight leading-none text-gold-500">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="mt-5 font-display text-[1.6rem] font-semibold leading-tight text-ink-950">{t.title}</h3>
          <p className="mt-2 text-[1rem] leading-relaxed text-ink-700 [&_strong]:font-bold [&_strong]:text-ink-950">{t.body}</p>
          {t.extra ? <div className="mt-auto pt-6">{t.extra}</div> : null}
        </li>
      ))}
    </ul>
  );
}
