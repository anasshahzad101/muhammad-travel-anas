"use client";

import { useEffect } from "react";

/**
 * One delegated pointer listener for the whole site: any element with the
 * `.spotlight` class gets --mx / --my set to the cursor position, which its
 * ::before glow reads (see globals.css). Mouse only; renders nothing.
 */
export default function Spotlight() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    let last: { el: HTMLElement; x: number; y: number } | null = null;

    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.<HTMLElement>(".spotlight");
      if (!el) return;
      const r = el.getBoundingClientRect();
      last = { el, x: e.clientX - r.left, y: e.clientY - r.top };
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          if (!last) return;
          last.el.style.setProperty("--mx", `${last.x}px`);
          last.el.style.setProperty("--my", `${last.y}px`);
        });
      }
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
