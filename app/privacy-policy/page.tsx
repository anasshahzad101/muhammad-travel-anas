import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects your personal information, including passport details for Umrah visas.`,
  path: "/privacy-policy/",
});

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" path="/privacy-policy/" updated="23 September 2026">
      <p>
        {site.name} respects your privacy. This policy explains what information we collect when you use this website or
        book with us, and how we use it.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Enquiries:</strong> the name, phone number and trip details you type into our enquiry form or send us on
          WhatsApp or by phone.
        </li>
        <li>
          <strong>Booking documents:</strong> passport, CNIC, photographs and vaccination certificates for each pilgrim,
          which we need to apply for visas and book flights and hotels.
        </li>
        <li>
          <strong>Website analytics:</strong> if enabled, Google Analytics and Google Ads record anonymous usage data (pages
          viewed, device, approximate location) using cookies, to measure which pages and adverts are useful.
        </li>
      </ul>

      <h2>How we use it</h2>
      <p>
        We use your information only to answer your enquiry, arrange your booking, and meet legal requirements. Passport
        and identity documents are shared only with the parties who need them to deliver your booking: the Saudi visa
        system and its licensed umrah service companies, airlines and hotels.
      </p>
      <p>We do not sell your information, and we don&apos;t send marketing messages unless you ask us to.</p>

      <h2>WhatsApp</h2>
      <p>
        Our enquiry form opens WhatsApp with your details filled in; the message is sent only when you press send in
        WhatsApp. Messages are handled under WhatsApp&apos;s own terms and privacy policy.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Booking documents are kept for as long as needed to complete your trip and resolve any refund or complaint, and
        for any period the law requires. Enquiries that don&apos;t lead to a booking are deleted within 12 months.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us what information we hold about you, ask us to correct it, or ask us to delete it where we&apos;re
        not required to keep it. Contact us on WhatsApp or at {site.contact.email}. You can block or delete cookies in
        your browser settings.
      </p>
    </LegalPage>
  );
}
