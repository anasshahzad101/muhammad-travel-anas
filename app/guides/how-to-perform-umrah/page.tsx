import Link from "next/link";
import DuaCard from "@/components/DuaCard";
import Faq from "@/components/Faq";
import GuideLayout from "@/components/GuideLayout";
import { getDua } from "@/lib/duas";
import { pageMetadata } from "@/lib/metadata";

const path = "/guides/how-to-perform-umrah/";
const title = "How to Perform Umrah: Step-by-Step Guide";
const description =
  "How to perform Umrah step by step: ihram and niyyah, tawaf, two rak'ahs at Maqam Ibrahim, sa'i between Safa and Marwah, and halq or taqsir — with the duas for each step.";

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
    a: "Yes. For an additional Umrah you leave the Haram boundary — most pilgrims go to Masjid Aisha at Taneem — put on ihram and make a fresh intention, then perform tawaf, sa'i and halq or taqsir again.",
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
    >
      <h2 id="overview">Umrah in four steps</h2>
      <ol>
        <li>
          <strong>Ihram</strong> — enter the state of ihram before the miqat, with the intention for Umrah and the
          talbiyah.
        </li>
        <li>
          <strong>Tawaf</strong> — seven circuits around the Kaaba, starting and ending at the Black Stone, then two
          rak‘ahs and Zamzam.
        </li>
        <li>
          <strong>Sa&apos;i</strong> — seven lengths between Safa and Marwah, starting at Safa and ending at Marwah.
        </li>
        <li>
          <strong>Halq or taqsir</strong> — men shave or trim their hair; women trim a fingertip&apos;s length. Your
          Umrah is complete.
        </li>
      </ol>
      <p>
        Scholars of the four madhhabs differ on some details. This guide follows the widely taught practice in Pakistan;
        where it matters, ask a scholar you trust.
      </p>

      <h2 id="ihram">1. Ihram and intention</h2>
      <h3>Before the miqat</h3>
      <p>
        The miqat is the boundary pilgrims may not cross without ihram. Flights from Pakistan cross it in the air, so put
        on your ihram at home or at the airport, and make the intention on the plane before the miqat — the crew
        usually announces it. If you are going to Madinah first, you will enter ihram later at Dhul Hulayfah (Bir Ali),
        on the road from Madinah to Makkah.
      </p>
      <ul>
        <li>Take a bath (ghusl), trim your nails and remove unwanted hair before ihram.</li>
        <li>
          <strong>Men</strong> wear two plain white unstitched sheets — one around the waist, one over the shoulders — and
          sandals that leave the top of the foot uncovered. Perfume may be applied to the body before ihram, not to the
          sheets.
        </li>
        <li>
          <strong>Women</strong> wear their normal modest clothing in any colour. In ihram a woman does not wear a niqab
          or gloves.
        </li>
        <li>If it isn&apos;t a disliked time for prayer, pray two rak‘ahs of nafl.</li>
      </ul>

      <h3>The intention and talbiyah</h3>
      <DuaCard dua={getDua("niyyah")} />
      <DuaCard dua={getDua("talbiyah")} />

      <h3>While in ihram, avoid</h3>
      <ul>
        <li>Perfume and scented soap, cutting hair or nails.</li>
        <li>For men: stitched clothing and covering the head. For women: niqab and gloves.</li>
        <li>Marital relations, arguing, and hunting.</li>
      </ul>

      <h2 id="tawaf">2. Tawaf</h2>
      <p>
        Go to your hotel first if you need to rest, then enter Masjid al-Haram with your right foot and the dua for
        entering the mosque. You need wudu for tawaf. Stop the talbiyah when you begin.
      </p>
      <DuaCard dua={getDua("enter-masjid")} />
      <ol>
        <li>
          Men uncover the right shoulder (idtiba‘) by passing the upper sheet under the right arm, for the whole tawaf.
        </li>
        <li>
          Start at the corner of the Black Stone, level with the green light on the wall. Face it, raise your right hand
          towards it and say <em>Bismillāhi wallāhu akbar</em>.
        </li>
        <li>
          Walk anticlockwise, keeping the Kaaba on your left. Men walk briskly with short steps (ramal) in the first three
          circuits if the crowd allows.
        </li>
        <li>Between the Yemeni Corner and the Black Stone, recite the dua below. The rest of each circuit, pray freely.</li>
        <li>Complete seven circuits, ending at the Black Stone.</li>
      </ol>
      <DuaCard dua={getDua("black-stone")} />
      <DuaCard dua={getDua("rabbana")} />
      <h3>After tawaf</h3>
      <p>
        Men cover the right shoulder again. Pray two rak‘ahs behind Maqam Ibrahim if there is room, otherwise anywhere in
        the mosque, then drink Zamzam.
      </p>
      <DuaCard dua={getDua("maqam")} />
      <DuaCard dua={getDua("zamzam")} />

      <h2 id="sai">3. Sa&apos;i between Safa and Marwah</h2>
      <p>
        Follow the signs to Safa. Sa&apos;i is seven lengths: Safa to Marwah is one, Marwah back to Safa is two, and so
        on, ending at Marwah. The whole route is inside the air-conditioned masa‘a, with wheelchair lanes.
      </p>
      <DuaCard dua={getDua("safa-start")} />
      <DuaCard dua={getDua("safa-marwah")} />
      <DuaCard dua={getDua("green-lights")} />

      <h2 id="halq">4. Halq or taqsir</h2>
      <p>
        After the seventh length, leave the masjid and cut your hair. Men either shave the whole head (halq, which is
        better) or trim hair evenly from the whole head (taqsir). Women gather their hair and cut about a fingertip&apos;s
        length from the ends — never in front of men who are not mahram.
      </p>
      <p>
        With that, your Umrah is complete and the restrictions of ihram are lifted. May Allah accept it from you.
      </p>

      <h2 id="mistakes">Common mistakes to avoid</h2>
      <ul>
        <li>
          <strong>Crossing the miqat without ihram.</strong> On flights from Pakistan this is easy to miss — put your ihram
          on before boarding.
        </li>
        <li>
          <strong>Starting tawaf in the wrong place.</strong> Always start and finish each circuit at the Black Stone
          line.
        </li>
        <li>
          <strong>Pushing to kiss the Black Stone.</strong> Pointing towards it is Sunnah; harming others to reach it is
          not.
        </li>
        <li>
          <strong>Keeping the shoulder uncovered in prayer.</strong> Idtiba‘ is only during the tawaf.
        </li>
        <li>
          <strong>Trimming only a few hairs.</strong> Men should shave or trim from the whole head.
        </li>
      </ul>
      <p>
        Planning your trip? Compare our <Link href="/umrah-packages/">Umrah packages from Pakistan</Link>, read the{" "}
        <Link href="/guides/umrah-duas/">full list of Umrah duas</Link>, or check the{" "}
        <Link href="/guides/umrah-packing-list/">Umrah packing list</Link>.
      </p>

      <div id="faq" className="not-prose scroll-mt-24 pt-6">
        <Faq faqs={faqs} heading="Questions about performing Umrah" />
      </div>
    </GuideLayout>
  );
}
