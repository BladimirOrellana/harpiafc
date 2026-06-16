"use client";

import CrestDisplay from "./CrestDisplay";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

export default function HeroSection() {
  const { lang } = useLanguage();
  const t = translations[lang].hero;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#080808] pt-16">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#C9A84C]/5 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#0AAFAA]/4 rounded-full blur-[110px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 mb-8">
              <div className="w-2 h-2 bg-[#0AAFAA] rounded-full animate-pulse" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9A84C]">
                {t.tag}
              </span>
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-4">
              <span className="shimmer-text">Harpia FC</span>
            </h1>

            <p className="text-xl sm:text-2xl font-light text-[#F5F5F5]/80 mb-6 tracking-wide">
              {t.subheadline}
            </p>

            <p className="text-base sm:text-lg text-[#F5F5F5]/50 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              {t.body}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="/founders"
                className="px-8 py-4 text-base font-bold tracking-widest uppercase bg-[#C9A84C] text-[#080808] rounded hover:bg-[#E8C96A] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] text-center"
              >
                {t.cta1}
              </a>
              <a
                href="/founders/registry"
                className="px-8 py-4 text-base font-bold tracking-widest uppercase border border-[#C9A84C]/60 text-[#C9A84C] rounded hover:bg-[#C9A84C]/10 transition-all duration-300 text-center"
              >
                {t.cta2}
              </a>
            </div>
          </div>

          {/* Crest */}
          <div className="order-1 lg:order-2 flex justify-center">
            <CrestDisplay />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-[#F5F5F5]/30 tracking-widest uppercase">Scroll</span>
        <svg className="w-4 h-4 text-[#C9A84C]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
