"use client";

/**
 * Guided enquiry widget, the same one as on visawala.pk, set up for Umrah.
 *
 * Four quick questions (what they need, how many days, which city they fly
 * from, and when), then their name and number, then a hand-off to WhatsApp
 * with the answers written out, so the first reply can be a real answer
 * instead of "which package?".
 *
 * Deliberately not a conversational bot: it never quotes prices or answers
 * visa questions itself, it only routes and qualifies. Every answer is saved
 * to the leads dashboard as it is given (lib/leads/client.ts), so a visitor
 * who stops halfway can still be followed up.
 *
 * It opens itself once per visit after a few seconds, except when the lead
 * popup has already been shown in this visit, so a visitor never gets both.
 */

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import Link from "next/link";
import { CalendarIcon, ChevronDownIcon, ClockIcon, DomeIcon, HotelIcon, PassportIcon, PinIcon, PlaneIcon, XIcon } from "./Icons";
import { FINDER_DAYS } from "@/lib/finder";
import { leadEvent, saveDraft, sendLead } from "@/lib/leads/client";
import { toE164 } from "@/lib/phone";
import { whatsappLink } from "@/lib/site";
import { hasContacted, isAdVisit } from "@/lib/visit";

type Key = "service" | "days" | "city" | "timeline";
type Answers = Partial<Record<Key, string>>;
type Details = { name: string; phone: string };
type IconType = ComponentType<{ className?: string }>;

/** Long enough that the visitor has read something first. */
const AUTO_OPEN_MS = 7000;
/**
 * Visitors from an ad clicked for a price, so they get longer to read it. This is
 * after the lead popup's 45 seconds, so on a first visit the popup asks and this
 * stays closed (the visitor still never gets both).
 */
const AD_AUTO_OPEN_MS = 50000;
const SEEN_KEY = "mt-bot-seen";
/** Set by the lead popup when it opens; the bot then stays closed this visit. */
const LEAD_SHOWN_KEY = "mt-lead-shown";

const STEPS: { key: Key; q: string; options: { label: string; icon: IconType }[] }[] = [
  {
    key: "service",
    q: "What do you need help with?",
    options: [
      { label: "Umrah package", icon: DomeIcon },
      { label: "Umrah visa", icon: PassportIcon },
      { label: "Air tickets", icon: PlaneIcon },
      { label: "Hotels only", icon: HotelIcon },
    ],
  },
  {
    key: "days",
    q: "How many days?",
    options: [...FINDER_DAYS.map((d) => `${d} days`), "Not sure yet"].map((label) => ({ label, icon: CalendarIcon })),
  },
  {
    key: "city",
    q: "Which city are you flying from?",
    options: ["Lahore", "Karachi", "Islamabad", "Another city"].map((label) => ({ label, icon: PinIcon })),
  },
  {
    key: "timeline",
    q: "When are you planning to go?",
    options: ["Within a month", "In 1-3 months", "December holidays", "In Ramadan", "Later this season", "Just researching"].map((label) => ({ label, icon: ClockIcon })),
  },
];

/** After the questions: name and number. Then the summary. */
const DETAILS_STEP = STEPS.length;
const SEGMENTS = STEPS.length + 1;

const SUMMARY: [Key, string][] = [
  ["service", "Service"],
  ["days", "Duration"],
  ["city", "Flying from"],
  ["timeline", "When"],
];

/** Where the visitor is, in words, for "stopped at" on the leads dashboard. */
function stepLabel(step: number): string {
  if (step < STEPS.length) return STEPS[step].q;
  if (step === DETAILS_STEP) return "Name and number";
  return "Last screen (did not tap WhatsApp)";
}

function leadFields(answers: Answers, details: Details): Record<string, string> {
  return { ...answers, name: details.name.trim(), phone: details.phone.trim() };
}

const input =
  "mt-1 block w-full rounded-xl border border-sand-300 bg-white px-3.5 py-2.5 text-[16px] text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-400/25";

export default function UmrahBot() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [details, setDetails] = useState<Details>({ name: "", phone: "" });
  const [detailsError, setDetailsError] = useState("");
  const [sent, setSent] = useState(false);
  const firstOptionRef = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const onDetails = step === DETAILS_STEP;
  const done = step > DETAILS_STEP;
  const started = Object.keys(answers).length > 0 || !!details.name.trim() || !!details.phone.trim();

  /** Session flag so the panel invites once and never nags again. */
  const markSeen = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode / storage disabled: the widget still works manually */
    }
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    markSeen();
  }, [markSeen]);

  // Opens itself once per visit, so the widget is discovered rather than
  // waiting to be found. Skipped once the visitor has opened or dismissed it,
  // when the lead popup already asked this visit, when the visitor has already
  // messaged or called, and for reduced motion.
  useEffect(() => {
    let seen = true;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      return;
    }
    if (seen) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const t = setTimeout(() => {
      try {
        // Opened or dismissed by hand while we waited: don't open it again.
        if (sessionStorage.getItem(SEEN_KEY) === "1") return;
        if (sessionStorage.getItem(LEAD_SHOWN_KEY) === "1") return markSeen();
      } catch {
        /* fall through and open */
      }
      if (document.querySelector("dialog[open]") || hasContacted()) return markSeen();
      setOpen((already) => {
        if (already) return already;
        markSeen();
        return true;
      });
    }, isAdVisit() ? AD_AUTO_OPEN_MS : AUTO_OPEN_MS);
    return () => clearTimeout(t);
  }, [markSeen]);

  /** Closed by the visitor (X or Esc): noted on their lead, with where they stopped. */
  function dismiss() {
    if (started && !sent) {
      leadEvent("closed", done ? "Closed the chat on the last screen without tapping WhatsApp" : `Closed the chat at: ${stepLabel(step)}`, {
        source: "chatbot",
      });
    }
    close();
  }
  const dismissRef = useRef(dismiss);
  useEffect(() => {
    dismissRef.current = dismiss;
  });

  // Escape closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismissRef.current();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus moves into the panel when it opens and on each step. On touch screens the name
  // field is left alone: focusing it would throw the keyboard up over the panel uninvited.
  useEffect(() => {
    if (!open) return;
    if (firstOptionRef.current) firstOptionRef.current.focus({ preventScroll: true });
    else if (step === DETAILS_STEP && window.matchMedia?.("(pointer: fine)").matches) nameRef.current?.focus({ preventScroll: true });
  }, [open, step]);

  function choose(key: Key, value: string) {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    setStep(step + 1);
    saveDraft("chatbot", leadFields(next, details), { step: stepLabel(step + 1) });
  }

  function editDetails(patch: Partial<Details>) {
    const next = { ...details, ...patch };
    setDetails(next);
    if (detailsError) setDetailsError("");
    saveDraft("chatbot", leadFields(answers, next), { step: stepLabel(DETAILS_STEP) });
  }

  function submitDetails(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (details.name.trim().length < 2) return setDetailsError("Please enter your name.");
    if (!toE164(details.phone)) return setDetailsError("Please enter a number we can reach on WhatsApp, like 03xx xxxxxxx.");
    setStep(DETAILS_STEP + 1);
    saveDraft("chatbot", leadFields(answers, details), { step: stepLabel(DETAILS_STEP + 1) });
  }

  function skipDetails() {
    setDetailsError("");
    setStep(DETAILS_STEP + 1);
    saveDraft("chatbot", leadFields(answers, details), { step: stepLabel(DETAILS_STEP + 1) });
    leadEvent("skipped", "Skipped leaving a name and number", { source: "chatbot" });
  }

  function restart() {
    if (started) leadEvent("restart", "Started the chat over", { source: "chatbot" });
    setAnswers({});
    setSent(false);
    setStep(0);
  }

  const need: Record<string, string> = {
    "Umrah package": "an Umrah package",
    "Umrah visa": "an Umrah visa",
    "Air tickets": "air tickets",
    "Hotels only": "hotels only",
  };
  const message = [
    `I need help with ${(answers.service && need[answers.service]) ?? "my Umrah"}.`,
    answers.days && `Duration: ${answers.days}`,
    answers.city && `Flying from: ${answers.city}`,
    answers.timeline && `When: ${answers.timeline}`,
    details.name.trim() && `Name: ${details.name.trim()}`,
    details.phone.trim() && `My number: ${details.phone.trim()}`,
  ]
    .filter(Boolean)
    .join("\n");

  // Land on the closest matching page of packages rather than the whole list.
  const citySlug = answers.city && ["Lahore", "Karachi", "Islamabad"].includes(answers.city) ? answers.city.toLowerCase() : null;
  const days = answers.days?.match(/^\d+/)?.[0];
  const browseHref = citySlug ? `/umrah-packages/${citySlug}/` : days ? `/umrah-packages/${days}-days/` : "/umrah-packages/";

  const current = STEPS[Math.min(step, STEPS.length - 1)];

  return (
    /* col-reverse keeps the launcher pinned at the bottom and opens the panel
       upward. On phones it sits above the Call / WhatsApp bar. */
    <div className="pointer-events-none fixed bottom-[5.4rem] right-4 z-40 flex flex-col-reverse items-end gap-3 sm:bottom-6 sm:right-6">
      {/* Hidden while the panel is open: the panel carries its own close control. */}
      {!open && (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            markSeen();
          }}
          aria-expanded={false}
          aria-label="Get help with your Umrah"
          className="group pointer-events-auto inline-flex items-center gap-3 rounded-2xl bg-gradient-to-br from-night-800 to-night-950 px-5 py-3.5 text-sand-50 shadow-[0_22px_44px_-18px_rgb(0_0_0/0.85)] ring-1 ring-gold-400/25 transition-all duration-300 hover:-translate-y-0.5 hover:ring-gold-300/60"
        >
          {/* Live dot rather than a messaging glyph: this is a guided enquiry, not a chat. */}
          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-300 opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold-300" />
          </span>
          <span className="flex flex-col items-start leading-tight">
            <span className="whitespace-nowrap text-[0.95rem] font-bold">Let us help you</span>
            <span className="whitespace-nowrap text-[11px] font-medium text-sand-100/55">Free &middot; takes 30 seconds</span>
          </span>
          <ChevronDownIcon className="-mr-0.5 h-4 w-4 -rotate-90 text-sand-100/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-gold-300" />
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Umrah help"
          className="rise pointer-events-auto w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-sand-200 bg-[#fffdf9] text-left shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)]"
        >
          <div className="relative bg-gradient-to-br from-night-800 to-night-950 px-6 py-5 text-sand-50">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-[1.35rem] leading-tight">Let us help you</p>
                <p className="mt-1 text-xs leading-snug text-sand-100/60">A few quick questions and we&apos;ll take it from there</p>
              </div>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Close"
                className="-mr-2 -mt-2 grid h-10 w-10 place-items-center rounded-full text-sand-100/60 transition hover:bg-white/10 hover:text-white"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
            {/* Segmented, so it reads as progress rather than a divider. */}
            <div className="mt-4 flex gap-1.5" aria-hidden="true">
              {Array.from({ length: SEGMENTS }, (_, i) => (
                <span key={i} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i < step ? "bg-gold-300" : "bg-white/15"}`} />
              ))}
            </div>
          </div>

          <div className="max-h-[min(26rem,58vh)] overflow-y-auto px-6 py-5">
            {onDetails ? (
              <form onSubmit={submitDetails} noValidate>
                <p className="font-display text-[1.2rem] leading-snug text-ink-900">Where should we send your options?</p>
                <p className="mb-4 mt-1 text-xs leading-snug text-ink-500">We only use it to reply about your Umrah.</p>
                <label className="block">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-ink-500">Your name</span>
                  <input
                    ref={nameRef}
                    name="name"
                    autoComplete="name"
                    value={details.name}
                    onChange={(e) => editDetails({ name: e.target.value })}
                    placeholder="e.g. Ahmed Raza"
                    className={input}
                  />
                </label>
                <label className="mt-3 block">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-ink-500">WhatsApp number</span>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={details.phone}
                    onChange={(e) => editDetails({ phone: e.target.value })}
                    placeholder="03xx xxxxxxx"
                    className={`${input} figure`}
                  />
                </label>
                {detailsError && (
                  <p role="alert" className="mt-3 rounded-lg bg-[#fbeaea] px-3 py-2 text-xs font-semibold text-[#8a1f1f]">
                    {detailsError}
                  </p>
                )}
                <button
                  type="submit"
                  className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-night-950 py-3 text-sm font-bold text-sand-50 shadow-[0_18px_36px_-18px_rgb(0_0_0/0.8)] transition-all hover:bg-night-800"
                >
                  Continue
                  <ChevronDownIcon className="h-4 w-4 -rotate-90 text-gold-300" />
                </button>
                <div className="mt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-ink-400 transition hover:text-ink-800"
                  >
                    <ChevronDownIcon className="h-3.5 w-3.5 rotate-90" />
                    Back
                  </button>
                  <button type="button" onClick={skipDetails} className="min-h-9 text-xs font-semibold text-ink-400 transition hover:text-ink-800">
                    Skip for now
                  </button>
                </div>
              </form>
            ) : !done ? (
              <>
                <p className="mb-4 font-display text-[1.2rem] leading-snug text-ink-900">{current.q}</p>
                <div className="grid grid-cols-2 gap-2">
                  {current.options.map((opt, i) => {
                    const Glyph = opt.icon;
                    return (
                      <button
                        key={opt.label}
                        ref={i === 0 ? firstOptionRef : undefined}
                        type="button"
                        onClick={() => choose(current.key, opt.label)}
                        className="group/opt flex min-h-11 items-center gap-2.5 rounded-xl border border-sand-300 bg-white px-3 py-2.5 text-left text-[0.8rem] font-semibold text-ink-700 transition-all duration-200 hover:border-gold-400 hover:bg-sand-100 hover:text-haram-700"
                      >
                        <Glyph className="h-4 w-4 flex-none text-gold-600 transition group-hover/opt:text-haram-600" />
                        <span className="truncate">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="mt-4 inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-ink-400 transition hover:text-ink-800"
                  >
                    <ChevronDownIcon className="h-3.5 w-3.5 rotate-90" />
                    Back
                  </button>
                )}
              </>
            ) : (
              <>
                <p className="mb-3 font-display text-[1.15rem] text-ink-900">Here&apos;s what we have</p>
                <dl className="mb-4 divide-y divide-sand-200 overflow-hidden rounded-2xl border border-sand-200 bg-sand-100/60 text-xs">
                  {[
                    ...SUMMARY.map(([k, label]) => [label, answers[k]] as const),
                    ["Name", details.name.trim()] as const,
                    ["Phone", details.phone.trim()] as const,
                  ]
                    .filter(([, value]) => value)
                    .map(([label, value]) => (
                      <div key={label} className="flex items-baseline justify-between gap-3 px-3 py-2">
                        <dt className="text-[11px] uppercase tracking-wide text-ink-400">{label}</dt>
                        <dd className={`text-right font-semibold text-ink-800 ${label === "Phone" ? "figure" : ""}`}>{value}</dd>
                      </div>
                    ))}
                </dl>

                <a
                  href={whatsappLink(message)}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  data-lead="chatbot"
                  onClick={() => {
                    setSent(true);
                    sendLead("chatbot", leadFields(answers, details));
                  }}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-night-950 py-3 text-sm font-bold text-sand-50 shadow-[0_18px_36px_-18px_rgb(0_0_0/0.8)] transition-all hover:bg-night-800"
                >
                  Continue on WhatsApp
                  <ChevronDownIcon className="h-4 w-4 -rotate-90 text-gold-300" />
                </a>

                <Link
                  href={browseHref}
                  onClick={() => {
                    if (!sent) leadEvent("browse", `Went to see matching packages (${browseHref})`, { source: "chatbot" });
                    close();
                  }}
                  className="mt-2 flex min-h-11 items-center justify-center rounded-full border border-sand-300 text-center text-xs font-bold text-ink-700 transition hover:border-gold-400 hover:text-haram-700"
                >
                  Or see matching packages
                </Link>

                <button type="button" onClick={restart} className="mt-2 min-h-9 w-full text-xs font-semibold text-ink-400 transition hover:text-ink-800">
                  Start over
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
