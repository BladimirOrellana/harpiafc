// app/api/auth/signup/route.ts
// Same-origin proxy: HarpiaFC browser → here → PasalaPro signup.
// On success, store the Firebase tokens in HarpiaFC's httpOnly cookie.
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {
  HF_SESSION_COOKIE,
  encodeSession,
  pasalaproBase,
  sessionCookieOptions,
  sessionFromTokens,
} from "../../../lib/serverAuth";

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    /* empty body → validation below */
  }

  const { firstName, lastName, email, password } = body as {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  };

  try {
    const upstream = await fetch(`${pasalaproBase()}/api/harpia/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
      cache: "no-store",
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok || !data.ok) {
      return NextResponse.json(
        { ok: false, error: data.error, errors: data.errors, code: data.code },
        { status: upstream.status || 400 }
      );
    }

    const session = sessionFromTokens(data);
    const res = NextResponse.json({ ok: true, user: data.user });
    res.cookies.set(HF_SESSION_COOKIE, encodeSession(session), sessionCookieOptions());
    return res;
  } catch (err) {
    console.error("[harpiafc/auth/signup] error:", err);
    return NextResponse.json(
      { ok: false, error: "Unable to reach the authentication service." },
      { status: 502 }
    );
  }
}
