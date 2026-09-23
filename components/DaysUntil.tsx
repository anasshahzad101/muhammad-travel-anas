"use client";

import { useSyncExternalStore } from "react";

/**
 * Whole days until a date (Pakistan time), counted in the browser. The server
 * renders nothing for the number, so static HTML never carries a stale count;
 * the surrounding copy always states the date itself.
 */
function daysUntil(iso: string): number {
  const target = new Date(`${iso}T00:00:00+05:00`).getTime();
  return Math.ceil((target - Date.now()) / 86_400_000);
}

const subscribe = (cb: () => void) => {
  const id = window.setInterval(cb, 60_000);
  return () => window.clearInterval(id);
};

export default function DaysUntil({ iso, className = "" }: { iso: string; className?: string }) {
  const days = useSyncExternalStore(
    subscribe,
    () => daysUntil(iso),
    () => null,
  );
  if (days === null || days <= 0) return null;
  return (
    <span className={`figure inline-flex items-baseline gap-1.5 ${className}`}>
      <span className="font-extrabold">{days}</span>
      <span className="text-[0.75em] font-semibold opacity-80">{days === 1 ? "day to go" : "days to go"}</span>
    </span>
  );
}
