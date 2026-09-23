import Link from "next/link";
import DuaCard from "@/components/DuaCard";
import Faq from "@/components/Faq";
import GuideLayout from "@/components/GuideLayout";
import { ArtPlate, Chapter, Prose, dropCap } from "@/components/guides/Article";
import { EnterArt, JourneyArt, LeaveArt, MadinahArt, SaiArt, TawafArt } from "@/components/guides/GuideArt";
import { getDua } from "@/lib/duas";
import { pageMetadata } from "@/lib/metadata";
import { ritesCopy } from "@/lib/rites";

const path = "/guides/umrah-duas/";
const title = "Duas for Umrah: Every Step, with Arabic & Meaning";
const description =
  "The duas for Umrah in the order you'll need them: talbiyah, entering the Haram, tawaf, Zamzam, Safa and Marwah - in Arabic with transliteration, English meaning and source.";

export const metadata = pageMetadata({ title, description, path, image: "kaabaNight" });

const sections = [
  { id: "journey", label: "Before and during the journey", duas: ["travel", "niyyah", "talbiyah"], art: JourneyArt },
  { id: "haram", label: "Entering the Haram", duas: ["enter-masjid"], art: EnterArt },
  { id: "tawaf", label: "Tawaf", duas: ["black-stone", "rabbana", "maqam", "zamzam"], art: TawafArt },
  { id: "sai", label: "Sa'i", duas: ["safa-start", "safa-marwah", "green-lights"], art: SaiArt },
  { id: "leaving", label: "Leaving the masjid", duas: ["leave-masjid"], art: LeaveArt },
  { id: "madinah", label: "In Madinah", duas: ["salam"], art: MadinahArt },
];

const faqs = [
  {
    q: "Is there a fixed dua for each circuit of tawaf?",
    a: "No. Apart from takbir at the Black Stone and “Rabbana atina…” between the Yemeni Corner and the Black Stone, no specific dua is fixed for each circuit. Printed booklets with a dua per circuit are a convenience, not a requirement - you may pray in your own words and language.",
  },
  {
    q: "Can I make dua in Urdu during Umrah?",
    a: "Yes. Personal duas can be made in any language. It's good to learn the talbiyah and the few fixed duas in Arabic, but speak to Allah in whatever language you pray best in.",
  },
  {
    q: "Is there a special dua on first seeing the Kaaba?",
    a: "There is no authentic fixed wording. Many scholars recommend raising your hands and making sincere dua of your own when you first see the Kaaba.",
  },
];

export default function UmrahDuas() {
  const talbiyah = ritesCopy().talbiyah;
  return (
    <GuideLayout
      title={title}
      lead="Umrah has only a handful of fixed duas; the rest is your own conversation with Allah. Here they are in the order you'll need them, with the Arabic, a transliteration, the meaning and where each comes from."
      path={path}
      image="kaabaNight"
      toc={[...sections.map((s) => ({ id: s.id, label: s.label })), { id: "faq", label: "Questions" }]}
      published="2026-09-23"
      updated="2026-09-23"
      description={description}
      heroCard={
        <>
          <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-gold-300">Talbiyah</p>
          <p className="arabic mt-1 text-right text-[1.55rem] leading-[1.75] text-sand-50" lang="ar">
            {talbiyah.arabic}
          </p>
          <p className="text-[0.78rem] italic text-sand-200/85">{talbiyah.transliteration}</p>
        </>
      }
    >
      <Prose>
        <p className={dropCap}>
          Transliterations are a guide to pronunciation only - if you can, practise the Arabic with someone who reads well before you travel. For
          the full sequence of rites, see <Link href="/guides/how-to-perform-umrah/">how to perform Umrah step by step</Link>.
        </p>
      </Prose>

      {/* The six stations as a route: a visual contents list, in the order you'll need them. */}
      <nav aria-label="Duas by stage" className="@container not-prose reveal mt-12 rounded-[26px] border border-gold-400/35 bg-[linear-gradient(170deg,#fffdf9,#f8f1e3)] p-5 shadow-[0_28px_50px_-42px_rgb(20_17_13/0.55)] sm:p-7">
        <p className="eyebrow">In the order you&apos;ll need them</p>
        <ol className="relative mt-7 grid grid-cols-2 gap-x-3 gap-y-7 @md:grid-cols-3 @3xl:grid-cols-6 @3xl:gap-x-2">
          <span aria-hidden className="absolute left-[8%] right-[8%] top-[2.2rem] hidden h-px bg-gradient-to-r from-gold-400/30 via-gold-500/70 to-haram-500/50 @3xl:block" />
          {sections.map((s, i) => (
            <li key={s.id} className="relative">
              <a href={`#${s.id}`} className="group flex h-full flex-col items-center rounded-2xl px-1 pb-1 text-center">
                <span className="transition duration-500 ease-out-expo group-hover:-translate-y-1">
                  <ArtPlate art={s.art} size="sm" />
                </span>
                <span className="figure mt-3 text-[0.7rem] font-extrabold tracking-[0.12em] text-gold-600">{String(i + 1).padStart(2, "0")}</span>
                <span className="mt-1 text-[0.92rem] font-semibold leading-snug text-ink-900 transition group-hover:text-haram-800">{s.label}</span>
                <span className="mt-1 text-[0.76rem] text-ink-500">
                  <span className="figure">{s.duas.length}</span> {s.duas.length === 1 ? "dua" : "duas"}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {sections.map((s, i) => (
        <Chapter key={s.id} id={s.id} title={s.label} eyebrow={`Stage ${i + 1} of ${sections.length}`} art={s.art} step={{ current: i + 1, total: sections.length }}>
          {s.duas.map((id) => (
            <DuaCard key={id} dua={getDua(id)} />
          ))}
        </Chapter>
      ))}

      <div id="faq" className="not-prose mt-24 scroll-mt-24 sm:mt-32">
        <Faq faqs={faqs} heading="Questions about Umrah duas" />
      </div>
    </GuideLayout>
  );
}
