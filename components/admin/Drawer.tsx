"use client";

import { useEffect, useRef } from "react";

/**
 * The side panel the lead and "Add lead" screens open in: full screen on a
 * phone, a 35rem column on the right elsewhere. Focus moves in once, Esc and
 * the backdrop close it, and the page behind stops scrolling. `onClose` is
 * kept in a ref so a re-render (a poll bringing new leads) never re-runs this
 * and steals focus from a field being typed in.
 */
export default function Drawer({ onClose, labelledBy, children }: { onClose: () => void; labelledBy: string; children: React.ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    // Unless a field inside already took focus (autoFocus), focus the panel itself.
    if (!panel.current?.contains(document.activeElement)) panel.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey);
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      html.style.overflow = prev;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 cursor-default bg-[rgb(3_11_9/0.45)] backdrop-blur-[2px]" />
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="panel-in relative flex h-full w-full flex-col overflow-y-auto bg-[#fffdf9] shadow-[-30px_0_60px_-30px_rgb(0_0_0/0.45)] outline-none sm:w-[35rem]"
      >
        {children}
      </div>
    </div>
  );
}
