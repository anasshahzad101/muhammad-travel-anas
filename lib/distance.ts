import { TIERS, packages, type Tier, type UmrahPackage } from "./packages";

/**
 * Hotel distances are stored as the human strings pilgrims see ("450 - 700 m",
 * "1.1 - 1.3 km"). These helpers turn them into metres so the site can draw
 * them to scale and estimate walking times, without a second copy of the data.
 */

export type Range = { min: number; max: number };

export function parseDistance(s: string): Range {
  const nums = (s.match(/\d+(?:\.\d+)?/g) ?? ["0"]).map(Number);
  const k = /km/i.test(s) ? 1000 : 1;
  const [a, b = a] = nums;
  return { min: Math.round(a * k), max: Math.round(b * k) };
}

/** An easy walking pace through crowds, in metres per minute (about 4 km/h). */
export const WALK_PACE = 67;

export function walkMinutes(m: number): number {
  return Math.max(1, Math.round(m / WALK_PACE));
}

/** "7-10 min walk", or "1 min walk" when the band is too tight to be a range. */
export function formatWalk(r: Range): string {
  const a = walkMinutes(r.min);
  const b = walkMinutes(r.max);
  return a === b ? `${b} min walk` : `${a}-${b} min walk`;
}

export function formatMetres(m: number): string {
  return m >= 1000 ? `${(m / 1000).toFixed(1).replace(/\.0$/, "")} km` : `${m} m`;
}

export function formatRange(r: Range): string {
  const km = (m: number) => (m / 1000).toFixed(1);
  if (r.min >= 1000) return `${km(r.min)}-${km(r.max)} km`;
  if (r.max >= 1000) return r.min === 0 ? `up to ${km(r.max)} km` : `${r.min} m-${km(r.max)} km`;
  return `${r.min}-${r.max} m`;
}

export type TierDistance = {
  tier: Tier;
  label: string;
  stars: number;
  makkah: Range;
  madinah: Range;
  shuttle: boolean;
  blurb: string;
  href: string;
};

/**
 * Typical distance band per hotel tier, derived from the live package data:
 * the widest range any package in the tier advertises, per city.
 */
export function tierDistances(list: UmrahPackage[] = packages): TierDistance[] {
  const order: Tier[] = ["5-star", "4-star", "3-star", "economy"];
  return order
    .map((tier) => {
      const inTier = list.filter((p) => p.tier === tier);
      if (inTier.length === 0) return null;
      const span = (city: "makkah" | "madinah"): Range => {
        const rs = inTier.map((p) => parseDistance(p.hotels[city].distance));
        return { min: Math.min(...rs.map((r) => r.min)), max: Math.max(...rs.map((r) => r.max)) };
      };
      return {
        tier,
        label: TIERS[tier].label,
        stars: TIERS[tier].stars,
        makkah: span("makkah"),
        madinah: span("madinah"),
        shuttle: inTier.some((p) => p.hotels.makkah.shuttle),
        blurb: TIERS[tier].blurb,
        href: `/umrah-packages/${tier}/`,
      };
    })
    .filter((x): x is TierDistance => x !== null);
}
