import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import DaysUntil from "@/components/DaysUntil";
import EnquiryForm from "@/components/EnquiryForm";
import Faq from "@/components/Faq";
import { ArrowRightIcon, CalendarIcon, HotelIcon, InfoIcon, PassportIcon, PlaneIcon, ShieldIcon, WalletIcon, WhatsAppIcon } from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import SeasonTimeline from "@/components/SeasonTimeline";
import SectionHeading from "@/components/SectionHeading";
import StarPattern, { StarSeal } from "@/components/StarPattern";
import AirportWallet from "@/components/visa/AirportWallet";
import DocumentChecklist from "@/components/visa/DocumentChecklist";
import SourceList from "@/components/visa/SourceList";
import VisaReceipt from "@/components/visa/VisaReceipt";
import { RuleCard, VisaWindow } from "@/components/visa/VisaRules";
import VisaSteps from "@/components/visa/VisaSteps";
import { ContactIcon, IdCardIcon, LandmarkIcon, PersonIcon, PortraitIcon, QrIcon, SyringeIcon, TicketIcon } from "@/components/visa/icons";
import { webPageSchema } from "@/lib/schema";
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

const description = `Umrah visa fee for Pakistanis: SAR 300 government fee with insurance, why agents charge ${pkrRange(market.visa.min, market.visa.max)}, and ${season.hijriYear}H rules and documents.`;

export const metadata = pageMetadata({
  title: `Umrah Visa Price for Pakistanis ${season.label} - Fees, Rules & Documents`,
  description,
  path,
  image: "nabawiDome",
});

const sources = [
  { label: "Ministry of Hajj and Umrah - FAQ (visa fee, women without mahram)", href: "https://haj.gov.sa/en/FAQ" },
  {
    label: "Ministry of Hajj and Umrah - 1448H Umrah season calendar (17 May 2026)",
    href: "https://haj.gov.sa/en/Media-Center/Ministry-News/2026/Ministry-of-Hajj-and-Umrah-Announces-the-Umrah-Season-Calendar-for-1448-AH",
  },
  {
    label: "Dawn - NADRA-linked vaccination certificate mandatory for Umrah (12 Sep 2026)",
    href: "https://www.dawn.com/news/2029401/nadra-linked-vaccination-certificate-mandatory-for-hajj-umrah-pilgrims-from-sept-14",
  },
  {
    label: "The Nation - New Umrah rules for Pakistani operators (15 Jul 2026)",
    href: "https://www.nation.com.pk/15-Jul-2026/government-enforces-new-umrah-rules-enhance-transparency-pilgrim-protection",
  },
  {
    label: "Gulf News - No Umrah visa without approved hotel booking on Nusuk Masar",
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
      <JsonLd
        data={webPageSchema({
          path,
          title: `Umrah Visa Price for Pakistanis (${season.label})`,
          description,
          dateModified: season.pricesCheckedISO,
          image: "nabawiDome",
        })}
      />
      <PageHero
        crumbs={[{ name: "Umrah Visa", path }]}
        eyebrow={`Updated ${season.pricesChecked}`}
        title={`Umrah Visa Price for Pakistanis (${season.label})`}
        lead={
          <p>
            <strong className="text-sand-50">
              The Saudi government fee for an Umrah visa is SAR 300 (about PKR 22,300), with mandatory health insurance included.
            </strong>{" "}
            Agencies in Pakistan typically charge <span className="figure font-semibold text-gold-200">{pkrRange(market.visa.min, market.visa.max)}</span>, because
            since June 2025 every Umrah visa must be issued with Nusuk-registered hotel and transport bookings. All our{" "}
            <Link href="/umrah-packages/" className="font-semibold text-gold-300 underline decoration-gold-400/60 underline-offset-4">
              Umrah packages
            </Link>{" "}
            include the visa.
          </p>
        }
        aside={
          <aside className="glass flex gap-4 rounded-[24px] p-6 text-[0.95rem] leading-relaxed text-sand-100">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-300/15 text-gold-300">
              <InfoIcon className="h-5 w-5" />
            </span>
            <p>
              <strong className="text-sand-50">Not a government website.</strong> {site.name} is a private travel agency. We are not affiliated with the
              Saudi Ministry of Hajj and Umrah, Nusuk, or the Government of Pakistan. Visas are issued at the sole discretion of the Saudi authorities, and
              our service charges are separate from government fees.
            </p>
          </aside>
        }
      />

      {/* ─── What it costs: the receipt ───────────────────────────────────── */}
      <section className="section-ivory relative overflow-hidden border-b border-sand-200">
        <div className="container-x grid gap-12 py-20 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-10 lg:py-28">
          <SectionHeading id="fees" eyebrow="The fees" title="What the Umrah visa costs" accent="costs" className="lg:col-start-1 lg:row-start-1 lg:self-end" />

          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
            <VisaReceipt
              labelledBy="fees"
              columns={["Item", "Who sets it", "Cost"]}
              checked={market.checked}
              lines={[
                {
                  item: "Umrah visa fee, including mandatory health insurance",
                  setBy: "Saudi Ministry of Hajj and Umrah",
                  cost: "SAR 300",
                  costNote: "(≈ PKR 22,300)",
                  numeric: true,
                  icon: LandmarkIcon,
                },
                {
                  item: "Hotel and transport bookings registered on Nusuk Masar",
                  setBy: "Required for every Umrah visa since June 2025",
                  cost: "Depends on hotels and nights",
                  icon: QrIcon,
                },
                {
                  item: "Operator service and processing",
                  setBy: "MoRA-approved operator",
                  cost: "Varies by agency",
                  icon: ShieldIcon,
                },
              ]}
              total={{
                item: <>Typical &ldquo;visa&rdquo; price from Pakistani agencies</>,
                setBy: `Market range, ${market.checked}`,
                cost: pkrRange(market.visa.min, market.visa.max),
              }}
            />
          </div>

          <div className="reveal max-w-xl lg:col-start-1 lg:row-start-2 lg:self-start">
            <div className="relative rounded-[22px] border border-gold-400/35 bg-[#fffdf9]/75 p-6 shadow-[0_18px_40px_-32px_rgb(20_17_13/0.4)] sm:p-7">
              <span className="absolute -top-3.5 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-night-900 text-gold-300 ring-4 ring-sand-100">
                <InfoIcon className="h-4 w-4" />
              </span>
              <p className="text-[1.04rem] leading-relaxed text-ink-700">
                That is why a &ldquo;visa-only&rdquo; offer is rarely just the visa: it has to include registered hotel and transport bookings. If you
                already have flights, ask us for a visa with hotels and transport; otherwise a full{" "}
                <Link href="/umrah-packages/" className="font-semibold text-haram-700 underline decoration-gold-400 underline-offset-4 transition-colors hover:text-haram-900">
                  Umrah package
                </Link>{" "}
                is usually better value.
              </p>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <a href="#quote" className="btn btn-primary">
                Ask about your visa
                <ArrowRightIcon className="h-4 w-4" />
              </a>
              <Link href="/umrah-packages/" className="btn btn-ghost">
                Compare Umrah packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── The rules ────────────────────────────────────────────────────── */}
      <section className="section-night grain on-dark relative overflow-hidden">
        <StarPattern id="visa-rules-lattice" className="text-gold-300 opacity-[0.035]" />
        <div aria-hidden className="pointer-events-none absolute -right-48 top-1/3 h-[38rem] w-[38rem] rounded-full bg-haram-600/20 blur-[120px]" />
        <div className="container-x relative py-20 lg:py-28">
          <SectionHeading id="rules" eyebrow="The rules" title={`Umrah visa rules for the ${season.hijriYear}H season`} accent="rules" />

          <div className="mt-12 space-y-5">
            <VisaWindow
              entry={{
                title: "The entry window",
                body: (
                  <>
                    <strong>Enter within 30 days</strong> of the visa being issued, or it is cancelled automatically.
                  </>
                ),
              }}
              stay={{
                title: "How long you can stay",
                body: (
                  <>
                    <strong>Stay up to 90 days</strong>, limited by your booked package and the season&apos;s final departure date.
                  </>
                ),
              }}
            />

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
              <RuleCard
                icon={CalendarIcon}
                title="When the season closes"
                footer={
                  <div aria-hidden className="rounded-2xl border border-gold-400/25 bg-gold-300/[0.06] px-4 py-3.5">
                    <p className="text-[0.64rem] font-extrabold uppercase tracking-[0.18em] text-gold-300">Last entry</p>
                    <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
                      <p className="figure text-[1.3rem] font-extrabold text-sand-50">{season.umrahPause.lastEntry}</p>
                      <DaysUntil iso={season.umrahPause.lastEntryISO} className="rounded-full bg-gold-300 px-2.5 py-0.5 text-[0.78rem] text-ink-950" />
                    </div>
                  </div>
                }
              >
                <p>
                  <strong>Season deadlines:</strong> last visa issued <span className="figure">{season.umrahPause.lastVisa}</span>, last entry{" "}
                  <span className="figure">{season.umrahPause.lastEntry}</span>, final departure <span className="figure">{season.umrahPause.finalDeparture}</span>. The
                  next season is expected to open {season.umrahPause.nextSeasonExpected}.
                </p>
              </RuleCard>
              <SeasonTimeline onDark />
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <RuleCard icon={ShieldIcon} title="Only approved operators" className="md:col-span-2 lg:col-span-1">
                <p>
                  <strong>Through an approved operator:</strong> since July 2026, only umrah companies verified by Pakistan&apos;s Ministry of Religious
                  Affairs may serve pilgrims. Check any agent against MoRA&apos;s approved list, pay only into the company&apos;s bank account, and keep your
                  receipt and written agreement.
                </p>
              </RuleCard>
              <RuleCard icon={PersonIcon} title="For women" index={1} statement>
                <p>
                  <strong>Women</strong> may perform Umrah without a mahram.
                </p>
              </RuleCard>
              <RuleCard
                icon={PassportIcon}
                title="Multiple-entry visa"
                index={2}
                badge={
                  <span className="rounded-full border border-gold-400/35 bg-gold-300/10 px-3 py-1 text-[0.66rem] font-extrabold uppercase tracking-[0.14em] text-gold-200">
                    Announced
                  </span>
                }
              >
                <p>
                  <strong>A one-year multiple-entry Umrah visa</strong> was announced in July 2026 (90 days&apos; total stay, each visit booked through
                  Nusuk). Its fee and eligibility for Pakistanis have not been published yet.
                </p>
              </RuleCard>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Documents ────────────────────────────────────────────────────── */}
      <section className="container-x py-20 lg:py-28">
        <SectionHeading id="documents" eyebrow="Paperwork" title="Documents you need" accent="Documents" intro="Tick each one off as you gather it." />
        <div className="mt-12">
          <DocumentChecklist
            items={[
              { key: "passport", title: "Passport", icon: PassportIcon, body: "Passport valid for at least six months, with a clear scan or photo of the data page" },
              { key: "cnic", title: "CNIC", icon: IdCardIcon, body: "CNIC (B-form or child registration certificate for children)" },
              { key: "photo", title: "Photograph", icon: PortraitIcon, body: "Recent photograph with a white background" },
              {
                key: "vaccination",
                title: "Vaccination certificate",
                icon: SyringeIcon,
                wide: true,
                body: (
                  <p>
                    <strong>NADRA-linked vaccination certificate</strong> - mandatory for Umrah departures from Karachi since 25 September 2026, with Lahore,
                    Islamabad and Peshawar to follow. Meningitis vaccine at least 10 days before arrival; polio between 4 weeks and 12 months before entry.
                  </p>
                ),
                extra: (
                  <div aria-hidden className="mt-6 flex flex-wrap items-center gap-2 border-t border-dashed border-sand-300 pt-5">
                    <span className="inline-flex items-center gap-2 rounded-full bg-night-900 px-3.5 py-1.5 text-[0.76rem] font-bold text-sand-50">
                      <span className="h-1.5 w-1.5 rounded-full bg-wa-400" />
                      Karachi
                    </span>
                    <ArrowRightIcon className="h-4 w-4 text-gold-600" />
                    {["Lahore", "Islamabad", "Peshawar"].map((c) => (
                      <span key={c} className="inline-flex rounded-full border border-dashed border-sand-400 px-3.5 py-1.5 text-[0.76rem] font-bold text-ink-600">
                        {c}
                      </span>
                    ))}
                  </div>
                ),
              },
              {
                key: "flight",
                title: "Return flight",
                icon: PlaneIcon,
                body: "Confirmed return flight (booked before the visa, because of the 30-day entry window)",
                extra: (
                  <div aria-hidden className="mt-auto flex items-center gap-2 pt-6">
                    {[
                      { n: 1, label: "Flight", icon: PlaneIcon },
                      { n: 2, label: "Visa", icon: PassportIcon },
                    ].map((s, k) => (
                      <span key={s.n} className="contents">
                        {k > 0 ? <ArrowRightIcon className="h-4 w-4 shrink-0 text-gold-600" /> : null}
                        <span
                          className={`flex flex-1 items-center gap-2.5 rounded-2xl border px-3 py-2.5 ${
                            k === 0 ? "border-night-900 bg-night-900 text-sand-50" : "border-dashed border-sand-400 text-ink-600"
                          }`}
                        >
                          <span className={`figure flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.72rem] font-extrabold ${k === 0 ? "bg-gold-300 text-ink-950" : "bg-sand-200 text-ink-700"}`}>
                            {s.n}
                          </span>
                          <s.icon className="h-4 w-4 shrink-0" />
                          <span className="text-[0.84rem] font-bold">{s.label}</span>
                        </span>
                      </span>
                    ))}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* ─── At the airport ───────────────────────────────────────────────── */}
      <section className="section-ivory relative overflow-hidden border-y border-sand-200">
        <div className="container-x grid items-center gap-14 py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20 lg:py-28">
          <div>
            <SectionHeading id="airport" eyebrow="Before you fly" title="What to carry at the airport" accent="carry" />
            <p className="reveal mt-6 max-w-xl text-[1.06rem] leading-relaxed text-ink-700">
              FIA immigration checks Umrah travellers closely. Carry printed and phone copies of your visa, confirmed return ticket, Nusuk hotel voucher
              (with its QR code), vaccination certificate and your agent&apos;s contact details.
            </p>
            <p className="reveal mt-6 flex max-w-xl gap-4 rounded-[22px] border border-haram-600/20 bg-haram-50 p-5 text-[1rem] leading-relaxed text-haram-900 sm:p-6">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-haram-700 text-sand-50">
                <ShieldIcon className="h-[1.1rem] w-[1.1rem]" />
              </span>
              <span>Genuine pilgrims with complete documents travel without trouble; incomplete paperwork is the main reason people are stopped.</span>
            </p>
          </div>
          <AirportWallet
            printed="Printed"
            phone="On your phone"
            items={[
              { label: "Visa", icon: PassportIcon },
              { label: "Confirmed return ticket", icon: TicketIcon },
              { label: "Nusuk hotel voucher", note: "with its QR code", icon: QrIcon },
              { label: "Vaccination certificate", icon: SyringeIcon },
              { label: "Your agent's contact details", icon: ContactIcon },
            ]}
          />
        </div>
      </section>

      {/* ─── How we arrange it ────────────────────────────────────────────── */}
      <section className="section-night grain on-dark relative overflow-hidden">
        <StarPattern id="visa-steps-lattice" className="text-gold-300 opacity-[0.035]" />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        <div className="container-x relative py-20 lg:py-28">
          <SectionHeading id="how" eyebrow="With us" title="How we arrange your visa" accent="arrange" />
          <div className="mt-14">
            <VisaSteps
              steps={[
                {
                  icon: WhatsAppIcon,
                  title: "Send your documents",
                  body: "Send passport, CNIC and photo on WhatsApp; we check everything before you pay.",
                  tag: "Checked before you pay",
                },
                {
                  icon: HotelIcon,
                  title: "Flights and Nusuk bookings",
                  body: "We confirm flights and register your hotels and transport on Nusuk.",
                  tag: "Registered on Nusuk",
                },
                {
                  icon: WalletIcon,
                  title: "A written invoice",
                  body: "You pay by bank transfer against a written invoice.",
                  tag: "Bank transfer",
                },
                {
                  icon: PassportIcon,
                  title: "Your e-visa",
                  body: "We apply for the visa and send the e-visa to you on WhatsApp, usually within a few working days.",
                  tag: "On WhatsApp",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ─── Sources ──────────────────────────────────────────────────────── */}
      <section className="container-x grid gap-10 py-20 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16 lg:py-24">
        <div className="relative lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
          <SectionHeading
            id="sources"
            eyebrow="References"
            title="Sources"
            intro={
              <span className="inline-flex items-center gap-2 text-[0.92rem] font-semibold text-ink-600">
                <CalendarIcon className="h-4 w-4 text-gold-600" />
                Updated {season.pricesChecked}
              </span>
            }
          />
          <StarSeal className="mt-12 hidden h-40 w-40 text-gold-400/30 lg:block" strokeWidth={0.6} />
        </div>
        <SourceList sources={sources} />
      </section>

      {/* ─── Questions + enquiry ──────────────────────────────────────────── */}
      <section className="section-ivory border-t border-sand-200">
        <div className="container-x grid gap-14 py-20 lg:grid-cols-[1.4fr_1fr] lg:py-24">
          <Faq faqs={faqs} heading="Umrah visa questions" />
          <div id="quote" className="scroll-mt-28 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
            <EnquiryForm whatsapp={site.contact.whatsapp} packageName="Umrah visa + hotels & transport" compact heading="Ask about your visa" />
          </div>
        </div>
      </section>

      <CtaBand title="Rather have it all arranged?" body="Our packages include the visa, flights, hotels and transport in one price - compare them or ask us on WhatsApp." />
    </>
  );
}
