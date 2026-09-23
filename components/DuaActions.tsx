"use client";

import { useState } from "react";
import { WhatsAppIcon } from "./Icons";

/**
 * Copy a dua, or send it on WhatsApp: families forward duas to each other
 * before someone leaves for Umrah. The share link opens WhatsApp's own
 * contact picker; nothing is sent anywhere by this site.
 */
export default function DuaActions({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (insecure context, permissions); the text stays selectable on the page.
    }
  }

  return (
    <span className="flex items-center gap-2">
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-sand-300 bg-[#fffdf9] px-4 text-[0.8rem] font-bold text-ink-800 transition hover:border-gold-500 sm:pointer-fine:min-h-9 sm:pointer-fine:px-3.5"
        aria-live="polite"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
          {copied ? <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" /> : <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>}
        </svg>
        {copied ? "Copied" : "Copy"}
      </button>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(text)}`}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-wa-500 px-4 text-[0.8rem] font-bold text-wa-950 transition hover:bg-wa-400 sm:pointer-fine:min-h-9 sm:pointer-fine:px-3.5"
        rel="nofollow noopener"
        target="_blank"
      >
        <WhatsAppIcon className="h-3.5 w-3.5" />
        Send
      </a>
    </span>
  );
}
