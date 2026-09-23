import { Fragment } from "react";
import { CheckIcon, InfoIcon, XIcon } from "../Icons";

/**
 * Building blocks for the long-form guides. The article column is not one
 * big .prose-mt block any more: running text sits in <Prose> at a reading
 * measure, and the designed pieces (chapter openers, key facts, callouts)
 * sit between them at the full column width.
 *
 * Every chapter keeps its H2 and the id the table of contents links to.
 */

type Art = React.ComponentType<{ className?: string }>;

/** Running text at a comfortable measure, styled by .prose-mt. */
export function Prose({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`prose-mt max-w-[42rem] ${className}`}>{children}</div>;
}

/** Drop cap for the opening paragraph of a guide (a CSS ::first-letter, so the text is untouched). */
export const dropCap =
  "first-letter:float-left first-letter:mr-3 first-letter:mt-[0.42rem] first-letter:font-display first-letter:text-[4.35rem] first-letter:font-semibold first-letter:leading-[0.7] first-letter:text-gold-600";

/** The illustration on a small mihrab-arch plate. */
export function ArtPlate({ art: A, size = "md", tone = "ivory" }: { art: Art; size?: "sm" | "md"; tone?: "ivory" | "night" }) {
  const box = size === "md" ? "h-[5.6rem] w-[4.6rem] pt-5 sm:h-[6.5rem] sm:w-[5.3rem] sm:pt-6" : "h-[4.5rem] w-[3.7rem] pt-4";
  const ico = size === "md" ? "h-11 w-11 sm:h-[3.15rem] sm:w-[3.15rem]" : "h-9 w-9";
  const lamp = size === "md" ? "top-[13%] h-2.5 w-2.5" : "top-[12%] h-2 w-2";
  const night = tone === "night";
  return (
    <span aria-hidden className={`relative flex shrink-0 items-center justify-center ${box}`}>
      <span
        className={`arch absolute inset-0 border ${
          night
            ? "border-gold-400/40 bg-[linear-gradient(180deg,rgb(212_171_90/0.2),rgb(255_255_255/0.02)_75%)]"
            : "border-gold-400/55 bg-[linear-gradient(180deg,#fbf3df,#fffdf9_72%)] shadow-[0_18px_30px_-22px_rgb(122_86_31/0.55)]"
        }`}
      />
      <span className={`arch absolute inset-[4px] border ${night ? "border-gold-400/15" : "border-gold-400/25"}`} />
      {/* A small star at the apex, like the lamp hanging in a mihrab. */}
      <svg viewBox="0 0 24 24" className={`absolute left-1/2 -translate-x-1/2 ${lamp} ${night ? "text-gold-300/70" : "text-gold-500/80"}`} fill="currentColor">
        <path d="M12 0l2.6 6.3L21 3.5l-2.8 6.4L24 12l-5.8 2.1L21 20.5l-6.4-2.8L12 24l-2.6-6.3L3 20.5l2.8-6.4L0 12l5.8-2.1L3 3.5l6.4 2.8z" />
      </svg>
      <A className={`relative ${ico} ${night ? "text-gold-300" : "text-gold-700"}`} />
    </span>
  );
}

/** "Step 2 of 4" as four diamonds on a thread, the current one lit. */
export function StepTrack({ current, total }: { current: number; total: number }) {
  return (
    <span aria-hidden className="flex items-center">
      {Array.from({ length: total }, (_, i) => (
        <Fragment key={i}>
          {i > 0 && <span className={`h-px w-4 sm:w-6 ${i < current ? "bg-gold-500" : "bg-sand-300"}`} />}
          <span
            className={`h-2.5 w-2.5 rotate-45 ${
              i < current - 1 ? "bg-gold-500" : i === current - 1 ? "bg-gold-500 shadow-[0_0_0_4px_rgb(230_199_127/0.45)]" : "border border-sand-400"
            }`}
          />
        </Fragment>
      ))}
    </span>
  );
}

/** Chapter opener: arch plate, eyebrow (and step track), the H2 and a gold rule. */
export function ChapterHeader({
  id,
  title,
  eyebrow,
  art,
  step,
}: {
  id: string;
  title: React.ReactNode;
  eyebrow: string;
  art: Art;
  step?: { current: number; total: number };
}) {
  return (
    <header className="not-prose reveal">
      <div className="flex items-end gap-5 sm:gap-7">
        <ArtPlate art={art} />
        <div className="min-w-0 pb-0.5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="eyebrow">{eyebrow}</p>
            {step && <StepTrack current={step.current} total={step.total} />}
          </div>
          <h2
            id={id}
            className="mt-3 scroll-mt-[calc(var(--header-h)+1.5rem)] text-[clamp(2rem,1.45rem+1.9vw,3rem)] font-medium leading-[1.02] tracking-[-0.018em]"
          >
            {title}
          </h2>
        </div>
      </div>
      <div aria-hidden className="mt-7 flex items-center gap-3">
        <span className="h-px w-16 bg-gold-500/70" />
        <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 text-gold-500" fill="currentColor">
          <path d="M12 0l2.6 6.3L21 3.5l-2.8 6.4L24 12l-5.8 2.1L21 20.5l-6.4-2.8L12 24l-2.6-6.3L3 20.5l2.8-6.4L0 12l5.8-2.1L3 3.5l6.4 2.8z" />
        </svg>
        <span className="h-px flex-1 bg-gradient-to-r from-gold-500/40 to-transparent" />
      </div>
    </header>
  );
}

/** A chapter: its opener, then the blocks, evenly spaced. */
export function Chapter({
  id,
  title,
  eyebrow,
  art,
  step,
  first = false,
  children,
}: {
  id: string;
  title: React.ReactNode;
  eyebrow: string;
  art: Art;
  step?: { current: number; total: number };
  /** The opening chapter sits directly under the article top. */
  first?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={first ? "" : "mt-24 sm:mt-32"}>
      <ChapterHeader id={id} title={title} eyebrow={eyebrow} art={art} step={step} />
      <div className="mt-10 space-y-10">{children}</div>
    </section>
  );
}

/** An H3 inside a chapter, led by a small gold diamond. */
export function SubHead({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-3 text-[1.6rem] leading-tight sm:text-[1.75rem]">
      <span aria-hidden className="h-2 w-2 shrink-0 rotate-45 bg-gold-500" />
      {children}
    </h3>
  );
}

export type Fact = { label: string; value: React.ReactNode; sub?: React.ReactNode; figure?: boolean };

/** Key facts as tiles. Only restates what the chapter text already says. */
export function KeyFacts({ facts, label = "Key facts" }: { facts: Fact[]; label?: string }) {
  const odd = facts.length % 2 === 1;
  // Container queries: the tiles go four (or three) across only when this box is wide enough, wherever it sits.
  const cols = facts.length === 3 ? "@xl:grid-cols-3" : "@2xl:grid-cols-4";
  return (
    <div className="@container reveal overflow-hidden rounded-[24px] border border-gold-400/40 bg-[#fffdf9] shadow-[0_28px_50px_-42px_rgb(20_17_13/0.55)]">
      <p className="flex items-center gap-2.5 border-b border-sand-200 bg-[linear-gradient(90deg,#fbf3df,#fffdf9)] px-5 py-3 text-[0.66rem] font-extrabold uppercase tracking-[0.2em] text-gold-700 sm:px-6">
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
          <path d="M12 0l2.6 6.3L21 3.5l-2.8 6.4L24 12l-5.8 2.1L21 20.5l-6.4-2.8L12 24l-2.6-6.3L3 20.5l2.8-6.4L0 12l5.8-2.1L3 3.5l6.4 2.8z" />
        </svg>
        {label}
      </p>
      <dl className={`grid grid-cols-2 gap-px bg-sand-200 ${cols}`}>
        {facts.map((f, i) => (
          <div key={f.label} className={`flex flex-col bg-[#fffdf9] px-5 py-5 sm:px-6 ${odd && i === facts.length - 1 ? "col-span-2 @xl:col-span-1" : ""}`}>
            <dt className="text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-ink-500">{f.label}</dt>
            <dd
              className={
                f.figure
                  ? "figure mt-2 text-[2.5rem] font-extrabold leading-none text-haram-800"
                  : "mt-2 font-display text-[1.5rem] font-semibold leading-[1.1] text-ink-950"
              }
            >
              {f.value}
            </dd>
            {f.sub && <dd className="mt-1.5 text-[0.86rem] leading-snug text-ink-600">{f.sub}</dd>}
          </div>
        ))}
      </dl>
    </div>
  );
}

/** A numbered sequence on a gold thread (the order is the point). */
export function Steps({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="reveal relative space-y-3">
      <span aria-hidden className="absolute bottom-7 left-[1.2rem] top-7 w-px bg-gradient-to-b from-gold-400 via-gold-300/70 to-haram-500/50" />
      {items.map((it, i) => (
        <li key={i} className="relative grid grid-cols-[2.4rem_minmax(0,1fr)] items-start gap-3.5 sm:gap-5">
          <span
            aria-hidden
            className="figure relative z-10 mt-2.5 flex h-[2.4rem] w-[2.4rem] items-center justify-center rounded-full border border-gold-400/70 bg-sand-50 text-[0.88rem] font-extrabold text-gold-700 shadow-[0_0_0_5px_var(--color-sand-50)]"
          >
            {i + 1}
          </span>
          <div className="rounded-2xl border border-sand-300 bg-[#fffdf9] px-5 py-4 text-[1rem] leading-relaxed text-ink-800 transition duration-300 hover:border-gold-400/60 [&_em]:font-semibold [&_em]:text-haram-800">
            {it}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** A list as rows in one card: ticks for things to do, crosses for things to avoid. */
export function Rows({ items, tone = "do" }: { items: React.ReactNode[]; tone?: "do" | "avoid" }) {
  const avoid = tone === "avoid";
  return (
    <ul className="reveal divide-y divide-sand-200 overflow-hidden rounded-[22px] border border-sand-300 bg-[#fffdf9] shadow-[0_24px_50px_-42px_rgb(20_17_13/0.5)]">
      {items.map((it, i) => (
        <li key={i} className="flex gap-4 px-5 py-4 text-[1rem] leading-relaxed text-ink-800 sm:px-6">
          <span
            aria-hidden
            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${avoid ? "bg-[#f7e7e0] text-[#9a4631]" : "bg-haram-50 text-haram-700"}`}
          >
            {avoid ? <XIcon className="h-3.5 w-3.5" /> : <CheckIcon className="h-4 w-4" />}
          </span>
          <span className="min-w-0 [&_strong]:text-ink-950">{it}</span>
        </li>
      ))}
    </ul>
  );
}

/** A note set apart from the running text. */
export function Callout({ children, icon: I = InfoIcon, className = "" }: { children: React.ReactNode; icon?: Art; className?: string }) {
  return (
    <div
      role="note"
      className={`reveal flex gap-4 rounded-[22px] border border-haram-600/20 bg-haram-50 p-5 text-[0.98rem] leading-relaxed text-haram-900 sm:p-6 ${className}`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-haram-700 text-sand-50">
        <I className="h-5 w-5" />
      </span>
      <p className="min-w-0 self-center [&_a]:font-semibold [&_a]:text-haram-800 [&_a]:underline [&_a]:decoration-gold-400 [&_a]:underline-offset-4 [&_a:hover]:text-haram-950">
        {children}
      </p>
    </div>
  );
}
