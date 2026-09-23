import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import EnquiryForm from "@/components/EnquiryForm";
import Faq from "@/components/Faq";
import { InfoIcon } from "@/components/Icons";
import { market, pkrRange } from "@/lib/market";
import { pageMetadata } from "@/lib/metadata";
import { season } from "@/lib/season";
import { site } from "@/lib/site";

/**
 * Informational visa page (organic only).
 *
 * Google's Government documents & services policy (tightened 5 Oct 2026) limits
 * visa advertising to government-authorised providers, so this page is NOT an
 * ad landing page and never presents a standalone visa as our product headline.
 * The disclaimer below must stay at the top of the page.
 */

const path = "/umrah-visa/";

export const metadata = pageMetadata({
  title: `Umrah Visa Price for Pakistanis ${season.label} — Fees, Rules & Documents`,
  description: `Umrah visa fee for Pakistanis: SAR 300 government fee with insurance, why agents charge ${pkrRange(market.visa.min, market.visa.max)}, and ${season.hijriYear}H rules and documents.`,
  path,
  image: "nabawiDome",
});

const sources = [
  { label: "Ministry of Hajj and Umrah — FAQ (visa fee, women without mahram)", href: "https://haj.gov.sa/en/FAQ" },
  {
    label: "Ministry of Hajj and Umrah — 1448H Umrah season calendar (17 May 2026)",
    href: "https://haj.gov.sa/en/Media-Center/Ministry-News/2026/Ministry-of-Hajj-and-Umrah-Announces-the-Umrah-Season-Calendar-for-1448-AH",
  },
  {
    label: "Dawn — NADRA-linked vaccination certificate mandatory for Umrah (12 Sep 2026)",
    href: "https://www.dawn.com/news/2029401/nadra-linked-vaccination-certificate-mandatory-for-hajj-umrah-pilgrims-from-sept-14",
  },
  {
    label: "The Nation — New Umrah rules for Pakistani operators (15 Jul 2026)",
    href: "https://www.nation.com.pk/15-Jul-2026/government-enforces-new-umrah-rules-enhance-transparency-pilgrim-protection",
  },
  {
    label: "Gulf News — No Umrah visa without approved hotel booking on Nusuk Masar",
    href: "https://gulfnews.com/world/gulf/saudi/no-umrah-visa-without-approved-hotel-booking-on-nusuk-masar-1.500163540",
  },
];

export default function UmrahVisaPage() {
  const faqs = [
    {
      q: "What is the Umrah visa fee for Pakistanis?",
      a: `The Saudi government fee is SAR 300 (about PKR 22,300), and the mandatory health insurance is included. Because every Umrah visa must now be issued together with Nusuk-registered hotel and transport bookings, Pakistani agencies typically charge ${pkrRange(market.visa.min, market.visa.max)} for a visa (checked ${market.checked}).`,
    },
    {
      q: "Can I apply for an Umrah visa myself on Nusuk?",
      a: "Pakistani passport holders generally can't buy Umrah services directly on Nusuk. The visa is issued through an operator approved by Pakistan's Ministry of Religious Affairs working with a licensed Saudi Umrah company.",
    },
    {
      q: "How long is the Umrah visa valid?",
      a: `You must enter Saudi Arabia within 30 days of the visa being issued, or it is cancelled. Once there, you may stay up to 90 days, limited by your booked package and this season's final departure date of ${season.umrahPause.finalDeparture}.`,
    },
    {
      q: "How long does the Umrah visa take?",
      a: "Usually a few working days once documents, bookings and payment are complete. Because the 30-day entry window starts when the visa is issued, flights are booked first and the visa applied for close to departure.",
    },
    {
      q: "When do Umrah visas stop for Hajj 2027?",
      a: `The last Umrah visa of the ${season.hijriYear}H season is issued on ${season.umrahPause.lastVisa} (Eid ul Fitr), the last entry is ${season.umrahPause.lastEntry}, and all pilgrims must leave by ${season.umrahPause.finalDeparture}. The next season is expected to open ${season.umrahPause.nextSeasonExpected}.`,
    },
    {
      q: "Can a woman get an Umrah visa without a mahram?",
      a: "Yes. The Saudi Ministry of Hajj and Umrah allows women to perform Umrah without a mahram.",
    },
  ];

  return (
    <>
      <section className="border-b border-sand-200 bg-sand-100/60">
        <div className="container-x py-10 lg:py-14">
          <Breadcrumbs items={[{ name: "Umrah Visa", path }]} />
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <p className="eyebrow">Updated {season.pricesChecked}</p>
              <h1 className="mt-3 text-[2.3rem] leading-[1.08] sm:text-5xl">Umrah Visa Price for Pakistanis ({season.label})</h1>
              <p className="mt-5 max-w-2xl text-[1.06rem] leading-relaxed text-ink-700">
                <strong className="text-ink-950">
                  The Saudi government fee for an Umrah visa is SAR 300 (about PKR 22,300), with mandatory health
                  insurance included.
                </strong>{" "}
                Agencies in Pakistan typically charge {pkrRange(market.visa.min, market.visa.max)}, because since June 2025
                every Umrah visa must be issued with Nusuk-registered hotel and transport bookings. All our{" "}
                <Link href="/umrah-packages/" className="font-semibold text-haram-800 underline">
                  Umrah packages
                </Link>{" "}
                include the visa.
              </p>
            </div>
            <aside className="flex gap-3 self-start rounded-2xl border border-gold-400/60 bg-gold-200/40 p-5 text-[0.92rem] text-ink-800">
              <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" />
              <p>
                <strong>Not a government website.</strong> {site.name} is a private travel agency. We are not affiliated
                with the Saudi Ministry of Hajj and Umrah, Nusuk, or the Government of Pakistan. Visas are issued at the
                sole discretion of the Saudi authorities, and our service charges are separate from government fees.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <div className="container-x grid gap-12 py-12 lg:grid-cols-[1.5fr_1fr]">
        <article className="prose-mt min-w-0">
          <h2 id="fees">What the Umrah visa costs</h2>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Cost</th>
                <th>Who sets it</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Umrah visa fee, including mandatory health insurance</td>
                <td>SAR 300 (≈ PKR 22,300)</td>
                <td>Saudi Ministry of Hajj and Umrah</td>
              </tr>
              <tr>
                <td>Hotel and transport bookings registered on Nusuk Masar</td>
                <td>Depends on hotels and nights</td>
                <td>Required for every Umrah visa since June 2025</td>
              </tr>
              <tr>
                <td>Operator service and processing</td>
                <td>Varies by agency</td>
                <td>MoRA-approved operator</td>
              </tr>
              <tr>
                <td>
                  <strong>Typical &ldquo;visa&rdquo; price from Pakistani agencies</strong>
                </td>
                <td>
                  <strong>{pkrRange(market.visa.min, market.visa.max)}</strong>
                </td>
                <td>Market range, {market.checked}</td>
              </tr>
            </tbody>
          </table>
          <p>
            That is why a &ldquo;visa-only&rdquo; offer is rarely just the visa: it has to include registered hotel and
            transport bookings. If you already have flights, ask us for a visa with hotels and transport; otherwise a full{" "}
            <Link href="/umrah-packages/">Umrah package</Link> is usually better value.
          </p>

          <h2 id="rules">Umrah visa rules for the {season.hijriYear}H season</h2>
          <ul>
            <li>
              <strong>Enter within 30 days</strong> of the visa being issued, or it is cancelled automatically.
            </li>
            <li>
              <strong>Stay up to 90 days</strong>, limited by your booked package and the season&apos;s final departure
              date.
            </li>
            <li>
              <strong>Season deadlines:</strong> last visa issued {season.umrahPause.lastVisa}, last entry{" "}
              {season.umrahPause.lastEntry}, final departure {season.umrahPause.finalDeparture}. The next season is
              expected to open {season.umrahPause.nextSeasonExpected}.
            </li>
            <li>
              <strong>Through an approved operator:</strong> since July 2026, only umrah companies verified by
              Pakistan&apos;s Ministry of Religious Affairs may serve pilgrims. Check any agent against MoRA&apos;s
              approved list, pay only into the company&apos;s bank account, and keep your receipt and written agreement.
            </li>
            <li>
              <strong>Women</strong> may perform Umrah without a mahram.
            </li>
            <li>
              <strong>A one-year multiple-entry Umrah visa</strong> was announced in July 2026 (90 days&apos; total stay,
              each visit booked through Nusuk). Its fee and eligibility for Pakistanis have not been published yet.
            </li>
          </ul>

          <h2 id="documents">Documents you need</h2>
          <ul>
            <li>Passport valid for at least six months, with a clear scan or photo of the data page</li>
            <li>CNIC (B-form or child registration certificate for children)</li>
            <li>Recent photograph with a white background</li>
            <li>
              <strong>NADRA-linked vaccination certificate</strong> — mandatory for Umrah departures from Karachi since 25
              September 2026, with Lahore, Islamabad and Peshawar to follow. Meningitis vaccine at least 10 days before
              arrival; polio between 4 weeks and 12 months before entry.
            </li>
            <li>Confirmed return flight (booked before the visa, because of the 30-day entry window)</li>
          </ul>

          <h2 id="airport">What to carry at the airport</h2>
          <p>
            FIA immigration checks Umrah travellers closely. Carry printed and phone copies of your visa, confirmed return
            ticket, Nusuk hotel voucher (with its QR code), vaccination certificate and your agent&apos;s contact details.
            Genuine pilgrims with complete documents travel without trouble; incomplete paperwork is the main reason people
            are stopped.
          </p>

          <h2 id="how">How we arrange your visa</h2>
          <ol>
            <li>Send passport, CNIC and photo on WhatsApp; we check everything before you pay.</li>
            <li>We confirm flights and register your hotels and transport on Nusuk.</li>
            <li>You pay by bank transfer against a written invoice.</li>
            <li>We apply for the visa and send the e-visa to you on WhatsApp, usually within a few working days.</li>
          </ol>

          <h2 id="sources">Sources</h2>
          <ul>
            {sources.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="not-prose pt-6">
            <Faq faqs={faqs} heading="Umrah visa questions" />
          </div>
        </article>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <EnquiryForm whatsapp={site.contact.whatsapp} packageName="Umrah visa + hotels & transport" compact heading="Ask about your visa" />
        </div>
      </div>

      <CtaBand title="Rather have it all arranged?" body="Our packages include the visa, flights, hotels and transport in one price — compare them or ask us on WhatsApp." />
    </>
  );
}
