"use client";

import { lakh, pkr } from "@/lib/leads/staff";

/** Small form controls for the dashboard, built for tapping: chips over dropdowns, steppers over typing. */

export const inputCls =
  "block min-h-11 w-full rounded-xl border border-sand-300 bg-white px-3.5 py-2.5 text-[16px] text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-400/25 sm:text-sm";

export const labelCls = "mb-1.5 block text-[0.7rem] font-extrabold uppercase tracking-[0.12em] text-ink-500";

export function Field({ label, hint, htmlFor, children }: { label: string; hint?: React.ReactNode; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div>
      {htmlFor ? (
        <label htmlFor={htmlFor} className={labelCls}>
          {label}
        </label>
      ) : (
        <p className={labelCls}>{label}</p>
      )}
      {children}
      {hint && <p className="mt-1.5 text-xs leading-snug text-ink-500">{hint}</p>}
    </div>
  );
}

/** One choice from a few, as tappable pills. */
export function Chips<T extends string>({
  options,
  value,
  onChange,
  label,
  small = false,
}: {
  options: { id: T; label: string; disabled?: boolean }[];
  value: T | undefined;
  onChange: (v: T) => void;
  label: string;
  small?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const on = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            disabled={o.disabled}
            onClick={() => onChange(o.id)}
            className={`${small ? "min-h-8 px-3 text-[0.75rem]" : "min-h-10 px-3.5 text-[0.82rem]"} rounded-full font-semibold ring-1 transition disabled:cursor-not-allowed disabled:opacity-35 ${
              on ? "bg-night-950 text-sand-50 ring-night-950" : "bg-white text-ink-700 ring-sand-300 hover:ring-gold-400"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** A number with big minus / plus buttons. */
export function Stepper({ value, onChange, min = 0, max = 60, label }: { value: number; onChange: (n: number) => void; min?: number; max?: number; label: string }) {
  const btn =
    "grid h-10 w-10 place-items-center rounded-full bg-white text-lg font-bold text-ink-800 ring-1 ring-sand-300 transition hover:ring-gold-400 disabled:opacity-30";
  return (
    <div className="flex items-center gap-2" role="group" aria-label={label}>
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Fewer ${label.toLowerCase()}`}>
        &minus;
      </button>
      <span className="w-8 text-center text-lg font-bold tabular-nums text-ink-950" aria-live="polite">
        {value}
      </span>
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`More ${label.toLowerCase()}`}>
        +
      </button>
    </div>
  );
}

/**
 * Rupees, typed as plain digits (commas and spaces are ignored). Underneath it
 * says the amount back in lakh, which catches a missing or extra zero.
 */
export function MoneyInput({
  id,
  value,
  onChange,
  placeholder,
  autoFocus,
}: {
  id?: string;
  value: number | undefined;
  onChange: (n: number | undefined) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  return (
    <div>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-ink-400">PKR</span>
        <input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          autoFocus={autoFocus}
          value={value === undefined ? "" : String(value)}
          onChange={(e) => {
            const digits = e.target.value.replace(/[^\d]/g, "").slice(0, 10);
            onChange(digits ? Number(digits) : undefined);
          }}
          placeholder={placeholder}
          className={`${inputCls} pl-12 tabular-nums`}
        />
      </div>
      {value ? <p className="mt-1 text-xs font-semibold text-ink-500">{value >= 100_000 ? `${pkr(value)} (${lakh(value)})` : pkr(value)}</p> : null}
    </div>
  );
}
