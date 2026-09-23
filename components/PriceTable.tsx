import Link from "next/link";
import { Stars } from "./PackageCard";
import { ROOM_BASIS, TIERS, type RoomBasis, type UmrahPackage } from "@/lib/packages";
import { season } from "@/lib/season";
import { formatPKR } from "@/lib/site";

/**
 * Plain HTML comparison table. Tables are what answer engines lift into "how
 * much does a 15 day umrah package cost" answers, and what humans skim first.
 * On phones the package column stays pinned while the prices scroll.
 */
export default function PriceTable({
  list,
  caption,
  bases = ["sharing", "quad", "triple", "double"],
}: {
  list: UmrahPackage[];
  caption: string;
  bases?: RoomBasis[];
}) {
  const shown = bases.filter((b) => list.some((p) => p.prices[b]));
  return (
    <div className="card reveal overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand-200 px-5 py-4 sm:px-6">
        <p className="text-[0.85rem] text-ink-600">{caption}</p>
        <p className="inline-flex items-center gap-2 rounded-full bg-haram-50 px-3 py-1 text-[0.75rem] font-bold text-haram-800">
          <span className="h-1.5 w-1.5 rounded-full bg-haram-600" />
          Prices checked {season.pricesChecked}
        </p>
      </div>
      <div className="table-scroll">
        <table className="w-full min-w-[46rem] border-separate border-spacing-0 text-left text-[0.92rem]">
          <caption className="sr-only">
            {caption}. Prices checked {season.pricesChecked}.
          </caption>
          <thead>
            <tr className="text-[0.7rem] uppercase tracking-[0.14em] text-gold-700">
              <th scope="col" className="sticky left-0 z-10 border-b border-sand-200 bg-sand-100 px-5 py-3.5 font-extrabold sm:px-6">
                Package
              </th>
              <th scope="col" className="border-b border-sand-200 bg-sand-100 px-3 py-3.5 font-extrabold">
                Hotels
              </th>
              {shown.map((b) => (
                <th key={b} scope="col" className="border-b border-sand-200 bg-sand-100 px-4 py-3.5 text-right font-extrabold">
                  {ROOM_BASIS[b].label}
                  <span className="block text-[0.64rem] font-semibold normal-case tracking-normal text-ink-500">{ROOM_BASIS[b].people}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.slug} className="group/row">
                <th
                  scope="row"
                  className="sticky left-0 z-10 border-b border-sand-200 bg-[#fffdf9] px-5 py-4 font-semibold text-ink-950 transition-colors group-last/row:border-0 group-hover/row:bg-sand-100 sm:px-6"
                >
                  <Link href={`/umrah-packages/${p.slug}/`} className="font-display text-[1.2rem] font-semibold leading-tight transition hover:text-haram-700">
                    {p.shortName}
                  </Link>
                  <span className="figure block text-[0.76rem] font-medium text-ink-500">
                    {p.nights.makkah} + {p.nights.madinah} nights
                  </span>
                </th>
                <td className="border-b border-sand-200 px-3 py-4 text-ink-700 transition-colors group-last/row:border-0 group-hover/row:bg-sand-100">
                  <span className="flex items-center gap-2">
                    {TIERS[p.tier].label} <Stars n={p.hotels.makkah.stars} className="text-gold-500" />
                  </span>
                  <span className="figure block text-[0.76rem] text-ink-500">Makkah {p.hotels.makkah.distance}</span>
                </td>
                {shown.map((b) => (
                  <td
                    key={b}
                    className="figure whitespace-nowrap border-b border-sand-200 px-4 py-4 text-right font-bold text-ink-900 transition-colors group-last/row:border-0 group-hover/row:bg-sand-100"
                  >
                    {p.prices[b] ? (
                      formatPKR(p.prices[b]!)
                    ) : (
                      <span className="font-medium text-ink-400" aria-label="Not offered">
                        -
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
