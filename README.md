# Muhammad Travels — website

Umrah agency site: Next.js 16 (App Router, fully static), React 19, Tailwind 4, TypeScript. No database: every package, price and page is generated from data files in `lib/`.

```bash
npm install
npm run dev            # http://localhost:3120
npm run build          # static build (54 routes)
npm run check:launch   # lists the business details still missing before go-live
```

## Where things live

| File | What it controls |
|---|---|
| `lib/site.ts` | Business identity, phone/WhatsApp, address, hours, licences (MoRA, DTS, NTN), approved operator partner. A red preview banner shows on every page until the launch-critical fields are real. |
| `lib/package-data.ts` | The 15 packages: prices (PKR per person by room), hotels, nights, inclusions. Prices appear everywhere: cards, tables, calculator, JSON-LD, `llms.txt`, and (via `build_ads.py`) the Google Ads copy. |
| `lib/categories.ts` | The 17 landing pages under `/umrah-packages/[slug]/`: 3 cities, 5 durations, 4 hotel tiers, family/couples/group, December and Ramadan. Each has its own copy, FAQs and target keywords. |
| `lib/season.ts` | "Prices checked" date, Ramadan 2027 and the Saudi 1448H deadlines (last visa 9 Mar, last entry 23 Mar, final departure 7 Apr 2027). |
| `lib/market.ts` | Market reference figures (visa, airfares, land-only prices) used on the cost guide and tickets page. |
| `lib/duas.ts` | Duas with Arabic, transliteration, meaning and source. Have an alim review them and name the reviewer. |
| `lib/images.ts` | Stock photo registry (Unsplash Licence), served from Unsplash's CDN. Every photo has been checked by eye. |
| `lib/track.ts` | GA4 + Google Ads conversions (WhatsApp click, call click, enquiry). They activate only when the env vars are set. |

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
- Licence badges render only when a real number is set. No "Govt approved" or "IATA" claims otherwise.
- Umrah only (`sellsHajj: false`). Private Hajj needs a licensed Hajj company.
- Hotel names are "or similar", with walking distances stated in metres. The voucher confirms the exact hotel.
