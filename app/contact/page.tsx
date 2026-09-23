import Breadcrumbs from "@/components/Breadcrumbs";
import EnquiryForm from "@/components/EnquiryForm";
import { ClockIcon, PhoneIcon, PinIcon, ShieldIcon, WhatsAppIcon } from "@/components/Icons";
import { pageMetadata } from "@/lib/metadata";
import { fullAddress, site, telLink, whatsappLink } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact Muhammad Travels — Umrah Office in Lahore",
  absoluteTitle: true,
  description:
    "Call, WhatsApp or visit Muhammad Travels in Lahore for Umrah packages, visas and tickets. We serve pilgrims across Pakistan.",
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
    },
    { icon: PhoneIcon, label: "Phone", value: site.contact.phoneDisplay, href: telLink(), note: site.contact.hoursSummary },
    {
      icon: PinIcon,
      label: "Office",
      value: address || `${site.contact.address.city}, Pakistan`,
      href: site.contact.googleMapsUrl ?? undefined,
      note: "Walk-ins welcome during office hours",
    },
    { icon: ClockIcon, label: "Hours", value: site.contact.hoursSummary, note: "Closed on public holidays" },
  ];

  return (
    <>
      <section className="border-b border-sand-200 bg-sand-100/60">
        <div className="container-x py-10 lg:py-14">
          <Breadcrumbs items={[{ name: "Contact", path: "/contact/" }]} />
          <h1 className="mt-6 text-[2.4rem] leading-[1.06] sm:text-5xl">Contact us</h1>
          <p className="mt-4 max-w-2xl text-[1.06rem] leading-relaxed text-ink-700">
            The fastest way to reach us is WhatsApp. Send your dates, city and number of pilgrims and we&apos;ll reply
            with options and prices. You&apos;re also welcome at our {site.contact.address.city} office.
          </p>
        </div>
      </section>

      <section className="container-x grid gap-10 py-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <ul className="space-y-4">
            {rows.map((r) => {
              const inner = (
                <>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-haram-50 text-haram-800">
                    <r.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[0.72rem] font-bold uppercase tracking-wider text-ink-500">{r.label}</span>
                    <span className="block text-[1.05rem] font-semibold text-ink-950">{r.value}</span>
                    <span className="block text-sm text-ink-500">{r.note}</span>
                  </span>
                </>
              );
              return (
                <li key={r.label}>
                  {r.href ? (
                    <a href={r.href} className="flex gap-4 rounded-2xl border border-sand-300 bg-white/70 p-4 hover:border-haram-600" rel={r.label === "WhatsApp" ? "nofollow" : undefined}>
                      {inner}
                    </a>
                  ) : (
                    <div className="flex gap-4 rounded-2xl border border-sand-300 bg-white/70 p-4">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex gap-3 rounded-2xl bg-haram-50 p-5 text-[0.93rem] text-haram-900">
            <ShieldIcon className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              <strong>Paying safely:</strong> we only accept payment into the bank account in our business name printed
              on your invoice. If anyone asks you to pay a personal account in our name, don&apos;t — call us on the number
              above.
            </p>
          </div>

          {address && (
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
