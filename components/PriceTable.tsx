import Link from "next/link";
import { ROOM_BASIS, TIERS, type RoomBasis, type UmrahPackage } from "@/lib/packages";
import { season } from "@/lib/season";
import { formatPKR } from "@/lib/site";

/**
 * Plain HTML comparison table. Tables are what answer engines lift into "how
 * much does a 15 day umrah package cost" answers, and what humans skim first.
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
    <div className="table-scroll card">
      <table className="w-full min-w-[40rem] border-collapse text-left text-[0.92rem]">
        <caption className="px-5 pt-5 text-left text-[0.85rem] text-ink-500">
          {caption} · <span className="font-semibold text-ink-700">Prices checked {season.pricesChecked}</span>
        </caption>
        <thead>
          <tr className="border-b border-sand-300 text-[0.75rem] uppercase tracking-wider text-ink-500">
            <th scope="col" className="px-5 py-3 font-bold">
              Package
            </th>
            <th scope="col" className="px-3 py-3 font-bold">
              Hotels
            </th>
            {shown.map((b) => (
              <th key={b} scope="col" className="px-3 py-3 text-right font-bold">
                {ROOM_BASIS[b].label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.map((p) => (
            <tr key={p.slug} className="border-b border-sand-200 last:border-0">
              <th scope="row" className="px-5 py-3.5 font-semibold text-ink-950">
                <Link href={`/umrah-packages/${p.slug}/`} className="hover:text-haram-700 hover:underline">
                  {p.shortName}
                </Link>
                <span className="block text-[0.78rem] font-normal text-ink-500">
                  {p.nights.makkah} + {p.nights.madinah} nights
                </span>
              </th>
              <td className="px-3 py-3.5 text-ink-700">
                {TIERS[p.tier].label}
                <span className="block text-[0.78rem] text-ink-500">Makkah {p.hotels.makkah.distance}</span>
              </td>
              {shown.map((b) => (
                <td key={b} className="whitespace-nowrap px-3 py-3.5 text-right tabular-nums text-ink-900">
                  {p.prices[b] ? formatPKR(p.prices[b]!) : <span className="text-ink-400">—</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
