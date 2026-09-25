/**
 * Lead tracking: the shape of a lead, shared by the browser capture
 * (lib/leads/client.ts), the API (app/api/lead) and the dashboard (/admin/).
 *
 * One lead is one visitor (one browser). Every form they touch adds to the same
 * lead, saved as they type, so a visitor who fills in the popup and closes it
 * without sending is still on the dashboard with everything they entered.
 */

export const LEAD_SOURCES = {
  chatbot: "Help chat",
  popup: "Price popup",
  enquiry: "Quote form",
} as const;

export type LeadSource = keyof typeof LEAD_SOURCES;

export const LEAD_STAGES = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "qualified", label: "Qualified" },
  { id: "booked", label: "Booked" },
  { id: "lost", label: "Lost" },
] as const;

export type LeadStage = (typeof LEAD_STAGES)[number]["id"];

/** Field keys the forms send, in the order the dashboard lists them. */
export const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  phone: "Phone",
  service: "Looking for",
  package: "Package",
  to: "Going to",
  days: "Duration",
  city: "Flying from",
  timeline: "When",
  date: "Travel date",
  month: "Month",
  adults: "Adults",
  children: "Children",
  room: "Room",
  notes: "Note",
};

/** What one form holds for this visitor: the latest values and whether they sent it. */
export type FormEntry = {
  source: LeadSource;
  /** The page the form was on. */
  page: string;
  fields: Record<string, string>;
  /** Chat only: the question on screen the last time they did anything, i.e. where they stopped. */
  step?: string;
  status: "draft" | "sent";
  startedAt: string;
  updatedAt: string;
  sentAt?: string;
  /** Browser sequence number of the save that set these fields; an older save arriving late is ignored. */
  seq?: number;
};

export type LeadEvent = { at: string; kind: string; text: string; page?: string };

/** Where the visitor came from and what they looked at. First-touch fields never change once set. */
export type LeadVisit = {
  landing?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  /** Google Ads click ID, for importing booked leads back into Google Ads. */
  gclid?: string;
  ad?: boolean;
  device?: string;
  browser?: string;
  os?: string;
  visits?: number;
  /** The last pages they opened, oldest first. */
  pages?: string[];
};

export type Lead = {
  id: string;
  createdAt: string;
  /** Last time the visitor did anything. Staff edits don't move it. */
  updatedAt: string;
  name: string;
  /** As typed. */
  phone: string;
  /** "" when what they typed is not a usable number. */
  phoneE164: string;
  /** First time they sent any form through to WhatsApp. */
  sentAt?: string;
  lastSentAt?: string;
  forms: Partial<Record<LeadSource, FormEntry>>;
  events: LeadEvent[];
  visit: LeadVisit;
  // Staff side.
  stage: LeadStage;
  notes: string;
  staffUpdatedAt?: string;
  /** Last time someone opened the lead on the dashboard; newer activity shows as unread. */
  seenAt?: string;
  /** "manual": added by the team for someone who got in touch directly. Missing means a website lead. */
  origin?: "web" | "manual";
  /** How a manual lead reached us. */
  channel?: Channel;
  /** What they are buying and what they have paid. */
  deal?: Deal;
  /** Next follow-up, a Pakistan-time day ("2026-09-27"). */
  followUpOn?: string;
  /** First time the stage became Booked. */
  bookedAt?: string;
};

// ---------------------------------------------------------------- CRM

export const CHANNELS = {
  whatsapp: "WhatsApp",
  call: "Phone call",
  office: "Office visit",
  facebook: "Facebook",
  instagram: "Instagram",
  referral: "Referral",
  other: "Other",
} as const;

export type Channel = keyof typeof CHANNELS;

export const SERVICES = {
  package: "Umrah package",
  visa: "Umrah visa",
  tickets: "Air tickets",
  hotels: "Hotels only",
  other: "Something else",
} as const;

export type Service = keyof typeof SERVICES;

export const ROOMS = {
  sharing: "Sharing (5-6)",
  quad: "Quad (4)",
  triple: "Triple (3)",
  double: "Double (2)",
} as const;

export type Room = keyof typeof ROOMS;

export const PAY_METHODS = ["Cash", "Bank transfer", "JazzCash", "Easypaisa", "Card", "Cheque"] as const;

export type Payment = {
  id: string;
  /** Pakistan-time day it was received ("2026-09-25"). */
  date: string;
  amount: number;
  method: string;
  note?: string;
};

/** The booking: what they want, for how many, the agreed price and the payments. Amounts are PKR. */
export type Deal = {
  service: Service;
  /** One of the site's packages, when they chose one. */
  packageSlug?: string;
  /** The package's short name, or in words what they asked for ("Visa for 3"). */
  packageName?: string;
  room?: Room;
  adults: number;
  children: number;
  pricePerPerson?: number;
  /** The agreed total. When missing it is price per person times pilgrims. */
  total?: number;
  travelDate?: string;
  city?: string;
  payments: Payment[];
};

/** A package as the CRM needs it: name and price per person by room. Built from lib/package-data.ts. */
export type CrmPackage = { slug: string; name: string; days: number; prices: Partial<Record<Room, number>> };

export function isChannel(v: unknown): v is Channel {
  return typeof v === "string" && Object.hasOwn(CHANNELS, v);
}

/** What the browser posts to /api/lead/. */
export type LeadUpdate = {
  id: string;
  /** Increases with every save from the browser, so late arrivals can be spotted. */
  seq?: number;
  source?: LeadSource;
  fields?: Record<string, string>;
  step?: string;
  sent?: boolean;
  event?: { kind: string; text: string };
  page?: string;
  visit?: LeadVisit;
  /** Clicks and closes only add to a lead that already exists; they never start one. */
  onlyIfExists?: boolean;
};

/**
 * - sent: they pressed through to WhatsApp (the team should have their message)
 * - unsent: they left a usable number but never sent. The follow-up list.
 * - direct: they got in touch another way (WhatsApp, a call, the office) and the team added them.
 * - anonymous: they started but left no usable number.
 */
export type LeadStatus = "sent" | "unsent" | "direct" | "anonymous";

export function leadStatus(lead: Pick<Lead, "sentAt" | "phoneE164" | "origin">): LeadStatus {
  if (lead.origin === "manual") return "direct";
  if (lead.sentAt) return "sent";
  if (lead.phoneE164) return "unsent";
  return "anonymous";
}

export function isUnread(lead: Pick<Lead, "updatedAt" | "seenAt">): boolean {
  return !lead.seenAt || lead.updatedAt > lead.seenAt;
}

export function isLeadSource(v: unknown): v is LeadSource {
  return typeof v === "string" && Object.hasOwn(LEAD_SOURCES, v);
}

export function isLeadStage(v: unknown): v is LeadStage {
  return LEAD_STAGES.some((s) => s.id === v);
}
