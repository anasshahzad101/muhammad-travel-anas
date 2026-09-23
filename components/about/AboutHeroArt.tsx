import Image from "next/image";
import { images } from "@/lib/images";
import { site } from "@/lib/site";

/**
 * Two photos in mihrab arches, Madinah behind and the kiswah in front, with a
 * floating glass card for the office. Used as the About hero's right side.
 */
export default function AboutHeroArt() {
  const main = images.nabawiPortrait;
  const small = images.kaabaNight;
  return (
    <div className="relative mx-auto w-full max-w-[21rem] pb-10 sm:max-w-[25rem] lg:max-w-[27rem]">
      <div className="arch-frame ml-auto w-[80%]">
        <div className="arch relative aspect-[4/5] w-full shadow-[0_50px_90px_-40px_rgb(0_0_0/0.9)]">
          <Image
            src={main.src}
            alt={main.alt}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 22rem, 70vw"
            className="ken-burns object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night-950/55 via-transparent to-transparent" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-[42%]">
        <div className="arch relative aspect-[3/4] w-full border-[5px] border-night-900 shadow-[0_30px_60px_-24px_rgb(0_0_0/0.9)] ring-1 ring-gold-400/50">
          <Image src={small.src} alt={small.alt} fill loading="eager" sizes="(min-width: 1024px) 11rem, 36vw" className="object-cover" />
        </div>
      </div>

      <div className="glass animate-float absolute left-0 top-[10%] rounded-2xl !bg-night-900/70 px-4 py-3 sm:-left-6">
        <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-gold-300">Our office</p>
        <p className="mt-0.5 font-display text-[1.35rem] font-semibold leading-tight text-sand-50">{site.contact.address.city}</p>
        <p className="text-[0.74rem] text-sand-200/80">{site.contact.hoursSummary}</p>
      </div>
    </div>
  );
}
