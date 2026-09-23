import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Terms & Conditions",
  description: `Booking terms for Umrah packages, visas and tickets arranged by ${site.name}.`,
  path: "/terms-and-conditions/",
});

export default function Terms() {
  return (
    <LegalPage title="Terms & Conditions" path="/terms-and-conditions/" updated="23 September 2026">
      <p>
        These terms apply to Umrah packages, visas, tickets and related services arranged by {site.name}
        {site.legalName ? ` (${site.legalName})` : ""}, {site.contact.address.city}, Pakistan. By paying for a booking
        you agree to them. Please also read our <Link href="/refund-policy/">refund &amp; cancellation policy</Link>.
      </p>

      <h2>1. Prices</h2>
      <p>
        Prices on this website are per person in Pakistani rupees and show the lowest room basis available. Airfares and
        hotel rates change frequently, so website prices are a guide: your price is the one on your written invoice, which
        is valid for the period stated on it.
      </p>

      <h2>2. Booking and payment</h2>
      <ul>
        <li>A booking is confirmed when we issue a written invoice and receive the payment stated on it.</li>
        <li>
          We accept payment only by bank transfer into the account in our business name printed on the invoice, or in
          person at our office against a receipt.
        </li>
        <li>The balance must be paid before we issue tickets and hotel vouchers.</li>
      </ul>

      <h2>3. Documents and visas</h2>
      <p>
        You are responsible for providing accurate passport details, a passport valid for the period required by Saudi
        Arabia, and the vaccinations and documents Saudi and Pakistani authorities require. Visas are issued at the sole
        discretion of the Saudi authorities; we cannot guarantee a visa. {site.name} is not affiliated with the Ministry
        of Hajj and Umrah of Saudi Arabia, Nusuk, or the Government of Pakistan.
      </p>

      <h2>4. Hotels</h2>
      <p>
        Hotels named on the website are our usual choice for each package. Your voucher names the exact hotel, which will
        be the named hotel or one of the same category and similar distance. Distances are walking distances to the
        nearest gate of the Haram and are approximate.
      </p>

      <h2>5. Flights</h2>
      <p>
        Flights are subject to the airline&apos;s conditions of carriage, baggage allowance and schedule changes. Zamzam
        water and excess baggage are carried according to airline rules.
      </p>

      <h2>6. In Saudi Arabia</h2>
      <p>
        Pilgrims must follow Saudi law, the rules of the Harams and Nusuk permit requirements. Access to Riaz ul Jannah
        and other permit-controlled areas depends on availability through Nusuk, which we cannot guarantee.
      </p>

      <h2>7. Our responsibility</h2>
      <p>
        We are responsible for arranging the services on your invoice with reasonable care. We are not responsible for
        losses caused by events outside our control, including airline or government decisions, visa refusals, weather,
        illness or restrictions imposed by the Saudi authorities, but we will help you recover whatever can be recovered.
      </p>

      <h2>8. Complaints</h2>
      <p>
        If something goes wrong, tell us immediately — while you are still in Saudi Arabia if possible — so we can fix it.
        Written complaints can be sent on WhatsApp or by email to {site.contact.email}. We reply within five working days.
      </p>

      <h2>9. Law</h2>
      <p>These terms are governed by the laws of Pakistan and the courts of {site.contact.address.city}.</p>
    </LegalPage>
  );
}
