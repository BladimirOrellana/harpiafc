"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

interface RegistryData {
  total: number;
  publicStart: number;
  paid: number;
  available: number;
  reserved: number;
}

export default function FundadoresSection() {
  const { lang } = useLanguage();
  const t = translations[lang].fundadores;

  const [registry, setRegistry] = useState<RegistryData | null>(null);

  useEffect(() => {
    fetch("/api/fundadores/registry")
      .then((r) => r.json())
      .then((data) => {
        if (!data.ok) return;
        const total       = typeof data.total       === "number" ? data.total       : 1000;
        const publicStart = typeof data.publicStart === "number" ? data.publicStart : 31;
        const reserved    = typeof data.reserved    === "number" ? data.reserved    : 30;
        const paid        = typeof data.paid        === "number" ? data.paid        : 0;
        const available   = typeof data.available   === "number"
          ? data.available
          : Math.max(total - reserved - paid, 0);
        setRegistry({ total, publicStart, reserved, paid, available });
      })
      .catch(() => {});
  }, []);

  // Next available founder number
  const nextNumber = registry
    ? `#${String(registry.publicStart + registry.paid).padStart(4, "0")}`
    : "#0031";

  return (
    <section id="fundadores" className="relative py-24 sm:py-32 bg-[#0D0D0D]">
      <div className="section-divider mb-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── HEADER ───────────────────────────────────────────────────────── */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-[#C9A84C] mb-4">
            {t.sectionLabel}
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#F5F5F5] mb-5">
            {t.title}
          </h2>
          <div className="inline-flex items-center gap-3 px-6 py-2 border border-[#C9A84C]/40 rounded-full">
            <span className="text-[#C9A84C] font-bold tracking-widest text-sm">
              {t.internalCta.price}
            </span>
            <span className="text-[#F5F5F5]/20">·</span>
            <span className="text-[#F5F5F5]/40 text-xs tracking-wider">
              {lang === "es" ? "1,000 ediciones" : "1,000 editions"}
            </span>
          </div>
        </div>

        {/* ── LIVE STATS ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 mb-16 max-w-md mx-auto">
          <div className="glass-card rounded-xl p-5 text-center border border-[#C9A84C]/15">
            <div className="text-2xl font-black text-[#F5F5F5] font-mono">1,000</div>
            <div className="text-[10px] text-[#F5F5F5]/35 uppercase tracking-[0.18em] mt-1">
              {lang === "es" ? "Total" : "Total"}
            </div>
          </div>
          <div className="glass-card rounded-xl p-5 text-center border border-[#C9A84C]/15">
            <div className="text-2xl font-black text-[#C9A84C] font-mono">
              {registry !== null ? registry.paid : "—"}
            </div>
            <div className="text-[10px] text-[#F5F5F5]/35 uppercase tracking-[0.18em] mt-1">
              {lang === "es" ? "Vendidas" : "Sold"}
            </div>
          </div>
          <div className="glass-card rounded-xl p-5 text-center border border-[#4ADE80]/15">
            <div className="text-2xl font-black font-mono" style={{ color: "#4ADE80" }}>
              {registry !== null ? registry.available : "—"}
            </div>
            <div className="text-[10px] text-[#F5F5F5]/35 uppercase tracking-[0.18em] mt-1">
              {lang === "es" ? "Disponibles" : "Available"}
            </div>
          </div>
        </div>

        {/* ── PRODUCT + COPY ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-12">

          {/* Product card — static preview (full 3D on /founders) */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-xs">
              <div className="absolute inset-0 bg-[#C9A84C]/5 rounded-3xl blur-3xl scale-110 pointer-events-none" />
              <div className="relative rounded-2xl border border-[#C9A84C]/15 bg-[#0F0E09] flex flex-col items-center justify-center gap-6 py-12 px-10">
                <div className="relative w-36 h-36">
                  <Image
                    src="/harpia-fc.png"
                    alt="Harpia FC Founder Edition"
                    fill
                    sizes="144px"
                    className="object-contain"
                    style={{ filter: "drop-shadow(0 0 24px rgba(201,168,76,0.45))" }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-[#C9A84C]/55 uppercase mb-2">
                    {lang === "es" ? "Edición Fundadores" : "Founder Edition"}
                  </p>
                  <p className="text-4xl font-black text-[#C9A84C] font-mono tracking-wider">
                    {nextNumber}
                  </p>
                  <p className="text-[10px] text-[#F5F5F5]/20 mt-2 tracking-widest uppercase">
                    {lang === "es" ? "Próximo disponible" : "Next available"}
                  </p>
                </div>
                <div className="w-full border-t border-[#C9A84C]/10 pt-4">
                  <p className="text-center text-[10px] text-[#F5F5F5]/20 tracking-widest uppercase">
                    {lang === "es" ? "Vista 3D completa en reserva →" : "Full 3D view at reservation →"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Copy + features + CTAs */}
          <div>
            <div className="space-y-3 mb-8">
              <p className="text-2xl sm:text-3xl font-black text-[#F5F5F5] leading-tight">
                {t.mainCopy[0]}
              </p>
              <p className="text-base text-[#F5F5F5]/55 leading-relaxed">
                {t.mainCopy[1]}
              </p>
            </div>

            <ul className="space-y-2.5 mb-8">
              {t.features.slice(0, 5).map((feat, i) => (
                <li key={i} className="flex items-center gap-3">
                  <svg className="w-4 h-4 flex-shrink-0 text-[#C9A84C]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-[#F5F5F5]/60">{feat}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/founders"
                className="px-8 py-4 text-sm font-black tracking-widest uppercase bg-[#C9A84C] text-[#080808] rounded hover:bg-[#E8C96A] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] text-center"
              >
                {t.internalCta.button}
              </a>
              <a
                href="/founders/registry"
                className="px-8 py-4 text-sm font-bold tracking-widest uppercase border border-[#C9A84C]/50 text-[#C9A84C] rounded hover:bg-[#C9A84C]/10 transition-all duration-300 text-center"
              >
                {t.internalCta.secondaryButton}
              </a>
            </div>

            {/* Public note */}
            <p className="mt-5 text-xs text-[#F5F5F5]/25 tracking-wide">
              * {t.internalCta.disclaimer}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
