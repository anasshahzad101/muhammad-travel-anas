import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { WhatsAppIcon } from "@/components/Icons";
import { breadcrumbSchema } from "@/lib/schema";
import { site, whatsappLink } from "@/lib/site";

/**
 * Shared shell for the Urdu guides: breadcrumb, hero, a single comfortable
 * reading column and a WhatsApp CTA. Article + BreadcrumbList schema are
 * emitted here with inLanguage "ur" (the builders in lib/schema.ts emit the
 * site's English defaults, so the Urdu article node is declared inline).
 */
export function GuideShell({
  slug,
  title,
  intro,
  description,
  children,
}: {
  slug: string;
  title: string;
  intro: string;
  description: string;
  children: React.ReactNode;
}) {
  const path = `/ur/guides/${slug}/`;
  const url = `${site.url}${path}`;
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    inLanguage: "ur",
    datePublished: "2026-10-16",
    dateModified: "2026-10-16",
    author: { "@id": `${site.url}/#organization` },
    publisher: { "@id": `${site.url}/#organization` },
  };
  const wa = whatsappLink(`السلام علیکم، مجھے "${title}" کے بارے میں مزید رہنمائی چاہئے۔`);

  return (
    <>
      <JsonLd
        data={[
          article,
          breadcrumbSchema([
            { name: "سرورق", path: "/ur/" },
            { name: "رہنمائی", path: "/ur/guides/" },
            { name: title, path },
          ]),
        ]}
      />
      <section className="section-night grain on-dark">
        <div className="container-x py-14 sm:py-16">
          <nav aria-label="breadcrumb" className="text-[0.9rem] text-sand-200/70">
            <Link href="/ur/" className="hover:text-gold-300">
              سرورق
            </Link>
            <span aria-hidden className="mx-2 text-gold-500/50">
              /
            </span>
            <Link href="/ur/guides/" className="hover:text-gold-300">
              رہنمائی
            </Link>
            <span aria-hidden className="mx-2 text-gold-500/50">
              /
            </span>
            <span className="text-sand-100">{title}</span>
          </nav>
          <h1 className="mt-6 max-w-3xl text-[2.2rem] font-bold leading-[1.4] text-sand-50 sm:text-[2.8rem]">{title}</h1>
          <p className="mt-5 max-w-2xl text-[1.15rem] leading-[2] text-sand-200/90">{intro}</p>
          <p className="mt-6 text-[0.9rem] text-sand-200/60">آخری جائزہ: اکتوبر 2026</p>
        </div>
      </section>
      <article className="container-x max-w-3xl py-12">{children}</article>
      <section className="section-night grain on-dark">
        <div className="container-x flex flex-col items-start gap-8 py-16 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[2rem] font-bold leading-tight text-sand-50">کوئی سوال رہ گیا؟</h2>
            <p className="mt-3 max-w-xl text-[1.1rem] leading-[1.9] text-sand-200/85">
              واٹس ایپ پر اردو میں پوچھیں - ہم روزانہ صبح 10 بجے سے رات 11 بجے تک جواب دیتے ہیں۔
            </p>
          </div>
          <a href={wa} rel="nofollow" className="btn btn-gold btn-lg shrink-0">
            <WhatsAppIcon className="h-5 w-5" />
            واٹس ایپ پر پوچھیں
          </a>
        </div>
      </section>
    </>
  );
}

export function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mt-12 scroll-mt-24 text-[1.7rem] font-bold leading-[1.5] text-ink-950">
      {children}
    </h2>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-[1.08rem] leading-[2.05] text-ink-800">{children}</p>;
}

export function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mt-4 list-disc space-y-2.5 pr-6 text-[1.08rem] leading-[2] text-ink-800 marker:text-gold-500">
      {items.map((x, i) => (
        <li key={i}>{x}</li>
      ))}
    </ul>
  );
}

/** An Arabic dua with its Urdu translation, set in the Arabic display font. */
export function Dua({ arabic, ur }: { arabic: string; ur: string }) {
  return (
    <div className="mt-5 rounded-2xl border border-gold-300/60 bg-gold-100/40 px-6 py-5">
      <p lang="ar" className="text-[1.45rem] leading-[2.3] text-ink-950" style={{ fontFamily: "var(--font-arabic)" }}>
        {arabic}
      </p>
      <p className="mt-2 text-[1rem] leading-[1.95] text-ink-700">ترجمہ: {ur}</p>
    </div>
  );
}

export function Faq({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="mt-6 space-y-4">
      {faqs.map((f) => (
        <details key={f.q} className="card group px-6 py-5">
          <summary className="cursor-pointer list-none text-[1.12rem] font-bold text-ink-950">{f.q}</summary>
          <p className="mt-3 text-[1.05rem] leading-[1.95] text-ink-700">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
