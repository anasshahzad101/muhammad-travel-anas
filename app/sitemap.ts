import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";
import { packages } from "@/lib/packages";
import { season } from "@/lib/season";
import { site } from "@/lib/site";

/**
 * Price-bearing pages carry `pricesCheckedISO` as lastmod, so a price refresh
 * gets recrawled quickly — answer engines otherwise keep quoting stale prices.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const priced = new Date(season.pricesCheckedISO);
  const launch = new Date("2026-09-23");
  const u = (path: string, lastModified: Date, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${site.url}${path}`,
    lastModified,
    priority,
  });

  return [
    u("/", priced, 1),
    u("/umrah-packages/", priced, 0.95),
    ...categories.map((c) => u(`/umrah-packages/${c.slug}/`, priced, c.group === "season" || c.group === "city" ? 0.9 : 0.85)),
    ...packages.map((p) => u(`/umrah-packages/${p.slug}/`, priced, 0.8)),
    u("/umrah-visa/", priced, 0.9),
    u("/umrah-tickets/", priced, 0.7),
    u("/guides/", launch, 0.6),
    u("/guides/how-to-perform-umrah/", launch, 0.7),
    u("/guides/umrah-duas/", launch, 0.7),
    u("/guides/umrah-cost-from-pakistan/", priced, 0.8),
    u("/guides/umrah-packing-list/", launch, 0.6),
    u("/about/", launch, 0.5),
    u("/contact/", launch, 0.6),
    u("/faq/", launch, 0.5),
    u("/refund-policy/", launch, 0.3),
    u("/terms-and-conditions/", launch, 0.2),
    u("/privacy-policy/", launch, 0.2),
  ];
}
