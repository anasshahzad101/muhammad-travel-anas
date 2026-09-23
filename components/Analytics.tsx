"use client";

import Script from "next/script";
import { useEffect } from "react";
import { trackConversion, trackingIds } from "@/lib/track";

/**
 * Loads gtag only when GA4 or Google Ads IDs are configured, and turns every
 * WhatsApp or phone link on the site into a tracked conversion with a single
 * delegated listener - so buttons stay plain server-rendered <a> tags.
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

  if (!primaryId) return null;

  const configs = [trackingIds.ga4, trackingIds.ads].filter(Boolean).map((id) => `gtag('config', '${id}');`);

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${configs.join("\n")}`}
      </Script>
    </>
  );
}
