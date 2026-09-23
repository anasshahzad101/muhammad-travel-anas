import DuaActions from "./DuaActions";
import { InfoIcon } from "./Icons";
import { StarSeal } from "./StarPattern";
import type { Dua } from "@/lib/duas";

/**
 * One dua, set like a page from a prayer book: when to say it, the Arabic,
 * the transliteration, the meaning in the display serif, any note, and the
 * source with copy / send actions. The text comes straight from lib/duas.ts.
 */
export default function DuaCard({ dua, showWhen = true }: { dua: Dua; showWhen?: boolean }) {
  const share = [dua.arabic, dua.transliteration, `"${dua.meaning}"`, `(${dua.source})`].join("\n");
  return (
    <figure
      id={`dua-${dua.id}`}
      className="not-prose reveal relative scroll-mt-28 overflow-hidden rounded-[26px] border border-gold-400/40 bg-[linear-gradient(165deg,#fffdf8_0%,#faf3e4_55%,#f3e8d2_100%)] p-6 shadow-[0_30px_60px_-44px_rgb(20_17_13/0.6)] sm:p-9"
    >
      <span aria-hidden className="pointer-events-none absolute inset-2 rounded-[20px] border border-gold-400/20" />
      <span aria-hidden className="pointer-events-none absolute -right-14 -top-14 text-gold-400/15">
        <StarSeal className="h-48 w-48" strokeWidth={0.6} />
      </span>
      {showWhen && <p className="eyebrow relative pr-8 !leading-snug">{dua.when}</p>}
      <p className="arabic relative mt-6 text-right text-[1.9rem] leading-[2.1] text-ink-950 sm:text-[2.3rem]" lang="ar">
        {dua.arabic}
      </p>
      <div aria-hidden className="relative mt-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-500/45" />
        <svg viewBox="0 0 24 24" className="h-3 w-3 text-gold-500" fill="currentColor">
          <path d="M12 0l2.6 6.3L21 3.5l-2.8 6.4L24 12l-5.8 2.1L21 20.5l-6.4-2.8L12 24l-2.6-6.3L3 20.5l2.8-6.4L0 12l5.8-2.1L3 3.5l6.4 2.8z" />
        </svg>
        <span className="h-px w-12 bg-gold-500/45" />
      </div>
      <p className="relative mt-4 text-[1.02rem] italic leading-relaxed text-ink-700">{dua.transliteration}</p>
      <p className="relative mt-3 font-display text-[1.38rem] font-medium leading-snug text-ink-950 sm:text-[1.5rem]">“{dua.meaning}”</p>
      {dua.note && (
        <p className="relative mt-5 flex gap-3 rounded-2xl border border-gold-400/20 bg-[#fffdf9]/70 px-4 py-3.5 text-[0.92rem] leading-relaxed text-ink-700">
          <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
          <span>{dua.note}</span>
        </p>
      )}
      <figcaption className="relative mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gold-400/25 pt-4">
        <span className="flex items-start gap-2 text-[0.8rem] leading-snug text-ink-500">
          <svg viewBox="0 0 24 24" className="mt-px h-4 w-4 shrink-0 text-gold-600" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 6.5C10.3 5 7.9 4.5 4 4.5v14c3.9 0 6.3.5 8 2 1.7-1.5 4.1-2 8-2v-14c-3.9 0-6.3.5-8 2Zm0 0v14" />
          </svg>
          <span>Source: {dua.source}</span>
        </span>
        <span className="ml-auto">
          <DuaActions text={share} />
        </span>
      </figcaption>
    </figure>
  );
}
