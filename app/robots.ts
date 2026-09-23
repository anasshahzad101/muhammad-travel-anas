import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// AI crawlers are welcome: being quoted by ChatGPT, Perplexity and AI Overviews
// for "umrah cost from Pakistan" is part of the acquisition plan.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
