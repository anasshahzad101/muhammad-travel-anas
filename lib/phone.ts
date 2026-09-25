/**
 * Phone numbers as people type them in Pakistan. Shared by the browser (Google
 * Ads enhanced conversions, form checks) and the server (the leads dashboard).
 */

/**
 * A phone number as people type it in Pakistan ("0304 1458319", "3041458319",
 * "92 304 1458319", "+92-304-1458319", "0092…", landlines like "042 35761234")
 * in E.164 ("+923041458319"), the only format Google accepts. Numbers already
 * written with a + or 00 pass through. Anything else returns "" and is not sent.
 */
export function toE164(raw: string): string {
  const typed = raw.trim();
  const digits = typed.replace(/\D/g, "");
  let e164 = "";
  if (typed.startsWith("+")) e164 = `+${digits}`;
  else if (digits.startsWith("00")) e164 = `+${digits.slice(2)}`;
  // Mobiles are always 03xx + 7 digits; landlines are 10-11 digits with their area code.
  else if (/^(03\d{9}|0[124-9]\d{8,9})$/.test(digits)) e164 = `+92${digits.slice(1)}`;
  else if (/^92(3\d{9}|[124-9]\d{8,9})$/.test(digits)) e164 = `+${digits}`;
  else if (/^3\d{9}$/.test(digits)) e164 = `+92${digits}`;
  return /^\+[1-9]\d{9,14}$/.test(e164) ? e164 : "";
}

/** "+923041458319" as a Pakistani would write it ("0304 1458319"); foreign numbers stay international. */
export function formatPhone(e164: string): string {
  const m = e164.match(/^\+92(3\d{2})(\d{7})$/);
  if (m) return `0${m[1]} ${m[2]}`;
  if (e164.startsWith("+92")) return `0${e164.slice(3)}`;
  return e164;
}
