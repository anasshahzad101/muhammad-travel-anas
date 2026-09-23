/**
 * Conversion tracking for GA4 + Google Ads.
 *
 * Nothing loads unless the IDs are set, so the site works (and stays fast) before
 * the ad accounts exist. Set in the host's environment:
 *
 *   NEXT_PUBLIC_GA4_ID            G-XXXXXXXXXX
 *   NEXT_PUBLIC_GADS_ID           AW-XXXXXXXXX
 *   NEXT_PUBLIC_GADS_WHATSAPP     conversion label for "WhatsApp click"
 *   NEXT_PUBLIC_GADS_CALL         conversion label for "Phone call click"
 *   NEXT_PUBLIC_GADS_LEAD         conversion label for "Enquiry form sent"
 *
 * WhatsApp is where this market converts, so a WhatsApp click is a primary
 * conversion. Each prefilled message carries the page it came from, so the team
 * can attribute bookings back to a package page (and therefore an ad group).
 */

export const trackingIds = {
  ga4: process.env.NEXT_PUBLIC_GA4_ID || "",
  ads: process.env.NEXT_PUBLIC_GADS_ID || "",
  labels: {
    whatsapp: process.env.NEXT_PUBLIC_GADS_WHATSAPP || "",
    call: process.env.NEXT_PUBLIC_GADS_CALL || "",
    lead: process.env.NEXT_PUBLIC_GADS_LEAD || "",
  },
};

export type ConversionKind = keyof typeof trackingIds.labels;

type Gtag = (...args: unknown[]) => void;

export function trackConversion(kind: ConversionKind, params: Record<string, string | number> = {}): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (!gtag) return;
  const ga4Event = kind === "whatsapp" ? "whatsapp_click" : kind === "call" ? "phone_call_click" : "generate_lead";
  gtag("event", ga4Event, params);
  const label = trackingIds.labels[kind];
  if (trackingIds.ads && label) {
    gtag("event", "conversion", { send_to: `${trackingIds.ads}/${label}`, ...params });
  }
}
