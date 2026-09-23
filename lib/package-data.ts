/**
 * PACKAGE LINE-UP — 1448H season (Oct 2026 – Mar 2027).
 *
 * PROVISIONAL: prices and hotels are benchmarked against competitor packages
 * published in September 2026 (see research/competitor-packages-summary.md).
 * They are NOT supplier quotes. Before launch, confirm every price, hotel and
 * airline with your wholesaler/Saudi umrah company, then update here — every
 * page, table, price in copy and JSON-LD offer reads from this file.
 *
 * Conventions:
 * - Prices are PKR per person, including visa (+ insurance), return economy
 *   flights, hotels and all transfers.
 * - total days = Makkah nights + Madinah nights + 1.
 * - Hotel names are "or similar": the voucher confirms the exact hotel.
 */

import type { UmrahPackage } from "./packages";

const BASE_INCLUDES = [
  "Umrah visa with mandatory health insurance",
  "Return economy flights from Lahore, Karachi or Islamabad",
  "Airport and intercity transfers by air-conditioned coach",
];

const flightsDirect =
  "Return economy flights, direct to Jeddah or Madinah where available (Saudia, PIA, Airblue or flynas), otherwise one-stop.";

export const packageData: UmrahPackage[] = [
  // ─── 7 days ────────────────────────────────────────────────────────────────
  {
    slug: "7-days-economy",
    name: "7 Days Economy Umrah Package",
    shortName: "7 Days Economy",
    days: 7,
    nights: { makkah: 4, madinah: 2 },
    tier: "economy",
    audiences: ["group"],
    image: "nabawiPortrait",
    hotels: {
      makkah: { name: "Kudai Towers or similar", stars: 2, distance: "1.1 – 1.3 km", shuttle: true },
      madinah: { name: "Shaza Al Munawara or similar", stars: 2, distance: "750 – 850 m" },
    },
    flights: flightsDirect,
    transport: "Shared coach",
    ziyarat: false,
    prices: { sharing: 245000, quad: 255000, triple: 270000, double: 300000 },
    bestFor: "a first Umrah on a tight budget, or a repeat Umrah with one week of leave.",
    summary:
      "The shortest complete Umrah we sell: four nights in Makkah and two in Madinah, with visa, return flights, hotels and transport in one price.",
    highlights: [
      "Fits into a single week of leave",
      "Visa, flights, hotels and transfers in one price — nothing to arrange yourself",
      "Walking distance in Madinah; a longer walk in Makkah that keeps the price low",
    ],
    includes: [...BASE_INCLUDES, "4 nights Makkah, economy hotel", "2 nights Madinah, economy hotel"],
    excludes: ["Ziyarat (can be added)"],
    validity: "Oct 2026 – Jan 2027, excluding 15–31 Dec",
  },
  {
    slug: "7-days-5-star",
    name: "7 Days 5-Star Umrah Package",
    shortName: "7 Days 5-Star",
    days: 7,
    nights: { makkah: 4, madinah: 2 },
    tier: "5-star",
    audiences: ["couples"],
    image: "clockTower",
    hotels: {
      makkah: { name: "Swissotel Makkah (Clock Tower) or similar", stars: 5, distance: "0 – 100 m", meals: "Breakfast" },
      madinah: { name: "Anwar Al Madinah Mövenpick or similar", stars: 5, distance: "0 – 100 m", meals: "Breakfast" },
    },
    flights: flightsDirect,
    transport: "Private car transfers",
    ziyarat: true,
    prices: { quad: 395000, triple: 430000, double: 495000 },
    bestFor: "busy professionals and couples who want a short trip with no walking.",
    summary:
      "A one-week Umrah in the Clock Tower and a front-row Madinah hotel: step out of the lobby into the Haram, with private car transfers throughout.",
    highlights: [
      "Makkah hotel in the Abraj Al Bait complex, at the Haram's edge",
      "Private car transfers instead of a shared coach",
      "Breakfast daily and ziyarat in both cities",
    ],
    includes: [
      ...BASE_INCLUDES.slice(0, 2),
      "Private car transfers (airport and Makkah–Madinah)",
      "4 nights Makkah, 5-star with breakfast",
      "2 nights Madinah, 5-star with breakfast",
      "Makkah and Madinah ziyarat",
    ],
    excludes: ["Haram-view room upgrade"],
    validity: "Oct 2026 – Jan 2027",
  },

  // ─── 10 days ───────────────────────────────────────────────────────────────
  {
    slug: "10-days-economy",
    name: "10 Days Economy Umrah Package",
    shortName: "10 Days Economy",
    days: 10,
    nights: { makkah: 6, madinah: 3 },
    tier: "economy",
    image: "kaabaWide",
    hotels: {
      makkah: { name: "Kudai Towers or similar", stars: 2, distance: "1.1 – 1.3 km", shuttle: true },
      madinah: { name: "Shaza Al Munawara or similar", stars: 2, distance: "750 – 850 m" },
    },
    flights: flightsDirect,
    transport: "Shared coach",
    ziyarat: true,
    prices: { sharing: 260000, quad: 270000, triple: 288000, double: 320000 },
    bestFor: "pilgrims who want more than a week without paying for a fortnight.",
    summary:
      "Six nights in Makkah and three in Madinah at an economy price, with ziyarat in both cities included.",
    highlights: [
      "Time for a second Umrah from Masjid Aisha",
      "Ziyarat included in Makkah and Madinah",
      "Sharing rooms available for the lowest price",
    ],
    includes: [...BASE_INCLUDES, "6 nights Makkah, economy hotel", "3 nights Madinah, economy hotel", "Makkah and Madinah ziyarat"],
    excludes: [],
    validity: "Oct 2026 – Jan 2027, excluding 15–31 Dec",
  },
  {
    slug: "10-days-3-star",
    name: "10 Days 3-Star Umrah Package",
    shortName: "10 Days 3-Star",
    days: 10,
    nights: { makkah: 6, madinah: 3 },
    tier: "3-star",
    audiences: ["couples"],
    image: "kaabaTowers",
    hotels: {
      makkah: { name: "Emaar Al Khalil or similar", stars: 3, distance: "450 – 700 m" },
      madinah: { name: "Artal International or similar", stars: 3, distance: "200 – 350 m" },
    },
    flights: flightsDirect,
    transport: "Shared coach",
    ziyarat: true,
    prices: { quad: 315000, triple: 338000, double: 385000 },
    bestFor: "couples and small families with ten days of leave.",
    summary:
      "Ten days with walking-distance hotels in both cities — the comfortable middle ground between a rushed week and a full fortnight.",
    highlights: [
      "Walking distance to both Harams",
      "Double rooms for couples",
      "Ziyarat in Makkah and Madinah included",
    ],
    includes: [...BASE_INCLUDES, "6 nights Makkah, 3-star hotel", "3 nights Madinah, 3-star hotel", "Makkah and Madinah ziyarat"],
    excludes: [],
    validity: "Oct 2026 – Jan 2027",
  },

  // ─── 15 days ───────────────────────────────────────────────────────────────
  {
    slug: "15-days-economy",
    name: "15 Days Economy Umrah Package",
    shortName: "15 Days Economy",
    days: 15,
    nights: { makkah: 8, madinah: 6 },
    tier: "economy",
    audiences: ["group"],
    featured: true,
    image: "kaabaWide",
    hotels: {
      makkah: { name: "Kudai Towers or similar", stars: 2, distance: "1.1 – 1.3 km", shuttle: true },
      madinah: { name: "Shaza Al Munawara or similar", stars: 2, distance: "750 – 850 m" },
    },
    flights: flightsDirect,
    transport: "Shared coach",
    ziyarat: true,
    prices: { sharing: 270000, quad: 280000, triple: 298000, double: 335000 },
    bestFor: "a complete two-week Umrah at the lowest price.",
    summary:
      "Pakistan's most popular Umrah length at an economy price: eight nights in Makkah, six in Madinah, with visa, flights, hotels, transport and ziyarat included.",
    highlights: [
      "Two full weeks for less than most 3-star packages",
      "Ziyarat in Makkah and Madinah included",
      "Sharing and quad rooms keep the price down",
    ],
    includes: [...BASE_INCLUDES, "8 nights Makkah, economy hotel", "6 nights Madinah, economy hotel", "Makkah and Madinah ziyarat"],
    excludes: [],
    validity: "Oct 2026 – Jan 2027, excluding 15–31 Dec",
  },
  {
    slug: "15-days-3-star",
    name: "15 Days 3-Star Umrah Package",
    shortName: "15 Days 3-Star",
    days: 15,
    nights: { makkah: 8, madinah: 6 },
    tier: "3-star",
    audiences: ["family"],
    featured: true,
    image: "kaabaCourtyard",
    hotels: {
      makkah: { name: "Emaar Al Khalil or similar", stars: 3, distance: "450 – 700 m" },
      madinah: { name: "Artal International or similar", stars: 3, distance: "200 – 350 m" },
    },
    flights: flightsDirect,
    transport: "Shared coach",
    ziyarat: true,
    prices: { quad: 340000, triple: 368000, double: 420000 },
    bestFor: "families who want walking-distance hotels at a sensible price.",
    summary:
      "The package most Pakistani families choose: two weeks with walking-distance 3-star hotels in Makkah and Madinah, visa, flights, transport and ziyarat included.",
    highlights: [
      "The choice most Pakistani families make",
      "About 10 minutes' walk to Masjid al-Haram",
      "Quad and triple rooms keep a family together",
    ],
    includes: [...BASE_INCLUDES, "8 nights Makkah, 3-star hotel", "6 nights Madinah, 3-star hotel", "Makkah and Madinah ziyarat"],
    excludes: [],
    validity: "Oct 2026 – Jan 2027",
  },
  {
    slug: "15-days-4-star",
    name: "15 Days 4-Star Umrah Package",
    shortName: "15 Days 4-Star",
    days: 15,
    nights: { makkah: 8, madinah: 6 },
    tier: "4-star",
    audiences: ["family", "couples"],
    featured: true,
    image: "nabawiDome",
    hotels: {
      makkah: { name: "Areej Al Wafa or similar", stars: 4, distance: "150 – 400 m", meals: "Breakfast" },
      madinah: { name: "Rua International or similar", stars: 4, distance: "100 – 250 m", meals: "Breakfast" },
    },
    flights: flightsDirect,
    transport: "Shared coach",
    ziyarat: true,
    prices: { quad: 395000, triple: 435000, double: 510000 },
    bestFor: "elderly parents and families who want short walks and breakfast.",
    summary:
      "Two weeks in closer, quieter 4-star hotels with breakfast — a few minutes' walk to both Harams, so older pilgrims can pray in the mosque every time.",
    highlights: [
      "A few minutes' walk to the Haram in both cities",
      "Breakfast every day",
      "Our recommendation for travelling with parents",
    ],
    includes: [
      ...BASE_INCLUDES,
      "8 nights Makkah, 4-star hotel with breakfast",
      "6 nights Madinah, 4-star hotel with breakfast",
      "Makkah and Madinah ziyarat",
    ],
    excludes: [],
    validity: "Oct 2026 – Jan 2027",
  },
  {
    slug: "15-days-5-star",
    name: "15 Days 5-Star Umrah Package",
    shortName: "15 Days 5-Star",
    days: 15,
    nights: { makkah: 8, madinah: 6 },
    tier: "5-star",
    audiences: ["couples"],
    featured: true,
    image: "clockTower",
    hotels: {
      makkah: { name: "Swissotel Makkah (Clock Tower) or similar", stars: 5, distance: "0 – 100 m", meals: "Breakfast" },
      madinah: { name: "Anwar Al Madinah Mövenpick or similar", stars: 5, distance: "0 – 100 m", meals: "Breakfast" },
    },
    flights: flightsDirect,
    transport: "Private car transfers",
    ziyarat: true,
    prices: { quad: 495000, triple: 550000, double: 665000 },
    bestFor: "pilgrims who want the Haram on their doorstep for the whole fortnight.",
    summary:
      "Two weeks in the Clock Tower and a front-row Madinah hotel, with private car transfers, breakfast and ziyarat — the closest you can stay to both Harams.",
    highlights: [
      "Clock Tower hotel: lobby to Haram courtyard in minutes",
      "Private car transfers throughout",
      "Haram-view rooms available on request",
    ],
    includes: [
      ...BASE_INCLUDES.slice(0, 2),
      "Private car transfers (airport and Makkah–Madinah)",
      "8 nights Makkah, 5-star with breakfast",
      "6 nights Madinah, 5-star with breakfast",
      "Makkah and Madinah ziyarat",
    ],
    excludes: ["Haram-view room upgrade"],
    validity: "Oct 2026 – Jan 2027",
  },

  // ─── 21 days ───────────────────────────────────────────────────────────────
  {
    slug: "21-days-economy",
    name: "21 Days Economy Umrah Package",
    shortName: "21 Days Economy",
    days: 21,
    nights: { makkah: 13, madinah: 7 },
    tier: "economy",
    audiences: ["group"],
    image: "nabawiUmbrellas",
    hotels: {
      makkah: { name: "Kudai Towers or similar", stars: 2, distance: "1.1 – 1.3 km", shuttle: true },
      madinah: { name: "Shaza Al Munawara or similar", stars: 2, distance: "750 – 850 m" },
    },
    flights: flightsDirect,
    transport: "Shared coach",
    ziyarat: true,
    prices: { sharing: 295000, quad: 310000, triple: 332000, double: 380000 },
    bestFor: "pilgrims with time who want three weeks at the lowest cost per day.",
    summary:
      "Three weeks — thirteen nights in Makkah and seven in Madinah — for only a little more than a fortnight, because the flight and visa cost the same.",
    highlights: [
      "Lowest cost per day of any package",
      "Time for several Umrahs and full ziyarat",
      "A gentler pace between prayers and rest",
    ],
    includes: [...BASE_INCLUDES, "13 nights Makkah, economy hotel", "7 nights Madinah, economy hotel", "Makkah and Madinah ziyarat"],
    excludes: [],
    validity: "Oct 2026 – Jan 2027, excluding 15–31 Dec",
  },
  {
    slug: "21-days-3-star",
    name: "21 Days 3-Star Umrah Package",
    shortName: "21 Days 3-Star",
    days: 21,
    nights: { makkah: 13, madinah: 7 },
    tier: "3-star",
    audiences: ["family"],
    featured: true,
    image: "nabawiWide",
    hotels: {
      makkah: { name: "Emaar Al Khalil or similar", stars: 3, distance: "450 – 700 m" },
      madinah: { name: "Artal International or similar", stars: 3, distance: "200 – 350 m" },
    },
    flights: flightsDirect,
    transport: "Shared coach",
    ziyarat: true,
    prices: { quad: 395000, triple: 430000, double: 500000 },
    bestFor: "elderly parents and families who want three unhurried weeks.",
    summary:
      "Three weeks in walking-distance 3-star hotels: the slow, comfortable Umrah we recommend when parents or grandparents are travelling.",
    highlights: [
      "Unhurried pace with rest days built in",
      "Walking distance to both Harams",
      "Ziyarat included in both cities",
    ],
    includes: [...BASE_INCLUDES, "13 nights Makkah, 3-star hotel", "7 nights Madinah, 3-star hotel", "Makkah and Madinah ziyarat"],
    excludes: [],
    validity: "Oct 2026 – Jan 2027",
  },

  // ─── 28 days ───────────────────────────────────────────────────────────────
  {
    slug: "28-days-economy",
    name: "28 Days Economy Umrah Package",
    shortName: "28 Days Economy",
    days: 28,
    nights: { makkah: 19, madinah: 8 },
    tier: "economy",
    audiences: ["group"],
    image: "kaabaWide",
    hotels: {
      makkah: { name: "Kudai Towers or similar", stars: 2, distance: "1.1 – 1.3 km", shuttle: true },
      madinah: { name: "Shaza Al Munawara or similar", stars: 2, distance: "750 – 850 m" },
    },
    flights: flightsDirect,
    transport: "Shared coach",
    ziyarat: true,
    prices: { sharing: 330000, quad: 345000, triple: 372000, double: 430000 },
    bestFor: "retired pilgrims who want a month of worship at a sensible price.",
    summary:
      "A month in the two holy cities — nineteen nights in Makkah and eight in Madinah — with visa, flights, hotels, transport and ziyarat included.",
    highlights: [
      "A full month for well under double the price of two weeks",
      "Sharing rooms for the lowest cost",
      "Ziyarat in both cities",
    ],
    includes: [...BASE_INCLUDES, "19 nights Makkah, economy hotel", "8 nights Madinah, economy hotel", "Makkah and Madinah ziyarat"],
    excludes: [],
    validity: "Oct 2026 – Jan 2027, excluding 15–31 Dec",
  },
  {
    slug: "28-days-3-star",
    name: "28 Days 3-Star Umrah Package",
    shortName: "28 Days 3-Star",
    days: 28,
    nights: { makkah: 19, madinah: 8 },
    tier: "3-star",
    image: "nabawiPortrait",
    hotels: {
      makkah: { name: "Emaar Al Khalil or similar", stars: 3, distance: "450 – 700 m" },
      madinah: { name: "Artal International or similar", stars: 3, distance: "200 – 350 m" },
    },
    flights: flightsDirect,
    transport: "Shared coach",
    ziyarat: true,
    prices: { quad: 450000, triple: 495000, double: 580000 },
    bestFor: "a month-long stay within walking distance of both Harams.",
    summary:
      "Four weeks in walking-distance 3-star hotels: long enough to settle into the rhythm of the Haram without a daily trek.",
    highlights: ["A month within walking distance", "Ziyarat in both cities", "Quad, triple and double rooms"],
    includes: [...BASE_INCLUDES, "19 nights Makkah, 3-star hotel", "8 nights Madinah, 3-star hotel", "Makkah and Madinah ziyarat"],
    excludes: [],
    validity: "Oct 2026 – Jan 2027",
  },

  // ─── Seasonal ──────────────────────────────────────────────────────────────
  {
    slug: "december-family-umrah-15-days",
    name: "December Family Umrah Package (15 Days, 3-Star)",
    shortName: "December Family 15 Days",
    days: 15,
    nights: { makkah: 8, madinah: 6 },
    tier: "3-star",
    season: "december",
    audiences: ["family"],
    featured: true,
    image: "kaabaNight",
    hotels: {
      makkah: { name: "Emaar Al Khalil or similar", stars: 3, distance: "450 – 700 m" },
      madinah: { name: "Artal International or similar", stars: 3, distance: "200 – 350 m" },
    },
    flights: flightsDirect,
    transport: "Shared coach",
    ziyarat: true,
    prices: { quad: 395000, triple: 425000, double: 480000 },
    bestFor: "school-going families travelling in the winter holidays.",
    summary:
      "A fortnight timed around Pakistan's December school holidays, with walking-distance hotels, quad rooms for families and ziyarat in both cities.",
    highlights: [
      "Departures around the winter school holidays",
      "Family quad rooms — everyone in one room",
      "Mild weather in Makkah and Madinah",
    ],
    includes: [...BASE_INCLUDES, "8 nights Makkah, 3-star hotel", "6 nights Madinah, 3-star hotel", "Makkah and Madinah ziyarat"],
    excludes: [],
    validity: "Departures 12–26 December 2026",
  },
  {
    slug: "ramadan-last-10-days-umrah",
    name: "Ramadan Last 10 Days Umrah Package 2027",
    shortName: "Ramadan Last 10 Days",
    days: 15,
    nights: { makkah: 10, madinah: 4 },
    tier: "4-star",
    season: "ramadan",
    madinahFirst: true,
    image: "kaabaNight",
    hotels: {
      makkah: { name: "Areej Al Wafa or similar", stars: 4, distance: "150 – 400 m", meals: "Suhoor & iftar" },
      madinah: { name: "Rua International or similar", stars: 4, distance: "100 – 250 m", meals: "Suhoor & iftar" },
    },
    flights: flightsDirect,
    transport: "Shared coach",
    ziyarat: true,
    prices: { quad: 650000, triple: 720000, double: 850000 },
    bestFor: "pilgrims seeking Laylat al-Qadr in the Haram.",
    summary:
      "Madinah first, then the last ten nights of Ramadan in Makkah, close enough to the Haram for taraweeh and qiyam every night. Eid in Makkah on most departures.",
    highlights: [
      "The last ten nights in Makkah, when Laylat al-Qadr is sought",
      "Suhoor and iftar at both hotels",
      "Madinah first, so Umrah is performed in Ramadan",
    ],
    includes: [
      ...BASE_INCLUDES,
      "4 nights Madinah, 4-star with suhoor & iftar",
      "10 nights Makkah, 4-star with suhoor & iftar",
      "Makkah and Madinah ziyarat",
    ],
    excludes: ["I'tikaf arrangements inside the Haram (by Saudi permit)"],
    validity: "Ramadan 1448 (expected Feb–Mar 2027)",
  },
  {
    slug: "ramadan-full-month-umrah",
    name: "Full Ramadan Umrah Package 2027 (30 Days)",
    shortName: "Full Ramadan 30 Days",
    days: 30,
    nights: { makkah: 20, madinah: 9 },
    tier: "3-star",
    season: "ramadan",
    madinahFirst: true,
    audiences: ["group"],
    image: "nabawiLattice",
    hotels: {
      makkah: { name: "Emaar Al Khalil or similar", stars: 3, distance: "450 – 700 m" },
      madinah: { name: "Artal International or similar", stars: 3, distance: "200 – 350 m" },
    },
    flights: flightsDirect,
    transport: "Shared coach",
    ziyarat: true,
    prices: { quad: 560000, triple: 620000, double: 740000 },
    bestFor: "pilgrims who want the whole month of Ramadan in the two Harams.",
    summary:
      "The whole of Ramadan: the first third in Madinah, then the rest of the month — including the last ten nights — in Makkah, in walking-distance 3-star hotels.",
    highlights: [
      "Every night of Ramadan in the holy cities",
      "Lower cost per night than a last-ten-days package",
      "Walking distance for taraweeh",
    ],
    includes: [...BASE_INCLUDES, "9 nights Madinah, 3-star hotel", "20 nights Makkah, 3-star hotel", "Makkah and Madinah ziyarat"],
    excludes: ["Suhoor and iftar (available at extra cost)"],
    validity: "Ramadan 1448 (expected Feb–Mar 2027)",
  },
];
