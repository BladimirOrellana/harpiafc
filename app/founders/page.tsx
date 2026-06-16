"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";
import { createOrder, createCheckoutSession } from "../lib/pasalaproApi";

const JERSEY_SIZES = ["S", "M", "L", "XL"];
const TERMS_VERSION = "2026-06-v1";

const COUNTRIES = [
  "El Salvador", "United States", "Guatemala", "Honduras", "Mexico",
  "Costa Rica", "Panama", "Nicaragua", "Colombia", "Venezuela",
  "España", "Other",
];

export default function FoundersCheckoutPage() {
  const { lang } = useLanguage();
  const t = translations[lang].checkout;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    jerseySize: "",
    displayName: "",
    isPublic: true,
    paymentPlan: "full" as "full" | "installments",
    depositAmountCents: 5000,
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function set(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!termsAccepted) {
      setError("You must accept the Terms & Conditions to proceed.");
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const orderResult = await createOrder({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        country: form.country,
        language: lang,
        jerseySize: form.jerseySize,
        displayName: form.displayName,
        isPublic: form.isPublic,
        paymentPlan: form.paymentPlan,
        depositAmountCents:
          form.paymentPlan === "installments" ? form.depositAmountCents : undefined,
        termsAcceptedAt: new Date().toISOString(),
        termsVersion: TERMS_VERSION,
      });

      // Store for success/cancel pages
      sessionStorage.setItem("harpiafc_order_id", orderResult.orderId);
      sessionStorage.setItem("harpiafc_order_token", orderResult.publicAccessToken);
      sessionStorage.setItem("harpiafc_order_plan", form.paymentPlan);

      const successUrl = `${window.location.origin}/founders/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/founders/cancel`;

      const checkoutResult = await createCheckoutSession(orderResult.orderId, {
        paymentType: form.paymentPlan === "full" ? "full" : "deposit",
        successUrl,
        cancelUrl,
      });

      window.location.href = checkoutResult.url;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.errors.generic;
      // Check if it's a validation error object from the API
      try {
        const parsed = JSON.parse(msg);
        if (typeof parsed === "object") {
          setFieldErrors(parsed);
          setError(null);
          setSubmitting(false);
          return;
        }
      } catch {
        // not JSON
      }
      setError(msg || t.errors.generic);
      setSubmitting(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "#F5F5F5",
        fontFamily: "var(--font-inter, Inter, sans-serif)",
        padding: "0 0 80px",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "20px 24px",
        }}
      >
        <Link
          href="/"
          style={{
            color: "#888",
            textDecoration: "none",
            fontSize: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ← Harpia FC
        </Link>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 24px 0" }}>
        {/* Label */}
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "#0AAFAA",
            marginBottom: 12,
            textTransform: "uppercase",
          }}
        >
          {t.sectionLabel}
        </p>

        <h1
          style={{
            fontSize: "clamp(24px, 5vw, 36px)",
            fontWeight: 800,
            marginBottom: 8,
            lineHeight: 1.2,
          }}
        >
          {t.pageTitle}
        </h1>

        <p style={{ color: "#0AAFAA", fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
          {t.price}
        </p>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 32 }}>
          {form.paymentPlan === "full" ? t.priceNote : t.installmentsNote}
        </p>

        <form onSubmit={handleSubmit}>
          {/* ── Personal info ──────────────────────────────────────────── */}
          <Section>
            <Row>
              <Field label={t.fields.firstName} error={fieldErrors.firstName} required>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="María"
                />
              </Field>
              <Field label={t.fields.lastName} error={fieldErrors.lastName} required>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="Hernández"
                />
              </Field>
            </Row>

            <Field label={t.fields.email} error={fieldErrors.email} required>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                required
                style={inputStyle}
                placeholder="maria@email.com"
              />
            </Field>

            <Row>
              <Field label={t.fields.phone} error={fieldErrors.phone}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  style={inputStyle}
                  placeholder="+503 7000-0000"
                />
              </Field>
              <Field label={t.fields.country} error={fieldErrors.country} required>
                <select
                  value={form.country}
                  onChange={(e) => set("country", e.target.value)}
                  required
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  <option value="">—</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </Row>
          </Section>

          {/* ── Jersey size ────────────────────────────────────────────── */}
          <Section>
            <Field label={t.fields.jerseySize} error={fieldErrors.jerseySize} required>
              <select
                value={form.jerseySize}
                onChange={(e) => set("jerseySize", e.target.value)}
                required
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="">—</option>
                {JERSEY_SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
          </Section>

          {/* ── Registry ───────────────────────────────────────────────── */}
          <Section>
            <Field
              label={t.fields.displayName}
              hint={t.fields.displayNameHint}
              error={fieldErrors.displayName}
              required
            >
              <input
                type="text"
                value={form.displayName}
                onChange={(e) => set("displayName", e.target.value)}
                required
                maxLength={50}
                style={inputStyle}
                placeholder="María H."
              />
            </Field>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={form.isPublic}
                onChange={(e) => set("isPublic", e.target.checked)}
                style={{ accentColor: "#0AAFAA", width: 16, height: 16 }}
              />
              <span style={{ fontSize: 14, color: "#ccc" }}>
                {t.fields.isPublic}
              </span>
            </label>
          </Section>

          {/* ── Payment plan ───────────────────────────────────────────── */}
          <Section>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "#888", marginBottom: 12, textTransform: "uppercase" }}>
              {t.fields.paymentPlan}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(["full", "installments"] as const).map((plan) => (
                <label
                  key={plan}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 16px",
                    borderRadius: 8,
                    border: `1.5px solid ${form.paymentPlan === plan ? "#0AAFAA" : "rgba(255,255,255,0.1)"}`,
                    cursor: "pointer",
                    background: form.paymentPlan === plan ? "rgba(10,175,170,0.06)" : "transparent",
                    transition: "all 0.15s ease",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentPlan"
                    value={plan}
                    checked={form.paymentPlan === plan}
                    onChange={() => set("paymentPlan", plan)}
                    style={{ accentColor: "#0AAFAA" }}
                  />
                  <span style={{ fontSize: 14 }}>
                    {plan === "full" ? t.fields.planFull : t.fields.planInstallments}
                  </span>
                </label>
              ))}
            </div>

            {form.paymentPlan === "installments" && (
              <Field
                label={t.fields.deposit}
                hint={t.fields.depositHint}
                error={fieldErrors.depositAmountCents}
                style={{ marginTop: 16 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#888", fontSize: 14 }}>$</span>
                  <input
                    type="number"
                    min={50}
                    max={249}
                    step={1}
                    value={form.depositAmountCents / 100}
                    onChange={(e) =>
                      set("depositAmountCents", Math.round(Number(e.target.value) * 100))
                    }
                    style={{ ...inputStyle, width: 120 }}
                  />
                </div>
              </Field>
            )}
          </Section>

          {/* ── Terms ──────────────────────────────────────────────────── */}
          <div style={{ marginBottom: 28 }}>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);
                  if (error?.includes("Terms")) setError(null);
                }}
                style={{ accentColor: "#0AAFAA", width: 16, height: 16, marginTop: 2, flexShrink: 0 }}
              />
              <span style={{ fontSize: 14, color: "#ccc", lineHeight: 1.5 }}>
                {t.fields.termsLabel}{" "}
                <a
                  href="https://harpiafc.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#0AAFAA", textDecoration: "underline" }}
                >
                  {t.fields.termsLink}
                </a>
              </span>
            </label>
          </div>

          {/* ── Errors ─────────────────────────────────────────────────── */}
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

          {/* ── Submit ─────────────────────────────────────────────────── */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "16px 24px",
              background: submitting ? "rgba(10,175,170,0.4)" : "#0AAFAA",
              color: "#080808",
              border: "none",
              borderRadius: 8,
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: "0.06em",
              cursor: submitting ? "not-allowed" : "pointer",
              transition: "background 0.15s ease",
            }}
          >
            {submitting ? t.submitting : t.submit}
          </button>
        </form>
      </div>
    </main>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingTop: 24,
        marginBottom: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  required,
  children,
  style,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      <label
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: error ? "#f87171" : "#aaa",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {label}
        {required && <span style={{ color: "#f87171", marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {hint && !error && (
        <span style={{ fontSize: 11, color: "#666" }}>{hint}</span>
      )}
      {error && (
        <span style={{ fontSize: 12, color: "#f87171" }}>{error}</span>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 6,
  color: "#F5F5F5",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};
