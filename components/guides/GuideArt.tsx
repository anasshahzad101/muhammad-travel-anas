/**
 * Small line illustrations for guide chapters and lists, drawn on a 48px grid
 * in currentColor so they take the gold of whatever plate they sit on. They are
 * decorative (aria-hidden): every fact they hint at is written in the text.
 */

type ArtProps = { className?: string };

function Art({ className = "h-10 w-10", children }: ArtProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

/** A plane crossing the dashed miqat boundary around Makkah. */
export function MiqatArt(p: ArtProps) {
  return (
    <Art {...p}>
      <rect x="33" y="9" width="6" height="6" fill="currentColor" fillOpacity="0.25" />
      <path d="M21.5 8.1A15 15 0 0 0 39.9 26.5" strokeDasharray="2.2 3.2" />
      <g transform="translate(4 19) scale(0.9)" strokeWidth={1.6}>
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2Z" />
      </g>
    </Art>
  );
}

/** The Kaaba with an anticlockwise circuit around it. */
export function TawafArt(p: ArtProps) {
  return (
    <Art {...p}>
      <rect x="17.5" y="18.5" width="13" height="13" fill="currentColor" fillOpacity="0.2" />
      <path d="M17.5 22h13" />
      <path d="M32.5 10.3A17 17 0 1 0 40 30.8" />
      <path d="M36.7 33.1 40 30.8l1 3.9" />
    </Art>
  );
}

/** Safa and Marwah, with the walk back and forth between them. */
export function SaiArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M3 38h42" />
      <path d="M4 38c2.5-7.5 10.5-7.5 13 0" fill="currentColor" fillOpacity="0.15" />
      <path d="M31 38c2.5-7.5 10.5-7.5 13 0" fill="currentColor" fillOpacity="0.15" />
      <path d="M13 22h22" />
      <path d="M16 19l-3 3 3 3M32 19l3 3-3 3" />
      <path d="M21.5 16v2M26.5 16v2" strokeOpacity="0.6" />
    </Art>
  );
}

/** Scissors: halq or taqsir. */
export function HalqArt(p: ArtProps) {
  return (
    <Art {...p}>
      <circle cx="15" cy="36" r="5" />
      <circle cx="33" cy="36" r="5" />
      <path d="M18.5 32.5 33 7M29.5 32.5 15 7" />
      <circle cx="24" cy="23" r="1.2" fill="currentColor" />
    </Art>
  );
}

/** Four points on one path: the whole Umrah at a glance. */
export function FourStepsArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M8 38c4-10 8-14 12-14s6 4 10 4 7-8 10-16" strokeDasharray="2 3" />
      <circle cx="8" cy="38" r="3" fill="currentColor" fillOpacity="0.2" />
      <circle cx="20" cy="24" r="3" fill="currentColor" fillOpacity="0.2" />
      <circle cx="30" cy="28" r="3" fill="currentColor" fillOpacity="0.2" />
      <path d="M39 5.5l1.6 3.9 3.9-1.7-1.7 3.9L46.7 13l-3.9 1.4 1.7 3.9-3.9-1.7L39 20.5l-1.6-3.9-3.9 1.7 1.7-3.9L31.3 13l3.9-1.4-1.7-3.9 3.9 1.7Z" fill="currentColor" fillOpacity="0.3" />
    </Art>
  );
}

/** An octagon with an exclamation mark: things to avoid. */
export function MistakeArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M17.5 8.3h13l9.2 9.2v13l-9.2 9.2h-13l-9.2-9.2v-13Z" fill="currentColor" fillOpacity="0.12" />
      <path d="M24 15.5v11" strokeWidth={2} />
      <path d="M24 32v.4" strokeWidth={2.6} />
    </Art>
  );
}

/** A plane lifting off: setting out on the journey. */
export function JourneyArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M4 41h40" />
      <path d="M8 41c6-2 10-5 14-9" strokeDasharray="2 3" strokeOpacity="0.7" />
      <g transform="translate(18 4) scale(1.05)" strokeWidth={1.45}>
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2Z" />
      </g>
    </Art>
  );
}

/** A mihrab doorway with the way in. */
export function EnterArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M6 42h36" />
      <path d="M13 42V21a11 11 0 0 1 22 0v21" fill="currentColor" fillOpacity="0.1" />
      <path d="M24 38V25M19.5 29.5 24 25l4.5 4.5" />
    </Art>
  );
}

/** The same doorway with the way out. */
export function LeaveArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M6 42h36" />
      <path d="M13 42V21a11 11 0 0 1 22 0v21" fill="currentColor" fillOpacity="0.1" />
      <path d="M24 25v13M19.5 33.5 24 38l4.5-4.5" />
    </Art>
  );
}

/** A dome and minaret: Madinah. */
export function MadinahArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M4 42h40" />
      <path d="M9 42V31h26v11" />
      <path d="M11 31a11 11 0 0 1 22 0" fill="currentColor" fillOpacity="0.15" />
      <path d="M22 20v-4M22 12.6a2.4 2.4 0 1 0 1.6 3.4" />
      <path d="M40 42V17M38 17h4M40 17v-5M38.5 25h3" />
    </Art>
  );
}

/** The brand's eight-point star: the short answer. */
export function StarArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path
        d="M24 4l4.4 10.4L38 10l-4.4 9.6L44 24l-10.4 4.4L38 38l-9.6-4.4L24 44l-4.4-10.4L10 38l4.4-9.6L4 24l10.4-4.4L10 10l9.6 4.4Z"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <circle cx="24" cy="24" r="4.5" />
    </Art>
  );
}

/** A price tag. */
export function TagArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M7 27 24 10h14v14L21 41a3 3 0 0 1-4.2 0L7 31.2a3 3 0 0 1 0-4.2Z" fill="currentColor" fillOpacity="0.12" />
      <circle cx="31.5" cy="16.5" r="2.5" />
      <path d="M17 29l5 5M20.5 25.5l5 5" strokeOpacity="0.7" />
    </Art>
  );
}

/** Floating range bars, like the cost chart. */
export function RangeArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M6 41h36" />
      <path d="M8 12v27M20 12v27M32 12v27" strokeOpacity="0.25" />
      <path d="M11 15h13M16 24h22M9 33h15" strokeWidth={3.2} />
      <circle cx="28" cy="24" r="1.6" fill="currentColor" stroke="none" />
    </Art>
  );
}

/** Three sliders: the things that move the price. */
export function SlidersArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M13 7v34M24 7v34M35 7v34" strokeOpacity="0.55" />
      <circle cx="13" cy="30" r="4" fill="currentColor" fillOpacity="0.2" />
      <circle cx="24" cy="15" r="4" fill="currentColor" fillOpacity="0.2" />
      <circle cx="35" cy="24" r="4" fill="currentColor" fillOpacity="0.2" />
    </Art>
  );
}

/** A magnifying glass over a question: what to ask. */
export function AskArt(p: ArtProps) {
  return (
    <Art {...p}>
      <circle cx="20" cy="20" r="12" fill="currentColor" fillOpacity="0.1" />
      <path d="M29 29l11 11" strokeWidth={2.2} />
      <path d="M16.5 17a3.6 3.6 0 1 1 5 3.3c-1 .4-1.5 1.2-1.5 2.2v.6" />
      <path d="M20 27v.4" strokeWidth={2.2} />
    </Art>
  );
}

/** A calculator. */
export function CalculatorArt(p: ArtProps) {
  return (
    <Art {...p}>
      <rect x="11" y="5" width="26" height="38" rx="4" fill="currentColor" fillOpacity="0.1" />
      <rect x="15.5" y="9.5" width="17" height="8" rx="1.5" />
      <path d="M17 24h.5M24 24h.5M31 24h.5M17 30h.5M24 30h.5M31 30h.5M17 36h.5M24 36h.5M31 36h.5" strokeWidth={2.6} />
    </Art>
  );
}

/** A passport with a globe. */
export function PassportArt(p: ArtProps) {
  return (
    <Art {...p}>
      <rect x="11" y="5" width="26" height="38" rx="3.5" fill="currentColor" fillOpacity="0.1" />
      <circle cx="24" cy="20" r="6.5" />
      <path d="M17.5 20h13M24 13.5c2.2 2 2.2 11 0 13M24 13.5c-2.2 2-2.2 11 0 13" strokeWidth={1.2} />
      <path d="M18 34h12" />
    </Art>
  );
}

/** Ihram sheets on a hanger. */
export function IhramArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M21.5 9.5a2.5 2.5 0 1 1 3.3 2.4c-.5.2-.8.6-.8 1.1V14" />
      <path d="M24 14 6.5 23h35Z" />
      <path d="M8.5 23v15.5c5 2.2 10.5 2.2 15.5 0 5 2.2 10.5 2.2 15.5 0V23" fill="currentColor" fillOpacity="0.12" />
      <path d="M24 23v15.5" strokeOpacity="0.5" />
    </Art>
  );
}

/** A loose kameez. */
export function ClothesArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M18 7 8 12.5l3.5 8.5 4.5-2.2V42h16V18.8l4.5 2.2L40 12.5 30 7c-1 3.2-3.4 5-6 5s-5-1.8-6-5Z" fill="currentColor" fillOpacity="0.12" />
      <path d="M24 12v10" strokeOpacity="0.6" />
    </Art>
  );
}

/** A first-aid kit. */
export function HealthArt(p: ArtProps) {
  return (
    <Art {...p}>
      <rect x="7" y="14" width="34" height="26" rx="4" fill="currentColor" fillOpacity="0.1" />
      <path d="M18 14v-3.5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2V14" />
      <path d="M24 21v12M18 27h12" strokeWidth={2.2} />
    </Art>
  );
}

/** A phone and a coin. */
export function MoneyArt(p: ArtProps) {
  return (
    <Art {...p}>
      <rect x="9" y="5" width="18" height="34" rx="3.5" fill="currentColor" fillOpacity="0.1" />
      <path d="M16 34h4" />
      <circle cx="34" cy="33" r="8" fill="#fffdf9" />
      <circle cx="34" cy="33" r="4.5" strokeOpacity="0.55" />
    </Art>
  );
}

/** A drawstring bag. */
export function BagArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M13.5 19h21l4 20.5a3 3 0 0 1-3 3.5h-23a3 3 0 0 1-3-3.5Z" fill="currentColor" fillOpacity="0.12" />
      <path d="M16 19c0-6.5 16-6.5 16 0" />
      <path d="M21.5 14.5 18.5 8M26.5 14.5 29.5 8" />
    </Art>
  );
}

/** A folded letter with a seal: registration papers. */
export function SealArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M9 7h22l8 8v26H9Z" fill="currentColor" fillOpacity="0.1" />
      <path d="M31 7v8h8" />
      <path d="M14 17h11M14 22h16M14 27h9" strokeOpacity="0.6" />
      <circle cx="31" cy="33" r="5" />
      <path d="M28.5 37.5 27 43l4-2 4 2-1.5-5.5" />
    </Art>
  );
}
