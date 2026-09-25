/**
 * How a lead reads on the dashboard and in the CSV: one-line summaries, the
 * answers in a fixed order, Pakistan time, and the follow-up WhatsApp text.
 */

import { formatPhone } from "@/lib/phone";
import { dealLine } from "./staff";
import { CHANNELS, FIELD_LABELS, LEAD_SOURCES, leadStatus, type FormEntry, type Lead, type LeadSource } from "./types";

/** Newest first: the chat, the popup and the quote form this visitor touched. */
export function formsOf(lead: Lead): FormEntry[] {
  return Object.values(lead.forms)
    .filter((f): f is FormEntry => !!f)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function sourcesOf(lead: Lead): LeadSource[] {
  return formsOf(lead).map((f) => f.source);
}

/** [label, value] pairs in the dashboard's order; unknown keys go last. */
export function fieldRows(fields: Record<string, string>, { skipContact = false } = {}): [string, string][] {
  const known = Object.keys(FIELD_LABELS);
  return Object.entries(fields)
    .filter(([k, v]) => v && !(skipContact && (k === "name" || k === "phone")))
    .sort(([a], [b]) => (known.indexOf(a) === -1 ? 99 : known.indexOf(a)) - (known.indexOf(b) === -1 ? 99 : known.indexOf(b)))
    .map(([k, v]) => [FIELD_LABELS[k] ?? k.charAt(0).toUpperCase() + k.slice(1), v]);
}

/**
 * "Umrah package · 15 days · Lahore · In 1-3 months": what they want. The
 * booking the team entered wins; otherwise the forms, merged.
 */
export function summary(lead: Lead): string {
  if (lead.deal) return dealLine(lead.deal);
  const merged: Record<string, string> = {};
  for (const f of [...formsOf(lead)].reverse()) Object.assign(merged, f.fields);
  const parts = ["service", "package", "to", "days", "city", "timeline", "date", "month"]
    .map((k) => merged[k])
    .filter((v) => v && !/^not sure/i.test(v));
  const people = Number(merged.adults) > 0 ? `${merged.adults} adult${merged.adults === "1" ? "" : "s"}` : "";
  return [...new Set(parts), people].filter(Boolean).join(" · ");
}

export function displayName(lead: Lead): string {
  return lead.name || (lead.phoneE164 ? formatPhone(lead.phoneE164) : lead.origin === "manual" ? "No name" : "Unknown visitor");
}

/** Where the lead came from, in words: "Help chat, Price popup" or "WhatsApp (added by us)". */
export function originLabel(lead: Lead): string {
  if (lead.origin === "manual") return `${lead.channel ? CHANNELS[lead.channel] : "Direct"} (added by us)`;
  return formsOf(lead).map((f) => LEAD_SOURCES[f.source]).join(", ");
}

export function displayPhone(lead: Lead): string {
  return lead.phoneE164 ? formatPhone(lead.phoneE164) : lead.phone;
}

export function sourceLabel(s: LeadSource): string {
  return LEAD_SOURCES[s];
}

/*
 * Pakistan time is UTC+5 all year (no daylight saving), so it is worked out by
 * hand instead of with Intl: Node and browsers ship different ICU data ("Sep"
 * vs "Sept"), and the dashboard is rendered on both, so they must agree.
 */
const PKT_OFFSET_MS = 5 * 3600_000;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function pkParts(t: string | number) {
  const d = new Date((typeof t === "number" ? t : Date.parse(t)) + PKT_OFFSET_MS);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate(), h: d.getUTCHours(), min: d.getUTCMinutes() };
}

/** "25 Sep, 2:14 pm" in Pakistan time. */
export function pkTime(iso: string, withYear = false): string {
  const p = pkParts(iso);
  const h12 = p.h % 12 || 12;
  return `${p.d} ${MONTHS[p.m]}${withYear ? ` ${p.y}` : ""}, ${h12}:${String(p.min).padStart(2, "0")} ${p.h < 12 ? "am" : "pm"}`;
}

/** "2026-09-25" in Pakistan time, for grouping by day. */
export function pkDay(t: string | number): string {
  const p = pkParts(t);
  return `${p.y}-${String(p.m + 1).padStart(2, "0")}-${String(p.d).padStart(2, "0")}`;
}

/** "2026-09-25" as "25 Sep". */
export function dayLabel(day: string): string {
  const [, m, d] = day.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}

/** The PKT day `n` days before the given one ("2026-09-25", 1 -> "2026-09-24"). */
export function dayBefore(day: string, n: number): string {
  const t = Date.parse(`${day}T12:00:00Z`) - n * 86_400_000;
  return new Date(t).toISOString().slice(0, 10);
}

export function dayAfter(day: string, n: number): string {
  return dayBefore(day, -n);
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** "2026-09-27" as "Sun 27 Sep". */
export function weekdayLabel(day: string): string {
  return `${WEEKDAYS[new Date(`${day}T12:00:00Z`).getUTCDay()]} ${dayLabel(day)}`;
}

/** Whole days from `from` to `to` (both "YYYY-MM-DD"); negative when `to` is earlier. */
export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T12:00:00Z`) - Date.parse(`${from}T12:00:00Z`)) / 86_400_000);
}

/** How a follow-up date reads on the list: overdue, today, or when. */
export function followUpState(on: string, today: string): { text: string; tone: "overdue" | "today" | "later" } {
  const d = daysBetween(today, on);
  if (d < 0) return { text: `Overdue since ${dayLabel(on)}`, tone: "overdue" };
  if (d === 0) return { text: "Follow up today", tone: "today" };
  if (d === 1) return { text: "Follow up tomorrow", tone: "later" };
  return { text: `Follow up ${weekdayLabel(on)}`, tone: "later" };
}

export function timeAgo(iso: string, now = Date.now()): string {
  const s = Math.max(0, Math.round((now - Date.parse(iso)) / 1000));
  if (s < 45) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr${h === 1 ? "" : "s"} ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d} day${d === 1 ? "" : "s"} ago`;
  return pkTime(iso);
}

/** The message staff send when they follow up, written so it opens in the lead's own WhatsApp chat. */
export function followUpText(lead: Lead): string {
  const hello = `Assalam o Alaikum${lead.name ? ` ${lead.name.split(" ")[0]}` : ""}, this is Muhammad Travels.`;
  const what = summary(lead);
  const about = what ? ` (${what})` : "";
  const status = leadStatus(lead);
  if (status === "direct") {
    return `${hello}\n\nFollowing up on your Umrah${about}. Is there anything you would like us to help with?`;
  }
  if (status === "sent") {
    return `${hello}\n\nThank you for your Umrah enquiry${about}. We are putting your options together. Is there anything else you would like us to include?`;
  }
  return `${hello}\n\nYou started an Umrah enquiry on our website${about} but it did not reach us. Can we help you with a price or answer any questions?`;
}

export function followUpLink(lead: Lead): string | null {
  if (!lead.phoneE164) return null;
  return `https://wa.me/${lead.phoneE164.slice(1)}?text=${encodeURIComponent(followUpText(lead))}`;
}
