import Link from "next/link";

/**
 * Wordmark with a geometric mark: an eight-point star (two overlapping squares),
 * a motif found across Islamic architecture. Deliberately no calligraphy of the
 * name itself - sacred names shouldn't end up on printed flyers and receipts that
 * get thrown away.
 */
export function Mark({ className = "h-10 w-10", onDark = false }: { className?: string; onDark?: boolean }) {
  const fill = onDark ? "#0f2721" : "#06120f";
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <defs>
        <linearGradient id={onDark ? "mk-gold-d" : "mk-gold-l"} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3dca4" />
          <stop offset="0.5" stopColor="#d4ab5a" />
          <stop offset="1" stopColor="#a8782c" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="28" height="28" rx="2.5" fill={fill} />
      <rect x="6" y="6" width="28" height="28" rx="2.5" fill={fill} transform="rotate(45 20 20)" />
      <g fill="none" stroke={`url(#${onDark ? "mk-gold-d" : "mk-gold-l"})`} strokeWidth="1.3">
        <rect x="11" y="11" width="18" height="18" rx="1.2" />
        <rect x="11" y="11" width="18" height="18" rx="1.2" transform="rotate(45 20 20)" />
        <circle cx="20" cy="20" r="5.6" />
      </g>
      <circle cx="20" cy="20" r="2.6" fill={`url(#${onDark ? "mk-gold-d" : "mk-gold-l"})`} />
    </svg>
  );
}

export default function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="Muhammad Travels - home">
      <Mark onDark={onDark} className="h-10 w-10 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:rotate-45" />
      <span className="flex flex-col leading-none">
        <span
          className={`whitespace-nowrap font-display text-[1.5rem] font-semibold tracking-[-0.01em] ${onDark ? "text-sand-50" : "text-ink-950"}`}
        >
          Muhammad Travels
        </span>
        <span className={`mt-1 text-[0.6rem] font-bold uppercase tracking-[0.3em] ${onDark ? "text-gold-300" : "text-gold-700"}`}>
          Umrah · Lahore
        </span>
      </span>
    </Link>
  );
}
