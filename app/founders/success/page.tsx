"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../lib/translations";
import {
  getOrderBySession,
  getOrderStatus,
  updateShipping,
  PublicOrder,
} from "../../lib/pasalaproApi";
import { FormEvent } from "react";

const MAX_POLLS = 8;
const POLL_MS   = 2500;

// ── Inner component (needs useSearchParams) ───────────────────────────────────

function SuccessInner() {
  const { lang } = useLanguage();
  const t = translations[lang].success;

  const searchParams = useSearchParams();
  const sessionId    = searchParams.get("session_id") ?? "";

  const [order,  setOrder]  = useState<PublicOrder | null>(null);
  const [status, setStatus] = useState<
    "loading" | "polling" | "paid" | "partial" | "pending" | "error"
  >("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const pollCount = useRef(0);
  const orderId   = useRef<string | null>(null);
  const token     = useRef<string | null>(null);
  // Render-safe copy of orderId/token (refs are only for the async poll closure).
  const [meta, setMeta] = useState<{ orderId: string; token: string } | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setErrorMsg("No session ID found.");
      return;
    }

    let cancelled = false;

    async function init() {
      try {
        // 1. Look up order by Stripe session_id — also gives us the token
        const bySession = await getOrderBySession(sessionId);
        if (cancelled) return;

        orderId.current = bySession.order._id;
        token.current   = bySession.order.publicAccessToken;
        setMeta({ orderId: bySession.order._id, token: bySession.order.publicAccessToken });

        // Persist to sessionStorage so cancel page can use them
        sessionStorage.setItem("harpiafc_order_id",    bySession.order._id);
        sessionStorage.setItem("harpiafc_order_token", bySession.order.publicAccessToken);

        const initialStatus = bySession.order.status;

        if (initialStatus === "paid" || initialStatus === "partial") {
          setOrder(bySession.order);
          setStatus(initialStatus);
          return;
        }

        // 2. Status is still pending — start polling public-status
        setStatus("polling");
        poll(cancelled);
      } catch (err: unknown) {
        if (!cancelled) {
          setStatus("error");
          setErrorMsg(err instanceof Error ? err.message : "Unknown error");
        }
      }
    }

    function poll(isCancelled: boolean) {
      if (isCancelled || pollCount.current >= MAX_POLLS) {
        if (!isCancelled) setStatus("pending");
        return;
      }

      pollCount.current += 1;

      setTimeout(async () => {
        if (isCancelled) return;
        try {
          const result = await getOrderStatus(
            orderId.current!,
            token.current!
          );
          if (isCancelled) return;

          const s = result.order.status;
          if (s === "paid" || s === "partial") {
            setOrder(result.order);
            setStatus(s);
          } else {
            poll(isCancelled);
          }
        } catch {
          if (!isCancelled) poll(isCancelled);
        }
      }, POLL_MS);
    }

    init();
    return () => { cancelled = true; };
  }, [sessionId]);

  if (status === "loading" || status === "polling") {
    return (
      <Centered>
        <Spinner />
        <p style={{ color: "#888", fontSize: 15, marginTop: 20, textAlign: "center", maxWidth: 320 }}>
          {status === "loading" ? t.loading : t.polling}
        </p>
      </Centered>
    );
  }

  if (status === "error") {
    return (
      <Centered>
        <p style={{ color: "#f87171", marginBottom: 20 }}>
          {errorMsg ?? "Something went wrong."}
        </p>
        <Link href="/" style={linkStyle}>{t.backHome}</Link>
      </Centered>
    );
  }

  const headline =
    status === "paid"    ? t.paid    :
    status === "partial" ? t.partial :
                           t.pending;

  const amountPaid  = order ? (order.amountPaidCents  / 100).toFixed(2) : "—";
  const balance     = order ? (order.balanceRemainingCents / 100).toFixed(2) : "—";

  return (
    <div style={{ maxWidth: 540, margin: "0 auto", padding: "64px 24px 80px" }}>
      {/* Check mark */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "rgba(10,175,170,0.15)",
          border: "2px solid #0AAFAA",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          marginBottom: 28,
        }}
      >
        ✓
      </div>

      <h1
        style={{
          fontSize: "clamp(22px, 4vw, 30px)",
          fontWeight: 800,
          marginBottom: 12,
          color: status === "paid" ? "#0AAFAA" : "#F5F5F5",
        }}
      >
        {headline}
      </h1>

      {/* Founder number */}
      {order?.code && (
        <div
          style={{
            background: "rgba(10,175,170,0.08)",
            border: "1px solid rgba(10,175,170,0.25)",
            borderRadius: 12,
            padding: "20px 24px",
            marginBottom: 28,
          }}
        >
          <p style={{ fontSize: 12, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
            {t.founderNumber}
          </p>
          <p style={{ fontSize: 40, fontWeight: 900, color: "#0AAFAA", letterSpacing: "0.04em" }}>
            {order.code}
          </p>
          {order.displayName && (
            <p style={{ fontSize: 15, color: "#ccc", marginTop: 4 }}>{order.displayName}</p>
          )}
        </div>
      )}

      {/* Amount summary */}
      {order && (
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            borderRadius: 10,
            padding: "16px 20px",
            marginBottom: 32,
            display: "flex",
            gap: 32,
          }}
        >
          <Stat label={t.amountPaid}  value={`$${amountPaid} USD`} />
          {order.balanceRemainingCents > 0 && (
            <Stat label={t.balance} value={`$${balance} USD`} accent />
          )}
        </div>
      )}

      {/* Shipping address — collect / confirm after checkout */}
      {(status === "paid" || status === "partial") && meta && (
        <ShippingSection
          orderId={meta.orderId}
          token={meta.token}
          initial={order}
          lang={lang}
          note={t.shippingNote}
        />
      )}

      {/* Next steps */}
      <div style={{ marginBottom: 36 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
          {t.nextSteps}
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {t.nextStepsList.map((step, i) => (
            <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "#ccc" }}>
              <span style={{ color: "#0AAFAA", flexShrink: 0 }}>✓</span>
              {step}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Link
          href="/founders/registry"
          style={{
            display: "block",
            padding: "14px 20px",
            background: "#0AAFAA",
            color: "#080808",
            borderRadius: 8,
            fontWeight: 800,
            fontSize: 14,
            textDecoration: "none",
            textAlign: "center",
            letterSpacing: "0.05em",
          }}
        >
          {t.viewRegistry}
        </Link>
        <Link href="/" style={{ ...linkStyle, textAlign: "center" }}>
          {t.backHome}
        </Link>
      </div>
    </div>
  );
}

// ── Page export (Suspense wrapper required for useSearchParams) ───────────────

export default function FoundersSuccessPage() {
  const { lang } = useLanguage();
  const t = translations[lang].success;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "#F5F5F5",
        fontFamily: "var(--font-inter, Inter, sans-serif)",
      }}
    >
      <Suspense
        fallback={
          <Centered>
            <Spinner />
            <p style={{ color: "#888", fontSize: 15, marginTop: 20 }}>{t.loading}</p>
          </Centered>
        }
      >
        <SuccessInner />
      </Suspense>
    </main>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        border: "3px solid rgba(10,175,170,0.2)",
        borderTop: "3px solid #0AAFAA",
        borderRadius: "50%",
        animation: "spin 0.9s linear infinite",
      }}
    />
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>
        {label}
      </p>
      <p style={{ fontSize: 18, fontWeight: 700, color: accent ? "#C9A84C" : "#F5F5F5" }}>
        {value}
      </p>
    </div>
  );
}

const linkStyle: React.CSSProperties = {
  color: "#888",
  textDecoration: "none",
  fontSize: 14,
};

// ── Shipping address form ─────────────────────────────────────────────────────

const shipInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 13px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 6,
  color: "#F5F5F5",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

function ShippingSection({
  orderId,
  token,
  initial,
  lang,
  note,
}: {
  orderId: string;
  token: string;
  initial: PublicOrder | null;
  lang: "en" | "es";
  note: string;
}) {
  const a = initial?.shippingAddress ?? null;
  const [form, setForm] = useState({
    shippingName: initial?.shippingName ?? "",
    shippingPhone: initial?.shippingPhone ?? "",
    line1: a?.line1 ?? "",
    line2: a?.line2 ?? "",
    city: a?.city ?? "",
    state: a?.state ?? "",
    postalCode: a?.postalCode ?? "",
    country: a?.country ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(Boolean(initial?.shippingCollectedAt));
  const [error, setError] = useState<string | null>(null);

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  const c =
    lang === "es"
      ? {
          title: "Dirección de envío",
          intro: note,
          name: "Nombre completo",
          phone: "Teléfono",
          line1: "Dirección",
          line2: "Apartamento, suite, etc. (opcional)",
          city: "Ciudad",
          state: "Estado / Departamento",
          postal: "Código postal",
          country: "País",
          save: "Guardar dirección",
          saving: "Guardando…",
          savedMsg: "✓ Dirección de envío guardada.",
          generic: "No se pudo guardar la dirección. Inténtalo de nuevo.",
        }
      : {
          title: "Shipping address",
          intro: note,
          name: "Full name",
          phone: "Phone",
          line1: "Address",
          line2: "Apartment, suite, etc. (optional)",
          city: "City",
          state: "State / Province",
          postal: "Postal code",
          country: "Country",
          save: "Save address",
          saving: "Saving…",
          savedMsg: "✓ Shipping address saved.",
          generic: "Could not save the address. Please try again.",
        };

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await updateShipping(orderId, token, {
        shippingName: form.shippingName,
        shippingPhone: form.shippingPhone,
        shippingAddress: {
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country,
        },
      });
      setSaved(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : c.generic);
    } finally {
      setSaving(false);
    }
  }

  const label: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 5,
    display: "block",
  };

  return (
    <form
      onSubmit={submit}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 10,
        padding: "18px 20px",
        marginBottom: 24,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 16 }}>📦</span>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#F5F5F5" }}>{c.title}</p>
      </div>
      <p style={{ fontSize: 12, color: "#888", lineHeight: 1.4, marginBottom: 16 }}>{c.intro}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={label}>{c.name}</label>
            <input value={form.shippingName} onChange={(e) => set("shippingName", e.target.value)} style={shipInputStyle} />
          </div>
          <div>
            <label style={label}>{c.phone}</label>
            <input value={form.shippingPhone} onChange={(e) => set("shippingPhone", e.target.value)} style={shipInputStyle} />
          </div>
        </div>

        <div>
          <label style={label}>{c.line1}</label>
          <input value={form.line1} onChange={(e) => set("line1", e.target.value)} required style={shipInputStyle} />
        </div>
        <div>
          <label style={label}>{c.line2}</label>
          <input value={form.line2} onChange={(e) => set("line2", e.target.value)} style={shipInputStyle} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={label}>{c.city}</label>
            <input value={form.city} onChange={(e) => set("city", e.target.value)} required style={shipInputStyle} />
          </div>
          <div>
            <label style={label}>{c.state}</label>
            <input value={form.state} onChange={(e) => set("state", e.target.value)} style={shipInputStyle} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={label}>{c.postal}</label>
            <input value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} style={shipInputStyle} />
          </div>
          <div>
            <label style={label}>{c.country}</label>
            <input value={form.country} onChange={(e) => set("country", e.target.value)} required style={shipInputStyle} />
          </div>
        </div>
      </div>

      {error && (
        <p style={{ color: "#f87171", fontSize: 13, marginTop: 12 }}>{error}</p>
      )}
      {saved && !error && (
        <p style={{ color: "#0AAFAA", fontSize: 13, marginTop: 12 }}>{c.savedMsg}</p>
      )}

      <button
        type="submit"
        disabled={saving}
        style={{
          marginTop: 16,
          width: "100%",
          padding: "13px 20px",
          background: saving ? "rgba(10,175,170,0.4)" : "#0AAFAA",
          color: "#080808",
          border: "none",
          borderRadius: 8,
          fontWeight: 800,
          fontSize: 14,
          letterSpacing: "0.04em",
          cursor: saving ? "not-allowed" : "pointer",
        }}
      >
        {saving ? c.saving : c.save}
      </button>
    </form>
  );
}
