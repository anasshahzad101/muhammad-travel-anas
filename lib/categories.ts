/**
 * Package category landing pages (/umrah-packages/[slug]/).
 *
 * Each page targets one keyword cluster from the Keyword Planner export and
 * doubles as the Google Ads landing page for the matching ad group, so the H1
 * mirrors the search term. Copy is written per page — no spun templates — and
 * prices are injected from package data via tokens so they can never drift:
 *
 *   {from}   lowest per-person price in the category, e.g. "PKR 245,000"
 *   {basis}  room basis of that price, e.g. "quad"
 *   {count}  number of packages in the category
 */

import type { ImageKey } from "./images";
import type { UmrahPackage } from "./packages";
import { season } from "./season";

export type CategoryGroup = "city" | "duration" | "tier" | "audience" | "season";

export type Category = {
  slug: string;
  group: CategoryGroup;
  h1: string;
  title: string;
  description: string;
  eyebrow: string;
  image: ImageKey;
  filter: (p: UmrahPackage) => boolean;
  intro: string[];
  sections: { heading: string; body: string[] }[];
  faqs: { q: string; a: string }[];
  /** Primary keyword first; kept for the SEO plan and the Ads build sheet. */
  keywords: string[];
};

const byDays = (min: number, max: number) => (p: UmrahPackage) => p.days >= min && p.days <= max;

export const categories: Category[] = [
  // ─── Departure city ────────────────────────────────────────────────────────
  // City terms aren't in the Keyword Planner export, but the SERP research found
  // them commercially valuable and weak in places (a Facebook page ranks #1 for
  // Islamabad). Each page carries city-specific logistics, never swapped names.
  {
    slug: "lahore",
    group: "city",
    h1: "Umrah Packages from Lahore",
    title: "Umrah Packages from Lahore 2026–27 — Prices from {from}",
    description:
      "Umrah packages from Lahore: visa, return flights from LHE, hotels and transport from {from} per person. Visit our Lahore office or book on WhatsApp.",
    eyebrow: "Lahore · LHE",
    image: "kaabaTowers",
    filter: () => true,
    intro: [
      "Our office is in Lahore, so this is home ground: come in to talk through packages, hand over documents and pay against a receipt, or do all of it on WhatsApp. Every package below departs from Allama Iqbal International Airport (LHE).",
      "Umrah packages from Lahore start from {from} per person ({basis} room), including the Umrah visa, return flights, hotels in Makkah and Madinah, and transport.",
    ],
    sections: [
      {
        heading: "Flying from Lahore",
        body: [
          "Lahore has direct flights to Jeddah and Madinah, around five hours in the air, plus one-stop options through the Gulf when direct fares are high. If your flight lands in Madinah, we reverse the itinerary so you visit Madinah first and put on ihram at Dhul Hulayfah on the way to Makkah.",
          "Wear or carry your ihram when you leave for Allama Iqbal Airport: the miqat is crossed in the air, and the crew announces it before landing in Jeddah.",
        ],
      },
      {
        heading: "Pilgrims from across Punjab",
        body: [
          "Families from Gujranwala, Sialkot, Faisalabad, Kasur and Sheikhupura often fly from Lahore. We can time your flight so you don't need a night in the city, and share the document checklist on WhatsApp so nothing is forgotten at home.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much is an Umrah package from Lahore?",
        a: "From {from} per person in a {basis} room, including visa, return flights from Lahore, hotels in Makkah and Madinah, and transport. 15 day 3-star packages are the most popular choice.",
      },
      {
        q: "Where is your office in Lahore?",
        a: "Our address, hours and map are on the contact page. You're welcome to visit, or book entirely on WhatsApp.",
      },
      {
        q: "Are there direct flights from Lahore to Jeddah?",
        a: "Yes, several airlines fly direct from Lahore to Jeddah, and some to Madinah. The package price includes whichever route we confirm on your ticket.",
      },
    ],
    keywords: ["umrah packages from lahore", "umrah packages lahore", "umrah travel agency lahore", "umrah agents in lahore"],
  },
  {
    slug: "karachi",
    group: "city",
    h1: "Umrah Packages from Karachi",
    title: "Umrah Packages from Karachi 2026–27 — Visa, Flights & Hotels",
    description:
      "Umrah packages from Karachi with visa, return flights from Jinnah International Airport, Makkah and Madinah hotels and transport. From {from} per person. Book on WhatsApp.",
    eyebrow: "Karachi · KHI",
    image: "kaabaCourtyard",
    filter: () => true,
    intro: [
      "Karachi has the shortest flights to Jeddah in Pakistan — about four hours — and often the lowest fares. Every package below can depart from Jinnah International Airport (KHI) and is booked entirely on WhatsApp: send documents from home, pay by bank transfer, and receive your visa, tickets and vouchers on your phone.",
      "Prices below are for Lahore departures and start from {from} per person ({basis} room). Karachi fares are usually lower, so the same package from Karachi typically costs about PKR 15,000–30,000 less — we quote the exact fare for your dates.",
    ],
    sections: [
      {
        heading: "Booking from Karachi without visiting an office",
        body: [
          "Send clear photos of each passport, CNIC and a white-background photo on WhatsApp. We check them, send a written invoice, and apply for the visa once you've paid into our business account. Everything you need to travel arrives on WhatsApp before your flight.",
        ],
      },
      {
        heading: "The new vaccination certificate at Karachi airport",
        body: [
          "From 25 September 2026, Umrah pilgrims flying from Karachi need a NADRA-linked vaccination certificate (meningitis and polio, plus influenza as currently reported), issued through the Pak ID app. Lahore, Islamabad and Peshawar are due to follow.",
          "Get vaccinated early — Saudi Arabia requires the meningitis vaccine at least 10 days before arrival — and keep the certificate with your passport. We check it with your other documents before you fly.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much is an Umrah package from Karachi?",
        a: "Our packages start from {from} per person in a {basis} room from Lahore, with visa, return flights, hotels and transport. From Karachi the same package is usually PKR 15,000–30,000 cheaper because the flight is shorter and fares are lower.",
      },
      {
        q: "Can I book from Karachi if your office is in Lahore?",
        a: "Yes. You never need to visit the office: documents, invoice, payment and travel papers all go through WhatsApp and bank transfer.",
      },
    ],
    keywords: ["umrah packages from karachi", "umrah packages karachi", "umrah travel agency karachi"],
  },
  {
    slug: "islamabad",
    group: "city",
    h1: "Umrah Packages from Islamabad",
    title: "Umrah Packages from Islamabad & Rawalpindi 2026–27 — from {from}",
    description:
      "Umrah packages from Islamabad and Rawalpindi with visa, return flights from Islamabad International Airport, hotels and transport. From {from} per person.",
    eyebrow: "Islamabad · ISB",
    image: "nabawiDome",
    filter: () => true,
    intro: [
      "For pilgrims in Islamabad, Rawalpindi and the north, every package below can depart from Islamabad International Airport (ISB), with direct and one-stop flights to Jeddah and Madinah of around five hours.",
      "Packages start from {from} per person ({basis} room) with the Umrah visa, return flights, hotels and transport included, and are booked on WhatsApp from anywhere in the twin cities, Azad Kashmir or Khyber Pakhtunkhwa.",
    ],
    sections: [
      {
        heading: "Twin cities and the north",
        body: [
          "Islamabad Airport serves families from Rawalpindi, Attock, Chakwal, Jhelum, Abbottabad and Azad Kashmir. We time flights to avoid late-night drives where possible, and send the whole booking on WhatsApp so nobody has to travel to Lahore.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much is an Umrah package from Islamabad?",
        a: "From {from} per person in a {basis} room including visa, return flights from Islamabad, hotels and transport. Islamabad fares can be slightly higher than Karachi's, so we quote your exact dates.",
      },
      {
        q: "Do you have an office in Islamabad?",
        a: "Our office is in Lahore, and we book pilgrims from Islamabad and Rawalpindi entirely on WhatsApp and phone, with payment by bank transfer against a written invoice.",
      },
    ],
    keywords: ["umrah packages from islamabad", "umrah packages islamabad", "umrah packages rawalpindi"],
  },

  // ─── Duration ──────────────────────────────────────────────────────────────
  {
    slug: "7-days",
    group: "duration",
    h1: "7 Days Umrah Package from Pakistan",
    title: "7 Days Umrah Package from Pakistan 2026–27 — Price from {from}",
    description:
      "One-week Umrah packages from Lahore, Karachi and Islamabad with visa, return flights, hotels and transport. From {from} per person. Compare hotels and walking distances.",
    eyebrow: "One week",
    image: "kaabaNight",
    filter: byDays(5, 8),
    intro: [
      "A 7 day Umrah package fits into a single week of leave: fly out, perform Umrah the day you arrive, spend a few nights in Makkah, then a couple in Madinah before flying home. It is the shortest package we recommend — anything shorter is mostly airport and road time.",
      "Our one-week packages start from {from} per person ({basis} room), with the Umrah visa, return flights, both hotels and all transfers included.",
    ],
    sections: [
      {
        heading: "Is 7 days enough for Umrah?",
        body: [
          "Yes, for the Umrah itself — the rites take three to five hours. What a week doesn't leave is slack: one day goes on the flight and Jeddah transfer, and the Makkah–Madinah journey takes most of another. Choose a 7 day package if leave is tight or you've performed Umrah before. For a first Umrah with parents or children, 10 or 15 days is far more comfortable.",
        ],
      },
      {
        heading: "How to get the most from a short trip",
        body: [
          "Pay a little more for a closer hotel. With only four or five nights in Makkah, every walk to the Haram counts — a 3-star hotel 500 metres away gives you more prayers in the mosque than an economy hotel on a shuttle route.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much is a 7 day Umrah package from Pakistan?",
        a: "Our 7 day packages start from {from} per person in a {basis} room, including visa, return flights, hotels in Makkah and Madinah, and transport. Double and triple rooms cost more per person; the exact price depends on your travel date and airline.",
      },
      {
        q: "Can I do Umrah in 5 days?",
        a: "It's possible, but we don't recommend it: after flights and the Makkah–Madinah transfer you'd have barely two full days. If you only have five days, ask us about a Makkah-only itinerary.",
      },
      {
        q: "How are the nights split on a one-week package?",
        a: "Usually four nights in Makkah and two in Madinah. We can switch to Madinah first if your flight lands in Madinah.",
      },
    ],
    keywords: [
      "7 days umrah package",
      "umrah package 7 days",
      "1 week umrah package",
      "one week umrah package",
      "umrah package for 7 days price",
      "short umrah packages",
      "5 day umrah packages",
    ],
  },
  {
    slug: "10-days",
    group: "duration",
    h1: "10 Days Umrah Package from Pakistan",
    title: "10 Days Umrah Package 2026–27 — Visa, Flights & Hotels from {from}",
    description:
      "10 day Umrah packages from Pakistan with visa, return flights, Makkah and Madinah hotels and transport. From {from} per person. See hotels, distances and prices.",
    eyebrow: "Ten days",
    image: "kaabaTowers",
    filter: byDays(9, 12),
    intro: [
      "Ten days is the sweet spot for pilgrims who can't take a full fortnight but don't want a rushed week: about six nights in Makkah and three in Madinah, enough for your Umrah, a ziyarat morning in each city and daily prayers in both Harams.",
      "10 day packages start from {from} per person ({basis} room), with visa, flights, hotels and transfers included.",
    ],
    sections: [
      {
        heading: "Who a 10 day package suits",
        body: [
          "Working professionals with ten days of leave, couples leaving children with family at home, and pilgrims who want a second Umrah from Masjid Aisha without extending to two weeks.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the price of a 10 day Umrah package?",
        a: "From {from} per person in a {basis} room with visa, return flights, hotels and transport. Prices rise in December and Ramadan, when flights and hotels are most expensive.",
      },
      {
        q: "Is 10 days better than 7 days for Umrah?",
        a: "For most first-timers, yes. The extra three nights turn a rushed trip into one with rest days, a ziyarat tour and more prayers in Masjid an-Nabawi.",
      },
    ],
    keywords: ["10 day umrah package", "umrah packages 10 days", "umrah 10 days package", "umrah package 10 days"],
  },
  {
    slug: "15-days",
    group: "duration",
    h1: "15 Days Umrah Package from Pakistan",
    title: "15 Days Umrah Package from Pakistan 2026–27 — Price from {from}",
    description:
      "Pakistan's most popular Umrah length: 15 day packages with visa, return flights, hotels near the Haram and transport. From {from} per person. Economy to 5-star.",
    eyebrow: "Most popular",
    image: "kaabaCourtyard",
    filter: byDays(13, 17),
    intro: [
      "Fifteen days is the Umrah package most Pakistani families book. It leaves time to settle in, perform your Umrah without rushing, spend proper time in both Harams, join the ziyarat tours and still rest — which matters when you're travelling with parents.",
      "We offer {count} fifteen-day packages, from economy to 5-star. Prices start from {from} per person ({basis} room), with the Umrah visa, return flights, hotels and transfers included.",
    ],
    sections: [
      {
        heading: "How the 15 days are spent",
        body: [
          "Most of the fortnight is in Makkah, with the rest in Madinah. You arrive in Jeddah and perform Umrah on day one, spend your Makkah nights at Masjid al-Haram with a ziyarat morning to Jabal al-Nour, Mina and Arafat, then travel to Madinah for Masjid an-Nabawi, Riaz ul Jannah and the Madinah ziyarat before flying home.",
        ],
      },
      {
        heading: "Choosing a hotel category",
        body: [
          "Economy hotels save the most but involve a long walk or shuttle. 3-star hotels are within walking distance and are what most families choose. 4-star and 5-star hotels are closer and quieter, and worth it if you're travelling with elderly parents who will walk to the Haram five times a day.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much does a 15 day Umrah package cost from Pakistan?",
        a: "Our 15 day packages start from {from} per person in a {basis} room, including the Umrah visa, return flights, hotels in Makkah and Madinah, and transport. 3-star, 4-star and 5-star packages cost more for closer hotels.",
      },
      {
        q: "Is 14 days the same as a 15 day package?",
        a: "Effectively, yes — a 15 day package is 14 nights. Tell us your exact dates and we'll quote the nights that match your flights.",
      },
      {
        q: "Does the 15 day package include ziyarat?",
        a: "Most do: one morning of Makkah ziyarat and one of Madinah ziyarat by coach. Each package page lists exactly what's included.",
      },
      {
        q: "Can the 15 days start in Madinah?",
        a: "Yes. If your flight lands in Madinah we reverse the itinerary, and you put on ihram at Dhul Hulayfah on the way to Makkah.",
      },
    ],
    keywords: [
      "15 day umrah package",
      "umrah 15 days package",
      "umrah package 15 days",
      "umrah packages 15 days",
      "umrah package 15 days price",
      "15 din ka umrah package",
      "14 days umrah package",
    ],
  },
  {
    slug: "21-days",
    group: "duration",
    h1: "21 Days Umrah Package from Pakistan",
    title: "21 Days Umrah Package 2026–27 — Price from {from} per Person",
    description:
      "Three-week Umrah packages from Pakistan with visa, return flights, hotels and transport. From {from} per person. More nights in Makkah, a gentler pace for elders.",
    eyebrow: "Three weeks",
    image: "nabawiUmbrellas",
    filter: byDays(18, 24),
    intro: [
      "A 21 day Umrah package gives you three unhurried weeks: time for several Umrahs, the full ziyarat in both cities, and rest days between. It's the length we suggest for elderly parents, who find a slower pace far easier on the walks and crowds.",
      "Three-week packages start from {from} per person ({basis} room), including visa, flights, hotels and transfers — often only a little more than 15 days, because the flight is the same and only hotel nights are added.",
    ],
    sections: [
      {
        heading: "Why 21 days can cost less per day",
        body: [
          "Flights and the visa are fixed costs. Once they're paid, each extra night is just the hotel, so a three-week trip costs much less per day than a one-week trip. Pilgrims who can take the time get noticeably better value.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the price of a 21 day Umrah package?",
        a: "From {from} per person in a {basis} room with visa, return flights, hotels and transport. The price depends on hotel category and travel month.",
      },
      {
        q: "Is there a 20 day Umrah package?",
        a: "Yes — we build packages from 18 to 24 days around your flight dates. The 21 day packages here are our standard three-week options.",
      },
    ],
    keywords: [
      "21 day umrah package",
      "21 days umrah package price",
      "umrah 21 days package",
      "umrah package for 21 days",
      "20 days umrah package",
    ],
  },
  {
    slug: "28-days",
    group: "duration",
    h1: "28 Days Umrah Package from Pakistan",
    title: "28 Days / 1 Month Umrah Package 2026–27 — from {from}",
    description:
      "Month-long Umrah packages from Pakistan: 28 days with visa, return flights, Makkah and Madinah hotels and transport. From {from} per person.",
    eyebrow: "A full month",
    image: "minaretPalm",
    filter: byDays(25, 35),
    intro: [
      "A 28 day Umrah package is a month in the two holy cities — the choice of retired parents, of pilgrims who want to spend long stretches in worship, and of families who can travel together only once.",
      "Month-long packages start from {from} per person ({basis} room), with visa, flights, hotels and transfers included. Long stays are usually booked in economy or 3-star hotels, which keeps the monthly cost sensible.",
    ],
    sections: [
      {
        heading: "Planning a month away",
        body: [
          "Check the visa's permitted stay against your dates before booking; we confirm both when we quote. Bring enough regular medication for the whole month plus a week's spare, with a copy of the prescription.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much is a one month Umrah package from Pakistan?",
        a: "Our 28 day packages start from {from} per person in a {basis} room, including visa, return flights, hotels and transport.",
      },
      {
        q: "Can I stay a month on an Umrah visa?",
        a: `Yes. The Umrah visa currently allows a stay of up to 90 days, but you must enter Saudi Arabia within 30 days of the visa being issued, your stay is tied to your booked package, and this season everyone must leave by ${season.umrahPause.finalDeparture}. We confirm the rules again when you book.`,
      },
    ],
    keywords: ["28 days umrah package", "umrah package 28 days price", "umrah packages 30 days", "1 month umrah package"],
  },

  // ─── Tier ──────────────────────────────────────────────────────────────────
  {
    slug: "economy",
    group: "tier",
    h1: "Cheap Umrah Packages from Pakistan",
    title: "Cheap Umrah Packages 2026–27 — Economy Umrah from {from}",
    description:
      "Budget and economy Umrah packages from Pakistan with visa, return flights, hotels and transport from {from} per person. Honest walking distances, no hidden charges.",
    eyebrow: "Economy",
    image: "kaabaWide",
    filter: (p) => p.tier === "economy",
    intro: [
      "Our economy Umrah packages are the lowest complete prices we can offer: the Umrah visa, return flights, hotels in Makkah and Madinah, and transport — from {from} per person in a {basis} room.",
      "The saving comes from hotel distance and room sharing, not from leaving things out. We state each hotel's real walking distance (or shuttle) in metres, so there are no surprises when you arrive.",
    ],
    sections: [
      {
        heading: "What 'economy' really means",
        body: [
          "Economy hotels are clean and simple, and in the market they range from about 1.1 km to 2.5 km from the Haram, usually with a free shuttle. Ours are 1.1–1.3 km with a shuttle, and rooms are shared by four to six people. Makkah is hilly, so a kilometre can mean 15–20 minutes each way on foot — fine for fit pilgrims, hard for elderly parents.",
          "One warning when comparing: some agents sell a 1.6 km shuttle hotel as \"5-star\". Always ask for the distance in metres, not the star rating.",
        ],
      },
      {
        heading: "Five ways to make Umrah cheaper",
        body: [
          "Travel outside December and Ramadan, when flights and hotels are at their most expensive. Share a room (quad or sharing). Book six to eight weeks ahead. Be flexible by a few days on dates. And choose longer stays — the flight and visa cost the same, so each extra night is cheap.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the cheapest Umrah package from Pakistan?",
        a: "Our cheapest complete package starts from {from} per person in a {basis} room, including visa, return flights, hotels and transport. Anyone quoting far below the going rate is usually leaving out flights, the visa or transport.",
      },
      {
        q: "Are economy hotels far from the Haram?",
        a: "Ours are 1.1–1.3 km from the Haram with a free shuttle; across the market, economy hotels range up to about 2.5 km. Every package page shows the distance so you can decide before you pay.",
      },
      {
        q: "Which is the cheapest month for Umrah?",
        a: "Usually the months after the season reopens following Hajj (roughly June to September) and early autumn. December and Ramadan are the most expensive, with airfares often 30–50% higher. Ask us for current fares — they change weekly.",
      },
    ],
    keywords: [
      "cheap umrah packages",
      "budget umrah packages",
      "affordable umrah packages",
      "low cost umrah package",
      "economy umrah package",
      "cheap umrah deals",
      "sasta umrah package",
    ],
  },
  {
    slug: "3-star",
    group: "tier",
    h1: "3 Star Umrah Packages from Pakistan",
    title: "3 Star Umrah Packages 2026–27 — Walking Distance from {from}",
    description:
      "3-star Umrah packages from Pakistan with hotels within walking distance of the Haram, plus visa, return flights and transport. From {from} per person.",
    eyebrow: "3-Star",
    image: "kaabaWide",
    filter: (p) => p.tier === "3-star",
    intro: [
      "3-star is the category most families choose: comfortable hotels within walking distance of Masjid al-Haram and Masjid an-Nabawi, at a price well below the towers on the Haram's edge.",
      "3-star packages start from {from} per person ({basis} room), including visa, return flights, hotels and transport.",
    ],
    sections: [
      {
        heading: "What to expect from a 3-star hotel",
        body: [
          "Private bathrooms, air conditioning, lifts and daily housekeeping, typically 450–700 metres from the Haram in Makkah and 200–350 metres in Madinah. Breakfast is included on some packages; each package page says which.",
        ],
      },
    ],
    faqs: [
      {
        q: "How far are 3-star hotels from the Haram?",
        a: "Usually 450–700 metres in Makkah (about 7–12 minutes on foot) and 200–350 metres in Madinah. Each package lists the hotel's distance.",
      },
      {
        q: "How much is a 3-star Umrah package?",
        a: "From {from} per person in a {basis} room with visa, flights, hotels and transport.",
      },
    ],
    keywords: ["3 star umrah packages", "3 star umrah package price", "umrah package 3 star hotel"],
  },
  {
    slug: "4-star",
    group: "tier",
    h1: "4 Star Umrah Packages from Pakistan",
    title: "4 Star Umrah Packages 2026–27 — Close to Haram, from {from}",
    description:
      "4-star Umrah packages from Pakistan: hotels 200–500 m from the Haram, breakfast, visa, return flights and transport. From {from} per person.",
    eyebrow: "4-Star",
    image: "nabawiDome",
    filter: (p) => p.tier === "4-star",
    intro: [
      "4-star Umrah packages put you a few minutes' walk from the Haram in quieter, better-kept hotels, usually with breakfast. They're the choice we suggest for elderly parents who want to pray in the mosque every time.",
      "4-star packages start from {from} per person ({basis} room), with visa, flights, hotels and transfers included.",
    ],
    sections: [],
    faqs: [
      {
        q: "Is a 4-star Umrah package worth it?",
        a: "If you're travelling with elders, usually yes. The shorter walk means more prayers in the Haram and less exhaustion — the difference is felt five times a day.",
      },
      {
        q: "How much is a 4-star Umrah package from Pakistan?",
        a: "From {from} per person in a {basis} room with visa, return flights, hotels and transport.",
      },
    ],
    keywords: ["4 star umrah packages", "4 star umrah package price"],
  },
  {
    slug: "5-star",
    group: "tier",
    h1: "5 Star & VIP Umrah Packages from Pakistan",
    title: "5 Star Umrah Packages 2026–27 — Luxury & VIP from {from}",
    description:
      "Luxury 5-star Umrah packages from Pakistan with hotels facing the Haram in Makkah and Madinah, visa, flights and private transfers. From {from} per person.",
    eyebrow: "5-Star · VIP",
    image: "clockTower",
    filter: (p) => p.tier === "5-star",
    intro: [
      "Our 5-star Umrah packages use hotels on the Haram's doorstep — the Abraj Al Bait (Clock Tower) and neighbouring towers in Makkah, and the front-row hotels around Masjid an-Nabawi — so you step from the lobby into the courtyard.",
      "5-star packages start from {from} per person ({basis} room), with visa, return flights, hotels and transfers included. Private car transfers and Haram-view rooms can be added.",
    ],
    sections: [
      {
        heading: "Haram-view rooms",
        body: [
          "A Kaaba or Haram view is a room upgrade, not a hotel category, and it is priced per night. Tell us if you want one — we'll quote it separately so you can see exactly what it adds.",
        ],
      },
    ],
    faqs: [
      {
        q: "Which hotels are in a 5-star Umrah package?",
        a: "Usually Clock Tower hotels such as Swissotel, Pullman ZamZam or Mövenpick Hajar Tower in Makkah, and front-row hotels near Masjid an-Nabawi in Madinah. The exact hotels are confirmed on your booking voucher.",
      },
      {
        q: "How much is a 5-star Umrah package from Pakistan?",
        a: "From {from} per person in a {basis} room, including visa, flights, hotels and transport. Double rooms and Haram-view rooms cost more.",
      },
    ],
    keywords: [
      "5 star umrah packages",
      "luxury umrah package",
      "vip umrah package",
      "premium umrah package",
      "deluxe umrah package",
      "clock tower umrah package",
    ],
  },

  // ─── Audience ──────────────────────────────────────────────────────────────
  {
    slug: "family",
    group: "audience",
    h1: "Family Umrah Packages from Pakistan",
    title: "Family Umrah Packages 2026–27 — Quad & Triple Rooms from {from}",
    description:
      "Umrah packages for families from Pakistan: quad and triple rooms, children's prices, wheelchair help and December holiday dates. From {from} per person.",
    eyebrow: "Families",
    image: "nabawiWide",
    filter: (p) => p.audiences?.includes("family") ?? false,
    intro: [
      "Family Umrah is different from travelling alone: you need rooms that keep the family together, hotels close enough for grandparents and children, and someone who answers the phone when a child is unwell at 2am.",
      "Our family packages use quad and triple rooms so a family of four shares one room. They start from {from} per person ({basis} room), with visa, flights, hotels and transport included.",
    ],
    sections: [
      {
        heading: "Travelling with children and elders",
        body: [
          "Children's prices depend on age and whether they need their own bed — ask us for a family quote. Wheelchairs can be hired at both Harams, and we'll suggest hotels on flatter routes for anyone who struggles with hills.",
          `The busiest family season is December — ${season.decemberHolidays}. Book by October for the best hotels.`,
        ],
      },
    ],
    faqs: [
      {
        q: "How much does Umrah cost for a family of four from Pakistan?",
        a: "Multiply the per-person quad price by four: our family packages start from {from} per person in a {basis} room. Infants and young children are usually cheaper — send us ages for an exact quote.",
      },
      {
        q: "Can women and children travel on the same package?",
        a: "Yes. We keep families in the same room or adjoining rooms and send the whole booking on one voucher.",
      },
    ],
    keywords: ["umrah family package", "family umrah packages", "umrah package for 4 persons", "umrah family"],
  },
  {
    slug: "couples",
    group: "audience",
    h1: "Umrah Packages for Couples from Pakistan",
    title: "Umrah Package for Couples 2026–27 — Double Room from {from}",
    description:
      "Umrah packages for husband and wife from Pakistan with a private double room, visa, return flights and transport. See the price for two.",
    eyebrow: "Couples",
    image: "nabawiLattice",
    filter: (p) => p.audiences?.includes("couples") ?? false,
    intro: [
      "An Umrah package for two, with a private double room in both Makkah and Madinah. Many couples choose this for their first Umrah together, or for parents celebrating a milestone.",
      "Couple packages are priced per person in a double room. Double the per-person price for the total cost for two.",
    ],
    sections: [],
    faqs: [
      {
        q: "What is the price of an Umrah package for 2 persons?",
        a: "Take the per-person double-room price on the package and multiply by two. For example, if a package shows a double-room price of PKR 400,000, the total for a couple is PKR 800,000.",
      },
      {
        q: "Can we get a private room on an economy package?",
        a: "Yes — ask for the double-room price. It costs more per person than quad sharing but gives you your own room.",
      },
    ],
    keywords: ["umrah package for couple", "couple umrah packages", "umrah package for 2 person", "umrah package for two persons"],
  },
  {
    slug: "group",
    group: "audience",
    h1: "Group Umrah Packages from Pakistan",
    title: "Group Umrah Packages 2026–27 — Fixed Departures from {from}",
    description:
      "Group Umrah packages from Pakistan with fixed departure dates, a group leader, visa, flights, hotels and transport. From {from} per person. Group discounts for 10+.",
    eyebrow: "Groups",
    image: "kaabaWide",
    filter: (p) => p.audiences?.includes("group") ?? false,
    intro: [
      "Group Umrah means travelling with others on fixed dates: flights, hotels, transfers and ziyarat are arranged for everyone together, and first-timers have experienced pilgrims around them.",
      "Group packages start from {from} per person ({basis} room). Organising for your masjid, family or office? Groups of 10 or more get a dedicated quote.",
    ],
    sections: [],
    faqs: [
      {
        q: "Do you arrange Umrah for mosque and family groups?",
        a: "Yes. Send us the number of people, preferred month and hotel category on WhatsApp and we'll quote the whole group, including a free place policy for larger groups if applicable.",
      },
    ],
    keywords: ["umrah group packages", "umrah group", "group umrah packages"],
  },

  // ─── Season ────────────────────────────────────────────────────────────────
  {
    slug: "december",
    group: "season",
    h1: "December Umrah Packages 2026 from Pakistan",
    title: "December Umrah Packages 2026 — Winter Holiday Umrah from {from}",
    description:
      "December 2026 Umrah packages from Pakistan for the winter school holidays, with visa, return flights, hotels and transport. From {from} per person. Book early.",
    eyebrow: "Winter holidays",
    image: "kaabaNight",
    filter: (p) => p.season === "december" || (p.audiences?.includes("family") ?? false),
    intro: [
      `December is Pakistan's busiest Umrah month for families — ${season.decemberHolidays}, and the weather in Makkah and Madinah is at its mildest.`,
      "That demand pushes flights and hotels up, so December packages are best booked by October. Our December-friendly packages start from {from} per person ({basis} room).",
    ],
    sections: [
      {
        heading: "Why December books up early",
        body: [
          "Every school-going family in Pakistan has the same two weeks free. Direct flights to Jeddah fill first, followed by hotels within walking distance. Book early and you get the hotel you want; book late and you get what's left, at a higher price.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much is a December Umrah package from Pakistan?",
        a: "From {from} per person in a {basis} room with visa, flights, hotels and transport. December fares are higher than October or November, so we confirm the price the day you book.",
      },
      {
        q: "When should I book December Umrah?",
        a: "By October if you can. Seats on direct flights and rooms close to the Haram go first.",
      },
    ],
    keywords: ["december umrah packages", "umrah december packages", "umrah packages december 2026", "winter umrah"],
  },
  {
    slug: "ramadan",
    group: "season",
    h1: "Ramadan Umrah Packages 2027 from Pakistan",
    title: "Ramadan Umrah Packages 2027 — Last 10 Days & Full Month",
    description: `Ramadan 2027 Umrah packages from Pakistan (expected ${season.ramadan.short}): last 10 days, i'tikaf and full-month options with visa, flights and hotels.`,
    eyebrow: "Ramadan 1448",
    image: "kaabaNight",
    filter: (p) => p.season === "ramadan",
    intro: [
      `Ramadan 2027 is expected from ${season.ramadan.startExpected} to ${season.ramadan.endExpected}, subject to the moon. Umrah in Ramadan carries a reward like that of Hajj, and the last ten nights — when Laylat al-Qadr is sought — are the most sought-after dates of the year.`,
      "Ramadan is also the most expensive and most heavily booked time for Umrah. Flights and hotels near the Haram sell out months ahead, so we open Ramadan bookings early. Packages start from {from} per person ({basis} room).",
    ],
    sections: [
      {
        heading: "Last 10 days or the full month?",
        body: [
          `The last ten days (from about ${season.ramadan.lastTenFromExpected}) are the peak: the Haram is at its fullest and prices are at their highest. A full-month package costs more in total but less per night, and lets you experience the whole month — including the calmer first ashra.`,
          `This season's Saudi deadlines are fixed: the last Umrah visa is issued on Eid ul Fitr (${season.umrahPause.lastVisa}), pilgrims must enter by ${season.umrahPause.lastEntry}, and everyone must leave by ${season.umrahPause.finalDeparture}. There is no "Umrah after Eid" window to fall back on, so book Ramadan early.`,
        ],
      },
    ],
    faqs: [
      {
        q: "When is Ramadan 2027?",
        a: `Ramadan 1448 is expected to begin around ${season.ramadan.startExpected} and end around ${season.ramadan.endExpected}, depending on the moon sighting in Saudi Arabia.`,
      },
      {
        q: "How much is a Ramadan Umrah package from Pakistan?",
        a: "Ramadan packages start from {from} per person in a {basis} room. Last-ten-days packages near the Haram cost the most; book early to lock in a price.",
      },
      {
        q: "When should I book Ramadan Umrah?",
        a: "Ideally by November or December. By January, the closest hotels and direct flights for the last ten days are usually gone.",
      },
    ],
    keywords: [
      "ramadan umrah packages",
      "ramzan umrah package",
      "umrah in ramadan",
      "ramadan umrah 2027",
      "last 10 days ramadan umrah package",
    ],
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export const CATEGORY_GROUP_LABEL: Record<CategoryGroup, string> = {
  city: "By departure city",
  duration: "By number of days",
  tier: "By hotel",
  audience: "Travelling as",
  season: "Season",
};
