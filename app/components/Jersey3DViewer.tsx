"use client";

import dynamic from "next/dynamic";
import { Component, type ErrorInfo, type ReactNode } from "react";

// ─── Loading spinner ───────────────────────────────────────────────────────
function Jersey3DLoading() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#111111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "2px solid rgba(201,168,76,0.2)",
          borderTopColor: "#C9A84C",
          animation: "jerseySpinner 1s linear infinite",
        }}
      />
      <span
        style={{
          fontSize: 10,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "rgba(201,168,76,0.4)",
        }}
      >
        Cargando...
      </span>
      <style>{`@keyframes jerseySpinner { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Error display — visible so we can read what actually broke ────────────
function Jersey3DError({ message }: { message: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#111111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 12,
        padding: 16,
      }}
    >
      <span
        style={{
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,80,80,0.7)",
        }}
      >
        3D model failed to load
      </span>
      <span
        style={{
          fontSize: 10,
          color: "rgba(255,80,80,0.45)",
          textAlign: "center",
          maxWidth: 260,
          wordBreak: "break-word",
          fontFamily: "monospace",
        }}
      >
        {message}
      </span>
    </div>
  );
}

// ─── Error boundary ────────────────────────────────────────────────────────
interface EBState {
  hasError: boolean;
  message: string;
}

class WebGLErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): EBState {
    return { hasError: true, message: error?.message ?? String(error) };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[Jersey3D] error caught by boundary:", error);
    console.error("[Jersey3D] component stack:", info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <Jersey3DError message={this.state.message} />;
    }
    return this.props.children;
  }
}

// ─── Dynamic import (client-only, WebGL) ──────────────────────────────────
const Jersey3DCanvas = dynamic(() => import("./Jersey3D"), {
  ssr: false,
  loading: () => <Jersey3DLoading />,
});

// ─── Public export ─────────────────────────────────────────────────────────
export default function Jersey3DViewer() {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <WebGLErrorBoundary>
        <Jersey3DCanvas />
      </WebGLErrorBoundary>
    </div>
  );
}
