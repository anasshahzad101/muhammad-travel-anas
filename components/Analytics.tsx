"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { leadEvent, recordPageView } from "@/lib/leads/client";
import { trackConversion, trackingIds } from "@/lib/track";

/** The visitor's own words from a prefilled wa.me link, without the salam, for the lead timeline. */
function waMessage(href: string): string {
  try {
    const text = new URL(href).searchParams.get("text") ?? "";
    const lines = text.split("\n");
    if (/^assalam/i.test(lines[0] ?? "")) lines.shift();
    const body = lines.join(" ").replace(/\s+/g, " ").trim();
    return body.length > 140 ? `${body.slice(0, 139)}...` : body;
  } catch {
    return "";
  }
}

/**
 * Turns every WhatsApp or phone link on the site into a tracked conversion
 * with a single delegated listener, so buttons stay plain server-rendered <a>
 * tags. The Google tag itself is in the <head> (see GoogleTag in layout.tsx).
 *
 * It also feeds lead tracking: each page is added to the visit's trail, and a
 * WhatsApp or call tap is noted on the visitor's lead if they have one (links
 * marked data-lead report their own send instead).
 */
export default function Analytics() {
  const primaryId = trackingIds.ga4 || trackingIds.ads;
  const pathname = usePathname();

  useEffect(() => {
    recordPageView(pathname);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const page = window.location.pathname;
      const wa = href.startsWith("https://wa.me/");
      const call = href.startsWith("tel:");
      if (!wa && !call) return;
      if (primaryId) trackConversion(wa ? "whatsapp" : "call", { page });
      if (a.hasAttribute("data-lead")) return;
      if (wa) {
        const said = waMessage(href);
        leadEvent("whatsapp", said ? `Tapped WhatsApp: "${said}"` : "Tapped WhatsApp");
      } else leadEvent("call", "Tapped to call");
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [primaryId]);

  return null;
}

/**
 * The Google tag (gtag.js), server-rendered at the top of <head> exactly as
 * Google's install instructions ask, so it is in the HTML of every page.
 */
export function GoogleTag() {
  const primaryId = trackingIds.ga4 || trackingIds.ads;
  if (!primaryId) return null;
  // allow_enhanced_conversions lets the Ads tag send the hashed phone number that trackConversion() sets.
  // No remarketing: religious topics are a sensitive category for personalised ads, so the Ads tag
  // measures conversions only and collects nothing for audience lists.
  const configs = [
    trackingIds.ga4 && `gtag('config', '${trackingIds.ga4}');`,
    trackingIds.ads &&
      `gtag('config', '${trackingIds.ads}', { allow_enhanced_conversions: true, allow_ad_personalization_signals: false });`,
  ]
    .filter(Boolean)
    .join("\n");
  // The leads dashboard shares the root layout; staff opening it all day are not visitors.
  const guarded = `if (location.pathname.indexOf('/admin') !== 0) {\n${configs}\n}`;
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\n${guarded}`,
        }}
      />
    </>
  );
}
