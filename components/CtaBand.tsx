import { PhoneIcon, WhatsAppIcon } from "./Icons";
import StarPattern from "./StarPattern";
import { site, telLink, whatsappLink } from "@/lib/site";

export default function CtaBand({
  title = "Not sure which package fits?",
  body = "Send us your dates, city and how many are travelling. We'll reply on WhatsApp with two or three options and the full price for each.",
  message = "Assalam o Alaikum, please help me choose an Umrah package.",
}: {
  title?: string;
  body?: string;
  message?: string;
}) {
  return (
    <section className="on-dark relative overflow-hidden bg-haram-900">
      <StarPattern id="cta-lattice" className="text-gold-300 opacity-[0.08]" />
      <div className="container-x relative flex flex-col items-start gap-8 py-14 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <p className="eyebrow">Talk to a person</p>
          <h2 className="mt-3 text-3xl text-sand-50 sm:text-4xl">{title}</h2>
          <p className="mt-3 text-[1.02rem] leading-relaxed text-sand-200/85">{body}</p>
          <p className="mt-2 text-sm text-gold-300">{site.contact.whatsappHours}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a href={whatsappLink(message)} className="btn btn-wa !min-h-[3.2rem] !px-7 text-base" rel="nofollow">
            <WhatsAppIcon className="h-5 w-5" />
            WhatsApp us
          </a>
          <a href={telLink()} className="btn btn-ghost !min-h-[3.2rem] !px-7 text-base">
            <PhoneIcon className="h-5 w-5" />
            {site.contact.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
