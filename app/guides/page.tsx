import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import { ArrowRightIcon } from "@/components/Icons";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Umrah Guides — How to Perform Umrah, Duas, Costs & Packing",
  description:
    "Practical Umrah guides for pilgrims from Pakistan: how to perform Umrah step by step, the duas, what Umrah costs in 2026, and what to pack.",
  path: "/guides/",
  image: "nabawiLattice",
});

const guides = [
  {
    href: "/guides/how-to-perform-umrah/",
    title: "How to perform Umrah",
    body: "Ihram, tawaf, sa'i and halq, step by step — with the duas for each and the mistakes to avoid.",
  },
  {
    href: "/guides/umrah-duas/",
    title: "Duas for Umrah",
    body: "The talbiyah and every fixed dua in order, in Arabic with transliteration, meaning and source.",
  },
  {
    href: "/guides/umrah-cost-from-pakistan/",
    title: "Umrah cost from Pakistan",
    body: "What a complete Umrah costs in 2026 — visa, flights, hotels, transport — and how to spend less.",
  },
  {
    href: "/guides/umrah-packing-list/",
    title: "Umrah packing list",
    body: "Documents, ihram, clothes, medicines and money — what to take from Pakistan, and what not to pack.",
  },
];

export default function GuidesHub() {
  return (
    <>
      <section className="border-b border-sand-200 bg-sand-100/60">
        <div className="container-x py-10 lg:py-14">
          <Breadcrumbs items={[{ name: "Guides", path: "/guides/" }]} />
          <h1 className="mt-6 text-[2.4rem] leading-[1.06] sm:text-5xl">Umrah guides</h1>
          <p className="mt-4 max-w-2xl text-[1.06rem] leading-relaxed text-ink-700">
            Everything we explain to pilgrims before they fly, written down: the rites, the duas, the real costs and the
            packing list.
          </p>
        </div>
      </section>
      <section className="container-x py-14">
        <ul className="grid gap-5 md:grid-cols-2">
          {guides.map((g) => (
            <li key={g.href}>
              <Link href={g.href} className="card group block h-full p-7 hover:border-haram-600">
                <h2 className="text-2xl group-hover:text-haram-800">{g.title}</h2>
                <p className="mt-2 text-ink-600">{g.body}</p>
                <span className="mt-5 inline-flex items-center gap-1 font-bold text-haram-800">
                  Read the guide <ArrowRightIcon className="h-4 w-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </>
  );
}
