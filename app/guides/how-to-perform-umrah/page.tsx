import Link from "next/link";
import DuaCard from "@/components/DuaCard";
import Faq from "@/components/Faq";
import GuideLayout from "@/components/GuideLayout";
import JsonLd from "@/components/JsonLd";
import RitesExperience from "@/components/RitesExperience";
import SectionHeading from "@/components/SectionHeading";
import StarPattern, { StarSeal } from "@/components/StarPattern";
import { ArrowRightIcon, PlaneIcon, XIcon } from "@/components/Icons";
import { ArtPlate, Callout, Chapter, KeyFacts, Prose, Rows, StepTrack, Steps, SubHead, dropCap } from "@/components/guides/Article";
import { FourStepsArt, HalqArt, MiqatArt, MistakeArt, SaiArt, TawafArt } from "@/components/guides/GuideArt";
import { HeroCard } from "@/components/guides/GuideHeroArt";
import SaiDiagram from "@/components/guides/SaiDiagram";
import { getDua } from "@/lib/duas";
import { pageMetadata } from "@/lib/metadata";
import { ritesCopy } from "@/lib/rites";
import { howToSchema } from "@/lib/schema";

const path = "/guides/how-to-perform-umrah/";
const title = "How to Perform Umrah: Step-by-Step Guide";
const description =
  "How to perform Umrah step by step: ihram and niyyah, tawaf, two rak'ahs at Maqam Ibrahim, sa'i between Safa and Marwah, and halq or taqsir - with the duas for each step.";

export const metadata = pageMetadata({ title, description, path, image: "kaabaCourtyard" });

const toc = [
  { id: "overview", label: "Umrah in four steps" },
  { id: "ihram", label: "1. Ihram and intention" },
  { id: "tawaf", label: "2. Tawaf" },
  { id: "sai", label: "3. Sa'i" },
  { id: "halq", label: "4. Halq or taqsir" },
  { id: "mistakes", label: "Common mistakes" },
  { id: "faq", label: "Questions" },
];

const faqs = [
  {
    q: "How long does Umrah take?",
    a: "The rites themselves usually take three to five hours: about an hour or two for tawaf and the same for sa'i, depending on crowds. Late night and mid-morning are usually the least crowded times.",
  },
  {
    q: "Can I perform Umrah more than once on one trip?",
    a: "Yes. For an additional Umrah you leave the Haram boundary - most pilgrims go to Masjid Aisha at Taneem - put on ihram and make a fresh intention, then perform tawaf, sa'i and halq or taqsir again.",
  },
  {
    q: "What if I lose count of my circuits?",
    a: "Build on the number you are sure of. If you are unsure whether you have done four or five, count it as four and continue.",
  },
  {
    q: "Can women perform Umrah during menstruation?",
    a: "A woman may enter ihram and do everything except tawaf, which she performs once she is pure. If her return date doesn't allow this, she should ask a scholar about her situation before travelling.",
  },
  {
    q: "Is wudu required for sa'i?",
    a: "Wudu is required for tawaf. For sa'i it is recommended but not required, so if your wudu breaks during sa'i you may continue.",
  },
];

const steps = [
  { id: "ihram", name: "Ihram", text: "Enter the state of ihram before the miqat, with the intention for Umrah and the talbiyah." },
  { id: "tawaf", name: "Tawaf", text: "Seven circuits around the Kaaba, starting and ending at the Black Stone, then two rak'ahs and Zamzam." },
  { id: "sai", name: "Sa'i", text: "Seven lengths between Safa and Marwah, starting at Safa and ending at Marwah." },
  { id: "halq", name: "Halq or taqsir", text: "Men shave or trim their hair; women trim a fingertip's length. Your Umrah is complete." },
];

/* The four steps as the article lists them (a term, then what it means). */
const overview = [
  { id: "ihram", art: MiqatArt, term: "Ihram", body: "enter the state of ihram before the miqat, with the intention for Umrah and the talbiyah." },
  { id: "tawaf", art: TawafArt, term: "Tawaf", body: "seven circuits around the Kaaba, starting and ending at the Black Stone, then two rak‘ahs and Zamzam." },
  { id: "sai", art: SaiArt, term: "Sa'i", body: "seven lengths between Safa and Marwah, starting at Safa and ending at Marwah." },
  { id: "halq", art: HalqArt, term: "Halq or taqsir", body: "men shave or trim their hair; women trim a fingertip's length. Your Umrah is complete." },
];

const mistakes = [
  { tag: "Step 1 · Ihram", title: "Crossing the miqat without ihram.", body: "On flights from Pakistan this is easy to miss - put your ihram on before boarding." },
  { tag: "Step 2 · Tawaf", title: "Starting tawaf in the wrong place.", body: "Always start and finish each circuit at the Black Stone line." },
  { tag: "Step 2 · Tawaf", title: "Pushing to kiss the Black Stone.", body: "Pointing towards it is Sunnah; harming others to reach it is not." },
  { tag: "Step 2 · Tawaf", title: "Keeping the shoulder uncovered in prayer.", body: "Idtiba‘ is only during the tawaf." },
  { tag: "Step 4 · Halq", title: "Trimming only a few hairs.", body: "Men should shave or trim from the whole head." },
];

export default function HowToPerformUmrah() {
  return (
    <GuideLayout
      title={title}
      lead="Umrah has four parts: enter ihram with the intention, perform tawaf around the Kaaba, walk sa'i between Safa and Marwah, then shave or trim your hair. Here is each step as you'll actually do it, with the duas."
      path={path}
      image="kaabaCourtyard"
      toc={toc}
      published="2026-09-23"
      updated="2026-09-23"
      description={description}
      heroCard={<HeroCard label="The rites usually take" value="3-5 hours" sub="depending on crowds" />}
      feature={
        <section className="section-night grain on-dark relative overflow-hidden border-t border-gold-400/15">
          <StarPattern id="howto-lattice" className="text-gold-300 opacity-[0.035]" />
          <div className="container-x relative py-20">
            <SectionHeading
              eyebrow="See it before you go"
              title="Umrah in four steps"
              accent="four steps"
              intro="Tap a step to see it drawn out, then walk the seven circuits of tawaf or the seven lengths of sa'i with the dua for each part."
            />
            <div className="mt-12">
              <RitesExperience copy={ritesCopy()} />
            </div>
          </div>
        </section>
      }
    >
      <JsonLd
        data={howToSchema({
          path,
          name: title,
          image: "kaabaCourtyard",
          description:
            "Umrah has four parts: enter ihram with the intention, perform tawaf around the Kaaba, walk sa'i between Safa and Marwah, then shave or trim your hair. The rites themselves usually take three to five hours.",
          steps,
        })}
      />

      {/* ─── Overview ─────────────────────────────────────────────────────── */}
      <Chapter id="overview" title="Umrah in four steps" eyebrow="The whole rite" art={FourStepsArt} first>
        <ol className="grid gap-4 sm:grid-cols-2">
          {overview.map((s, i) => (
            <li
              key={s.id}
              className="card card-hover reveal group relative flex flex-col overflow-hidden p-6 sm:p-7"
              style={{ "--i": i % 2 } as React.CSSProperties}
            >
              <div className="relative flex items-start justify-between gap-4">
                <ArtPlate art={s.art} size="sm" />
                <span aria-hidden className="font-display text-[3.4rem] font-medium italic leading-[0.8] text-gold-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="relative mt-5 text-[1rem] leading-relaxed text-ink-700">
                <strong className="block font-display text-[1.75rem] font-semibold leading-tight text-ink-950">{s.term}</strong>
                <span className="sr-only"> - </span>
                <span className="mt-2 block first-letter:uppercase">{s.body}</span>
              </p>
              <a href={`#${s.id}`} className="link-arrow relative mt-auto min-h-11 pt-4 text-sm sm:pointer-fine:min-h-0">
                The step in full <ArrowRightIcon className="h-4 w-4" />
              </a>
            </li>
          ))}
        </ol>
        <Callout>
          Scholars of the four madhhabs differ on some details. This guide follows the widely taught practice in Pakistan; where it matters,
          ask a scholar you trust.
        </Callout>
      </Chapter>

      {/* ─── 1. Ihram ─────────────────────────────────────────────────────── */}
      <Chapter id="ihram" title="1. Ihram and intention" eyebrow="Step 1 of 4" art={MiqatArt} step={{ current: 1, total: 4 }}>
        <div className="space-y-6">
          <SubHead>Before the miqat</SubHead>
          <Prose>
            <p className={dropCap}>
              The miqat is the boundary pilgrims may not cross without ihram. Flights from Pakistan cross it in the air, so put on your ihram at
              home or at the airport, and make the intention on the plane before the miqat - the crew usually announces it. If you are going to
              Madinah first, you will enter ihram later at Dhul Hulayfah (Bir Ali), on the road from Madinah to Makkah.
            </p>
          </Prose>
        </div>
        <KeyFacts
          label="Ihram at a glance"
          facts={[
            { label: "Put it on", value: "At home or the airport", sub: "Flights from Pakistan cross the miqat in the air" },
            { label: "The intention", value: "On the plane", sub: "Before the miqat - the crew usually announces it" },
            { label: "Men wear", value: "Two white sheets", sub: "Plain and unstitched" },
            { label: "Women wear", value: "Modest clothing", sub: "In any colour; no niqab or gloves in ihram" },
          ]}
        />
        <Rows
          items={[
            <>Take a bath (ghusl), trim your nails and remove unwanted hair before ihram.</>,
            <>
              <strong>Men</strong> wear two plain white unstitched sheets - one around the waist, one over the shoulders - and sandals that leave the
              top of the foot uncovered. Perfume may be applied to the body before ihram, not to the sheets.
            </>,
            <>
              <strong>Women</strong> wear their normal modest clothing in any colour. In ihram a woman does not wear a niqab or gloves.
            </>,
            <>If it isn&apos;t a disliked time for prayer, pray two rak‘ahs of nafl.</>,
          ]}
        />

        <div className="space-y-6">
          <SubHead>The intention and talbiyah</SubHead>
          <DuaCard dua={getDua("niyyah")} />
          <DuaCard dua={getDua("talbiyah")} />
        </div>

        <div className="space-y-6">
          <SubHead>While in ihram, avoid</SubHead>
          <Rows
            tone="avoid"
            items={[
              <>Perfume and scented soap, cutting hair or nails.</>,
              <>For men: stitched clothing and covering the head. For women: niqab and gloves.</>,
              <>Marital relations, arguing, and hunting.</>,
            ]}
          />
        </div>
      </Chapter>

      {/* ─── 2. Tawaf ─────────────────────────────────────────────────────── */}
      <Chapter id="tawaf" title="2. Tawaf" eyebrow="Step 2 of 4" art={TawafArt} step={{ current: 2, total: 4 }}>
        <Prose>
          <p className={dropCap}>
            Go to your hotel first if you need to rest, then enter Masjid al-Haram with your right foot and the dua for entering the mosque. You
            need wudu for tawaf. Stop the talbiyah when you begin.
          </p>
        </Prose>
        <KeyFacts
          label="Tawaf at a glance"
          facts={[
            { label: "Circuits", value: "7", figure: true, sub: "Ending at the Black Stone" },
            { label: "Direction", value: "Anticlockwise", sub: "Keeping the Kaaba on your left" },
            { label: "Start and finish", value: "The Black Stone", sub: "Level with the green light on the wall" },
            { label: "Wudu", value: "Required", sub: "You need wudu for tawaf" },
          ]}
        />
        <DuaCard dua={getDua("enter-masjid")} />
        <Steps
          items={[
            <>Men uncover the right shoulder (idtiba‘) by passing the upper sheet under the right arm, for the whole tawaf.</>,
            <>
              Start at the corner of the Black Stone, level with the green light on the wall. Face it, raise your right hand towards it and say{" "}
              <em>Bismillāhi wallāhu akbar</em>.
            </>,
            <>
              Walk anticlockwise, keeping the Kaaba on your left. Men walk briskly with short steps (ramal) in the first three circuits if the crowd
              allows.
            </>,
            <>Between the Yemeni Corner and the Black Stone, recite the dua below. The rest of each circuit, pray freely.</>,
            <>Complete seven circuits, ending at the Black Stone.</>,
          ]}
        />
        <DuaCard dua={getDua("black-stone")} />
        <DuaCard dua={getDua("rabbana")} />
        <div className="space-y-6">
          <SubHead>After tawaf</SubHead>
          <Prose>
            <p>
              Men cover the right shoulder again. Pray two rak‘ahs behind Maqam Ibrahim if there is room, otherwise anywhere in the mosque, then
              drink Zamzam.
            </p>
          </Prose>
          <DuaCard dua={getDua("maqam")} />
          <DuaCard dua={getDua("zamzam")} />
        </div>
      </Chapter>

      {/* ─── 3. Sa'i ──────────────────────────────────────────────────────── */}
      <Chapter id="sai" title="3. Sa'i between Safa and Marwah" eyebrow="Step 3 of 4" art={SaiArt} step={{ current: 3, total: 4 }}>
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_19rem] xl:items-center xl:gap-10">
          <Prose>
            <p className={dropCap}>
              Follow the signs to Safa. Sa&apos;i is seven lengths: Safa to Marwah is one, Marwah back to Safa is two, and so on, ending at
              Marwah. The whole route is inside the air-conditioned masa‘a, with wheelchair lanes.
            </p>
          </Prose>
          <SaiDiagram label="Seven lengths between Safa and Marwah, starting at Safa and ending at Marwah." />
        </div>
        <KeyFacts
          label="Sa'i at a glance"
          facts={[
            { label: "Lengths", value: "7", figure: true, sub: "Safa to Marwah is one" },
            { label: "Start", value: "Safa", sub: "Follow the signs to Safa" },
            { label: "Finish", value: "Marwah", sub: "After the seventh length" },
            { label: "Wudu", value: "Recommended", sub: "But not required" },
          ]}
        />
        <DuaCard dua={getDua("safa-start")} />
        <DuaCard dua={getDua("safa-marwah")} />
        <DuaCard dua={getDua("green-lights")} />
      </Chapter>

      {/* ─── 4. Halq ──────────────────────────────────────────────────────── */}
      <Chapter id="halq" title="4. Halq or taqsir" eyebrow="Step 4 of 4" art={HalqArt} step={{ current: 4, total: 4 }}>
        <Prose>
          <p className={dropCap}>
            After the seventh length, leave the masjid and cut your hair. Men either shave the whole head (halq, which is better) or trim hair
            evenly from the whole head (taqsir). Women gather their hair and cut about a fingertip&apos;s length from the ends - never in front of
            men who are not mahram.
          </p>
        </Prose>
        <KeyFacts
          label="Halq or taqsir at a glance"
          facts={[
            { label: "When", value: "After the seventh length", sub: "Leave the masjid, then cut your hair" },
            { label: "Men", value: "Shave or trim", sub: "The whole head; shaving (halq) is better" },
            { label: "Women", value: "A fingertip's length", sub: "Cut from the ends, never in front of men who are not mahram" },
          ]}
        />
        <div className="section-night grain on-dark reveal relative overflow-hidden rounded-[28px] px-6 py-12 text-center sm:px-12 sm:py-16">
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gold-400/10">
            <StarSeal className="h-[26rem] w-[26rem] animate-spin-slow" strokeWidth={0.5} />
          </div>
          <div className="relative flex flex-col items-center">
            <StarSeal className="h-14 w-14 text-gold-300" strokeWidth={1.2} />
            <div className="mt-5">
              <StepTrack current={4} total={4} />
            </div>
            <p className="mt-7 max-w-xl font-display text-[1.75rem] font-medium leading-snug text-sand-50 sm:text-[2.2rem]">
              With that, your Umrah is complete and the restrictions of ihram are lifted.{" "}
              <span className="text-foil italic">May Allah accept it from you.</span>
            </p>
          </div>
        </div>
      </Chapter>

      {/* ─── Mistakes ─────────────────────────────────────────────────────── */}
      <Chapter id="mistakes" title="Common mistakes to avoid" eyebrow="Before you go" art={MistakeArt}>
        <div className="section-night grain on-dark relative overflow-hidden rounded-[28px] p-4 sm:p-7">
          <StarPattern id="mistakes-lattice" className="text-gold-300 opacity-[0.04]" />
          <ul className="relative grid gap-3 sm:grid-cols-2 sm:gap-4">
            {mistakes.map((m, i) => (
              <li
                key={m.title}
                className={`reveal rounded-[20px] border border-white/10 bg-white/[0.04] p-5 transition duration-500 hover:border-gold-400/35 hover:bg-white/[0.06] sm:p-6 ${
                  i === mistakes.length - 1 ? "sm:col-span-2" : ""
                }`}
                style={{ "--i": i % 2 } as React.CSSProperties}
              >
                <div className="flex items-center justify-between gap-3">
                  <span aria-hidden className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e9967a]/10 text-[#f1aa92] ring-1 ring-[#f1aa92]/30">
                    <XIcon className="h-4 w-4" />
                  </span>
                  <span className="text-[0.64rem] font-extrabold uppercase tracking-[0.16em] text-gold-300/85">{m.tag}</span>
                </div>
                <p className="mt-4 text-[0.98rem] leading-relaxed text-sand-200/85">
                  <strong className="block font-display text-[1.5rem] font-semibold leading-tight text-sand-50">{m.title}</strong>{" "}
                  <span className="mt-2 block">{m.body}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
        <Callout icon={PlaneIcon}>
          Planning your trip? Compare our <Link href="/umrah-packages/">Umrah packages from Pakistan</Link>, read the{" "}
          <Link href="/guides/umrah-duas/">full list of Umrah duas</Link>, or check the <Link href="/guides/umrah-packing-list/">Umrah packing list</Link>.
        </Callout>
      </Chapter>

      <div id="faq" className="not-prose mt-24 scroll-mt-24 sm:mt-32">
        <Faq faqs={faqs} heading="Questions about performing Umrah" />
      </div>
    </GuideLayout>
  );
}
