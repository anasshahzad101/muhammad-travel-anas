import { PhoneIcon, WhatsAppIcon } from "./Icons";
import { telLink, whatsappLink } from "@/lib/site";

/** Sticky call + WhatsApp bar on phones — most umrah enquiries in Pakistan start here. */
export default function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sand-300 bg-sand-50/95 px-3 py-2.5 shadow-[0_-8px_24px_-16px_rgb(0_0_0/0.35)] sm:hidden">
      <div className="grid grid-cols-2 gap-2.5">
        <a href={telLink()} className="btn btn-ghost !min-h-[2.8rem] bg-white">
          <PhoneIcon className="h-[1.1rem] w-[1.1rem]" />
          Call now
        </a>
        <a
          href={whatsappLink("Assalam o Alaikum, I'd like to ask about Umrah packages.")}
          className="btn btn-wa !min-h-[2.8rem]"
          rel="nofollow"
        >
          <WhatsAppIcon className="h-[1.15rem] w-[1.15rem]" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
