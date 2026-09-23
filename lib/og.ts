/**
 * Share cards (Open Graph / Twitter images), plus the plain-text rule for
 * everything machines read: meta tags, JSON-LD and llms.txt.
 *
 * WhatsApp is how umrah packages get passed around families in Pakistan, so
 * every indexable page gets its own branded 1200x630 card. Priced cards (home,
 * the package hub, the 17 category pages and the 15 packages) are built from
 * package data, so a price change reaches the share card on the next build.
 * The few pages whose titles live in page files are listed in STATIC_CARDS;
 * pageMetadata() warns in development when a page title drifts from its card.
 *
 * The images are rendered at build time by app/og/[...slug]/route.tsx (see
 * lib/og-image.tsx). pageMetadata() links them with a ?v= hash of the card's
 * content, so Facebook and WhatsApp fetch a fresh image when a price changes.
 *
 * This module stays light (no fs, no next/og): every page imports it through
 * lib/metadata.ts.
 */

import { categories } from "./categories";
import type { ImageKey } from "./images";
import { ROOM_BASIS, cheapest, fromPrice, packages, type RoomBasis, type UmrahPackage } from "./packages";
import { season } from "./season";
import { formatPKR, site } from "./site";
import { fillTokens } from "./tokens";

/**
 * The owner reads em and en dashes as an "AI tell". Anything we generate for
 * machines or share previews goes through this: an en dash inside a range
 * ("5-6 per room", "2026-27") becomes a plain hyphen, and a dash used as
 * punctuation becomes " - ". Idempotent, so it is safe on clean text.
 * (‒ figure dash, – en dash, — em dash, ― horizontal bar.)
 */
export function plainDashes(text: string): string {
  return text
    .replace(/(?<=\S)[‒–](?=\S)/g, "-") // ranges
    .replace(/[ \t]*[‒-―][ \t]*/g, " - ") // punctuation dashes, keeping line breaks
    .replace(/^ - /gm, "") // never at the start of a line...
    .replace(/ - $/gm, ""); // ...or the end of one
}

/** The headline of a page title: no brand suffix, nothing after the first spaced dash. */
export function headline(title: string): string {
  const noBrand = title.split(" | ")[0].trim();
  const head = noBrand.split(/\s+[‒-―-]\s+/)[0].trim();
  return plainDashes(head.split(/\s+/).length >= 2 ? head : noBrand);
}

export type ShareCard = {
  /** URL-safe id, also the image path: /og/{id}.jpg */
  id: string;
  /** Canonical path of the page the card belongs to. */
  path: string;
  title: string;
  /** Background photo. */
  image: ImageKey;
  /** Lowest advertised per-person price. Priced cards also list what's included and when prices were checked. */
  price?: { amount: number; basis: RoomBasis };
  /** Short line in place of a price, on guides, legal and company pages. */
  subtitle?: string;
};

/** Bump when the card design changes, so every card URL changes and scrapers re-fetch. */
const CARD_DESIGN_VERSION = 1;

export const SHARE_CARD_SIZE = { width: 1200, height: 630 } as const;
export const SHARE_CARD_TYPE = "image/jpeg";

/** Square brand logo, served by app/logo.png/route.tsx; used by the Organization schema and the manifest. */
export const LOGO = { path: "/logo.png", size: 512 } as const;

/**
 * Category pages priced on one room basis rather than the overall lowest price.
 * The couples page says "Couple packages are priced per person in a double
 * room", so its card quotes the lowest double-room price.
 */
const CATEGORY_BASIS: Partial<Record<string, RoomBasis>> = { couples: "double" };

function lowestPrice(list: UmrahPackage[], basis?: RoomBasis): ShareCard["price"] {
  if (!basis) return cheapest(list) ?? undefined;
  const amounts = list.map((p) => p.prices[basis]).filter((v): v is number => typeof v === "number");
  return amounts.length ? { amount: Math.min(...amounts), basis } : undefined;
}

/** A category page's "from" price: the lowest price among its packages, on the room basis the page is priced on. */
export function categoryPrice(slug: string, list: UmrahPackage[]): ShareCard["price"] {
  return lowestPrice(list, CATEGORY_BASIS[slug]);
}

const idFor = (path: string) => (path === "/" ? "index" : path.replace(/^\/|\/$/g, ""));

const card = (c: Omit<ShareCard, "id">): ShareCard => ({
  ...c,
  id: idFor(c.path),
  title: plainDashes(c.title),
  ...(c.subtitle ? { subtitle: plainDashes(c.subtitle) } : {}),
});

/**
 * Pages whose titles live in page files. Title = the page's <title> headline
 * (see headline()); subtitle = the rest of the title or the page's own summary.
 */
const STATIC_CARDS: ShareCard[] = [
  card({ path: "/umrah-visa/", title: `Umrah Visa Price for Pakistanis ${season.label}`, subtitle: "Fees, rules and documents", image: "nabawiDome" }),
  card({ path: "/umrah-tickets/", title: "Umrah Tickets from Pakistan", subtitle: "Lahore, Karachi and Islamabad to Jeddah fares", image: "kaabaWide" }),
  card({ path: "/guides/", title: "Umrah Guides", subtitle: "How to perform Umrah, duas, costs and packing", image: "nabawiLattice" }),
  card({ path: "/guides/how-to-perform-umrah/", title: "How to Perform Umrah: Step-by-Step Guide", subtitle: "Umrah guide", image: "kaabaCourtyard" }),
  card({ path: "/guides/umrah-duas/", title: "Duas for Umrah: Every Step, with Arabic & Meaning", subtitle: "Umrah guide", image: "kaabaNight" }),
  card({
    path: "/guides/umrah-cost-from-pakistan/",
    title: "Umrah Cost from Pakistan in 2026: Full Breakdown",
    subtitle: `Umrah guide · prices checked ${season.pricesChecked}`,
    image: "kaabaWide",
  }),
  card({ path: "/guides/umrah-packing-list/", title: "Umrah Packing List: What to Take from Pakistan", subtitle: "Umrah guide", image: "nabawiUmbrellas" }),
  card({ path: "/about/", title: `About ${site.name}`, subtitle: `Umrah travel agency in ${site.contact.address.city}`, image: "nabawiUmbrellas" }),
  card({ path: "/contact/", title: `Contact ${site.name}`, subtitle: `Umrah office in ${site.contact.address.city}`, image: "nabawiDome" }),
  card({ path: "/faq/", title: "Umrah FAQs", subtitle: "Prices, visa, documents, payment and cancellation", image: "kaabaWide" }),
  card({ path: "/refund-policy/", title: "Refund & Cancellation Policy", subtitle: "What can be refunded, and when", image: "kaabaCourtyard" }),
  card({ path: "/terms-and-conditions/", title: "Terms & Conditions", subtitle: "Booking terms for packages, visas and tickets", image: "kaabaCourtyard" }),
  card({ path: "/privacy-policy/", title: "Privacy Policy", subtitle: "Your personal information and passport details", image: "kaabaCourtyard" }),
];

/** Generic brand card, used for any page that has no card of its own. */
export const FALLBACK_CARD: ShareCard = {
  ...card({
    path: "/",
    title: site.tagline,
    subtitle: "Visa, flights, hotels and transport in one price",
    image: "kaabaCourtyard",
  }),
  id: "site",
};

let cards: ShareCard[] | null = null;

/** Every share card on the site, one per indexable page, plus the fallback. */
export function shareCards(): ShareCard[] {
  if (cards) return cards;
  const all = cheapest(packages) ?? undefined;
  cards = [
    card({ path: "/", title: `Umrah Packages from Pakistan ${season.label}`, image: "kaabaTowers", price: all }),
    card({ path: "/umrah-packages/", title: `Umrah Package Prices ${season.label}`, image: "kaabaWide", price: all }),
    ...categories.map((c) => {
      const list = packages.filter(c.filter);
      const price = categoryPrice(c.slug, list);
      return card({
        path: `/umrah-packages/${c.slug}/`,
        title: headline(fillTokens(c.title, list)),
        image: c.image,
        ...(price ? { price } : { subtitle: "Prices on request" }),
      });
    }),
    ...packages.map((p) => card({ path: `/umrah-packages/${p.slug}/`, title: p.name, image: p.image, price: fromPrice(p) })),
    ...STATIC_CARDS,
    FALLBACK_CARD,
  ];
  const ids = cards.map((c) => c.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) throw new Error(`Duplicate share card ids: ${dupes.join(", ")}`);
  return cards;
}

/** The card for a page path, if it has one. */
export function shareCard(path: string): ShareCard | undefined {
  return shareCards().find((c) => c.id !== FALLBACK_CARD.id && c.path === path);
}

export function shareCardById(id: string): ShareCard | undefined {
  return shareCards().find((c) => c.id === id);
}

/** "from PKR 340,000 per person" */
export function shareCardPriceLine(c: ShareCard): string | null {
  return c.price ? `from ${formatPKR(c.price.amount)} per person` : null;
}

/** "quad room (4 per room)" */
export function shareCardBasisLine(c: ShareCard): string | null {
  if (!c.price) return null;
  const b = ROOM_BASIS[c.price.basis];
  return plainDashes(`${b.label.toLowerCase()} room (${b.people})`);
}

/** Alt text describing what the card shows. */
export function shareCardAlt(c: ShareCard): string {
  const line = c.price ? `${shareCardPriceLine(c)}, ${shareCardBasisLine(c)}` : c.subtitle;
  const parts = [c.title, line ? line.charAt(0).toUpperCase() + line.slice(1) : null, c.title.includes(site.name) ? null : site.name];
  return parts.filter(Boolean).join(". ") + ".";
}

/** 32-bit FNV-1a, base 36. Enough to tell two versions of a card apart. */
function hash(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

/** Changes whenever anything drawn on the card changes. */
export function shareCardVersion(c: ShareCard): string {
  return hash(JSON.stringify([CARD_DESIGN_VERSION, c, c.price ? season.pricesChecked : null, site.name, site.tagline]));
}

/** Root-relative image URL, versioned so scrapers re-fetch a changed card. */
export function shareCardUrl(c: ShareCard): string {
  return `/og/${c.id}.jpg?v=${shareCardVersion(c)}`;
}
