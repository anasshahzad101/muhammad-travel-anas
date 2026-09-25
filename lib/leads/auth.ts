/**
 * Sign-in for the leads dashboard. Server only.
 *
 * One shared password, ADMIN_PASSWORD, set in the host's environment (never in
 * the code). Signing in sets an HMAC-signed cookie that says "admin until
 * <time>"; the signing key is derived from the password, so changing the
 * password signs everyone out. With no ADMIN_PASSWORD the dashboard stays shut.
 */

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";

export const ADMIN_COOKIE = "mt_admin";
const SESSION_DAYS = 30;

export function adminConfigured(): boolean {
  return (process.env.ADMIN_PASSWORD ?? "").length > 0;
}

function key(): string {
  return createHash("sha256")
    .update(`mt-leads:${process.env.ADMIN_SECRET ?? ""}:${process.env.ADMIN_PASSWORD ?? ""}`)
    .digest("hex");
}

function sign(value: string): string {
  return createHmac("sha256", key()).update(value).digest("base64url");
}

function same(a: string, b: string): boolean {
  // Hash both sides first so the compare is constant-time whatever the lengths.
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function passwordMatches(password: string): boolean {
  return adminConfigured() && same(password, process.env.ADMIN_PASSWORD as string);
}

export function sessionToken(now = Date.now()): { value: string; maxAge: number } {
  const maxAge = SESSION_DAYS * 86400;
  const exp = String(now + maxAge * 1000);
  return { value: `${exp}.${sign(exp)}`, maxAge };
}

export function tokenValid(token: string | undefined, now = Date.now()): boolean {
  if (!token || !adminConfigured()) return false;
  const [exp, mac] = token.split(".");
  if (!exp || !mac || !/^\d+$/.test(exp) || Number(exp) < now) return false;
  return same(mac, sign(exp));
}

export async function isAdmin(): Promise<boolean> {
  return tokenValid((await cookies()).get(ADMIN_COOKIE)?.value);
}

/**
 * Secure only when the request really came over HTTPS. A Secure cookie on a
 * plain-HTTP test of the production build is dropped by the browser without a
 * word, and sign-in silently does nothing.
 */
export async function cookieSecure(): Promise<boolean> {
  const h = await headers();
  const proto = h.get("x-forwarded-proto")?.split(",")[0]?.trim();
  if (proto) return proto === "https";
  const host = h.get("host") ?? "";
  return !/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
}

// Wrong passwords: 8 tries per address, then a 15-minute wait.
const MAX_TRIES = 8;
const LOCK_MS = 15 * 60_000;
const tries = new Map<string, { count: number; until: number }>();

export function lockedOut(ip: string, now = Date.now()): boolean {
  const t = tries.get(ip);
  return !!t && t.count >= MAX_TRIES && t.until > now;
}

export function noteFailure(ip: string, now = Date.now()) {
  const t = tries.get(ip);
  const fresh = !t || t.until <= now;
  tries.set(ip, { count: fresh ? 1 : t.count + 1, until: now + LOCK_MS });
}

export function clearFailures(ip: string) {
  tries.delete(ip);
}
