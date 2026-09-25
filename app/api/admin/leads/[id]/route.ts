import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/leads/auth";
import { LEAD_ID } from "@/lib/leads/merge";
import { applyStaffPatch, sanitizePatch } from "@/lib/leads/staff";
import { deleteLead, updateLead } from "@/lib/leads/store";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/**
 * Staff changes: stage, notes, follow-up date, contact details, the booking
 * and its payments, and "I've looked at this" (clears the unread dot).
 */
export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Signed out" }, { status: 401 });
  const { id } = await params;
  if (!LEAD_ID.test(id)) return NextResponse.json({ error: "Bad id" }, { status: 400 });

  let patch;
  try {
    patch = sanitizePatch(await req.json());
  } catch {
    patch = null;
  }
  if (!patch) return NextResponse.json({ error: "That change could not be read." }, { status: 400 });

  const now = new Date().toISOString();
  try {
    const lead = await updateLead(id, (prev) => (prev ? applyStaffPatch(prev, patch, now) : null));
    if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ lead });
  } catch (err) {
    console.error("[admin] update failed:", err);
    return NextResponse.json({ error: "Could not save. Try again." }, { status: 503 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Signed out" }, { status: 401 });
  const { id } = await params;
  if (!LEAD_ID.test(id)) return NextResponse.json({ error: "Bad id" }, { status: 400 });
  try {
    await deleteLead(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin] delete failed:", err);
    return NextResponse.json({ error: "Could not delete. Try again." }, { status: 503 });
  }
}
