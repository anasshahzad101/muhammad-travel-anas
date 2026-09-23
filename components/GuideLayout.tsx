import Link from "next/link";
import CtaBand from "./CtaBand";
import JsonLd from "./JsonLd";
import PageHero from "./PageHero";
import TocSpy, { type TocItem } from "./TocSpy";
import { CalendarIcon } from "./Icons";
import GuideHeroArt from "./guides/GuideHeroArt";
import MobileToc from "./guides/MobileToc";
import MoreGuides from "./guides/MoreGuides";
import { imageUrl, type ImageKey } from "@/lib/images";
import { cheapest, packages } from "@/lib/packages";
import { articleId, articleSchema, webPageSchema } from "@/lib/schema";
import { formatPKR } from "@/lib/site";

export type { TocItem };

/**
 * Shared frame for the long-form guides: the night hero (photo in an arch with
 * one floating fact), an optional full-width feature, then the article with a
 * sticky rail on desktop (table of contents that tracks the reader, and a
 * small packages card) and a collapsible contents list on phones. The other
 * guides close the page.
 */
export default function GuideLayout({
  title,
  lead,
  path,
  image,
  toc,
  updated,
  published,
  description,
  feature,
  heroCard,
  children,
}: {
  title: string;
  lead: string;
  path: string;
  image: ImageKey;
  toc: TocItem[];
  updated: string;
  published: string;
  description: string;
  /** Full-width block between the hero and the article (e.g. an interactive explainer). */
  feature?: React.ReactNode;
  /** Floating card on the hero photo: one fact the guide itself states. */
  heroCard?: React.ReactNode;
  children: React.ReactNode;
}) {
  const low = cheapest(packages);

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ path, title, description, datePublished: published, dateModified: updated, image, mainEntity: articleId(path) }),
          articleSchema({
            title,
            description,
            path,
            image: imageUrl(image, 1200),
            datePublished: published,
            dateModified: updated,
          }),
        ]}
      />
      <div aria-hidden className="read-progress fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600" />

      <PageHero
        crumbs={[
          { name: "Guides", path: "/guides/" },
          { name: title, path },
        ]}
        eyebrow="Umrah guide"
        title={title}
        lead={<p>{lead}</p>}
        aside={<GuideHeroArt image={image} card={heroCard} />}
      >
        <p className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm text-sand-200/75">
          <CalendarIcon className="h-4 w-4 text-gold-300" />
          <span>
            Updated{" "}
            <time dateTime={updated} className="font-semibold text-sand-100">
              {new Date(updated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
            </time>
          </span>
        </p>
      </PageHero>

      {feature}

      <div className="container-x grid gap-10 py-16 sm:py-20 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14 xl:gap-20">
        <aside className="hidden lg:block">
          <div className="sticky top-[calc(var(--header-h)+2rem)] space-y-8">
            <TocSpy toc={toc} />
            <div className="section-night on-dark relative overflow-hidden rounded-[var(--radius-card)] p-5">
              <div aria-hidden className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-gold-400/20 blur-2xl" />
              <p className="eyebrow relative">Ready to go?</p>
              <p className="relative mt-3 font-display text-[1.4rem] leading-[1.15] text-sand-50">Umrah packages with visa, flights & hotels</p>
              {low && (
                <p className="relative mt-2 text-[0.85rem] text-sand-200/80">
                  From <span className="figure font-bold text-gold-200">{formatPKR(low.amount)}</span> per person
                </p>
              )}
              <Link href="/umrah-packages/" className="btn btn-gold relative mt-4 w-full">
                See packages
              </Link>
            </div>
          </div>
        </aside>

        <article className="min-w-0 max-w-[53rem]">
          <MobileToc toc={toc} />
          {children}
        </article>
      </div>

      <MoreGuides current={path} />

      <CtaBand title="Have a question about Umrah?" body="Ask us on WhatsApp - about rules, documents, dates or packages. No obligation to book." />
    </>
  );
}
