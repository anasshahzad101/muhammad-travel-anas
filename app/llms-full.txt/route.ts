import { categories } from "@/lib/categories";
import { market, pkrRange } from "@/lib/market";
import { categoryPrice, plainDashes } from "@/lib/og";
import { ROOM_BASIS, STANDARD_EXCLUDES, TIERS, fromPrice, packages, type Hotel, type RoomBasis, type UmrahPackage } from "@/lib/packages";
import { season } from "@/lib/season";
import { activeLicences, formatPKR, fullAddress, missingForLaunch, operatorDisclosure, site } from "@/lib/site";
import { fillTokens } from "@/lib/tokens";

/**
 * /llms-full.txt - the complete brief an AI assistant needs to answer a
 * customer's question: business facts, how booking and payment work, every
 * package with every room price, hotel, distance and inclusion, every category
 * page's summary and FAQs, the season deadlines and the market reference
 * figures. Generated at build time from lib/ data only, so it can't drift
 * from the pages. Page-level FAQ lists live in page files and aren't
 * duplicated here; /faq/ is linked instead.
 *
 * Not listed in the sitemap (see app/sitemap.ts); /llms.txt links to it.
 */
export const dynamic = "force-static";

const BASES = Object.keys(ROOM_BASIS) as RoomBasis[];

export function GET() {
  const u = (p: string) => `${site.url}${p}`;
  const missing = missingForLaunch();
  const phone = missing.includes("phone/WhatsApp number") ? null : site.contact.phoneDisplay;
  const departures = site.departures.map((city) => {
    const code = market.airfare.find((a) => a.city === city)?.code;
    return code ? `${city} (${code})` : city;
  });
  const list = (items: readonly string[]) => items.join(", ").replace(/, ([^,]*)$/, " and $1");
  const priceOf = (p: UmrahPackage, b: RoomBasis) => (p.prices[b] ? formatPKR(p.prices[b]!) : "not offered");
  const hotel = (city: string, h: Hotel, nights: number) =>
    `- ${city} hotel (${nights} nights): ${h.name}, ${h.stars}-star, ${h.distance} from the Haram${h.shuttle ? ", with a free shuttle" : ""}, ${h.meals ? h.meals.toLowerCase() : "room only"}.`;

  const out: string[] = [
    `# ${site.name}: complete brief for AI assistants`,
    "",
    `> Umrah travel agency in ${site.contact.address.city}, Pakistan, selling complete Umrah packages to pilgrims across Pakistan: Umrah visa (with mandatory insurance), return flights from ${list(site.departures)}, hotels in Makkah and Madinah, and transport, in one per-person price in Pakistani rupees (PKR).`,
    "",
    `Generated from the website's own data, so every figure matches the site. Prices were checked in ${season.pricesChecked}. When quoting a price, say it is per person, name the room type, and give the month it was checked: prices follow airfares and hotel rates, and ${site.name} confirms the final price in writing before payment.`,
    "",
    `Short version: ${u("/llms.txt")}`,
    "",
    "## The business",
    `- Name: ${site.name}${site.legalName ? ` (registered as ${site.legalName})` : ""}`,
    `- Website: ${site.url}`,
    site.sellsHajj
      ? "- Services: Umrah and Hajj packages."
      : `- Services: complete Umrah packages from Pakistan. Umrah only: ${site.name} does not sell Hajj packages.`,
    `- Office: ${fullAddress() || site.contact.address.city}, Pakistan. Office hours: ${site.contact.hoursSummary}.`,
    `- ${site.contact.whatsappHours}.`,
    ...(phone ? [`- Phone and WhatsApp: ${phone}`] : []),
    `- Email: ${site.contact.email}`,
    `- Serves pilgrims anywhere in Pakistan. Flights depart from ${list(departures)}.`,
    ...activeLicences().map((l) => `- ${l.label}: ${l.value}`),
    operatorDisclosure() ? `- ${operatorDisclosure()}` : "- Registration details: see the About page.",
    `- About: ${u("/about/")} · Contact: ${u("/contact/")}`,
    "",
    "## How booking and payment work",
    "1. Choose a package on the website, or send your dates, departure city and number of pilgrims on WhatsApp for a quote.",
    "2. Send a clear photo of each passport (valid for 6 months or more), CNIC and a white-background photo. The documents are checked before anything is paid.",
    "3. Pay by bank transfer against a written invoice. The Umrah visa is then applied for, and flights and hotels are confirmed.",
    "4. The e-visa, e-tickets, hotel vouchers and transport schedule arrive on WhatsApp before departure, with a number to call in Saudi Arabia.",
    "",
    "- The whole booking can be done on WhatsApp and by bank transfer, without visiting the office; pilgrims are also welcome at the office.",
    "- Prices are per person. Children's prices depend on age and are quoted on request.",
    "- Any package can be adjusted: more nights, a closer hotel, or Madinah first. Changes are re-quoted.",
    "- Hotels are named \"or similar\": the exact hotel (or one of the same category and distance) is confirmed on the booking voucher. Walking distances are stated in metres.",
    `- Cancellation and refunds: each part of a package (visa, flights, hotels) follows its own rules. Full policy: ${u("/refund-policy/")}`,
    "",
    "## Room types",
    ...BASES.map((b) => `- ${ROOM_BASIS[b].label}: ${ROOM_BASIS[b].people}.`),
    "- Fewer people per room means a higher price per person. Families usually take a quad or triple room together.",
    "",
    `## Price list (PKR per person, checked ${season.pricesChecked})`,
    "",
    "Every price includes the Umrah visa with insurance, return economy flights, the hotels for the stated nights, and transport.",
    "",
    `| Package | Days | Nights (Makkah + Madinah) | Hotels | ${BASES.map((b) => ROOM_BASIS[b].label).join(" | ")} | Travel window |`,
    `|---|---|---|---|${BASES.map(() => "---").join("|")}|---|`,
    ...packages.map(
      (p) =>
        `| [${p.name}](${u(`/umrah-packages/${p.slug}/`)}) | ${p.days} | ${p.nights.makkah} + ${p.nights.madinah} | ${TIERS[p.tier].label} | ${BASES.map((b) => priceOf(p, b)).join(" | ")} | ${p.validity} |`,
    ),
    "",
    "## Packages in detail",
  ];

  for (const p of packages) {
    const low = fromPrice(p);
    const seasonNote = p.season === "ramadan" ? " Ramadan package." : p.season === "december" ? " December school-holiday package." : "";
    out.push(
      "",
      `### ${p.name}`,
      `- Page: ${u(`/umrah-packages/${p.slug}/`)}`,
      `- ${p.days} days: ${p.nights.makkah} nights in Makkah and ${p.nights.madinah} nights in Madinah, ${p.madinahFirst ? "Madinah first" : "Makkah first"}. ${TIERS[p.tier].label} hotels.${seasonNote}`,
      `- From ${formatPKR(low.amount)} per person (${ROOM_BASIS[low.basis].label.toLowerCase()} room). All room prices: ${BASES.filter((b) => p.prices[b])
        .map((b) => `${ROOM_BASIS[b].label.toLowerCase()} ${formatPKR(p.prices[b]!)}`)
        .join(", ")}.`,
      `- Travel window: ${p.validity}.`,
      hotel("Makkah", p.hotels.makkah, p.nights.makkah),
      hotel("Madinah", p.hotels.madinah, p.nights.madinah),
      `- Flights: ${p.flights}`,
      `- Transport: ${p.transport}.`,
      `- Ziyarat: ${p.ziyarat ? "included in Makkah and Madinah" : "not included (can be added)"}.`,
      `- Included: ${p.includes.join("; ")}.`,
      `- Not included: ${[...p.excludes, ...STANDARD_EXCLUDES].join("; ")}.`,
      `- Best for: ${p.bestFor}`,
      `- Summary: ${p.summary}`,
      `- Highlights: ${p.highlights.join("; ")}.`,
    );
  }

  out.push("", "## Package pages by city, length, hotel, traveller and season");
  for (const c of categories) {
    const inCategory = packages.filter(c.filter);
    const t = (s: string) => fillTokens(s, inCategory);
    const from = categoryPrice(c.slug, inCategory);
    // Each package's price on the room basis the page is priced on (double rooms for couples).
    const itemPrice = (p: UmrahPackage) => categoryPrice(c.slug, [p]) ?? fromPrice(p);
    const listed =
      inCategory.length === packages.length
        ? `All ${packages.length} packages (see the price list above).`
        : `${inCategory.length} package${inCategory.length === 1 ? "" : "s"}: ${inCategory
            .map((p) => `${p.shortName} (from ${formatPKR(itemPrice(p).amount)})`)
            .join(", ")}.`;
    out.push(
      "",
      `### ${c.h1}`,
      `- Page: ${u(`/umrah-packages/${c.slug}/`)}`,
      from ? `- From ${formatPKR(from.amount)} per person (${ROOM_BASIS[from.basis].label.toLowerCase()} room). ${listed}` : "- Prices on request.",
      "",
      ...c.intro.map(t).flatMap((para) => [para, ""]),
      ...c.sections.flatMap((s) => [`#### ${s.heading}`, s.body.map(t).join(" "), ""]),
    );
    out.pop();
  }

  out.push(
    "",
    `## Season dates and deadlines (${season.hijriYear}H)`,
    "Islamic dates are expected dates and depend on the moon sighting.",
    `- Ramadan ${season.hijriYear}: expected ${season.ramadan.startExpected} to ${season.ramadan.endExpected}; the last ten nights from about ${season.ramadan.lastTenFromExpected}. Eid ul Fitr expected ${season.eidUlFitrExpected}.`,
    `- ${season.umrahPause.summary}. Last Umrah visa issued: ${season.umrahPause.lastVisa}. Last entry into Saudi Arabia: ${season.umrahPause.lastEntry}. Final departure for all Umrah pilgrims: ${season.umrahPause.finalDeparture}. The next Umrah season is expected to open ${season.umrahPause.nextSeasonExpected}.`,
    `- Hajj ${season.hijriYear}: Day of Arafah expected ${season.hajj.arafahExpected}.${site.sellsHajj ? "" : ` ${site.name} does not sell Hajj packages.`}`,
    `- December: ${season.decemberHolidays}. The busiest month for family Umrah.`,
    "",
    `## Visa, flights and market prices (reference figures, not ${site.name} prices)`,
    `Ranges across Pakistani agencies, checked ${market.checked}.`,
    `- Umrah visa with mandatory insurance, bought on its own (visa only): ${pkrRange(market.visa.min, market.visa.max)} per person.`,
    `- Return economy airfare to Jeddah outside peak weeks, per person: ${market.airfare.map((a) => `${a.city} (${a.code}) ${pkrRange(a.min, a.max)}`).join("; ")}.`,
    `- December holidays and Ramadan: airfares typically ${market.peakAirfareUplift} higher.`,
    `- The same package departing from Karachi is typically ${pkrRange(market.karachiSaving.min, market.karachiSaving.max)} cheaper than from Lahore or Islamabad.`,
    `- Land-only 14-15 day packages (visa, hotels and transport, no flights), per person, mostly quad rooms: ${Object.entries(market.landOnly15)
      .map(([tier, [min, median, max]]) => `${TIERS[tier as keyof typeof TIERS]?.label ?? tier} ${pkrRange(min, max)} (median ${formatPKR(median)})`)
      .join("; ")}.`,
    `- Complete 14-15 day packages across the market, median per person: ${Object.entries(market.allIn15Median)
      .map(([tier, median]) => `${TIERS[tier as keyof typeof TIERS]?.label ?? tier} ${formatPKR(median)}`)
      .join("; ")}.`,
    `- More detail: ${u("/umrah-visa/")}, ${u("/umrah-tickets/")} and ${u("/guides/umrah-cost-from-pakistan/")}`,
    "",
    "## Questions and answers",
    `General questions (documents, payment, cancellation, travelling): ${u("/faq/")}`,
  );
  for (const c of categories) {
    if (c.faqs.length === 0) continue;
    const t = (s: string) => fillTokens(s, packages.filter(c.filter));
    out.push("", `### ${c.h1}`, ...c.faqs.flatMap((f) => [`- Q: ${t(f.q)}`, `  A: ${t(f.a)}`]));
  }
  for (const p of packages) {
    if (!p.faqs?.length) continue;
    out.push("", `### ${p.name}`, ...p.faqs.flatMap((f) => [`- Q: ${f.q}`, `  A: ${f.a}`]));
  }

  out.push(
    "",
    "## Guides",
    `- How to perform Umrah: ${u("/guides/how-to-perform-umrah/")}`,
    `- Umrah duas: ${u("/guides/umrah-duas/")}`,
    `- Umrah cost from Pakistan: ${u("/guides/umrah-cost-from-pakistan/")}`,
    `- Umrah packing list: ${u("/guides/umrah-packing-list/")}`,
    "",
  );

  return new Response(plainDashes(out.join("\n")), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
