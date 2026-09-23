"use client";

import { useSyncExternalStore } from "react";

/**
 * Live local time in Makkah and today's date in the Umm al-Qura calendar (the
 * official Saudi Hijri calendar, computed by the browser's Intl engine).
 *
 * The server snapshot is empty, so the static HTML carries no stale time and
 * hydration always matches; the real value fills in on the first client render.
 */

const timeFmt = () =>
  new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Riyadh", hour: "numeric", minute: "2-digit", hour12: true });
const hijriFmt = () =>
  new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", { timeZone: "Asia/Riyadh", day: "numeric", month: "long", year: "numeric" });

function snapshot(): string {
  const now = new Date();
  const time = timeFmt().format(now).toLowerCase().replace(" ", " ");
  const parts = hijriFmt().formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const hijri = `${get("day")} ${get("month")} ${get("year")} AH`;
  return `${time}|${hijri}`;
}

function subscribe(cb: () => void) {
  const id = window.setInterval(cb, 15_000);
  return () => window.clearInterval(id);
}

export default function MakkahClock({ className = "", showHijri = true }: { className?: string; showHijri?: boolean }) {
  const value = useSyncExternalStore(subscribe, snapshot, () => "");
  const [time, hijri] = value ? value.split("|") : ["", ""];

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inset-0 rounded-full bg-wa-400 animate-pulse-dot" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-wa-400" />
      </span>
      <span>
        Makkah{" "}
        <span className="figure font-semibold text-sand-50" suppressHydrationWarning>
          {time || " "}
        </span>
      </span>
      {showHijri && hijri && (
        <>
          <span aria-hidden className="text-gold-500/60">
            ·
          </span>
          <span>{hijri}</span>
        </>
      )}
    </span>
  );
}
