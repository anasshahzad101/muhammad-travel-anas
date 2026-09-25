import { isAdmin } from "@/lib/leads/auth";
import { displayPhone, fieldRows, formsOf, pkDay, pkTime, sourceLabel, summary } from "@/lib/leads/format";
import { balance, dealTotal, received } from "@/lib/leads/staff";
import { listLeads } from "@/lib/leads/store";
import { CHANNELS, LEAD_STAGES, ROOMS, SERVICES, leadStatus } from "@/lib/leads/types";

export const dynamic = "force-dynamic";

const STATUS = { sent: "Sent on WhatsApp", unsent: "Did not send", direct: "Direct contact", anonymous: "No number" } as const;

/** Text a spreadsheet would run as a formula ("=HYPERLINK(...)") is prefixed so it stays text. Phone numbers keep their +. */
function cell(v: string | number | undefined): string {
  let s = v === undefined ? "" : String(v);
  if (/^[=@\t\r]/.test(s) || /^[+-][^\d]/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Every lead as a CSV that opens cleanly in Excel and Google Sheets (UTF-8 BOM, CRLF). Amounts are plain PKR numbers. */
export async function GET() {
  if (!(await isAdmin())) return new Response("Signed out", { status: 401 });
  const leads = await listLeads(100_000);

  const header = [
    "First seen (PKT)",
    "Last activity (PKT)",
    "Status",
    "Stage",
    "Name",
    "Phone",
    "Phone E.164",
    "Source",
    "Looking for",
    "Service",
    "Package",
    "Room",
    "Adults",
    "Children",
    "Price per person (PKR)",
    "Total (PKR)",
    "Received (PKR)",
    "Balance (PKR)",
    "Travel date",
    "Flying from",
    "Booked on",
    "Next follow-up",
    "Website answers",
    "Stopped at",
    "Landing page",
    "Referrer",
    "UTM source",
    "UTM medium",
    "UTM campaign",
    "Google click ID (gclid)",
    "Device",
    "Staff notes",
  ];
  const rows = leads.map((l) => {
    const forms = formsOf(l);
    const answers = forms
      .map((f) => `${sourceLabel(f.source)}: ${fieldRows(f.fields).map(([k, v]) => `${k}: ${v}`).join("; ")}`)
      .join(" | ");
    const stopped = forms.find((f) => f.status === "draft" && f.step)?.step;
    const d = l.deal;
    const source =
      l.origin === "manual"
        ? `${l.channel ? CHANNELS[l.channel] : "Direct"} (added by us)`
        : forms.map((f) => `${sourceLabel(f.source)} (${f.status === "sent" ? "sent" : "not sent"})`).join(", ");
    return [
      pkTime(l.createdAt, true),
      pkTime(l.staffUpdatedAt && l.staffUpdatedAt > l.updatedAt ? l.staffUpdatedAt : l.updatedAt, true),
      STATUS[leadStatus(l)],
      LEAD_STAGES.find((s) => s.id === l.stage)?.label ?? l.stage,
      l.name,
      displayPhone(l),
      l.phoneE164,
      source,
      summary(l),
      d ? SERVICES[d.service] : undefined,
      d?.packageName,
      d?.room ? ROOMS[d.room] : undefined,
      d?.adults,
      d?.children,
      d?.pricePerPerson,
      d ? dealTotal(d) || undefined : undefined,
      d ? received(d) : undefined,
      d ? balance(d) : undefined,
      d?.travelDate,
      d?.city,
      l.bookedAt ? pkDay(l.bookedAt) : undefined,
      l.followUpOn,
      answers,
      stopped,
      l.visit.landing,
      l.visit.referrer,
      l.visit.utmSource,
      l.visit.utmMedium,
      l.visit.utmCampaign,
      l.visit.gclid,
      [l.visit.device, l.visit.os, l.visit.browser].filter(Boolean).join(", "),
      l.notes,
    ].map(cell);
  });

  const csv = "﻿" + [header.map(cell), ...rows].map((r) => r.join(",")).join("\r\n") + "\r\n";
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="muhammad-travels-leads-${pkDay(Date.now())}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
