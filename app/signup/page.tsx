"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { AuthShell, Field, ErrorBanner, inputStyle, primaryButtonStyle } from "../components/AuthShell";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const { user, loading, signup } = useAuth();

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!loading && user) router.replace("/account");
  }, [loading, user, router]);

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  const t =
    lang === "es"
      ? {
          tag: "CUENTA HARPIA",
          title: "Crea tu cuenta",
          subtitle: "Únete a Harpia FC.",
          firstName: "Nombre",
          lastName: "Apellido",
          email: "Correo electrónico",
          password: "Contraseña",
          passwordHint: "Mínimo 8 caracteres.",
          submit: "CREAR CUENTA",
          submitting: "Creando cuenta…",
          haveAccount: "¿Ya tienes cuenta?",
          login: "Inicia sesión",
          generic: "No se pudo crear la cuenta. Inténtalo de nuevo.",
          reqFirst: "El nombre es obligatorio.",
          reqLast: "El apellido es obligatorio.",
          reqEmail: "Ingresa un correo válido.",
          reqPass: "La contraseña debe tener al menos 8 caracteres.",
        }
      : {
          tag: "HARPIA ACCOUNT",
          title: "Create your account",
          subtitle: "Join Harpia FC.",
          firstName: "First name",
          lastName: "Last name",
          email: "Email",
          password: "Password",
          passwordHint: "At least 8 characters.",
          submit: "CREATE ACCOUNT",
          submitting: "Creating account…",
          haveAccount: "Already have an account?",
          login: "Sign in",
          generic: "Could not create your account. Please try again.",
          reqFirst: "First name is required.",
          reqLast: "Last name is required.",
          reqEmail: "A valid email is required.",
          reqPass: "Password must be at least 8 characters.",
        };

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = t.reqFirst;
    if (!form.lastName.trim()) errs.lastName = t.reqLast;
    if (!EMAIL_RE.test(form.email.trim())) errs.email = t.reqEmail;
    if (form.password.length < 8) errs.password = t.reqPass;
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    const result = await signup({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      password: form.password,
    });

    if (result.ok) {
      router.replace("/account");
      return;
    }

    if (result.errors) setFieldErrors(result.errors);
    setError(result.error || (result.errors ? null : t.generic));
    setSubmitting(false);
  }

  return (
    <AuthShell
      tag={t.tag}
      title={t.title}
      subtitle={t.subtitle}
      footer={
        <span>
          {t.haveAccount}{" "}
          <Link href="/login" style={{ color: "#C9A84C", textDecoration: "underline" }}>
            {t.login}
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        {error && <ErrorBanner message={error} />}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label={t.firstName} error={fieldErrors.firstName} required>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              autoComplete="given-name"
              required
              style={inputStyle}
              placeholder="María"
            />
          </Field>
          <Field label={t.lastName} error={fieldErrors.lastName} required>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              autoComplete="family-name"
              required
              style={inputStyle}
              placeholder="Hernández"
            />
          </Field>
        </div>

        <Field label={t.email} error={fieldErrors.email} required>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            autoComplete="email"
            required
            style={inputStyle}
            placeholder="maria@email.com"
          />
        </Field>

        <Field label={t.password} error={fieldErrors.password || undefined} required>
          <input
            type="password"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            autoComplete="new-password"
            required
            style={inputStyle}
            placeholder="••••••••"
          />
          {!fieldErrors.password && (
            <span style={{ fontSize: 11, color: "rgba(245,245,245,0.25)", marginTop: 2 }}>
              {t.passwordHint}
            </span>
          )}
        </Field>

        <button type="submit" disabled={submitting} style={primaryButtonStyle(submitting)}>
          {submitting ? t.submitting : t.submit}
        </button>
      </form>
    </AuthShell>
  );
}
