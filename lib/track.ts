import { toE164 } from "./phone";
import { markContacted } from "./visit";

export { toE164 };

/**
 * Conversion tracking for GA4 + Google Ads.
 *
 * The GA4 property (G-5R1S5N9NS5) and the Google Ads account "Muhammad
 * Travels" (880-159-2445, tag AW-18470567632) are built in, so the tags work on
 * any host without setting environment variables. Each can still be
 * overridden from the host's environment:
 *
 *   NEXT_PUBLIC_GA4_ID            the GA4 property
 *   NEXT_PUBLIC_GADS_ID           the Google Ads tag (AW-…)
 *   NEXT_PUBLIC_GADS_WHATSAPP     conversion label for "WhatsApp click"
 *   NEXT_PUBLIC_GADS_CALL         conversion label for "Phone call click"
 *   NEXT_PUBLIC_GADS_LEAD         conversion label for "Enquiry form sent"
 *
 * These are all *secondary* conversions in Google Ads: a tap on WhatsApp is not
 * a lead, because many people tap and never send. Bidding runs on "Qualified
 * lead", which the team confirms in the lead sheet and Google Ads imports
 * through Data Manager (plan/google-ads-plan.md §3). To match those imported
 * leads to ad clicks, the enquiry form and the lead popup pass the phone number
 * the visitor typed to the Google tag (enhanced conversions for leads). The tag
 * hashes it before anything leaves the browser.
 */

export const trackingIds = {
  ga4: process.env.NEXT_PUBLIC_GA4_ID || "G-5R1S5N9NS5",
  ads: process.env.NEXT_PUBLIC_GADS_ID || "AW-18470567632",
  labels: {
    whatsapp: process.env.NEXT_PUBLIC_GADS_WHATSAPP || "kuZrCK2h1oIdEND9uedE",
    call: process.env.NEXT_PUBLIC_GADS_CALL || "p-DQCLCh1oIdEND9uedE",
    lead: process.env.NEXT_PUBLIC_GADS_LEAD || "v3QvCKqh1oIdEND9uedE",
  },
};

export type ConversionKind = keyof typeof trackingIds.labels;

type Gtag = (...args: unknown[]) => void;

export function trackConversion(
  kind: ConversionKind,
  params: Record<string, string | number> = {},
  user: { phone?: string } = {},
): void {
  if (typeof window === "undefined") return;
  // Whatever happens with tracking, the visitor is now in touch: nothing should pop up and ask again.
  markContacted();
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (!gtag) return;
  const ga4Event = kind === "whatsapp" ? "whatsapp_click" : kind === "call" ? "phone_call_click" : "generate_lead";
  const label = trackingIds.labels[kind];
  const phone = user.phone ? toE164(user.phone) : "";
  // Only for Google Ads measurement, so only when Google Ads is configured; set before the event it belongs to.
  if (trackingIds.ads && phone) gtag("set", "user_data", { phone_number: phone });
  gtag("event", ga4Event, params);
  if (trackingIds.ads && label) {
    gtag("event", "conversion", { send_to: `${trackingIds.ads}/${label}`, ...params });
  }
}
