import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/leads/auth";
import { createManualLead, sanitizeManual } from "@/lib/leads/staff";
import { listLeads, storeKind, updateLead } from "@/lib/leads/store";

export const dynamic = "force-dynamic";

/** The dashboard polls this to show new leads without a reload. */
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Signed out" }, { status: 401 });
  try {
    return NextResponse.json({ leads: await listLeads(), storage: storeKind() }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[admin] list failed:", err);
    return NextResponse.json({ error: "Could not reach the lead database." }, { status: 503 });
  }
}

/** Adds a lead by hand: someone who messaged, called or walked in without using the website. */
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Signed out" }, { status: 401 });
  let input;
  try {
    input = sanitizeManual(await req.json());
  } catch {
    input = null;
  }
  if (!input) return NextResponse.json({ error: "Add at least a name or a phone number." }, { status: 400 });

  const now = new Date().toISOString();
  const id = `m-${randomUUID()}`;
  try {
    const lead = await updateLead(id, () => createManualLead(input, id, now));
    return NextResponse.json({ lead });
  } catch (err) {
    console.error("[admin] add failed:", err);
    return NextResponse.json({ error: "Could not save. Try again." }, { status: 503 });
  }
}
