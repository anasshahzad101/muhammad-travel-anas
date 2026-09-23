import type { Metadata, Viewport } from "next";
import { Amiri, Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Analytics, { GoogleTag } from "@/components/Analytics";
import LeadPopup from "@/components/LeadPopup";
import MobileActionBar from "@/components/MobileActionBar";
import Spotlight from "@/components/Spotlight";
import UmrahBot from "@/components/UmrahBot";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { imageUrl } from "@/lib/images";
import { site } from "@/lib/site";

// Display serif: headings only, never prices (figures are set in the sans).
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

// Variable font: every weight from one file.
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

// Arabic duas and the talbiyah. Not preloaded: most pages show little Arabic.
const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
  preload: false,
});

// 55 characters, so search results show it whole.
const defaultTitle = "Umrah Packages from Pakistan 2026-27 | Muhammad Travels";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: defaultTitle,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    url: site.url,
    title: defaultTitle,
    description: site.description,
    images: [{ url: imageUrl("kaabaCourtyard", 1200), width: 1200 }],
  },
  twitter: { card: "summary_large_image", title: defaultTitle, description: site.description },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#06120f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.language} className={`${cormorant.variable} ${manrope.variable} ${amiri.variable}`}>
      <head>
        <GoogleTag />
      </head>
      <body className="pb-[4.6rem] sm:pb-0">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-night-900 focus:px-4 focus:py-2 focus:text-sand-50"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileActionBar />
        <Spotlight />
        <LeadPopup />
        <UmrahBot />
        <Analytics />
      </body>
    </html>
  );
}
