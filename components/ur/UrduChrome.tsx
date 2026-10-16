import Link from "next/link";
import { Mark } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/Icons";
import { site, whatsappLink } from "@/lib/site";
import { WHATSAPP_HOURS_UR } from "./format";

/**
 * The Urdu section's chrome: a light header and footer, Urdu-first. Deliberately
 * simpler than the English SiteChrome - no lead popup or chatbot until those
 * speak Urdu. The language switcher links to the English page by full URL
 * (moving between root layouts is always a full page load, which is what makes
 * the <html lang> switch take effect).
 */
export default function UrduChrome({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "var(--font-arabic)" }}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:right-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-night-900 focus:px-4 focus:py-2 focus:text-sand-50">
        اصل مواد پر جائیں
      </a>
      <header className="sticky top-0 z-50 border-b border-sand-200/70 bg-sand-50/90 backdrop-blur">
        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-4">
          <Link href="/ur/" className="flex items-center gap-3">
            <Mark className="h-9 w-9" />
            <span className="text-[1.35rem] font-bold text-ink-950">محمد ٹریولز</span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-5">
            <Link href="/ur/umrah-packages/" className="hidden min-h-11 items-center text-[1.05rem] font-semibold text-ink-800 hover:text-haram-800 sm:flex">
              عمرہ پیکجز اور قیمتیں
            </Link>
            <Link href="/ur/guides/" className="hidden min-h-11 items-center text-[1.05rem] font-semibold text-ink-800 hover:text-haram-800 sm:flex">
              رہنمائی
            </Link>
            <a
              href={whatsappLink("السلام علیکم، مجھے عمرہ پیکج کے بارے میں معلومات چاہئیں۔")}
              rel="nofollow"
              className="btn btn-gold min-h-11 !px-4 text-[1rem]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              واٹس ایپ
            </a>
            <Link href="/" hrefLang="en-PK" className="flex min-h-11 items-center rounded-full border border-sand-300 px-4 text-sm font-semibold text-ink-700 hover:border-gold-400" style={{ fontFamily: "var(--font-body)" }}>
              English
            </Link>
          </nav>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className="section-night on-dark mt-24 border-t border-gold-400/20">
        <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-[1.5rem] font-bold text-sand-50">محمد ٹریولز</p>
            <p className="mt-3 max-w-xs text-[1rem] leading-relaxed text-sand-200/85">
              پاکستان سے عمرہ پیکجز: ویزا، ٹکٹ، ہوٹل اور سواری ایک قیمت میں۔ دفتر لاہور میں، بکنگ پورے پاکستان سے واٹس ایپ اور فون پر۔
            </p>
          </div>
          <div>
            <p className="eyebrow">رابطہ</p>
            <ul className="mt-4 space-y-2.5 text-[1.05rem] text-sand-100">
              <li>
                <a href={`tel:${site.contact.phoneE164}`} className="figure" dir="ltr" style={{ fontFamily: "var(--font-body)" }}>
                  {site.contact.phoneE164}
                </a>
              </li>
              <li>{WHATSAPP_HOURS_UR}</li>
              <li>{site.contact.address.city}، پاکستان</li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">صفحات</p>
            <ul className="mt-4 space-y-2.5 text-[1.05rem] text-sand-100">
              <li>
                <Link href="/ur/umrah-packages/" className="hover:text-gold-200">
                  عمرہ پیکجز اور قیمتیں
                </Link>
              </li>
              <li>
                <Link href="/ur/guides/" className="hover:text-gold-200">
                  عمرہ گائیڈز
                </Link>
              </li>
              <li>
                <Link href="/" hrefLang="en-PK" className="hover:text-gold-200" style={{ fontFamily: "var(--font-body)" }}>
                  Full site in English
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-[0.9rem] text-sand-200/60">
          © {new Date().getFullYear()} محمد ٹریولز
        </div>
      </footer>
    </div>
  );
}
