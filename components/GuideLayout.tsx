import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "./Breadcrumbs";
import CtaBand from "./CtaBand";
import JsonLd from "./JsonLd";
import { ArrowRightIcon } from "./Icons";
import { imageUrl, images, type ImageKey } from "@/lib/images";
import { guideNav } from "@/lib/nav";
import { cheapest, packages } from "@/lib/packages";
import { articleSchema } from "@/lib/schema";
import { formatPKR } from "@/lib/site";

export type TocItem = { id: string; label: string };

export default function GuideLayout({
  title,
  lead,
  path,
  image,
  toc,
  updated,
  published,
  description,
  children,
}: {
  title: string;
  lead: string;
  path: string;
  image: ImageKey;
  toc: TocItem[];
  updated: string;
  published: string;
  description: string;
  children: React.ReactNode;
}) {
  const img = images[image];
  const low = cheapest(packages);
  const others = guideNav.filter((g) => g.href !== path);

  return (
    <>
      <JsonLd
        data={articleSchema({
          title,
          description,
          path,
          image: imageUrl(image, 1200),
          datePublished: published,
          dateModified: updated,
        })}
      />
      <section className="border-b border-sand-200 bg-sand-100/60">
        <div className="container-x py-10 lg:py-14">
          <Breadcrumbs items={[{ name: "Guides", path: "/guides/" }, { name: title, path }]} />
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow">Umrah guide</p>
              <h1 className="mt-3 text-[2.3rem] leading-[1.08] sm:text-5xl">{title}</h1>
              <p className="mt-5 max-w-2xl text-[1.08rem] leading-relaxed text-ink-700">{lead}</p>
              <p className="mt-4 text-sm text-ink-500">
                Updated{" "}
                <time dateTime={updated}>
                  {new Date(updated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </time>
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)]">
              <Image src={img.src} alt={img.alt} fill priority sizes="(min-width: 1024px) 35vw, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <div className="container-x grid gap-12 py-12 lg:grid-cols-[16rem_1fr] xl:grid-cols-[16rem_1fr_17rem]">
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-24">
            <p className="text-[0.72rem] font-bold uppercase tracking-wider text-ink-500">On this page</p>
            <ol className="mt-3 space-y-2 border-l border-sand-300 text-[0.9rem]">
              {toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="-ml-px block border-l border-transparent pl-4 text-ink-600 hover:border-gold-500 hover:text-ink-950">
                    {t.label}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <article className="prose-mt min-w-0">{children}</article>

        <aside className="hidden xl:block">
          <div className="sticky top-24 space-y-4">
            <div className="card p-5">
              <p className="text-[0.72rem] font-bold uppercase tracking-wider text-gold-700">Ready to go?</p>
              <p className="mt-2 font-display text-xl font-semibold leading-snug">Umrah packages with visa, flights & hotels</p>
              {low && <p className="mt-2 text-sm text-ink-600">From {formatPKR(low.amount)} per person</p>}
              <Link href="/umrah-packages/" className="btn btn-primary mt-4 w-full">
                See packages
              </Link>
            </div>
            <div className="rounded-2xl border border-sand-300 p-5">
              <p className="text-[0.72rem] font-bold uppercase tracking-wider text-ink-500">More guides</p>
              <ul className="mt-3 space-y-2 text-[0.92rem]">
                {others.map((g) => (
                  <li key={g.href}>
                    <Link href={g.href} className="inline-flex items-center gap-1 text-haram-800 hover:underline">
                      {g.label} <ArrowRightIcon className="h-3.5 w-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <CtaBand title="Have a question about Umrah?" body="Ask us on WhatsApp — about rules, documents, dates or packages. No obligation to book." />
    </>
  );
}
