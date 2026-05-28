"use client";

import dynamic from "next/dynamic";
import { Component, type ErrorInfo, type ReactNode } from "react";
import Image from "next/image";

// ─── CSS-only fallback ─────────────────────────────────────────────────────
// Used when WebGL/Three.js fails to initialize. Still premium and interactive.
function JerseyCSSFallback() {
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
          position: "relative",
          width: 220,
          height: 254,
          animation: "cssJerseyFloat 4s ease-in-out infinite",
          filter: "drop-shadow(0 0 24px rgba(201,168,76,0.35))",
        }}
      >
        <Image
          src="/harpia-front-t.PNG"
          alt="Harpia FC Edición Fundadores"
          fill
          sizes="220px"
          className="object-contain"
          priority
        />
      </div>
      <span
        style={{
          fontSize: 10,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "rgba(201,168,76,0.4)",
        }}
      >
        Edición Fundadores
      </span>
      <style>{`
        @keyframes cssJerseyFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
      `}</style>
    </div>
  );
}

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

// ─── Error boundary ────────────────────────────────────────────────────────
interface EBState {
  hasError: boolean;
}
class WebGLErrorBoundary extends Component<
  { children: ReactNode },
  EBState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(): EBState {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("[Jersey3D] WebGL error — CSS fallback active:", error, info);
  }
  render() {
    if (this.state.hasError) return <JerseyCSSFallback />;
    return this.props.children;
  }
}

// ─── Dynamic import (client-only, WebGL) ──────────────────────────────────
const Jersey3DCanvas = dynamic(() => import("./Jersey3D"), {
  ssr: false,
  loading: () => <Jersey3DLoading />,
});

// ─── Public export ─────────────────────────────────────────────────────────
// Outer div must be w-full h-full so it fills the 520px container.
export default function Jersey3DViewer() {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <WebGLErrorBoundary>
        <Jersey3DCanvas />
      </WebGLErrorBoundary>
    </div>
  );
}
