/**
 * Single source of truth for business identity: name, contact details, office,
 * hours and what we sell. Every page, the schema and the llms files read it.
 */

export type OpeningHours = { days: string[]; opens: string; closes: string };

export const site = {
  name: "Muhammad Travels",
  tagline: "Umrah packages from Pakistan, priced in full",
  description:
    "Umrah packages from Pakistan 2026-27: visa, return flights, hotels near the Haram and transport in one PKR price. 7-28 days, economy to 5-star. Lahore office.",
  // TODO: confirm the domain once registered.
  url: "https://www.muhammadtravels.pk",
  locale: "en_PK",
  language: "en-PK",
  currency: "PKR",
  foundingYear: null as number | null, // TODO

  contact: {
    // Every call, WhatsApp link and enquiry (including the lead popup) goes to this number.
    whatsapp: "923041458319",
    phoneDisplay: "0304 1458319",
    phoneE164: "+923041458319",
    landlineDisplay: null as string | null, // e.g. "042 3500 0000"
    email: "info@muhammadtravels.pk", // TODO: create the mailbox
    address: {
      street: null as string | null, // TODO: office number, building, road
      area: null as string | null, // TODO: e.g. "Gulberg III"
      city: "Lahore",
      region: "Punjab",
      postalCode: null as string | null,
      country: "PK",
    },
    // TODO: pin from the Google Business Profile once verified.
    geo: null as { lat: number; lng: number } | null,
    googleMapsUrl: null as string | null,
    hours: [
      // TODO: confirm office hours.
      { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday"], opens: "10:00", closes: "20:00" },
      { days: ["Friday"], opens: "15:00", closes: "20:00" },
    ] as OpeningHours[],
    hoursSummary: "Mon-Sat, 10am-8pm (Friday from 3pm)", // TODO: keep in sync with `hours`
    whatsappHours: "WhatsApp replies 10am-11pm, every day", // TODO: confirm
  },

  /** Umrah only: Hajj packages are not sold (see /about). */
  sellsHajj: false,

  departures: ["Lahore", "Karachi", "Islamabad"],

  social: {
    facebook: null as string | null,
    instagram: null as string | null,
    youtube: null as string | null,
    tiktok: null as string | null,
  },

  /** Analytics / Google Ads IDs come from env vars; see lib/track.ts. */
} as const;

/**
 * Every WhatsApp message to the office opens with the full salam and the
 * agency's name, then the visitor's message. A shorter salam already at the
 * start of the message is dropped, so it is never greeted twice.
 */
export function withGreeting(message: string): string {
  const greeting = `Assalam o Alaikum wa Rahmatullahi wa Barakatuh, ${site.name}.`;
  const body = message.replace(/^\s*(?:assalam[\s-]*o[\s-]*alaikum|assalamu[\s-]*alaikum|salam)[^\n,.!]*[,.!]?\s*/i, "").trim();
  if (!body) return greeting;
  return `${greeting}\n\n${body.charAt(0).toUpperCase()}${body.slice(1)}`;
}

export function whatsappLink(message: string): string {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(withGreeting(message))}`;
}

export function telLink(): string {
  return `tel:${site.contact.phoneE164}`;
}

export function formatPKR(amount: number): string {
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

/** Compact form for tight spaces: "PKR 2.85 lakh". Pakistani buyers think in lakhs. */
export function formatLakh(amount: number): string {
  const lakh = amount / 100000;
  return `PKR ${lakh.toFixed(lakh >= 10 ? 1 : 2).replace(/\.?0+$/, "")} lakh`;
}

export function fullAddress(): string {
  const a = site.contact.address;
  return [a.street, a.area, a.city].filter(Boolean).join(", ");
}
