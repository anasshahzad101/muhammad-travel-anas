/**
 * Lead capture in the browser. Browser only.
 *
 * Forms call saveDraft() as the visitor types or picks an answer, sendLead()
 * when they press through to WhatsApp, and leadEvent() for things like closing
 * the popup. Drafts are debounced; anything still waiting when the visitor
 * switches app or closes the tab goes out with sendBeacon, which survives the
 * page going away. So a visitor who types their number and leaves is saved.
 *
 * Nothing here can break a form: every call swallows its own errors, and the
 * WhatsApp hand-off never waits for a save.
 */

import { isAdVisit } from "@/lib/visit";
import type { LeadSource, LeadUpdate, LeadVisit } from "./types";

const ENDPOINT = "/api/lead/"; // trailing slash: the site 308-redirects the bare path
const ID_KEY = "mt-lead-id";
/** Set once the server has a lead for this visitor, so clicks and closes are worth sending. */
const KNOWN_KEY = "mt-lead-known";
const VISITS_KEY = "mt-visits";
/** Per visit: where it started and the pages since (sessionStorage). */
const VISIT_KEY = "mt-visit";
const TRAIL_KEY = "mt-trail";
const DEBOUNCE_MS = 700;
const MAX_TRAIL = 25;

type Fields = Record<string, string>;

function store(kind: "local" | "session"): Storage | null {
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

let memoryId = "";

/** One id per browser, so a returning visitor adds to the same lead. */
function leadId(): string {
  const ls = store("local");
  let id = ls?.getItem(ID_KEY) ?? memoryId;
  if (!/^[A-Za-z0-9-]{16,64}$/.test(id)) {
    id = randomId();
    try {
      ls?.setItem(ID_KEY, id);
    } catch {
      /* storage full or blocked: this page still has one id */
    }
  }
  memoryId = id;
  return id;
}

function known(): boolean {
  return store("local")?.getItem(KNOWN_KEY) === "1";
}

/**
 * Called by <Analytics /> on every page. The first page of a visit records
 * where the visitor came from (ad click IDs are only in that first URL); every
 * page adds to the trail the team sees on the lead.
 */
export function recordPageView(path: string): void {
  if (typeof window === "undefined") return;
  const ss = store("session");
  const ls = store("local");
  try {
    if (ss && !ss.getItem(VISIT_KEY)) {
      const q = new URLSearchParams(window.location.search);
      let referrer = "";
      try {
        if (document.referrer && new URL(document.referrer).host !== window.location.host) referrer = document.referrer;
      } catch {
        /* unparseable referrer: leave it out */
      }
      const visit: LeadVisit = {
        landing: window.location.pathname + window.location.search,
        ...(referrer && { referrer }),
        ...(q.get("utm_source") && { utmSource: q.get("utm_source")! }),
        ...(q.get("utm_medium") && { utmMedium: q.get("utm_medium")! }),
        ...(q.get("utm_campaign") && { utmCampaign: q.get("utm_campaign")! }),
        ...(q.get("utm_term") && { utmTerm: q.get("utm_term")! }),
        ...((q.get("gclid") || q.get("gbraid") || q.get("wbraid")) && { gclid: (q.get("gclid") || q.get("gbraid") || q.get("wbraid"))! }),
        ...(isAdVisit() && { ad: true }),
      };
      ss.setItem(VISIT_KEY, JSON.stringify(visit));
      ls?.setItem(VISITS_KEY, String((Number(ls.getItem(VISITS_KEY)) || 0) + 1));
    }
    if (ss) {
      const trail = JSON.parse(ss.getItem(TRAIL_KEY) || "[]") as string[];
      if (trail[trail.length - 1] !== path) trail.push(path);
      ss.setItem(TRAIL_KEY, JSON.stringify(trail.slice(-MAX_TRAIL)));
    }
  } catch {
    /* storage blocked: the lead just carries less context */
  }
}

function visitContext(): LeadVisit {
  try {
    const visit = JSON.parse(store("session")?.getItem(VISIT_KEY) || "{}") as LeadVisit;
    const pages = JSON.parse(store("session")?.getItem(TRAIL_KEY) || "[]") as string[];
    const visits = Number(store("local")?.getItem(VISITS_KEY)) || 1;
    return { ...visit, visits, ...(pages.length && { pages }) };
  } catch {
    return {};
  }
}

// ---------------------------------------------------------------- sending

/**
 * Requests go out at once rather than queued (a queue can stall behind a
 * request in flight when the page unloads). Each carries a sequence number,
 * and the server ignores a draft older than the one it already has.
 */
let counter = 0;
/** At least one save has gone out from this page, so the lead exists or is about to. */
let savedThisPage = false;

function payload(u: Omit<LeadUpdate, "id" | "page" | "visit" | "seq">): string {
  counter = (counter + 1) % 1000;
  return JSON.stringify({ ...u, id: leadId(), seq: Date.now() * 1000 + counter, page: window.location.pathname, visit: visitContext() });
}

function post(body: string): void {
  fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true })
    .then((r) => (r.ok ? r.json() : null))
    .then((res: { stored?: boolean } | null) => {
      if (res?.stored) store("local")?.setItem(KNOWN_KEY, "1");
    })
    .catch(() => {
      /* offline or server down: the visitor's form carries on regardless */
    });
}

function beacon(body: string): void {
  try {
    if (navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: "application/json" }))) return;
  } catch {
    /* fall back to fetch below */
  }
  post(body);
}

// ---------------------------------------------------------------- drafts

const pending = new Map<LeadSource, { fields: Fields; step?: string }>();
const timers = new Map<LeadSource, number>();

function flush(source: LeadSource, { viaBeacon = false, event }: { viaBeacon?: boolean; event?: LeadUpdate["event"] } = {}) {
  const t = timers.get(source);
  if (t) window.clearTimeout(t);
  timers.delete(source);
  const p = pending.get(source);
  if (!p) return;
  pending.delete(source);
  savedThisPage = true;
  const body = payload({ source, fields: p.fields, ...(p.step !== undefined && { step: p.step }), ...(event && { event }) });
  if (viaBeacon) beacon(body);
  else post(body);
}

let listening = false;
function listenForLeave() {
  if (listening) return;
  listening = true;
  const leave = () => {
    for (const source of [...pending.keys()]) flush(source, { viaBeacon: true });
  };
  window.addEventListener("pagehide", leave);
  document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" && leave());
}

function nonEmpty(fields: Fields): Fields {
  return Object.fromEntries(Object.entries(fields).filter(([, v]) => typeof v === "string" && v.trim() !== ""));
}

/**
 * Save what the visitor has entered so far. Send every field the form
 * currently has (not just the one that changed): the server takes the set as
 * the form's latest state.
 */
export function saveDraft(source: LeadSource, fields: Fields, opts: { step?: string } = {}): void {
  if (typeof window === "undefined") return;
  try {
    listenForLeave();
    pending.set(source, { fields: nonEmpty(fields), ...(opts.step !== undefined && { step: opts.step }) });
    const t = timers.get(source);
    if (t) window.clearTimeout(t);
    timers.set(
      source,
      window.setTimeout(() => flush(source), DEBOUNCE_MS),
    );
  } catch {
    /* never break the form */
  }
}

/** They pressed through to WhatsApp. Goes out at once and survives the page navigating away. */
export function sendLead(source: LeadSource, fields: Fields): void {
  if (typeof window === "undefined") return;
  try {
    pending.delete(source);
    const t = timers.get(source);
    if (t) window.clearTimeout(t);
    timers.delete(source);
    savedThisPage = true;
    beacon(payload({ source, fields: nonEmpty(fields), sent: true }));
  } catch {
    /* never block the hand-off */
  }
}

/**
 * Something the team should see on the lead's timeline ("closed the popup",
 * "tapped WhatsApp"). Only sent for visitors who already have a lead: a click
 * with no name or number attached is not a lead.
 */
export function leadEvent(kind: string, text: string, opts: { source?: LeadSource } = {}): void {
  if (typeof window === "undefined") return;
  try {
    // A draft still waiting for its debounce carries the event with it, so the lead exists first.
    if (opts.source && pending.has(opts.source)) return flush(opts.source, { event: { kind, text } });
    if (!known() && !savedThisPage) return;
    post(payload({ event: { kind, text }, onlyIfExists: true }));
  } catch {
    /* never break the page */
  }
}
