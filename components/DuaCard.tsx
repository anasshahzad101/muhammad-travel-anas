import type { Dua } from "@/lib/duas";

export default function DuaCard({ dua, showWhen = true }: { dua: Dua; showWhen?: boolean }) {
  return (
    <figure id={`dua-${dua.id}`} className="card scroll-mt-24 p-5 sm:p-6">
      {showWhen && <p className="text-[0.72rem] font-bold uppercase tracking-wider text-gold-700">{dua.when}</p>}
      <p className="arabic mt-3 text-right text-[1.6rem] text-ink-950 sm:text-[1.8rem]" lang="ar">
        {dua.arabic}
      </p>
      <p className="mt-3 text-[0.98rem] italic text-ink-700">{dua.transliteration}</p>
      <p className="mt-2 text-[0.98rem] text-ink-900">“{dua.meaning}”</p>
      <figcaption className="mt-3 text-[0.8rem] text-ink-500">Source: {dua.source}</figcaption>
      {dua.note && <p className="mt-3 rounded-lg bg-sand-100 px-3 py-2 text-[0.88rem] text-ink-700">{dua.note}</p>}
    </figure>
  );
}
