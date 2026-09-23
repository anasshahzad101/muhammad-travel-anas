import Link from "next/link";
import Logo from "./Logo";
import { ChevronDownIcon, PhoneIcon, WhatsAppIcon } from "./Icons";
import MobileMenu from "./MobileMenu";
import { mainNav, packageNav } from "@/lib/nav";
import { site, telLink, whatsappLink } from "@/lib/site";

/**
 * Server-rendered header. The desktop mega-menu opens on hover/focus with CSS
 * only, and the mobile menu is a <details> element, so every link exists in the
 * HTML without JavaScript — crawlers and slow phones both see the full nav.
 * (The mobile menu is a tiny client component only so it can close on navigation.)
 */
export default function Header() {
  const wa = whatsappLink("Assalam o Alaikum, I'd like to ask about Umrah packages.");

  return (
    // Solid background, no backdrop-filter: a backdrop-filter would become the
    // containing block for the fixed-position mobile menu and collapse it.
    <header className="sticky top-0 z-40 border-b border-sand-300/70 bg-sand-50">
      <div className="container-x relative flex h-[4.25rem] items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-0.5 self-stretch lg:flex">
          {/* The group spans the full header height so hover carries into the menu below. */}
          <div className="group flex h-full items-center">
            <Link
              href="/umrah-packages/"
              className="flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-[0.94rem] font-semibold text-ink-800 hover:bg-sand-100 hover:text-ink-950"
            >
              Umrah Packages
              <ChevronDownIcon className="h-4 w-4 text-gold-600 transition group-hover:rotate-180 group-focus-within:rotate-180" />
            </Link>
            <div className="invisible absolute left-1/2 top-full w-[54rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 pt-2 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="card grid grid-cols-5 gap-6 p-6">
                {packageNav.map((g) => (
                  <div key={g.heading}>
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-gold-700">{g.heading}</p>
                    <ul className="mt-3 space-y-1.5">
                      {g.links.map((l) => (
                        <li key={l.href}>
                          <Link href={l.href} className="text-[0.92rem] text-ink-800 hover:text-haram-700 hover:underline">
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="col-span-5 flex items-center justify-between border-t border-sand-200 pt-4">
                  <p className="text-sm text-ink-600">Every price is per person in PKR, with visa, flights and hotels included.</p>
                  <Link href="/umrah-packages/" className="text-sm font-bold text-haram-800 hover:underline">
                    Compare all packages →
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {mainNav.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap rounded-full px-3 py-2 text-[0.94rem] font-semibold text-ink-800 hover:bg-sand-100 hover:text-ink-950"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={telLink()} className="btn btn-ghost hidden !min-h-[2.6rem] !px-4 whitespace-nowrap 2xl:inline-flex">
            <PhoneIcon className="h-4 w-4" />
            {site.contact.phoneDisplay}
          </a>
          <a href={wa} className="btn btn-wa hidden !min-h-[2.6rem] !px-4 sm:inline-flex" rel="nofollow">
            <WhatsAppIcon className="h-[1.1rem] w-[1.1rem]" />
            WhatsApp
          </a>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
