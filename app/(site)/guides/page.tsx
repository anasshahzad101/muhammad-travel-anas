import Image from "next/image";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import StarPattern from "@/components/StarPattern";
import { ArrowRightIcon } from "@/components/Icons";
import { ArtPlate } from "@/components/guides/Article";
import { HalqArt, MiqatArt, SaiArt, TawafArt } from "@/components/guides/GuideArt";
import { guideList } from "@/components/guides/guideList";
import { images } from "@/lib/images";
import { pageMetadata } from "@/lib/metadata";
import { ritesCopy } from "@/lib/rites";
import { webPageSchema } from "@/lib/schema";

const description =
  "Practical Umrah guides for pilgrims from Pakistan: how to perform Umrah step by step, the duas, what Umrah costs in 2026, and what to pack.";

export const metadata = pageMetadata({
  title: "Umrah Guides - How to Perform Umrah, Duas, Costs & Packing",
  description,
  path: "/guides/",
  image: "nabawiLattice",
});

const STEP_ART = { ihram: MiqatArt, tawaf: TawafArt, sai: SaiArt, halq: HalqArt } as const;

export default function GuidesHub() {
  const [lead, ...rest] = guideList;
  const steps = ritesCopy().steps;

  return (
    <>
      <JsonLd
        data={webPageSchema({ path: "/guides/", title: "Umrah guides", description, dateModified: "2026-09-23", type: "CollectionPage", image: "nabawiLattice" })}
      />
      <PageHero
        crumbs={[{ name: "Guides", path: "/guides/" }]}
        eyebrow="Prepare"
        title="Umrah guides"
        accent="guides"
        lead={<p>Everything we explain to pilgrims before they fly, written down: the rites, the duas, the real costs and the packing list.</p>}
        compact
        backdrop="nabawiWide"
      >
        <ul className="flex flex-wrap gap-2">
          {guideList.map((g) => (
            <li key={g.href}>
              <Link href={g.href} className="chip min-h-11 !px-4 hover:border-gold-400/60 hover:text-gold-200">
                {g.title}
              </Link>
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="container-x py-20 lg:py-24">
        {/* ─── The lead guide ─────────────────────────────────────────────── */}
        <Link
          href={lead.href}
          className="reveal on-dark group relative grid overflow-hidden rounded-[30px] bg-night-900 shadow-[0_50px_90px_-50px_rgb(3_11_9/0.8)] lg:grid-cols-[1.05fr_0.95fr]"
        >
          <span className="relative block min-h-[17rem] overflow-hidden sm:min-h-[22rem] lg:min-h-[32rem]">
            <Image
              src={images[lead.image].src}
              alt=""
              fill
              loading="eager"
              sizes="(min-width: 1024px) 40rem, 92vw"
              className="object-cover transition duration-[1.6s] ease-out-expo group-hover:scale-[1.05]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-night-900/10 lg:to-night-900" />
            <span className="absolute left-5 top-5 rounded-full bg-gold-300 px-3 py-1 text-[0.66rem] font-extrabold uppercase tracking-[0.16em] text-ink-950">
              Start here
            </span>
          </span>
          <span className="section-night relative flex flex-col justify-center overflow-hidden p-7 sm:p-10 lg:p-12">
            <StarPattern id="hub-lead-lattice" className="text-gold-300 opacity-[0.04]" />
            <span className="eyebrow relative">{lead.tag}</span>
            <h2 className="relative mt-4 text-[2.5rem] leading-[1.02] text-sand-50 sm:text-[3.3rem]">{lead.title}</h2>
            <span className="relative mt-4 block max-w-md text-[1.02rem] leading-relaxed text-sand-200/85">{lead.body}</span>
            <span aria-hidden className="relative mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {steps.map((s, i) => (
                <span key={s.id} className="rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-3 transition duration-500 group-hover:border-gold-400/30">
                  <span className="figure block text-[0.68rem] font-extrabold text-gold-300">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-0.5 block font-display text-[1.2rem] font-semibold leading-tight text-sand-50">{s.title}</span>
                </span>
              ))}
            </span>
            <span className="btn btn-gold relative mt-8 self-start">
              Read the guide <ArrowRightIcon className="h-4 w-4" />
            </span>
          </span>
        </Link>

        {/* ─── The other guides ───────────────────────────────────────────── */}
        <ul className="mt-6 grid gap-6 md:grid-cols-3">
          {rest.map((g, i) => (
            <li key={g.href} className="reveal" style={{ "--i": i } as React.CSSProperties}>
              <Link href={g.href} className="card card-hover group flex h-full flex-col overflow-hidden">
                <span className="relative block aspect-[4/3] overflow-hidden">
                  <Image
                    src={images[g.image].src}
                    alt=""
                    fill
                    loading={i < 1 ? "eager" : "lazy"}
                    sizes="(min-width: 768px) 30vw, 92vw"
                    className="object-cover transition duration-[1.4s] ease-out-expo group-hover:scale-[1.06]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-night-950/75 via-night-950/10 to-transparent" />
                  <span aria-hidden className="absolute inset-3 rounded-[16px] border border-gold-300/0 transition duration-700 group-hover:border-gold-300/40" />
                  <span className="eyebrow absolute bottom-4 left-5 text-gold-200">{g.tag}</span>
                </span>
                <span className="flex flex-1 flex-col p-6 sm:p-7">
                  <h2 className="text-[1.9rem] leading-[1.05] transition group-hover:text-haram-800">{g.title}</h2>
                  <span className="mt-3 text-[0.97rem] leading-relaxed text-ink-600">{g.body}</span>
                  <span className="link-arrow mt-auto pt-6 text-sm">
                    Read the guide <ArrowRightIcon className="h-4 w-4" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ─── Umrah in four steps ────────────────────────────────────────────── */}
      <section className="section-night grain on-dark relative overflow-hidden">
        <StarPattern id="hub-steps-lattice" className="text-gold-300 opacity-[0.035]" />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        <div className="container-x relative py-24 lg:py-28">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Before you go"
              title="Umrah in four steps"
              accent="four steps"
              intro="Umrah has four parts: enter ihram with the intention, perform tawaf around the Kaaba, walk sa'i between Safa and Marwah, then shave or trim your hair."
            />
            <Link href={lead.href} className="link-arrow reveal min-h-11 shrink-0 self-start sm:pointer-fine:min-h-0 lg:self-auto">
              The full guide, with every dua <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <ol className="relative mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.id} className="reveal relative" style={{ "--i": i } as React.CSSProperties}>
                <Link
                  href={`${lead.href}#${s.id}`}
                  className="group flex h-full flex-col rounded-[24px] border border-white/10 bg-night-900/60 p-6 backdrop-blur-sm transition duration-500 hover:-translate-y-1 hover:border-gold-400/40 hover:bg-white/[0.05]"
                >
                  <span className="flex items-start justify-between gap-4">
                    <ArtPlate art={STEP_ART[s.id]} size="sm" tone="night" />
                    <span aria-hidden className="font-display text-[2.8rem] font-medium italic leading-none text-gold-300/90">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <h3 className="mt-6 text-[1.75rem] leading-tight text-sand-50">{s.title}</h3>
                  <span className="mt-2 text-[0.95rem] leading-relaxed text-sand-200/80">{s.body}</span>
                  <span className="link-arrow mt-auto pt-6 text-sm">
                    Step {i + 1} in full <ArrowRightIcon className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
