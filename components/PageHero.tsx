import Image from "next/image";
import Breadcrumbs, { type Crumb } from "./Breadcrumbs";
import StarPattern from "./StarPattern";
import { images, type ImageKey } from "@/lib/images";

/**
 * The night hero shared by every inner page: breadcrumbs, eyebrow, the H1, a
 * lead, optional actions, and on the right either a photo in a mihrab arch or
 * a custom panel (a price card, a notice). It slides up under the header.
 */
export default function PageHero({
  crumbs,
  eyebrow,
  title,
  accent,
  lead,
  image,
  aside,
  children,
  compact = false,
  backdrop,
}: {
  crumbs: Crumb[];
  eyebrow?: React.ReactNode;
  title: string;
  accent?: string;
  lead?: React.ReactNode;
  image?: ImageKey;
  aside?: React.ReactNode;
  children?: React.ReactNode;
  compact?: boolean;
  /** A photo washed into the night background behind the whole hero. */
  backdrop?: ImageKey;
}) {
  const img = image ? images[image] : null;
  const bg = backdrop ? images[backdrop] : null;
  const at = accent ? title.indexOf(accent) : -1;
  const heading =
    at >= 0 && accent ? (
      <>
        {title.slice(0, at)}
        <span className="text-foil italic">{accent}</span>
        {title.slice(at + accent.length)}
      </>
    ) : (
      title
    );
  const side = aside ?? null;

  return (
    <section className="section-night grain on-dark relative -mt-[var(--header-h)] overflow-hidden pt-[var(--header-h)]">
      {bg && (
        <div aria-hidden className="absolute inset-0">
          <Image src={bg.src} alt="" fill loading="eager" fetchPriority="high" sizes="100vw" className="ken-burns object-cover opacity-[0.28]" />
          <div className="absolute inset-0 bg-gradient-to-r from-night-900 via-night-900/85 to-night-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-transparent to-night-900/60" />
        </div>
      )}
      <div aria-hidden className="light-rays opacity-70" />
      <StarPattern id="page-hero-lattice" className="text-gold-300 opacity-[0.04] [mask-image:linear-gradient(to_bottom,#000,transparent_90%)]" />
      <div aria-hidden className="pointer-events-none absolute -right-48 -top-20 h-[34rem] w-[34rem] rounded-full bg-haram-600/20 blur-[110px]" />

      <div className={`container-x relative ${compact ? "pb-14 pt-8 lg:pb-16 lg:pt-12" : "pb-16 pt-8 lg:pb-20 lg:pt-12"}`}>
        <div className="rise" style={{ "--d": 0 } as React.CSSProperties}>
          <Breadcrumbs items={crumbs} onDark />
        </div>
        <div className={`mt-8 grid gap-12 ${img || side ? "lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)] lg:items-center lg:gap-14" : ""}`}>
          <div className={img || side ? "" : "max-w-4xl"}>
            {eyebrow && (
              <p className="eyebrow rise" style={{ "--d": 1 } as React.CSSProperties}>
                {eyebrow}
              </p>
            )}
            <h1 className="h-display rise mt-4 text-[2.7rem] text-sand-50 sm:text-[3.6rem] lg:text-[4.3rem]" style={{ "--d": 2 } as React.CSSProperties}>
              {heading}
            </h1>
            {lead && (
              <div className="rise mt-6 max-w-2xl space-y-4 text-[1.08rem] leading-relaxed text-sand-200/85" style={{ "--d": 3 } as React.CSSProperties}>
                {lead}
              </div>
            )}
            {children && (
              <div className="rise mt-8" style={{ "--d": 4 } as React.CSSProperties}>
                {children}
              </div>
            )}
          </div>

          {side ? (
            <div className="rise" style={{ "--d": 3 } as React.CSSProperties}>
              {side}
            </div>
          ) : img ? (
            <div className="rise relative mx-auto w-full max-w-[22rem] lg:max-w-[24rem]" style={{ "--d": 3 } as React.CSSProperties}>
              <div className="arch-frame">
                <div className="arch relative aspect-[4/5] w-full shadow-[0_50px_90px_-40px_rgb(0_0_0/0.9)]">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    loading="eager"
                    fetchPriority="high"
                    sizes="(min-width: 1024px) 24rem, 88vw"
                    className="ken-burns object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night-950/60 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
