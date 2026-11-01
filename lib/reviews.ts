/**
 * Customer reviews, copied from the places customers actually left them.
 *
 * Why a data file: the site's rule is no fake reviews, and no rating anywhere
 * that isn't computed from real ones. Everything that shows reviews (the
 * /reviews/ page, the strips on the homepage and /about/, the rating on the
 * ApkaVisa badge, the Review schema, the lines in the llms files, the footer
 * link and the sitemap entry) reads this list, and all of it disappears when
 * the list is empty. So adding reviews = filling this list, nothing else.
 *
 * How to add a review:
 * - Copy it word for word from the listing (site.listings), with the star
 *   rating, the name as shown and the date. Don't shorten, polish or translate;
 *   if it's in Roman Urdu, keep it in Roman Urdu. Plain hyphens, never dashes.
 * - Copy every review on the listing, critical ones included: /reviews/ tells
 *   visitors that we publish all of them, as written.
 * - `id` is stable and URL-safe. It becomes the anchor on /reviews/
 *   (#review-<id>) and the schema @id, so don't change it later.
 *
 * Schema: Review nodes go out on /reviews/ only, each naming the directory
 * that collected it as publisher and linking to the listing. There is no
 * aggregateRating on the TravelAgency node, on purpose: Google treats a
 * business's rating on its own site as self-serving and doesn't show it, and
 * its guidelines ask for ratings collected on the site itself, not copied from
 * elsewhere. The rating is stated in plain text instead, which is what AI
 * assistants quote: on /reviews/, in the strips, in the badge and in /llms.txt.
 */

import { site } from "./site";

export type ReviewSource = keyof typeof site.listings;

export type Review = {
  /** Stable, URL-safe id, e.g. "apkavisa-2026-03-ahmed". Anchor on /reviews/ and schema @id. */
  id: string;
  /** The reviewer's name exactly as the listing shows it ("Ahmed R." if that's what it shows). */
  author: string;
  /** City, if the review or the listing says. */
  city?: string;
  /** Stars given, as on the listing. */
  rating: 1 | 2 | 3 | 4 | 5;
  /** Date posted, as on the listing, ISO (YYYY-MM-DD). */
  date: string;
  /** Optional one-line title, if the listing shows one. */
  title?: string;
  /** The review, word for word. */
  text: string;
  /** What they travelled on, if the review says, e.g. "15 days 3-star, December 2025". */
  travelled?: string;
  /** The directory the review was left on (a key of site.listings). */
  source: ReviewSource;
  /** Direct link to this review, if the directory gives one; otherwise the listing URL is used. */
  url?: string;
};

export const reviews: Review[] = [
  // https://apkavisa.pk/agency/muhammad-travels, copied 1 November 2026 in the
  // listing's own order (newest first; same-day reviews keep the listing's order).
  // All seven carry ApkaVisa's "Email confirmed" mark. Text is as written; the
  // only change is the site-wide dash rule (an em dash in one title became " - ").
  {
    id: "apkavisa-2026-10-31-asad",
    author: "Asad",
    city: "Lahore",
    rating: 5,
    date: "2026-10-31",
    title: "Excellent travel experience with Muhammad travels",
    text: "A team of professionals, I must say they are excellent with their service.",
    source: "apkaVisa",
  },
  {
    id: "apkavisa-2026-10-31-iftikhar-hassan",
    author: "Iftikhar Hassan",
    city: "Lahore",
    rating: 5,
    date: "2026-10-31",
    title: "Connection cancelled at Jeddah - they had us on another flight before we landed",
    text: "Our whole trip was exceptional but our return flight from Jeddah to Islamabad was cancelled while we were still in Madinah. Before we'd even reached the airport, Mr. saad from Muhammad Travels managed to rebook all 11 of us on a flight the same night, arranged a late checkout and a meal at the hotel, and sent the new tickets to the group. The only cost to us was a little patience. This is the difference between a cheap umra service and a premium one.",
    source: "apkaVisa",
  },
  {
    id: "apkavisa-2026-10-30-uzair-ahmad",
    author: "Uzair Ahmad",
    city: "Lahore - Bahria Town",
    rating: 5,
    date: "2026-10-30",
    title: "Best Experience with Muhammad Travels.",
    text: "I booked a package from Muhammad Travels. Everything was really smooth, contact numbers are 24/7 active overall great experience with Muhammad Travels.",
    source: "apkaVisa",
  },
  {
    id: "apkavisa-2026-10-30-jawad-bhutta",
    author: "Muhammad Jawad Bhutta",
    city: "Lahore",
    rating: 5,
    date: "2026-10-30",
    title: "Perfect.",
    text: "Booked Umrah package from them. Excellent experience and everything was delivered as committed.",
    source: "apkaVisa",
  },
  {
    id: "apkavisa-2026-10-30-muhammad-hasnan",
    author: "Muhammad hasnan",
    city: "Lahore",
    rating: 5,
    date: "2026-10-30",
    title: "Excellent",
    text: "Had a fantastic experience with Muhammad Travels! From booking to the overall arrangements, everything was handled smoothly and professionally. The staff was helpful, responsive, and cooperative throughout. Definitely a reliable choice for travel services. Highly recommended!",
    source: "apkaVisa",
  },
  {
    id: "apkavisa-2026-10-30-rana-aitzaaz-saeed",
    author: "Rana Aitzaaz Saeed",
    city: "Lahore",
    rating: 5,
    date: "2026-10-30",
    title: "Excellent Travel Experience with Muhammad Travels",
    text: "I booked a 5-star travel package from Muhammad Travels, and my overall experience was excellent. The team was professional and very cooperative. Highly recommended.",
    source: "apkaVisa",
  },
  {
    id: "apkavisa-2026-10-30-ahmad",
    author: "Ahmad",
    city: "Lahore",
    rating: 5,
    date: "2026-10-30",
    title: "Recommended",
    text: "They are very transparent and Fast. Recommended.",
    source: "apkaVisa",
  },
];

export function hasReviews(): boolean {
  return reviews.length > 0;
}

/** Newest first. */
export function sortedReviews(): Review[] {
  return [...reviews].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export type ReviewStats = {
  count: number;
  /** Mean rating to one decimal, e.g. 4.9. */
  average: number;
  /** The mean to one decimal, as the directory shows it: "4.9", "5.0". */
  averageText: string;
  /** How many reviews gave each number of stars, 5 down to 1. */
  breakdown: { stars: 5 | 4 | 3 | 2 | 1; count: number }[];
  /** ISO date of the newest review. */
  latestISO: string;
  /** The directories the reviews come from. */
  sources: ReviewSource[];
};

/**
 * Count, mean and breakdown, computed from the list (never typed anywhere).
 * Pass a source to get the figures for one directory only, e.g. for its badge.
 * Null when there is nothing to count.
 */
export function reviewStats(source?: ReviewSource): ReviewStats | null {
  const list = source ? reviews.filter((r) => r.source === source) : reviews;
  if (list.length === 0) return null;
  const sum = list.reduce((t, r) => t + r.rating, 0);
  const average = Math.round((sum / list.length) * 10) / 10;
  const stars = [5, 4, 3, 2, 1] as const;
  return {
    count: list.length,
    average,
    averageText: average.toFixed(1),
    breakdown: stars.map((s) => ({ stars: s, count: list.filter((r) => r.rating === s).length })),
    latestISO: [...list].sort((a, b) => (a.date < b.date ? 1 : -1))[0].date,
    sources: [...new Set(list.map((r) => r.source))],
  };
}

export function reviewSource(r: Review) {
  return site.listings[r.source];
}

/** Where to read the review where it was left: its own link if the directory gives one, otherwise the listing. */
export function reviewUrl(r: Review): string {
  return r.url ?? reviewSource(r).url;
}

/** "14 March 2026" */
export function reviewDate(r: Review): string {
  return new Date(`${r.date}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

/** The directories the reviews come from, by name: "ApkaVisa", or "ApkaVisa and Trustpilot". */
export function sourceNames(stats: ReviewStats | null = reviewStats()): string {
  const names = (stats?.sources ?? []).map((s) => site.listings[s].name);
  return names.join(", ").replace(/, ([^,]*)$/, " and $1");
}

/** "Rated 4.9 out of 5 by 12 pilgrims on ApkaVisa", or null when there are no reviews. */
export function ratingLine(): string | null {
  const s = reviewStats();
  if (!s) return null;
  return `Rated ${s.averageText} out of 5 by ${s.count} ${s.count === 1 ? "pilgrim" : "pilgrims"} on ${sourceNames(s)}`;
}
