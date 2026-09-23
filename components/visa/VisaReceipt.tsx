import { StarGlyph } from "./icons";

/**
 * "What the Umrah visa costs" as an itemised receipt: the same table as before
 * (a real <table>, which answer engines read well), laid out as a paper slip
 * with a torn edge. Rows are CSS grids so they can stack on phones; the ARIA
 * table roles keep the table semantics that some browsers drop once a table's
 * display is changed.
 */

export type ReceiptLine = {
  item: React.ReactNode;
  setBy: React.ReactNode;
  cost: string;
  /** Small print under the cost, e.g. the rupee conversion. */
  costNote?: string;
  /** Set a cost that is a figure (not words) large, in the figure face. */
  numeric?: boolean;
  icon: (p: { className?: string }) => React.ReactNode;
};

/**
 * Layout follows the receipt's own width (a container query), not the
 * viewport: it sits in a narrow column on laptops. Narrow: one column (item,
 * then cost, then who sets it). From 34rem: three columns. From 40rem: the
 * total's label and price sit side by side.
 */
const ROW = "grid grid-cols-1 @min-[34rem]:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,0.78fr)] @min-[34rem]:gap-x-6";

/** Torn paper: a row of teeth cut with a conic-gradient mask. */
const TEETH = "conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 20px 100%";

export default function VisaReceipt({
  labelledBy,
  columns,
  lines,
  total,
  checked,
}: {
  labelledBy: string;
  /** Column headings, in DOM order: item, who sets it, cost. */
  columns: [string, string, string];
  lines: ReceiptLine[];
  total: { item: React.ReactNode; setBy: React.ReactNode; cost: string };
  checked: string;
}) {
  return (
    <div className="reveal @container relative mx-auto w-full max-w-[42rem] pt-2">
      {/* A second sheet peeking out behind the first. */}
      <div
        aria-hidden
        className="absolute inset-x-4 bottom-0 top-10 translate-x-2 rotate-[2.6deg] rounded-[22px] border border-sand-300 bg-[#f9f4ea] shadow-[0_24px_40px_-30px_rgb(20_17_13/0.45)] sm:translate-x-3"
      />

      <div className="relative [filter:drop-shadow(0_1px_1px_rgb(20_17_13/0.08))_drop-shadow(0_30px_34px_rgb(20_17_13/0.16))]">
        <div className="relative rounded-t-[22px] bg-[#fffdf9] px-5 pb-8 pt-7 sm:px-9 sm:pt-9">
          <span aria-hidden className="absolute inset-x-0 top-0 h-1.5 rounded-t-[22px] bg-gradient-to-r from-gold-600 via-gold-300 to-gold-600" />

          <div className="flex items-start justify-between gap-5">
            <div className="pt-1">
              <p className="flex items-center gap-2 text-[0.66rem] font-extrabold uppercase tracking-[0.22em] text-gold-700">
                <StarGlyph className="h-2.5 w-2.5" />
                Cost breakdown
              </p>
              <p className="mt-3 font-display text-[2.15rem] font-semibold leading-none text-ink-950 sm:text-[2.5rem]">Umrah visa</p>
            </div>
            <Stamp checked={checked} />
          </div>

          <table role="table" aria-labelledby={labelledBy} className="mt-7 block w-full border-t-2 border-double border-sand-400/80 text-left">
            <thead role="rowgroup" className="block">
              <tr role="row" className={`${ROW} @min-[34rem]:border-b @min-[34rem]:border-sand-300 @min-[34rem]:py-3`}>
                {columns.map((c, i) => (
                  <th
                    key={c}
                    role="columnheader"
                    scope="col"
                    className={`text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-gold-700 @max-[34rem]:sr-only ${i === 2 ? "text-right" : ""}`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody role="rowgroup" className="block">
              {lines.map((l, i) => (
                <tr
                  key={i}
                  role="row"
                  className={`${ROW} reveal items-start gap-y-2 border-b border-dashed border-sand-300 py-5`}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <th role="rowheader" scope="row" className="flex gap-3 text-left">
                    <span aria-hidden className="figure mt-[0.22rem] w-5 shrink-0 text-[0.7rem] font-extrabold text-gold-600">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.98rem] font-semibold leading-snug text-ink-950">{l.item}</span>
                  </th>
                  <td role="cell" className="order-3 flex items-start gap-2 pl-8 text-[0.85rem] leading-snug text-ink-600 @min-[34rem]:order-none @min-[34rem]:pl-0">
                    <l.icon className="mt-[0.1rem] h-4 w-4 shrink-0 text-gold-600" />
                    <span>{l.setBy}</span>
                  </td>
                  <td role="cell" className="order-2 pl-8 @min-[34rem]:order-none @min-[34rem]:pl-0 @min-[34rem]:text-right">
                    {l.numeric ? (
                      <span className="figure text-[1.2rem] font-extrabold leading-none text-ink-950 @min-[34rem]:block @min-[34rem]:text-[1.35rem]">{l.cost}</span>
                    ) : (
                      <span className="text-[0.92rem] font-bold leading-snug text-ink-800 @min-[34rem]:block @min-[34rem]:font-semibold">{l.cost}</span>
                    )}
                    {l.costNote ? (
                      <span className="figure ml-1.5 text-[0.8rem] font-semibold text-ink-500 @min-[34rem]:ml-0 @min-[34rem]:mt-1.5 @min-[34rem]:block"> {l.costNote}</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot role="rowgroup" className="block pt-6">
              <tr
                role="row"
                className="section-night grain on-dark relative grid gap-x-6 gap-y-2 overflow-hidden rounded-2xl px-5 py-5 @min-[34rem]:px-7 @min-[34rem]:py-6 @min-[40rem]:grid-cols-[minmax(0,1fr)_auto] @min-[40rem]:items-center"
              >
                <th
                  role="rowheader"
                  scope="row"
                  className="text-left font-display text-[1.45rem] font-semibold leading-tight text-sand-50 @min-[40rem]:col-start-1 @min-[40rem]:row-start-1"
                >
                  {total.item}
                </th>
                <td
                  role="cell"
                  className="order-3 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-gold-300/80 @min-[40rem]:order-none @min-[40rem]:col-start-1 @min-[40rem]:row-start-2"
                >
                  {total.setBy}
                </td>
                <td
                  role="cell"
                  className="order-2 @min-[40rem]:order-none @min-[40rem]:col-start-2 @min-[40rem]:row-span-2 @min-[40rem]:row-start-1 @min-[40rem]:text-right"
                >
                  <span className="figure text-foil block whitespace-nowrap text-[clamp(1.3rem,7.2cqw,2.1rem)] font-extrabold leading-none">{total.cost}</span>
                </td>
              </tr>
            </tfoot>
          </table>

          <Barcode className="mx-auto mt-7 h-9 w-48 text-ink-800/70" />
        </div>
        <div aria-hidden className="h-3 w-full bg-[#fffdf9]" style={{ WebkitMask: TEETH, mask: TEETH }} />
      </div>
    </div>
  );
}

/** A rubber stamp in gold ink, set on a circle: purely decorative. */
function Stamp({ checked }: { checked: string }) {
  const ring = `MARKET RANGE · ${checked.toUpperCase()} · `;
  return (
    <svg viewBox="0 0 120 120" className="h-[5.6rem] w-[5.6rem] shrink-0 -rotate-[14deg] text-gold-600/75 sm:-mr-2 sm:-mt-2 sm:h-28 sm:w-28" aria-hidden>
      <defs>
        <path id="visa-stamp-ring" d="M60 60m-43 0a43 43 0 1 1 86 0a43 43 0 1 1-86 0" />
      </defs>
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="60" cy="60" r="52.5" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="60" cy="60" r="33" fill="none" stroke="currentColor" strokeWidth="0.9" />
      <text fill="currentColor" fontSize="9.2" fontWeight="800" letterSpacing="2.2">
        <textPath href="#visa-stamp-ring" textLength="268">
          {ring}
        </textPath>
      </text>
      <g transform="translate(46 46) scale(1.17)" fill="currentColor">
        <path d="M12 0l2.6 6.3L21 3.5l-2.8 6.4L24 12l-5.8 2.1L21 20.5l-6.4-2.8L12 24l-2.6-6.3L3 20.5l2.8-6.4L0 12l5.8-2.1L3 3.5l6.4 2.8z" />
      </g>
    </svg>
  );
}

/** Receipt barcode: fixed bar widths so server and client always agree. */
function Barcode({ className = "" }: { className?: string }) {
  const bars = [2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 1, 3, 2, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 1, 1];
  let x = 0;
  const rects = bars.map((w, i) => {
    const r = i % 2 === 0 ? <rect key={i} x={x} y={0} width={w} height={36} /> : null;
    x += w + 1;
    return r;
  });
  return (
    <svg viewBox={`0 0 ${x} 36`} preserveAspectRatio="none" className={className} fill="currentColor" aria-hidden>
      {rects}
    </svg>
  );
}
