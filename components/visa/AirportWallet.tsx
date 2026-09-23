import StarPattern from "../StarPattern";
import { PrinterIcon, SmartphoneIcon, StarGlyph } from "./icons";

/**
 * "What to carry at the airport" as a leather travel wallet holding one slip
 * per document, each marked for a printed copy and a copy on the phone. It
 * restates the paragraph beside it, so it is decorative (aria-hidden).
 */

export type WalletItem = {
  label: string;
  note?: string;
  icon: (p: { className?: string }) => React.ReactNode;
};

const TILT = ["-rotate-[0.9deg]", "rotate-[0.7deg]", "-rotate-[0.4deg]", "rotate-[0.9deg]", "-rotate-[0.6deg]"];
const TAB = ["bg-gold-400", "bg-haram-500", "bg-gold-300", "bg-haram-600", "bg-gold-500"];

export default function AirportWallet({ items, printed, phone }: { items: WalletItem[]; printed: string; phone: string }) {
  return (
    <div aria-hidden className="reveal group relative mx-auto w-full max-w-[31rem]">
      {/* Soft gold glow under the wallet. */}
      <div className="pointer-events-none absolute -inset-6 rounded-[48px] bg-gold-300/25 blur-3xl" />

      <div className="section-night grain relative overflow-hidden rounded-[32px] p-2.5 shadow-[0_60px_90px_-45px_rgb(3_11_9/0.9)] ring-1 ring-night-950/70 sm:p-3">
        <StarPattern id="wallet-lattice" size={72} className="text-gold-300 opacity-[0.05]" />
        <div className="relative rounded-[24px] border border-dashed border-gold-400/45 px-3.5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
          <div className="flex items-center justify-between gap-4 px-1">
            <p className="flex items-center gap-2 text-[0.62rem] font-extrabold uppercase tracking-[0.26em] text-gold-300">
              <StarGlyph className="h-2.5 w-2.5" />
              Travel wallet
            </p>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold-200 via-gold-400 to-gold-600 text-night-900 shadow-[inset_0_1px_0_rgb(255_255_255/0.5),0_6px_14px_-6px_rgb(0_0_0/0.8)]">
              <StarGlyph className="h-4 w-4" />
            </span>
          </div>

          <ul className="mt-5 space-y-2.5">
            {items.map((it, i) => (
              <li
                key={it.label}
                className={`relative flex items-center gap-3 overflow-hidden rounded-2xl bg-[#fffdf9] py-3 pl-4 pr-3 shadow-[0_14px_24px_-16px_rgb(0_0_0/0.9)] transition duration-700 ease-out-expo group-hover:rotate-0 sm:gap-4 sm:py-3.5 sm:pl-5 ${TILT[i % TILT.length]}`}
              >
                <span className={`absolute inset-y-0 left-0 w-1.5 ${TAB[i % TAB.length]}`} />
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sand-100 text-haram-800 ring-1 ring-sand-300/70">
                  <it.icon className="h-[1.15rem] w-[1.15rem]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.93rem] font-bold leading-tight text-ink-950">{it.label}</span>
                  {it.note ? <span className="mt-0.5 block text-[0.74rem] leading-tight text-ink-500">{it.note}</span> : null}
                </span>
                <span className="flex shrink-0 gap-1.5">
                  {[PrinterIcon, SmartphoneIcon].map((Icon, k) => (
                    <span key={k} className="relative flex h-8 w-8 items-center justify-center rounded-full bg-haram-50 text-haram-700 ring-1 ring-haram-600/15">
                      <Icon className="h-4 w-4" />
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-haram-700 text-sand-50 ring-2 ring-[#fffdf9]">
                        <svg viewBox="0 0 24 24" className="h-2 w-2" fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </span>
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.74rem] font-semibold text-sand-200/80">
            <span className="flex items-center gap-2">
              <PrinterIcon className="h-4 w-4 text-gold-300" />
              {printed}
            </span>
            <span className="flex items-center gap-2">
              <SmartphoneIcon className="h-4 w-4 text-gold-300" />
              {phone}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
