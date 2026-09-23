import type { ImageKey } from "@/lib/images";

/** The four guides, as the hub and the "more guides" band present them. */
export type GuideEntry = { href: string; title: string; body: string; image: ImageKey; tag: string };

export const guideList: GuideEntry[] = [
  {
    href: "/guides/how-to-perform-umrah/",
    title: "How to perform Umrah",
    body: "Ihram, tawaf, sa'i and halq, step by step - with the duas for each and the mistakes to avoid.",
    image: "kaabaCourtyard",
    tag: "Step by step",
  },
  {
    href: "/guides/umrah-duas/",
    title: "Duas for Umrah",
    body: "The talbiyah and every fixed dua in order, in Arabic with transliteration, meaning and source.",
    image: "kaabaNight",
    tag: "Arabic & meaning",
  },
  {
    href: "/guides/umrah-cost-from-pakistan/",
    title: "Umrah cost from Pakistan",
    body: "What a complete Umrah costs in 2026 - visa, flights, hotels, transport - and how to spend less.",
    image: "clockTower",
    tag: "Prices",
  },
  {
    href: "/guides/umrah-packing-list/",
    title: "Umrah packing list",
    body: "Documents, ihram, clothes, medicines and money - what to take from Pakistan, and what not to pack.",
    image: "nabawiUmbrellas",
    tag: "Checklist",
  },
];
