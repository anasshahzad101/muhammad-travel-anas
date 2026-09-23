"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { MenuIcon, XIcon } from "./Icons";
import { mainNav, packageNav } from "@/lib/nav";

/**
 * Mobile menu. Still a <details> element (works before hydration and every link
 * is in the server HTML), but the App Router keeps the header mounted across
 * navigations, so the menu would stay open over the next page. Close it whenever
 * the path changes.
 */
export default function MobileMenu() {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  return (
    <details ref={ref} className="group/menu lg:hidden">
      <summary
        className="flex h-11 w-11 items-center justify-center rounded-full border border-sand-300 bg-white/70 text-ink-900"
        aria-label="Open menu"
      >
        <MenuIcon className="h-5 w-5 group-open/menu:hidden" />
        <XIcon className="hidden h-5 w-5 group-open/menu:block" />
      </summary>
      {/* Anchored to the header's bottom edge (not the viewport top), so a banner above
          the header can never push the panel over the close button. */}
      <div className="absolute inset-x-0 top-full h-[calc(100dvh-4.25rem)] overflow-y-auto border-t border-sand-300 bg-sand-50 px-4 pb-28 pt-5">
        <Link href="/umrah-packages/" className="block font-display text-2xl text-ink-950">
          All Umrah packages
        </Link>
        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6">
          {packageNav.map((g) => (
            <div key={g.heading}>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-gold-700">{g.heading}</p>
              <ul className="mt-2 space-y-2">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[0.98rem] text-ink-800">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="hairline my-6" />
        <ul className="space-y-3">
          {mainNav.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="font-display text-xl text-ink-950">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
