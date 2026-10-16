import Link from "next/link";
import Faq from "@/components/Faq";
import GuideLayout from "@/components/GuideLayout";
import { AskArt, JourneyArt, MadinahArt, SlidersArt } from "@/components/guides/GuideArt";
import { Callout, Chapter, KeyFacts, Prose, Rows, Steps, SubHead } from "@/components/guides/Article";
import { HeroCard } from "@/components/guides/GuideHeroArt";
import { pageMetadata } from "@/lib/metadata";
import { whatsappLink } from "@/lib/site";

const path = "/guides/nusuk-app-guide/";
const title = "Nusuk App Guide: Permits and Rawdah Booking";
const description =
  "How pilgrims from Pakistan use the Nusuk app: registering with your visa number before you fly, booking a Rawdah slot in Masjid an-Nabawi, and fixing the problems people hit most.";

export const metadata = pageMetadata({ title, description, path, image: "nabawiPortrait" });

const toc = [
  { id: "what-nusuk-does", label: "What Nusuk does" },
  { id: "setup", label: "Set it up before you fly" },
  { id: "rawdah", label: "Booking the Rawdah" },
  { id: "problems", label: "Common problems" },
  { id: "faq", label: "Questions" },
];

const faqs = [
  {
    q: "Do I need a permit from Nusuk to perform Umrah?",
    a: "On an Umrah visa from Pakistan, your visa is your permission to perform Umrah - no separate Umrah permit is needed. Nusuk's main job for you is booking the Rawdah in Madinah. Saudi residents and citizens do need an Umrah permit through the app, but that rule is not aimed at visa holders from Pakistan.",
  },
  {
    q: "Is the Rawdah booking free?",
    a: "Yes. Rawdah slots through Nusuk are free. Anyone charging for a slot is selling you something you can book yourself in two minutes.",
  },
  {
    q: "Can I book the Rawdah for my whole family on one phone?",
    a: "You can add companions in the app and book slots for them, but every adult should ideally register with their own passport and visa number. Slots are per person and are checked against the booking at the entrance.",
  },
  {
    q: "The Rawdah shows no slots. What now?",
    a: "Slots are released in batches and go quickly in December and Ramadan. Check at different times of day, keep the app updated, and try for the less busy hours. If nothing opens during your Madinah stay, praying in the rest of the Prophet's Mosque needs no slot at all.",
  },
  {
    q: "Does Nusuk work on a Pakistani SIM?",
    a: "It installs and registers on a Pakistani number, but in Saudi Arabia you will want data - a Saudi SIM or eSIM from the airport - for maps, permits and messages. Install and log in on Wi-Fi before you fly so the account is ready.",
  },
];

export default function NusukAppGuide() {
  return (
    <GuideLayout
      title={title}
      lead="Nusuk is Saudi Arabia's official pilgrim app. On an Umrah visa from Pakistan you mainly need it for one thing - the Rawdah in the Prophet's Mosque - but it has to be set up properly before you land."
      path={path}
      image="nabawiPortrait"
      toc={toc}
      published="2026-10-16"
      updated="2026-10-16"
      description={description}
      heroCard={<HeroCard label="The main job" value="Rawdah slots" sub="Free, per person, booked in the app" />}
    >
      <Chapter id="what-nusuk-does" title="What Nusuk does - and what it doesn't" eyebrow="The official app" art={JourneyArt} first>
        <Prose>
          <p>
            Nusuk is the Saudi government's official platform for pilgrims. It handles permits and bookings around the two
            holy mosques, and it is the only official channel for the booking most pilgrims from Pakistan actually need: a
            slot to pray in the <strong>Rawdah</strong> (Riyaz-ul-Jannah) inside Masjid an-Nabawi.
          </p>
          <p>
            What it does not do for you: on an Umrah visa issued through us, the visa itself is your permission to perform
            Umrah - there is no separate Umrah permit to book in the app. The permit requirement you may read about applies to
            Saudi residents and citizens. Rules do change, and we confirm the current ones when you book.
          </p>
        </Prose>

        <KeyFacts
          label="What you use it for"
          facts={[
            { label: "Umrah permit", value: "Not needed", sub: "Your Umrah visa already covers it" },
            { label: "Rawdah slot", value: "Yes", sub: "Free, per person, inside Masjid an-Nabawi" },
            { label: "Cost", value: "Free", sub: "The app and its bookings cost nothing" },
            { label: "When to install", value: "Before flying", sub: "Register on Wi-Fi at home, not at the airport" },
          ]}
        />
      </Chapter>

      <Chapter id="setup" title="Set it up before you fly" eyebrow="Ten minutes at home" art={SlidersArt}>
        <Steps
          items={[
            <>
              <em>Install Nusuk</em> from the App Store or Google Play - check the developer is the Saudi authorities' official
              one, as look-alike apps exist.
            </>,
            <>
              <em>Register with your own details:</em> your passport number and your Umrah visa (e-visa) number, exactly as
              printed. One mistyped digit and your permits will not appear.
            </>,
            <>
              <em>Verify with the OTP</em> sent to your email or phone. Do this at home on Wi-Fi, where signal and email both
              work, rather than at the airport.
            </>,
            <>
              <em>Add your companions</em> if you are booking for family - each with their own passport and visa number.
            </>,
            <>
              <em>Sort out data for Saudi Arabia:</em> a Saudi SIM or eSIM, sold at Jeddah and Madinah airports. Nusuk, maps
              and WhatsApp all need it. This is on our{" "}
              <Link href="/guides/umrah-packing-list/">packing list</Link> for a reason.
            </>,
          ]}
        />
      </Chapter>

      <Chapter id="rawdah" title="Booking the Rawdah" eyebrow="Riyaz-ul-Jannah" art={MadinahArt}>
        <Prose>
          <p>
            The Rawdah - the area between the Prophet's ﷺ pulpit and his resting place, which he described as a garden of
            Paradise - is small, and entry is by timed slot only. Slots are free and booked per person in Nusuk.
          </p>
        </Prose>

        <SubHead>How to get a slot</SubHead>
        <Rows
          items={[
            <>Open Nusuk, choose the <strong>Rawdah booking</strong> service, and pick a day within your Madinah stay.</>,
            <>Book early - slots are released in batches and disappear fastest in December and Ramadan.</>,
            <>Choose off-peak hours if you can: late night and early morning slots are easier to get than the ones after prayers.</>,
            <>Save the permit's QR code offline (a screenshot works) in case data is patchy inside the mosque.</>,
          ]}
        />

        <SubHead>On the day</SubHead>
        <Rows
          items={[
            <>Arrive within your time window - the slot is checked at the entrance and late slots lapse.</>,
            <>Bring the phone with the booking, or a printed screenshot of the QR code.</>,
            <>Keep the visit short and calm; thousands are waiting for the same few minutes.</>,
          ]}
        />

        <Callout>
          No slot? Praying anywhere else in the Prophet's Mosque needs no booking at all - the Rawdah is the only gated part.
          The rest of the mosque is open to you at prayer times.
        </Callout>
      </Chapter>

      <Chapter id="problems" title="Common problems and fixes" eyebrow="When it goes wrong" art={AskArt}>
        <Rows
          tone="avoid"
          items={[
            <><strong>OTP never arrives:</strong> check spam, then switch between email and phone verification. Registering at home, before travel, avoids this entirely.</>,
            <><strong>&quot;No permits found&quot;:</strong> almost always a mistyped passport or visa number. Re-check against the e-visa PDF we send you.</>,
            <><strong>The app is in Arabic only:</strong> language settings are in the profile menu - English and Urdu are both there.</>,
            <><strong>Slots always full:</strong> they are released in batches, so checking once and giving up is the mistake - try different days and off-peak hours.</>,
          ]}
        />

        <Callout>
          Stuck on any of this before or during your trip? <a href={whatsappLink("Assalam o Alaikum, I need help with the Nusuk app.")} rel="nofollow">Message us on WhatsApp</a> -
          we walk pilgrims through Nusuk every week. And if you're still planning, see{" "}
          <Link href="/guides/how-to-perform-umrah/">how to perform Umrah</Link> and our{" "}
          <Link href="/umrah-packages/">Umrah packages</Link>.
        </Callout>
      </Chapter>

      <div id="faq" className="not-prose mt-24 scroll-mt-24 sm:mt-32">
        <Faq faqs={faqs} heading="Nusuk questions" />
      </div>
    </GuideLayout>
  );
}
