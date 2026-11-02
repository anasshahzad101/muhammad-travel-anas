import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";
import { lastChanged } from "@/lib/lastmod";
import { packages } from "@/lib/packages";
import { reviewStats } from "@/lib/reviews";
import { season } from "@/lib/season";
import { site } from "@/lib/site";

/**
 * lastmod is when each page's content last changed: the commit date of the
 * last change to the files that make it (lib/lastmod.ts). So a price refresh
 * moves every priced page, a new review moves /reviews/, the homepage and
 * /about/, a rewritten guide moves that guide, and nothing else moves. Google
 * uses lastmod to decide what to recrawl, and only while it proves accurate.
 * The fixed dates passed as fallbacks are used where the build has no git
 * history, and as a floor otherwise.
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

  // What each page is made of: its page file and the data it reads. Shared
  // chrome (header, footer, the badge) is left out on purpose: a footer tweak
  // is not a content change worth a recrawl.
  const en = (path: string) => `app/(site)${path}page.tsx`;
  const ur = (path: string) => `app/(ur)${path}page.tsx`;
  const prices = ["lib/package-data.ts", "lib/season.ts"];
  const guideSlugs = ["how-to-perform-umrah", "umrah-duas", "umrah-cost-from-pakistan", "umrah-packing-list", "umrah-vaccination-requirements", "nusuk-app-guide"];
  const guideData: Record<string, string[]> = {
    "umrah-duas": ["lib/duas.ts"],
    "umrah-cost-from-pakistan": ["lib/market.ts", ...prices],
  };

  const u = (path: string, files: string[], fallback: Date, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${site.url}${path}`,
    lastModified: lastChanged(files, fallback),
    priority,
  });

  // Pages that also exist in Urdu carry their hreflang pairs; /ur/ pages mirror them.
  const urdu = (enPath: string, urPath: string) => ({
    languages: { "en-PK": `${site.url}${enPath}`, ur: `${site.url}${urPath}`, "x-default": `${site.url}${enPath}` },
  });

  return [
    { ...u("/", [en("/"), "lib/reviews.ts", ...prices], priced, 1), alternates: urdu("/", "/ur/") },
    { ...u("/umrah-packages/", [en("/umrah-packages/"), ...prices], priced, 0.95), alternates: urdu("/umrah-packages/", "/ur/umrah-packages/") },
    { ...u("/ur/", [ur("/ur/"), ...prices], urLaunch, 0.7), alternates: urdu("/", "/ur/") },
    { ...u("/ur/umrah-packages/", [ur("/ur/umrah-packages/"), ...prices], urLaunch, 0.7), alternates: urdu("/umrah-packages/", "/ur/umrah-packages/") },
    ...categories.map((c) =>
      u(`/umrah-packages/${c.slug}/`, ["lib/categories.ts", "components/views/CategoryView.tsx", ...prices], priced, c.group === "season" || c.group === "city" ? 0.9 : 0.85),
    ),
    // Every package has an Urdu twin; both entries carry the hreflang pair.
    ...packages.map((p) => ({
      ...u(`/umrah-packages/${p.slug}/`, ["components/views/PackageView.tsx", ...prices], priced, 0.8),
      alternates: urdu(`/umrah-packages/${p.slug}/`, `/ur/umrah-packages/${p.slug}/`),
    })),
    ...packages.map((p) => ({
      ...u(`/ur/umrah-packages/${p.slug}/`, [ur("/ur/umrah-packages/[slug]/"), "components/ur/copy.ts", ...prices], urLaunch, 0.7),
      alternates: urdu(`/umrah-packages/${p.slug}/`, `/ur/umrah-packages/${p.slug}/`),
    })),
    u("/umrah-visa/", [en("/umrah-visa/"), "lib/market.ts", "lib/season.ts"], priced, 0.9),
    u("/umrah-tickets/", [en("/umrah-tickets/"), "lib/market.ts"], priced, 0.7),
    // Guides exist in both languages; both entries carry the hreflang pair.
    { ...u("/guides/", [en("/guides/"), "lib/guides.ts"], launch, 0.6), alternates: urdu("/guides/", "/ur/guides/") },
    { ...u("/ur/guides/", [ur("/ur/guides/"), "lib/guides.ts"], urLaunch, 0.55), alternates: urdu("/guides/", "/ur/guides/") },
    ...guideSlugs.flatMap((g) => [
      { ...u(`/guides/${g}/`, [en(`/guides/${g}/`), ...(guideData[g] ?? [])], launch, 0.7), alternates: urdu(`/guides/${g}/`, `/ur/guides/${g}/`) },
      { ...u(`/ur/guides/${g}/`, [ur(`/ur/guides/${g}/`), ...(guideData[g] ?? [])], urLaunch, 0.6), alternates: urdu(`/guides/${g}/`, `/ur/guides/${g}/`) },
    ]),
    u("/about/", [en("/about/"), "lib/reviews.ts", "lib/site.ts"], launch, 0.5),
    // /reviews/ exists only once lib/reviews.ts has reviews.
    ...(reviews ? [u("/reviews/", [en("/reviews/"), "lib/reviews.ts"], new Date(reviews.latestISO), 0.6)] : []),
    u("/contact/", [en("/contact/"), "lib/site.ts"], launch, 0.6),
    u("/faq/", [en("/faq/")], launch, 0.5),
    u("/refund-policy/", [en("/refund-policy/")], launch, 0.3),
    u("/terms-and-conditions/", [en("/terms-and-conditions/")], launch, 0.2),
    u("/privacy-policy/", [en("/privacy-policy/")], launch, 0.2),
  ];
}
