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
 */

import { site, fullAddress, activeLicences } from "./site";
import { imageUrl } from "./images";
import { fromPrice, type UmrahPackage } from "./packages";

const ORG_ID = `${site.url}/#organization`;

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
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": ORG_ID,
    name: site.name,
    ...(site.legalName ? { legalName: site.legalName } : {}),
    description: site.description,
    url: site.url,
    image: imageUrl("kaabaCourtyard", 1200),
    telephone: site.contact.phoneE164,
    email: site.contact.email,
    currenciesAccepted: site.currency,
    priceRange: "PKR",
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
    areaServed: { "@type": "Country", name: "Pakistan" },
    knowsAbout: ["Umrah packages", "Umrah visa", "Umrah flights", "Makkah hotels", "Madinah hotels", "Ziyarat"],
    ...(site.foundingYear ? { foundingDate: String(site.foundingYear) } : {}),
    ...(licences.length
      ? { identifier: licences.map((l) => ({ "@type": "PropertyValue", name: l.label, value: l.value })) }
      : {}),
    sameAs: Object.values(site.social).filter(Boolean),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    publisher: { "@id": ORG_ID },
    inLanguage: site.language,
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.path}`,
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** A package as a TouristTrip with an Offer per room basis. */
export function packageSchema(p: UmrahPackage) {
  const url = `${site.url}/umrah-packages/${p.slug}/`;
  const offers = Object.entries(p.prices).map(([basis, price]) => ({
    "@type": "Offer",
    name: `${p.name} — ${basis} room`,
    price,
    priceCurrency: site.currency,
    availability: "https://schema.org/InStock",
    url,
    seller: { "@id": ORG_ID },
  }));
  const low = fromPrice(p).amount;
  const high = Math.max(...Object.values(p.prices).filter((v): v is number => typeof v === "number"));
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${url}#trip`,
    name: p.name,
    description: p.summary,
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
    offers: {
      "@type": "AggregateOffer",
      lowPrice: low,
      highPrice: high,
      priceCurrency: site.currency,
      offerCount: offers.length,
      offers,
    },
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
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${site.url}${path}`,
    mainEntityOfPage: `${site.url}${path}`,
    image,
    datePublished,
    dateModified,
    inLanguage: site.language,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

export function itemListSchema(name: string, list: UmrahPackage[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: list.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${site.url}/umrah-packages/${p.slug}/`,
      name: p.name,
    })),
  };
}
