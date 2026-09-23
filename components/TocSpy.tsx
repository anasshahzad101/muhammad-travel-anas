"use client";

import { useEffect, useState } from "react";

export type TocItem = { id: string; label: string };

/**
 * "On this page" navigation that follows the reader. The current section is
 * the last heading that has passed a line 30% down the viewport, so it stays
 * right whether you scroll down or back up. The thread on the left fills in
 * gold up to where you are.
 *
 * Server-rendered with the first item active, so the links work without
 * JavaScript.
 */
export default function TocSpy({ toc }: { toc: TocItem[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = toc.map((t) => document.getElementById(t.id));
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      let idx = 0;
      els.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= line) idx = i;
      });
      setActive(idx);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [toc]);

  return (
    <nav aria-label="On this page">
      <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-gold-700">On this page</p>
      <ol className="mt-4 text-[0.9rem]">
        {toc.map((t, i) => {
          const on = i === active;
          const passed = i < active;
          return (
            <li key={t.id} className={`relative border-l transition-colors duration-500 ${passed || on ? "border-gold-500" : "border-sand-300"}`}>
              <a
                href={`#${t.id}`}
                aria-current={on ? "location" : undefined}
                className={`flex min-h-9 items-center py-1.5 pl-5 leading-snug transition duration-300 pointer-coarse:min-h-11 ${
                  on ? "font-semibold text-ink-950" : passed ? "text-ink-700 hover:text-ink-950" : "text-ink-500 hover:text-ink-900"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute -left-[4.5px] top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 transition duration-500 ${
                    on ? "scale-125 bg-gold-500 shadow-[0_0_0_3px_rgb(230_199_127/0.45)]" : passed ? "bg-gold-500" : "border border-sand-400 bg-sand-50"
                  }`}
                />
                {t.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
