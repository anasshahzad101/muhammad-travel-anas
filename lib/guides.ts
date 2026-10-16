import type { ImageKey } from "./images";

/**
 * The guides, as the hub, the "more guides" band, the llms files and the
 * sitemap present them. One list, one source of truth: adding a guide here
 * plus its page file is the whole job (the sitemap and llms files read this).
 */
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
  {
    href: "/guides/umrah-vaccination-requirements/",
    title: "Umrah vaccination requirements",
    body: "The meningitis ACYW vaccine, the polio dose and the NADRA certificate - what Pakistanis need, and when.",
    image: "minaretPalm",
    tag: "Documents",
  },
  {
    href: "/guides/nusuk-app-guide/",
    title: "Nusuk app guide",
    body: "Setting up Nusuk on your phone, booking a Rawdah slot in Madinah, and fixing the common problems.",
    image: "nabawiPortrait",
    tag: "Apps & permits",
  },
];
