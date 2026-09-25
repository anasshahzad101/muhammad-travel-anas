import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Analytics from "@/components/Analytics";
import LeadPopup from "@/components/LeadPopup";
import MobileActionBar from "@/components/MobileActionBar";
import Spotlight from "@/components/Spotlight";
import UmrahBot from "@/components/UmrahBot";
import { organizationSchema, websiteSchema } from "@/lib/schema";

/**
 * Everything a public page has around its content: header, footer, the phone
 * action bar, the lead popup, the "Let us help you" widget and click tracking.
 *
 * Used by the (site) layout and by the root not-found page. The admin area
 * sits outside the (site) group, so none of this appears on /admin/.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    // Bottom padding clears the fixed Call / WhatsApp bar on phones.
    <div className="pb-[4.6rem] sm:pb-0">
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
    </div>
  );
}
