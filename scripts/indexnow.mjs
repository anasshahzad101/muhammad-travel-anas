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
 *   node scripts/indexnow.mjs --until 2026-11-01T14:54:55.000Z
 *                                         wait until the live sitemap's newest lastmod is at least this
 *                                         (the workflow passes the newest date it just committed, so the
 *                                         submission reads the deploy that carries it, not the one before)
 *   node scripts/indexnow.mjs --attempts 2  how many times to try each read (30 s apart; default 24, about 12 minutes)
 *
 * It reads the live sitemap, so it submits exactly what the site publishes,
 * and the key from public/<key>.txt, which the site serves at /<key>.txt as
 * IndexNow requires (the key is public by design; it is not a secret).
 * .github/workflows/indexnow.yml runs it after each push to main.
 */
import { setDefaultResultOrder } from "node:dns";
import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// GitHub's runners have no IPv6 route, and the site has an AAAA record: a
// connection to the IPv6 address fails outright (ENETUNREACH). Resolve IPv4 first.
setDefaultResultOrder("ipv4first");

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

// The site may be mid-deploy when this runs (Hostinger restarts the app after
// each push), so a failed read is retried for a few minutes before giving up.
const attempts = Number(option("--attempts", "24"));
const until = option("--until", null);
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
/** Fetches `url` until `accept` returns null (ok) rather than a reason to try again. */
async function fetchText(url, accept = (res) => (res.ok ? null : `HTTP ${res.status}`)) {
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url, { headers: { "user-agent": "muhammadtravels-indexnow/1" }, signal: AbortSignal.timeout(20000) });
      const text = await res.text();
      const reason = accept(res, text);
      if (reason === null) return text;
      console.warn(`Attempt ${i}/${attempts}: ${url}: ${reason}`);
    } catch (err) {
      console.warn(`Attempt ${i}/${attempts}: could not read ${url}: ${err?.cause?.code ?? err?.code ?? err?.message ?? err}`);
    }
    if (i < attempts) await pause(30000);
  }
  console.error(`Giving up on ${url} after ${attempts} attempts.`);
  process.exit(1);
}

// The key file is served by the deployed site, so reading it back doubles as a
// "the deploy is live" check (IndexNow rejects a submission without it anyway).
await fetchText(`${SITE}/${key}.txt`, (res, text) => (!res.ok ? `HTTP ${res.status}` : text.trim() === key ? null : "served, but not this key"));
const newestLastmod = (text) => [...text.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].map((m) => Date.parse(m[1])).reduce((a, b) => Math.max(a, b), 0);
const xml = await fetchText(`${SITE}/sitemap.xml`, (res, text) => {
  if (!res.ok) return `HTTP ${res.status}`;
  if (until && newestLastmod(text) < Date.parse(until)) return `newest lastmod ${new Date(newestLastmod(text)).toISOString()} is older than ${until}: the deploy with the new dates is not live yet`;
  return null;
});
const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
  .map((m) => ({ loc: m[1].match(/<loc>(.*?)<\/loc>/)?.[1], lastmod: m[1].match(/<lastmod>(.*?)<\/lastmod>/)?.[1] }))
  .filter((e) => e.loc);
if (entries.length === 0) {
  console.error("The sitemap has no <url> entries; nothing submitted.");
  process.exit(1);
}
// A one-line picture of the sitemap's dates, so a run's log shows whether lastmod is moving.
const byDate = new Map();
for (const e of entries) {
  const d = (e.lastmod ?? "none").slice(0, 10);
  byDate.set(d, (byDate.get(d) ?? 0) + 1);
}
const home = entries.find((e) => new URL(e.loc).pathname === "/");
console.log(
  `Sitemap: ${entries.length} URLs; lastmod ${[...byDate].sort((a, b) => b[0].localeCompare(a[0])).map(([d, n]) => `${d} x${n}`).join(", ")}; homepage ${home?.lastmod ?? "?"}`,
);

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
