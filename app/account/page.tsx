"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { AuthShell } from "../components/AuthShell";

export default function AccountPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  // Route protection — redirect to login once we know there's no session.
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

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

  return (
    <AuthShell tag={t.tag} title={t.title} subtitle={t.subtitle}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
        <InfoRow label={t.firstName} value={user.firstName} />
        <InfoRow label={t.lastName} value={user.lastName} />
        <InfoRow label={t.email} value={user.email} />
      </div>

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
    </AuthShell>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        paddingBottom: 12,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
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
      <span style={{ fontSize: 15, color: "#F5F5F5" }}>{value || "—"}</span>
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
