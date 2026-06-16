"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../lib/translations";
import {
  getOrderBySession,
  getOrderStatus,
  PublicOrder,
} from "../../lib/pasalaproApi";

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

      {/* Shipping note (full payment only) */}
      {status === "paid" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 8,
            padding: "12px 16px",
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 16, flexShrink: 0 }}>📦</span>
          <p style={{ fontSize: 13, color: "#888", lineHeight: 1.4 }}>
            {t.shippingNote}
          </p>
        </div>
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
