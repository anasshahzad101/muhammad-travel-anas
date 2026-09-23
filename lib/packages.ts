import type { ImageKey } from "./images";
import { packageData } from "./package-data";

export type Tier = "economy" | "3-star" | "4-star" | "5-star";
export type RoomBasis = "sharing" | "quad" | "triple" | "double";

export const TIERS: Record<Tier, { label: string; short: string; stars: number; blurb: string }> = {
  economy: {
    label: "Economy",
    short: "Economy",
    stars: 2,
    blurb: "Clean, simple hotels a longer walk or a short shuttle ride from the Haram.",
  },
  "3-star": {
    label: "3-Star",
    short: "3★",
    stars: 3,
    blurb: "Comfortable hotels within walking distance - the best balance of price and effort.",
  },
  "4-star": {
    label: "4-Star",
    short: "4★",
    stars: 4,
    blurb: "Closer, quieter hotels with breakfast, for families and older parents.",
  },
  "5-star": {
    label: "5-Star",
    short: "5★",
    stars: 5,
    blurb: "Front-row hotels facing the Haram - step out of the lobby into the courtyard.",
  },
};

export const ROOM_BASIS: Record<RoomBasis, { label: string; people: string }> = {
  sharing: { label: "Sharing", people: "5-6 per room" },
  quad: { label: "Quad", people: "4 per room" },
  triple: { label: "Triple", people: "3 per room" },
  double: { label: "Double", people: "2 per room" },
};

export type Hotel = {
  /** Named "or similar": the exact hotel is confirmed on the booking voucher. */
  name: string;
  stars: number;
  /** Walking distance to the nearest Haram gate, as a range the hotel can honour. */
  distance: string;
  /** Shuttle hotels say so plainly. */
  shuttle?: boolean;
  meals?: string;
};

export type ItineraryStep = { when: string; title: string; detail: string };

export type UmrahPackage = {
  slug: string;
  name: string;
  /** Short title for cards and breadcrumbs. */
  shortName: string;
  days: number;
  nights: { makkah: number; madinah: number };
  tier: Tier;
  season?: "december" | "ramadan";
  /** Who the package is built for; drives the family / couples / group pages. */
  audiences?: ("family" | "couples" | "group")[];
  image: ImageKey;
  hotels: { makkah: Hotel; madinah: Hotel };
  flights: string;
  transport: string;
  ziyarat: boolean;
  /** PKR per person. Omit a basis the package doesn't offer. */
  prices: Partial<Record<RoomBasis, number>>;
  bestFor: string;
  summary: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  faqs?: { q: string; a: string }[];
  featured?: boolean;
  /** Travel window, e.g. "Oct 2026 - Mar 2027". */
  validity: string;
  /** Madinah first when flights land at MED (common on 5-star and Ramadan packages). */
  madinahFirst?: boolean;
};

export const packages: UmrahPackage[] = packageData;

export function getPackage(slug: string): UmrahPackage | undefined {
  return packages.find((p) => p.slug === slug);
}

/** Lowest advertised per-person price and the room basis it applies to. */
export function fromPrice(p: UmrahPackage): { amount: number; basis: RoomBasis } {
  const order: RoomBasis[] = ["sharing", "quad", "triple", "double"];
  let best: { amount: number; basis: RoomBasis } | null = null;
  for (const b of order) {
    const v = p.prices[b];
    if (v && (!best || v < best.amount)) best = { amount: v, basis: b };
  }
  if (!best) throw new Error(`Package ${p.slug} has no prices`);
  return best;
}

export function cheapest(list: UmrahPackage[]): { amount: number; basis: RoomBasis } | null {
  if (list.length === 0) return null;
  return list.map(fromPrice).sort((a, b) => a.amount - b.amount)[0];
}

export function durationLabel(p: UmrahPackage): string {
  return `${p.days} days · ${p.nights.makkah} nights Makkah · ${p.nights.madinah} nights Madinah`;
}

/**
 * Day-by-day plan derived from the night split, so every package page reads the
 * same way and the itinerary can never contradict the advertised nights.
 */
export function itinerary(p: UmrahPackage): ItineraryStep[] {
  const { makkah, madinah } = p.nights;
  const steps: ItineraryStep[] = [];
  const range = (a: number, b: number) => (a === b ? `Day ${a}` : `Days ${a}-${b}`);

  const makkahStay = (start: number, first: boolean): ItineraryStep[] => {
    const out: ItineraryStep[] = [];
    if (first) {
      out.push({
        when: `Day ${start}`,
        title: "Fly to Jeddah, perform Umrah",
        detail:
          "Enter ihram before the miqat (on the plane for flights from Pakistan - we remind you before take-off). Our driver meets you at Jeddah airport for the transfer to your Makkah hotel. Rest, then perform your Umrah: tawaf, sa'i and halq or taqsir.",
      });
    } else {
      out.push({
        when: `Day ${start}`,
        title: "Travel to Makkah, perform Umrah",
        detail:
          "Leave Madinah after breakfast. Enter ihram at the miqat of Dhul Hulayfah (Bir Ali) on the way - the coach stops there. Check in to your Makkah hotel and perform your Umrah.",
      });
    }
    const lastMakkahDay = start + makkah - 1;
    if (makkah >= 3) {
      out.push({
        when: range(start + 1, lastMakkahDay),
        title: "Makkah - prayers at Masjid al-Haram",
        detail: p.ziyarat
          ? "Five daily prayers in the Haram, extra tawaf and optional additional Umrahs from Masjid Aisha (Taneem). One morning is set aside for Makkah ziyarat by coach: Jabal al-Nour (Cave Hira), Jabal Thawr, Mina, Muzdalifah and Arafat."
          : "Five daily prayers in the Haram, extra tawaf and optional additional Umrahs from Masjid Aisha (Taneem). Makkah ziyarat can be added for a small charge.",
      });
    }
    return out;
  };

  const madinahStay = (start: number, first: boolean): ItineraryStep[] => {
    const out: ItineraryStep[] = [];
    out.push({
      when: `Day ${start}`,
      title: first ? "Fly to Madinah" : "Travel to Madinah",
      detail: first
        ? "Land at Prince Mohammad bin Abdulaziz Airport, Madinah. Our driver takes you to your hotel near Masjid an-Nabawi. Umrah is performed later, when you travel to Makkah."
        : p.transport.toLowerCase().includes("train")
          ? "Leave Makkah after breakfast on the Haramain high-speed train (about 2½ hours) and transfer to your hotel near Masjid an-Nabawi."
          : "Leave Makkah after Fajr and breakfast for the coach journey to Madinah (5-6 hours with a rest stop). Check in near Masjid an-Nabawi.",
    });
    const lastMadinahDay = start + madinah - 1;
    if (madinah >= 2) {
      out.push({
        when: range(start + 1, lastMadinahDay),
        title: "Madinah - Masjid an-Nabawi and Riaz ul Jannah",
        detail: p.ziyarat
          ? "Prayers at the Prophet's Mosque ﷺ, salam at the blessed grave, and Riaz ul Jannah on a Nusuk permit (we help you book a slot, subject to availability). Madinah ziyarat by coach: Masjid Quba, Mount Uhud and the martyrs of Uhud, Masjid al-Qiblatayn and the Seven Mosques."
          : "Prayers at the Prophet's Mosque ﷺ, salam at the blessed grave, and Riaz ul Jannah on a Nusuk permit (we help you book a slot, subject to availability). Madinah ziyarat can be added for a small charge.",
      });
    }
    return out;
  };

  const lastDay = makkah + madinah + 1;
  if (p.madinahFirst) {
    steps.push(...madinahStay(1, true));
    steps.push(...makkahStay(madinah + 1, false));
    steps.push({
      when: `Day ${lastDay}`,
      title: "Fly home from Jeddah",
      detail:
        "Tawaf al-Wida (farewell tawaf) before you leave Makkah, then the transfer to Jeddah airport for your flight back to Pakistan. Zamzam allowance as per airline rules.",
    });
  } else {
    steps.push(...makkahStay(1, true));
    steps.push(...madinahStay(makkah + 1, false));
    steps.push({
      when: `Day ${lastDay}`,
      title: "Fly home",
      detail:
        "Transfer to the airport for your return flight to Pakistan (from Madinah or Jeddah, depending on the airline). Zamzam allowance as per airline rules.",
    });
  }
  return steps;
}

/** Serializable package list for the client-side cost calculator (seasonal packages excluded). */
export function calculatorPackages() {
  return packages
    .filter((p) => !p.season)
    .map((p) => ({ slug: p.slug, name: p.name, days: p.days, tier: p.tier, prices: p.prices }));
}

export const STANDARD_EXCLUDES = [
  "Meals, unless stated for the hotel",
  "Personal expenses, laundry and phone",
  "Qurbani / sacrifice",
  "Extra baggage beyond the airline allowance",
  "Rawdah (Riaz ul Jannah) and Haram access depend on Nusuk permit availability",
];
