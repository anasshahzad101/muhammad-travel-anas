"use client";

import { useState } from "react";
import { XIcon } from "@/components/Icons";
import { displayName, originLabel } from "@/lib/leads/format";
import { toE164 } from "@/lib/phone";
import { CHANNELS, LEAD_STAGES, type Channel, type CrmPackage, type Deal, type Lead, type LeadStage } from "@/lib/leads/types";
import DealForm, { emptyDeal } from "./DealForm";
import Drawer from "./Drawer";
import FollowUpPicker from "./FollowUpPicker";
import { Chips, Field, inputCls } from "./fields";

/**
 * "Add lead": for someone who got in touch without the website (a WhatsApp
 * message, a call, a walk-in, a referral). Only a name or a number is needed;
 * the package and price are optional and can be added later.
 */
export default function AddLeadPanel({
  leads,
  packages,
  today,
  onClose,
  onCreated,
  onOpen,
}: {
  leads: Lead[];
  packages: CrmPackage[];
  today: string;
  onClose: () => void;
  onCreated: (lead: Lead) => void;
  onOpen: (id: string) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [stage, setStage] = useState<LeadStage>("contacted");
  const [deal, setDeal] = useState<Deal>(emptyDeal);
  const [dealOpen, setDealOpen] = useState(true);
  const [dealTouched, setDealTouched] = useState(false);
  const [followUpOn, setFollowUpOn] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const e164 = toE164(phone);
  const existing = e164 ? leads.find((l) => l.phoneE164 === e164) : undefined;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() && !phone.trim()) return setError("Add a name or a phone number.");
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/admin/leads/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, channel, stage, notes, followUpOn, ...(dealTouched && { deal }) }),
      });
      if (r.status === 401) {
        window.location.href = "/admin/login/";
        return;
      }
      const data = (await r.json().catch(() => ({}))) as { lead?: Lead; error?: string };
      if (!r.ok || !data.lead) throw new Error(data.error || "Could not save. Try again.");
      onCreated(data.lead);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save. Try again.");
      setBusy(false);
    }
  }

  return (
    <Drawer onClose={onClose} labelledBy="add-lead-h">
      <form onSubmit={save} className="flex min-h-full flex-col" noValidate>
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-sand-200 bg-[#fffdf9] px-5 pb-4 pt-5 sm:px-6">
          <div>
            <h2 id="add-lead-h" className="font-display text-[1.9rem] leading-tight text-ink-950">
              Add a lead
            </h2>
            <p className="mt-0.5 text-xs text-ink-500">Someone who messaged, called or visited. A name or number is all you need.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="-mr-2 grid h-10 w-10 flex-none place-items-center rounded-full text-ink-500 transition hover:bg-sand-100 hover:text-ink-900">
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 px-5 py-5 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" htmlFor="add-name">
              <input id="add-name" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ahmed Raza" autoComplete="off" className={inputCls} />
            </Field>
            <Field label="Phone / WhatsApp" htmlFor="add-phone">
              <input
                id="add-phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03xx xxxxxxx"
                autoComplete="off"
                className={`${inputCls} figure`}
              />
            </Field>
          </div>

          {existing && (
            <div className="rounded-2xl border border-[#efd9ae] bg-[#fdf6e8] px-4 py-3 text-sm text-[#6f4509]">
              <p>
                <strong className="font-bold">This number is already a lead:</strong> {displayName(existing)} ({originLabel(existing)}).
              </p>
              <button type="button" onClick={() => onOpen(existing.id)} className="mt-1 font-bold underline underline-offset-4">
                Open that lead instead
              </button>
            </div>
          )}
          {phone.trim() && !e164 && phone.replace(/\D/g, "").length >= 10 && (
            <p className="-mt-3 text-xs text-[#8a4a05]">That doesn&apos;t look like a complete Pakistani number. Check it, or save it as it is.</p>
          )}

          <Field label="How did they get in touch?">
            <Chips label="How did they get in touch?" options={(Object.keys(CHANNELS) as Channel[]).map((id) => ({ id, label: CHANNELS[id] }))} value={channel} onChange={setChannel} />
          </Field>

          <div className="rounded-2xl border border-sand-200">
            <button
              type="button"
              onClick={() => setDealOpen((o) => !o)}
              aria-expanded={dealOpen}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
            >
              <span>
                <span className="block text-sm font-bold text-ink-900">Package and price</span>
                <span className="block text-xs text-ink-500">Optional. You can add it or change it later.</span>
              </span>
              <span className={`text-lg text-ink-400 transition ${dealOpen ? "rotate-45" : ""}`} aria-hidden>
                +
              </span>
            </button>
            {dealOpen && (
              <div className="border-t border-sand-200 px-4 py-5">
                <DealForm
                  deal={deal}
                  packages={packages}
                  onChange={(d) => {
                    setDeal(d);
                    setDealTouched(true);
                  }}
                />
              </div>
            )}
          </div>

          <Field label="Stage">
            <Chips label="Stage" options={LEAD_STAGES.map((s) => ({ id: s.id, label: s.label }))} value={stage} onChange={setStage} />
          </Field>

          <Field label="Follow up">
            <FollowUpPicker value={followUpOn ?? undefined} today={today} onChange={setFollowUpOn} clearLabel="Clear" />
          </Field>

          <Field label="Notes" htmlFor="add-notes">
            <textarea
              id="add-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything to remember: elderly parent, wants Madinah first, asked about December..."
              className={`${inputCls} resize-y`}
            />
          </Field>
        </div>

        <div className="sticky bottom-0 border-t border-sand-200 bg-[#fffdf9] px-5 py-4 sm:px-6">
          {error && (
            <p role="alert" className="mb-3 rounded-xl bg-[#fbeaea] px-3.5 py-2.5 text-sm font-semibold text-[#8a1f1f]">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={busy}
              className="min-h-12 flex-1 rounded-full bg-night-950 text-sm font-bold text-sand-50 transition hover:bg-night-800 disabled:opacity-60"
            >
              {busy ? "Saving..." : "Save lead"}
            </button>
            <button type="button" onClick={onClose} className="min-h-12 rounded-full px-5 text-sm font-bold text-ink-600 ring-1 ring-sand-300 hover:bg-sand-100">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </Drawer>
  );
}
