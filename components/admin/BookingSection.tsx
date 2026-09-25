"use client";

import { useState } from "react";
import { dayLabel } from "@/lib/leads/format";
import { balance, dealLine, dealTotal, lakh, pkr, received } from "@/lib/leads/staff";
import { PAY_METHODS, SERVICES, type CrmPackage, type Deal, type Lead, type Payment, type Service } from "@/lib/leads/types";
import DealForm, { emptyDeal } from "./DealForm";
import { Chips, Field, MoneyInput, inputCls } from "./fields";

/** A first booking for a website lead starts from what they told the website. */
function draftFromLead(lead: Lead): Deal {
  const d = emptyDeal();
  const f: Record<string, string> = {};
  for (const form of Object.values(lead.forms)) Object.assign(f, form?.fields);
  const service = Object.entries(SERVICES).find(([, label]) => label === f.service)?.[0] as Service | undefined;
  if (service) d.service = service;
  if (["Lahore", "Karachi", "Islamabad"].includes(f.city)) d.city = f.city;
  if (Number(f.adults) > 0) d.adults = Math.min(60, Number(f.adults));
  if (Number(f.children) > 0) d.children = Math.min(60, Number(f.children));
  if (f.package) d.packageName = f.package;
  return d;
}

function payId(): string {
  return `p-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * The booking on a lead: what they are buying, the total, what they have paid
 * and what is left, with the payments listed. "Add payment" is two fields and
 * a button; the first payment moves the lead to Booked by itself.
 */
export default function BookingSection({
  lead,
  packages,
  today,
  save,
}: {
  lead: Lead;
  packages: CrmPackage[];
  today: string;
  save: (deal: Deal | null) => Promise<boolean>;
}) {
  const deal = lead.deal;
  const [editing, setEditing] = useState<Deal | null>(null);
  const [paying, setPaying] = useState<Omit<Payment, "id" | "amount"> & { amount?: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function commit(next: Deal | null): Promise<boolean> {
    setBusy(true);
    setError("");
    const ok = await save(next);
    setBusy(false);
    if (!ok) setError("Could not save. Check the connection and try again.");
    return ok;
  }

  // ---------------------------------------------------------------- editing
  if (editing) {
    return (
      <div>
        <DealForm deal={editing} onChange={setEditing} packages={packages} />
        {error && <p className="mt-4 rounded-xl bg-[#fbeaea] px-3.5 py-2.5 text-sm font-semibold text-[#8a1f1f]">{error}</p>}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={async () => (await commit(editing)) && setEditing(null)}
            className="min-h-11 rounded-full bg-night-950 px-5 text-sm font-bold text-sand-50 transition hover:bg-night-800 disabled:opacity-60"
          >
            {busy ? "Saving..." : "Save booking"}
          </button>
          <button type="button" onClick={() => setEditing(null)} className="min-h-11 rounded-full px-4 text-sm font-bold text-ink-600 ring-1 ring-sand-300 hover:bg-sand-100">
            Cancel
          </button>
          {deal && (
            <button
              type="button"
              onClick={async () => {
                if (!window.confirm(deal.payments.length ? "Remove the booking and its payments from this lead?" : "Remove the booking details from this lead?")) return;
                if (await commit(null)) setEditing(null);
              }}
              className="ml-auto text-xs font-bold text-[#8a1f1f] underline decoration-[#e7b9b9] underline-offset-4"
            >
              Remove booking
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------- empty
  if (!deal) {
    return (
      <div className="rounded-2xl border border-dashed border-sand-400 px-4 py-5 text-center">
        <p className="text-sm font-semibold text-ink-800">No package or price yet</p>
        <p className="mx-auto mt-1 max-w-xs text-xs text-ink-500">Add what they are booking and the price. Payments go here too.</p>
        <button
          type="button"
          onClick={() => setEditing(draftFromLead(lead))}
          className="mt-3 min-h-10 rounded-full bg-night-950 px-5 text-sm font-bold text-sand-50 transition hover:bg-night-800"
        >
          Add package and price
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------------- view
  const total = dealTotal(deal);
  const paid = received(deal);
  const left = balance(deal);
  const share = total ? Math.min(1, paid / total) : 0;
  const meta = [deal.travelDate && `Travelling ${dayLabel(deal.travelDate)} ${deal.travelDate.slice(0, 4)}`, deal.city && `from ${deal.city}`].filter(Boolean).join(" ");

  return (
    <div>
      <div className="rounded-2xl border border-sand-200 bg-white">
        <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4">
          <div className="min-w-0">
            <p className="text-[0.95rem] font-bold text-ink-950">{dealLine(deal)}</p>
            {meta && <p className="mt-0.5 text-xs text-ink-500">{meta}</p>}
            {deal.pricePerPerson ? <p className="mt-0.5 text-xs text-ink-500">{pkr(deal.pricePerPerson)} per person</p> : null}
          </div>
          <button type="button" onClick={() => setEditing(structuredClone(deal))} className="flex-none text-xs font-bold text-ink-600 underline decoration-sand-400 underline-offset-4 hover:text-ink-900">
            Edit
          </button>
        </div>

        <div className="grid grid-cols-3 border-t border-sand-200 text-center">
          <div className="px-2 py-3">
            <p className="text-[11px] font-semibold text-ink-500">Total</p>
            <p className="mt-0.5 text-[0.95rem] font-bold text-ink-950">{total ? lakh(total) : "Not set"}</p>
          </div>
          <div className="border-x border-sand-200 px-2 py-3">
            <p className="text-[11px] font-semibold text-ink-500">Received</p>
            <p className="mt-0.5 text-[0.95rem] font-bold text-[#0a5343]">{lakh(paid)}</p>
          </div>
          <div className="px-2 py-3">
            <p className="text-[11px] font-semibold text-ink-500">Balance</p>
            <p className={`mt-0.5 text-[0.95rem] font-bold ${left > 0 ? "text-[#8a4a05]" : "text-[#0a5343]"}`}>{total && left === 0 ? "Paid" : lakh(left)}</p>
          </div>
        </div>
        {total > 0 && (
          <div className="px-4 pb-4" aria-hidden>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#e2f3ed]">
              <div className="h-full rounded-full bg-[#0a8a6a] transition-[width] duration-500" style={{ width: `${Math.round(share * 100)}%` }} />
            </div>
          </div>
        )}

        {deal.payments.length > 0 && (
          <ul className="divide-y divide-sand-200 border-t border-sand-200">
            {[...deal.payments]
              .sort((a, b) => (a.date < b.date ? 1 : -1))
              .map((p) => (
                <li key={p.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                  <span className="w-16 flex-none text-xs text-ink-500">{dayLabel(p.date)}</span>
                  <span className="min-w-0 flex-1 truncate text-ink-700">
                    {p.method}
                    {p.note && <span className="text-ink-400"> · {p.note}</span>}
                  </span>
                  <span className="font-bold tabular-nums text-ink-950">{pkr(p.amount)}</span>
                  <button
                    type="button"
                    aria-label={`Remove payment of ${pkr(p.amount)}`}
                    onClick={() => {
                      if (window.confirm(`Remove the ${pkr(p.amount)} payment?`)) void commit({ ...deal, payments: deal.payments.filter((x) => x.id !== p.id) });
                    }}
                    className="grid h-7 w-7 flex-none place-items-center rounded-full text-ink-400 transition hover:bg-[#fbeaea] hover:text-[#8a1f1f]"
                  >
                    &times;
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>

      {paying ? (
        <div className="mt-3 rounded-2xl border border-sand-300 bg-sand-50 p-4">
          <div className="space-y-4">
            <Field label="Amount received">
              <MoneyInput value={paying.amount} onChange={(amount) => setPaying({ ...paying, amount })} placeholder={left ? String(left) : "e.g. 100000"} autoFocus />
            </Field>
            <Field label="Paid by">
              <Chips small label="Paid by" options={PAY_METHODS.map((m) => ({ id: m, label: m }))} value={paying.method} onChange={(method) => setPaying({ ...paying, method })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date">
                <input type="date" value={paying.date} max={today} onChange={(e) => setPaying({ ...paying, date: e.target.value || today })} className={inputCls} />
              </Field>
              <Field label="Note (optional)">
                <input value={paying.note ?? ""} onChange={(e) => setPaying({ ...paying, note: e.target.value })} placeholder="e.g. advance" className={inputCls} />
              </Field>
            </div>
          </div>
          {error && <p className="mt-3 rounded-xl bg-[#fbeaea] px-3.5 py-2.5 text-sm font-semibold text-[#8a1f1f]">{error}</p>}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              disabled={busy || !paying.amount}
              onClick={async () => {
                if (!paying.amount) return;
                const payment: Payment = { id: payId(), date: paying.date, amount: paying.amount, method: paying.method, ...(paying.note?.trim() && { note: paying.note.trim() }) };
                if (await commit({ ...deal, payments: [...deal.payments, payment] })) setPaying(null);
              }}
              className="min-h-11 rounded-full bg-[#0a8a6a] px-5 text-sm font-bold text-white transition hover:bg-[#08765a] disabled:opacity-50"
            >
              {busy ? "Saving..." : "Save payment"}
            </button>
            <button type="button" onClick={() => setPaying(null)} className="min-h-11 rounded-full px-4 text-sm font-bold text-ink-600 ring-1 ring-sand-300 hover:bg-white">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPaying({ date: today, method: "Cash" })}
          className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#e2f3ed] px-4 text-sm font-bold text-[#0a5343] ring-1 ring-[#bfe3d6] transition hover:bg-[#d3ede4]"
        >
          + Add payment
        </button>
      )}
      {!paying && error && <p className="mt-3 rounded-xl bg-[#fbeaea] px-3.5 py-2.5 text-sm font-semibold text-[#8a1f1f]">{error}</p>}
    </div>
  );
}
