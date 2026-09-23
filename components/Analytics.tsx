"use client";

import { useEffect } from "react";
import { trackConversion, trackingIds } from "@/lib/track";

/**
 * Turns every WhatsApp or phone link on the site into a tracked conversion
 * with a single delegated listener, so buttons stay plain server-rendered <a>
 * tags. The Google tag itself is in the <head> (see GoogleTag in layout.tsx).
 */
export default function Analytics() {
  const primaryId = trackingIds.ga4 || trackingIds.ads;

  useEffect(() => {
    if (!primaryId) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const page = window.location.pathname;
      if (href.startsWith("https://wa.me/")) trackConversion("whatsapp", { page });
      else if (href.startsWith("tel:")) trackConversion("call", { page });
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
  const configs = [trackingIds.ga4, trackingIds.ads]
    .filter(Boolean)
    .map((id) => `gtag('config', '${id}');`)
    .join("\n");
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\n${configs}`,
        }}
      />
    </>
  );
}
