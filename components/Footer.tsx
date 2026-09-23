import Link from "next/link";
import Logo from "./Logo";
import { ClockIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./Icons";
import StarPattern from "./StarPattern";
import { guideNav, legalNav, mainNav, packageNav } from "@/lib/nav";
import { activeLicences, fullAddress, operatorDisclosure, site, telLink, whatsappLink } from "@/lib/site";

export default function Footer() {
  const licences = activeLicences();
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark relative overflow-hidden bg-haram-950 text-sand-100">
      <StarPattern id="footer-lattice" className="text-gold-400 opacity-[0.07]" />
      <div className="container-x relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo onDark />
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-sand-200/85">
              Umrah packages from Pakistan with the visa, return flights, hotels and transport in one per-person
              price. Office in {site.contact.address.city}; we serve pilgrims across Pakistan on WhatsApp and phone.
            </p>
            <ul className="mt-6 space-y-3 text-[0.95rem]">
              <li className="flex gap-3">
                <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" />
                <span>{fullAddress() || `${site.contact.address.city}, Pakistan`}</span>
              </li>
              <li className="flex gap-3">
                <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" />
                <span>{site.contact.hoursSummary}</span>
              </li>
              <li>
                <a href={telLink()} className="flex gap-3 hover:text-white">
                  <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" />
                  <span>{site.contact.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink("Assalam o Alaikum, I'd like to ask about Umrah packages.")}
                  className="flex gap-3 hover:text-white"
                  rel="nofollow"
                >
                  <WhatsAppIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" />
                  <span>WhatsApp {site.contact.phoneDisplay}</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {packageNav.slice(1, 3).map((g) => (
              <div key={g.heading}>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-300">{g.heading}</p>
                <ul className="mt-4 space-y-2.5 text-[0.93rem]">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sand-200/85 hover:text-white">
                        {l.label} Umrah
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-300">Plan your Umrah</p>
              <ul className="mt-4 space-y-2.5 text-[0.93rem]">
                {[
                  ...packageNav[0].links.map((l) => ({ ...l, label: `Umrah from ${l.label}` })),
                  ...packageNav[3].links.map((l) => ({ ...l, label: `${l.label} Umrah` })),
                  ...packageNav[4].links.map((l) => ({ ...l, label: `${l.label} Umrah` })),
                  ...mainNav.slice(0, 2),
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sand-200/85 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-300">Guides & help</p>
              <ul className="mt-4 space-y-2.5 text-[0.93rem]">
                {[...guideNav, ...mainNav.slice(3), ...legalNav].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sand-200/85 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="hairline my-10" />

        <div className="flex flex-col gap-4 text-[0.82rem] leading-relaxed text-sand-200/70 md:flex-row md:justify-between">
          <div className="max-w-2xl space-y-2">
            {licences.length > 0 && (
              <p className="text-sand-100">
                {licences.map((l) => `${l.label}: ${l.value}`).join(" · ")}
              </p>
            )}
            {operatorDisclosure() && <p className="text-sand-100">{operatorDisclosure()}</p>}
            <p>
              {site.name} is a private travel agency. We are not affiliated with the Ministry of Hajj and Umrah of Saudi
              Arabia, Nusuk, or the Government of Pakistan. Visas are issued at the sole discretion of the Saudi
              authorities.
            </p>
          </div>
          <p className="shrink-0">© {year} {site.legalName ?? site.name}</p>
        </div>
      </div>
    </footer>
  );
}
