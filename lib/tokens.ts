import { ROOM_BASIS, cheapest, type UmrahPackage } from "./packages";
import { formatPKR } from "./site";

/** Replaces {from}, {basis} and {count} in category copy with live package data. */
export function fillTokens(text: string, list: UmrahPackage[]): string {
  const low = cheapest(list);
  return text
    .replaceAll("{from}", low ? formatPKR(low.amount) : "on request")
    .replaceAll("{basis}", low ? ROOM_BASIS[low.basis].label.toLowerCase() : "shared")
    .replaceAll("{count}", String(list.length));
}
