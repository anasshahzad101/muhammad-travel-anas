import Link from "next/link";
import CostCalculator from "@/components/CostCalculator";
import CtaBand from "@/components/CtaBand";
import EnquiryForm from "@/components/EnquiryForm";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import PackageCard from "@/components/PackageCard";
import PackageExplorer, { type ExplorerGroup } from "@/components/PackageExplorer";
import PageHero from "@/components/PageHero";
import PriceTable from "@/components/PriceTable";
import SectionHeading from "@/components/SectionHeading";
import { CheckIcon } from "@/components/Icons";
import { CATEGORY_GROUP_LABEL, categories, type CategoryGroup } from "@/lib/categories";
import { toFinderList } from "@/lib/finder";
import { pageMetadata } from "@/lib/metadata";
import { ROOM_BASIS, cheapest, fromPrice, packages, type UmrahPackage } from "@/lib/packages";
import { itemListSchema, webPageSchema } from "@/lib/schema";
import { season } from "@/lib/season";
import { formatPKR, site } from "@/lib/site";

const low = cheapest(packages)!;
const description = `Compare every Umrah package from Pakistan: 7, 10, 15, 21 and 28 days, economy to 5-star, from ${formatPKR(low.amount)} per person with visa, flights, hotels and transport.`;

export const metadata = pageMetadata({
  title: `Umrah Package Prices ${season.label} - All Packages from Pakistan`,
  description,
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

  const explorer: ExplorerGroup[] = groups
    .map((g) => ({
      id: g.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: g.title,
      items: packages.filter(g.test).map((p, i) => ({
        key: p.slug,
        tier: p.tier,
        days: p.days,
        price: fromPrice(p).amount,
        node: <PackageCard p={p} priority={g.title === "7 days" && i < 3} index={i} />,
      })),
    }))
    .filter((g) => g.items.length > 0);

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
      a: "The number of people in a room: sharing is 5-6, quad 4, triple 3 and double 2. Fewer people per room means a higher price per person. Families usually take a quad or triple room together.",
    },
    {
      q: "Are the prices per person or per family?",
      a: "Per person. Multiply by the number of adults in your group; children's prices depend on age and are quoted separately.",
    },
    {
      q: "Can you make a custom package?",
      a: "Yes - any combination of dates, hotels and nights. Send us your plan on WhatsApp and we'll quote it.",
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            path: "/umrah-packages/",
            title: `Umrah Package Prices ${season.label}`,
            description,
            dateModified: season.pricesCheckedISO,
            type: "CollectionPage",
            image: "kaabaWide",
          }),
          itemListSchema("Umrah packages from Pakistan", packages),
        ]}
      />

      <PageHero
        crumbs={[{ name: "Umrah Packages", path: "/umrah-packages/" }]}
        eyebrow={`${season.hijriYear}H season`}
        title={`Umrah Packages ${season.label}: All Prices from Pakistan`}
        accent={season.label}
        lead={
          <p>
            {packages.length} packages from <strong className="figure text-gold-200">{formatPKR(low.amount)}</strong> per person. Every price
            includes the Umrah visa, return flights from Lahore, Karachi or Islamabad, hotels in Makkah and Madinah, and transport - the hotel
            distance is shown on each one.
          </p>
        }
        aside={
          <ul className="glass grid gap-3 rounded-[24px] p-6 text-[0.98rem] text-sand-100">
            {["Visa + insurance included", "Return flights included", "Hotels + transfers included", "Price confirmed in writing"].map((x) => (
              <li key={x} className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-300/15 text-gold-300">
                  <CheckIcon className="h-4 w-4" />
                </span>
                {x}
              </li>
            ))}
            <li className="mt-2 border-t border-white/10 pt-4">
              <a href="#calculator" className="link-arrow text-sm">
                Work out your total
              </a>
            </li>
          </ul>
        }
      >
        <nav aria-label="Filter packages" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {byGroup.map(({ g, list }) => (
            <div key={g}>
              <p className="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-gold-300">{CATEGORY_GROUP_LABEL[g]}</p>
              <ul className="mt-2.5 flex flex-wrap gap-2">
                {list.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/umrah-packages/${c.slug}/`} className="chip hover:border-gold-300/60 hover:text-white">
                      {c.h1.replace(" from Pakistan", "").replace(" Umrah Packages", "").replace("Umrah Packages for ", "")}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </PageHero>

      <section id="calculator" className="container-x scroll-mt-28 pt-20">
        <SectionHeading
          eyebrow="Your total, in seconds"
          title="Umrah cost calculator"
          accent="calculator"
          intro="Choose days, hotel and room for an instant total for your group, based on our current package prices."
        />
        <div className="mt-10">
          <CostCalculator packages={toFinderList(packages)} whatsapp={site.contact.whatsapp} pricesChecked={season.pricesChecked} />
        </div>
      </section>

      <section className="container-x pt-20">
        <SectionHeading eyebrow="Every package" title="Compare all Umrah packages" accent="all" intro="Filter by hotel or budget. Every card shows the real walking distance to both Harams." />
        <div className="mt-10">
          <PackageExplorer groups={explorer} />
        </div>
      </section>

      <section className="section-ivory mt-20 border-y border-sand-200">
        <div className="container-x py-20">
          <SectionHeading
            eyebrow="Price list"
            title="Umrah package price list"
            accent="price list"
            intro="All prices per person in PKR, including Umrah visa, return flights, hotels and transport."
          />
          <div className="mt-10">
            <PriceTable list={tableList} caption={`All Umrah packages, ${season.label}`} />
          </div>
        </div>
      </section>

      <section className="container-x grid gap-14 py-20 lg:grid-cols-[1.4fr_1fr]">
        <Faq faqs={faqs} heading="Umrah package prices: questions" />
        <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
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
