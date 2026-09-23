import type { Metadata } from "next";
import { site } from "./site";
import { imageUrl, images, type ImageKey } from "./images";

/**
 * Per-page metadata helper.
 *
 * In the App Router a page that sets `openGraph.title` without `openGraph.url`
 * inherits the root layout's url, so every inner page would share as the
 * homepage. WhatsApp is how umrah packages actually get passed around families
 * in Pakistan, so the share card has to be right on every page.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = "kaabaCourtyard",
  absoluteTitle,
  noindex,
}: {
  title: string;
  description: string;
  path: string;
  image?: ImageKey;
  /** Set when the title already contains the brand, to avoid "Page | Brand | Brand". */
  absoluteTitle?: boolean;
  noindex?: boolean;
}): Metadata {
  const url = `${site.url}${path}`;
  const ogTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  const ogImage = { url: imageUrl(image, 1200), width: 1200, alt: images[image].alt };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.name,
      url,
      title: ogTitle,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [ogImage.url],
    },
  };
}
