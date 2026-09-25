"use client";

import { useEffect, useRef, useState } from "react";
import { PhoneIcon, WhatsAppIcon, XIcon } from "@/components/Icons";
import { displayName, displayPhone, fieldRows, followUpLink, followUpText, formsOf, originLabel, pkTime, sourceLabel, timeAgo } from "@/lib/leads/format";
import { CHANNELS, LEAD_STAGES, leadStatus, type Channel, type CrmPackage, type Deal, type Lead, type LeadStage } from "@/lib/leads/types";
import BookingSection from "./BookingSection";
import Drawer from "./Drawer";
import FollowUpPicker from "./FollowUpPicker";
import { Chips, inputCls } from "./fields";
import { STAGE_STYLE, STATUS_META } from "./status";

const EVENT_DOT: Record<string, string> = {
  sent: "bg-[#0a8a6a]",
  phone: "bg-gold-500",
  closed: "bg-[#c7851a]",
  started: "bg-sand-400",
  whatsapp: "bg-wa-500",
  call: "bg-wa-500",
  added: "bg-[#9a5bc4]",
  payment: "bg-[#0a8a6a]",
  deal: "bg-night-700",
  stage: "bg-night-700",
  followup: "bg-gold-500",
  staff: "bg-ink-400",
};

function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function Section({ title, children, aside }: { title: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className="border-t border-sand-200 px-5 py-5 sm:px-6">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="font-body text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-ink-500">{title}</h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

export default function LeadPanel({
  lead,
  now,
  today,
  packages,
  onClose,
  onUpdate,
  onDelete,
}: {
  lead: Lead;
  now: number;
  today: string;
  packages: CrmPackage[];
  onClose: () => void;
  onUpdate: (lead: Lead) => void;
  onDelete: (id: string) => void;
}) {
  const [notes, setNotes] = useState(lead.notes);
  const [saving, setSaving] = useState<"" | "saving" | "saved" | "error">("");
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState<{ name: string; phone: string; channel?: Channel } | null>(null);
  const status = leadStatus(lead);
  const meta = STATUS_META[status];
  const wa = followUpLink(lead);
  const forms = formsOf(lead);
  const stopped = forms.find((f) => f.status === "draft");
  const manual = lead.origin === "manual";

  // A different lead opened in the same panel: start from its notes.
  const [shownId, setShownId] = useState(lead.id);
  if (shownId !== lead.id) {
    setShownId(lead.id);
    setNotes(lead.notes);
    setSaving("");
    setContact(null);
  }

  async function patch(body: Record<string, unknown>): Promise<boolean> {
    try {
      const r = await fetch(`/api/admin/leads/${lead.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (r.status === 401) {
        window.location.href = "/admin/login/";
        return false;
      }
      if (!r.ok) return false;
      onUpdate((await r.json()).lead as Lead);
      return true;
    } catch {
      return false;
    }
  }

  // Opening a lead marks its activity as seen.
  const seenFor = useRef("");
  useEffect(() => {
    if (seenFor.current === lead.id + lead.updatedAt) return;
    seenFor.current = lead.id + lead.updatedAt;
    if (!lead.seenAt || lead.updatedAt > lead.seenAt) void patch({ seen: true });
  }, [lead.id, lead.updatedAt]); // patch() is recreated every render; the id and activity are what matter

  async function saveNotes() {
    if (notes === lead.notes) return;
    setSaving("saving");
    setSaving((await patch({ notes })) ? "saved" : "error");
  }

  async function setStage(stage: LeadStage) {
    if (stage === lead.stage) return;
    onUpdate({ ...lead, stage }); // feels instant; the server copy replaces it
    if (!(await patch({ stage }))) onUpdate(lead);
  }

  async function setFollowUp(day: string | null) {
    onUpdate({ ...lead, followUpOn: day ?? undefined });
    if (!(await patch({ followUpOn: day }))) onUpdate(lead);
  }

  async function saveContact() {
    if (!contact) return;
    if (await patch(contact)) setContact(null);
  }

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(displayPhone(lead));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the number is on screen to copy by hand */
    }
  }

  async function remove() {
    if (!window.confirm(`Delete ${displayName(lead)} for good? This cannot be undone.`)) return;
    try {
      const r = await fetch(`/api/admin/leads/${lead.id}/`, { method: "DELETE" });
      if (r.ok) onDelete(lead.id);
    } catch {
      /* stays on screen; they can try again */
    }
  }

  const v = lead.visit;
  const cameFrom = v.gclid || v.ad ? "Google Ads" : v.utmSource ? [v.utmSource, v.utmMedium].filter(Boolean).join(" / ") : v.referrer ? hostOf(v.referrer) : "Direct or unknown";

  return (
    <Drawer onClose={onClose} labelledBy="lead-name">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-sand-200 bg-[#fffdf9] px-5 pb-4 pt-5 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ${meta.badge}`}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.mark }} aria-hidden />
                {manual && lead.channel ? `Direct · ${CHANNELS[lead.channel]}` : meta.label}
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ${STAGE_STYLE[lead.stage]}`}>
                {LEAD_STAGES.find((s) => s.id === lead.stage)?.label}
              </span>
            </div>

            {contact ? (
              <div className="mt-3 space-y-2.5">
                <input
                  aria-label="Name"
                  autoFocus
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  placeholder="Name"
                  className={inputCls}
                />
                <input
                  aria-label="Phone"
                  type="tel"
                  inputMode="tel"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  placeholder="03xx xxxxxxx"
                  className={`${inputCls} figure`}
                />
                {manual && (
                  <Chips
                    small
                    label="How they got in touch"
                    options={(Object.keys(CHANNELS) as Channel[]).map((id) => ({ id, label: CHANNELS[id] }))}
                    value={contact.channel}
                    onChange={(channel) => setContact({ ...contact, channel })}
                  />
                )}
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={saveContact} className="min-h-10 rounded-full bg-night-950 px-4 text-sm font-bold text-sand-50 hover:bg-night-800">
                    Save
                  </button>
                  <button type="button" onClick={() => setContact(null)} className="min-h-10 rounded-full px-4 text-sm font-bold text-ink-600 ring-1 ring-sand-300 hover:bg-sand-100">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 id="lead-name" className="mt-2 truncate font-display text-[1.9rem] leading-tight text-ink-950">
                  {displayName(lead)}
                </h2>
                <p className="mt-0.5 flex flex-wrap items-baseline gap-x-2 text-[0.95rem]">
                  {lead.phone && <span className="figure font-semibold text-ink-700">{displayPhone(lead)}</span>}
                  {lead.phone && !lead.phoneE164 && <span className="text-xs font-medium text-[#8a1f1f]">(not a complete number)</span>}
                  <button
                    type="button"
                    onClick={() => setContact({ name: lead.name, phone: lead.phone, ...(manual && { channel: lead.channel }) })}
                    className="text-xs font-bold text-ink-500 underline decoration-sand-400 underline-offset-4 hover:text-ink-900"
                  >
                    {lead.phone ? "Edit" : "Add a number"}
                  </button>
                </p>
                <p className="mt-1 text-xs text-ink-500">
                  {manual ? `Added ${pkTime(lead.createdAt)}` : `First seen ${pkTime(lead.createdAt)} · last active ${timeAgo(lead.updatedAt, now)}`}
                </p>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 grid h-10 w-10 flex-none place-items-center rounded-full text-ink-500 transition hover:bg-sand-100 hover:text-ink-900"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {!contact &&
          (wa ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-wa-500 px-4 text-sm font-bold text-wa-950 transition hover:bg-wa-400"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp them
              </a>
              <a
                href={`tel:${lead.phoneE164}`}
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-night-950 px-4 text-sm font-bold text-sand-50 transition hover:bg-night-800"
              >
                <PhoneIcon className="h-4 w-4 text-gold-300" />
                Call
              </a>
              <button
                type="button"
                onClick={copyNumber}
                className="inline-flex min-h-10 items-center rounded-full px-4 text-sm font-bold text-ink-700 ring-1 ring-sand-300 transition hover:bg-sand-100"
              >
                {copied ? "Copied" : "Copy number"}
              </button>
            </div>
          ) : (
            <p className="mt-4 rounded-xl bg-sand-100 px-3.5 py-2.5 text-xs leading-relaxed text-ink-600">
              {manual
                ? "No number saved. Tap “Add a number” above to be able to WhatsApp or call them from here."
                : "No number to contact yet. If this visitor comes back and leaves one, it appears here and the lead moves to the follow-up list."}
            </p>
          ))}
      </div>

      {status === "unsent" && (
        <div className="mx-5 mt-5 rounded-2xl border border-[#efd9ae] bg-[#fdf6e8] px-4 py-3.5 sm:mx-6">
          <p className="text-sm font-bold text-[#6f4509]">They never pressed send</p>
          <p className="mt-1 text-xs leading-relaxed text-[#6f4509]/85">
            {stopped ? `They filled in the ${sourceLabel(stopped.source).toLowerCase()}` : "They filled in a form"} and left
            {stopped?.step ? (
              <>
                {" "}
                at <strong className="font-semibold">&ldquo;{stopped.step}&rdquo;</strong>
              </>
            ) : null}
            . A friendly WhatsApp asking if they need help usually brings them back.
          </p>
        </div>
      )}

      {wa && (
        <details className="group mx-5 mt-4 sm:mx-6">
          <summary className="text-xs font-semibold text-ink-500 transition hover:text-ink-800">
            <span className="underline decoration-sand-400 underline-offset-4">Message that opens in WhatsApp</span> (you can edit it before sending)
          </summary>
          <p className="mt-2 whitespace-pre-line rounded-xl bg-sand-100 px-3.5 py-3 text-xs leading-relaxed text-ink-700">{followUpText(lead)}</p>
        </details>
      )}

      <div className="mt-5">
        <Section title="Stage">
          <div className="grid grid-cols-5 gap-1 rounded-xl bg-sand-100 p-1" role="radiogroup" aria-label="Stage">
            {LEAD_STAGES.map((s) => (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={lead.stage === s.id}
                onClick={() => setStage(s.id)}
                className={`min-h-9 rounded-lg px-1 text-[0.72rem] font-bold transition ${
                  lead.stage === s.id ? "bg-white text-ink-900 shadow-[0_1px_3px_rgb(20_17_13/0.12)] ring-1 ring-sand-300" : "text-ink-500 hover:text-ink-800"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Next follow-up">
          <FollowUpPicker value={lead.followUpOn} today={today} onChange={setFollowUp} />
        </Section>

        <Section title="Package, price and payments">
          <BookingSection lead={lead} packages={packages} today={today} save={(deal: Deal | null) => patch({ deal })} />
        </Section>

        <Section
          title="Notes"
          aside={
            <span className="text-[11px] text-ink-400" aria-live="polite">
              {saving === "saving" ? "Saving..." : saving === "saved" ? "Saved" : saving === "error" ? "Not saved, try again" : ""}
            </span>
          }
        >
          <textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              setSaving("");
            }}
            onBlur={saveNotes}
            rows={3}
            placeholder="Called, asked for 21 days in December, sending options tonight..."
            className="block w-full resize-y rounded-xl border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-400/25"
          />
          {notes !== lead.notes && (
            <button type="button" onClick={saveNotes} className="mt-2 rounded-full bg-night-950 px-4 py-1.5 text-xs font-bold text-sand-50 hover:bg-night-800">
              Save note
            </button>
          )}
        </Section>

        {forms.length > 0 && (
          <Section title="What they entered on the website">
            <div className="space-y-3">
              {forms.map((f) => {
                const rows = fieldRows(f.fields);
                return (
                  <div key={f.source} className="overflow-hidden rounded-2xl border border-sand-200">
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-sand-100/70 px-3.5 py-2">
                      <p className="text-xs font-bold text-ink-800">{sourceLabel(f.source)}</p>
                      <p className="text-[11px] text-ink-500">
                        {f.status === "sent" ? (
                          <span className="font-bold text-[#0a5343]">Sent {pkTime(f.sentAt ?? f.updatedAt)}</span>
                        ) : (
                          <span className="font-bold text-[#6f4509]">Not sent</span>
                        )}
                        {f.page && <> · on {f.page}</>}
                      </p>
                    </div>
                    {rows.length ? (
                      <dl className="divide-y divide-sand-200 text-[0.82rem]">
                        {rows.map(([k, val]) => (
                          <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-3 px-3.5 py-2">
                            <dt className="text-ink-500">{k}</dt>
                            <dd className={`break-words font-semibold text-ink-900 ${k === "Phone" ? "figure" : ""}`}>{val}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <p className="px-3.5 py-2.5 text-xs text-ink-500">Opened it but typed nothing yet.</p>
                    )}
                    {f.status === "draft" && f.step && (
                      <p className="border-t border-sand-200 bg-[#fdf6e8] px-3.5 py-2 text-xs text-[#6f4509]">
                        Stopped at: <strong className="font-semibold">{f.step}</strong>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        <Section title="History">
          <ol className="relative space-y-3 before:absolute before:bottom-1 before:left-[5px] before:top-1 before:w-px before:bg-sand-200">
            {[...lead.events].reverse().map((e, i) => (
              <li key={`${e.at}-${i}`} className="relative flex gap-3">
                <span className={`relative mt-1.5 h-[11px] w-[11px] flex-none rounded-full ring-[3px] ring-[#fffdf9] ${EVENT_DOT[e.kind] ?? "bg-sand-400"}`} aria-hidden />
                <div className="min-w-0">
                  <p className="text-[0.82rem] leading-snug text-ink-800">{e.text}</p>
                  <p className="mt-0.5 text-[11px] text-ink-400">
                    {pkTime(e.at)}
                    {e.page && <> · {e.page}</>}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {manual ? (
          <Section title="Source">
            <p className="text-[0.82rem] font-semibold text-ink-900">{originLabel(lead)}</p>
          </Section>
        ) : (
          <Section title="Visit">
            <dl className="grid grid-cols-[7.5rem_1fr] gap-x-3 gap-y-2 text-[0.82rem]">
              <dt className="text-ink-500">Came from</dt>
              <dd className="font-semibold text-ink-900">{cameFrom}</dd>
              {v.utmCampaign && (
                <>
                  <dt className="text-ink-500">Campaign</dt>
                  <dd className="break-words font-semibold text-ink-900">{v.utmCampaign}</dd>
                </>
              )}
              {v.landing && (
                <>
                  <dt className="text-ink-500">First page</dt>
                  <dd className="break-all font-semibold text-ink-900">{v.landing}</dd>
                </>
              )}
              <dt className="text-ink-500">Device</dt>
              <dd className="font-semibold text-ink-900">{[v.device, v.os, v.browser].filter(Boolean).join(", ") || "Unknown"}</dd>
              <dt className="text-ink-500">Visits</dt>
              <dd className="font-semibold tabular-nums text-ink-900">{v.visits ?? 1}</dd>
            </dl>
            {!!v.pages?.length && (
              <>
                <p className="mb-2 mt-4 text-xs font-semibold text-ink-500">Pages they looked at (this visit)</p>
                <ol className="space-y-1 text-[0.8rem] text-ink-700">
                  {v.pages.map((p, i) => (
                    <li key={`${p}-${i}`} className="flex gap-2">
                      <span className="w-5 flex-none text-right tabular-nums text-ink-400">{i + 1}.</span>
                      <a href={p} target="_blank" rel="noopener noreferrer" className="break-all underline decoration-sand-300 underline-offset-2 hover:decoration-gold-500">
                        {p}
                      </a>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </Section>
        )}

        <div className="border-t border-sand-200 px-5 py-6 sm:px-6">
          <button type="button" onClick={remove} className="text-xs font-bold text-[#8a1f1f] underline decoration-[#e7b9b9] underline-offset-4 hover:decoration-[#8a1f1f]">
            Delete this lead
          </button>
          <p className="mt-1 text-[11px] text-ink-400">For spam, test entries and duplicates. This cannot be undone.</p>
        </div>
      </div>
    </Drawer>
  );
}
