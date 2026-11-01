import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";
import { packages } from "@/lib/packages";
import { reviewStats } from "@/lib/reviews";
import { season } from "@/lib/season";
import { site } from "@/lib/site";

/**
 * Price-bearing pages carry `pricesCheckedISO` as lastmod, so a price refresh
 * gets recrawled quickly; answer engines otherwise keep quoting stale prices.
 *
 * /llms.txt and /llms-full.txt are deliberately left out. A sitemap lists the
 * canonical pages we want in search results; the llms files are plain-text
 * digests of those same pages for AI assistants, found by the /llms.txt
 * convention and the link inside it. Listing them would invite search engines
 * to index a wall of text that competes with the real pages, and answer engines
 * should cite (and send visitors to) the HTML pages. Share-card images
 * (/og/...) and /logo.png are not pages either.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const priced = new Date(season.pricesCheckedISO);
  const launch = new Date("2026-09-23");
  const u = (path: string, lastModified: Date, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${site.url}${path}`,
    lastModified,
    priority,
  });

  // Pages that also exist in Urdu carry their hreflang pairs; /ur/ pages mirror them.
  const urdu = (en: string, ur: string) => ({
    languages: { "en-PK": `${site.url}${en}`, ur: `${site.url}${ur}`, "x-default": `${site.url}${en}` },
  });
  const urLaunch = new Date("2026-10-16");
  const guideSlugs = ["how-to-perform-umrah", "umrah-duas", "umrah-cost-from-pakistan", "umrah-packing-list", "umrah-vaccination-requirements", "nusuk-app-guide"];
  // /reviews/ exists only once lib/reviews.ts has reviews; its lastmod is the newest review.
  const reviews = reviewStats();

  return [
    { ...u("/", priced, 1), alternates: urdu("/", "/ur/") },
    { ...u("/umrah-packages/", priced, 0.95), alternates: urdu("/umrah-packages/", "/ur/umrah-packages/") },
    { ...u("/ur/", urLaunch, 0.7), alternates: urdu("/", "/ur/") },
    { ...u("/ur/umrah-packages/", urLaunch, 0.7), alternates: urdu("/umrah-packages/", "/ur/umrah-packages/") },
    ...categories.map((c) => u(`/umrah-packages/${c.slug}/`, priced, c.group === "season" || c.group === "city" ? 0.9 : 0.85)),
    // Every package has an Urdu twin; both entries carry the hreflang pair.
    ...packages.map((p) => ({ ...u(`/umrah-packages/${p.slug}/`, priced, 0.8), alternates: urdu(`/umrah-packages/${p.slug}/`, `/ur/umrah-packages/${p.slug}/`) })),
    ...packages.map((p) => ({ ...u(`/ur/umrah-packages/${p.slug}/`, urLaunch, 0.7), alternates: urdu(`/umrah-packages/${p.slug}/`, `/ur/umrah-packages/${p.slug}/`) })),
    u("/umrah-visa/", priced, 0.9),
    u("/umrah-tickets/", priced, 0.7),
    // Guides exist in both languages; both entries carry the hreflang pair.
    { ...u("/guides/", launch, 0.6), alternates: urdu("/guides/", "/ur/guides/") },
    { ...u("/ur/guides/", urLaunch, 0.55), alternates: urdu("/guides/", "/ur/guides/") },
    ...guideSlugs.flatMap((g) => [
      { ...u(`/guides/${g}/`, launch, 0.7), alternates: urdu(`/guides/${g}/`, `/ur/guides/${g}/`) },
      { ...u(`/ur/guides/${g}/`, urLaunch, 0.6), alternates: urdu(`/guides/${g}/`, `/ur/guides/${g}/`) },
    ]),
    u("/about/", launch, 0.5),
    ...(reviews ? [u("/reviews/", new Date(reviews.latestISO), 0.6)] : []),
    u("/contact/", launch, 0.6),
    u("/faq/", launch, 0.5),
    u("/refund-policy/", launch, 0.3),
    u("/terms-and-conditions/", launch, 0.2),
    u("/privacy-policy/", launch, 0.2),
  ];
}
