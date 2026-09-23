import { PhoneIcon, WhatsAppIcon } from "./Icons";
import StarPattern, { StarSeal } from "./StarPattern";
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
    <section className="section-night grain on-dark relative overflow-hidden">
      <StarPattern id="cta-lattice" className="text-gold-300 opacity-[0.05]" />
      <div aria-hidden className="pointer-events-none absolute -right-24 top-1/2 hidden -translate-y-1/2 text-gold-400/15 md:block">
        <StarSeal className="h-[34rem] w-[34rem] animate-spin-slow" strokeWidth={0.4} />
      </div>
      <div className="container-x relative py-20 lg:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow reveal">Talk to a person</p>
          <h2 className="h-section reveal mt-4 text-sand-50">{title}</h2>
          <p className="reveal mt-5 text-[1.06rem] leading-relaxed text-sand-200/85">{body}</p>
          <div className="reveal mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={whatsappLink(message)} className="btn btn-wa btn-lg" rel="nofollow">
              <WhatsAppIcon className="h-5 w-5" />
              WhatsApp us
            </a>
            <a href={telLink()} className="btn btn-ghost btn-lg">
              <PhoneIcon className="h-5 w-5" />
              <span className="figure">{site.contact.phoneDisplay}</span>
            </a>
          </div>
          <p className="reveal mt-4 inline-flex items-center gap-2 text-sm text-gold-300">
            <span className="h-1.5 w-1.5 rounded-full bg-wa-400 animate-pulse-dot" />
            {site.contact.whatsappHours}
          </p>
        </div>
      </div>
    </section>
  );
}
