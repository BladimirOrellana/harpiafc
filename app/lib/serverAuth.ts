// app/lib/serverAuth.ts
// SERVER-ONLY auth helpers for HarpiaFC's /api/auth/* proxy routes.
//
// HarpiaFC and PasalaPro live on different domains, so we cannot share
// PasalaPro's session cookie. Instead HarpiaFC keeps its OWN httpOnly cookie
// (`hf_session`) that holds the Firebase tokens minted by PasalaPro. Those
// tokens are NEVER exposed to the Harpia browser — the cookie is httpOnly and
// is only ever read/written here on the server.
//
// Do NOT import this from client components — it relies on Buffer/process and
// is only ever pulled in by the /api/auth/* route handlers.

export const HF_SESSION_COOKIE = "hf_session";

// Cookie lifetime. The Firebase idToken inside expires hourly (tracked by
// `expiresAt` and refreshed transparently), but the cookie itself — carrying
// the long-lived refresh token — persists the session for 30 days.
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export interface HfSession {
  idToken: string;
  refreshToken: string;
  /** Epoch ms at which the current idToken expires. */
  expiresAt: number;
}

export interface HfProfile {
  firstName: string;
  lastName: string;
  email: string;
}

/** Resolve the PasalaPro base URL (server-side). */
export function pasalaproBase(): string {
  const raw =
    process.env.PASALAPRO_API_URL || process.env.NEXT_PUBLIC_PASALAPRO_API_URL;
  if (!raw) {
    throw new Error(
      "PasalaPro API URL is not configured. Set NEXT_PUBLIC_PASALAPRO_API_URL " +
        "(and optionally PASALAPRO_API_URL) in .env.local or Vercel settings."
    );
  }
  return raw.replace(/\/$/, "");
}

/** Serialize a session for storage in the httpOnly cookie. */
export function encodeSession(session: HfSession): string {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

/** Parse a session previously stored by encodeSession. Returns null if invalid. */
export function decodeSession(value: string | undefined | null): HfSession | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    if (
      parsed &&
      typeof parsed.idToken === "string" &&
      typeof parsed.refreshToken === "string" &&
      typeof parsed.expiresAt === "number"
    ) {
      return parsed as HfSession;
    }
    return null;
  } catch {
    return null;
  }
}

/** Standard cookie options for the session cookie. */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

/** Build an HfSession from a PasalaPro token response. */
export function sessionFromTokens(t: {
  idToken: string;
  refreshToken: string;
  expiresIn: number | string;
}): HfSession {
  const expiresInSec = Number(t.expiresIn) || 3600;
  return {
    idToken: t.idToken,
    refreshToken: t.refreshToken,
    // Refresh 60s before actual expiry to avoid edge-of-expiry 401s.
    expiresAt: Date.now() + (expiresInSec - 60) * 1000,
  };
}

/**
 * Exchange a refresh token for a fresh session via PasalaPro.
 * Returns null if the refresh token is no longer valid.
 */
export async function refreshSession(refreshToken: string): Promise<HfSession | null> {
  try {
    const res = await fetch(`${pasalaproBase()}/api/harpia/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) return null;
    return sessionFromTokens(data);
  } catch {
    return null;
  }
}

/** Fetch the authenticated profile from PasalaPro using an idToken. */
export async function fetchProfile(
  idToken: string
): Promise<{ status: number; profile: HfProfile | null }> {
  try {
    const res = await fetch(`${pasalaproBase()}/api/harpia/auth/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${idToken}` },
      cache: "no-store",
    });
    if (!res.ok) return { status: res.status, profile: null };
    const data = await res.json().catch(() => ({}));
    if (!data.ok || !data.user) return { status: 502, profile: null };
    return { status: 200, profile: data.user as HfProfile };
  } catch {
    return { status: 502, profile: null };
  }
}
