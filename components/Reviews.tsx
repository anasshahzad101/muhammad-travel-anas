import Link from "next/link";
import { ArrowRightIcon } from "./Icons";
import ListingBadge from "./ListingBadge";
import RatingStars from "./RatingStars";
import SectionHeading from "./SectionHeading";
import { ratingLine, reviewDate, reviewSource, reviewStats, reviewUrl, sortedReviews, sourceNames, type Review } from "@/lib/reviews";

/**
 * Reviews as visitors and crawlers see them. Everything is server-rendered
 * from lib/reviews.ts: real HTML (<article>, <blockquote>, <time>, <cite>),
 * so answer engines that don't run JavaScript can quote a review, its author,
 * its date and where it was left. Nothing renders while the list is empty.
 */

/** One review, as written, with a link back to where it was left. */
export function ReviewCard({ r, onDark = false, index = 0 }: { r: Review; onDark?: boolean; index?: number }) {
  const src = reviewSource(r);
  const meta = [r.city, r.travelled].filter(Boolean).join(" · ");
  return (
    <article
      id={`review-${r.id}`}
      className={`spotlight reveal group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border p-6 transition duration-500 sm:p-7 ${
        onDark ? "border-white/10 bg-white/[0.03] hover:border-gold-400/40" : "border-sand-300 bg-[#fffdf9] hover:border-gold-400/60"
      }`}
      style={{ "--i": index } as React.CSSProperties}
    >
      {/* Ornamental quote mark in the top-right corner; the header row leaves it room (pr-12). */}
      <span aria-hidden className={`absolute right-4 top-1 font-display text-[4rem] leading-none ${onDark ? "text-gold-300/15" : "text-gold-400/25"}`}>
        &ldquo;
      </span>
      <div className="relative flex items-center justify-between gap-3 pr-12">
        <RatingStars value={r.rating} onDark={onDark} />
        <time dateTime={r.date} className={`figure text-[0.78rem] ${onDark ? "text-sand-200/60" : "text-ink-500"}`}>
          {reviewDate(r)}
        </time>
      </div>
      {r.title && <h3 className={`relative mt-4 text-[1.4rem] leading-tight ${onDark ? "text-sand-50" : "text-ink-950"}`}>{r.title}</h3>}
      <blockquote cite={reviewUrl(r)} className={`relative mt-4 flex-1 text-[0.98rem] leading-relaxed ${onDark ? "text-sand-200/85" : "text-ink-700"}`}>
        <p>{r.text}</p>
      </blockquote>
      <footer className={`relative mt-6 flex flex-wrap items-end justify-between gap-3 border-t pt-4 text-[0.85rem] ${onDark ? "border-white/10" : "border-sand-200"}`}>
        <div>
          <p className={`font-bold ${onDark ? "text-sand-50" : "text-ink-950"}`}>
            <cite className="not-italic">{r.author}</cite>
          </p>
          {meta && <p className={onDark ? "text-sand-200/60" : "text-ink-500"}>{meta}</p>}
        </div>
        <a href={reviewUrl(r)} target="_blank" rel="noopener" className="link-arrow text-[0.8rem]">
          Read on {src.name} <ArrowRightIcon className="h-3.5 w-3.5" />
        </a>
      </footer>
    </article>
  );
}

/** The mean rating in figures, the count and where it comes from, with the badge that links to the listing. */
export function RatingSummary({ onDark = false, className = "" }: { onDark?: boolean; className?: string }) {
  const stats = reviewStats();
  if (!stats) return null;
  return (
    <div className={`flex flex-wrap items-center gap-x-8 gap-y-5 ${className}`}>
      <div className="flex items-center gap-4">
        <p className={`figure text-[3.2rem] font-extrabold leading-none ${onDark ? "text-sand-50" : "text-ink-950"}`}>
          {stats.averageText}
          <span className={`text-[1.2rem] font-bold ${onDark ? "text-sand-200/60" : "text-ink-500"}`}>/5</span>
        </p>
        <div>
          <RatingStars value={stats.average} onDark={onDark} size="h-5 w-5" />
          <p className={`mt-1 text-[0.9rem] ${onDark ? "text-sand-200/80" : "text-ink-600"}`}>
            <span className="figure font-bold">{stats.count}</span> {stats.count === 1 ? "review" : "reviews"} on {sourceNames(stats)}
          </p>
        </div>
      </div>
      {stats.sources.map((s) => (
        <ListingBadge key={s} source={s} onDark={onDark} />
      ))}
    </div>
  );
}

/**
 * A reviews section for the homepage and /about/: heading, the newest
 * `limit` reviews, the rating summary and a link to the full page.
 * Renders nothing until lib/reviews.ts has reviews.
 */
export default function ReviewsSection({
  limit,
  eyebrow = "Reviews",
  title = "What pilgrims say",
  accent = "pilgrims",
  onDark = false,
  className = "container-x py-24",
}: {
  limit?: number;
  eyebrow?: string;
  title?: string;
  accent?: string;
  onDark?: boolean;
  className?: string;
}) {
  const list = sortedReviews();
  const stats = reviewStats();
  if (!stats || list.length === 0) return null;
  const shown = limit ? list.slice(0, limit) : list;
  const names = sourceNames(stats);

  return (
    <section className={className} aria-labelledby="reviews-heading">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          id="reviews-heading"
          eyebrow={eyebrow}
          title={title}
          accent={accent}
          intro={
            <>
              {ratingLine()}. Copied word for word from our {names} listing{stats.sources.length > 1 ? "s" : ""}; every review links to the original.
            </>
          }
        />
        <Link href="/reviews/" className="btn btn-ghost reveal shrink-0">
          {list.length > shown.length ? `Read all ${list.length} reviews` : "All reviews"}
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((r, i) => (
          <ReviewCard key={r.id} r={r} onDark={onDark} index={i} />
        ))}
      </div>
      <RatingSummary onDark={onDark} className="reveal mt-10" />
    </section>
  );
}
