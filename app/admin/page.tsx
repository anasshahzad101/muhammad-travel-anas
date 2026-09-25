import { redirect } from "next/navigation";
import LeadsDashboard from "@/components/admin/LeadsDashboard";
import { isAdmin } from "@/lib/leads/auth";
import { listLeads, storeKind } from "@/lib/leads/store";
import type { CrmPackage, Lead } from "@/lib/leads/types";
import { packages } from "@/lib/packages";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login/");

  let leads: Lead[] = [];
  let error = "";
  try {
    leads = await listLeads();
  } catch (err) {
    console.error("[admin] list failed:", err);
    error = "Could not reach the lead database. Check DATABASE_URL on the host.";
  }
  // Just names and prices for the booking form: the full package data stays on the server.
  const crmPackages: CrmPackage[] = packages.map((p) => ({ slug: p.slug, name: p.shortName, days: p.days, prices: p.prices }));
  return <LeadsDashboard initialLeads={leads} packages={crmPackages} storage={storeKind()} renderedAt={Date.now()} initialError={error} />;
}
