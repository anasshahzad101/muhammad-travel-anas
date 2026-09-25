"use client";

import { useState } from "react";
import { Mark } from "@/components/Logo";

export default function LoginForm({ configured }: { configured: boolean }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return setError("Enter the password.");
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/admin/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (r.ok) {
        window.location.href = "/admin/";
        return;
      }
      setError(((await r.json().catch(() => ({}))) as { error?: string }).error ?? "Could not sign in.");
    } catch {
      setError("No connection. Try again.");
    }
    setBusy(false);
  }

  return (
    <div className="rise relative w-full max-w-sm overflow-hidden rounded-[28px] bg-sand-50 shadow-[0_40px_90px_-30px_rgb(0_0_0/0.8)] ring-1 ring-gold-400/20">
      <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-haram-600" />
      <div className="px-7 pb-8 pt-9">
        <Mark className="h-12 w-12" />
        <p className="mt-5 text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-gold-700">Muhammad Travels</p>
        <h1 className="mt-1 text-[2.2rem] leading-none text-ink-950">Leads</h1>

        {configured ? (
          <form onSubmit={submit} className="mt-6" noValidate>
            <label className="block">
              <span className="block text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-ink-600">Password</span>
              <input
                type="password"
                autoComplete="current-password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 block w-full rounded-xl border border-sand-300 bg-white px-3.5 py-3 text-[16px] text-ink-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-400/25"
              />
            </label>
            {error && (
              <p role="alert" className="mt-3 rounded-xl bg-[#fbeaea] px-3.5 py-2.5 text-sm font-semibold text-[#8a1f1f]">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="mt-5 flex min-h-12 w-full items-center justify-center rounded-full bg-night-950 text-sm font-bold text-sand-50 transition hover:bg-night-800 disabled:opacity-60"
            >
              {busy ? "Signing in..." : "Sign in"}
            </button>
          </form>
        ) : (
          <div className="mt-6 rounded-2xl bg-sand-100 px-4 py-4 text-sm leading-relaxed text-ink-700">
            <p className="font-bold text-ink-900">The dashboard is not switched on yet.</p>
            <p className="mt-1.5">
              Add an <code className="rounded bg-white px-1 text-xs">ADMIN_PASSWORD</code> environment variable on the host (Hostinger: the Node.js app&apos;s
              environment variables), then redeploy. Leads are already being saved.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
