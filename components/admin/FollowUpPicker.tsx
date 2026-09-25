"use client";

import { dayAfter, followUpState } from "@/lib/leads/format";
import { inputCls } from "./fields";

/** When to follow up next, in one tap. The chosen day shows on the list and in "Follow-ups due". */
export default function FollowUpPicker({
  value,
  today,
  onChange,
  clearLabel = "Done, clear it",
}: {
  value?: string;
  today: string;
  onChange: (day: string | null) => void;
  /** On a lead, clearing means the follow-up happened; on the Add form it just removes the date. */
  clearLabel?: string;
}) {
  const quick = [
    { label: "Today", day: today },
    { label: "Tomorrow", day: dayAfter(today, 1) },
    { label: "In 3 days", day: dayAfter(today, 3) },
    { label: "Next week", day: dayAfter(today, 7) },
  ];
  const state = value ? followUpState(value, today) : null;
  return (
    <div>
      {state && (
        <p
          className={`mb-2.5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
            state.tone === "overdue" ? "bg-[#fbeaea] text-[#8a1f1f]" : state.tone === "today" ? "bg-[#fbf0dc] text-[#6f4509]" : "bg-sand-100 text-ink-700"
          }`}
        >
          {state.text}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-1.5">
        {quick.map((q) => (
          <button
            key={q.label}
            type="button"
            onClick={() => onChange(q.day)}
            aria-pressed={value === q.day}
            className={`min-h-9 rounded-full px-3 text-[0.78rem] font-semibold ring-1 transition ${
              value === q.day ? "bg-night-950 text-sand-50 ring-night-950" : "bg-white text-ink-700 ring-sand-300 hover:ring-gold-400"
            }`}
          >
            {q.label}
          </button>
        ))}
        <input
          type="date"
          aria-label="Pick a follow-up date"
          value={value ?? ""}
          min={today}
          onChange={(e) => onChange(e.target.value || null)}
          className={`${inputCls} !min-h-9 !w-auto !rounded-full !py-1 !text-[0.78rem]`}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="min-h-9 rounded-full bg-[#e2f3ed] px-3 text-[0.78rem] font-bold text-[#0a5343] ring-1 ring-[#bfe3d6] transition hover:bg-[#d3ede4]"
          >
            {clearLabel}
          </button>
        )}
      </div>
    </div>
  );
}
