import { HotelIcon, PinIcon, ShieldIcon, WalletIcon } from "./Icons";
import { site } from "@/lib/site";

/**
 * The promises the whole site is built on. Each one is something a customer can
 * check for themselves - no badges or claims we can't back up.
 */
export default function TrustPoints({ onDark = false, compact = false }: { onDark?: boolean; compact?: boolean }) {
  const points = [
    {
      icon: WalletIcon,
      title: "One price, in PKR",
      body: "Visa, return flights, hotels and transport in a single per-person price. No surprise 'service charges' at the end.",
    },
    {
      icon: HotelIcon,
      title: "Real hotel distances",
      body: "Every package states how far each hotel is from the Haram, in metres - or says 'shuttle' when it is.",
    },
    {
      icon: ShieldIcon,
      title: "Paperwork you can check",
      body: "Written invoice before payment, and your visa, tickets and vouchers in hand before you fly.",
    },
    {
      icon: PinIcon,
      title: `An office in ${site.contact.address.city}`,
      body: "Come and meet us, or book entirely on WhatsApp and phone from anywhere in Pakistan.",
    },
  ];
  return (
    <ul className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
      {points.map((p, i) => (
        <li
          key={p.title}
          className={`spotlight reveal group relative overflow-hidden rounded-[var(--radius-card)] border p-6 transition duration-500 ${
            onDark ? "border-white/10 bg-white/[0.03] hover:border-gold-400/40" : "border-sand-300 bg-[#fffdf9] hover:border-gold-400/60"
          }`}
          style={{ "--i": i } as React.CSSProperties}
        >
          <span className="relative flex h-14 w-14 items-center justify-center">
            <svg viewBox="0 0 56 56" className="absolute inset-0 h-full w-full text-gold-400 transition-transform duration-700 ease-out-expo group-hover:rotate-45" aria-hidden>
              <g fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="10" y="10" width="36" height="36" />
                <rect x="10" y="10" width="36" height="36" transform="rotate(45 28 28)" />
              </g>
            </svg>
            <p.icon className={`relative h-5 w-5 ${onDark ? "text-gold-300" : "text-haram-800"}`} />
          </span>
          <h3 className={`mt-5 font-display text-[1.45rem] font-semibold leading-tight ${onDark ? "text-sand-50" : ""}`}>{p.title}</h3>
          <p className={`mt-2 text-[0.93rem] leading-relaxed ${onDark ? "text-sand-200/80" : "text-ink-600"}`}>{p.body}</p>
        </li>
      ))}
    </ul>
  );
}
