/**
 * Extra stroke icons for the tickets page, on the same 24px grid and stroke
 * weight as components/Icons.tsx.
 */

type IconProps = { className?: string };

function Svg({ className = "h-5 w-5", children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {children}
    </svg>
  );
}

export const LuggageIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5" y="7" width="14" height="13" rx="2" />
    <path d="M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7M9 11v5M15 11v5M8 20v1.5M16 20v1.5" />
  </Svg>
);

export const TrendUpIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />
  </Svg>
);

/** Ihram: two unstitched white sheets, one wrapped at the waist, one over the shoulder. */
export const IhramIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="4.5" r="2" />
    <path d="M8 8.5c1.2-.7 2.5-1 4-1s2.8.3 4 1l-1 4.5H9L8 8.5Z" />
    <path d="M9 13h6l1 8H8l1-8Z" />
    <path d="M10.5 8l4 5" />
  </Svg>
);

/** The eight-point star used as a bullet across the site, filled. */
export function StarGlyph({ className = "h-3 w-3" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 0l2.6 6.3L21 3.5l-2.8 6.4L24 12l-5.8 2.1L21 20.5l-6.4-2.8L12 24l-2.6-6.3L3 20.5l2.8-6.4L0 12l5.8-2.1L3 3.5l6.4 2.8z" />
    </svg>
  );
}
