import type { DepartureFacts } from "@/components/JourneyMap";
import { CITIES } from "./geo-map";
import { market } from "./market";

/**
 * Facts for the journey map, assembled on the server from the site's own copy
 * (flight times and airports from the city pages) and market data (fares).
 * Distances are great-circle, computed here so the client never recomputes
 * floats that could differ from the server render.
 */

const fares = Object.fromEntries(market.airfare.map((a) => [a.code, `PKR ${a.min.toLocaleString("en-PK")}-${a.max.toLocaleString("en-PK")}`]));

export const departures: DepartureFacts[] = [
  { id: "lahore", city: "Lahore", airport: "Allama Iqbal International Airport (LHE)", flight: "About 5 hours", fare: fares.LHE, href: "/umrah-packages/lahore/" },
  { id: "karachi", city: "Karachi", airport: "Jinnah International Airport (KHI)", flight: "About 4 hours", fare: fares.KHI, href: "/umrah-packages/karachi/" },
  { id: "islamabad", city: "Islamabad", airport: "Islamabad International Airport (ISB)", flight: "About 5 hours", fare: fares.ISB, href: "/umrah-packages/islamabad/" },
];

function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * 6371 * Math.asin(Math.sqrt(h)));
}

export const routeDistances: Record<string, number> = Object.fromEntries(
  departures.flatMap((d) => (["jeddah", "madinah"] as const).map((to) => [`${d.id}-${to}`, haversineKm(CITIES[d.id], CITIES[to])])),
);

export const groundNote =
  "Between Makkah and Madinah: the Haramain high-speed train takes about 2½ hours, or the coach 5-6 hours with a rest stop.";
