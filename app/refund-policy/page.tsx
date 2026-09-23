import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Refund & Cancellation Policy",
  description: `How cancellations and refunds work for Umrah packages booked with ${site.name}: visa fees, airline fare rules and hotel cancellation windows.`,
  path: "/refund-policy/",
});

export default function RefundPolicy() {
  return (
    <LegalPage title="Refund & Cancellation Policy" path="/refund-policy/" updated="23 September 2026">
      <p>
        An Umrah package is made of parts that belong to other companies — the Saudi visa, the airline ticket and the
        hotels — and each has its own cancellation rules. This page explains, in plain language, what can be refunded
        and when. Your invoice lists the exact amounts for your booking.
      </p>

      <h2>If you cancel</h2>
      <table>
        <thead>
          <tr>
            <th>Part of the package</th>
            <th>What happens if you cancel</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Umrah visa</td>
            <td>
              Refundable in full until we submit your visa application. Once submitted, the visa fee and insurance are
              non-refundable, whether the visa is used or not.
            </td>
          </tr>
          <tr>
            <td>Flights</td>
            <td>
              Refunded according to the airline&apos;s fare rules. Some fares are non-refundable; others carry a
              cancellation charge. We tell you which applies before you pay.
            </td>
          </tr>
          <tr>
            <td>Hotels</td>
            <td>
              Free cancellation outside each hotel&apos;s cancellation window (often 14–30 days before check-in, longer in
              Ramadan). Inside the window, the hotel&apos;s charge applies.
            </td>
          </tr>
          <tr>
            <td>Transport &amp; ziyarat</td>
            <td>Refunded in full if cancelled at least 72 hours before travel.</td>
          </tr>
          <tr>
            <td>Our service charge</td>
            <td>Refunded in full if you cancel before we submit the visa application.</td>
          </tr>
        </tbody>
      </table>

      <h2>If your visa is refused</h2>
      <p>
        Visa decisions are made by the Saudi authorities, not by us. If your visa is refused, we refund everything that
        can still be recovered — hotels, transport and any refundable airfare — and our service charge. The visa fee
        itself is not refundable once the application has been submitted.
      </p>

      <h2>If we have to change your booking</h2>
      <p>
        If an airline changes its schedule or a hotel becomes unavailable, we offer an equivalent alternative of the same
        category and distance, or a refund of the affected part. We will never move you to a lower category without your
        agreement.
      </p>

      <h2>How refunds are paid</h2>
      <p>
        Refunds are paid by bank transfer to the account that made the payment, within 14 working days of us receiving
        the money back from the airline or hotel. Airline refunds can take several weeks to reach us; we&apos;ll keep you
        updated.
      </p>

      <h2>How to cancel</h2>
      <p>
        Send us a message on WhatsApp or <Link href="/contact/">contact us</Link> with your booking name. Cancellations
        are effective from the time we receive your message, and we confirm them in writing.
      </p>
    </LegalPage>
  );
}
