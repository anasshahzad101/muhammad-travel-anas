import Link from "next/link";
import Faq from "@/components/Faq";
import GuideLayout from "@/components/GuideLayout";
import { pageMetadata } from "@/lib/metadata";

const path = "/guides/umrah-packing-list/";
const title = "Umrah Packing List: What to Take from Pakistan";
const description =
  "A practical Umrah packing list for pilgrims from Pakistan: documents, ihram, clothes for men and women, medicines, money and the things people forget — plus what not to pack.";

export const metadata = pageMetadata({ title, description, path, image: "nabawiUmbrellas" });

const lists: { id: string; label: string; items: string[] }[] = [
  {
    id: "documents",
    label: "Documents (hand luggage)",
    items: [
      "Passport, valid at least six months, plus two photocopies",
      "CNIC and, for children, their B-form",
      "Printed and phone copies of your e-visa, e-tickets and hotel vouchers",
      "Vaccination certificates (meningitis ACYW, polio)",
      "Two passport-size photos with a white background",
      "Emergency contacts, including our number in Saudi Arabia",
    ],
  },
  {
    id: "ihram",
    label: "Ihram",
    items: [
      "Men: two sets of ihram sheets (one spare) and an ihram belt with a pocket",
      "Men: sandals or chappals that leave the top of the foot uncovered",
      "Safety pins and a small bag to carry your shoes in the Haram",
      "Unscented soap, shampoo and deodorant for while you're in ihram",
      "Put your ihram in your hand luggage — you'll change before boarding or on the plane",
    ],
  },
  {
    id: "clothes",
    label: "Clothes",
    items: [
      "Men: 4–5 shalwar kameez or thobes, loose and light-coloured",
      "Women: 4–5 loose, full-length outfits or abayas, and several scarves",
      "A light shawl or sweater: the Haram's air conditioning is cold, and December nights are cool",
      "Comfortable walking shoes that slip on and off easily",
      "Socks for walking on the Haram's marble floors",
    ],
  },
  {
    id: "health",
    label: "Health and medicines",
    items: [
      "All regular medicines for the full trip plus a week's spare, with a copy of each prescription",
      "Paracetamol, throat lozenges, ORS sachets and a cough syrup — the Umrah cough is real",
      "Blister plasters and petroleum jelly for chafing on long walks",
      "Sunscreen, sunglasses and a small umbrella for the midday sun",
      "A reusable water bottle for Zamzam inside the Haram",
    ],
  },
  {
    id: "money",
    label: "Money and phone",
    items: [
      "Some Saudi riyals in cash for the first day; cards work in most shops",
      "Tell your bank you're travelling so your card isn't blocked",
      "A Saudi SIM or eSIM (sold at the airport) — Nusuk and maps need data",
      "The Nusuk app installed and logged in before you fly",
      "Power bank and a UK-style three-pin plug adapter (Saudi sockets are type G)",
    ],
  },
  {
    id: "extras",
    label: "Worth packing",
    items: [
      "A small prayer mat and a pocket Qur'an or dua booklet",
      "A lightweight drawstring bag for shoes and a water bottle",
      "Earplugs and an eye mask for shared rooms",
      "A small, unscented wet-wipe pack",
    ],
  },
];

const faqs = [
  {
    q: "Can I bring Zamzam water in my suitcase?",
    a: "No — airlines don't allow Zamzam in checked suitcases. Each pilgrim can usually carry one sealed 5-litre Zamzam container, bought at the airport or supplied according to your airline's rules. Ask us which applies to your flight.",
  },
  {
    q: "How much luggage can I take?",
    a: "It depends on the airline and fare: most economy tickets from Pakistan include 20–30 kg checked baggage and 7 kg hand baggage. Your e-ticket shows the exact allowance.",
  },
  {
    q: "What should women not wear in ihram?",
    a: "In ihram a woman wears her normal modest clothing but does not wear a niqab (face veil) or gloves. Anything scented should be avoided.",
  },
];

export default function PackingList() {
  return (
    <GuideLayout
      title={title}
      lead="Pack light: you'll walk a lot, and almost everything can be bought in Makkah or Madinah. What you can't buy there — documents, medicines and a spare ihram — goes in your hand luggage."
      path={path}
      image="nabawiUmbrellas"
      toc={[...lists.map((l) => ({ id: l.id, label: l.label })), { id: "faq", label: "Questions" }]}
      published="2026-09-23"
      updated="2026-09-23"
      description={description}
    >
      {lists.map((l) => (
        <section key={l.id}>
          <h2 id={l.id}>{l.label}</h2>
          <ul>
            {l.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </section>
      ))}
      <p>
        Ready to book? Compare <Link href="/umrah-packages/">Umrah packages from Pakistan</Link>, or read{" "}
        <Link href="/guides/how-to-perform-umrah/">how to perform Umrah</Link> before you go.
      </p>
      <div id="faq" className="not-prose scroll-mt-24 pt-6">
        <Faq faqs={faqs} heading="Packing questions" />
      </div>
    </GuideLayout>
  );
}
