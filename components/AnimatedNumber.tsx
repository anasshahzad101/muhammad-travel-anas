"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Rolls a figure from its previous value to the new one (easeOutQuart, 700ms).
 * The first render is the real value, so server HTML and hydration match and
 * crawlers read the actual price; only later changes animate.
 */
export default function AnimatedNumber({ value, prefix = "", className = "" }: { value: number; prefix?: string; className?: string }) {
  const [shown, setShown] = useState(value);
  const current = useRef(value);

  useEffect(() => {
    const from = current.current;
    if (from === value) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      current.current = value;
      setShown(value);
      return;
    }
    const start = performance.now();
    const dur = 700;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - k, 4);
      const v = Math.round(from + (value - from) * e);
      current.current = v;
      setShown(v);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <span className={`figure ${className}`}>
      {prefix}
      {shown.toLocaleString("en-PK")}
    </span>
  );
}
