"use client";

import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

export default function CtaSection() {
  const { lang } = useLanguage();
  const t = translations[lang].cta;

  return (
    <section id="cta" className="relative py-20 sm:py-28 bg-[#080808] overflow-hidden">
      <div className="section-divider mb-0" />

      {/* Minimal ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C9A84C]/4 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F5F5F5] mb-5 leading-tight">
          {t.headlineA}{" "}
          <span className="shimmer-text">{t.headlineB}</span>
          {" "}{t.headlineC}
        </h2>

        <p className="text-base text-[#F5F5F5]/35 mb-10 max-w-xl mx-auto leading-relaxed">
          &ldquo;{t.quote}&rdquo;
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/founders"
            className="px-10 py-4 text-sm font-black tracking-widest uppercase bg-[#C9A84C] text-[#080808] rounded hover:bg-[#E8C96A] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(201,168,76,0.5)]"
          >
            {t.btnReserve}
          </a>
          <a
            href="/founders/registry"
            className="px-10 py-4 text-sm font-bold tracking-widest uppercase border border-[#C9A84C]/40 text-[#C9A84C]/80 rounded hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300"
          >
            {t.btnContact}
          </a>
        </div>

      </div>
    </section>
  );
}
