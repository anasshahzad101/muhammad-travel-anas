import Link from "next/link";
import Faq from "@/components/Faq";
import GuideLayout from "@/components/GuideLayout";
import { HealthArt, PassportArt, SealArt, SlidersArt } from "@/components/guides/GuideArt";
import { Callout, Chapter, KeyFacts, Prose, Rows, Steps, SubHead } from "@/components/guides/Article";
import { HeroCard } from "@/components/guides/GuideHeroArt";
import { ShieldIcon } from "@/components/Icons";
import { pageMetadata } from "@/lib/metadata";
import { season } from "@/lib/season";

const path = "/guides/umrah-vaccination-requirements/";
const title = "Umrah Vaccination Requirements from Pakistan";
const description =
  "The vaccinations Pakistanis need for Umrah in 2026-27: the meningitis ACYW vaccine and its validity, the polio dose, the NADRA-integrated certificate now checked at airports, and what is recommended but not required.";

export const metadata = pageMetadata({ title, description, path, image: "minaretPalm" });

const toc = [
  { id: "required", label: "The two required vaccines" },
  { id: "nadra", label: "The NADRA certificate" },
  { id: "recommended", label: "Recommended, not required" },
  { id: "timeline", label: "When to get what" },
  { id: "faq", label: "Questions" },
];

const faqs = [
  {
    q: "Is the paper vaccination card still accepted at the airport?",
    a: "Treat it as backup only. Since 14 September 2026, Pakistani airports check the NADRA-integrated vaccination sheet for international departures, starting with Karachi and rolling out to other airports. Carry the NIMS-issued PDF or its printout, and keep the paper card with it.",
  },
  {
    q: "I had a meningitis vaccine two years ago. Do I need another?",
    a: "Probably not. The conjugate ACYW vaccine counts for five years and the polysaccharide one for three, as long as the certificate names the vaccine and the date. If the certificate does not say which vaccine it was, Saudi Arabia treats it as valid for three years only.",
  },
  {
    q: "I had polio drops as a child. Is that enough?",
    a: "No. Travellers from Pakistan need a polio dose (the drops or the injection) recorded against your CNIC between four weeks and twelve months before departure. A childhood dose is too old.",
  },
  {
    q: "Do children need these vaccines and certificates?",
    a: "Yes. The meningitis vaccine applies from age one, the polio certificate applies at every age, and each child needs their own NADRA-integrated certificate registered against their B-form or CRC, not the parent's CNIC.",
  },
  {
    q: "Can I get vaccinated at the airport on the day I fly?",
    a: "Health counters in the international departure areas vaccinate passengers who arrive without a certificate, but the dose, the NIMS entry and the certificate all have to finish before check-in. Reach the airport about six hours early if you plan to do this - and treat it as the emergency option, not the plan.",
  },
  {
    q: "Is the flu vaccine required for Umrah?",
    a: "No - seasonal influenza is recommended, not required, though Pakistan's airport advisory lists it on the NADRA sheet. COVID-19 vaccination is required only for higher-risk groups such as pilgrims over 65, pregnant women and people with chronic illnesses.",
  },
];

export default function VaccinationRequirements() {
  return (
    <GuideLayout
      title={title}
      lead="Two vaccines are compulsory for Umrah from Pakistan - meningitis and polio - and since September 2026 the proof is a NADRA-integrated certificate, checked before you board. Here is exactly what to get, where, and when."
      path={path}
      image="minaretPalm"
      toc={toc}
      published="2026-10-16"
      updated="2026-10-16"
      description={description}
      heroCard={<HeroCard label="The short answer" value="2 vaccines" sub="Meningitis ACYW and polio - plus the NADRA certificate" />}
    >
      <Chapter id="required" title="The two required vaccines" eyebrow="Required for Umrah" art={HealthArt} first>
        <Prose>
          <p>
            Saudi Arabia's health rules for Umrah make two vaccines compulsory for pilgrims from Pakistan. Everything else -
            flu, COVID-19, yellow fever - is either a recommendation or applies to other routes, not ours.
          </p>
        </Prose>

        <KeyFacts
          label="At a glance"
          facts={[
            { label: "Meningitis ACYW", value: "Required", sub: "Every pilgrim aged 1 and over, at least 10 days before arrival" },
            { label: "Polio (drops or injection)", value: "Required", sub: "Travellers from Pakistan: one dose, 4 weeks to 12 months before departure" },
            { label: "Flu and COVID-19", value: "Recommended", sub: "COVID-19 required only for higher-risk groups" },
            { label: "Yellow fever", value: "Not for us", sub: "Only for arrivals from affected countries in Africa and South America" },
          ]}
        />

        <SubHead>The meningitis (ACYW) vaccine</SubHead>
        <Prose>
          <p>
            Every pilgrim aged one year and older needs a quadrivalent meningococcal vaccine - the one covering strains A, C,
            W and Y - at least ten days before arriving in Saudi Arabia. Two kinds are accepted: the conjugate vaccine counts
            for <strong>five years</strong>, the older polysaccharide vaccine for <strong>three</strong>.
          </p>
          <p>
            One detail matters at immigration: your certificate must show the vaccine's name and the date it was given. If it
            does not say which type you received, Saudi Arabia treats it as valid for three years only - even if you actually
            had the longer-lasting conjugate shot. When you get vaccinated, ask for the vaccine name in writing on the
            certificate before you leave the clinic.
          </p>
        </Prose>

        <SubHead>The polio dose</SubHead>
        <Prose>
          <p>
            Pakistan is one of the two countries where wild poliovirus still circulates, so travellers leaving Pakistan carry
            proof of a recent dose. The requirement is one dose of the polio drops (bOPV) or the injection (IPV), received
            between <strong>four weeks and twelve months</strong> before departure - a childhood dose does not count, and a
            dose older than a year has expired for travel purposes. The dose must be recorded against your CNIC in NADRA's
            National Immunization Management System (NIMS); a stamped card alone produces no certificate.
          </p>
        </Prose>

        <Callout icon={ShieldIcon}>
          Rules are revised every season. We confirm the current list with you when you book, and again before you fly - see{" "}
          <Link href="/faq/">what documents you need</Link> for the full document checklist.
        </Callout>
      </Chapter>

      <Chapter id="nadra" title="The NADRA vaccination certificate" eyebrow="Checked before boarding" art={SealArt}>
        <Prose>
          <p>
            Since 14 September 2026, no traveller is allowed to depart on an international flight from Pakistan without a
            NADRA-integrated vaccination sheet. The checks started at Karachi airport and are rolling out to Islamabad,
            Lahore and the rest. The sheet records polio, measles, yellow fever and influenza on one NADRA-linked document;
            for Umrah passengers the polio entry is the one that matters.
          </p>
        </Prose>

        <Steps
          items={[
            <>
              <em>Get the polio dose.</em> Free at any government vaccination centre, District Health Office or EPI centre -
              and at the health counters inside Karachi, Islamabad and Lahore airports. Make sure the vaccinator enters it
              against your CNIC in NIMS while you watch.
            </>,
            <>
              <em>Download the certificate</em> from <strong>nims.nadra.gov.pk</strong>: enter your 13-digit CNIC and its
              issue date, pay the one-time PKR 100 fee, and save the PDF. It usually appears within minutes of the dose being
              recorded. The Pak Vaccination Pass app shows the same record on your phone.
            </>,
            <>
              <em>Check every traveller separately.</em> Children need their own certificate against their B-form or CRC.
              Overseas Pakistanis register with their NICOP the same way.
            </>,
            <>
              <em>Carry it with your passport,</em> not in checked luggage - the QR code on the PDF is scanned at departure,
              and Saudi immigration can ask for it again on arrival alongside the meningitis certificate.
            </>,
          ]}
        />

        <Rows
          tone="avoid"
          items={[
            <>Don't rely on the old paper polio card - without a NIMS entry it produces no certificate.</>,
            <>Don't vaccinate in the final days before flying: the polio dose should be at least four weeks before departure, the meningitis vaccine at least ten days.</>,
            <>Don't let a certificate say just &quot;meningitis vaccine&quot; - without the vaccine name and date it expires in three years instead of five.</>,
          ]}
        />
      </Chapter>

      <Chapter id="recommended" title="Recommended, not required" eyebrow="Worth considering" art={PassportArt}>
        <Prose>
          <p>
            The seasonal flu vaccine is recommended for everyone - the &quot;Umrah cough&quot; is real, and Pakistan's airport
            advisory lists influenza on the NADRA sheet. COVID-19 vaccination is required only for higher-risk groups:
            pilgrims over 65, pregnant women, and people with chronic or immunocompromising conditions. For everyone else it
            stays a recommendation, as do the routine immunisations (measles, tetanus, diphtheria) that are worth being up to
            date on before any crowded journey.
          </p>
          <p>
            Yellow fever does not apply to a direct Pakistan-to-Saudi journey; that certificate is only for travellers
            arriving from affected countries in Africa and South America.
          </p>
        </Prose>
      </Chapter>

      <Chapter id="timeline" title="When to get what" eyebrow="Working back from your flight" art={SlidersArt}>
        <Steps
          items={[
            <>
              <em>Six or more weeks before:</em> polio dose, so it clears the four-week minimum comfortably and lands in NIMS
              in good time. Book the meningitis vaccine now too - private clinics stock the ACYW conjugate, confirm before you
              go.
            </>,
            <>
              <em>Four weeks before:</em> the last comfortable date for the polio dose. Download your NADRA certificate and
              check the QR code resolves to your name and passport number.
            </>,
            <>
              <em>Ten days before:</em> the hard deadline for the meningitis vaccine. Anything later does not count for entry.
            </>,
            <>
              <em>Departure day:</em> vaccination certificates in hand luggage with your passport,{" "}
              <Link href="/umrah-visa/">e-visa</Link> and tickets - the full list is in our{" "}
              <Link href="/guides/umrah-packing-list/">packing guide</Link>.
            </>,
          ]}
        />

        <Callout>
          Travelling soon? Ask us on WhatsApp which of these you still need - we check your dates against the{" "}
          {season.label} season rules before you pay for anything. See{" "}
          <Link href="/umrah-packages/">Umrah packages from Pakistan</Link> when you're ready.
        </Callout>
      </Chapter>

      <div id="faq" className="not-prose mt-24 scroll-mt-24 sm:mt-32">
        <Faq faqs={faqs} heading="Vaccination questions" />
      </div>
    </GuideLayout>
  );
}
