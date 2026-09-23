import { renderShareCard } from "@/lib/og-image";
import { SHARE_CARD_SIZE, SHARE_CARD_TYPE, shareCard, shareCardAlt, shareCardVersion } from "@/lib/og";

/**
 * The homepage's share card. Every other page links its card through
 * pageMetadata() (lib/metadata.ts); the homepage takes its metadata from the
 * root layout, so it gets its card through this file convention instead.
 *
 * The image id ends in ".jpg" on purpose: with trailingSlash on, an
 * extensionless /opengraph-image URL answers with a 308 redirect, which not
 * every link-preview scraper follows. The id is also the card's version, so the
 * URL changes when the price on the card does.
 *
 * If app/page.tsx ever exports metadata with openGraph.images (for example via
 * pageMetadata({ path: "/", ... })), that wins and this file can be deleted.
 */
const home = shareCard("/")!;

export function generateImageMetadata() {
  return [{ id: `${shareCardVersion(home)}.jpg`, alt: shareCardAlt(home), size: SHARE_CARD_SIZE, contentType: SHARE_CARD_TYPE }];
}

export default function Image() {
  return renderShareCard(home);
}
