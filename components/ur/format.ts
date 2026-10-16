/**
 * Urdu formatting helpers for the /ur/ section. Dates derive from the ISO
 * twins in lib/season.ts, so an update there reaches the Urdu pages too.
 */

const UR_MONTHS = ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون", "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر"];

/** "2027-02-08" -> "8 فروری 2027" */
export function urDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${UR_MONTHS[m - 1]} ${y}`;
}

/** "2026-09-23" -> "ستمبر 2026" */
export function urMonthYear(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  return `${UR_MONTHS[m - 1]} ${y}`;
}

/** Urdu twin of site.contact.whatsappHours - keep in sync (the English one is a TODO there too). */
export const WHATSAPP_HOURS_UR = "واٹس ایپ پر جواب صبح 10 بجے سے رات 11 بجے تک، ہر دن";
