"use client";

import { useEffect, useId, useState } from "react";
import { WhatsAppIcon } from "./Icons";
import { trackConversion } from "@/lib/track";

/**
 * Enquiry form that hands off to WhatsApp.
 *
 * Pakistani pilgrims overwhelmingly book over WhatsApp, and a prefilled message
 * gets the team every detail they need in the first message instead of five
 * rounds of "how many people? which month?". If NEXT_PUBLIC_ENQUIRY_ENDPOINT is
 * set (e.g. a Google Apps Script that appends to a Sheet), the lead is also
 * posted there, so nothing is lost if the customer never presses send.
 */

// The 1448H season. Update each year; past months are hidden automatically.
const SEASON_MONTHS = [
  "2026-10|October 2026",
  "2026-11|November 2026",
  "2026-12|December 2026 (winter holidays)",
  "2027-01|January 2027",
  "2027-02|February 2027 (Ramadan starts ~8 Feb)",
  "2027-03|March 2027 (last 10 nights of Ramadan)",
];

const ENDPOINT = process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT || "";

export default function EnquiryForm({
  whatsapp,
  packageName,
  compact = false,
  heading = "Get a quote on WhatsApp",
}: {
  whatsapp: string;
  packageName?: string;
  compact?: boolean;
  heading?: string;
}) {
  const uid = useId();
  const [months, setMonths] = useState(SEASON_MONTHS);
  const [error, setError] = useState("");

  useEffect(() => {
    const now = new Date();
    const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    setMonths(SEASON_MONTHS.filter((m) => m.split("|")[0] >= current));
  }, []);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "").trim();
    const phone = String(f.get("phone") || "").trim();
    if (name.length < 2) return setError("Please enter your name.");
    if (phone.replace(/\D/g, "").length < 10) return setError("Please enter a phone number we can reach on WhatsApp.");
    setError("");

    const pkg = String(f.get("package") || "").trim();
    const lines = [
      "Assalam o Alaikum, I'd like a quote for Umrah.",
      `Name: ${name}`,
      pkg ? `Package: ${pkg}` : "",
      `Travelling from: ${f.get("city")}`,
      `Month: ${f.get("month")}`,
      `Pilgrims: ${f.get("adults")} adult(s)${Number(f.get("children")) > 0 ? `, ${f.get("children")} child(ren)` : ""}`,
      `Room: ${f.get("room")}`,
      `My number: ${phone}`,
      String(f.get("notes") || "").trim() ? `Note: ${String(f.get("notes")).trim()}` : "",
      `(Sent from ${window.location.pathname})`,
    ].filter(Boolean);
    const text = lines.join("\n");

    trackConversion("lead", { page: window.location.pathname });
    if (ENDPOINT) {
      try {
        fetch(ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          keepalive: true,
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ name, phone, package: pkg, message: text, page: window.location.pathname }),
        });
      } catch {
        // Never block the WhatsApp hand-off on the backup copy.
      }
    }
    window.location.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
  }

  const field =
    "mt-1.5 block w-full rounded-xl border border-sand-300 bg-sand-50/70 px-4 py-3 text-[0.95rem] text-ink-950 transition placeholder:text-ink-400 hover:border-sand-400 focus:border-gold-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-gold-400/15";
  const label = "block text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-ink-500";

  return (
    <form onSubmit={onSubmit} className="card reveal relative overflow-hidden p-6 sm:p-7" noValidate aria-labelledby={`${uid}-h`}>
      <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-haram-600" />
      <p className="inline-flex items-center gap-2 rounded-full bg-haram-50 px-3 py-1 text-[0.72rem] font-bold text-haram-800">
        <span className="h-1.5 w-1.5 rounded-full bg-wa-500 animate-pulse-dot" />
        Replies on WhatsApp
      </p>
      <h2 id={`${uid}-h`} className="mt-4 text-[2rem] leading-tight">
        {heading}
      </h2>
      <p className="mt-1.5 text-sm text-ink-600">Tell us the basics - we reply on WhatsApp with a full price.</p>

      <div className={`mt-5 grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div>
          <label htmlFor={`${uid}-name`} className={label}>
            Your name
          </label>
          <input id={`${uid}-name`} name="name" autoComplete="name" required className={field} placeholder="e.g. Ahmed Raza" />
        </div>
        <div>
          <label htmlFor={`${uid}-phone`} className={label}>
            WhatsApp / phone
          </label>
          <input
            id={`${uid}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            className={field}
            placeholder="03XX XXXXXXX"
          />
        </div>
        <div className={compact ? "" : "sm:col-span-2"}>
          <label htmlFor={`${uid}-package`} className={label}>
            Package (optional)
          </label>
          <input
            id={`${uid}-package`}
            name="package"
            defaultValue={packageName}
            className={field}
            placeholder="e.g. 15 days, 3-star"
          />
        </div>
        <div>
          <label htmlFor={`${uid}-city`} className={label}>
            Travelling from
          </label>
          <select id={`${uid}-city`} name="city" className={field} defaultValue="Lahore">
            <option>Lahore</option>
            <option>Karachi</option>
            <option>Islamabad</option>
            <option>Other city</option>
          </select>
        </div>
        <div>
          <label htmlFor={`${uid}-month`} className={label}>
            When?
          </label>
          <select id={`${uid}-month`} name="month" className={field} defaultValue="Not sure yet">
            {months.map((m) => (
              <option key={m} value={m.split("|")[1]}>
                {m.split("|")[1]}
              </option>
            ))}
            <option>Not sure yet</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${uid}-adults`} className={label}>
              Adults
            </label>
            <input id={`${uid}-adults`} name="adults" type="number" min={1} max={60} defaultValue={2} className={field} />
          </div>
          <div>
            <label htmlFor={`${uid}-children`} className={label}>
              Children
            </label>
            <input id={`${uid}-children`} name="children" type="number" min={0} max={20} defaultValue={0} className={field} />
          </div>
        </div>
        <div>
          <label htmlFor={`${uid}-room`} className={label}>
            Room
          </label>
          <select id={`${uid}-room`} name="room" className={field} defaultValue="Quad (4 per room)">
            <option>Sharing (5-6 per room)</option>
            <option>Quad (4 per room)</option>
            <option>Triple (3 per room)</option>
            <option>Double (2 per room)</option>
            <option>Not sure</option>
          </select>
        </div>
        {!compact && (
          <div className="sm:col-span-2">
            <label htmlFor={`${uid}-notes`} className={label}>
              Anything else? (optional)
            </label>
            <textarea
              id={`${uid}-notes`}
              name="notes"
              rows={2}
              className={field}
              placeholder="Elderly parent, wheelchair, specific dates, Madinah first…"
            />
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-[#fbeaea] px-4 py-2.5 text-sm font-semibold text-[#8a1f1f]">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn-wa btn-lg mt-6 w-full">
        <WhatsAppIcon className="h-5 w-5" />
        Send on WhatsApp
      </button>
      <p className="mt-3 text-center text-xs text-ink-500">
        Opens WhatsApp with your details filled in. No payment is taken on this website.
      </p>
    </form>
  );
}
