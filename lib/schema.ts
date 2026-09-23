/**
 * JSON-LD builders.
 *
 * Schema does double duty: Google rich results, and extraction by AI answer
 * engines that don't execute JavaScript. Every builder here is server-rendered.
 *
 * Rules:
 * - Never emit aggregateRating or Review until real, collected reviews exist.
 *   Fabricated ratings are a manual-action risk and a consumer-protection one.
 * - Licence identifiers are emitted only when set in lib/site.ts.
 * - Every value is generated from lib/ data, never typed in here, so it can't
 *   drift from the pages. A placeholder phone number is never emitted.
 * - Strings go out with plain hyphens (plainDashes), like all machine-facing text.
 * - Entities link by @id: the organisation (/#organization), the website
 *   (/#website), each page (#webpage), its breadcrumb (#breadcrumb) and each
 *   package (#trip).
 */

import { site, fullAddress, activeLicences, formatPKR, missingForLaunch } from "./site";
import { imageUrl, type ImageKey } from "./images";
import { ROOM_BASIS, fromPrice, packages, type RoomBasis, type UmrahPackage } from "./packages";
import { season } from "./season";
import { LOGO, plainDashes } from "./og";

const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

/** @id of a package's TouristTrip, for linking from other nodes (e.g. webPageSchema's mainEntity). */
export function packageId(p: UmrahPackage): string {
  return `${site.url}/umrah-packages/${p.slug}/#trip`;
}

/** @id of a guide's Article (articleSchema), e.g. for webPageSchema's mainEntity. */
export function articleId(path: string): string {
  return `${site.url}${path}#article`;
}

/**
 * priceValidUntil for every package offer: 30 days after prices were last
 * checked, and never later than the season's final departure.
 *
 * Why this date: prices follow airfares and hotel rates, are re-checked monthly
 * (season.pricesChecked) and are confirmed in writing before payment, so a
 * listed price is only current until the next check. The final departure date
 * (lib/season.ts, 7 April 2027) is the hard limit: no umrah travel is possible
 * after it, so no offer can outlive it. If a monthly check is missed the offers
 * expire in the markup, which is the honest outcome: answer engines should not
 * keep quoting a stale price as current.
 */
export function priceValidUntil(): string {
  const day = 24 * 60 * 60 * 1000;
  const recheck = new Date(Date.parse(`${season.pricesCheckedISO}T00:00:00Z`) + 30 * day).toISOString().slice(0, 10);
  const end = isoDate(season.umrahPause.finalDeparture);
  return end && end < recheck ? end : recheck;
}

/** "7 April 2027" -> "2027-04-07"; null if the text isn't in that form. */
function isoDate(text: string): string | null {
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const m = /^(\d{1,2}) ([A-Za-z]+) (\d{4})$/.exec(text.trim());
  const month = m ? months.indexOf(m[2].toLowerCase()) : -1;
  if (!m || month < 0) return null;
  return new Date(Date.UTC(Number(m[3]), month, Number(m[1]))).toISOString().slice(0, 10);
}

function logoSchema() {
  const url = `${site.url}${LOGO.path}`;
  return {
    "@type": "ImageObject",
    "@id": `${site.url}/#logo`,
    url,
    contentUrl: url,
    width: LOGO.size,
    height: LOGO.size,
    caption: site.name,
  };
}

export function organizationSchema() {
  const a = site.contact.address;
  const licences = activeLicences();
  const dayMap: Record<string, string> = {
    Monday: "Mo",
    Tuesday: "Tu",
    Wednesday: "We",
    Thursday: "Th",
    Friday: "Fr",
    Saturday: "Sa",
    Sunday: "Su",
  };
  const prices = packages.flatMap((p) => Object.values(p.prices).filter((v): v is number => typeof v === "number"));
  const social = Object.values(site.social).filter((v): v is string => Boolean(v));
  // missingForLaunch() is lib/site.ts's own list of placeholders still on the site.
  const realPhone = !missingForLaunch().includes("phone/WhatsApp number");
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": ORG_ID,
    name: site.name,
    ...(site.legalName ? { legalName: site.legalName } : {}),
    description: plainDashes(site.description),
    slogan: plainDashes(site.tagline),
    url: site.url,
    logo: logoSchema(),
    image: imageUrl("kaabaCourtyard", 1200),
    ...(realPhone ? { telephone: site.contact.phoneE164 } : {}),
    email: site.contact.email,
    currenciesAccepted: site.currency,
    priceRange: `${formatPKR(Math.min(...prices))} - ${formatPKR(Math.max(...prices))}`,
    paymentAccepted: "Bank transfer, Cash",
    address: {
      "@type": "PostalAddress",
      ...(a.street ? { streetAddress: fullAddress() } : {}),
      addressLocality: a.city,
      addressRegion: a.region,
      ...(a.postalCode ? { postalCode: a.postalCode } : {}),
      addressCountry: a.country,
    },
    ...(site.contact.geo
      ? { geo: { "@type": "GeoCoordinates", latitude: site.contact.geo.lat, longitude: site.contact.geo.lng } }
      : {}),
    ...(site.contact.googleMapsUrl ? { hasMap: site.contact.googleMapsUrl } : {}),
    openingHours: site.contact.hours.map(
      (h) => `${h.days.map((d) => dayMap[d]).join(",")} ${h.opens}-${h.closes}`,
    ),
    openingHoursSpecification: site.contact.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
      opens: h.opens,
      closes: h.closes,
    })),
    areaServed: { "@type": "Country", name: "Pakistan" },
    knowsAbout: ["Umrah packages", "Umrah visa", "Umrah flights", "Makkah hotels", "Madinah hotels", "Ziyarat"],
    ...(site.foundingYear ? { foundingDate: String(site.foundingYear) } : {}),
    ...(licences.length
      ? { identifier: licences.map((l) => ({ "@type": "PropertyValue", name: l.label, value: l.value })) }
      : {}),
    ...(social.length ? { sameAs: social } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: site.url,
    name: site.name,
    description: plainDashes(site.description),
    publisher: { "@id": ORG_ID },
    inLanguage: site.language,
  };
}

/** The last item is the current page; its #breadcrumb @id is what webPageSchema() links to. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  const last = items[items.length - 1];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(last ? { "@id": `${site.url}${last.path}#breadcrumb` } : {}),
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: plainDashes(it.name),
      item: `${site.url}${it.path}`,
    })),
  };
}

function questions(faqs: { q: string; a: string }[]) {
  return faqs.map((f) => ({
    "@type": "Question",
    name: plainDashes(f.q),
    acceptedAnswer: { "@type": "Answer", text: plainDashes(f.a) },
  }));
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions(faqs),
  };
}

/** The lowest-to-highest price summary of a package, used on its own page and in lists. */
function priceSummary(p: UmrahPackage) {
  const amounts = Object.values(p.prices).filter((v): v is number => typeof v === "number");
  return {
    "@type": "AggregateOffer",
    lowPrice: fromPrice(p).amount,
    highPrice: Math.max(...amounts),
    priceCurrency: site.currency,
    offerCount: amounts.length,
    priceValidUntil: priceValidUntil(),
  };
}

/** A package as a TouristTrip with an Offer per room basis. */
export function packageSchema(p: UmrahPackage) {
  const url = `${site.url}/umrah-packages/${p.slug}/`;
  const validUntil = priceValidUntil();
  const offers = (Object.entries(p.prices) as [RoomBasis, number | undefined][])
    .filter((e): e is [RoomBasis, number] => typeof e[1] === "number")
    .map(([basis, price]) => ({
      "@type": "Offer",
      name: plainDashes(`${p.name} - ${ROOM_BASIS[basis].label} room`),
      description: plainDashes(
        `Per person, ${ROOM_BASIS[basis].label.toLowerCase()} room (${ROOM_BASIS[basis].people}). Includes the Umrah visa, return flights, hotels and transport.`,
      ),
      price,
      priceCurrency: site.currency,
      priceValidUntil: validUntil,
      availability: "https://schema.org/InStock",
      url,
      seller: { "@id": ORG_ID },
    }));
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": packageId(p),
    name: plainDashes(p.name),
    description: plainDashes(p.summary),
    url,
    image: imageUrl(p.image, 1200),
    touristType: "Umrah pilgrims",
    provider: { "@id": ORG_ID },
    itinerary: {
      "@type": "ItemList",
      itemListElement: [
        { "@type": "ListItem", position: 1, item: { "@type": "City", name: p.madinahFirst ? "Madinah" : "Makkah" } },
        { "@type": "ListItem", position: 2, item: { "@type": "City", name: p.madinahFirst ? "Makkah" : "Madinah" } },
      ],
    },
    offers: { ...priceSummary(p), offers },
  };
}

/**
 * Guides are published by the organisation, not a named author: no invented
 * scholar or staff bylines. Add a real reviewer (e.g. an alim who checked the
 * duas) as `reviewedBy` once one exists.
 */
export function articleSchema({
  title,
  description,
  path,
  image,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  path: string;
  image: string;
  datePublished: string;
  dateModified: string;
}) {
  const url = `${site.url}${path}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": articleId(path),
    headline: plainDashes(title),
    description: plainDashes(description),
    url,
    mainEntityOfPage: url,
    image,
    datePublished,
    dateModified,
    inLanguage: site.language,
    isPartOf: { "@id": WEBSITE_ID },
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

/**
 * A list of packages. By default each item carries the package's price range
 * (lowest to highest per-person price), so a list page answers "how much" on
 * its own; pass { offers: false } for the bare name-and-URL list.
 */
export function itemListSchema(name: string, list: UmrahPackage[], { offers = true }: { offers?: boolean } = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: plainDashes(name),
    numberOfItems: list.length,
    itemListElement: list.map((p, i) => {
      const url = `${site.url}/umrah-packages/${p.slug}/`;
      return offers
        ? {
            "@type": "ListItem",
            position: i + 1,
            item: { "@type": "TouristTrip", "@id": packageId(p), name: plainDashes(p.name), url, offers: priceSummary(p) },
          }
        : { "@type": "ListItem", position: i + 1, url, name: plainDashes(p.name) };
    }),
  };
}

export type WebPageType = "WebPage" | "CollectionPage" | "FAQPage" | "AboutPage" | "ContactPage";

/**
 * The page itself, tied to the website and the organisation. One per page.
 *
 * On /faq/ use type "FAQPage" with `faqs` instead of a separate faqSchema(),
 * so the page has one FAQPage node rather than two.
 */
export function webPageSchema({
  path,
  title,
  description,
  dateModified,
  type = "WebPage",
  image,
  datePublished,
  about,
  mainEntity,
  faqs,
  breadcrumb = path !== "/",
}: {
  path: string;
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD). Priced pages: season.pricesCheckedISO. */
  dateModified: string;
  type?: WebPageType;
  /** The page's main photo (its hero image). */
  image?: ImageKey;
  datePublished?: string;
  /** @id of what the page is about. Defaults to the organisation. */
  about?: string;
  /** @id of the page's main entity, e.g. packageId(p) on a package page. */
  mainEntity?: string;
  /** With type "FAQPage": the page's questions, emitted as its mainEntity. */
  faqs?: { q: string; a: string }[];
  /** Whether the page renders <Breadcrumbs> (every page except the homepage does). */
  breadcrumb?: boolean;
}) {
  const url = `${site.url}${path}`;
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name: plainDashes(title),
    description: plainDashes(description),
    inLanguage: site.language,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": about ?? ORG_ID },
    publisher: { "@id": ORG_ID },
    ...(datePublished ? { datePublished } : {}),
    dateModified,
    ...(image ? { primaryImageOfPage: { "@type": "ImageObject", url: imageUrl(image, 1200) } } : {}),
    ...(breadcrumb ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
    ...(type === "FAQPage" && faqs?.length
      ? { mainEntity: questions(faqs) }
      : mainEntity
        ? { mainEntity: { "@id": mainEntity } }
        : {}),
  };
}

/**
 * Step-by-step instructions, e.g. the how-to-perform-umrah guide. Steps come
 * from the page itself. `totalTime` is an ISO 8601 duration and takes one
 * value only, so leave it out when the guide gives a range ("three to five
 * hours") and say it in the description instead.
 */
export function howToSchema({
  path,
  name,
  description,
  steps,
  image,
  totalTime,
}: {
  path: string;
  name: string;
  description: string;
  /** `id` is the step's section anchor on the page, e.g. "tawaf". */
  steps: { name: string; text: string; id?: string }[];
  image?: ImageKey;
  totalTime?: string;
}) {
  const url = `${site.url}${path}`;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${url}#howto`,
    name: plainDashes(name),
    description: plainDashes(description),
    url,
    inLanguage: site.language,
    ...(image ? { image: imageUrl(image, 1200) } : {}),
    ...(totalTime ? { totalTime } : {}),
    publisher: { "@id": ORG_ID },
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: plainDashes(s.name),
      text: plainDashes(s.text),
      ...(s.id ? { url: `${url}#${s.id}` } : {}),
    })),
  };
}
