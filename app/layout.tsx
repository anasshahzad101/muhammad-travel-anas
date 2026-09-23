import type { Metadata, Viewport } from "next";
import { Amiri, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Analytics from "@/components/Analytics";
import MobileActionBar from "@/components/MobileActionBar";
import PlaceholderBanner from "@/components/PlaceholderBanner";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { imageUrl } from "@/lib/images";
import { site } from "@/lib/site";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

// Arabic duas and the talbiyah. Not preloaded: most pages never show Arabic.
const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
  preload: false,
});

const defaultTitle = "Umrah Packages from Pakistan 2026–27 | Muhammad Travels, Lahore";

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
  themeColor: "#0b3a32",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.language} className={`${playfair.variable} ${jakarta.variable} ${amiri.variable}`}>
      <body className="pb-[4.4rem] sm:pb-0">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-haram-950 focus:px-4 focus:py-2 focus:text-sand-50"
        >
          Skip to content
        </a>
        <PlaceholderBanner />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileActionBar />
        <Analytics />
      </body>
    </html>
  );
}
