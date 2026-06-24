"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";
import { createOrder, createCheckoutSession } from "../lib/pasalaproApi";
import Jersey3DViewer from "../components/Jersey3DViewer";

const JERSEY_SIZES = ["S", "M", "L", "XL"];
const TERMS_VERSION = "2026-06-v1";

const COUNTRIES = [
  "El Salvador", "United States", "Guatemala", "Honduras", "Mexico",
  "Costa Rica", "Panama", "Nicaragua", "Colombia", "Venezuela",
  "España", "Other",
];

// ── What's included list ──────────────────────────────────────────────────────
const INCLUSIONS_EN = [
  "Founder Edition jersey",
  "Official founder number after successful payment",
  "Public Founder Registry listing (if selected)",
  "Founder status in Harpia FC history",
  "Laser-engraved metal Certificate of Authenticity",
  "Premium collector presentation box",
];

const INCLUSIONS_ES = [
  "Jersey Edición Fundadores",
  "Número oficial de fundador tras el pago exitoso",
  "Listado en el Registro Público de Fundadores (si seleccionas)",
  "Estatus de Fundador en la historia de Harpia FC",
  "Certificado de Autenticidad metálico grabado con láser",
  "Caja de presentación premium para coleccionistas",
];

export default function FoundersCheckoutPage() {
  const { lang } = useLanguage();
  const t = translations[lang].checkout;
  const inclusions = lang === "es" ? INCLUSIONS_ES : INCLUSIONS_EN;

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

  // Next available founder number for the 3D jersey preview. Reuses the same
  // public registry proxy the registry page uses. Left undefined until loaded so
  // the viewer shows the "0001" preview fallback; never invents a wrong number.
  const [nextFounderNumber, setNextFounderNumber] = useState<number | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/fundadores/registry", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled || !json?.ok) return;
        // Public numbers start at `publicStart` (#31); each paid founder takes the
        // next one, so the next available number = publicStart + paid count.
        // (Equivalent to claimed count + 1 = reserved + paid + 1.)
        const publicStart = typeof json.publicStart === "number" ? json.publicStart : 31;
        const paid = typeof json.paid === "number" ? json.paid : 0;
        const next = publicStart + paid;
        if (Number.isFinite(next) && next > 0) setNextFounderNumber(next);
      })
      .catch(() => {
        /* keep undefined → viewer uses the 0001 preview fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
      setError(
        lang === "es"
          ? "Debes aceptar los Términos y Condiciones para continuar."
          : "You must accept the Terms & Conditions to proceed."
      );
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

  const copy = lang === "es"
    ? {
        back: "← Harpia FC",
        tag: "EDICIÓN FUNDADORES",
        title: "Reserva Fundador",
        subtitle: "Reserva tu Edición Oficial de Fundador de Harpia FC.",
        dueLabel: "Total hoy",
        dueValue: "$250 USD",
        feeNote: "Se añadirá una tarifa de procesamiento al momento del pago.",
        shippingNote: "Dirección de envío recopilada de forma segura en el pago.",
        inclusionsTitle: "Tu reserva incluye",
        deliveryTitle: "Entrega",
        deliveryNote: "Los artículos de la Edición Fundadores serán entregados una vez que la producción esté completa.",
        submit: "RESERVAR EDICIÓN FUNDADORES",
        submitting: "Creando tu orden…",
        registryName: "Nombre en el Registro Público",
        registryNameHint: "Aparecerá en el Registro Oficial de Fundadores. Máx. 50 caracteres.",
        isPublicLabel: "Aparecer en el Registro Público de Fundadores",
        termsLabel: "He leído y acepto los",
        termsLink: "Términos y Condiciones",
        limitedLabel: "SOLO 1,000 EDICIONES · NUMERADAS Y AUTENTICADAS",
        dragHint: "Arrastra para rotar",
      }
    : {
        back: "← Harpia FC",
        tag: "FOUNDER EDITION",
        title: "Founder Reservation",
        subtitle: "Reserve your official Harpia FC Founder Edition.",
        dueLabel: "Due today",
        dueValue: "$250 USD",
        feeNote: "A processing fee will be added at checkout.",
        shippingNote: "Shipping address collected securely at checkout.",
        inclusionsTitle: "What your reservation includes",
        deliveryTitle: "Delivery",
        deliveryNote: "Founder Edition items will be delivered after production is complete.",
        submit: "RESERVE FOUNDER EDITION",
        submitting: "Creating your order…",
        registryName: "Public Registry Name",
        registryNameHint: "Name shown in the Official Founder Registry. Max 50 characters.",
        isPublicLabel: "Appear in the public Founder Registry",
        termsLabel: "I have read and accept the",
        termsLink: "Terms & Conditions",
        limitedLabel: "1,000 EDITIONS ONLY · NUMBERED & AUTHENTICATED",
        dragHint: "Drag to rotate",
      };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "#F5F5F5",
        fontFamily: "var(--font-inter, Inter, sans-serif)",
      }}
    >
      <style>{`
        @keyframes founderSpin { to { transform: rotate(360deg); } }

        .founder-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
        }
        .founder-left {
          position: sticky;
          top: 0;
          height: 100vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .founder-right {
          padding: 40px 44px 80px;
          overflow-y: auto;
        }

        @media (max-width: 900px) {
          .founder-layout {
            grid-template-columns: 1fr;
            min-height: auto;
          }
          .founder-left {
            position: relative;
            height: 420px;
          }
          .founder-right {
            padding: 32px 20px 80px;
          }
        }

        @media (max-width: 480px) {
          .founder-left { height: 360px; }
          .founder-right { padding: 24px 16px 80px; }
        }
      `}</style>

      <div className="founder-layout">

        {/* ── LEFT: Premium jersey visual ──────────────────────────────────── */}
        <div
          className="founder-left"
          style={{
            background: "linear-gradient(160deg, #0A0A08 0%, #0F0E09 50%, #0A0A08 100%)",
            borderRight: "1px solid rgba(201,168,76,0.1)",
          }}
        >
          {/* Back link */}
          <div style={{ padding: "20px 24px", flexShrink: 0 }}>
            <Link
              href="/"
              style={{
                color: "rgba(201,168,76,0.45)",
                textDecoration: "none",
                fontSize: 12,
                letterSpacing: "0.1em",
                fontWeight: 600,
                textTransform: "uppercase",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {copy.back}
            </Link>
          </div>

          {/* 3D Jersey — fills remaining height */}
          <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
            {/* Ambient glow behind model */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(ellipse 60% 60% at 50% 55%, rgba(201,168,76,0.07) 0%, transparent 70%)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
            <div style={{ position: "relative", width: "100%", height: "100%", zIndex: 1 }}>
              {/* Preview the next available founder number (undefined → "0001" fallback). */}
              <Jersey3DViewer founderNumber={nextFounderNumber} />
            </div>
          </div>

          {/* Bottom label */}
          <div
            style={{
              padding: "16px 24px 24px",
              flexShrink: 0,
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.22em",
                color: "rgba(201,168,76,0.5)",
                textTransform: "uppercase",
              }}
            >
              {copy.limitedLabel}
            </p>
          </div>
        </div>

        {/* ── RIGHT: Reservation panel ──────────────────────────────────────── */}
        <div className="founder-right">

          {/* Tag */}
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: "#C9A84C",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            {copy.tag}
          </p>

          {/* Title */}
          <h1
            style={{
              fontSize: "clamp(26px, 4vw, 38px)",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: 6,
              letterSpacing: "-0.01em",
            }}
          >
            {copy.title}
          </h1>
          <p style={{ color: "rgba(245,245,245,0.5)", fontSize: 15, marginBottom: 28, lineHeight: 1.5 }}>
            {copy.subtitle}
          </p>

          {/* ── Price summary card ─────────────────────────────────────────── */}
          <div
            style={{
              background: "rgba(201,168,76,0.06)",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: 10,
              padding: "18px 20px",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "rgba(245,245,245,0.45)",
                  textTransform: "uppercase",
                }}
              >
                {copy.dueLabel}
              </span>
              <span style={{ fontSize: 26, fontWeight: 900, color: "#C9A84C", letterSpacing: "-0.01em" }}>
                {copy.dueValue}
              </span>
            </div>
            <div
              style={{
                borderTop: "1px solid rgba(201,168,76,0.12)",
                paddingTop: 10,
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            >
              <p style={{ fontSize: 12, color: "rgba(245,245,245,0.4)", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#C9A84C", fontSize: 10 }}>+</span>
                {copy.feeNote}
              </p>
              <p style={{ fontSize: 12, color: "rgba(245,245,245,0.4)", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#C9A84C", fontSize: 10 }}>✓</span>
                {copy.shippingNote}
              </p>
            </div>
          </div>

          {/* ── What's included ────────────────────────────────────────────── */}
          <div style={{ marginBottom: 20 }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "rgba(245,245,245,0.35)",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              {copy.inclusionsTitle}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 7 }}>
              {inclusions.map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    fontSize: 13,
                    color: "rgba(245,245,245,0.65)",
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ color: "#C9A84C", flexShrink: 0, marginTop: 1 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Delivery note ──────────────────────────────────────────────── */}
          <div
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8,
              padding: "12px 16px",
              marginBottom: 28,
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>📦</span>
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "rgba(245,245,245,0.35)",
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                {copy.deliveryTitle}
              </p>
              <p style={{ fontSize: 12, color: "rgba(245,245,245,0.45)", lineHeight: 1.5 }}>
                {copy.deliveryNote}
              </p>
            </div>
          </div>

          {/* ── Form ───────────────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit}>

            {/* Personal info */}
            <FormSection>
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
            </FormSection>

            {/* Jersey size */}
            <FormSection>
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
            </FormSection>

            {/* Registry */}
            <FormSection>
              <Field
                label={copy.registryName}
                hint={copy.registryNameHint}
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

              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={form.isPublic}
                  onChange={(e) => set("isPublic", e.target.checked)}
                  style={{ accentColor: "#C9A84C", width: 16, height: 16 }}
                />
                <span style={{ fontSize: 13, color: "rgba(245,245,245,0.6)" }}>
                  {copy.isPublicLabel}
                </span>
              </label>
            </FormSection>

            {/* ── Payment plan (HIDDEN FOR LAUNCH — full only) ────────────── */}
            {/* HIDDEN FOR LAUNCH: installments UI disabled. paymentPlan is always "full".
                Re-enable by uncommenting the <FormSection> block below and removing this comment.
            <FormSection>
              ... installment radio buttons and deposit field ...
            </FormSection>
            */}

            {/* Terms */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    if (error?.includes("Terms") || error?.includes("Términos")) setError(null);
                  }}
                  style={{ accentColor: "#C9A84C", width: 16, height: 16, marginTop: 2, flexShrink: 0 }}
                />
                <span style={{ fontSize: 13, color: "rgba(245,245,245,0.5)", lineHeight: 1.5 }}>
                  {copy.termsLabel}{" "}
                  <a
                    href="https://harpiafc.com/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#C9A84C", textDecoration: "underline" }}
                  >
                    {copy.termsLink}
                  </a>
                </span>
              </label>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  borderRadius: 8,
                  padding: "12px 16px",
                  color: "#f87171",
                  fontSize: 13,
                  marginBottom: 16,
                  lineHeight: 1.4,
                }}
              >
                {error}
              </div>
            )}

            {/* CTA */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "17px 24px",
                background: submitting ? "rgba(201,168,76,0.35)" : "#C9A84C",
                color: "#080808",
                border: "none",
                borderRadius: 8,
                fontWeight: 900,
                fontSize: 14,
                letterSpacing: "0.1em",
                cursor: submitting ? "not-allowed" : "pointer",
                transition: "background 0.15s ease, transform 0.1s ease",
              }}
              onMouseEnter={(e) => {
                if (!submitting) (e.currentTarget as HTMLButtonElement).style.background = "#DDB95C";
              }}
              onMouseLeave={(e) => {
                if (!submitting) (e.currentTarget as HTMLButtonElement).style.background = "#C9A84C";
              }}
            >
              {submitting ? copy.submitting : copy.submit}
            </button>

            {/* Registry link */}
            <p style={{ textAlign: "center", marginTop: 14 }}>
              <Link href="/founders/registry" style={{ fontSize: 12, color: "rgba(245,245,245,0.25)", textDecoration: "none" }}>
                {lang === "es" ? "Ver Registro de Fundadores →" : "View Founder Registry →"}
              </Link>
            </p>

          </form>
        </div>
      </div>
    </main>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FormSection({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingTop: 20,
        marginBottom: 20,
        display: "flex",
        flexDirection: "column",
        gap: 14,
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
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: error ? "#f87171" : "rgba(245,245,245,0.4)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
        {required && <span style={{ color: "#f87171", marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {hint && !error && (
        <span style={{ fontSize: 11, color: "rgba(245,245,245,0.25)", lineHeight: 1.4 }}>{hint}</span>
      )}
      {error && (
        <span style={{ fontSize: 11, color: "#f87171" }}>{error}</span>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 6,
  color: "#F5F5F5",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s ease",
};
