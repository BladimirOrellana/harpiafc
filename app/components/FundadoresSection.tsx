"use client";

import Jersey3DViewer from "./Jersey3DViewer";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

export default function FundadoresSection() {
  const { lang } = useLanguage();
  const t = translations[lang].fundadores;

  return (
    <section id="fundadores" className="relative py-24 sm:py-32 bg-[#0D0D0D]">
      <div className="section-divider mb-0" />

      {/* Background accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A84C]/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C9A84C]/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── HEADER ── */}
        <div className="text-center mb-20">
          <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-[#C9A84C] mb-4">
            {t.sectionLabel}
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#F5F5F5] mb-4">
            {t.title}
          </h2>
          <div className="inline-block px-6 py-2 border border-[#C9A84C]/50 rounded-full mb-6">
            <span className="text-[#C9A84C] font-bold tracking-widest text-sm uppercase">
              {t.subtitle}
            </span>
          </div>
        </div>

        {/* ── 3D VIEWER + MAIN COPY ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          {/* 3D Jersey */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-0 bg-[#C9A84C]/8 rounded-3xl blur-3xl scale-110 pointer-events-none" />
              <div
                className="relative rounded-2xl overflow-hidden border border-[#C9A84C]/20 bg-[#111111]"
                style={{ height: "520px" }}
              >
                <Jersey3DViewer />
              </div>
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-3 px-5 py-3 bg-[#C9A84C]/10 rounded-full border border-[#C9A84C]/30">
                  <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-pulse" />
                  <span className="text-sm font-bold text-[#C9A84C] tracking-widest">
                    No. 0031 / 1000
                  </span>
                  <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Main copy */}
          <div>
            <div className="space-y-4 mb-8">
              {t.mainCopy.map((para, i) => (
                <p
                  key={i}
                  className={`leading-relaxed ${
                    i === 0
                      ? "text-2xl sm:text-3xl font-black text-[#F5F5F5]"
                      : i === 1
                      ? "text-lg text-[#F5F5F5]/80"
                      : "text-base text-[#F5F5F5]/55"
                  }`}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Features list */}
            <ul className="space-y-2 mb-8">
              {t.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-3">
                  <svg className="w-4 h-4 flex-shrink-0 text-[#C9A84C]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-[#F5F5F5]/65">{feat}</span>
                </li>
              ))}
            </ul>

            <a
              href="https://pasalapro.com/shops/harpia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 text-base font-bold tracking-widest uppercase bg-[#C9A84C] text-[#080808] rounded hover:bg-[#E8C96A] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(201,168,76,0.5)]"
            >
              {t.internalCta.button}
            </a>
          </div>
        </div>

        {/* ── SCARCITY SECTION ── */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-black text-[#F5F5F5] mb-3">
              {t.scarcity.title}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {t.scarcity.reservations.map((item) => (
              <div
                key={item.number}
                className="relative glass-card rounded-2xl p-6 overflow-hidden"
                style={{ borderColor: `${item.color}30` }}
              >
                <div
                  className="absolute top-0 left-0 w-full h-0.5"
                  style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
                />
                <div
                  className="text-2xl font-black mb-1 font-mono"
                  style={{ color: item.color }}
                >
                  {item.number}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="font-bold text-[#F5F5F5] text-sm">{item.owner}</div>
                  {"pulse" in item && item.pulse && (
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: item.color }} />
                  )}
                </div>
                <p className="text-xs text-[#F5F5F5]/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3">
            {t.scarcity.statements.map((stmt, i) => (
              <p key={i} className="text-sm text-[#F5F5F5]/40 text-center max-w-xl">
                {i === 0 ? `* ${stmt}` : `** ${stmt}`}
              </p>
            ))}
          </div>
        </div>

        {/* ── CERTIFICATE + REGISTRY + MARKETPLACE ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {/* Certificate */}
          <div className="glass-card rounded-2xl p-8 border border-[#C9A84C]/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 gold-gradient" />
            <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center mb-5">
              <svg className="w-5 h-5 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h4 className="text-lg font-black text-[#F5F5F5] mb-4">{t.certificate.title}</h4>
            <ul className="space-y-3">
              {t.certificate.body.map((line, i) => (
                <li key={i} className="text-sm text-[#F5F5F5]/50 leading-relaxed">{line}</li>
              ))}
            </ul>
          </div>

          {/* Registry */}
          <div className="glass-card rounded-2xl p-8 border border-[#C9A84C]/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 gold-gradient" />
            <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center mb-5">
              <svg className="w-5 h-5 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h4 className="text-lg font-black text-[#F5F5F5] mb-4">{t.registry.title}</h4>
            <ul className="space-y-3 mb-4">
              {t.registry.body.map((line, i) => (
                <li key={i} className="text-sm text-[#F5F5F5]/50 leading-relaxed">{line}</li>
              ))}
            </ul>
            <div className="pt-4 border-t border-[#F5F5F5]/5 space-y-2">
              {t.registry.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#C9A84C]" />
                  <span className="text-xs text-[#C9A84C]/80">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Marketplace */}
          <div className="glass-card rounded-2xl p-8 border border-[#C9A84C]/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 gold-gradient" />
            <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center mb-5">
              <svg className="w-5 h-5 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h4 className="text-lg font-black text-[#F5F5F5] mb-4">{t.marketplace.title}</h4>
            <ul className="space-y-3">
              {t.marketplace.body.map((line, i) => (
                <li key={i} className="text-sm text-[#F5F5F5]/50 leading-relaxed">{line}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── INTERNAL CTA BLOCK ── */}
        <div className="relative glass-card rounded-3xl p-8 sm:p-12 text-center overflow-hidden border border-[#C9A84C]/25">
          <div className="absolute top-0 left-0 w-full h-1 gold-gradient" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C9A84C]/4 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#F5F5F5] mb-4">
              {t.internalCta.headline}
            </h3>
            <p className="text-base sm:text-lg text-[#F5F5F5]/55 max-w-2xl mx-auto mb-8 leading-relaxed">
              {t.internalCta.body}
            </p>

            <a
              href="https://pasalapro.com/shops/harpia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-5 text-base font-black tracking-widest uppercase bg-[#C9A84C] text-[#080808] rounded hover:bg-[#E8C96A] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(201,168,76,0.6)] mb-6"
            >
              {t.internalCta.button}
            </a>

            <div className="flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/25">
                <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-pulse" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C9A84C]">
                  {t.internalCta.publicNote}
                </span>
                <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-pulse" />
              </div>
              <p className="text-xs text-[#F5F5F5]/25 tracking-wide mt-1">
                * {t.internalCta.disclaimer}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
