import type { Metadata, Viewport } from "next";
import { Amiri, Manrope } from "next/font/google";
import "../globals.css";
import { GoogleTag } from "@/components/Analytics";
import UrduChrome from "@/components/ur/UrduChrome";
import { FALLBACK_CARD, SHARE_CARD_SIZE, shareCardUrl } from "@/lib/og";
import { season } from "@/lib/season";
import { site } from "@/lib/site";

/**
 * Root layout of the Urdu section (the (ur) route group): its own <html> with
 * lang="ur" dir="rtl", so search engines and screen readers see a genuine Urdu
 * page rather than Urdu text inside an English document. Hreflang pairs are
 * declared on both sides (here and in app/(site)/layout.tsx / pageMetadata).
 *
 * Amiri covers Urdu (Nastaliq-style reading habits aside, it has every Urdu
 * character) and is the section's reading face; Manrope stays for figures -
 * prices and phone numbers follow the site rule: figures in the sans.
 */

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const urTitle = `پاکستان سے عمرہ پیکجز ${season.label} | محمد ٹریولز`;
const urDescription =
  "پاکستان سے عمرہ پیکجز 2026-27: عمرہ ویزا، واپسی ٹکٹ، حرم کے قریب ہوٹل اور سواری، سب ایک قیمت میں روپے میں۔ 7 سے 28 دن، اکانومی سے 5 سٹار۔ دفتر لاہور میں۔";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { absolute: urTitle },
  description: urDescription,
  applicationName: "محمد ٹریولز",
  openGraph: {
    type: "website",
    locale: "ur_PK",
    siteName: "محمد ٹریولز",
    url: `${site.url}/ur/`,
    title: urTitle,
    description: urDescription,
    // The branded share card is English for now; the ur card is a follow-up (see lib/og.ts).
    images: [{ url: `${site.url}${shareCardUrl(FALLBACK_CARD)}`, width: SHARE_CARD_SIZE.width, height: SHARE_CARD_SIZE.height }],
  },
  twitter: { card: "summary_large_image", title: urTitle, description: urDescription },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/ur/",
    languages: { "en-PK": "/", ur: "/ur/", "x-default": "/" },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#06120f",
};

export default function UrduRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ur" dir="rtl" className={`${manrope.variable} ${amiri.variable}`}>
      <head>
        <GoogleTag />
      </head>
      <body>
        <UrduChrome>{children}</UrduChrome>
      </body>
    </html>
  );
}
