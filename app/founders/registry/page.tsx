"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";

interface RegistryEntry {
  code: string;
  displayName: string;
  type: "reserved" | "paid";
}

interface RegistryData {
  ok: boolean;
  total: number;
  publicStart: number;
  reserved: number;
  paid: number;
  available: number;
  entries: RegistryEntry[];
}

export default function FounderRegistryPage() {
  const { lang } = useLanguage();
  const [data, setData] = useState<RegistryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/fundadores/registry", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) {
          setData(json);
        } else {
          setError("Registry unavailable.");
        }
      })
      .catch(() => setError("Could not load registry."))
      .finally(() => setLoading(false));
  }, []);

  const label = lang === "es"
    ? { back: "← Harpia FC", pageTag: "REGISTRO OFICIAL", pageTitle: "Registro de Fundadores", statsTotal: "Ediciones Totales", statsReserved: "Reservadas", statsPaid: "Vendidas", statsAvailable: "Disponibles", publicStart: "Público desde", entriesTitle: "Entradas del Registro", typeReserved: "Reservado", typePaid: "Fundador", reservedBlock: "Bloque Reservado (#0001–#0030)", publicBlock: "Fundadores Públicos (#0031+)", cta: "RESERVAR MI EDICIÓN FUNDADORES", ctaLink: "/founders" }
    : { back: "← Harpia FC", pageTag: "OFFICIAL REGISTRY", pageTitle: "Founder Registry", statsTotal: "Total Editions", statsReserved: "Reserved", statsPaid: "Sold", statsAvailable: "Available", publicStart: "Public from", entriesTitle: "Registry Entries", typeReserved: "Reserved", typePaid: "Founder", reservedBlock: "Reserved Block (#0001–#0030)", publicBlock: "Public Founders (#0031+)", cta: "RESERVE MY FOUNDER EDITION", ctaLink: "/founders" };

  const reservedEntries = data?.entries.filter((e) => e.type === "reserved") ?? [];
  const paidEntries     = data?.entries.filter((e) => e.type === "paid")     ?? [];

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
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "20px 24px" }}>
        <Link
          href="/"
          style={{ color: "#888", textDecoration: "none", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          {label.back}
        </Link>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 0" }}>
        {/* Title */}
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#C9A84C", marginBottom: 12, textTransform: "uppercase" }}>
          {label.pageTag}
        </p>
        <h1 style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 800, marginBottom: 32, lineHeight: 1.2 }}>
          {label.pageTitle}
        </h1>

        {/* Stats */}
        {!loading && !error && data && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
              marginBottom: 40,
            }}
          >
            <StatCard label={label.statsTotal}     value="1,000"                               color="#F5F5F5" />
            <StatCard label={label.statsReserved}  value={String(data.reserved)}               color="#C0C0C0" />
            <StatCard label={label.statsPaid}      value={String(data.paid)}                   color="#C9A84C" />
            <StatCard label={label.statsAvailable} value={String(data.available)}              color="#4ADE80" />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#555" }}>
            <Spinner />
            <p style={{ marginTop: 16, fontSize: 14 }}>
              {lang === "es" ? "Cargando registro…" : "Loading registry…"}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 8,
              padding: "16px 20px",
              color: "#f87171",
              fontSize: 14,
              marginBottom: 32,
            }}
          >
            {error}
          </div>
        )}

        {/* Reserved block */}
        {!loading && !error && reservedEntries.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <SectionHeader>{label.reservedBlock}</SectionHeader>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
              {reservedEntries.map((e) => (
                <EntryCard key={e.code} entry={e} typeLabel={label.typeReserved} />
              ))}
            </div>
          </section>
        )}

        {/* Public paid entries */}
        {!loading && !error && (
          <section style={{ marginBottom: 48 }}>
            <SectionHeader>{label.publicBlock}</SectionHeader>
            {paidEntries.length === 0 ? (
              <p style={{ color: "#444", fontSize: 14, padding: "24px 0" }}>
                {lang === "es"
                  ? "Aún no hay fundadores públicos. ¡Sé el primero!"
                  : "No public founders yet. Be the first!"}
              </p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
                {paidEntries.map((e) => (
                  <EntryCard key={e.code} entry={e} typeLabel={label.typePaid} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* CTA */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: 32,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <Link
            href={label.ctaLink}
            style={{
              display: "block",
              padding: "16px 24px",
              background: "#C9A84C",
              color: "#080808",
              border: "none",
              borderRadius: 8,
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: "0.06em",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            {label.cta}
          </Link>
          <Link href="/" style={{ color: "#555", textDecoration: "none", fontSize: 13, textAlign: "center" }}>
            {lang === "es" ? "Volver al inicio" : "Back to Home"}
          </Link>
        </div>
      </div>
    </main>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 10,
        padding: "14px 16px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 900, color, fontVariantNumeric: "tabular-nums" }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.1em",
        color: "#555",
        textTransform: "uppercase",
        marginBottom: 12,
      }}
    >
      {children}
    </p>
  );
}

function EntryCard({ entry, typeLabel }: { entry: RegistryEntry; typeLabel: string }) {
  const isReserved = entry.type === "reserved";
  const accent     = isReserved ? "#C0C0C0" : "#C9A84C";

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${isReserved ? "rgba(192,192,192,0.12)" : "rgba(201,168,76,0.18)"}`,
        borderRadius: 8,
        padding: "12px 14px",
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 800, color: accent, fontVariantNumeric: "tabular-nums", marginBottom: 2 }}>
        {entry.code}
      </div>
      <div style={{ fontSize: 12, color: "#ccc", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {entry.displayName}
      </div>
      <div style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>
        {typeLabel}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        border: "3px solid rgba(201,168,76,0.15)",
        borderTop: "3px solid #C9A84C",
        borderRadius: "50%",
        animation: "spin 0.9s linear infinite",
        margin: "0 auto",
      }}
    />
  );
}
