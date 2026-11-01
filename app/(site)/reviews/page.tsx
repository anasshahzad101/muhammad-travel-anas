import { notFound } from "next/navigation";
import CtaBand from "@/components/CtaBand";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import ListingBadge from "@/components/ListingBadge";
import PageHero from "@/components/PageHero";
import { RatingSummary, ReviewCard } from "@/components/Reviews";
import SectionHeading from "@/components/SectionHeading";
import { Ornament } from "@/components/StarPattern";
import TrustPoints from "@/components/TrustPoints";
import TrustpilotReviewCollector from "@/components/TrustpilotReviewCollector";
import { pageMetadata } from "@/lib/metadata";
import { hasReviews, ratingLine, reviewStats, sortedReviews, sourceNames } from "@/lib/reviews";
import { REVIEWS_ID, reviewsSchema, webPageSchema } from "@/lib/schema";
import { site } from "@/lib/site";

/**
 * /reviews/ - every review, as written, with a link to where it was left.
 *
 * The page is a 404 (and is left out of the sitemap, the footer and the llms
 * files) until lib/reviews.ts has reviews; nothing here is typed by hand.
 */

const line = ratingLine();
const description = line
  ? `${line}. Every review, word for word, with a link to the original - and how to check any Umrah agent before you pay.`
  : `Reviews of ${site.name} from pilgrims who travelled with us, copied word for word from independent listings.`;

export const metadata = pageMetadata({
  title: `${site.name} Reviews - What Pilgrims Say`,
  absoluteTitle: true,
  description,
  path: "/reviews/",
  image: "nabawiLattice",
});

export default function ReviewsPage() {
  if (!hasReviews()) notFound();
  const list = sortedReviews();
  const stats = reviewStats()!;
  const names = sourceNames(stats);
  const listing = site.listings.apkaVisa;
  const plural = stats.count === 1 ? "pilgrim has" : "pilgrims have";

  const faqs = [
    {
      q: `Where can I read reviews of ${site.name}?`,
      a: `On our ${listing.name} listing, ${listing.description}, where ${stats.count} ${plural} rated us ${stats.averageText} out of 5. The same reviews are reproduced on this page, word for word, each linking to the original. We also invite every traveller to review us on Trustpilot, using the button in the footer of every page.`,
    },
    {
      q: "Are the reviews on this page genuine?",
      a: `They were written by customers on ${names}, an independent site, not collected by us. We publish every review on the listing as it was written, whether it praises or criticises us, with a link to the original so you can check it yourself. The only ordering is newest first.`,
    },
    {
      q: "How do I leave a review after my Umrah?",
      a: `On Trustpilot, through the "Review us" button in the footer, or on our ${listing.name} listing. We read every one, and we ask for your honest experience rather than a five-star rating: the next family's decision depends on it.`,
    },
    {
      q: "How can I check an Umrah agent is genuine before paying?",
      a: `Four things, all of which you can check with us: a written invoice before any payment; payment only into a bank account in the business's own name; your visa, e-tickets and hotel vouchers in hand before you fly; and reviews on independent sites rather than screenshots sent on WhatsApp. You are also welcome to visit our ${site.contact.address.city} office.`,
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            path: "/reviews/",
            title: `${site.name} Reviews`,
            description,
            dateModified: stats.latestISO,
            type: "CollectionPage",
            image: "nabawiLattice",
            mainEntity: REVIEWS_ID,
          }),
          reviewsSchema(),
        ]}
      />
      <PageHero
        crumbs={[{ name: "Reviews", path: "/reviews/" }]}
        eyebrow="Reviews"
        title={`What pilgrims say about ${site.name}`}
        accent="pilgrims say"
        lead={
          <p>
            {line}. Every review below is copied word for word from our {names} listing and links to the original, so you can check it yourself. We
            publish all of them, as written, newest first.
          </p>
        }
        image="nabawiLattice"
      >
        <RatingSummary onDark />
      </PageHero>

      {/* ─── Every review ─────────────────────────────────────────────────── */}
      <section className="container-x py-24">
        <SectionHeading eyebrow={`${stats.count} ${stats.count === 1 ? "review" : "reviews"}`} title="Every review, newest first" accent="newest first" />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((r, i) => (
            <ReviewCard key={r.id} r={r} index={i % 3} />
          ))}
        </div>
      </section>

      {/* ─── Leave a review ───────────────────────────────────────────────── */}
      <section className="section-ivory border-y border-sand-200">
        <div className="container-x grid gap-10 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <SectionHeading
            eyebrow="Travelled with us?"
            title="Tell the next family"
            accent="next family"
            intro="Your honest experience, good or bad, is what another family will read before they trust an agent with their Umrah. A review on an independent site takes two minutes."
          />
          <div className="reveal card flex flex-col gap-5 p-6 sm:p-8">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-gold-700">Review us on Trustpilot</p>
            <TrustpilotReviewCollector />
            <div className="hairline" />
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-gold-700">Or on our directory listing</p>
            <ListingBadge className="self-start" />
          </div>
        </div>
      </section>

      {/* ─── Things you can check ─────────────────────────────────────────── */}
      <section className="container-x py-24">
        <SectionHeading
          eyebrow="Things you can check"
          title="Reviews are one check. Here are the other four"
          accent="other four"
          intro="A good review tells you how one family's trip went. These are the things you can verify for yourself before you pay anyone a rupee."
        />
        <div className="mt-12">
          <TrustPoints />
        </div>
        <Ornament className="mx-auto mt-20 max-w-md" />
      </section>

      <section className="container-x pb-24">
        <Faq faqs={faqs} heading="Reviews: common questions" />
      </section>

      <CtaBand title="Ask us anything before you book" />
    </>
  );
}
