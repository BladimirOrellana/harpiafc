"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../lib/translations";
import { createCheckoutSession } from "../../lib/pasalaproApi";

export default function FoundersCancelPage() {
  const { lang } = useLanguage();
  const t = translations[lang].cancel;

  const [resuming, setResuming] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const storedOrderId = typeof window !== "undefined"
    ? sessionStorage.getItem("harpiafc_order_id")
    : null;
  const storedPlan = typeof window !== "undefined"
    ? (sessionStorage.getItem("harpiafc_order_plan") as "full" | "installments" | null)
    : null;

  async function handleResume() {
    if (!storedOrderId) return;
    setResuming(true);
    setError(null);

    try {
      const successUrl = `${window.location.origin}/founders/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl  = `${window.location.origin}/founders/cancel`;

      const result = await createCheckoutSession(storedOrderId, {
        paymentType: storedPlan === "installments" ? "deposit" : "full",
        successUrl,
        cancelUrl,
      });

      window.location.href = result.url;
    } catch (err: unknown) {
      setResuming(false);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "#F5F5F5",
        fontFamily: "var(--font-inter, Inter, sans-serif)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
        {/* Icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(201,168,76,0.12)",
            border: "2px solid rgba(201,168,76,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            margin: "0 auto 28px",
          }}
        >
          ✕
        </div>

        <h1
          style={{
            fontSize: "clamp(22px, 4vw, 30px)",
            fontWeight: 800,
            marginBottom: 12,
          }}
        >
          {t.heading}
        </h1>

        <p
          style={{
            color: "#888",
            fontSize: 15,
            lineHeight: 1.6,
            marginBottom: 36,
          }}
        >
          {t.body}
        </p>

        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8,
              padding: "12px 16px",
              color: "#f87171",
              fontSize: 14,
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {storedOrderId ? (
            <button
              onClick={handleResume}
              disabled={resuming}
              style={{
                width: "100%",
                padding: "14px 20px",
                background: resuming ? "rgba(10,175,170,0.4)" : "#0AAFAA",
                color: "#080808",
                border: "none",
                borderRadius: 8,
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: "0.06em",
                cursor: resuming ? "not-allowed" : "pointer",
                transition: "background 0.15s ease",
              }}
            >
              {resuming ? t.resuming : t.resumeCheckout}
            </button>
          ) : (
            <Link
              href="/founders"
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
                letterSpacing: "0.06em",
              }}
            >
              {t.startOver}
            </Link>
          )}

          {storedOrderId && (
            <Link
              href="/founders"
              style={{
                display: "block",
                padding: "14px 20px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#ccc",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              {t.startOver}
            </Link>
          )}

          <Link
            href="/"
            style={{
              color: "#666",
              textDecoration: "none",
              fontSize: 14,
              marginTop: 4,
            }}
          >
            {t.backHome}
          </Link>
        </div>
      </div>
    </main>
  );
}
