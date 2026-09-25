"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Mark } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/Icons";
import { dayBefore, displayName, displayPhone, followUpLink, followUpState, formsOf, originLabel, pkDay, summary, timeAgo } from "@/lib/leads/format";
import { balance, dealTotal, lakh, received } from "@/lib/leads/staff";
import {
  CHANNELS,
  LEAD_SOURCES,
  LEAD_STAGES,
  isUnread,
  leadStatus,
  type CrmPackage,
  type Lead,
  type LeadSource,
  type LeadStage,
  type LeadStatus,
} from "@/lib/leads/types";
import AddLeadPanel from "./AddLeadPanel";
import LeadPanel from "./LeadPanel";
import LeadsChart from "./LeadsChart";
import { STAGE_STYLE, STATUS_META } from "./status";

/**
 * The leads dashboard and CRM: every visitor who started the help chat, the
 * price popup or a quote form (sent or not), plus the people the team adds by
 * hand. Bookings, payments and follow-up dates live on each lead. Polls for
 * new leads every 20 seconds while the tab is open.
 */

type View = LeadStatus | "all" | "due" | "booked" | "balance";
type SourceFilter = LeadSource | "manual" | "any";

const RANGES = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
  { days: 0, label: "All time" },
] as const;

const POLL_MS = 20_000;
const PAGE = 60;

const TILES: { view: LeadStatus | "all"; label: string }[] = [
  { view: "unsent", label: "Did not send" },
  { view: "sent", label: "Sent on WhatsApp" },
  { view: "direct", label: "Direct contact" },
  { view: "anonymous", label: "No number" },
  { view: "all", label: "All leads" },
];

const VIEW_LABEL: Record<View, string> = {
  unsent: "Did not send",
  sent: "Sent on WhatsApp",
  direct: "Direct contact",
  anonymous: "No number",
  all: "All leads",
  due: "Follow-ups due",
  booked: "Booked",
  balance: "Balance to collect",
};

/** The latest thing that happened on a lead, by the visitor or the team. */
function touchedAt(l: Lead): string {
  return l.staffUpdatedAt && l.staffUpdatedAt > l.updatedAt ? l.staffUpdatedAt : l.updatedAt;
}

function owes(l: Lead): boolean {
  return !!l.deal && balance(l.deal) > 0 && (l.stage === "booked" || received(l.deal) > 0);
}

function haystack(l: Lead): string {
  const phone = l.phoneE164 ? `${displayPhone(l)} ${displayPhone(l).replace(/\s/g, "")} ${l.phoneE164}` : l.phone;
  return `${l.name} ${phone} ${summary(l)} ${l.deal?.packageName ?? ""} ${l.notes}`.toLowerCase();
}

export default function LeadsDashboard({
  initialLeads,
  packages,
  storage,
  renderedAt,
  initialError = "",
}: {
  initialLeads: Lead[];
  packages: CrmPackage[];
  storage: "postgres" | "file";
  renderedAt: number;
  initialError?: string;
}) {
  const [leads, setLeads] = useState(initialLeads);
  const [now, setNow] = useState(renderedAt);
  const [syncedAt, setSyncedAt] = useState(renderedAt);
  const [error, setError] = useState(initialError);
  const [range, setRange] = useState<number>(30);
  const [view, setView] = useState<View>("all");
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<LeadStage | "any">("any");
  const [source, setSource] = useState<SourceFilter>("any");
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [limit, setLimit] = useState(PAGE);
  const [fresh, setFresh] = useState(0);
  const [onLocalhost, setOnLocalhost] = useState(true);
  const known = useRef(new Set(initialLeads.map((l) => l.id)));

  // ---------------------------------------------------------------- live updates
  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/leads/", { cache: "no-store" });
      if (r.status === 401) {
        window.location.href = "/admin/login/";
        return;
      }
      if (!r.ok) {
        setError((await r.json().catch(() => ({})))?.error ?? "Could not load leads.");
        return;
      }
      const data = (await r.json()) as { leads: Lead[] };
      const added = data.leads.filter((l) => !known.current.has(l.id)).length;
      data.leads.forEach((l) => known.current.add(l.id));
      if (added) setFresh((n) => n + added);
      setLeads(data.leads);
      setError("");
      setSyncedAt(Date.now());
    } catch {
      setError("Offline. Showing the last leads loaded.");
    }
  }, []);

  useEffect(() => {
    setOnLocalhost(/^(localhost|127\.0\.0\.1)$/.test(window.location.hostname));
    setNow(Date.now());
    const clock = window.setInterval(() => setNow(Date.now()), 15_000);
    const poll = window.setInterval(() => document.visibilityState === "visible" && refresh(), POLL_MS);
    const onVisible = () => document.visibilityState === "visible" && refresh();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(clock);
      window.clearInterval(poll);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  useEffect(() => {
    if (!fresh) return;
    const t = window.setTimeout(() => setFresh(0), 8000);
    return () => window.clearTimeout(t);
  }, [fresh]);

  // ---------------------------------------------------------------- slicing
  const today = pkDay(now);
  const from = range ? dayBefore(today, range - 1) : "";
  const periodLabel = range ? `last ${range} days` : "all time";

  const inRange = useMemo(() => (from ? leads.filter((l) => pkDay(touchedAt(l)) >= from) : leads), [leads, from]);

  const stats = useMemo(() => {
    const by: Record<LeadStatus | "all", number> = { unsent: 0, sent: 0, direct: 0, anonymous: 0, all: inRange.length };
    const todayBy: Record<LeadStatus | "all", number> = { unsent: 0, sent: 0, direct: 0, anonymous: 0, all: 0 };
    let notContacted = 0;
    for (const l of inRange) {
      const s = leadStatus(l);
      by[s] += 1;
      if (pkDay(touchedAt(l)) === today) {
        todayBy[s] += 1;
        todayBy.all += 1;
      }
      if (s === "unsent" && l.stage === "new") notContacted += 1;
    }
    // Money and follow-ups: follow-ups and balances are "right now"; bookings and payments follow the period.
    let due = 0;
    let dueToday = 0;
    let booked = 0;
    let bookedValue = 0;
    let receivedSum = 0;
    let owed = 0;
    let owing = 0;
    for (const l of leads) {
      if (l.followUpOn && l.followUpOn <= today) {
        due += 1;
        if (l.followUpOn === today) dueToday += 1;
      }
      if (l.bookedAt && l.stage === "booked" && (!from || pkDay(l.bookedAt) >= from)) {
        booked += 1;
        if (l.deal) bookedValue += dealTotal(l.deal);
      }
      if (l.deal) {
        for (const p of l.deal.payments) if (!from || p.date >= from) receivedSum += p.amount;
        if (owes(l)) {
          owed += balance(l.deal);
          owing += 1;
        }
      }
    }
    return { by, todayBy, notContacted, due, dueToday, booked, bookedValue, receivedSum, owed, owing };
  }, [inRange, leads, today, from]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base =
      view === "due"
        ? leads.filter((l) => l.followUpOn && l.followUpOn <= today)
        : view === "balance"
          ? leads.filter(owes)
          : view === "booked"
            ? leads.filter((l) => l.stage === "booked" && l.bookedAt && (!from || pkDay(l.bookedAt) >= from))
            : inRange.filter((l) => view === "all" || leadStatus(l) === view);
    const list = base.filter(
      (l) =>
        (stage === "any" || l.stage === stage) &&
        (source === "any" || (source === "manual" ? l.origin === "manual" : !!l.forms[source])) &&
        (!q || haystack(l).includes(q)),
    );
    if (view === "due") return list.sort((a, b) => ((a.followUpOn ?? "") < (b.followUpOn ?? "") ? -1 : 1));
    if (view === "balance") return list.sort((a, b) => balance(b.deal!) - balance(a.deal!));
    return list.sort((a, b) => (touchedAt(a) < touchedAt(b) ? 1 : -1));
  }, [leads, inRange, view, stage, source, query, today, from]);

  const unread = leads.filter(isUnread).length;
  useEffect(() => {
    document.title = `${unread ? `(${unread}) ` : ""}Leads | Muhammad Travels`;
  }, [unread]);

  const open = openId ? (leads.find((l) => l.id === openId) ?? null) : null;
  const closePanel = useCallback(() => setOpenId(null), []);
  const closeAdd = useCallback(() => setAdding(false), []);
  const replace = useCallback((lead: Lead) => setLeads((all) => all.map((l) => (l.id === lead.id ? lead : l))), []);
  const remove = useCallback((id: string) => {
    setLeads((all) => all.filter((l) => l.id !== id));
    setOpenId(null);
  }, []);
  const created = useCallback((lead: Lead) => {
    known.current.add(lead.id);
    setLeads((all) => [lead, ...all]);
    setAdding(false);
    setOpenId(lead.id);
  }, []);

  function pick(v: View) {
    setView(v);
    setLimit(PAGE);
  }

  async function signOut() {
    await fetch("/api/admin/logout/", { method: "POST" }).catch(() => {});
    window.location.href = "/admin/login/";
  }

  const chartDays = range || 90;
  const filtered = !!query.trim() || stage !== "any" || source !== "any";

  function statusBadge(l: Lead, small = false) {
    const s = leadStatus(l);
    return (
      <span
        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full ${small ? "px-2 text-[10.5px]" : "px-2.5 text-[11px]"} py-0.5 font-bold ring-1 ${STATUS_META[s].badge}`}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS_META[s].mark }} aria-hidden />
        {s === "direct" && l.channel ? `Direct · ${CHANNELS[l.channel]}` : STATUS_META[s].label}
      </span>
    );
  }

  function followChip(l: Lead) {
    if (!l.followUpOn) return null;
    const f = followUpState(l.followUpOn, today);
    return (
      <span
        className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10.5px] font-bold ${
          f.tone === "overdue" ? "bg-[#fbeaea] text-[#8a1f1f]" : f.tone === "today" ? "bg-[#fbf0dc] text-[#6f4509]" : "bg-sand-100 text-ink-600"
        }`}
      >
        {f.text}
      </span>
    );
  }

  function money(l: Lead) {
    if (!l.deal) return null;
    const total = dealTotal(l.deal);
    if (!total) return null;
    const left = balance(l.deal);
    const paid = received(l.deal);
    return (
      <span className="text-[11px] font-semibold text-ink-500">
        {lakh(total)}
        {paid > 0 && (left > 0 ? <span className="text-[#8a4a05]"> · {lakh(left)} due</span> : <span className="text-[#0a5343]"> · paid</span>)}
      </span>
    );
  }

  return (
    <div className="min-h-dvh">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-gold-400/15 bg-night-950 text-sand-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Mark className="h-9 w-9 flex-none" onDark />
            <div className="min-w-0 leading-tight">
              <p className="hidden truncate font-display text-lg font-semibold text-sand-50 sm:block">Muhammad Travels</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-300/80">Leads</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <p className="mr-1 hidden items-center gap-2 text-xs text-sand-200/70 md:inline-flex" aria-live="polite">
              <span className={`h-2 w-2 rounded-full ${error ? "bg-[#e0a33a]" : "bg-wa-400 animate-pulse-dot"}`} aria-hidden />
              {error ? "Not updating" : `Live · updated ${timeAgo(new Date(syncedAt).toISOString(), now)}`}
            </p>
            <a
              href="/api/admin/leads/csv/"
              className="inline-flex min-h-9 items-center whitespace-nowrap rounded-full px-3 text-xs font-bold text-sand-100 ring-1 ring-white/15 transition hover:bg-white/10 sm:px-4"
            >
              Export CSV
            </a>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex min-h-9 items-center whitespace-nowrap rounded-full px-3 text-xs font-bold text-sand-200/70 transition hover:bg-white/10 hover:text-sand-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[2.3rem] leading-none text-ink-950">Leads</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-600">
              Website enquiries (saved as people type, sent or not) and everyone you add yourself. The ones who{" "}
              <strong className="font-semibold text-ink-800">did not send</strong> are the people to call.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-300 to-gold-400 px-6 text-sm font-extrabold text-night-950 shadow-[0_14px_30px_-16px_rgb(122_86_31/0.9)] ring-1 ring-gold-500/60 transition hover:from-gold-200 hover:to-gold-300 sm:w-auto"
          >
            <span className="text-lg leading-none" aria-hidden>
              +
            </span>
            Add lead
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold text-ink-500">Showing leads active in the {periodLabel}</p>
          <div className="flex rounded-xl bg-white p-1 ring-1 ring-sand-300" role="radiogroup" aria-label="Period">
            {RANGES.map((r) => (
              <button
                key={r.days}
                type="button"
                role="radio"
                aria-checked={range === r.days}
                onClick={() => {
                  setRange(r.days);
                  setLimit(PAGE);
                }}
                className={`min-h-9 rounded-lg px-3 text-xs font-bold transition ${range === r.days ? "bg-night-950 text-sand-50" : "text-ink-500 hover:text-ink-900"}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {storage === "file" && !onLocalhost && (
          <p className="mt-5 rounded-2xl border border-[#efd9ae] bg-[#fdf6e8] px-4 py-3 text-sm text-[#6f4509]">
            <strong className="font-bold">Leads are being saved to a file on the server.</strong> A redeploy can wipe it. Add{" "}
            <code className="rounded bg-white/70 px-1 text-xs">DATABASE_URL</code> in Hostinger&apos;s environment variables to keep them in the database.
          </p>
        )}
        {error && <p className="mt-5 rounded-2xl bg-[#fbeaea] px-4 py-3 text-sm font-semibold text-[#8a1f1f]">{error}</p>}

        {/* Status tiles double as the list filter. */}
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
          {TILES.map((t) => {
            const selected = view === t.view;
            const mark = t.view === "all" ? "#0a1b17" : STATUS_META[t.view].mark;
            const sub =
              t.view === "unsent"
                ? `${stats.notContacted} not contacted yet`
                : t.view === "sent"
                  ? `${stats.todayBy.sent} today`
                  : t.view === "direct"
                    ? "WhatsApp, calls, walk-ins"
                    : t.view === "anonymous"
                      ? "Started, left no number"
                      : `${stats.todayBy.all} today`;
            return (
              <button
                key={t.view}
                type="button"
                aria-pressed={selected}
                onClick={() => pick(t.view)}
                className={`group relative overflow-hidden rounded-2xl border bg-[#fffdf9] p-4 text-left transition sm:p-5 ${
                  t.view === "all" ? "col-span-2 lg:col-span-1" : ""
                } ${selected ? "border-night-900 shadow-[0_10px_30px_-18px_rgb(3_11_9/0.55)] ring-1 ring-night-900" : "border-sand-200 hover:border-sand-400"}`}
              >
                <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: mark }} aria-hidden />
                <span className="flex items-center gap-2 text-xs font-bold text-ink-600">
                  <span className="h-2 w-2 rounded-full" style={{ background: mark }} aria-hidden />
                  {t.label}
                </span>
                <span className="mt-2 block text-[2.1rem] font-bold leading-none tracking-tight text-ink-950">{stats.by[t.view]}</span>
                <span className="mt-2 block text-xs text-ink-500">{sub}</span>
              </button>
            );
          })}
        </div>

        {/* CRM: follow-ups and money. */}
        <div className="mt-3 grid grid-cols-2 overflow-hidden rounded-2xl border border-sand-200 bg-night-950 text-sand-50 lg:grid-cols-4">
          {(
            [
              {
                view: "due" as View,
                label: "Follow-ups due",
                value: String(stats.due),
                sub: stats.due ? `${stats.dueToday} today, ${stats.due - stats.dueToday} overdue` : "Nothing due. Nice.",
                alert: stats.due > 0,
              },
              { view: "booked" as View, label: `Booked, ${periodLabel}`, value: String(stats.booked), sub: stats.bookedValue ? `${lakh(stats.bookedValue)} in bookings` : "No bookings yet" },
              { view: null, label: `Received, ${periodLabel}`, value: lakh(stats.receivedSum), sub: "Payments recorded on leads" },
              { view: "balance" as View, label: "Balance to collect", value: lakh(stats.owed), sub: stats.owing ? `From ${stats.owing} booking${stats.owing === 1 ? "" : "s"}` : "Nothing outstanding" },
            ] as const
          ).map((c, i) => {
            const selected = c.view !== null && view === c.view;
            const body = (
              <>
                <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-sand-200/70">
                  {"alert" in c && c.alert && <span className="h-2 w-2 rounded-full bg-gold-300 animate-pulse-dot" aria-hidden />}
                  {c.label}
                </span>
                <span className="mt-1.5 block text-[1.6rem] font-bold leading-tight text-sand-50">{c.value}</span>
                <span className="mt-1 block text-xs text-sand-200/60">{c.sub}</span>
              </>
            );
            const cell = `p-4 text-left sm:p-5 ${i % 2 === 1 ? "border-l border-white/10" : ""} ${i >= 2 ? "border-t border-white/10 lg:border-t-0" : ""} ${
              i === 2 ? "lg:border-l" : ""
            }`;
            return c.view === null ? (
              <div key={c.label} className={cell}>
                {body}
              </div>
            ) : (
              <button
                key={c.label}
                type="button"
                aria-pressed={selected}
                onClick={() => pick(c.view as View)}
                className={`${cell} transition ${selected ? "bg-white/10 shadow-[inset_0_-3px_0_var(--color-gold-300)]" : "hover:bg-white/5"}`}
              >
                {body}
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <LeadsChart leads={inRange} days={chartDays} today={today} dateOf={touchedAt} />
        </div>

        {/* The list */}
        <section className="mt-4 overflow-hidden rounded-2xl border border-sand-200 bg-[#fffdf9]" aria-labelledby="list-h">
          <div className="flex flex-wrap items-center gap-3 border-b border-sand-200 px-4 py-3.5 sm:px-5">
            <h2 id="list-h" className="mr-auto font-body text-[0.95rem] font-bold tracking-normal text-ink-900">
              {VIEW_LABEL[view]} <span className="font-semibold tabular-nums text-ink-400">{rows.length}</span>
              {view !== "all" && (
                <button type="button" onClick={() => pick("all")} className="ml-3 text-xs font-semibold text-ink-500 underline decoration-sand-400 underline-offset-4 hover:text-ink-900">
                  Show all
                </button>
              )}
            </h2>
            <label className="relative w-full sm:w-64">
              <span className="sr-only">Search leads</span>
              <svg viewBox="0 0 20 20" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden>
                <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="m13 13 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setLimit(PAGE);
                }}
                placeholder="Name, number, package..."
                className="block min-h-10 w-full rounded-xl border border-sand-300 bg-white pl-9 pr-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-400/25"
              />
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as LeadStage | "any")}
              aria-label="Stage"
              className="min-h-10 flex-1 rounded-xl border border-sand-300 bg-white px-3 text-sm text-ink-800 outline-none focus:border-gold-500 sm:flex-none"
            >
              <option value="any">Any stage</option>
              {LEAD_STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as SourceFilter)}
              aria-label="Source"
              className="min-h-10 flex-1 rounded-xl border border-sand-300 bg-white px-3 text-sm text-ink-800 outline-none focus:border-gold-500 sm:flex-none"
            >
              <option value="any">Any source</option>
              {(Object.keys(LEAD_SOURCES) as LeadSource[]).map((s) => (
                <option key={s} value={s}>
                  {LEAD_SOURCES[s]}
                </option>
              ))}
              <option value="manual">Added by us</option>
            </select>
          </div>

          {rows.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="font-display text-2xl text-ink-900">{leads.length === 0 ? "No leads yet" : view === "due" ? "No follow-ups due" : "Nothing matches"}</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
                {leads.length === 0
                  ? "Website leads appear here the moment someone starts the help chat, the price popup or a quote form. Use “Add lead” for people who message or call you directly."
                  : filtered
                    ? "Try a different search, stage or source."
                    : view === "due"
                      ? "Set a follow-up date on a lead and it shows up here on that day."
                      : "No leads with this status in this period."}
              </p>
            </div>
          ) : (
            <>
              {/* Wide screens: a table */}
              <table className="hidden w-full text-left text-sm md:table">
                <thead className="border-b border-sand-200 bg-sand-50 text-[11px] uppercase tracking-[0.12em] text-ink-500">
                  <tr>
                    <th className="py-2.5 pl-5 pr-3 font-bold">Lead</th>
                    <th className="px-3 py-2.5 font-bold">Wants</th>
                    <th className="px-3 py-2.5 font-bold">Status</th>
                    <th className="px-3 py-2.5 font-bold">Stage</th>
                    <th className="px-3 py-2.5 font-bold">Updated</th>
                    <th className="py-2.5 pl-3 pr-5">
                      <span className="sr-only">Contact</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-200">
                  {rows.slice(0, limit).map((l) => {
                    const s = leadStatus(l);
                    const draft = formsOf(l).find((f) => f.status === "draft" && f.step);
                    const wa = followUpLink(l);
                    return (
                      <tr key={l.id} onClick={() => setOpenId(l.id)} className="cursor-pointer align-top transition hover:bg-sand-100/60">
                        <td className="py-3.5 pl-5 pr-3">
                          <div className="flex items-start gap-2.5">
                            <span
                              className={`mt-[7px] h-2 w-2 flex-none rounded-full ${isUnread(l) ? "bg-gold-500" : "bg-transparent"}`}
                              aria-label={isUnread(l) ? "New activity" : undefined}
                            />
                            <div className="min-w-0">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenId(l.id);
                                }}
                                className="max-w-[14rem] truncate text-left font-bold text-ink-950 hover:underline"
                              >
                                {displayName(l)}
                              </button>
                              {l.name && l.phone && <p className="figure text-[0.8rem] text-ink-500">{displayPhone(l)}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="max-w-[18rem] px-3 py-3.5">
                          <p className="line-clamp-2 text-[0.83rem] text-ink-700">{summary(l) || <span className="text-ink-400">Nothing picked yet</span>}</p>
                          <p className="mt-0.5">{money(l) ?? <span className="text-[11px] text-ink-400">{originLabel(l)}</span>}</p>
                        </td>
                        <td className="px-3 py-3.5">
                          {statusBadge(l)}
                          {s === "unsent" && draft?.step && <p className="mt-1 max-w-[13rem] truncate text-[11px] text-ink-500">Stopped at: {draft.step}</p>}
                        </td>
                        <td className="px-3 py-3.5">
                          <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ${STAGE_STYLE[l.stage]}`}>
                            {LEAD_STAGES.find((x) => x.id === l.stage)?.label}
                          </span>
                          {l.followUpOn && <div className="mt-1.5">{followChip(l)}</div>}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3.5 text-[0.8rem] text-ink-500">{timeAgo(touchedAt(l), now)}</td>
                        <td className="py-3 pl-3 pr-5 text-right">
                          {wa && (
                            <a
                              href={wa}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              aria-label={`WhatsApp ${displayName(l)}`}
                              title="WhatsApp them"
                              className="inline-grid h-9 w-9 place-items-center rounded-full bg-wa-500/15 text-[#0b6b3a] transition hover:bg-wa-500 hover:text-wa-950"
                            >
                              <WhatsAppIcon className="h-4 w-4" />
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Phones: cards */}
              <ul className="divide-y divide-sand-200 md:hidden">
                {rows.slice(0, limit).map((l) => {
                  const wa = followUpLink(l);
                  return (
                    <li key={l.id} className="flex items-start gap-3 px-4 py-4">
                      <button type="button" onClick={() => setOpenId(l.id)} className="min-w-0 flex-1 text-left">
                        <span className="flex items-center gap-2">
                          {isUnread(l) && <span className="h-2 w-2 flex-none rounded-full bg-gold-500" aria-label="New activity" />}
                          <span className="truncate font-bold text-ink-950">{displayName(l)}</span>
                        </span>
                        {l.name && l.phone && <span className="figure block text-[0.8rem] text-ink-500">{displayPhone(l)}</span>}
                        <span className="mt-1 line-clamp-2 block text-[0.82rem] text-ink-700">{summary(l) || "Nothing picked yet"}</span>
                        {money(l) && <span className="block">{money(l)}</span>}
                        <span className="mt-2 flex flex-wrap items-center gap-1.5">
                          {statusBadge(l, true)}
                          <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold ring-1 ${STAGE_STYLE[l.stage]}`}>
                            {LEAD_STAGES.find((x) => x.id === l.stage)?.label}
                          </span>
                          {followChip(l)}
                          <span className="text-[11px] text-ink-400">{timeAgo(touchedAt(l), now)}</span>
                        </span>
                      </button>
                      {wa && (
                        <a
                          href={wa}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`WhatsApp ${displayName(l)}`}
                          className="grid h-11 w-11 flex-none place-items-center rounded-full bg-wa-500 text-wa-950"
                        >
                          <WhatsAppIcon className="h-5 w-5" />
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>

              {rows.length > limit && (
                <div className="border-t border-sand-200 p-4 text-center">
                  <button
                    type="button"
                    onClick={() => setLimit((n) => n + PAGE)}
                    className="rounded-full px-5 py-2 text-xs font-bold text-ink-700 ring-1 ring-sand-300 transition hover:bg-sand-100"
                  >
                    Show {Math.min(PAGE, rows.length - limit)} more
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <p className="mt-6 text-center text-xs text-ink-400">
          Times are Pakistan time. Website leads are saved as visitors type, before they press send. The privacy policy tells visitors this.
        </p>
      </main>

      {fresh > 0 && (
        <div className="rise fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full bg-night-950 px-4 py-2.5 text-sm font-bold text-sand-50 shadow-[0_18px_40px_-16px_rgb(0_0_0/0.7)]" role="status">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-gold-300 align-middle" aria-hidden />
          {fresh} new lead{fresh === 1 ? "" : "s"}
        </div>
      )}

      {open && <LeadPanel lead={open} now={now} today={today} packages={packages} onClose={closePanel} onUpdate={replace} onDelete={remove} />}
      {adding && (
        <AddLeadPanel
          leads={leads}
          packages={packages}
          today={today}
          onClose={closeAdd}
          onCreated={created}
          onOpen={(id) => {
            setAdding(false);
            setOpenId(id);
          }}
        />
      )}
    </div>
  );
}
