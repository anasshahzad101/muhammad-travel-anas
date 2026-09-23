import Link from "next/link";
import Logo from "./Logo";
import { ArrowRightIcon, ClockIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./Icons";
import StarPattern from "./StarPattern";
import { guideNav, legalNav, mainNav, packageNav } from "@/lib/nav";
import { season } from "@/lib/season";
import { fullAddress, site, telLink, whatsappLink } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  const wa = whatsappLink("Assalam o Alaikum, I'd like to ask about Umrah packages.");

  return (
    <footer className="section-night grain on-dark relative overflow-hidden">
      <StarPattern id="footer-lattice" className="text-gold-300 opacity-[0.045]" />
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-gold-400/10 blur-3xl" />

      <div className="container-x relative">
        {/* Closing statement */}
        <div className="grid gap-10 border-b border-gold-400/20 py-16 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:py-20">
          <div className="reveal">
            <p className="arabic text-left text-[1.7rem] leading-[1.5] text-gold-300" lang="ar">
              لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ
            </p>
            <p className="h-display mt-3 max-w-3xl text-[2.6rem] text-sand-50 sm:text-6xl lg:text-[4.4rem]">
              {site.tagline.split(",")[0]},{" "}
              <span className="text-foil italic">{site.tagline.split(",").slice(1).join(",").trim()}.</span>
            </p>
          </div>
          <div className="reveal space-y-3 lg:justify-self-end lg:text-right" style={{ "--i": 1 } as React.CSSProperties}>
            <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.2em] text-gold-300">Prices checked {season.pricesChecked}</p>
            <Link href="/umrah-packages/" className="link-arrow font-display text-[1.6rem] font-medium">
              Compare every package <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="grid gap-12 py-14 lg:grid-cols-[1.25fr_2fr]">
          <div>
            <Logo onDark />
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-sand-200/80">
              Umrah packages from Pakistan with the visa, return flights, hotels and transport in one per-person
              price. Office in {site.contact.address.city}; we serve pilgrims across Pakistan on WhatsApp and phone.
            </p>
            <ul className="mt-7 space-y-3.5 text-[0.93rem]">
              <li className="flex gap-3">
                <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" />
                <span>{fullAddress() || `${site.contact.address.city}, Pakistan`}</span>
              </li>
              <li className="flex gap-3">
                <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" />
                <span>{site.contact.hoursSummary}</span>
              </li>
              <li>
                <a href={telLink()} className="flex gap-3 transition hover:text-white">
                  <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" />
                  <span className="figure">{site.contact.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a href={wa} className="flex gap-3 transition hover:text-white" rel="nofollow">
                  <WhatsAppIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" />
                  <span>
                    WhatsApp <span className="figure">{site.contact.phoneDisplay}</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {packageNav.slice(1, 3).map((g) => (
              <div key={g.heading}>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-gold-300">{g.heading}</p>
                <ul className="mt-5 space-y-3 text-[0.92rem]">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sand-200/80 transition hover:text-white">
                        {l.label} Umrah
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-gold-300">Plan your Umrah</p>
              <ul className="mt-5 space-y-3 text-[0.92rem]">
                {[
                  ...packageNav[0].links.map((l) => ({ ...l, label: `Umrah from ${l.label}` })),
                  ...packageNav[3].links.map((l) => ({ ...l, label: `${l.label} Umrah` })),
                  ...packageNav[4].links.map((l) => ({ ...l, label: `${l.label} Umrah` })),
                  ...mainNav.slice(0, 2),
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sand-200/80 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-gold-300">Guides & help</p>
              <ul className="mt-5 space-y-3 text-[0.92rem]">
                {[...guideNav, ...mainNav.slice(3), ...legalNav].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sand-200/80 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="hairline" />

        <div className="flex flex-col gap-5 py-10 text-[0.8rem] leading-relaxed text-sand-200/60 md:flex-row md:justify-between">
          <div className="max-w-2xl space-y-2">
            <p>
              {site.name} is a private travel agency. We are not affiliated with the Ministry of Hajj and Umrah of Saudi
              Arabia, Nusuk, or the Government of Pakistan. Visas are issued at the sole discretion of the Saudi
              authorities.
            </p>
          </div>
          <p className="shrink-0 md:text-right">
            © {year} {site.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
