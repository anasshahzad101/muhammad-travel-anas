// Lists every launch blocker still in the code. Run: npm run check:launch
// Exits 1 while anything is outstanding, so it can gate a deploy script.
import { readFileSync } from "node:fs";

const site = readFileSync(new URL("../lib/site.ts", import.meta.url), "utf8");
const data = readFileSync(new URL("../lib/package-data.ts", import.meta.url), "utf8");

const checks = [
  // Legal / compliance - see research/regulations-and-facts.md (LAUNCH-CRITICAL)
  ["MoRA approved-operator number, or a named approved operator partner", /mora: null as/.test(site) && /umrahOperator: null as/.test(site)],
  ["DTS Punjab travel-agency licence number", /dts: null as/.test(site)],
  ["Registered legal name (must match NTN/SECP for Google Ads verification)", /legalName: null as/.test(site)],
  ["NTN (Google Ads advertiser verification)", /ntn: null as/.test(site)],
  // Contact
  ["Real phone / WhatsApp number", site.includes('whatsapp: "923000000000"')],
  ["Office street address", /street: null as string \| null/.test(site)],
  ["Office area", /area: null as string \| null/.test(site)],
  ["Office map pin (from Google Business Profile)", /geo: null as/.test(site)],
  ["Domain confirmed (TODO on site.url)", /TODO: confirm the domain/.test(site)],
  // Commercial
  ["Package prices confirmed with supplier (remove PROVISIONAL note)", data.includes("PROVISIONAL:")],
  // Tracking
  ["GA4 / Google Ads IDs set in the host environment", !process.env.NEXT_PUBLIC_GA4_ID && !process.env.NEXT_PUBLIC_GADS_ID],
];

const open = checks.filter(([, bad]) => bad);
for (const [label, bad] of checks) console.log(`${bad ? "✗" : "✓"} ${label}`);
console.log(open.length ? `\n${open.length} launch item(s) outstanding.` : "\nReady to launch.");
process.exit(open.length ? 1 : 0);
