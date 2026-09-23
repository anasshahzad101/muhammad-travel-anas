/**
 * Season dates for the 1448H umrah season, in one place.
 *
 * Source: research/regulations-and-facts.md §2 (MoHU 1448H season calendar,
 * published 2026-05-17, plus moon-sighting forecasts). Islamic dates depend on
 * the moon and Pakistan often runs a day behind Saudi Arabia, so every Islamic
 * date is shown to users as "expected". Pages read these values; never hardcode
 * a Ramadan or Hajj date in copy.
 *
 * Each date has an ISO twin for anything computed (countdowns, the season
 * timeline). Keep the pairs in step when the calendar changes.
 */
export const season = {
  hijriYear: "1448",
  label: "2026-27",
  /**
   * Shown next to every price. Answer engines quote dated PKR prices and keep
   * repeating stale ones, so update this whenever package-data.ts prices are
   * re-checked (aim for monthly).
   */
  pricesChecked: "September 2026",
  pricesCheckedISO: "2026-09-23",
  ramadan: {
    startISO: "2027-02-08",
    endISO: "2027-03-09",
    startExpected: "8 February 2027",
    endExpected: "9 March 2027",
    lastTenFromExpected: "27 February 2027",
    short: "8 Feb - 9 Mar 2027",
  },
  eidUlFitrExpected: "9-10 March 2027",
  hajj: {
    arafahExpected: "15 May 2027",
  },
  /** MoHU 1448H calendar: fixed Saudi deadlines for this umrah season. */
  umrahPause: {
    summary: "New Umrah visas stop on Eid ul Fitr and the season closes before Hajj",
    lastVisa: "9 March 2027",
    lastVisaISO: "2027-03-09",
    lastEntry: "23 March 2027",
    lastEntryISO: "2027-03-23",
    finalDeparture: "7 April 2027",
    finalDepartureISO: "2027-04-07",
    nextSeasonExpected: "around 20 May 2027",
    nextSeasonISO: "2027-05-20",
    lastEntryExpected: "the last Umrah visa is issued around 9 March 2027 and pilgrims must enter Saudi Arabia by 23 March",
  },
  decemberHolidays:
    "Pakistan's winter school holidays (Sindh: 21-31 December; Punjab and KP usually from about 22 December)",
  decemberHolidaysISO: { start: "2026-12-21", end: "2026-12-31" },
} as const;
