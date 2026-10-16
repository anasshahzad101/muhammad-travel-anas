import type { Metadata } from "next";
import { getPackage } from "./packages";
import { site } from "./site";
import type { ImageKey } from "./images";
import {
  FALLBACK_CARD,
  SHARE_CARD_SIZE,
  SHARE_CARD_TYPE,
  headline,
  plainDashes,
  shareCard,
  shareCardAlt,
  shareCardUrl,
  type ShareCard,
} from "./og";

/**
 * Per-page metadata helper.
 *
 * In the App Router a page that sets `openGraph.title` without `openGraph.url`
 * inherits the root layout's url, so every inner page would share as the
 * homepage. WhatsApp is how umrah packages actually get passed around families
 * in Pakistan, so the share card has to be right on every page.
 *
 * The share image is the page's branded card (lib/og.ts), prerendered at
 * /og/{page}.jpg and versioned with ?v= so scrapers re-fetch it when the price
 * on it changes. Titles and descriptions go out with plain hyphens (the owner
 * reads em and en dashes as an AI tell).
 */

/**
 * Urdu twins of English pages. An explicit `languages` argument wins; otherwise
 * the twin is derived: "/" -> /ur/, "/guides/" -> /ur/guides/, "/guides/<slug>/"
 * -> /ur/guides/<slug>/ and a package page -> /ur/umrah-packages/<slug>/.
 * Category pages under /umrah-packages/ have no Urdu twin, so they stay
 * English-only. Adding a new Urdu page = adding its mapping here.
 */
const UR_TOP: Record<string, string> = { "/": "/ur/", "/guides/": "/ur/guides/", "/umrah-packages/": "/ur/umrah-packages/" };

function urTwin(path: string): string | undefined {
  if (UR_TOP[path]) return UR_TOP[path];
  if (path.startsWith("/guides/")) {
    const slug = path.slice("/guides/".length).replace(/\/$/, "");
    return slug ? `/ur/guides/${slug}/` : undefined;
  }
  if (path.startsWith("/umrah-packages/")) {
    const slug = path.slice("/umrah-packages/".length).replace(/\/$/, "");
    return slug && getPackage(slug) ? `/ur/umrah-packages/${slug}/` : undefined;
  }
  return undefined;
}

export function pageMetadata({
  title,
  description,
  path,
  image = "kaabaCourtyard",
  absoluteTitle,
  noindex,
  languages,
}: {
  title: string;
  description: string;
  path: string;
  /** The page's photo. Its share card (lib/og.ts) should use the same one. */
  image?: ImageKey;
  /** Set when the title already contains the brand, to avoid "Page | Brand | Brand". */
  absoluteTitle?: boolean;
  noindex?: boolean;
  /** hreflang alternates. Usually omitted: the Urdu twin is derived automatically (see urTwin). */
  languages?: Record<string, string>;
}): Metadata {
  const url = `${site.url}${path}`;
  const pageTitle = plainDashes(title);
  const pageDescription = plainDashes(description);
  const ogTitle = absoluteTitle ? pageTitle : `${pageTitle} | ${site.name}`;

  const card = shareCard(path);
  if (process.env.NODE_ENV === "development") checkShareCard(path, pageTitle, image, card);
  const shown = card ?? FALLBACK_CARD;
  const ogImage = {
    url: `${site.url}${shareCardUrl(shown)}`,
    width: SHARE_CARD_SIZE.width,
    height: SHARE_CARD_SIZE.height,
    alt: shareCardAlt(shown),
    type: SHARE_CARD_TYPE,
  };

  const twin = languages ? undefined : urTwin(path);
  const langs = languages ?? (twin ? { "en-PK": path, ur: twin, "x-default": path } : undefined);

  return {
    title: absoluteTitle ? { absolute: pageTitle } : pageTitle,
    description: pageDescription,
    alternates: { canonical: path, ...(langs ? { languages: langs } : {}) },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.name,
      url,
      title: ogTitle,
      description: pageDescription,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: pageDescription,
      images: [{ url: ogImage.url, alt: ogImage.alt, width: ogImage.width, height: ogImage.height }],
    },
  };
}

/** Development-only nudges that keep lib/og.ts in step with the pages. */
function checkShareCard(path: string, title: string, image: ImageKey, card: ShareCard | undefined) {
  if (!card) {
    console.warn(`[og] ${path} has no share card, so it shares the generic one. Add it to STATIC_CARDS in lib/og.ts.`);
    return;
  }
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const pageHead = norm(headline(title));
  const cardHead = norm(card.title);
  if (!pageHead.includes(cardHead) && !cardHead.includes(pageHead)) {
    console.warn(`[og] ${path}: the title "${title}" no longer matches its share card "${card.title}". Update lib/og.ts.`);
  }
  if (card.image !== image) {
    console.warn(`[og] ${path}: the page uses the photo "${image}" but its share card uses "${card.image}". Update lib/og.ts.`);
  }
}
