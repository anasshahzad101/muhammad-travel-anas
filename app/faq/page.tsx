import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import { pageMetadata } from "@/lib/metadata";
import { ROOM_BASIS, cheapest, packages } from "@/lib/packages";
import { webPageSchema } from "@/lib/schema";
import { season } from "@/lib/season";
import { formatPKR, site } from "@/lib/site";

const description =
  "Answers for pilgrims from Pakistan: Umrah prices, what's included, visa time, documents, the NADRA vaccination certificate, payment and cancellation.";

export const metadata = pageMetadata({
  title: "Umrah FAQs - Prices, Visa, Documents, Payment & Cancellation",
  description,
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
          a: "We refund everything that can still be recovered - hotels, transport, refundable airfare and our service charge. The visa fee itself can't be refunded once submitted.",
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
      <JsonLd
        data={webPageSchema({
          path: "/faq/",
          title: "Umrah FAQs",
          description,
          dateModified: season.pricesCheckedISO,
          type: "FAQPage",
          faqs: all,
          image: "kaabaWide",
        })}
      />
      <PageHero
        crumbs={[{ name: "FAQs", path: "/faq/" }]}
        eyebrow={`${all.length} answers`}
        title="Umrah questions, answered"
        accent="answered"
        lead={
          <p>
            Can&apos;t find your question? Ask us on WhatsApp - {site.contact.whatsappHours.toLowerCase()}. See also our{" "}
            <Link href="/refund-policy/" className="font-semibold text-gold-300 underline decoration-gold-400/60 underline-offset-4">
              refund policy
            </Link>
            .
          </p>
        }
        compact
      />
      <div className="container-x grid gap-12 py-20 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="FAQ topics" className="hidden lg:block">
          <div className="sticky top-[calc(var(--header-h)+2rem)]">
            <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-gold-700">Topics</p>
            <ol className="mt-4 space-y-1 border-l border-sand-300 text-[0.92rem]">
              {groups.map((g) => (
                <li key={g.heading}>
                  <a href={`#${slug(g.heading)}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-ink-600 transition hover:border-gold-500 hover:text-ink-950">
                    {g.heading}
                    <span className="figure ml-1.5 text-ink-400">{g.faqs.length}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>
        <div className="max-w-3xl space-y-20">
          {groups.map((g) => (
            <div key={g.heading} id={slug(g.heading)} className="scroll-mt-28">
              <Faq faqs={g.faqs} heading={g.heading} schema={false} />
            </div>
          ))}
        </div>
      </div>
      <CtaBand />
    </>
  );
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
