import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "../Icons";
import { guideList } from "./guideList";
import { images } from "@/lib/images";

/** The other three guides, as photo cards, closing every guide. */
export default function MoreGuides({ current }: { current: string }) {
  const others = guideList.filter((g) => g.href !== current);
  return (
    <section className="section-ivory border-t border-sand-200">
      <div className="container-x py-20 lg:py-24">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="reveal">
            <p className="eyebrow">Prepare</p>
            <p className="h-section mt-4 font-display text-ink-950">More guides</p>
          </div>
          <Link href="/guides/" className="link-arrow reveal min-h-11 shrink-0 self-start sm:self-auto sm:pointer-fine:min-h-0">
            All guides <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {others.map((g, i) => (
            <li key={g.href} className="reveal" style={{ "--i": i } as React.CSSProperties}>
              <Link href={g.href} className="card card-hover group flex h-full flex-col overflow-hidden">
                <span className="relative block aspect-[16/9] overflow-hidden">
                  <Image
                    src={images[g.image].src}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 30vw, 92vw"
                    className="object-cover transition duration-[1.4s] ease-out-expo group-hover:scale-[1.06]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-night-950/70 via-night-950/10 to-transparent" />
                  <span className="eyebrow absolute bottom-4 left-5 text-gold-200">{g.tag}</span>
                </span>
                <span className="flex flex-1 flex-col p-6">
                  <span className="font-display text-[1.65rem] font-semibold leading-tight text-ink-950 transition group-hover:text-haram-800">{g.title}</span>
                  <span className="mt-2 text-[0.95rem] leading-relaxed text-ink-600">{g.body}</span>
                  <span className="link-arrow mt-auto pt-5 text-sm">
                    Read the guide <ArrowRightIcon className="h-4 w-4" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
