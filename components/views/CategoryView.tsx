import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "../Breadcrumbs";
import CtaBand from "../CtaBand";
import EnquiryForm from "../EnquiryForm";
import Faq from "../Faq";
import JsonLd from "../JsonLd";
import PackageCard from "../PackageCard";
import PriceTable from "../PriceTable";
import TrustPoints from "../TrustPoints";
import { CATEGORY_GROUP_LABEL, categories, type Category } from "@/lib/categories";
import { images } from "@/lib/images";
import { packages } from "@/lib/packages";
import { itemListSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { fillTokens } from "@/lib/tokens";

export default function CategoryView({ category }: { category: Category }) {
  const list = packages.filter(category.filter).sort((a, b) => a.days - b.days || a.tier.localeCompare(b.tier));
  const t = (s: string) => fillTokens(s, list);
  const img = images[category.image];
  const siblings = categories.filter((c) => c.group === category.group && c.slug !== category.slug);
  const others = categories.filter((c) => c.group !== category.group);

  return (
    <>
      <JsonLd data={itemListSchema(category.h1, list)} />

      <section className="border-b border-sand-200 bg-sand-100/60">
        <div className="container-x grid gap-10 py-10 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:py-14">
          <div>
            <Breadcrumbs
              items={[
                { name: "Umrah Packages", path: "/umrah-packages/" },
                { name: category.h1.replace(" from Pakistan", ""), path: `/umrah-packages/${category.slug}/` },
              ]}
            />
            <p className="eyebrow mt-6">{category.eyebrow}</p>
            <h1 className="mt-3 text-[2.4rem] leading-[1.08] sm:text-5xl">{category.h1}</h1>
            <div className="mt-5 space-y-4 text-[1.06rem] leading-relaxed text-ink-700">
              {category.intro.map((p) => (
                <p key={p}>{t(p)}</p>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#packages" className="btn btn-primary">
                See {list.length} package{list.length === 1 ? "" : "s"}
              </a>
              <a href="#quote" className="btn btn-ghost">
                Get a quote
              </a>
            </div>
          </div>
          <div className="arch relative mx-auto aspect-[4/5] w-full max-w-sm lg:max-w-none">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section id="packages" className="container-x scroll-mt-24 py-14">
        {list.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p, i) => (
                <PackageCard key={p.slug} p={p} priority={i < 3} />
              ))}
            </div>
            <div className="mt-12">
              <h2 className="text-3xl">Price comparison</h2>
              <p className="mt-2 max-w-2xl text-ink-600">
                Per person, in PKR, including Umrah visa, return flights, hotels and transport. Prices move with airfares
                and hotel rates; we confirm yours in writing before you pay.
              </p>
              <div className="mt-6">
                <PriceTable list={list} caption={`${category.h1} — prices per person`} />
              </div>
            </div>
          </>
        ) : (
          <div className="card p-8 text-center">
            <h2 className="text-2xl">Packages for this category are being finalised</h2>
            <p className="mt-2 text-ink-600">Message us on WhatsApp and we&apos;ll quote you directly.</p>
          </div>
        )}
      </section>

      {category.sections.length > 0 && (
        <section className="border-y border-sand-200 bg-white/50">
          <div className="container-x grid gap-10 py-14 lg:grid-cols-2">
            {category.sections.map((s) => (
              <div key={s.heading}>
                <h2 className="text-[1.9rem]">{s.heading}</h2>
                <div className="mt-4 space-y-4 text-[1.02rem] leading-relaxed text-ink-700">
                  {s.body.map((b) => (
                    <p key={b}>{t(b)}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="container-x py-14">
        <TrustPoints />
      </section>

      <section className="container-x grid gap-12 pb-16 lg:grid-cols-[1.4fr_1fr]">
        <Faq faqs={category.faqs.map((f) => ({ q: f.q, a: t(f.a) }))} />
        <div id="quote" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
          <EnquiryForm whatsapp={site.contact.whatsapp} packageName={category.h1.replace(" from Pakistan", "")} compact />
        </div>
      </section>

      <section className="border-t border-sand-200 bg-sand-100/50">
        <div className="container-x grid gap-10 py-12 md:grid-cols-2">
          <div>
            <p className="eyebrow">{CATEGORY_GROUP_LABEL[category.group]}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {siblings.map((c) => (
                <li key={c.slug}>
                  <Link href={`/umrah-packages/${c.slug}/`} className="chip hover:border-haram-600 hover:text-haram-800">
                    {c.h1.replace(" from Pakistan", "")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">More ways to choose</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {others.map((c) => (
                <li key={c.slug}>
                  <Link href={`/umrah-packages/${c.slug}/`} className="chip hover:border-haram-600 hover:text-haram-800">
                    {c.h1.replace(" from Pakistan", "")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
