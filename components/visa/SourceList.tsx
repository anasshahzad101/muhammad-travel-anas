import { ExternalIcon } from "./icons";

/**
 * Sources as a numbered reference list: publisher, title and the site it links
 * to. The label is split on " - " for the layout, and the separator is kept for
 * screen readers, so the link's accessible name is the full original label.
 */
export default function SourceList({ sources }: { sources: { label: string; href: string }[] }) {
  return (
    <ol className="card reveal divide-y divide-sand-200 overflow-hidden">
      {sources.map((s, i) => {
        const [publisher, ...rest] = s.label.split(" - ");
        const title = rest.join(" - ");
        const host = new URL(s.href).hostname.replace(/^www\./, "");
        return (
          <li key={s.href}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-11 items-start gap-4 px-5 py-5 transition-colors duration-300 hover:bg-sand-100/80 sm:gap-5 sm:px-7"
            >
              <span aria-hidden className="figure mt-[0.15rem] w-6 shrink-0 text-[0.74rem] font-extrabold text-gold-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-gold-700">{publisher}</span>
                {title ? (
                  <>
                    <span className="sr-only"> - </span>
                    <span className="mt-1.5 block text-[1rem] font-semibold leading-snug text-ink-900 transition-colors group-hover:text-haram-800">{title}</span>
                  </>
                ) : null}
                <span className="mt-1.5 block text-[0.8rem] text-ink-500">{host}</span>
              </span>
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sand-300 text-ink-500 transition duration-300 group-hover:border-haram-600 group-hover:bg-haram-700 group-hover:text-sand-50">
                <ExternalIcon className="h-3.5 w-3.5" />
              </span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
