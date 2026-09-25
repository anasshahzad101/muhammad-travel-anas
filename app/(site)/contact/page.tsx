import EnquiryForm from "@/components/EnquiryForm";
import { ClockIcon, PhoneIcon, PinIcon, ShieldIcon, WhatsAppIcon } from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import MakkahClock from "@/components/MakkahClock";
import PageHero from "@/components/PageHero";
import { pageMetadata } from "@/lib/metadata";
import { webPageSchema } from "@/lib/schema";
import { fullAddress, site, telLink, whatsappLink } from "@/lib/site";

const description =
  "Call, WhatsApp or visit Muhammad Travels in Lahore for Umrah packages, visas and tickets. We serve pilgrims across Pakistan.";

export const metadata = pageMetadata({
  title: "Contact Muhammad Travels - Umrah Office in Lahore",
  absoluteTitle: true,
  description,
  path: "/contact/",
  image: "nabawiDome",
});

export default function ContactPage() {
  const address = fullAddress();
  const mapQuery = encodeURIComponent(`${site.name}, ${address || site.contact.address.city}`);
  const rows = [
    {
      icon: WhatsAppIcon,
      label: "WhatsApp",
      value: site.contact.phoneDisplay,
      href: whatsappLink("Assalam o Alaikum, I'd like to ask about Umrah packages."),
      note: site.contact.whatsappHours,
      accent: true,
    },
    { icon: PhoneIcon, label: "Phone", value: site.contact.phoneDisplay, href: telLink(), note: site.contact.hoursSummary, accent: false },
    {
      icon: PinIcon,
      label: "Office",
      value: address || `${site.contact.address.city}, Pakistan`,
      href: site.contact.googleMapsUrl ?? undefined,
      note: "Walk-ins welcome during office hours",
      accent: false,
    },
    { icon: ClockIcon, label: "Hours", value: site.contact.hoursSummary, note: "Closed on public holidays", accent: false },
  ];

  return (
    <>
      <JsonLd
        data={webPageSchema({ path: "/contact/", title: "Contact Muhammad Travels", description, dateModified: "2026-09-23", type: "ContactPage", image: "nabawiDome" })}
      />
      <PageHero
        crumbs={[{ name: "Contact", path: "/contact/" }]}
        eyebrow="We reply on WhatsApp"
        title="Contact us"
        accent="us"
        lead={
          <p>
            The fastest way to reach us is WhatsApp. Send your dates, city and number of pilgrims and we&apos;ll reply with options and prices.
            You&apos;re also welcome at our {site.contact.address.city} office.
          </p>
        }
        compact
      >
        <p className="text-sm text-sand-200/75">
          <MakkahClock />
        </p>
      </PageHero>

      <section className="container-x grid gap-12 py-20 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {rows.map((r, i) => {
              const inner = (
                <>
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${r.accent ? "bg-wa-500 text-wa-950" : "bg-night-900 text-gold-300"}`}
                  >
                    <r.icon className="h-5 w-5" />
                  </span>
                  <span className="mt-4 block text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-gold-700">{r.label}</span>
                  <span className="figure mt-1 block text-[1.15rem] font-bold text-ink-950">{r.value}</span>
                  <span className="mt-1 block text-sm text-ink-500">{r.note}</span>
                </>
              );
              return (
                <li key={r.label} className="reveal" style={{ "--i": i % 2 } as React.CSSProperties}>
                  {r.href ? (
                    <a href={r.href} className="card card-hover spotlight block h-full p-6" rel={r.label === "WhatsApp" ? "nofollow" : undefined}>
                      {inner}
                    </a>
                  ) : (
                    <div className="card block h-full p-6">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="reveal mt-6 flex gap-4 rounded-[var(--radius-card)] border border-haram-600/20 bg-haram-50 p-6 text-[0.95rem] leading-relaxed text-haram-900">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-haram-700 text-sand-50">
              <ShieldIcon className="h-5 w-5" />
            </span>
            <p>
              <strong>Paying safely:</strong> we only accept payment into the bank account in our business name printed on your invoice. If anyone asks you
              to pay a personal account in our name, don&apos;t - call us on the number above.
            </p>
          </div>

          {/* Only with a real street address: a search for the name alone could pin a different business. */}
          {site.contact.address.street && (
            <div className="mt-6 overflow-hidden rounded-[var(--radius-card)] border border-sand-300">
              <iframe
                title={`Map to ${site.name}`}
                src={`https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`}
                className="h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>

        <EnquiryForm whatsapp={site.contact.whatsapp} heading="Send us your Umrah plan" />
      </section>
    </>
  );
}
