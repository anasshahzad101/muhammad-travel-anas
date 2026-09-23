/**
 * Image registry + licence record.
 *
 * Every photo is recorded with its source and licence so provenance stays
 * auditable. All are from Unsplash under the Unsplash Licence (free for
 * commercial use, no attribution required; may not be sold unaltered or used to
 * build a competing photo service). Unsplash+ "premium" images are excluded.
 *
 * Photos are served straight from Unsplash's imgix CDN through the global loader
 * (lib/image-loader.ts), which requests exactly the width the browser needs in
 * AVIF/WebP. Swap in our
 * own photography (office, team, real groups with consent) as it becomes
 * available - genuine photos out-convert stock in this market.
 *
 * Rule: no identifiable faces in the foreground (none of these people consented
 * to advertise a travel agency), and never a photo nobody has actually looked at.
 */

import imageLoader from "./image-loader";

export type SiteImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  credit: { photographer: string; source: "Unsplash"; id: string; licence: "Unsplash Licence" };
};

const u = (path: string) => `https://images.unsplash.com/${path}`;

export const images = {
  kaabaTowers: {
    src: u("photo-1720549973451-018d3623b55a"),
    alt: "The Kaaba in the courtyard of Masjid al-Haram with the Abraj Al-Bait clock tower rising behind it",
    width: 2984,
    height: 3977,
    credit: { photographer: "Danish Habib", source: "Unsplash", id: "Jyj3Q1eIELI", licence: "Unsplash Licence" },
  },
  kaabaCourtyard: {
    src: u("photo-1693590614566-1d3ea9ef32f7"),
    alt: "Pilgrims performing tawaf around the Kaaba in Masjid al-Haram, Makkah",
    width: 4096,
    height: 3072,
    credit: { photographer: "Sam Riz", source: "Unsplash", id: "ceNCWYqL8DY", licence: "Unsplash Licence" },
  },
  kaabaWide: {
    src: u("photo-1770786106021-52580470e31e"),
    alt: "Pilgrims circling the Kaaba at the Grand Mosque in Makkah",
    width: 4000,
    height: 2252,
    credit: { photographer: "Jubair Hossain", source: "Unsplash", id: "WuIroq-Q1hY", licence: "Unsplash Licence" },
  },
  kaabaNight: {
    src: u("photo-1771170983433-1576bc4a7eec"),
    alt: "Close-up of the Kaaba's black kiswah and its gold-embroidered band",
    width: 4284,
    height: 5712,
    credit: { photographer: "Rumman Amin", source: "Unsplash", id: "tvEDhFhBhXM", licence: "Unsplash Licence" },
  },
  // Checked visually 2026-09-23: this is the photo that actually shows the Clock
  // Tower (Abraj Al Bait) over the Kaaba - used for the 5-star packages.
  clockTower: {
    src: u("photo-1592326871020-04f58c1a52f3"),
    alt: "The Makkah Clock Tower rising above Masjid al-Haram and the Kaaba in bright sunlight",
    width: 3277,
    height: 4096,
    credit: { photographer: "Ishan (seefromthesky)", source: "Unsplash", id: "66Tu10CxYY0", licence: "Unsplash Licence" },
  },
  // Listed on Unsplash as a "clock tower", but it is a minaret and palm tree; the
  // mosque is unidentified, so the alt text stays generic.
  minaretPalm: {
    src: u("photo-1707044640598-828ee7db5dca"),
    alt: "A white minaret beside a palm tree under a bright blue sky",
    width: 3024,
    height: 4032,
    credit: { photographer: "Giyani Hardinia", source: "Unsplash", id: "7j_H6KimBuE", licence: "Unsplash Licence" },
  },
  nabawiWide: {
    src: u("photo-1667454872134-c25973237138"),
    alt: "The Green Dome and minarets of Masjid an-Nabawi in Madinah under a clear sky",
    width: 6000,
    height: 3376,
    credit: { photographer: "djonk creative", source: "Unsplash", id: "AdZ68iA9X08", licence: "Unsplash Licence" },
  },
  nabawiDome: {
    src: u("photo-1575101261474-5cb5653bb416"),
    alt: "The Green Dome of the Prophet's Mosque in Madinah with its minarets",
    width: 4000,
    height: 3000,
    credit: { photographer: "Ryan Pradipta Putra", source: "Unsplash", id: "MWJ7JpFBlGk", licence: "Unsplash Licence" },
  },
  nabawiPortrait: {
    src: u("photo-1605976528013-638e49b6599f"),
    alt: "Masjid an-Nabawi in Madinah, its minarets and Green Dome seen from the courtyard",
    width: 3000,
    height: 4000,
    credit: { photographer: "Haidan", source: "Unsplash", id: "Qec3HPaHWTI", licence: "Unsplash Licence" },
  },
  nabawiUmbrellas: {
    src: u("photo-1602769490455-36cf9734dbcb"),
    alt: "The courtyard of the Prophet's Mosque in Madinah shaded by its giant umbrellas",
    width: 6000,
    height: 4000,
    credit: { photographer: "Haidan", source: "Unsplash", id: "RhkbHU14MoA", licence: "Unsplash Licence" },
  },
  nabawiLattice: {
    src: u("photo-1667454496584-9838026037af"),
    alt: "The Green Dome of the Prophet's Mosque framed through a star-shaped lattice",
    width: 6000,
    height: 3376,
    credit: { photographer: "djonk creative", source: "Unsplash", id: "3s1PFrCy488", licence: "Unsplash Licence" },
  },
  uhud: {
    src: u("photo-1633174754673-95dd2842f8fc"),
    alt: "Sayyid al-Shuhada Mosque at the foot of Mount Uhud in Madinah, a stop on the ziyarat tour",
    width: 5412,
    height: 3045,
    credit: { photographer: "Afif Ramdhasuma", source: "Unsplash", id: "6XT5TpooP0g", licence: "Unsplash Licence" },
  },
} satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;

/** Absolute URL at a fixed width, for Open Graph tags and JSON-LD. */
export function imageUrl(key: ImageKey, width = 1200): string {
  return imageLoader({ src: images[key].src, width });
}
