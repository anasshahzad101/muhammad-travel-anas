/**
 * Pure lead logic, no I/O: checking what the browser sent and folding it into
 * the stored lead. The API route and the file/Postgres stores stay thin, and
 * this is the one place the rules live.
 */

import { toE164 } from "@/lib/phone";
import {
  LEAD_SOURCES,
  isLeadSource,
  type FormEntry,
  type Lead,
  type LeadEvent,
  type LeadUpdate,
  type LeadVisit,
} from "./types";

const MAX_FIELDS = 24;
const MAX_VALUE = 600;
const MAX_EVENTS = 120;
const MAX_PAGES = 25;
const FIRST_TOUCH = ["landing", "referrer", "utmSource", "utmMedium", "utmCampaign", "utmTerm", "gclid", "ad"] as const;

export const LEAD_ID = /^[A-Za-z0-9-]{16,64}$/;

function clean(v: unknown, max = MAX_VALUE): string {
  if (typeof v !== "string" && typeof v !== "number") return "";
  // Control characters out, whitespace collapsed (notes keep their line breaks).
  return String(v)
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim()
    .slice(0, max);
}

function cleanPath(v: unknown): string {
  const s = clean(v, 300);
  return s.startsWith("/") ? s : "";
}

/** Whatever arrived over the wire, reduced to a well-formed update, or null if it isn't one. */
export function sanitizeUpdate(raw: unknown): LeadUpdate | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = typeof r.id === "string" ? r.id : "";
  // "m-" ids are leads the team added by hand; the website never writes to those.
  if (!LEAD_ID.test(id) || id.startsWith("m-")) return null;

  const u: LeadUpdate = { id };
  if (r.source !== undefined) {
    if (!isLeadSource(r.source)) return null;
    u.source = r.source;
  }
  if (r.fields && typeof r.fields === "object") {
    const fields: Record<string, string> = {};
    for (const [k, v] of Object.entries(r.fields as Record<string, unknown>).slice(0, MAX_FIELDS)) {
      if (!/^[a-z][a-z0-9_]{0,31}$/i.test(k)) continue;
      const value = clean(v, k === "notes" ? 1500 : MAX_VALUE);
      if (value) fields[k] = value;
    }
    u.fields = fields;
  }
  if (typeof r.seq === "number" && Number.isSafeInteger(r.seq) && r.seq > 0) u.seq = r.seq;
  if (r.step !== undefined) u.step = clean(r.step, 160);
  if (r.sent === true) u.sent = true;
  if (r.onlyIfExists === true) u.onlyIfExists = true;
  if (r.page !== undefined) u.page = cleanPath(r.page);
  if (r.event && typeof r.event === "object") {
    const e = r.event as Record<string, unknown>;
    const kind = clean(e.kind, 24);
    const text = clean(e.text, 400);
    if (/^[a-z_]+$/.test(kind) && text) u.event = { kind, text };
  }
  if (r.visit && typeof r.visit === "object") {
    const v = r.visit as Record<string, unknown>;
    const visit: LeadVisit = {};
    const landing = clean(v.landing, 400);
    if (landing.startsWith("/")) visit.landing = landing;
    const referrer = clean(v.referrer, 400);
    if (/^https?:\/\//.test(referrer)) visit.referrer = referrer;
    for (const k of ["utmSource", "utmMedium", "utmCampaign", "utmTerm", "gclid"] as const) {
      const s = clean(v[k], 200);
      if (s) visit[k] = s;
    }
    if (v.ad === true) visit.ad = true;
    if (typeof v.visits === "number" && Number.isFinite(v.visits)) visit.visits = Math.max(1, Math.min(9999, Math.floor(v.visits)));
    if (Array.isArray(v.pages)) visit.pages = v.pages.map(cleanPath).filter(Boolean).slice(-MAX_PAGES);
    u.visit = visit;
  }
  return u;
}

/** A rough device / browser / OS read from the user agent: enough to say "iPhone, Safari". */
export function describeAgent(ua: string): Pick<LeadVisit, "device" | "browser" | "os"> {
  const device = /iPad|Tablet|(Android(?!.*Mobile))/i.test(ua) ? "Tablet" : /Mobi|iPhone|Android/i.test(ua) ? "Mobile" : "Desktop";
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\/|Opera/.test(ua)
      ? "Opera"
      : /SamsungBrowser/.test(ua)
        ? "Samsung Internet"
        : /FBAN|FBAV|FB_IAB/.test(ua)
          ? "Facebook app"
          : /Instagram/.test(ua)
            ? "Instagram app"
            : /Chrome\/|CriOS/.test(ua)
              ? "Chrome"
              : /Firefox\/|FxiOS/.test(ua)
                ? "Firefox"
                : /Safari\//.test(ua)
                  ? "Safari"
                  : "";
  const os = /iPhone|iPad|iPod/.test(ua)
    ? "iOS"
    : /Android/.test(ua)
      ? "Android"
      : /Windows/.test(ua)
        ? "Windows"
        : /Mac OS X|Macintosh/.test(ua)
          ? "macOS"
          : /Linux/.test(ua)
            ? "Linux"
            : "";
  return { device, ...(browser && { browser }), ...(os && { os }) };
}

function hasContent(fields: Record<string, string> | undefined): boolean {
  return !!fields && Object.values(fields).some((v) => v.trim() !== "");
}

function newLead(id: string, now: string): Lead {
  return { id, createdAt: now, updatedAt: now, name: "", phone: "", phoneE164: "", forms: {}, events: [], visit: {}, stage: "new", notes: "" };
}

function pushEvent(lead: Lead, e: LeadEvent) {
  const last = lead.events[lead.events.length - 1];
  // The same thing twice within a minute (a double tap, a re-render) is one event.
  if (last && last.kind === e.kind && last.text === e.text && Date.parse(e.at) - Date.parse(last.at) < 60_000) return;
  lead.events.push(e);
  if (lead.events.length > MAX_EVENTS) lead.events.splice(0, lead.events.length - MAX_EVENTS);
}

/**
 * Folds one update from the browser into the stored lead. Returns null when
 * there is nothing worth keeping: no lead yet and nothing typed or sent, or a
 * click/close for a visitor who never started a form.
 */
export function applyUpdate(prev: Lead | null, u: LeadUpdate, now: string, agent: Pick<LeadVisit, "device" | "browser" | "os"> = {}): Lead | null {
  if (!prev && (u.onlyIfExists || (!hasContent(u.fields) && !u.sent))) return null;

  const lead: Lead = prev ? structuredClone(prev) : newLead(u.id, now);
  const page = u.page || undefined;
  lead.updatedAt = now;

  // Where they came from: first touch wins. Device and the pages they looked at: always the latest.
  const v = u.visit ?? {};
  const seen = lead.visit;
  if (prev && v.visits && seen.visits && v.visits > seen.visits) {
    pushEvent(lead, { at: now, kind: "return", text: `Came back to the site (visit ${v.visits})`, page });
  }
  const next: LeadVisit = agent.device ? { ...agent } : { device: seen.device, browser: seen.browser, os: seen.os };
  for (const k of FIRST_TOUCH) {
    const val = seen[k] ?? v[k];
    if (val !== undefined) Object.assign(next, { [k]: val });
  }
  const visits = Math.max(v.visits ?? 0, seen.visits ?? 0);
  if (visits) next.visits = visits;
  const pages = v.pages?.length ? v.pages : seen.pages;
  if (pages?.length) next.pages = pages;
  lead.visit = JSON.parse(JSON.stringify(next));

  const was = u.source ? lead.forms[u.source] : undefined;
  // Saves go out in parallel; a draft that was overtaken by a newer save is dropped (a send never is).
  const stale = !u.sent && u.seq !== undefined && was?.seq !== undefined && u.seq < was.seq;

  if (u.source && !stale) {
    const label = LEAD_SOURCES[u.source].toLowerCase();
    const entry: FormEntry = was
      ? { ...was, fields: { ...was.fields } }
      : { source: u.source, page: page ?? "", fields: {}, status: "draft", startedAt: now, updatedAt: now };
    if (!was) pushEvent(lead, { at: now, kind: "started", text: `Started the ${label}`, page });

    if (u.fields) {
      // The browser sends every field it has; one it no longer sends was cleared.
      entry.fields = { ...u.fields };
      // A sent form that is edited again is a new draft until it is sent again.
      if (entry.status === "sent" && !u.sent && JSON.stringify(entry.fields) !== JSON.stringify(was?.fields)) entry.status = "draft";
    }
    if (page) entry.page = page;
    if (u.step !== undefined) entry.step = u.step || undefined;
    if (u.seq !== undefined) entry.seq = Math.max(u.seq, entry.seq ?? 0);
    entry.updatedAt = now;

    if (u.sent) {
      entry.status = "sent";
      entry.sentAt = now;
      entry.step = undefined;
      lead.sentAt ??= now;
      lead.lastSentAt = now;
      pushEvent(lead, { at: now, kind: "sent", text: `Sent the ${label} to WhatsApp`, page });
    }
    lead.forms[u.source] = entry;

    const name = entry.fields.name?.trim();
    if (name) lead.name = name;
    const phone = entry.fields.phone?.trim();
    if (phone && phone !== lead.phone) {
      const e164 = toE164(phone);
      // Keep a good number over a half-typed one from another form.
      if (e164 || !lead.phoneE164) {
        lead.phone = phone;
        if (e164 && e164 !== lead.phoneE164) pushEvent(lead, { at: now, kind: "phone", text: "Left a phone number", page });
        lead.phoneE164 = e164;
      }
    }
  }

  if (u.event) pushEvent(lead, { at: now, kind: u.event.kind, text: u.event.text, page });
  return lead;
}
