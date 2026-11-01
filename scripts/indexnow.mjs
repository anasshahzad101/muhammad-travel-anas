#!/usr/bin/env node
/**
 * Tell the IndexNow search engines (Bing, and through Bing's index ChatGPT
 * search and DuckDuckGo; also Yandex, Seznam and Naver) which pages changed,
 * so they recrawl them within hours instead of weeks. Google does not take
 * part in IndexNow: it reads the sitemap's lastmod instead.
 *
 *   node scripts/indexnow.mjs             URLs whose sitemap lastmod is within the last 3 days
 *   node scripts/indexnow.mjs --days 7    ...within the last 7 days
 *   node scripts/indexnow.mjs --all       every URL in the sitemap (first submission, or after a redesign)
 *   node scripts/indexnow.mjs --dry-run   print the list, submit nothing
 *
 * It reads the live sitemap, so it submits exactly what the site publishes,
 * and the key from public/<key>.txt, which the site serves at /<key>.txt as
 * IndexNow requires (the key is public by design; it is not a secret).
 * .github/workflows/indexnow.yml runs it after each push to main.
 */
import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// INDEXNOW_SITE overrides the site for a dry run against a local build.
const SITE = process.env.INDEXNOW_SITE ?? "https://muhammadtravels.com";
const ENDPOINT = "https://api.indexnow.org/indexnow";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const days = Number(option("--days", "3"));

const keyFile = readdirSync(path.join(root, "public")).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) {
  console.error("No IndexNow key file in public/ (expected <32 hex characters>.txt).");
  process.exit(1);
}
const key = keyFile.slice(0, -".txt".length);

const sitemap = await fetch(`${SITE}/sitemap.xml`, { headers: { "user-agent": "muhammadtravels-indexnow/1" } });
if (!sitemap.ok) {
  console.error(`Could not read ${SITE}/sitemap.xml: HTTP ${sitemap.status}`);
  process.exit(1);
}
const xml = await sitemap.text();
const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
  .map((m) => ({ loc: m[1].match(/<loc>(.*?)<\/loc>/)?.[1], lastmod: m[1].match(/<lastmod>(.*?)<\/lastmod>/)?.[1] }))
  .filter((e) => e.loc);
if (entries.length === 0) {
  console.error("The sitemap has no <url> entries; nothing submitted.");
  process.exit(1);
}

const since = Date.now() - days * 24 * 60 * 60 * 1000;
const urls = flag("--all")
  ? entries.map((e) => e.loc)
  : entries.filter((e) => e.lastmod && Date.parse(e.lastmod) >= since).map((e) => e.loc);

if (urls.length === 0) {
  console.log(`No page changed in the last ${days} days; nothing submitted.`);
  process.exit(0);
}
console.log(`${urls.length} of ${entries.length} URLs${flag("--all") ? "" : ` changed in the last ${days} days`}:`);
for (const u of urls) console.log(`  ${u}`);
if (flag("--dry-run")) process.exit(0);

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key, keyLocation: `${SITE}/${key}.txt`, urlList: urls }),
});
// 200: accepted. 202: accepted, key not yet verified (normal on the first submission).
console.log(`IndexNow: HTTP ${res.status} ${res.statusText}`);
if (res.status !== 200 && res.status !== 202) {
  console.error(await res.text());
  process.exit(1);
}
