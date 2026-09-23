"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ArrowRightIcon, PhoneIcon, WhatsAppIcon } from "./Icons";
import MakkahClock from "./MakkahClock";
import { mainNav, packageNav } from "@/lib/nav";

/**
 * Full-screen mobile menu. Still a <details> element, so it works before
 * hydration and every link is in the server HTML. The App Router keeps the
 * header mounted across navigations, so the menu closes whenever the path
 * changes, and on Escape. The panel is pinned just below the header, wherever
 * the header happens to be when it opens (a preview banner can sit above it).
 */
export default function MobileMenu({ whatsappHref, telHref, phone }: { whatsappHref: string; telHref: string; phone: string }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && ref.current?.open) ref.current.open = false;
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function onToggle() {
    const d = ref.current;
    if (!d?.open) return;
    const bottom = d.closest("header")?.getBoundingClientRect().bottom ?? 72;
    d.style.setProperty("--menu-top", `${Math.max(0, Math.round(bottom))}px`);
  }

  let i = 0;
  const item = () => ({ style: { "--d": i++ } as React.CSSProperties, className: "mm-item" });

  return (
    <details ref={ref} className="mobile-menu group/menu lg:hidden" onToggle={onToggle}>
      <summary
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-sand-50 transition hover:border-gold-300/60"
        aria-label="Menu"
      >
        <span aria-hidden className="relative block h-3 w-5">
          <span className="absolute left-0 top-0 h-[1.5px] w-5 rounded bg-current transition duration-300 group-open/menu:top-[5px] group-open/menu:rotate-45" />
          <span className="absolute bottom-0 left-0 h-[1.5px] w-3.5 rounded bg-current transition-all duration-300 group-open/menu:bottom-[5px] group-open/menu:w-5 group-open/menu:-rotate-45" />
        </span>
      </summary>

      <div className="fixed inset-x-0 bottom-0 top-[var(--menu-top,4.5rem)] z-40 overflow-y-auto overscroll-contain bg-night-900 bg-[radial-gradient(90%_60%_at_100%_0%,rgb(212_171_90/0.14),transparent_60%)] px-5 pb-32 pt-6">
        <nav aria-label="Mobile">
          <div {...item()}>
            <Link href="/umrah-packages/" className="flex items-center justify-between border-b border-white/10 pb-5 font-display text-[2rem] font-medium text-sand-50">
              All Umrah packages
              <ArrowRightIcon className="h-6 w-6 text-gold-300" />
            </Link>
          </div>

          <div className="mt-6 space-y-6">
            {packageNav.map((g) => (
              <div key={g.heading} {...item()}>
                <p className="text-[0.66rem] font-bold uppercase tracking-[0.2em] text-gold-300">{g.heading}</p>
                <ul className="mt-2.5 flex flex-wrap gap-2">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="inline-flex min-h-[2.6rem] items-center rounded-full border border-white/12 bg-white/[0.04] px-4 text-[0.92rem] text-sand-100">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <ul className="mt-8 border-t border-white/10">
            {mainNav.map((l) => (
              <li key={l.href} {...item()}>
                <Link href={l.href} className="flex items-center justify-between border-b border-white/10 py-4 font-display text-[1.6rem] text-sand-50">
                  {l.label}
                  <ArrowRightIcon className="h-5 w-5 text-gold-300/80" />
                </Link>
              </li>
            ))}
          </ul>

          <div {...item()}>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <a href={whatsappHref} className="btn btn-wa" rel="nofollow">
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp
              </a>
              <a href={telHref} className="btn border border-white/20 text-sand-50">
                <PhoneIcon className="h-4 w-4" />
                Call
              </a>
            </div>
            <p className="figure mt-3 text-center text-sm text-sand-200/70">{phone}</p>
            <p className="mt-6 text-center text-[0.78rem] text-sand-200/70">
              <MakkahClock />
            </p>
          </div>
        </nav>
      </div>
    </details>
  );
}
