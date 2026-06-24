"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import Jersey3DViewer from "../components/Jersey3DViewer";

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
          home: "← Harpia FC",
          title: "Mi cuenta",
          accountDetails: "Detalles de la cuenta",
          firstName: "Nombre",
          lastName: "Apellido",
          email: "Correo electrónico",
          logout: "Cerrar sesión",
          loggingOut: "Cerrando…",
          loadingMsg: "Cargando tu cuenta…",
          founderBadge: "Fundador",
          registryTitle: "Registro de Fundadores",
          registryNumber: "Número de Fundador",
          status: "Estado",
          jerseySize: "Talla de jersey",
          joined: "Fecha de registro",
          none: "Aún no tienes un registro de Fundador.",
          noneSub: "Asegura tu lugar en la historia de Harpia FC.",
          viewCollection: "Ver Colección de Fundadores",
          jerseyTitle: "Tu Jersey de Fundador",
          jerseySub: "Edición oficial numerada · Arrastra para rotar",
        }
      : {
          home: "← Harpia FC",
          title: "My account",
          accountDetails: "Account details",
          firstName: "First name",
          lastName: "Last name",
          email: "Email",
          logout: "Log out",
          loggingOut: "Logging out…",
          loadingMsg: "Loading your account…",
          founderBadge: "Founder",
          registryTitle: "Founder Registry",
          registryNumber: "Founder number",
          status: "Status",
          jerseySize: "Jersey size",
          joined: "Date joined",
          none: "You do not have a Founder registry record yet.",
          noneSub: "Secure your place in Harpia FC history.",
          viewCollection: "View Founder Collection",
          jerseyTitle: "Your Founder Jersey",
          jerseySub: "Official numbered edition · Drag to rotate",
        };

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    router.replace("/login");
  }

  // While checking the session, or mid-redirect, show a minimal placeholder.
  if (loading || !user) {
    return (
      <main style={pageStyle}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
          <Spinner />
          <p style={{ color: "rgba(245,245,245,0.45)", fontSize: 14 }}>{t.loadingMsg}</p>
        </div>
      </main>
    );
  }

  const initials =
    `${(user.firstName?.[0] || "").toUpperCase()}${(user.lastName?.[0] || "").toUpperCase()}` ||
    (user.email?.[0] || "?").toUpperCase();
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;

  // Optional profile image if a future profile API exposes one; falls back to initials.
  const profileImageUrl = (user as { profileImageUrl?: string }).profileImageUrl;

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
    <main style={pageStyle}>
      <style>{ACCOUNT_CSS}</style>

      <div className="acct-wrap">
        {/* Top bar */}
        <div className="acct-topbar">
          <Link href="/" className="acct-home">{t.home}</Link>
        </div>

        {/* ── Header card ──────────────────────────────────────────────── */}
        <section className="acct-card acct-header">
          <div className="acct-avatar">
            {profileImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profileImageUrl} alt={fullName} className="acct-avatar-img" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="acct-header-info">
            <h1 className="acct-name">{fullName}</h1>
            <p className="acct-email">{user.email}</p>
            {hasRegistry && (
              <span className="acct-badge">
                ★ {t.founderBadge}
                {founderNumber ? ` · ${founderNumber}` : ""}
              </span>
            )}
          </div>
        </section>

        {/* ── Main grid ────────────────────────────────────────────────── */}
        <div className={`acct-grid${hasRegistry ? " has-jersey" : ""}`}>
          {/* Left column */}
          <div className="acct-col">
            {/* Account details */}
            <section className="acct-card">
              <p className="acct-card-title">{t.accountDetails}</p>
              <div className="acct-rows">
                <InfoRow label={t.firstName} value={user.firstName} />
                <InfoRow label={t.lastName} value={user.lastName} />
                <InfoRow label={t.email} value={user.email} last />
              </div>
            </section>

            {/* Founder registry */}
            <section className="acct-card">
              <p className="acct-card-title">{t.registryTitle}</p>

              {regLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "14px 0" }}>
                  <Spinner />
                </div>
              ) : hasRegistry && registry ? (
                <div className="acct-registry">
                  <div className="acct-number">{founderNumber || "—"}</div>
                  <div className="acct-rows">
                    {registry.status && <InfoRow label={t.status} value={formatStatus(registry.status)} />}
                    {registry.jerseySize && <InfoRow label={t.jerseySize} value={registry.jerseySize} />}
                    {joinedDate && <InfoRow label={t.joined} value={joinedDate} last />}
                  </div>
                </div>
              ) : (
                <div className="acct-empty">
                  <p className="acct-empty-title">{t.none}</p>
                  <p className="acct-empty-sub">{t.noneSub}</p>
                </div>
              )}

              <Link href="/founders" className="acct-btn-gold">
                {t.viewCollection}
              </Link>
            </section>
          </div>

          {/* Right column — Founder jersey (only when registered) */}
          {hasRegistry && (
            <section className="acct-card acct-jersey-card">
              <p className="acct-card-title">{t.jerseyTitle}</p>
              <div className="jersey-stage">
                <div className="jersey-glow" />
                <Jersey3DViewer />
              </div>
              <p className="acct-jersey-sub">{t.jerseySub}</p>
            </section>
          )}
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="acct-btn-ghost"
        >
          {loggingOut ? t.loggingOut : t.logout}
        </button>
      </div>
    </main>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function formatStatus(status: string): string {
  return status
    .split("_")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className="acct-row" style={last ? { borderBottom: "none", paddingBottom: 0 } : undefined}>
      <span className="acct-row-label">{label}</span>
      <span className="acct-row-value">{value || "—"}</span>
    </div>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: 24,
        height: 24,
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

// ── Styles ────────────────────────────────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "radial-gradient(120% 80% at 50% -10%, #14110A 0%, #080808 55%)",
  color: "#F5F5F5",
  fontFamily: "var(--font-inter, Inter, sans-serif)",
};

const ACCOUNT_CSS = `
  .acct-wrap { max-width: 1000px; margin: 0 auto; padding: 24px 18px 96px; }

  .acct-topbar { margin-bottom: 20px; }
  .acct-home {
    color: rgba(201,168,76,0.6); text-decoration: none; font-size: 12px;
    letter-spacing: 0.1em; font-weight: 600; text-transform: uppercase;
    transition: color 0.15s ease;
  }
  .acct-home:hover { color: #C9A84C; }

  .acct-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 22px;
  }

  /* Header */
  .acct-header {
    display: flex; align-items: center; gap: 18px;
    flex-direction: column; text-align: center; margin-bottom: 18px;
  }
  .acct-avatar {
    width: 84px; height: 84px; border-radius: 50%;
    flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    font-size: 30px; font-weight: 900; color: #080808;
    background: linear-gradient(145deg, #E8C96A 0%, #C9A84C 60%, #9A7A30 100%);
    box-shadow: 0 8px 28px rgba(201,168,76,0.25);
    overflow: hidden;
  }
  .acct-avatar-img { width: 100%; height: 100%; object-fit: cover; }
  .acct-header-info { display: flex; flex-direction: column; gap: 6px; align-items: center; }
  .acct-name { font-size: 24px; font-weight: 900; letter-spacing: -0.01em; line-height: 1.1; }
  .acct-email { font-size: 14px; color: rgba(245,245,245,0.5); word-break: break-all; }
  .acct-badge {
    margin-top: 2px; align-self: center;
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;
    color: #C9A84C; background: rgba(201,168,76,0.1);
    border: 1px solid rgba(201,168,76,0.3); border-radius: 999px;
    padding: 5px 12px;
  }

  @media (min-width: 560px) {
    .acct-header { flex-direction: row; text-align: left; }
    .acct-header-info { align-items: flex-start; }
    .acct-badge { align-self: flex-start; }
  }

  /* Grid */
  .acct-grid { display: grid; grid-template-columns: 1fr; gap: 18px; }
  .acct-col { display: flex; flex-direction: column; gap: 18px; }
  @media (min-width: 860px) {
    .acct-grid.has-jersey { grid-template-columns: 1.05fr 0.95fr; align-items: start; }
  }

  .acct-card-title {
    font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    color: #C9A84C; margin-bottom: 16px;
  }

  .acct-rows { display: flex; flex-direction: column; gap: 12px; }
  .acct-row {
    display: flex; flex-direction: column; gap: 3px;
    padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .acct-row-label {
    font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
    color: rgba(245,245,245,0.4);
  }
  .acct-row-value { font-size: 15px; color: #F5F5F5; word-break: break-word; }

  /* Registry */
  .acct-registry { margin-bottom: 18px; }
  .acct-number {
    font-size: 34px; font-weight: 900; color: #C9A84C; letter-spacing: 0.02em;
    margin-bottom: 14px;
  }
  .acct-empty { margin-bottom: 18px; }
  .acct-empty-title { font-size: 15px; color: rgba(245,245,245,0.7); margin-bottom: 4px; }
  .acct-empty-sub { font-size: 13px; color: rgba(245,245,245,0.4); line-height: 1.5; }

  /* Jersey */
  .acct-jersey-card { display: flex; flex-direction: column; }
  .jersey-stage {
    position: relative; width: 100%; height: 340px;
    border-radius: 12px; overflow: hidden;
    background: linear-gradient(160deg, #0A0A08 0%, #0F0E09 50%, #0A0A08 100%);
    border: 1px solid rgba(201,168,76,0.12);
  }
  .jersey-glow {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background: radial-gradient(ellipse 60% 60% at 50% 55%, rgba(201,168,76,0.10) 0%, transparent 70%);
  }
  .jersey-stage > div:last-child { position: relative; z-index: 1; width: 100%; height: 100%; }
  .acct-jersey-sub {
    margin-top: 12px; text-align: center; font-size: 11px;
    letter-spacing: 0.12em; text-transform: uppercase; color: rgba(245,245,245,0.35);
  }
  @media (min-width: 860px) {
    .jersey-stage { height: 420px; }
  }

  /* Buttons */
  .acct-btn-gold {
    display: block; text-align: center; text-decoration: none;
    padding: 13px 24px; background: #C9A84C; color: #080808;
    border-radius: 8px; font-weight: 900; font-size: 13px;
    letter-spacing: 0.08em; text-transform: uppercase;
    transition: background 0.15s ease;
  }
  .acct-btn-gold:hover { background: #E8C96A; }

  .acct-btn-ghost {
    margin-top: 26px; width: 100%; padding: 14px 24px;
    background: transparent; color: #F5F5F5;
    border: 1px solid rgba(255,255,255,0.15); border-radius: 8px;
    font-weight: 700; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase;
    cursor: pointer; transition: border-color 0.15s ease, color 0.15s ease;
  }
  .acct-btn-ghost:hover { border-color: rgba(201,168,76,0.5); color: #C9A84C; }
  .acct-btn-ghost:disabled { cursor: not-allowed; opacity: 0.6; }
`;
