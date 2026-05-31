// app/api/fundadores/registry/route.ts
// Server-side proxy — fetches PasalaPro's public registry and re-serves it
// same-origin to avoid client-side CORS restrictions.
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

const UPSTREAM = "https://pasalapro.com/api/harpia/founders/registry";

// Safe public fields only — no buyer PII, no Stripe IDs, no Firebase UIDs
const SAFE_FIELDS = ["ok", "total", "publicStart", "reserved", "paid", "available", "entries"] as const;

export async function GET() {
  try {
    console.log("[Harpia proxy] fetching upstream:", UPSTREAM);

    const upstream = await fetch(UPSTREAM, {
      headers: { "Content-Type": "application/json" },
      // no-store: always reflect live count, never serve a cached number
      cache: "no-store",
    });

    console.log("[Harpia proxy] upstream status:", upstream.status);

    if (!upstream.ok) {
      return NextResponse.json(
        { ok: false, error: `upstream ${upstream.status}` },
        { status: 502 }
      );
    }

    const raw = await upstream.json();
    console.log("[Harpia proxy] raw upstream data:", raw);

    // Whitelist only safe public fields — strip any private data that
    // might be added upstream in the future (email, phone, Stripe, Firebase)
    const safe: Record<string, unknown> = {};
    for (const key of SAFE_FIELDS) {
      if (key in raw) safe[key] = raw[key];
    }

    // Normalize / fallback so clients can rely on these fields always existing
    const total     = typeof safe.total     === "number" ? safe.total     : 1000;
    const reserved  = typeof safe.reserved  === "number" ? safe.reserved  : 30;
    const paid      = typeof safe.paid      === "number" ? safe.paid      : 0;
    const available = typeof safe.available === "number"
      ? safe.available
      : Math.max(total - reserved - paid, 0);

    const normalized = {
      ok:          safe.ok ?? true,
      total,
      publicStart: typeof safe.publicStart === "number" ? safe.publicStart : 31,
      reserved,
      paid,
      available,
      entries:     Array.isArray(safe.entries) ? safe.entries : [],
    };

    console.log("[Harpia proxy] normalized response:", normalized);

    return NextResponse.json(normalized);
  } catch (err) {
    console.error("[Harpia proxy] error:", err);
    return NextResponse.json({ ok: false, error: "proxy error" }, { status: 500 });
  }
}
