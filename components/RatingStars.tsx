import { StarIcon } from "./Icons";

/**
 * Five stars with `value` of them filled (rounded to the nearest whole star).
 * The exact value is in the aria-label, so a 4.6 reads as 4.6, not 5.
 */
export default function RatingStars({
  value,
  onDark = false,
  size = "h-3.5 w-3.5",
  className = "",
}: {
  value: number;
  onDark?: boolean;
  /** Tailwind size classes for each star. */
  size?: string;
  className?: string;
}) {
  const filled = Math.round(value);
  return (
    <span className={`inline-flex gap-px ${className}`} role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon
          key={i}
          className={`${size} ${i <= filled ? (onDark ? "text-gold-300" : "text-gold-500") : onDark ? "text-white/20" : "text-sand-300"}`}
        />
      ))}
    </span>
  );
}
