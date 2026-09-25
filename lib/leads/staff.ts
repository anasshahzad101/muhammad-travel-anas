/**
 * The CRM side of a lead, no I/O: booking maths, cleaning what staff send,
 * adding a lead by hand, and applying staff edits. Every change worth keeping
 * a record of (stage, payments, booking, follow-up) lands on the lead's
 * timeline, so the history of a booking can always be read back.
 */

import { toE164 } from "@/lib/phone";
import {
  CHANNELS,
  LEAD_STAGES,
  ROOMS,
  SERVICES,
  isChannel,
  isLeadStage,
  type Channel,
  type Deal,
  type Lead,
  type LeadEvent,
  type LeadStage,
  type Payment,
  type Room,
  type Service,
} from "./types";

const MAX_EVENTS = 120;
const MAX_PKR = 1_000_000_000;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

// ---------------------------------------------------------------- money

/** "PKR 1,140,000". Written out by hand so server and browser print the same thing. */
export function pkr(n: number): string {
  const whole = Math.round(n);
  const s = String(Math.abs(whole)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${whole < 0 ? "-" : ""}PKR ${s}`;
}

/** "PKR 11.4 lakh" (or "PKR 85,000" below a lakh). How Pakistani buyers say prices. */
export function lakh(n: number): string {
  if (Math.abs(n) < 100_000) return pkr(n);
  const l = n / 100_000;
  return `PKR ${l.toFixed(Math.abs(l) >= 100 ? 0 : Math.abs(l) >= 10 ? 1 : 2).replace(/\.?0+$/, "")} lakh`;
}

export function pilgrims(deal: Pick<Deal, "adults" | "children">): number {
  return (deal.adults || 0) + (deal.children || 0);
}

/** Price per person times pilgrims: what the total is when nobody has typed one in. */
export function autoTotal(deal: Pick<Deal, "adults" | "children" | "pricePerPerson">): number {
  return (deal.pricePerPerson ?? 0) * pilgrims(deal);
}

export function dealTotal(deal: Deal): number {
  return deal.total ?? autoTotal(deal);
}

export function received(deal: Deal): number {
  return deal.payments.reduce((n, p) => n + p.amount, 0);
}

export function balance(deal: Deal): number {
  return Math.max(0, dealTotal(deal) - received(deal));
}

/** "15 Days 3-Star · Quad · 4 pilgrims": the booking in one line. */
export function dealLine(deal: Deal): string {
  const what = deal.packageName || SERVICES[deal.service];
  const n = pilgrims(deal);
  return [what, deal.room && deal.service === "package" ? ROOMS[deal.room].replace(/ \(.*\)/, "") : "", n ? `${n} pilgrim${n === 1 ? "" : "s"}` : ""]
    .filter(Boolean)
    .join(" · ");
}

// ---------------------------------------------------------------- cleaning

function text(v: unknown, max = 200): string {
  return typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max) : "";
}

function amount(v: unknown): number | undefined {
  const n = typeof v === "number" ? v : typeof v === "string" && v.trim() ? Number(v.replace(/[,\s]/g, "")) : NaN;
  return Number.isFinite(n) && n >= 0 && n <= MAX_PKR ? Math.round(n) : undefined;
}

function count(v: unknown, max = 60): number {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) ? Math.max(0, Math.min(max, n)) : 0;
}

function day(v: unknown): string | undefined {
  return typeof v === "string" && DAY.test(v) ? v : undefined;
}

export function sanitizeDeal(raw: unknown): Deal | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const service: Service = typeof r.service === "string" && Object.hasOwn(SERVICES, r.service) ? (r.service as Service) : "package";
  const payments: Payment[] = Array.isArray(r.payments)
    ? r.payments
        .slice(0, 200)
        .map((p) => {
          const q = (p ?? {}) as Record<string, unknown>;
          const amt = amount(q.amount);
          const date = day(q.date);
          const id = text(q.id, 40);
          if (!amt || !date || !/^[A-Za-z0-9-]{4,40}$/.test(id)) return null;
          return { id, date, amount: amt, method: text(q.method, 40) || "Cash", ...(text(q.note, 200) && { note: text(q.note, 200) }) };
        })
        .filter((p): p is Payment => !!p)
    : [];
  const deal: Deal = {
    service,
    adults: count(r.adults),
    children: count(r.children),
    payments,
  };
  const slug = text(r.packageSlug, 80);
  if (/^[a-z0-9-]+$/.test(slug)) deal.packageSlug = slug;
  const name = text(r.packageName, 120);
  if (name) deal.packageName = name;
  if (typeof r.room === "string" && Object.hasOwn(ROOMS, r.room)) deal.room = r.room as Room;
  const ppp = amount(r.pricePerPerson);
  if (ppp) deal.pricePerPerson = ppp;
  const total = amount(r.total);
  if (total !== undefined && r.total !== null && r.total !== "") deal.total = total;
  const travel = day(r.travelDate);
  if (travel) deal.travelDate = travel;
  const city = text(r.city, 60);
  if (city) deal.city = city;
  return deal;
}

/** What staff can send to change a lead. Anything missing is left alone; null clears. */
export type StaffPatch = {
  stage?: LeadStage;
  notes?: string;
  seen?: boolean;
  name?: string;
  phone?: string;
  channel?: Channel;
  deal?: Deal | null;
  followUpOn?: string | null;
};

export function sanitizePatch(raw: unknown): StaffPatch | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const p: StaffPatch = {};
  if (r.stage !== undefined) {
    if (!isLeadStage(r.stage)) return null;
    p.stage = r.stage;
  }
  if (typeof r.notes === "string") p.notes = r.notes.slice(0, 4000);
  if (r.seen === true) p.seen = true;
  if (r.name !== undefined) p.name = text(r.name, 80);
  if (r.phone !== undefined) p.phone = text(r.phone, 30);
  if (r.channel !== undefined) {
    if (!isChannel(r.channel)) return null;
    p.channel = r.channel;
  }
  if (r.deal !== undefined) p.deal = r.deal === null ? null : sanitizeDeal(r.deal);
  if (r.followUpOn !== undefined) p.followUpOn = r.followUpOn === null ? null : (day(r.followUpOn) ?? null);
  return p;
}

// ---------------------------------------------------------------- applying

function push(lead: Lead, e: LeadEvent) {
  lead.events.push(e);
  if (lead.events.length > MAX_EVENTS) lead.events.splice(0, lead.events.length - MAX_EVENTS);
}

function stageLabel(s: LeadStage): string {
  return LEAD_STAGES.find((x) => x.id === s)?.label ?? s;
}

function shortDay(d: string): string {
  const [y, m, dd] = d.split("-").map(Number);
  return `${dd} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1]} ${y}`;
}

/** The booking without its payments, to tell "details changed" apart from "payment added". */
function terms(d: Deal | undefined): string {
  if (!d) return "";
  const { payments: _payments, ...rest } = d;
  return JSON.stringify(rest);
}

/** Applies one staff edit, with a timeline entry for each change that matters. */
export function applyStaffPatch(prev: Lead, p: StaffPatch, now: string): Lead {
  const lead: Lead = structuredClone(prev);
  let changed = false;
  const note = (kind: string, text: string) => push(lead, { at: now, kind, text });

  if (p.name !== undefined || p.phone !== undefined || p.channel !== undefined) {
    const name = p.name ?? lead.name;
    const phone = p.phone ?? lead.phone;
    const channel = p.channel ?? lead.channel;
    if (name !== lead.name || phone !== lead.phone || channel !== lead.channel) {
      lead.name = name;
      lead.phone = phone;
      lead.phoneE164 = toE164(phone);
      if (lead.origin === "manual" && channel) lead.channel = channel;
      note("staff", "Contact details edited");
      changed = true;
    }
  }

  if (p.deal !== undefined) {
    const before = prev.deal;
    if (p.deal === null) {
      if (before) {
        delete lead.deal;
        note("staff", "Booking details removed");
        changed = true;
      }
    } else {
      const after = p.deal;
      lead.deal = after;
      if (terms(before) !== terms(after)) {
        const total = dealTotal(after);
        note("deal", `Booking: ${dealLine(after)}${total ? ` · ${pkr(total)}` : ""}`);
        changed = true;
      }
      const had = new Set((before?.payments ?? []).map((x) => x.id));
      const has = new Set(after.payments.map((x) => x.id));
      for (const pay of after.payments) {
        if (!had.has(pay.id)) {
          note("payment", `Payment received: ${pkr(pay.amount)} (${pay.method}), ${shortDay(pay.date)}`);
          changed = true;
        }
      }
      for (const pay of before?.payments ?? []) {
        if (!has.has(pay.id)) {
          note("staff", `Payment removed: ${pkr(pay.amount)} (${pay.method})`);
          changed = true;
        }
      }
      // The first money in means it is booked, so nobody has to remember to move the stage.
      if (!before?.payments.length && after.payments.length && p.stage === undefined && ["new", "contacted", "qualified"].includes(lead.stage)) {
        p = { ...p, stage: "booked" };
      }
    }
  }

  if (p.stage !== undefined && p.stage !== lead.stage) {
    note("stage", `Stage: ${stageLabel(lead.stage)} → ${stageLabel(p.stage)}`);
    lead.stage = p.stage;
    if (p.stage === "booked") lead.bookedAt ??= now;
    changed = true;
  }

  if (p.followUpOn !== undefined && p.followUpOn !== (lead.followUpOn ?? null)) {
    if (p.followUpOn) {
      lead.followUpOn = p.followUpOn;
      note("followup", `Follow-up set for ${shortDay(p.followUpOn)}`);
    } else {
      delete lead.followUpOn;
      note("followup", "Follow-up done");
    }
    changed = true;
  }

  if (p.notes !== undefined && p.notes !== lead.notes) {
    lead.notes = p.notes;
    changed = true;
  }

  if (changed) lead.staffUpdatedAt = now;
  // Seen up to the visitor's latest activity, so anything newer still shows as unread.
  if (p.seen) lead.seenAt = now > lead.updatedAt ? now : lead.updatedAt;
  return lead;
}

/** What the Add lead form sends. */
export type ManualLeadInput = {
  name: string;
  phone: string;
  channel: Channel;
  stage: LeadStage;
  notes: string;
  deal?: Deal;
  followUpOn?: string;
};

export function sanitizeManual(raw: unknown): ManualLeadInput | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const name = text(r.name, 80);
  const phone = text(r.phone, 30);
  if (!name && !phone) return null;
  const deal = r.deal ? sanitizeDeal(r.deal) : null;
  return {
    name,
    phone,
    channel: isChannel(r.channel) ? r.channel : "whatsapp",
    stage: isLeadStage(r.stage) ? r.stage : "contacted",
    notes: typeof r.notes === "string" ? r.notes.slice(0, 4000) : "",
    ...(deal && { deal }),
    ...(day(r.followUpOn) && { followUpOn: day(r.followUpOn) }),
  };
}

/** A lead for someone who got in touch directly. Seen already: the person adding it knows about it. */
export function createManualLead(input: ManualLeadInput, id: string, now: string): Lead {
  const lead: Lead = {
    id,
    origin: "manual",
    channel: input.channel,
    createdAt: now,
    updatedAt: now,
    staffUpdatedAt: now,
    seenAt: now,
    name: input.name,
    phone: input.phone,
    phoneE164: toE164(input.phone),
    forms: {},
    events: [{ at: now, kind: "added", text: `Added by the team (${CHANNELS[input.channel]})` }],
    visit: {},
    stage: input.stage,
    ...(input.stage === "booked" && { bookedAt: now }),
    notes: input.notes,
  };
  // Booking and follow-up go through the same path as later edits, so the timeline tells the same story.
  return applyStaffPatch(lead, { deal: input.deal, followUpOn: input.followUpOn ?? null }, now);
}
