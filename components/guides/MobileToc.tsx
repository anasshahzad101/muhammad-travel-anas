import { ChevronDownIcon } from "../Icons";
import type { TocItem } from "../TocSpy";

/**
 * The table of contents for phones and tablets: a <details> disclosure at the
 * top of the article, so it works without JavaScript and stays out of the way
 * until it is wanted. Hidden where the sticky desktop rail takes over.
 */
export default function MobileToc({ toc }: { toc: TocItem[] }) {
  return (
    <details className="not-prose group mb-14 overflow-hidden rounded-[20px] border border-sand-300 bg-[#fffdf9] shadow-[0_18px_40px_-34px_rgb(20_17_13/0.5)] open:border-gold-400/60 lg:hidden">
      <summary className="flex min-h-14 items-center justify-between gap-4 px-5">
        <span className="flex items-center gap-3">
          <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-gold-700">On this page</span>
          <span className="figure rounded-full bg-sand-100 px-2 py-0.5 text-[0.74rem] font-bold text-ink-600">{toc.length}</span>
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-sand-300 text-gold-700 transition duration-300 group-open:rotate-180 group-open:border-gold-400">
          <ChevronDownIcon className="h-4 w-4" />
        </span>
      </summary>
      <ol className="border-t border-sand-200 px-2 py-2">
        {toc.map((t, i) => (
          <li key={t.id}>
            <a href={`#${t.id}`} className="flex min-h-11 items-center gap-3.5 rounded-xl px-3 text-[0.97rem] font-semibold text-ink-800 transition hover:bg-sand-100">
              <span className="figure w-5 shrink-0 text-[0.74rem] font-extrabold text-gold-600">{String(i + 1).padStart(2, "0")}</span>
              {t.label}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}
