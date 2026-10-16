import Link from "next/link";
import { Manrope } from "next/font/google";
import "./globals.css";
import StarPattern, { StarSeal } from "@/components/StarPattern";
import { site } from "@/lib/site";

/**
 * The catch-all 404 for URLs that match no route, across every root layout
 * (English site, Urdu section, admin). Enabled by experimental.globalNotFound
 * in next.config.mjs; renders without any root layout, so it brings its own
 * <html> and a minimal page. notFound() inside the English or Urdu sections
 * still uses their group-level not-found pages with full chrome.
 */

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata = {
  title: `Page not found | ${site.name}`,
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang={site.language} className={manrope.variable}>
      <body>
        <section className="section-night grain on-dark relative flex min-h-dvh items-center overflow-hidden">
          <StarPattern id="gnf-lattice" className="text-gold-300 opacity-[0.04]" />
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gold-400/10">
            <StarSeal className="h-[36rem] w-[36rem] animate-spin-slow" strokeWidth={0.4} />
          </div>
          <div className="container-x relative flex flex-col items-center py-24 text-center">
            <p className="eyebrow justify-center">Page not found</p>
            <h1 className="h-display mt-5 max-w-3xl text-[2.8rem] text-sand-50 sm:text-6xl">This page has moved or never existed</h1>
            <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-sand-200/85">
              The package you were looking for may have been updated for the new season. All current packages are on one page.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/umrah-packages/" className="btn btn-gold btn-lg">
                See Umrah packages
              </Link>
              <Link href="/" className="btn btn-ghost btn-lg">
                Home
              </Link>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
