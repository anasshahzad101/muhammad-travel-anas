/**
 * Market reference figures (not our prices), from the September 2026 competitor
 * study: research/competitor-packages-summary.md §2, §4 and §6.
 *
 * Used where the site explains what things cost in general (the cost guide, the
 * tickets page). Every figure is a range across Pakistani agencies, shown with
 * the month it was checked. Refresh these with our own supplier fares as soon
 * as bookings start, then say "our fares" instead of "typical fares".
 */
export const market = {
  checked: "September 2026",

  /** Umrah visa incl. mandatory insurance, as sold by Pakistani agencies (visa-only). */
  visa: { min: 52000, max: 65000 },

  /** Return economy fares to Jeddah, per person, outside peak weeks. */
  airfare: [
    { city: "Karachi", code: "KHI", min: 95000, max: 180000 },
    { city: "Lahore", code: "LHE", min: 100000, max: 195000 },
    { city: "Islamabad", code: "ISB", min: 100000, max: 200000 },
  ],
  /** December holidays and Ramadan. */
  peakAirfareUplift: "30-50%",

  /** Karachi departures vs Lahore/Islamabad for the same package. */
  karachiSaving: { min: 15000, max: 30000 },

  /**
   * Land-only 14-15 day packages (visa + hotels + transport, no flights), per
   * person, mostly quad basis: [min, median, max].
   */
  landOnly15: {
    economy: [115000, 136000, 157000],
    "3-star": [126000, 145000, 430000],
    "4-star": [196000, 220000, 485000],
    "5-star": [266000, 432000, 625000],
  } as Record<string, [number, number, number]>,

  /** All-inclusive 14-15 day medians across the market, per person. */
  allIn15Median: { economy: 302000, "3-star": 382000, "5-star": 513000 },
} as const;

export const pkrRange = (min: number, max: number) =>
  `PKR ${min.toLocaleString("en-PK")}-${max.toLocaleString("en-PK")}`;
