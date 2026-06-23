// app/api/auth/registry-status/route.ts
// Returns the Founder registry status for the current HarpiaFC session.
//
// Reads the httpOnly hf_session cookie, transparently refreshes the Firebase
// idToken if needed, then calls PasalaPro's protected registry-status endpoint
// with a Bearer token. Tokens are never exposed to the browser.
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import {
  HF_SESSION_COOKIE,
  authedGet,
  clearCookieOptions,
  encodeSession,
  sessionCookieOptions,
} from "../../../lib/serverAuth";

interface RegistryResponse {
  ok?: boolean;
  hasRegistry?: boolean;
  registry?: unknown;
}

function unauthenticated() {
  const res = NextResponse.json(
    { ok: false, error: "Not authenticated" },
    { status: 401 }
  );
  res.cookies.set(HF_SESSION_COOKIE, "", clearCookieOptions());
  return res;
}

export async function GET(req: NextRequest) {
  const result = await authedGet(
    req.cookies.get(HF_SESSION_COOKIE)?.value,
    "/api/harpia/auth/registry-status"
  );

  if (result.kind === "unauth") return unauthenticated();

  // 404 = valid token but no Mongo profile — treat the session as unusable.
  if (result.status === 404) return unauthenticated();

  const data = result.data as RegistryResponse | null;
  if (!data?.ok) {
    return NextResponse.json(
      { ok: false, error: "Unable to load registry status." },
      { status: 502 }
    );
  }

  const res = NextResponse.json({
    ok: true,
    hasRegistry: Boolean(data.hasRegistry),
    registry: data.registry ?? null,
  });

  if (result.rotated) {
    res.cookies.set(HF_SESSION_COOKIE, encodeSession(result.session), sessionCookieOptions());
  }

  return res;
}
