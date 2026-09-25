import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_COOKIE,
  adminConfigured,
  clearFailures,
  clientIp,
  cookieSecure,
  lockedOut,
  noteFailure,
  passwordMatches,
  sessionToken,
} from "@/lib/leads/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!adminConfigured()) {
    return NextResponse.json({ error: "The dashboard is not switched on yet. Set ADMIN_PASSWORD on the host." }, { status: 503 });
  }
  const ip = await clientIp();
  if (lockedOut(ip)) {
    return NextResponse.json({ error: "Too many wrong tries. Wait 15 minutes and try again." }, { status: 429 });
  }
  let password = "";
  try {
    password = String(((await req.json()) as { password?: unknown }).password ?? "");
  } catch {
    /* empty password below */
  }
  if (!passwordMatches(password)) {
    noteFailure(ip);
    return NextResponse.json({ error: "That password is not right." }, { status: 401 });
  }
  clearFailures(ip);
  const { value, maxAge } = sessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, value, { httpOnly: true, sameSite: "lax", secure: await cookieSecure(), path: "/", maxAge });
  return res;
}
