/**
 * Repeating eight-point-star lattice, drawn in currentColor. Used at low opacity
 * behind dark sections. Pure SVG pattern, so it costs no image request.
 */
export default function StarPattern({ className = "", id = "mt-star-lattice" }: { className?: string; id?: string }) {
  // Pass a distinct `id` when more than one lattice renders on the same page.
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden>
      <defs>
        <pattern id={id} width="56" height="56" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="16" y="16" width="24" height="24" />
            <rect x="16" y="16" width="24" height="24" transform="rotate(45 28 28)" />
            <path d="M0 28h8M48 28h8M28 0v8M28 48v8" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
