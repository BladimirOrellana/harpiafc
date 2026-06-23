"use client";

import { useState, useEffect, Suspense, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { AuthShell, Field, ErrorBanner, inputStyle, primaryButtonStyle } from "../components/AuthShell";

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthShell tag="HARPIA" title="…" />}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const { lang } = useLanguage();
  const router = useRouter();
  const params = useSearchParams();
  const { user, loading, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const next = params.get("next") || "/account";

  // Already authenticated → skip the form.
  useEffect(() => {
    if (!loading && user) router.replace(next);
  }, [loading, user, router, next]);

  const t =
    lang === "es"
      ? {
          tag: "CUENTA HARPIA",
          title: "Inicia sesión",
          subtitle: "Accede a tu cuenta de Harpia FC.",
          email: "Correo electrónico",
          password: "Contraseña",
          submit: "INICIAR SESIÓN",
          submitting: "Iniciando…",
          noAccount: "¿No tienes cuenta?",
          signup: "Crear cuenta",
          generic: "No se pudo iniciar sesión. Inténtalo de nuevo.",
        }
      : {
          tag: "HARPIA ACCOUNT",
          title: "Sign in",
          subtitle: "Access your Harpia FC account.",
          email: "Email",
          password: "Password",
          submit: "SIGN IN",
          submitting: "Signing in…",
          noAccount: "Don't have an account?",
          signup: "Create one",
          generic: "Could not sign in. Please try again.",
        };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSubmitting(true);

    const result = await login(email.trim(), password);
    if (result.ok) {
      router.replace(next);
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
          {t.noAccount}{" "}
          <Link href="/signup" style={{ color: "#C9A84C", textDecoration: "underline" }}>
            {t.signup}
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        {error && <ErrorBanner message={error} />}

        <Field label={t.email} error={fieldErrors.email} required>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            style={inputStyle}
            placeholder="maria@email.com"
          />
        </Field>

        <Field label={t.password} error={fieldErrors.password} required>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            style={inputStyle}
            placeholder="••••••••"
          />
        </Field>

        <button type="submit" disabled={submitting} style={primaryButtonStyle(submitting)}>
          {submitting ? t.submitting : t.submit}
        </button>
      </form>
    </AuthShell>
  );
}
