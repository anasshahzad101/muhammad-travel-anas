import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/metadata";
import { ROOM_BASIS, cheapest, packages } from "@/lib/packages";
import { faqSchema } from "@/lib/schema";
import { season } from "@/lib/season";
import { formatPKR, site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Umrah FAQs — Prices, Visa, Documents, Payment & Cancellation",
  description:
    "Answers for pilgrims from Pakistan: Umrah prices, what's included, visa time, documents, the NADRA vaccination certificate, payment and cancellation.",
  path: "/faq/",
  image: "kaabaWide",
});

export default function FaqPage() {
  const low = cheapest(packages)!;
  const groups: { heading: string; faqs: { q: string; a: string }[] }[] = [
    {
      heading: "Prices and packages",
      faqs: [
        {
          q: "How much does Umrah cost from Pakistan?",
          a: `A complete package with visa, return flights, hotels and transport starts from ${formatPKR(low.amount)} per person (${ROOM_BASIS[low.basis].label.toLowerCase()} room) with us. Prices rise with hotel category, fewer people per room, and in December and Ramadan. Prices checked ${season.pricesChecked}.`,
        },
        {
          q: "What is included in your Umrah packages?",
          a: "The Umrah visa with its insurance, return economy flights, hotels in Makkah and Madinah for the stated nights, and all transfers. Most packages include ziyarat. Each package lists what is and isn't included.",
        },
        {
          q: "Why is your price different from another agent's?",
          a: "Check three things: whether flights and the visa are included, the hotel's real distance from the Haram, and how many people share a room. Quotes that look much cheaper usually differ on one of these.",
        },
        {
          q: "Do you offer instalments?",
          a: "We take a deposit to confirm and the balance before tickets are issued. Ask us about paying in two or three parts if you're booking well in advance.",
        },
      ],
    },
    {
      heading: "Visa and documents",
      faqs: [
        {
          q: "How long does the Umrah visa take?",
          a: "Usually a few working days after we have documents and payment, though timing is controlled by the Saudi authorities. Apply two to three weeks before travel, and earlier for December and Ramadan.",
        },
        {
          q: "What documents do I need?",
          a: "A passport valid for six months or more, your CNIC (B-form for children), a white-background photo, and meningitis and polio vaccinations on a NADRA-linked vaccination certificate (required at Karachi airport from 25 September 2026, with other airports to follow). We confirm the current list when you book.",
        },
        {
          q: "Can you arrange the visa only?",
          a: "Yes. See our Umrah visa page for the price and what the rules require you to book with it.",
        },
      ],
    },
    {
      heading: "Payment, changes and cancellation",
      faqs: [
        {
          q: "How do I pay?",
          a: "By bank transfer into the account in our business name printed on your written invoice, or at our office against a receipt. We never ask for payment into a personal account.",
        },
        {
          q: "What if I need to cancel?",
          a: "Before the visa is submitted, you can cancel with a full refund. After that, the visa fee is non-refundable and flights and hotels follow their own cancellation rules. Our refund policy page explains each part.",
        },
        {
          q: "What happens if my visa is refused?",
          a: "We refund everything that can still be recovered — hotels, transport, refundable airfare and our service charge. The visa fee itself can't be refunded once submitted.",
        },
      ],
    },
    {
      heading: "Travelling",
      faqs: [
        {
          q: "Can women travel for Umrah without a mahram?",
          a: "Saudi Arabia currently allows women to perform Umrah without a mahram. We place women travelling without family in rooms with other women.",
        },
        {
          q: "Can elderly parents or wheelchair users travel?",
          a: "Yes. We suggest closer hotels on flatter routes, and wheelchairs can be hired at both Harams. Tell us when you book and we'll plan around it.",
        },
        {
          q: "Who do we call if something goes wrong in Saudi Arabia?",
          a: "You'll have a number to call in Saudi Arabia on your travel documents, plus our WhatsApp in Pakistan.",
        },
      ],
    },
  ];

  const all = groups.flatMap((g) => g.faqs);

  return (
    <>
      <JsonLd data={faqSchema(all)} />
      <section className="border-b border-sand-200 bg-sand-100/60">
        <div className="container-x py-10 lg:py-14">
          <Breadcrumbs items={[{ name: "FAQs", path: "/faq/" }]} />
          <h1 className="mt-6 text-[2.4rem] leading-[1.06] sm:text-5xl">Umrah questions, answered</h1>
          <p className="mt-4 max-w-2xl text-[1.06rem] leading-relaxed text-ink-700">
            Can&apos;t find your question? Ask us on WhatsApp — {site.contact.whatsappHours.toLowerCase()}. See also our{" "}
            <Link href="/refund-policy/" className="font-semibold text-haram-800 underline">
              refund policy
            </Link>
            .
          </p>
        </div>
      </section>
      <div className="container-x mx-auto max-w-3xl space-y-14 py-14">
        {groups.map((g) => (
          <Faq key={g.heading} faqs={g.faqs} heading={g.heading} schema={false} />
        ))}
      </div>
      <CtaBand />
    </>
  );
}
