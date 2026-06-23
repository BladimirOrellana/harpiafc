"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { AuthShell } from "../components/AuthShell";

interface Registry {
  number: number | null;
  code: string | null;
  status: string | null;
  certificateName: string | null;
  jerseySize: string | null;
  createdAt: string | null;
}

export default function AccountPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  // Founder registry status
  const [regLoading, setRegLoading] = useState(true);
  const [hasRegistry, setHasRegistry] = useState(false);
  const [registry, setRegistry] = useState<Registry | null>(null);

  // Route protection — redirect to login once we know there's no session.
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  // Fetch Founder registry status once authenticated.
  useEffect(() => {
    if (loading || !user) return;
    let cancelled = false;
    (async () => {
      setRegLoading(true);
      try {
        const res = await fetch("/api/auth/registry-status", { cache: "no-store" });
        if (!res.ok) {
          if (!cancelled) {
            setHasRegistry(false);
            setRegistry(null);
          }
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          setHasRegistry(Boolean(data.hasRegistry));
          setRegistry((data.registry as Registry) ?? null);
        }
      } catch {
        if (!cancelled) {
          setHasRegistry(false);
          setRegistry(null);
        }
      } finally {
        if (!cancelled) setRegLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loading, user]);

  const t =
    lang === "es"
      ? {
          tag: "CUENTA HARPIA",
          title: "Mi cuenta",
          subtitle: "Tu información de Harpia FC.",
          firstName: "Nombre",
          lastName: "Apellido",
          email: "Correo electrónico",
          logout: "Cerrar sesión",
          loggingOut: "Cerrando…",
          loadingMsg: "Cargando…",
          registryTitle: "Registro de Fundadores",
          registryNumber: "Número de Fundador",
          status: "Estado",
          jerseySize: "Talla de jersey",
          joined: "Fecha de registro",
          none: "Aún no tienes un registro de Fundador.",
          viewCollection: "Ver Colección de Fundadores",
        }
      : {
          tag: "HARPIA ACCOUNT",
          title: "My account",
          subtitle: "Your Harpia FC information.",
          firstName: "First name",
          lastName: "Last name",
          email: "Email",
          logout: "Log out",
          loggingOut: "Logging out…",
          loadingMsg: "Loading…",
          registryTitle: "Founder Registry",
          registryNumber: "Founder number",
          status: "Status",
          jerseySize: "Jersey size",
          joined: "Date joined",
          none: "You do not have a Founder registry record yet.",
          viewCollection: "View Founder Collection",
        };

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    router.replace("/login");
  }

  // While checking the session, or mid-redirect, show a minimal placeholder.
  if (loading || !user) {
    return (
      <AuthShell tag={t.tag} title={t.loadingMsg}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 8px" }}>
          <Spinner />
        </div>
      </AuthShell>
    );
  }

  const founderNumber =
    registry?.code || (typeof registry?.number === "number" ? `#${registry.number}` : null);
  const joinedDate = registry?.createdAt
    ? new Date(registry.createdAt).toLocaleDateString(lang === "es" ? "es" : "en", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <AuthShell tag={t.tag} title={t.title} subtitle={t.subtitle}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 8 }}>
        <InfoRow label={t.firstName} value={user.firstName} />
        <InfoRow label={t.lastName} value={user.lastName} />
        <InfoRow label={t.email} value={user.email} />
      </div>

      {/* ── Founder Registry ─────────────────────────────────────────────── */}
      <div style={{ marginTop: 22 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "#C9A84C",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          {t.registryTitle}
        </p>

        {regLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "10px 0" }}>
            <Spinner />
          </div>
        ) : hasRegistry && registry ? (
          <div
            style={{
              background: "rgba(201,168,76,0.06)",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: 10,
              padding: "16px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <InfoRow label={t.registryNumber} value={founderNumber || "—"} accent />
            {registry.status && <InfoRow label={t.status} value={formatStatus(registry.status)} />}
            {registry.jerseySize && <InfoRow label={t.jerseySize} value={registry.jerseySize} />}
            {joinedDate && <InfoRow label={t.joined} value={joinedDate} last />}
          </div>
        ) : (
          <p
            style={{
              fontSize: 14,
              color: "rgba(245,245,245,0.55)",
              lineHeight: 1.5,
              marginBottom: 4,
            }}
          >
            {t.none}
          </p>
        )}

        <Link
          href="/founders"
          style={{
            display: "block",
            textAlign: "center",
            marginTop: 16,
            padding: "13px 24px",
            background: "#C9A84C",
            color: "#080808",
            borderRadius: 8,
            fontWeight: 900,
            fontSize: 13,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          {t.viewCollection}
        </Link>
      </div>

      <div style={{ marginTop: 26 }}>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            width: "100%",
            padding: "13px 24px",
            background: "transparent",
            color: "#F5F5F5",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: loggingOut ? "not-allowed" : "pointer",
            transition: "border-color 0.15s ease, color 0.15s ease",
          }}
        >
          {loggingOut ? t.loggingOut : t.logout}
        </button>
      </div>
    </AuthShell>
  );
}

function formatStatus(status: string): string {
  return status
    .split("_")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function InfoRow({
  label,
  value,
  accent,
  last,
}: {
  label: string;
  value: string;
  accent?: boolean;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        paddingBottom: last ? 0 : 12,
        borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "rgba(245,245,245,0.4)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: accent ? 18 : 15, fontWeight: accent ? 900 : 400, color: accent ? "#C9A84C" : "#F5F5F5" }}>
        {value || "—"}
      </span>
    </div>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: 22,
        height: 22,
        border: "2px solid rgba(201,168,76,0.25)",
        borderTopColor: "#C9A84C",
        borderRadius: "50%",
        display: "inline-block",
        animation: "hfspin 0.7s linear infinite",
      }}
    >
      <style>{`@keyframes hfspin { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}
