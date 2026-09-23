import { ROOM_BASIS, cheapest, type UmrahPackage } from "./packages";
import { formatPKR } from "./site";

/**
 * Replaces tokens in category copy with live package data:
 *   {from}        lowest per-person price in the category, any room
 *   {basis}       room basis of that price
 *   {count}       number of packages
 *   {fromDouble}  lowest per-person price for a double room (for copy that says "double room")
 */
export function fillTokens(text: string, list: UmrahPackage[]): string {
  const low = cheapest(list);
  const doubles = list.map((p) => p.prices.double).filter((v): v is number => typeof v === "number");
  return text
    .replaceAll("{from}", low ? formatPKR(low.amount) : "on request")
    .replaceAll("{basis}", low ? ROOM_BASIS[low.basis].label.toLowerCase() : "shared")
    .replaceAll("{count}", String(list.length))
    .replaceAll("{fromDouble}", doubles.length ? formatPKR(Math.min(...doubles)) : "on request");
}
