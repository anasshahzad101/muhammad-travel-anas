import { NextResponse, type NextRequest } from "next/server";
import { applyUpdate, describeAgent, sanitizeUpdate } from "@/lib/leads/merge";
import { updateLead } from "@/lib/leads/store";
import { site } from "@/lib/site";

/**
 * Receives lead saves from the site's forms (lib/leads/client.ts): drafts as
 * people type, the final send, and clicks/closes on an existing lead.
 *
 * Open to the public by nature, so it is fenced in: same-site origins only,
 * small bodies, a per-address rate limit, and every field is length-capped
 * and cleaned in sanitizeUpdate().
 */

export const dynamic = "force-dynamic";

const MAX_BODY = 16_000;
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 300;
const hits = new Map<string, { n: number; reset: number }>();

function rateLimited(ip: string, now: number): boolean {
  const h = hits.get(ip);
  if (!h || h.reset <= now) {
    hits.set(ip, { n: 1, reset: now + WINDOW_MS });
    if (hits.size > 5000) for (const [k, v] of hits) if (v.reset <= now) hits.delete(k);
    return false;
  }
  h.n += 1;
  return h.n > MAX_PER_WINDOW;
}

function sameSite(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // older browsers omit it on same-origin requests
  let host: string;
  try {
    host = new URL(origin).host;
  } catch {
    return false;
  }
  const allowed = new Set(
    [req.headers.get("host"), req.headers.get("x-forwarded-host"), new URL(site.url).host, `www.${new URL(site.url).host}`].filter(Boolean),
  );
  return allowed.has(host) || /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
}

export async function POST(req: NextRequest) {
  if (!sameSite(req)) return NextResponse.json({ ok: false }, { status: 403 });

  const now = Date.now();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip, now)) return NextResponse.json({ ok: false }, { status: 429 });

  const text = await req.text();
  if (text.length > MAX_BODY) return NextResponse.json({ ok: false }, { status: 413 });
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const update = sanitizeUpdate(raw);
  if (!update) return NextResponse.json({ ok: false }, { status: 400 });

  const agent = describeAgent(req.headers.get("user-agent") ?? "");
  try {
    const lead = await updateLead(update.id, (prev) => applyUpdate(prev, update, new Date(now).toISOString(), agent));
    return NextResponse.json({ ok: true, stored: !!lead });
  } catch (err) {
    console.error("[lead] save failed:", err);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
