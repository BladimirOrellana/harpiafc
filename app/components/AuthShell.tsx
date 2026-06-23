"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";

// Shared layout + form primitives for the auth pages (login / signup / account).
// Matches the founder pages: dark canvas, gold accents, the same input styling.

export const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 6,
  color: "#F5F5F5",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s ease",
};

export const primaryButtonStyle = (busy: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "15px 24px",
  background: busy ? "rgba(201,168,76,0.35)" : "#C9A84C",
  color: "#080808",
  border: "none",
  borderRadius: 8,
  fontWeight: 900,
  fontSize: 14,
  letterSpacing: "0.1em",
  cursor: busy ? "not-allowed" : "pointer",
  transition: "background 0.15s ease",
});

export function AuthShell({
  tag,
  title,
  subtitle,
  children,
  footer,
}: {
  tag: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "#F5F5F5",
        fontFamily: "var(--font-inter, Inter, sans-serif)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px 80px",
      }}
    >
      {/* Brand */}
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
          marginBottom: 36,
          marginTop: 12,
        }}
      >
        <span style={{ position: "relative", width: 34, height: 34, display: "inline-block" }}>
          <Image src="/harpia-fc.png" alt="Harpia FC" fill sizes="34px" style={{ objectFit: "contain" }} />
        </span>
        <span
          style={{
            fontWeight: 900,
            letterSpacing: "0.22em",
            fontSize: 16,
            color: "#C9A84C",
          }}
        >
          HARPIA FC
        </span>
      </Link>

      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          padding: "32px 28px",
        }}
      >
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.18em",
            color: "#C9A84C",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          {tag}
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.15, marginBottom: subtitle ? 6 : 22 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: "rgba(245,245,245,0.5)", fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
            {subtitle}
          </p>
        )}

        {children}
      </div>

      {footer && (
        <div style={{ marginTop: 22, fontSize: 13, color: "rgba(245,245,245,0.45)" }}>{footer}</div>
      )}
    </main>
  );
}

export function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 16 }}>
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
      {error && <span style={{ fontSize: 11, color: "#f87171" }}>{error}</span>}
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
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
      {message}
    </div>
  );
}
