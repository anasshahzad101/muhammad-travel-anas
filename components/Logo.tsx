import Link from "next/link";

/**
 * Wordmark with a geometric mark: an eight-point star (two overlapping squares),
 * a motif found across Islamic architecture. Deliberately no calligraphy of the
 * name itself — sacred names shouldn't end up on printed flyers and receipts that
 * get thrown away.
 */
export function Mark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect x="6" y="6" width="28" height="28" rx="3" fill="#0b3a32" />
      <rect x="6" y="6" width="28" height="28" rx="3" fill="#0b3a32" transform="rotate(45 20 20)" />
      <rect x="11.5" y="11.5" width="17" height="17" rx="1.5" fill="none" stroke="#d4ab5a" strokeWidth="1.4" />
      <rect x="11.5" y="11.5" width="17" height="17" rx="1.5" fill="none" stroke="#d4ab5a" strokeWidth="1.4" transform="rotate(45 20 20)" />
      <circle cx="20" cy="20" r="3.2" fill="#d4ab5a" />
    </svg>
  );
}

export default function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Muhammad Travels — home">
      <Mark />
      <span className="flex flex-col leading-none">
        <span className={`whitespace-nowrap font-display text-[1.35rem] font-semibold tracking-tight ${onDark ? "text-sand-50" : "text-ink-950"}`}>
          Muhammad Travels
        </span>
        <span className={`mt-1 text-[0.62rem] font-bold uppercase tracking-[0.22em] ${onDark ? "text-gold-300" : "text-gold-700"}`}>
          Umrah · Lahore
        </span>
      </span>
    </Link>
  );
}
