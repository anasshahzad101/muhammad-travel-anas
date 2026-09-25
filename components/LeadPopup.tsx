"use client";

import { useEffect, useRef, useState } from "react";
import { WhatsAppIcon, XIcon } from "./Icons";
import { FINDER_DAYS } from "@/lib/finder";
import { leadEvent, saveDraft, sendLead } from "@/lib/leads/client";
import { site, whatsappLink } from "@/lib/site";
import { trackConversion } from "@/lib/track";
import { hasContacted, isAdVisit } from "@/lib/visit";

/**
 * A short enquiry that opens once, a few seconds after a visitor lands on any
 * page: name, phone, where to, when and for how long. Sending opens WhatsApp
 * to the office number with the details written out, ready to send.
 *
 * Visitors from an ad wait longer: they clicked for a price, and a form over
 * that price asks for their number before they have seen it. It never opens
 * once the visitor has messaged or called, or has already been offered the
 * "Let us help you" widget this visit.
 *
 * Once closed or sent it stays away for a few days (localStorage). On phones
 * it is a bottom sheet, elsewhere a centred card; it uses a native <dialog>,
 * so focus, Esc and the backdrop behave as they should.
 *
 * What the visitor types is saved to the leads dashboard as they type
 * (lib/leads/client.ts), so someone who enters a number and closes the popup
 * without sending can still be called back.
 */

const KEY = "mt-lead-popup";
const QUIET_DAYS = 3;
const DELAY_MS = 3500;
const AD_DELAY_MS = 45000;
/** Set by the "Let us help you" widget once it has been offered this visit (opened, dismissed or skipped). */
const BOT_SEEN_KEY = "mt-bot-seen";
const DESTINATIONS = ["Makkah & Madinah", "Makkah only", "Madinah only", "Not sure yet"];

const field =
  "mt-1.5 block w-full rounded-xl border border-sand-300 bg-[#fffdf9] px-3.5 py-3 text-[16px] text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-haram-600 focus:ring-2 focus:ring-haram-600/20";
const label = "block text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-ink-600";

function seenRecently() {
  try {
    const t = Number(localStorage.getItem(KEY));
    return Number.isFinite(t) && t > 0 && Date.now() - t < QUIET_DAYS * 864e5;
  } catch {
    return false;
  }
}

function botSeen() {
  try {
    return sessionStorage.getItem(BOT_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

/** "2026-11-12" as "12 November 2026". */
function longDate(iso: string): string {
  return iso ? new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";
}

/** The form's values for the lead. Drafts carry only what the visitor touched, not untouched defaults. */
function leadFields(form: HTMLFormElement, only?: Set<string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of new FormData(form)) {
    if (only && !only.has(k)) continue;
    out[k] = k === "date" ? longDate(String(v)) : String(v);
  }
  return out;
}

function remember() {
  try {
    localStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* private mode: it will simply ask again next visit */
  }
}

export default function LeadPopup() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);
  const touched = useRef(new Set<string>());
  const sent = useRef(false);
  const noted = useRef(false);

  useEffect(() => {
    if (seenRecently()) return;
    const t = window.setTimeout(() => {
      // Already in touch, or already offered the widget this visit: nothing more to ask.
      if (hasContacted() || botSeen()) return;
      // Tells the "Let us help you" widget not to open itself as well this visit.
      try {
        sessionStorage.setItem("mt-lead-shown", "1");
      } catch {
        /* storage blocked: the widget may also open, which is harmless */
      }
      setOpen(true);
    }, isAdVisit() ? AD_DELAY_MS : DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!open || !d || d.open) return;
    d.showModal();
    // Land focus on the card itself: no ring on the close button, no keyboard popping up on phones.
    d.querySelector<HTMLElement>("[data-lead-card]")?.focus();
  }, [open]);

  /** Closed without sending after typing something: worth a note on their lead. */
  function noteClose() {
    if (sent.current || noted.current || touched.current.size === 0) return;
    noted.current = true;
    leadEvent("closed", "Closed the popup without sending", { source: "popup" });
  }

  function close() {
    noteClose();
    remember();
    ref.current?.close();
    setOpen(false);
  }

  function edit(e: React.FormEvent<HTMLFormElement>) {
    const name = (e.target as HTMLInputElement).name;
    if (!name) return;
    touched.current.add(name);
    saveDraft("popup", leadFields(e.currentTarget, touched.current));
  }

  function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const when = longDate(get("date")) || "Not sure yet";
    const message = [
      "Assalam o Alaikum, I would like an Umrah quote.",
      `Name: ${get("name")}`,
      `Phone: ${get("phone")}`,
      `Going to: ${get("to")}`,
      `Travel date: ${when}`,
      `Duration: ${get("days")}`,
      `(Sent from ${window.location.pathname})`,
    ].join("\n");
    trackConversion("lead", { page: window.location.pathname, form: "popup" }, { phone: get("phone") });
    sent.current = true;
    sendLead("popup", { ...leadFields(e.currentTarget), date: when });
    window.open(whatsappLink(message), "_blank", "noopener");
    close();
  }

  const today = new Date();
  const min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <dialog
      ref={ref}
      aria-labelledby="lead-title"
      onClose={() => {
        noteClose();
        remember();
        setOpen(false);
      }}
      // A click on the backdrop lands on the <dialog> itself, not on the card inside it.
      onClick={(e) => e.target === e.currentTarget && close()}
      className="m-0 mt-auto max-h-[100dvh] w-full max-w-none bg-transparent p-0 backdrop:bg-[rgb(3_11_9/0.72)] backdrop:backdrop-blur-sm sm:m-auto sm:w-[calc(100%-2rem)] sm:max-w-[30rem]"
    >
      {open && (
        <div data-lead-card tabIndex={-1} className="rise relative max-h-[100dvh] outline-none overflow-y-auto rounded-t-[28px] bg-sand-50 px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-6 shadow-[0_-20px_60px_-20px_rgb(0_0_0/0.5)] sm:rounded-[28px] sm:px-7 sm:pb-7 sm:pt-7">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full text-ink-500 transition hover:bg-sand-200 hover:text-ink-900"
          >
            <XIcon className="h-5 w-5" />
          </button>

          <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-gold-700">Plan your Umrah</p>
          <h2 id="lead-title" className="mt-1.5 pr-10 font-display text-[1.9rem] leading-[1.1] text-ink-900 sm:text-[2.1rem]">
            Get your price on WhatsApp
          </h2>
          <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-600">Tell us a little and we will send you the options.</p>

          <form onSubmit={send} onChange={edit} className="mt-5 grid grid-cols-2 gap-x-3 gap-y-3.5">
            <label className="col-span-2 sm:col-span-1">
              <span className={label}>Your name</span>
              <input name="name" required autoComplete="name" placeholder="e.g. Ahmed Raza" className={field} />
            </label>
            <label className="col-span-2 sm:col-span-1">
              <span className={label}>Phone</span>
              <input
                name="phone"
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                pattern="[0-9+ \-]{10,16}"
                title="Your phone number, e.g. 0304 1458319"
                placeholder="03xx xxxxxxx"
                className={field}
              />
            </label>
            <label className="col-span-2">
              <span className={label}>Where to</span>
              <select name="to" defaultValue={DESTINATIONS[0]} className={field}>
                {DESTINATIONS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
            <label>
              <span className={label}>Travel date</span>
              <input name="date" type="date" min={min} className={field} />
            </label>
            <label>
              <span className={label}>For how long</span>
              <select name="days" defaultValue="15 days" className={field}>
                {FINDER_DAYS.map((d) => (
                  <option key={d}>{`${d} days`}</option>
                ))}
                <option>Not sure yet</option>
              </select>
            </label>
            <button type="submit" className="btn btn-wa btn-lg col-span-2 mt-1 w-full">
              <WhatsAppIcon className="h-5 w-5" />
              Send on WhatsApp
            </button>
          </form>
          <p className="mt-3 text-center text-[0.76rem] text-ink-500">
            Opens WhatsApp to <span className="figure font-semibold text-ink-700">{site.contact.phoneDisplay}</span> with your details filled in.
          </p>
        </div>
      )}
    </dialog>
  );
}
