import type { RoomBasis, Tier, UmrahPackage } from "./packages";

/**
 * Package matching shared by the hero finder and the cost calculator. This file
 * must stay free of runtime imports from ./packages so the client bundles never
 * pull in the whole package database - only the slim list passed as props.
 *
 * It never invents prices: it finds the closest real package (same hotel tier,
 * nearest length) and the requested room, or the nearest room that package sells.
 */

export type FinderPackage = {
  slug: string;
  name: string;
  shortName: string;
  days: number;
  tier: Tier;
  prices: Partial<Record<RoomBasis, number>>;
  nights: { makkah: number; madinah: number };
  makkahDistance: string;
};

export const FINDER_DAYS = [7, 10, 15, 21, 28];

export const FINDER_TIERS: { id: Tier; label: string; short: string }[] = [
  { id: "economy", label: "Economy", short: "Economy" },
  { id: "3-star", label: "3-Star", short: "3★" },
  { id: "4-star", label: "4-Star", short: "4★" },
  { id: "5-star", label: "5-Star", short: "5★" },
];

export const FINDER_ROOMS: { id: RoomBasis; label: string; people: string; beds: number }[] = [
  { id: "sharing", label: "Sharing", people: "5-6 per room", beds: 6 },
  { id: "quad", label: "Quad", people: "4 per room", beds: 4 },
  { id: "triple", label: "Triple", people: "3 per room", beds: 3 },
  { id: "double", label: "Double", people: "2 per room", beds: 2 },
];

const ROOM_ORDER: RoomBasis[] = ["sharing", "quad", "triple", "double"];

export type FinderMatch = {
  pkg: FinderPackage;
  usedRoom: RoomBasis;
  perPerson: number;
  /** True when both the length and the room are exactly what was asked for. */
  exact: boolean;
};

export function matchPackage(list: FinderPackage[], days: number, tier: Tier, room: RoomBasis): FinderMatch | null {
  const sameTier = list.filter((p) => p.tier === tier);
  if (sameTier.length === 0) return null;
  const pkg = [...sameTier].sort((a, b) => Math.abs(a.days - days) - Math.abs(b.days - days) || a.days - b.days)[0];
  const idx = ROOM_ORDER.indexOf(room);
  const available = ROOM_ORDER.filter((r) => pkg.prices[r]);
  const usedRoom = pkg.prices[room]
    ? room
    : [...available].sort((a, b) => Math.abs(ROOM_ORDER.indexOf(a) - idx) - Math.abs(ROOM_ORDER.indexOf(b) - idx))[0];
  return { pkg, usedRoom, perPerson: pkg.prices[usedRoom]!, exact: pkg.days === days && usedRoom === room };
}

/** Slim, serialisable list for client components (seasonal packages excluded). */
export function toFinderList(packages: UmrahPackage[]): FinderPackage[] {
  return packages
    .filter((p) => !p.season)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      shortName: p.shortName,
      days: p.days,
      tier: p.tier,
      prices: p.prices,
      nights: p.nights,
      makkahDistance: p.hotels.makkah.distance,
    }));
}

export const pkr = (n: number) => `PKR ${Math.round(n).toLocaleString("en-PK")}`;
