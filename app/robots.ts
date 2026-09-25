import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// AI crawlers are welcome: being quoted by ChatGPT, Perplexity and AI Overviews
// for "umrah cost from Pakistan" is part of the acquisition plan.
//
// The named groups spell that out for each AI crawler (and the AI-training
// tokens Google-Extended and Applebot-Extended). A crawler that finds its own
// group ignores the * group, so every group gets the same rules from `access`:
// add any future Disallow there, not to one group.
//
// No `Host:` line. It was a Yandex-only directive (Yandex itself retired it in
// 2018), is not part of the robots.txt standard (RFC 9309), and other crawlers
// ignore it or report it as an unknown rule. The canonical host is set by
// <link rel="canonical"> and redirects.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bingbot",
];

export default function robots(): MetadataRoute.Robots {
  // The leads dashboard and the form endpoints are not pages.
  const access = { allow: "/", disallow: ["/admin/", "/api/"] };
  return {
    rules: [{ userAgent: "*", ...access }, ...AI_CRAWLERS.map((userAgent) => ({ userAgent, ...access }))],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
