// app/api/auth/me/route.ts
// Returns the authenticated profile for the current HarpiaFC session.
//
// Reads the httpOnly hf_session cookie, transparently refreshes the Firebase
// idToken when it is expiring (or rejected), fetches the profile from PasalaPro
// with a Bearer token, and re-stores rotated tokens. Never exposes any token.
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import {
  HF_SESSION_COOKIE,
  decodeSession,
  encodeSession,
  fetchProfile,
  refreshSession,
  sessionCookieOptions,
  type HfSession,
} from "../../../lib/serverAuth";

function unauthenticated() {
  const res = NextResponse.json(
    { ok: false, error: "Not authenticated" },
    { status: 401 }
  );
  // Clear any stale/invalid cookie.
  res.cookies.set(HF_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}

export async function GET(req: NextRequest) {
  const session = decodeSession(req.cookies.get(HF_SESSION_COOKIE)?.value);
  if (!session) return unauthenticated();

  let current: HfSession = session;
  let rotated = false;

  // Proactively refresh if the idToken is at/near expiry.
  if (Date.now() >= current.expiresAt) {
    const refreshed = await refreshSession(current.refreshToken);
    if (!refreshed) return unauthenticated();
    current = refreshed;
    rotated = true;
  }

  let { status, profile } = await fetchProfile(current.idToken);

  // If the token was rejected despite our expiry check, refresh once and retry.
  if (status === 401 && !rotated) {
    const refreshed = await refreshSession(current.refreshToken);
    if (!refreshed) return unauthenticated();
    current = refreshed;
    rotated = true;
    ({ status, profile } = await fetchProfile(current.idToken));
  }

  // 401 = token rejected; 404 = valid token but no profile — either way the
  // session is unusable, so clear it and send the user back to login.
  if (status === 401 || status === 404) return unauthenticated();
  if (!profile) {
    return NextResponse.json(
      { ok: false, error: "Unable to load profile." },
      { status: 502 }
    );
  }

  const res = NextResponse.json({ ok: true, user: profile });
  if (rotated) {
    res.cookies.set(HF_SESSION_COOKIE, encodeSession(current), sessionCookieOptions());
  }
  return res;
}
