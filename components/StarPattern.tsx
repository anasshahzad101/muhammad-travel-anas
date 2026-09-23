/**
 * Islamic geometric lattice (a khatam tessellation: eight-point stars joined by
 * crosses and octagons), drawn in currentColor. Used at low opacity behind dark
 * sections. Pure SVG pattern, so it costs no image request.
 */
export default function StarPattern({
  className = "",
  id = "mt-star-lattice",
  size = 96,
}: {
  className?: string;
  id?: string;
  size?: number;
}) {
  // Pass a distinct `id` when more than one lattice renders on the same page.
  const s = size;
  const h = s / 2;
  const q = s * 0.21; // half the star square
  const o = s * 0.5 - q; // gap from star to tile edge
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden>
      <defs>
        <pattern id={id} width={s} height={s} patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1">
            {/* Eight-point star at the tile centre. */}
            <rect x={h - q} y={h - q} width={q * 2} height={q * 2} />
            <rect x={h - q} y={h - q} width={q * 2} height={q * 2} transform={`rotate(45 ${h} ${h})`} />
            <circle cx={h} cy={h} r={q * 0.55} />
            {/* Arms that meet the neighbouring tiles and form the crosses between stars. */}
            <path d={`M${h} 0V${o * 0.55}M${h} ${s}V${s - o * 0.55}M0 ${h}H${o * 0.55}M${s} ${h}H${s - o * 0.55}`} />
            {/* Quarter stars in the corners complete the tessellation. */}
            <path
              d={`M0 ${q}L${q * 0.62} ${q * 0.62}L${q} 0M${s} ${q}L${s - q * 0.62} ${q * 0.62}L${s - q} 0M0 ${s - q}L${q * 0.62} ${s - q * 0.62}L${q} ${s}M${s} ${s - q}L${s - q * 0.62} ${s - q * 0.62}L${s - q} ${s}`}
            />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** A single ornamental eight-point star with rays, used as a divider or seal. */
export function StarSeal({ className = "h-16 w-16", strokeWidth = 1 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
      <rect x="22" y="22" width="56" height="56" />
      <rect x="22" y="22" width="56" height="56" transform="rotate(45 50 50)" />
      <rect x="32" y="32" width="36" height="36" transform="rotate(22.5 50 50)" />
      <rect x="32" y="32" width="36" height="36" transform="rotate(67.5 50 50)" />
      <circle cx="50" cy="50" r="12" />
      <circle cx="50" cy="50" r="46" strokeOpacity="0.5" />
    </svg>
  );
}

/** A horizontal ornament: hairlines either side of a small star. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-500/60" />
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold-500" fill="currentColor">
        <path d="M12 0l2.6 6.3L21 3.5l-2.8 6.4L24 12l-5.8 2.1L21 20.5l-6.4-2.8L12 24l-2.6-6.3L3 20.5l2.8-6.4L0 12l5.8-2.1L3 3.5l6.4 2.8z" />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-500/60" />
    </div>
  );
}
