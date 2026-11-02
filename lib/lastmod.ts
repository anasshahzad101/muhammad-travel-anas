import { execFileSync } from "node:child_process";

/**
 * When a page last changed, for the sitemap's lastmod.
 *
 * Google uses lastmod to decide what to recrawl, and only while it proves
 * accurate: a date that never moves gives it no reason to come back, and one
 * that moves on every deploy is noise it learns to ignore. So each page's date
 * is the commit date of the last change to the files that make its content
 * (its page file and the data it reads), not the build time and not a date
 * typed by hand. app/sitemap.ts says which files make each page.
 *
 * Read from git at build time. Where the build has no git, or only a shallow
 * clone (in which every file appears to have changed in the newest commit),
 * the caller's fallback is used, so the sitemap is never worse than the fixed
 * dates it had before. The fallback is also a floor: a page is never dated
 * earlier than it.
 */

let usable: boolean | null = null;
const cache = new Map<string, Date | null>();

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
  if (!usable) console.warn("[sitemap] No git history in this build (no git, or a shallow clone): lastmod uses the fixed dates in app/sitemap.ts.");
  return usable;
}

/** The newest commit date among `files` (repository-relative paths), or `fallback` if that is later or git is unavailable. */
export function lastChanged(files: string[], fallback: Date): Date {
  if (!gitUsable()) return fallback;
  const key = files.join("\n");
  let date = cache.get(key);
  if (date === undefined) {
    try {
      // :(literal) so that "[slug]" in a route path is a file name, not a glob.
      const out = git(["log", "-1", "--format=%cI", "--", ...files.map((f) => `:(literal)${f}`)]);
      date = out ? new Date(out) : null;
    } catch {
      date = null;
    }
    if (!date) console.warn(`[sitemap] No git history for ${files.join(", ")} (a typo in app/sitemap.ts?); using the fallback date.`);
    cache.set(key, date);
  }
  return date && date > fallback ? date : fallback;
}
