"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Trustpilot?: { loadFromElement: (el: HTMLElement, forceReload?: boolean) => void };
  }
}

/**
 * Renders Trustpilot's Review Collector TrustBox ("Review us on Trustpilot").
 * The bootstrap script loads lazily (lazyOnload) so it never delays the page;
 * loadFromElement runs both on script load and on mount, so the widget also
 * appears after client-side navigation when the script is already loaded.
 */
export default function TrustpilotReviewCollector() {
  const ref = useRef<HTMLDivElement>(null);

  const load = () => {
    if (window.Trustpilot && ref.current) window.Trustpilot.loadFromElement(ref.current, true);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <Script
        src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        strategy="lazyOnload"
        onLoad={load}
      />
      <div
        ref={ref}
        className="trustpilot-widget"
        data-locale="en-US"
        data-template-id="56278e9abfbbba0bdcd568bc"
        data-businessunit-id="6ae32d2d4716e8a5ad9f49fd"
        data-style-height="52px"
        data-style-width="100%"
      >
        <a href="https://www.trustpilot.com/review/muhammadtravels.com" target="_blank" rel="noopener">
          Trustpilot
        </a>
      </div>
    </>
  );
}
