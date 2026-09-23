import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import EnquiryForm from "@/components/EnquiryForm";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import PackageCard from "@/components/PackageCard";
import PriceTable from "@/components/PriceTable";
import { CheckIcon } from "@/components/Icons";
import { CATEGORY_GROUP_LABEL, categories, type CategoryGroup } from "@/lib/categories";
import { pageMetadata } from "@/lib/metadata";
import CostCalculator from "@/components/CostCalculator";
import { ROOM_BASIS, calculatorPackages, cheapest, packages, type UmrahPackage } from "@/lib/packages";
import { itemListSchema } from "@/lib/schema";
import { season } from "@/lib/season";
import { formatPKR, site } from "@/lib/site";

const low = cheapest(packages)!;

export const metadata = pageMetadata({
  title: `Umrah Package Prices ${season.label} — All Packages from Pakistan`,
  description: `Compare every Umrah package from Pakistan: 7, 10, 15, 21 and 28 days, economy to 5-star, from ${formatPKR(low.amount)} per person with visa, flights, hotels and transport.`,
  path: "/umrah-packages/",
  image: "kaabaWide",
});

const groups: { title: string; test: (p: UmrahPackage) => boolean }[] = [
  { title: "7 days", test: (p) => !p.season && p.days <= 8 },
  { title: "10 days", test: (p) => !p.season && p.days >= 9 && p.days <= 12 },
  { title: "15 days", test: (p) => !p.season && p.days >= 13 && p.days <= 17 },
  { title: "21 days", test: (p) => !p.season && p.days >= 18 && p.days <= 24 },
  { title: "28 days", test: (p) => !p.season && p.days >= 25 },
  { title: "December & Ramadan", test: (p) => Boolean(p.season) },
];

export default function PackagesHub() {
  const byGroup = (["city", "duration", "tier", "audience", "season"] as CategoryGroup[]).map((g) => ({
    g,
    list: categories.filter((c) => c.group === g),
  }));
  const tableList = [...packages].sort((a, b) => a.days - b.days || fromPriceSort(a) - fromPriceSort(b));

  const faqs = [
    {
      q: "What is the cheapest Umrah package from Pakistan?",
      a: `Our lowest complete price is ${formatPKR(low.amount)} per person in a ${ROOM_BASIS[low.basis].label.toLowerCase()} room, including visa, return flights, hotels and transport. See the economy packages for the full list.`,
    },
    {
      q: "Why do Umrah prices change?",
      a: "Two costs move constantly: airfares (which rise sharply for December and Ramadan) and Makkah hotel rates. The visa fee is fixed by Saudi Arabia. That's why we confirm your exact price in writing on the day you book.",
    },
    {
      q: "What does 'sharing', 'quad', 'triple' and 'double' mean?",
      a: "The number of people in a room: sharing is 5–6, quad 4, triple 3 and double 2. Fewer people per room means a higher price per person. Families usually take a quad or triple room together.",
    },
    {
      q: "Are the prices per person or per family?",
      a: "Per person. Multiply by the number of adults in your group; children's prices depend on age and are quoted separately.",
    },
    {
      q: "Can you make a custom package?",
      a: "Yes — any combination of dates, hotels and nights. Send us your plan on WhatsApp and we'll quote it.",
    },
  ];

  return (
    <>
      <JsonLd data={itemListSchema("Umrah packages from Pakistan", packages)} />

      <section className="border-b border-sand-200 bg-sand-100/60">
        <div className="container-x py-10 lg:py-14">
          <Breadcrumbs items={[{ name: "Umrah Packages", path: "/umrah-packages/" }]} />
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <div>
              <p className="eyebrow">{season.hijriYear}H season</p>
              <h1 className="mt-3 text-[2.4rem] leading-[1.06] sm:text-5xl">
                Umrah Packages {season.label}: All Prices from Pakistan
              </h1>
              <p className="mt-5 max-w-2xl text-[1.06rem] leading-relaxed text-ink-700">
                {packages.length} packages from {formatPKR(low.amount)} per person. Every price includes the Umrah visa, return
                flights from Lahore, Karachi or Islamabad, hotels in Makkah and Madinah, and transport — the hotel
                distance is shown on each one.
              </p>
            </div>
            <ul className="grid gap-2 text-[0.95rem] text-ink-800">
              {["Visa + insurance included", "Return flights included", "Hotels + transfers included", "Price confirmed in writing"].map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <CheckIcon className="h-5 w-5 text-haram-700" /> {x}
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Filter packages" className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {byGroup.map(({ g, list }) => (
              <div key={g}>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-gold-700">{CATEGORY_GROUP_LABEL[g]}</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {list.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/umrah-packages/${c.slug}/`} className="chip bg-white hover:border-haram-600 hover:text-haram-800">
                        {c.h1.replace(" from Pakistan", "").replace(" Umrah Packages", "").replace("Umrah Packages for ", "")}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </section>

      <section id="calculator" className="container-x scroll-mt-24 pt-14">
        <h2 className="text-3xl">Umrah cost calculator</h2>
        <p className="mt-2 max-w-2xl text-ink-600">
          Choose days, hotel and room for an instant total for your group, based on our current package prices.
        </p>
        <div className="mt-6">
          <CostCalculator packages={calculatorPackages()} whatsapp={site.contact.whatsapp} pricesChecked={season.pricesChecked} />
        </div>
      </section>

      {groups.map((g) => {
        const list = packages.filter(g.test);
        if (list.length === 0) return null;
        const id = g.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        return (
          <section key={g.title} id={id} className="container-x scroll-mt-24 pt-14">
            <h2 className="text-3xl">{g.title}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p, i) => (
                <PackageCard key={p.slug} p={p} priority={g.title === "7 days" && i < 3} />
              ))}
            </div>
          </section>
        );
      })}

      <section className="container-x py-16">
        <h2 className="text-3xl sm:text-4xl">Umrah package price list</h2>
        <p className="mt-2 max-w-2xl text-ink-600">
          All prices per person in PKR, including Umrah visa, return flights, hotels and transport.
        </p>
        <div className="mt-6">
          <PriceTable list={tableList} caption={`All Umrah packages, ${season.label}`} />
        </div>
      </section>

      <section className="container-x grid gap-12 pb-16 lg:grid-cols-[1.4fr_1fr]">
        <Faq faqs={faqs} heading="Umrah package prices: questions" />
        <div className="lg:sticky lg:top-24 lg:self-start">
          <EnquiryForm whatsapp={site.contact.whatsapp} compact heading="Need a custom package?" />
        </div>
      </section>

      <CtaBand />
    </>
  );
}

function fromPriceSort(p: UmrahPackage): number {
  return Math.min(...Object.values(p.prices).filter((v): v is number => typeof v === "number"));
}
