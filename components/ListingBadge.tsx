import { ShieldIcon } from "./Icons";
import RatingStars from "./RatingStars";
import { reviewStats, type ReviewSource } from "@/lib/reviews";
import { site } from "@/lib/site";

/**
 * A small trust mark linking to the business's listing on a directory
 * (ApkaVisa by default): "Listed on ApkaVisa", and once that directory's
 * reviews are in lib/reviews.ts, "Reviewed on ApkaVisa" with the rating and
 * count computed from them.
 *
 * The link is a normal, followed link that opens in a new tab: the listing is
 * a real profile of the business and the source of the reviews shown on the
 * site, so sending visitors (and crawlers) there to check is the point. The
 * same URL goes out as sameAs in the TravelAgency schema (lib/schema.ts), so
 * the visible badge and the structured data name the same profile.
 */
export default function ListingBadge({
  source = "apkaVisa",
  onDark = false,
  className = "",
}: {
  source?: ReviewSource;
  onDark?: boolean;
  className?: string;
}) {
  const listing = site.listings[source];
  const stats = reviewStats(source);
  const label = stats
    ? `${site.name} on ${listing.name}: rated ${stats.averageText} out of 5 from ${stats.count} ${stats.count === 1 ? "review" : "reviews"} (opens in a new tab)`
    : `${site.name} on ${listing.name} (opens in a new tab)`;

  return (
    <a
      href={listing.url}
      target="_blank"
      rel="noopener"
      aria-label={label}
      title={listing.description}
      className={`group inline-flex min-h-[2.75rem] items-center gap-3 rounded-full border py-1.5 pl-1.5 pr-4 transition duration-300 ${
        onDark
          ? "border-gold-400/30 bg-white/[0.04] text-sand-100 hover:border-gold-300 hover:bg-white/[0.07]"
          : "border-sand-300 bg-[#fffdf9] text-ink-900 hover:border-gold-400/70 hover:shadow-[0_18px_40px_-28px_rgb(20_17_13/0.45)]"
      } ${className}`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-haram-700 text-sand-50 transition duration-500 ease-out-expo group-hover:bg-haram-600">
        <ShieldIcon className="h-4 w-4" />
      </span>
      <span className="leading-tight">
        <span className={`block text-[0.58rem] font-extrabold uppercase tracking-[0.18em] ${onDark ? "text-gold-300" : "text-gold-700"}`}>
          {stats ? "Reviewed on" : "Listed on"}
        </span>
        <span className="block text-[0.9rem] font-bold">{listing.name}</span>
      </span>
      {stats && (
        <span className={`ml-1 flex items-center gap-1.5 border-l pl-3 ${onDark ? "border-white/15" : "border-sand-300"}`}>
          <RatingStars value={stats.average} onDark={onDark} size="h-3 w-3" />
          <span className="figure text-[0.9rem] font-extrabold">{stats.averageText}</span>
          <span className={`figure text-[0.72rem] ${onDark ? "text-sand-200/60" : "text-ink-500"}`}>({stats.count})</span>
        </span>
      )}
    </a>
  );
}
