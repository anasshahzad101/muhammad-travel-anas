# Muhammad Travels - website

Umrah agency site: Next.js 16 (App Router, fully static), React 19, Tailwind 4, TypeScript. No database: every package, price and page is generated from data files in `lib/`.

```bash
npm install
npm run dev            # http://localhost:3120
npm run build          # static build (54 routes)
```

## Where things live

| File | What it controls |
|---|---|
| `lib/site.ts` | Business identity: name, phone/WhatsApp (0304 1458319, every enquiry goes there), office, hours. |
| `lib/package-data.ts` | The 15 packages: prices (PKR per person by room), hotels, nights, inclusions. Prices appear everywhere: cards, tables, calculator, JSON-LD, `llms.txt`, and (via `build_ads.py`) the Google Ads copy. |
| `lib/categories.ts` | The 17 landing pages under `/umrah-packages/[slug]/`: 3 cities, 5 durations, 4 hotel tiers, family/couples/group, December and Ramadan. Each has its own copy, FAQs and target keywords. |
| `lib/season.ts` | "Prices checked" date, Ramadan 2027 and the Saudi 1448H deadlines (last visa 9 Mar, last entry 23 Mar, final departure 7 Apr 2027). |
| `lib/market.ts` | Market reference figures (visa, airfares, land-only prices) used on the cost guide and tickets page. |
| `lib/duas.ts` | Duas with Arabic, transliteration, meaning and source. Have an alim review them and name the reviewer. |
| `lib/images.ts` | Stock photo registry (Unsplash Licence), served from Unsplash's CDN. Every photo has been checked by eye. |
| `lib/track.ts` | GA4 (G-5R1S5N9NS5) + Google Ads (AW-18470567632, account 880-159-2445) conversions: WhatsApp click, call click, enquiry. The IDs are built in, and env vars can override them. All three are *secondary* in Google Ads, because bidding runs on qualified leads imported from the lead sheet (`plan/google-ads-plan.md` §3). The enquiry form and lead popup pass the typed phone number, in E.164, to the Google tag (enhanced conversions for leads). The Ads tag collects nothing for remarketing. |
| `lib/visit.ts` | Whether this visit came from an ad (gclid/gbraid/wbraid or utm_medium=cpc) and whether the visitor has already messaged or called. For ad visitors the lead popup waits 45 s and the "Let us help you" widget 50 s. Neither opens once the visitor is in touch. |
| `lib/distance.ts` | Turns hotel distance strings ("450-700 m") into metres, walking minutes and per-tier bands, for the distance meters and the hotel-distance explorer. |
| `lib/finder.ts` | Package matching for the hero finder and the cost calculator (closest real package, never an invented price). |
| `lib/journey.ts`, `lib/geo-map.ts` | Flight facts per departure city, and the generated map geometry (Natural Earth, no borders drawn) for the journey map. |
| `lib/rites.ts` | Copy for the "Umrah in four steps" experience; the walk-along hints are the duas from `lib/duas.ts`. |
| `lib/og.ts`, `app/og/` | Branded 1200x630 share cards (WhatsApp previews) for every page, built at build time from the same data. |

## Design system

"Night & Gold": night-green sections for drama (hero, rites, journey, CTA, footer), ivory sections for reading. Tokens, buttons and the scroll-driven reveals live in `app/globals.css`; the reveals are pure CSS (`animation-timeline: view()`), so nothing is ever hidden from crawlers. Display type is Cormorant Garamond, body and every price is Manrope (never set a price in the serif). All copy uses plain hyphens, never en or em dashes.

Interactive islands (client components, each server-rendered with real content first): `HeroFinder`, `CostCalculator`, `PackageExplorer`, `DistanceExplorer`, `JourneyMap`, `RitesExperience` (canvas), `PackingChecklist`, `DuaActions`, `MakkahClock`, `TocSpy`.

## Pages

- `/`: homepage ("umrah packages").
- `/umrah-packages/`: all packages, price list and cost calculator.
- `/umrah-packages/{lahore,karachi,islamabad}/`: city pages.
- `/umrah-packages/{7,10,15,21,28}-days/`: duration pages.
- `/umrah-packages/{economy,3-star,4-star,5-star}/`: hotel-tier pages.
- `/umrah-packages/{family,couples,group,december,ramadan}/`: audience and season pages.
- `/umrah-packages/<package-slug>/`: the 15 package pages.
- `/umrah-visa/`: informational only. It is not an ad landing page, because of Google's visa-ad policy.
- `/umrah-tickets/`
- `/guides/`: how to perform umrah, duas, cost from Pakistan, packing list.
- `/about/`, `/contact/`, `/faq/`, `/refund-policy/`, `/terms-and-conditions/`, `/privacy-policy/`.
- `sitemap.xml`, `robots.txt`, `llms.txt`.

## Rules baked into the code

- No fake reviews and no `aggregateRating` in the schema until real reviews exist.
- Umrah only (`sellsHajj: false`).
- Hotel names are "or similar", with walking distances stated in metres. The voucher confirms the exact hotel.
