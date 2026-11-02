import { execFileSync } from "node:child_process";
import dates from "./lastmod-dates.json";
import { pageFiles } from "./page-files.mjs";

/**
 * When a page last changed, for the sitemap's lastmod.
 *
 * Google uses lastmod to decide what to recrawl, and only while it proves
 * accurate: a date that never moves gives it no reason to come back, and one
 * that moves on every deploy is noise it learns to ignore. So each page's date
 * is the commit date of the last change to the files that make its content
 * (lib/page-files.mjs), not the build time and not a date typed by hand.
 *
 * Where it comes from, in order:
 * 1. git, when the build has the full history (local builds). A shallow clone
 *    is not used: in it every file appears to have changed in the newest commit.
 * 2. lib/lastmod-dates.json, written from git by scripts/lastmod.mjs, which the
 *    GitHub workflow runs and commits after every push to main. This is what
 *    the Hostinger build uses, having no git history of its own.
 * 3. The caller's fallback (the fixed dates in app/sitemap.ts), which is also a
 *    floor: a page is never dated earlier than it.
 */

export type PageGroup = keyof typeof pageFiles;

let usable: boolean | null = null;
const cache = new Map<PageGroup, Date | null>();

function git(args: string[]): string {
  return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
}

function gitUsable(): boolean {
  if (usable !== null) return usable;
  try {
    usable = git(["rev-parse", "--is-shallow-repository"]) === "false";
  } catch {
    usable = false;
  }
  if (!usable) console.warn("[sitemap] No git history in this build (no git, or a shallow clone): lastmod comes from lib/lastmod-dates.json.");
  return usable;
}

/** The date the page group's files last changed, or `fallback` if that is later or no date is known. */
export function lastChanged(group: PageGroup, fallback: Date): Date {
  let date = cache.get(group);
  if (date === undefined) {
    date = null;
    const files = pageFiles[group];
    if (gitUsable()) {
      try {
        // :(literal) so that "[slug]" in a route path is a file name, not a glob.
        const out = git(["log", "-1", "--format=%cI", "--", ...files.map((f) => `:(literal)${f}`)]);
        if (out) date = new Date(out);
      } catch {
        date = null;
      }
      if (!date) console.warn(`[sitemap] No git history for "${group}" (${files.join(", ")}): a typo in lib/page-files.mjs?`);
    }
    if (!date) {
      const committed = (dates as Record<string, string | undefined>)[group];
      if (committed) date = new Date(committed);
      else console.warn(`[sitemap] No date for "${group}" in lib/lastmod-dates.json; using the fallback. Run: node scripts/lastmod.mjs`);
    }
    cache.set(group, date);
  }
  return date && date > fallback ? date : fallback;
}
