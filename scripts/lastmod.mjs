#!/usr/bin/env node
/**
 * Writes lib/lastmod-dates.json: for each page group in lib/page-files.mjs,
 * the commit date (UTC) of the last change to its files. app/sitemap.ts reads
 * it through lib/lastmod.ts wherever the build has no git history, which is
 * the case on Hostinger. The GitHub workflow runs this after every push to
 * main and commits the file when it changed, so the dates are always a commit
 * behind at most, and only for a few minutes.
 *
 *   node scripts/lastmod.mjs          write the file (npm run lastmod)
 *   node scripts/lastmod.mjs --check  exit 1 if the file is out of date; writes nothing
 *
 * Needs the full git history: in a shallow clone every file appears to have
 * changed in the newest commit, which would date every page to today.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pageFiles } from "../lib/page-files.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "lib", "lastmod-dates.json");
const rel = path.relative(root, out);
const git = (args) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();

if (git(["rev-parse", "--is-shallow-repository"]) !== "false") {
  console.error("This is a shallow clone, so every file would be dated to the newest commit. Fetch the full history first (git fetch --unshallow; in GitHub Actions, actions/checkout with fetch-depth: 0).");
  process.exit(1);
}

const dates = {};
for (const group of Object.keys(pageFiles).sort()) {
  const files = pageFiles[group];
  // :(literal) so that "[slug]" in a route path is a file name, not a glob.
  const date = git(["log", "-1", "--format=%cI", "--", ...files.map((f) => `:(literal)${f}`)]);
  if (!date) {
    console.error(`No git history for "${group}" (${files.join(", ")}): a typo in lib/page-files.mjs?`);
    process.exit(1);
  }
  dates[group] = new Date(date).toISOString();
}

const json = `${JSON.stringify(dates, null, 2)}\n`;
let current = null;
try {
  current = readFileSync(out, "utf8");
} catch {
  // first run
}
const newest = Object.values(dates).sort().at(-1);
if (current === json) {
  console.log(`${rel} is up to date: ${Object.keys(dates).length} page groups, newest ${newest}.`);
  process.exit(0);
}
if (process.argv.includes("--check")) {
  console.error(`${rel} is out of date. Run: node scripts/lastmod.mjs`);
  process.exit(1);
}
writeFileSync(out, json);
console.log(`Wrote ${rel}: ${Object.keys(dates).length} page groups, newest ${newest}.`);
