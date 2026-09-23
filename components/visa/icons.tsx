/**
 * Extra stroke icons for the visa page, drawn on the same 24px grid and stroke
 * weight as components/Icons.tsx so they sit happily next to that set.
 */

type IconProps = { className?: string };

function Svg({ className = "h-5 w-5", children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {children}
    </svg>
  );
}

export const LandmarkIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 21h18M4 10h16M12 3l8 4.5H4L12 3ZM6 10v8M10 10v8M14 10v8M18 10v8M4 18h16" />
  </Svg>
);

export const IdCardIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.5" y="5" width="19" height="14" rx="2" />
    <circle cx="8.5" cy="11" r="2.2" />
    <path d="M5.5 16c.6-1.4 1.7-2.1 3-2.1s2.4.7 3 2.1M14 10h4.5M14 13.5h3" />
  </Svg>
);

export const PortraitIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <circle cx="12" cy="10" r="3.2" />
    <path d="M7 18.5c.9-2.2 2.8-3.4 5-3.4s4.1 1.2 5 3.4" />
  </Svg>
);

export const SyringeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m18 2 4 4M20 4l-9.5 9.5M17 7l-3-3M14.5 9.5 11 6M4 20l3-3M6.5 14.5l3 3M7 17l-2.5-2.5 8-8L17 11l-8 8L7 17Z" />
  </Svg>
);

export const TicketIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4V8Z" />
    <path d="M14 6.5v11" strokeDasharray="1.5 2" />
  </Svg>
);

export const QrIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="6" height="6" rx="1" />
    <rect x="14.5" y="3.5" width="6" height="6" rx="1" />
    <rect x="3.5" y="14.5" width="6" height="6" rx="1" />
    <path d="M14.5 14.5h2.5v2.5M20.5 14.5v.01M14.5 20.5h.01M17.5 20.5h3v-3" />
  </Svg>
);

export const ContactIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5" y="2.5" width="14" height="19" rx="2.5" />
    <circle cx="12" cy="10" r="2.6" />
    <path d="M8.5 16.5c.7-1.5 2-2.3 3.5-2.3s2.8.8 3.5 2.3" />
  </Svg>
);

export const PrinterIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="7" y="13" width="10" height="8" rx="1" />
  </Svg>
);

export const SmartphoneIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
    <path d="M11 18.5h2" />
  </Svg>
);

export const ExternalIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
  </Svg>
);

export const PersonIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="6" r="3" />
    <path d="M12 11c-3 0-5 2.3-5.4 5.2L6 21.5h12l-.6-5.3C17 13.3 15 11 12 11Z" />
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

/**
 * An icon set inside the site's eight-point star outline (two squares at 45°),
 * the same device TrustPoints uses. The outline turns on hover of a `group`.
 */
export function StarFrame({ children, onDark = false, className = "h-14 w-14" }: { children: React.ReactNode; onDark?: boolean; className?: string }) {
  return (
    <span className={`relative flex shrink-0 items-center justify-center ${className}`}>
      <svg viewBox="0 0 56 56" className={`absolute inset-0 h-full w-full transition-transform duration-700 ease-out-expo group-hover:rotate-45 ${onDark ? "text-gold-300/70" : "text-gold-400"}`} aria-hidden>
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="10" y="10" width="36" height="36" />
          <rect x="10" y="10" width="36" height="36" transform="rotate(45 28 28)" />
        </g>
      </svg>
      <span className={`relative ${onDark ? "text-gold-300" : "text-haram-800"}`}>{children}</span>
    </span>
  );
}
