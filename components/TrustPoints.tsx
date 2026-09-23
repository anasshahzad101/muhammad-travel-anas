import { HotelIcon, PinIcon, ShieldIcon, WalletIcon } from "./Icons";
import { site } from "@/lib/site";

/**
 * The promises the whole site is built on. Each one is something a customer can
 * check for themselves — no badges or claims we can't back up.
 */
export default function TrustPoints() {
  const points = [
    {
      icon: WalletIcon,
      title: "One price, in PKR",
      body: "Visa, return flights, hotels and transport in a single per-person price. No surprise 'service charges' at the end.",
    },
    {
      icon: HotelIcon,
      title: "Real hotel distances",
      body: "Every package states how far each hotel is from the Haram, in metres — or says 'shuttle' when it is.",
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
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {points.map((p) => (
        <li key={p.title} className="flex gap-4 rounded-2xl border border-sand-300 bg-white/60 p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-haram-50 text-haram-800">
            <p.icon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-body text-[1rem] font-bold tracking-normal">{p.title}</h3>
            <p className="mt-1 text-[0.9rem] leading-relaxed text-ink-600">{p.body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
