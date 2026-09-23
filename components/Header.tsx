import Image from "next/image";
import Link from "next/link";
import Logo from "./Logo";
import MakkahClock from "./MakkahClock";
import { ArrowRightIcon, ChevronDownIcon, PhoneIcon, WhatsAppIcon } from "./Icons";
import MobileMenu from "./MobileMenu";
import { images } from "@/lib/images";
import { mainNav, packageNav } from "@/lib/nav";
import { fromPrice, getPackage } from "@/lib/packages";
import { season } from "@/lib/season";
import { formatPKR, site, telLink, whatsappLink } from "@/lib/site";

/**
 * Server-rendered header. The desktop mega-menu opens on hover/focus with CSS
 * only, and the mobile menu is a <details> element, so every link exists in the
 * HTML without JavaScript: crawlers and slow phones both see the full nav.
 *
 * The frosted background lives on its own layer, not on <header>: a
 * backdrop-filter on an ancestor would become the containing block for the
 * fixed-position mobile menu panel and collapse it.
 */
export default function Header() {
  const wa = whatsappLink("Assalam o Alaikum, I'd like to ask about Umrah packages.");
  const popular = getPackage("15-days-3-star");
  const popularPrice = popular ? fromPrice(popular) : null;

  return (
    <>
      {/* Utility bar: scrolls away, the header below stays. */}
      <div className="relative z-50 hidden border-b border-white/[0.06] bg-night-950 text-[0.74rem] text-sand-200/75 md:block">
        <div className="container-x flex h-9 items-center justify-between gap-6">
          <MakkahClock />
          <div className="flex items-center gap-4">
            <span className="hidden lg:inline">Prices checked {season.pricesChecked}</span>
            <span aria-hidden className="hidden text-gold-500/50 lg:inline">
              ·
            </span>
            <span className="hidden xl:inline">{site.contact.whatsappHours}</span>
            <span aria-hidden className="hidden text-gold-500/50 xl:inline">
              ·
            </span>
            <a href={telLink()} className="figure inline-flex items-center gap-1.5 font-semibold text-sand-50 transition hover:text-gold-300">
              <PhoneIcon className="h-3.5 w-3.5 text-gold-300" />
              {site.contact.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <header className="on-dark sticky top-0 z-50">
        <div aria-hidden className="header-scroll absolute inset-0 -z-10 border-b border-gold-400/20 bg-night-900/90 backdrop-blur-xl" />
        <div className="container-x relative flex h-[var(--header-h)] items-center justify-between gap-4">
          <Logo onDark />

          <nav aria-label="Main" className="hidden items-center gap-1 self-stretch lg:flex">
            {/* The group spans the full header height so hover carries into the menu below. */}
            <div className="group/mega flex h-full items-center">
              <Link
                href="/umrah-packages/"
                className="flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[0.92rem] font-semibold text-sand-100/90 transition hover:bg-white/[0.06] hover:text-white"
              >
                Umrah Packages
                <ChevronDownIcon className="h-4 w-4 text-gold-300 transition duration-300 group-hover/mega:rotate-180 group-focus-within/mega:rotate-180" />
              </Link>
              <div className="invisible absolute left-1/2 top-full w-[66rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition duration-300 ease-out-expo group-hover/mega:visible group-hover/mega:translate-y-0 group-hover/mega:opacity-100 group-focus-within/mega:visible group-focus-within/mega:translate-y-0 group-focus-within/mega:opacity-100">
                <div className="grid grid-cols-[16rem_1fr] overflow-hidden rounded-[26px] border border-white/10 bg-night-900/95 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] backdrop-blur-2xl">
                  {popular && popularPrice && (
                    <Link href={`/umrah-packages/${popular.slug}/`} className="group/feat relative flex min-h-[19rem] flex-col justify-end overflow-hidden p-6">
                      <Image
                        src={images.nabawiLattice.src}
                        alt=""
                        fill
                        sizes="256px"
                        className="object-cover transition duration-700 ease-out-expo group-hover/feat:scale-105"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/60 to-transparent" />
                      <span className="relative">
                        <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gold-300">Most popular</span>
                        <span className="mt-1 block font-display text-2xl font-semibold text-sand-50">{popular.shortName}</span>
                        <span className="figure mt-1 block text-sm text-sand-200">
                          from <span className="font-bold text-gold-200">{formatPKR(popularPrice.amount)}</span>
                        </span>
                      </span>
                    </Link>
                  )}
                  <div className="flex flex-col">
                    <div className="grid flex-1 grid-cols-5 gap-6 p-7">
                      {packageNav.map((g) => (
                        <div key={g.heading}>
                          <p className="text-[0.66rem] font-bold uppercase tracking-[0.18em] text-gold-300">{g.heading}</p>
                          <ul className="mt-3.5 space-y-2">
                            {g.links.map((l) => (
                              <li key={l.href}>
                                <Link href={l.href} className="text-[0.9rem] text-sand-100/85 transition hover:text-white">
                                  {l.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between gap-4 border-t border-white/10 px-7 py-4">
                      <p className="text-[0.82rem] text-sand-200/70">Every price is per person in PKR, with visa, flights and hotels included.</p>
                      <Link href="/umrah-packages/" className="link-arrow text-sm">
                        Compare all packages <ArrowRightIcon className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {mainNav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="whitespace-nowrap rounded-full px-3.5 py-2 text-[0.92rem] font-semibold text-sand-100/90 transition hover:bg-white/[0.06] hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Icon only between 1024 and 1280px, where the full menu leaves no room for the label */}
            <a href={wa} className="btn btn-wa hidden !min-h-[2.65rem] !px-4 text-[0.88rem] sm:inline-flex lg:max-xl:!px-3" rel="nofollow">
              <WhatsAppIcon className="h-[1.1rem] w-[1.1rem]" />
              <span className="lg:max-xl:sr-only">WhatsApp</span>
            </a>
            <MobileMenu whatsappHref={wa} telHref={telLink()} phone={site.contact.phoneDisplay} />
          </div>
        </div>
      </header>
    </>
  );
}
