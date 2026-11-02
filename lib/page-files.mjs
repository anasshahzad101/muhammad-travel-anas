/**
 * What each page is made of: its page file and the data it reads. The
 * sitemap's lastmod is the commit date of the last change to these files
 * (lib/lastmod.ts at build time, scripts/lastmod.mjs in the GitHub workflow),
 * so a price refresh moves every priced page, a new review moves /reviews/,
 * the homepage and /about/, a rewritten guide moves that guide, and nothing
 * else moves. Shared chrome (header, footer, the badge) is left out on
 * purpose: a footer tweak is not a content change worth a recrawl.
 *
 * Plain JavaScript so the workflow script can import it without a build;
 * lib/lastmod.ts imports it too (tsconfig allowJs). Adding a page = adding
 * its group here and using it in app/sitemap.ts, which the types check.
 */

const prices = ["lib/package-data.ts", "lib/season.ts"];

export const pageFiles = {
  home: ["app/(site)/page.tsx", "lib/reviews.ts", ...prices],
  hub: ["app/(site)/umrah-packages/page.tsx", ...prices],
  "ur-home": ["app/(ur)/ur/page.tsx", ...prices],
  "ur-hub": ["app/(ur)/ur/umrah-packages/page.tsx", ...prices],
  // All category pages share their copy file, so they share one date; likewise the packages.
  category: ["lib/categories.ts", "components/views/CategoryView.tsx", ...prices],
  package: ["components/views/PackageView.tsx", ...prices],
  "ur-package": ["app/(ur)/ur/umrah-packages/[slug]/page.tsx", "components/ur/copy.ts", ...prices],
  visa: ["app/(site)/umrah-visa/page.tsx", "lib/market.ts", "lib/season.ts"],
  tickets: ["app/(site)/umrah-tickets/page.tsx", "lib/market.ts"],
  guides: ["app/(site)/guides/page.tsx", "lib/guides.ts"],
  "ur-guides": ["app/(ur)/ur/guides/page.tsx", "lib/guides.ts"],
  "guide:how-to-perform-umrah": ["app/(site)/guides/how-to-perform-umrah/page.tsx"],
  "guide:umrah-duas": ["app/(site)/guides/umrah-duas/page.tsx", "lib/duas.ts"],
  "guide:umrah-cost-from-pakistan": ["app/(site)/guides/umrah-cost-from-pakistan/page.tsx", "lib/market.ts", ...prices],
  "guide:umrah-packing-list": ["app/(site)/guides/umrah-packing-list/page.tsx"],
  "guide:umrah-vaccination-requirements": ["app/(site)/guides/umrah-vaccination-requirements/page.tsx"],
  "guide:nusuk-app-guide": ["app/(site)/guides/nusuk-app-guide/page.tsx"],
  "ur-guide:how-to-perform-umrah": ["app/(ur)/ur/guides/how-to-perform-umrah/page.tsx"],
  "ur-guide:umrah-duas": ["app/(ur)/ur/guides/umrah-duas/page.tsx", "lib/duas.ts"],
  "ur-guide:umrah-cost-from-pakistan": ["app/(ur)/ur/guides/umrah-cost-from-pakistan/page.tsx", "lib/market.ts", ...prices],
  "ur-guide:umrah-packing-list": ["app/(ur)/ur/guides/umrah-packing-list/page.tsx"],
  "ur-guide:umrah-vaccination-requirements": ["app/(ur)/ur/guides/umrah-vaccination-requirements/page.tsx"],
  "ur-guide:nusuk-app-guide": ["app/(ur)/ur/guides/nusuk-app-guide/page.tsx"],
  about: ["app/(site)/about/page.tsx", "lib/reviews.ts", "lib/site.ts"],
  reviews: ["app/(site)/reviews/page.tsx", "lib/reviews.ts"],
  contact: ["app/(site)/contact/page.tsx", "lib/site.ts"],
  faq: ["app/(site)/faq/page.tsx"],
  "refund-policy": ["app/(site)/refund-policy/page.tsx"],
  "terms-and-conditions": ["app/(site)/terms-and-conditions/page.tsx"],
  "privacy-policy": ["app/(site)/privacy-policy/page.tsx"],
};
