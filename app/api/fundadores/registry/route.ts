// app/api/fundadores/registry/route.ts
// Server-side proxy — fetches PasalaPro's public registry and re-serves it
// same-origin to avoid client-side CORS restrictions.
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

// Resolve upstream URL — env vars only, no hardcoded URLs:
//   1. PASALAPRO_REGISTRY_API_URL          (explicit full URL, highest priority)
//   2. NEXT_PUBLIC_PASALAPRO_API_URL        (derive registry path from base URL)
//   3. Neither set → return 500 with clear error message
function resolveUpstream(): string | null {
  const explicit = process.env.PASALAPRO_REGISTRY_API_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const base = process.env.NEXT_PUBLIC_PASALAPRO_API_URL;
  if (base) return `${base.replace(/\/$/, "")}/api/harpia/founders/registry`;

  return null;
}

// Safe public fields only — no buyer PII, no Stripe IDs, no Firebase UIDs
const SAFE_FIELDS = ["ok", "total", "publicStart", "reserved", "paid", "available", "entries"] as const;

export async function GET() {
  const UPSTREAM = resolveUpstream();

  if (!UPSTREAM) {
    console.error("[Harpia proxy] PasalaPro registry API URL is not configured");
    return NextResponse.json(
      { ok: false, error: "PasalaPro registry API URL is not configured" },
      { status: 500 }
    );
  }

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
