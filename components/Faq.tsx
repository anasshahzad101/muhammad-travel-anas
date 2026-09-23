import { ChevronDownIcon } from "./Icons";
import JsonLd from "./JsonLd";
import { faqSchema } from "@/lib/schema";

/**
 * Server-rendered FAQ accordion (<details>, no JS) plus FAQPage JSON-LD. Answers
 * are in the HTML source, which is what answer engines quote from.
 */
export default function Faq({
  faqs,
  heading = "Frequently asked questions",
  schema = true,
}: {
  faqs: { q: string; a: string }[];
  heading?: string;
  schema?: boolean;
}) {
  if (faqs.length === 0) return null;
  return (
    <section aria-labelledby="faq-heading">
      {schema && <JsonLd data={faqSchema(faqs)} />}
      <h2 id="faq-heading" className="text-3xl sm:text-4xl">
        {heading}
      </h2>
      <div className="mt-6 divide-y divide-sand-300 border-y border-sand-300">
        {faqs.map((f, i) => (
          <details key={f.q} className="group py-1" open={i === 0}>
            <summary className="flex items-start justify-between gap-4 py-4 text-left text-[1.05rem] font-semibold text-ink-950">
              <span>{f.q}</span>
              <ChevronDownIcon className="mt-1 h-5 w-5 shrink-0 text-gold-600 transition group-open:rotate-180" />
            </summary>
            <p className="pb-5 pr-8 text-[0.98rem] leading-relaxed text-ink-700">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
