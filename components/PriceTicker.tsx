import Link from "next/link";

export type TickerItem = { label: string; value: string; href: string };

/**
 * A slow marquee of real "from" prices. Pure CSS: the list is rendered twice
 * (the copy hidden from assistive tech) and slid by half its width. Hover or
 * focus pauses it; reduced-motion users get a static, scrollable row.
 */
export default function PriceTicker({ items }: { items: TickerItem[] }) {
  const row = (copy: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={copy || undefined}>
      {items.map((it) => (
        <li key={it.href + it.label} className="flex items-center">
          <Link href={it.href} tabIndex={copy ? -1 : undefined} className="group flex items-baseline gap-2.5 whitespace-nowrap px-7 py-4">
            <span className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-sand-200/60 transition group-hover:text-sand-50">{it.label}</span>
            <span className="figure text-[1rem] font-bold text-gold-200">{it.value}</span>
          </Link>
          <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 text-gold-500/60" fill="currentColor" aria-hidden>
            <path d="M12 0l2.6 6.3L21 3.5l-2.8 6.4L24 12l-5.8 2.1L21 20.5l-6.4-2.8L12 24l-2.6-6.3L3 20.5l2.8-6.4L0 12l5.8-2.1L3 3.5l6.4 2.8z" />
          </svg>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee-mask relative overflow-x-auto border-t border-white/10 [scrollbar-width:none] motion-safe:overflow-hidden">
      <div className="flex w-max motion-safe:animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
