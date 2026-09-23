import { PhoneIcon, WhatsAppIcon } from "./Icons";
import { telLink, whatsappLink } from "@/lib/site";

/** Sticky call + WhatsApp bar on phones - most umrah enquiries in Pakistan start here. */
export default function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2 sm:hidden">
      <div className="grid grid-cols-[1fr_1.35fr] gap-2 rounded-full border border-white/10 bg-night-900/90 p-1.5 shadow-[0_18px_40px_-12px_rgb(3_11_9/0.7)] backdrop-blur-xl">
        <a href={telLink()} className="btn !min-h-[2.9rem] text-sand-50">
          <PhoneIcon className="h-[1.1rem] w-[1.1rem] text-gold-300" />
          Call now
        </a>
        <a href={whatsappLink("Assalam o Alaikum, I'd like to ask about Umrah packages.")} className="btn btn-wa !min-h-[2.9rem]" rel="nofollow">
          <WhatsAppIcon className="h-[1.15rem] w-[1.15rem]" />
          WhatsApp us
        </a>
      </div>
    </div>
  );
}
