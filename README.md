# Muhammad Travels - website

Umrah agency site: Next.js 16 (App Router), React 19, Tailwind 4, TypeScript. Every public page is static and generated from data files in `lib/`. The only server-side part is lead tracking and its dashboard at `/admin/` (see below).

```bash
npm install
npm run dev            # http://localhost:3120
npm run build          # production build (webpack, as on Hostinger)
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

## Lead tracking and the dashboard

Every visitor who picks an answer in the "Let us help you" chat, or types into the price popup or a quote form, becomes a lead, **saved as they type, before they press send**. The dashboard at `/admin/` lists them, with the ones who left a number but never sent (the people to call back) one click away, plus WhatsApp / call buttons, a follow-up stage, notes, what they entered, where they stopped, the pages they viewed, and a CSV export (with the Google Ads click ID for offline conversion imports).

| File | What it does |
|---|---|
| `lib/leads/client.ts` | Browser side: debounced saves as people type, `sendBeacon` when they leave, the send itself, and events (closed the popup, tapped WhatsApp). |
| `app/api/lead/route.ts` | The public endpoint the forms post to (same-site only, size- and rate-limited). |
| `lib/leads/merge.ts` | All the rules: cleaning input, folding each save into the lead, ignoring saves that arrive out of order. |
| `lib/leads/store.ts` | Neon Postgres when `DATABASE_URL` is set (table `mt_leads`, created on first use); otherwise `.data/leads.json`. |
| `app/admin/`, `components/admin/` | The dashboard and its sign-in. Public pages live in `app/(site)/`, so the admin area has no site header, popup or chatbot. |
| `lib/leads/staff.ts` | The CRM rules: leads added by hand ("Add lead", for WhatsApp messages, calls, walk-ins), bookings (package from `lib/package-data.ts` so the price fills itself in, room, pilgrims, agreed total), payments, follow-up dates, and the history entry every change leaves. The first payment moves a lead to Booked by itself. |

The CRM strip on the dashboard shows follow-ups due (today or overdue), bookings and payments received in the chosen period, and the balance still to collect. Hand-added leads have ids starting `m-`, which the public `/api/lead/` endpoint refuses to touch.

Environment variables on the host (Hostinger: the Node.js app's environment variables):

- `ADMIN_PASSWORD` (required for the dashboard): the sign-in password. Changing it signs everyone out.
- `DATABASE_URL` (strongly recommended): a Neon Postgres connection string. Without it leads go to a file on the server, which a redeploy can wipe, and the dashboard shows a warning.
- `ADMIN_SECRET` (optional): extra key for signing the session cookie.
- `LEADS_FILE` (optional): where the file store writes when there is no database.

Locally, put `ADMIN_PASSWORD=...` in `.env.local` (gitignored) and open http://localhost:3120/admin/.

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
