/**
 * Single source of truth for business identity.
 *
 * Every value marked TODO is a placeholder. While any placeholder remains,
 * `hasPlaceholders()` is true and a warning banner renders on every page - in
 * production too - so fake contact details can never sit silently on the live
 * site. `npm run check:launch` lists what is still missing.
 *
 * Licence and registration fields are `null` until real numbers are supplied.
 * Components render a licence badge ONLY when its number is set: never display
 * "Govt. approved" or "IATA accredited" claims that cannot be verified.
 */

export type OpeningHours = { days: string[]; opens: string; closes: string };

export const site = {
  name: "Muhammad Travels",
  legalName: null as string | null, // TODO: registered business name, e.g. "Muhammad Travels (SMC-Private) Limited"
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

  /**
   * Registrations. Leave null until you have the certificate in hand.
   * Each one that is set appears in the footer, on /about and in schema.
   */
  licences: {
    dts: null as string | null, // DTS Punjab travel-agency licence no. (ticketing + tours category)
    // MoRA approved-umrah-operator no. MANDATORY since the July 2026 rules under the
    // Hajj & Umrah (Regulation) Act 2024: only MoRA-verified companies may serve
    // umrah pilgrims. See research/regulations-and-facts.md, item 1.
    mora: null as string | null,
    iata: null as string | null, // IATA code, only if accredited
    secp: null as string | null, // company registration, if incorporated
    ntn: null as string | null, // needed for Google Ads advertiser verification
  },

  /**
   * If Muhammad Travels is not yet on MoRA's approved list and sells through an
   * approved operator, name that operator here. It is then disclosed on every
   * page (footer, /about, package pages), as MoRA and Google's misrepresentation
   * policy both expect. Confirm with MoRA's Umrah Section that this arrangement
   * is permitted before launch.
   */
  umrahOperator: null as { name: string; moraNo: string } | null,

  /** Umrah-only until Hajj Group Organiser status is confirmed; see /about. */
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

const PLACEHOLDER_WHATSAPP = "923000000000";

/** Launch-critical details still missing, in plain words for the preview banner. */
export function missingForLaunch(): string[] {
  const out: string[] = [];
  if ((site.contact.whatsapp as string) === PLACEHOLDER_WHATSAPP) out.push("phone/WhatsApp number");
  if (!site.contact.address.street || !site.contact.address.area) out.push("office address");
  if (!site.licences.mora && !site.umrahOperator) out.push("MoRA approval (or approved operator partner)");
  if (!site.licences.dts) out.push("DTS licence number");
  return out;
}

/** True while any launch-critical detail is still a placeholder. */
export function hasPlaceholders(): boolean {
  return missingForLaunch().length > 0;
}

export function whatsappLink(message: string): string {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
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

export function activeLicences(): { label: string; value: string }[] {
  const l = site.licences;
  const out: { label: string; value: string }[] = [];
  if (l.dts) out.push({ label: "DTS licence", value: l.dts });
  if (l.mora) out.push({ label: "MoRA approved umrah operator", value: l.mora });
  if (l.iata) out.push({ label: "IATA", value: l.iata });
  if (l.secp) out.push({ label: "SECP", value: l.secp });
  if (l.ntn) out.push({ label: "NTN", value: l.ntn });
  return out;
}

/** Plain-language line saying who legally operates the umrah service, or null if unknown. */
export function operatorDisclosure(): string | null {
  if (site.licences.mora) return `${site.name} is a MoRA-approved umrah operator (No. ${site.licences.mora}).`;
  const op = site.umrahOperator;
  if (op) return `Umrah services are operated by ${op.name}, a MoRA-approved umrah operator (No. ${op.moraNo}), with ${site.name} as booking agent.`;
  return null;
}
