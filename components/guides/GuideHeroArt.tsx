import Image from "next/image";
import { images, type ImageKey } from "@/lib/images";

/**
 * The guide hero's right-hand side: the photo in a mihrab arch, as on every
 * inner page, with one floating glass card carrying a fact from the guide
 * (the way the homepage hero carries the hotel distance).
 */
export default function GuideHeroArt({ image, card }: { image: ImageKey; card?: React.ReactNode }) {
  const img = images[image];
  return (
    <div className="relative mx-auto w-full max-w-[19rem] sm:max-w-[22rem] lg:max-w-[24rem]">
      <div className="arch-frame">
        <div className="arch relative aspect-[4/5] w-full shadow-[0_50px_90px_-40px_rgb(0_0_0/0.9)]">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 24rem, (min-width: 640px) 22rem, 19rem"
            className="ken-burns object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night-950/65 via-transparent to-transparent" />
        </div>
      </div>
      {card && (
        <div className="glass animate-float absolute -left-4 bottom-[9%] max-w-[16.5rem] rounded-2xl !bg-night-900/75 px-4 py-3.5 sm:-left-12">{card}</div>
      )}
    </div>
  );
}

/** Standard contents for the floating card: a label, a figure or phrase, a line under it. */
export function HeroCard({ label, value, sub, figure = true }: { label: string; value: React.ReactNode; sub?: React.ReactNode; figure?: boolean }) {
  return (
    <>
      <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-gold-300">{label}</p>
      <p className={figure ? "figure mt-0.5 text-[1.3rem] font-extrabold text-sand-50" : "mt-0.5 font-display text-[1.35rem] font-semibold leading-tight text-sand-50"}>
        {value}
      </p>
      {sub && <p className="mt-0.5 text-[0.74rem] leading-snug text-sand-200/80">{sub}</p>}
    </>
  );
}
