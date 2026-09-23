import { categories } from "@/lib/categories";
import { ROOM_BASIS, fromPrice, packages } from "@/lib/packages";
import { season } from "@/lib/season";
import { formatPKR, fullAddress, operatorDisclosure, site } from "@/lib/site";

/**
 * /llms.txt — a plain-text brief for AI assistants (ChatGPT, Perplexity, Claude,
 * Gemini). Generated from the same data as the pages, so the prices an assistant
 * quotes can never drift from the site.
 */
export const dynamic = "force-static";

export function GET() {
  const u = (p: string) => `${site.url}${p}`;
  const lines = [
    `# ${site.name}`,
    "",
    `> Umrah travel agency in ${site.contact.address.city}, Pakistan, selling complete Umrah packages to pilgrims across Pakistan: Umrah visa (with mandatory insurance), return flights from Lahore, Karachi and Islamabad, hotels in Makkah and Madinah, and transport, in one per-person price in PKR.`,
    "",
    "## Key facts",
    `- Office: ${fullAddress() || site.contact.address.city + ", Pakistan"}. Hours: ${site.contact.hoursSummary}.`,
    `- Bookings by WhatsApp and phone from anywhere in Pakistan. Payment by bank transfer against a written invoice.`,
    `- Umrah only. ${site.name} does not sell Hajj packages.`,
    operatorDisclosure() ? `- ${operatorDisclosure()}` : "- Registration details: see the About page.",
    `- Prices checked ${season.pricesChecked}. Prices are per person and depend on room sharing (sharing 5–6, quad 4, triple 3, double 2).`,
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
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
