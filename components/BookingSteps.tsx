import { PassportIcon, PlaneIcon, WalletIcon, WhatsAppIcon } from "./Icons";

const steps = [
  {
    icon: WhatsAppIcon,
    title: "Choose a package",
    body: "Pick a package here, or send us your dates, city and number of pilgrims on WhatsApp for a quote.",
  },
  {
    icon: PassportIcon,
    title: "Send your documents",
    body: "A clear photo of each passport (valid 6+ months), CNIC and a white-background photo. We check them before anything is paid.",
  },
  {
    icon: WalletIcon,
    title: "Pay and we apply",
    body: "Pay by bank transfer against a written invoice, then we apply for your Umrah visa and confirm flights and hotels.",
  },
  {
    icon: PlaneIcon,
    title: "Fly with everything in hand",
    body: "Your e-visa, e-tickets, hotel vouchers and transport schedule arrive on WhatsApp before you fly, with a number to call in Saudi Arabia.",
  },
];

/** Four steps on a gold thread that draws itself as the section scrolls into view. */
export default function BookingSteps({ onDark = false }: { onDark?: boolean }) {
  return (
    <div className="relative">
      <div aria-hidden className={`absolute left-[1.6rem] top-4 bottom-4 w-px lg:left-0 lg:right-0 lg:top-[1.6rem] lg:bottom-auto lg:h-px lg:w-auto ${onDark ? "bg-white/10" : "bg-sand-300"}`}>
        <span className="steps-thread absolute inset-0 origin-top bg-gradient-to-b from-gold-400 to-gold-600 lg:origin-left lg:bg-gradient-to-r" />
      </div>
      <ol className="relative grid gap-8 lg:grid-cols-4 lg:gap-6">
        {steps.map((s, i) => (
          <li key={s.title} className="reveal relative grid grid-cols-[3.2rem_1fr] gap-5 lg:block" style={{ "--i": i } as React.CSSProperties}>
            <span
              className={`relative z-10 flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-full border ${
                onDark ? "border-gold-400/50 bg-night-800 text-gold-300" : "border-gold-400/70 bg-sand-50 text-haram-800"
              } shadow-[0_0_0_6px_var(--ring)]`}
              style={{ "--ring": onDark ? "var(--color-night-900)" : "var(--color-sand-50)" } as React.CSSProperties}
            >
              <s.icon className="h-5 w-5" />
            </span>
            <div className="lg:mt-6">
              <p className={`font-display text-[3.2rem] font-medium italic leading-none ${onDark ? "text-gold-300/90" : "text-gold-500"}`}>
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className={`mt-2 text-[1.55rem] leading-tight ${onDark ? "text-sand-50" : ""}`}>{s.title}</h3>
              <p className={`mt-2 text-[0.95rem] leading-relaxed ${onDark ? "text-sand-200/80" : "text-ink-600"}`}>{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
