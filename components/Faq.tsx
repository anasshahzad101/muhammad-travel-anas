import JsonLd from "./JsonLd";
import { faqSchema } from "@/lib/schema";

/**
 * Server-rendered FAQ accordion (<details>, no JS) plus FAQPage JSON-LD. Answers
 * are in the HTML source, which is what answer engines quote from. Browsers
 * that support ::details-content animate the open/close (see globals.css).
 */
export default function Faq({
  faqs,
  heading = "Frequently asked questions",
  schema = true,
  onDark = false,
}: {
  faqs: { q: string; a: string }[];
  heading?: string;
  schema?: boolean;
  onDark?: boolean;
}) {
  if (faqs.length === 0) return null;
  const id = `faq-${heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  return (
    <section aria-labelledby={id}>
      {schema && <JsonLd data={faqSchema(faqs)} />}
      <h2 id={id} className="h-section reveal max-w-2xl !text-[clamp(2rem,1.5rem+1.6vw,3rem)]">
        {heading}
      </h2>
      <div className="mt-8 space-y-3">
        {faqs.map((f, i) => (
          <details
            key={f.q}
            className={`faq-item reveal group rounded-2xl border px-5 transition-[border-color,box-shadow,background-color] duration-300 sm:px-6 ${
              onDark
                ? "border-white/10 bg-white/[0.03] open:border-gold-400/40 open:bg-white/[0.06]"
                : "border-sand-300 bg-[#fffdf9] open:border-gold-400/60 open:shadow-[0_24px_50px_-34px_rgb(20_17_13/0.45)]"
            }`}
            open={i === 0}
          >
            <summary className="flex items-start gap-4 py-5 text-left">
              <span className={`figure mt-[0.3rem] w-6 shrink-0 text-[0.74rem] font-extrabold ${onDark ? "text-gold-300" : "text-gold-600"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`flex-1 text-[1.06rem] font-bold leading-snug ${onDark ? "text-sand-50" : "text-ink-950"}`}>{f.q}</span>
              <span
                aria-hidden
                className={`relative mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition duration-300 group-open:rotate-45 ${
                  onDark ? "border-white/20 text-gold-300" : "border-sand-300 text-gold-700 group-open:border-gold-400 group-open:bg-gold-100"
                }`}
              >
                <span className="absolute h-px w-3 bg-current" />
                <span className="absolute h-3 w-px bg-current" />
              </span>
            </summary>
            <p className={`pb-6 pl-10 pr-4 text-[0.98rem] leading-relaxed sm:pr-10 ${onDark ? "text-sand-200/85" : "text-ink-700"}`}>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
