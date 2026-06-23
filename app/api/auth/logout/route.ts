// app/api/auth/logout/route.ts
// Clears the HarpiaFC session cookie. The Firebase tokens simply expire.
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { HF_SESSION_COOKIE } from "../../../lib/serverAuth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(HF_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
