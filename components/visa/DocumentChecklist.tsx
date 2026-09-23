import { CheckIcon } from "../Icons";
import { StarFrame } from "./icons";

/**
 * The visa documents as a bento of cards. Each card has a tick a pilgrim can
 * set while gathering papers: a plain checkbox styled with CSS (`:has` and
 * `peer`), so it works with no JavaScript and the server HTML carries every
 * word. Ticks are not saved; this is a checklist for the moment.
 */

export type DocItem = {
  key: string;
  title: string;
  body: React.ReactNode;
  icon: (p: { className?: string }) => React.ReactNode;
  /** Take two columns from tablet width up (for the longest item). */
  wide?: boolean;
  extra?: React.ReactNode;
};

export default function DocumentChecklist({ items }: { items: DocItem[] }) {
  return (
    <ul className="grid gap-5 sm:grid-flow-row-dense sm:grid-cols-2 lg:grid-cols-3">
      {items.map((d, i) => (
        <li
          key={d.key}
          className={`card spotlight reveal group flex flex-col overflow-hidden p-6 transition-[transform,border-color,box-shadow,background-color] duration-500 ease-out-expo hover:border-gold-400/60 hover:[transform:translateY(-4px)] has-[:checked]:border-haram-600/40 has-[:checked]:bg-haram-50 sm:p-7 ${
            d.wide ? "sm:col-span-2" : ""
          }`}
          style={{ "--i": i % 3 } as React.CSSProperties}
        >
          <div className="flex items-start justify-between gap-4">
            <StarFrame>
              <d.icon className="h-5 w-5" />
            </StarFrame>
            <label className="-mr-2 -mt-1 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full">
              <input type="checkbox" className="peer sr-only" aria-label={`Tick off: ${d.title}`} />
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-full border border-sand-400 bg-white text-transparent shadow-[inset_0_1px_2px_rgb(20_17_13/0.08)] transition duration-300 group-hover:border-haram-600 peer-checked:border-haram-700 peer-checked:bg-haram-700 peer-checked:text-sand-50 peer-focus-visible:ring-2 peer-focus-visible:ring-gold-500 peer-focus-visible:ring-offset-2"
              >
                <CheckIcon className="h-4 w-4" />
              </span>
            </label>
          </div>
          <h3 className="mt-5 font-display text-[1.55rem] font-semibold leading-tight text-ink-950">{d.title}</h3>
          <div className="mt-2 text-[0.97rem] leading-relaxed text-ink-700 [&_strong]:text-ink-950">{d.body}</div>
          {d.extra}
        </li>
      ))}
    </ul>
  );
}
