import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";
import { lastChanged, type PageGroup } from "@/lib/lastmod";
import { packages } from "@/lib/packages";
import { reviewStats } from "@/lib/reviews";
import { season } from "@/lib/season";
import { site } from "@/lib/site";

/**
 * lastmod is when each page's content last changed: the commit date of the
 * last change to the files that make it (lib/page-files.mjs, read through
 * lib/lastmod.ts). So a price refresh moves every priced page, a new review
 * moves /reviews/, the homepage and /about/, a rewritten guide moves that
 * guide, and nothing else moves. Google uses lastmod to decide what to
 * recrawl, and only while it proves accurate. The fixed dates passed as
 * fallbacks are the last resort and a floor.
 *
 * /llms.txt and /llms-full.txt are deliberately left out. A sitemap lists the
 * canonical pages we want in search results; the llms files are plain-text
 * digests of those same pages for AI assistants, found by the /llms.txt
 * convention and the link inside it. Listing them would invite search engines
 * to index a wall of text that competes with the real pages, and answer engines
 * should cite (and send visitors to) the HTML pages. Share-card images
 * (/og/...) and /logo.png are not pages either.
 *
 * Bing and the other IndexNow engines are told about changed pages after each
 * deploy by scripts/indexnow.mjs, which reads this sitemap's lastmod values.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const priced = new Date(season.pricesCheckedISO);
  const launch = new Date("2026-09-23");
  const urLaunch = new Date("2026-10-16");
  const reviews = reviewStats();
  // `as const` so that `guide:${g}` is checked against the groups in lib/page-files.mjs.
  const guideSlugs = ["how-to-perform-umrah", "umrah-duas", "umrah-cost-from-pakistan", "umrah-packing-list", "umrah-vaccination-requirements", "nusuk-app-guide"] as const;

  const u = (path: string, group: PageGroup, fallback: Date, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${site.url}${path}`,
    lastModified: lastChanged(group, fallback),
    priority,
  });

  // Pages that also exist in Urdu carry their hreflang pairs; /ur/ pages mirror them.
  const urdu = (enPath: string, urPath: string) => ({
    languages: { "en-PK": `${site.url}${enPath}`, ur: `${site.url}${urPath}`, "x-default": `${site.url}${enPath}` },
  });

  return [
    { ...u("/", "home", priced, 1), alternates: urdu("/", "/ur/") },
    { ...u("/umrah-packages/", "hub", priced, 0.95), alternates: urdu("/umrah-packages/", "/ur/umrah-packages/") },
    { ...u("/ur/", "ur-home", urLaunch, 0.7), alternates: urdu("/", "/ur/") },
    { ...u("/ur/umrah-packages/", "ur-hub", urLaunch, 0.7), alternates: urdu("/umrah-packages/", "/ur/umrah-packages/") },
    ...categories.map((c) => u(`/umrah-packages/${c.slug}/`, "category", priced, c.group === "season" || c.group === "city" ? 0.9 : 0.85)),
    // Every package has an Urdu twin; both entries carry the hreflang pair.
    ...packages.map((p) => ({
      ...u(`/umrah-packages/${p.slug}/`, "package", priced, 0.8),
      alternates: urdu(`/umrah-packages/${p.slug}/`, `/ur/umrah-packages/${p.slug}/`),
    })),
    ...packages.map((p) => ({
      ...u(`/ur/umrah-packages/${p.slug}/`, "ur-package", urLaunch, 0.7),
      alternates: urdu(`/umrah-packages/${p.slug}/`, `/ur/umrah-packages/${p.slug}/`),
    })),
    u("/umrah-visa/", "visa", priced, 0.9),
    u("/umrah-tickets/", "tickets", priced, 0.7),
    // Guides exist in both languages; both entries carry the hreflang pair.
    { ...u("/guides/", "guides", launch, 0.6), alternates: urdu("/guides/", "/ur/guides/") },
    { ...u("/ur/guides/", "ur-guides", urLaunch, 0.55), alternates: urdu("/guides/", "/ur/guides/") },
    ...guideSlugs.flatMap((g) => [
      { ...u(`/guides/${g}/`, `guide:${g}`, launch, 0.7), alternates: urdu(`/guides/${g}/`, `/ur/guides/${g}/`) },
      { ...u(`/ur/guides/${g}/`, `ur-guide:${g}`, urLaunch, 0.6), alternates: urdu(`/guides/${g}/`, `/ur/guides/${g}/`) },
    ]),
    u("/about/", "about", launch, 0.5),
    // /reviews/ exists only once lib/reviews.ts has reviews.
    ...(reviews ? [u("/reviews/", "reviews", new Date(reviews.latestISO), 0.6)] : []),
    u("/contact/", "contact", launch, 0.6),
    u("/faq/", "faq", launch, 0.5),
    u("/refund-policy/", "refund-policy", launch, 0.3),
    u("/terms-and-conditions/", "terms-and-conditions", launch, 0.2),
    u("/privacy-policy/", "privacy-policy", launch, 0.2),
  ];
}
