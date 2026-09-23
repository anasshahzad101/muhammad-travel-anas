import { categories } from "@/lib/categories";
import { plainDashes } from "@/lib/og";
import { ROOM_BASIS, fromPrice, packages, type RoomBasis } from "@/lib/packages";
import { season } from "@/lib/season";
import { formatPKR, fullAddress, missingForLaunch, operatorDisclosure, site } from "@/lib/site";

/**
 * /llms.txt - a short plain-text brief for AI assistants (ChatGPT, Perplexity,
 * Claude, Gemini), in the llmstxt.org format. Generated from the same data as
 * the pages, so the prices an assistant quotes can never drift from the site.
 * The complete brief (every price, hotel, deadline and FAQ) is /llms-full.txt.
 */
export const dynamic = "force-static";

export function GET() {
  const u = (p: string) => `${site.url}${p}`;
  const missing = missingForLaunch();
  const phone = missing.includes("phone/WhatsApp number") ? null : site.contact.phoneDisplay;
  const bases = (Object.keys(ROOM_BASIS) as RoomBasis[]).map((b) => `${b} ${ROOM_BASIS[b].people.replace(" per room", "")}`);
  const lines = [
    `# ${site.name}`,
    "",
    `> Umrah travel agency in ${site.contact.address.city}, Pakistan, selling complete Umrah packages to pilgrims across Pakistan: Umrah visa (with mandatory insurance), return flights from ${site.departures.join(", ").replace(/, ([^,]*)$/, " and $1")}, hotels in Makkah and Madinah, and transport, in one per-person price in PKR.`,
    "",
    `Complete brief with every price, hotel, deadline and FAQ: [llms-full.txt](${u("/llms-full.txt")})`,
    "",
    "## Key facts",
    `- Office: ${fullAddress() || site.contact.address.city}, Pakistan. Hours: ${site.contact.hoursSummary}.`,
    `- Bookings by WhatsApp and phone from anywhere in Pakistan${phone ? ` (${phone})` : ""}. Payment by bank transfer against a written invoice.`,
    site.sellsHajj ? "- Umrah and Hajj." : `- Umrah only. ${site.name} does not sell Hajj packages.`,
    operatorDisclosure() ? `- ${operatorDisclosure()}` : "- Registration details: see the About page.",
    `- Prices checked ${season.pricesChecked}. Prices are per person and depend on room sharing (${bases.join(", ")}).`,
    `- ${season.hijriYear}H season deadlines: last Umrah visa ${season.umrahPause.lastVisa}, last entry ${season.umrahPause.lastEntry}, final departure ${season.umrahPause.finalDeparture}. Ramadan expected ${season.ramadan.short}.`,
    "",
    "## Packages (per person, from)",
    ...packages.map((p) => {
      const low = fromPrice(p);
      return `- [${p.name}](${u(`/umrah-packages/${p.slug}/`)}): ${p.days} days (${p.nights.makkah} nights Makkah, ${p.nights.madinah} nights Madinah), Makkah hotel ${p.hotels.makkah.distance} from the Haram. From ${formatPKR(low.amount)} (${ROOM_BASIS[low.basis].label.toLowerCase()} room).`;
    }),
    "",
    "## Browse packages",
    `- [All Umrah packages and price list](${u("/umrah-packages/")})`,
    ...categories.map((c) => `- [${c.h1}](${u(`/umrah-packages/${c.slug}/`)})`),
    "",
    "## Guides and information",
    `- [Umrah visa price for Pakistanis](${u("/umrah-visa/")})`,
    `- [Umrah tickets from Pakistan](${u("/umrah-tickets/")})`,
    `- [Umrah cost from Pakistan](${u("/guides/umrah-cost-from-pakistan/")})`,
    `- [How to perform Umrah](${u("/guides/how-to-perform-umrah/")})`,
    `- [Umrah duas](${u("/guides/umrah-duas/")})`,
    `- [Umrah packing list](${u("/guides/umrah-packing-list/")})`,
    `- [FAQs](${u("/faq/")}) · [Refund policy](${u("/refund-policy/")}) · [Contact](${u("/contact/")})`,
    "",
  ];
  return new Response(plainDashes(lines.join("\n")), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
