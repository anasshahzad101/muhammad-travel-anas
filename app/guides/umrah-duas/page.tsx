import Link from "next/link";
import DuaCard from "@/components/DuaCard";
import Faq from "@/components/Faq";
import GuideLayout from "@/components/GuideLayout";
import { getDua } from "@/lib/duas";
import { pageMetadata } from "@/lib/metadata";

const path = "/guides/umrah-duas/";
const title = "Duas for Umrah: Every Step, with Arabic & Meaning";
const description =
  "The duas for Umrah in the order you'll need them: talbiyah, entering the Haram, tawaf, Zamzam, Safa and Marwah — in Arabic with transliteration, English meaning and source.";

export const metadata = pageMetadata({ title, description, path, image: "kaabaNight" });

const sections = [
  { id: "journey", label: "Before and during the journey", duas: ["travel", "niyyah", "talbiyah"] },
  { id: "haram", label: "Entering the Haram", duas: ["enter-masjid"] },
  { id: "tawaf", label: "Tawaf", duas: ["black-stone", "rabbana", "maqam", "zamzam"] },
  { id: "sai", label: "Sa'i", duas: ["safa-start", "safa-marwah", "green-lights"] },
  { id: "leaving", label: "Leaving the masjid", duas: ["leave-masjid"] },
  { id: "madinah", label: "In Madinah", duas: ["salam"] },
];

const faqs = [
  {
    q: "Is there a fixed dua for each circuit of tawaf?",
    a: "No. Apart from takbir at the Black Stone and “Rabbana atina…” between the Yemeni Corner and the Black Stone, no specific dua is fixed for each circuit. Printed booklets with a dua per circuit are a convenience, not a requirement — you may pray in your own words and language.",
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
    >
      <p>
        Transliterations are a guide to pronunciation only — if you can, practise the Arabic with someone who reads well
        before you travel. For the full sequence of rites, see{" "}
        <Link href="/guides/how-to-perform-umrah/">how to perform Umrah step by step</Link>.
      </p>
      {sections.map((s) => (
        <section key={s.id}>
          <h2 id={s.id}>{s.label}</h2>
          <div className="space-y-4">
            {s.duas.map((id) => (
              <DuaCard key={id} dua={getDua(id)} />
            ))}
          </div>
        </section>
      ))}
      <div id="faq" className="not-prose scroll-mt-24 pt-6">
        <Faq faqs={faqs} heading="Questions about Umrah duas" />
      </div>
    </GuideLayout>
  );
}
