import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import StarPattern from "@/components/StarPattern";
import { adminConfigured, isAdmin } from "@/lib/leads/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin/");
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-night-950 px-4 py-10">
      <StarPattern id="admin-lattice" className="text-gold-300 opacity-[0.05]" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[44rem] -translate-x-1/2 rounded-full bg-gold-400/10 blur-3xl" />
      <LoginForm configured={adminConfigured()} />
    </main>
  );
}
