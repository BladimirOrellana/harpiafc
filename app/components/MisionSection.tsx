"use client";

import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

const pillarIcons = [
  <svg key="vis" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>,
  <svg key="eco" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>,
  <svg key="com" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
  </svg>,
  <svg key="leg" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>,
];

export default function MisionSection() {
  const { lang } = useLanguage();
  const t = translations[lang].mision;

  return (
    <section id="mision" className="relative py-24 sm:py-32 bg-[#080808]">
      <div className="section-divider mb-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-[#0AAFAA] mb-4">
            {t.tag}
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#F5F5F5] mb-6">
            {t.headlineA}{" "}
            <span className="text-[#C9A84C]">{t.headlineB}</span>
          </h2>
          <p className="text-lg sm:text-xl text-[#F5F5F5]/50 max-w-3xl mx-auto leading-relaxed">
            {t.body}
          </p>
        </div>

        {/* Mission statement */}
        <div className="relative mb-20 glass-card rounded-2xl p-8 sm:p-12 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 gold-gradient" />
          <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#F5F5F5]/90 leading-relaxed italic">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <div className="mt-6 text-[#C9A84C] text-sm font-semibold tracking-widest uppercase">
            {t.quoteAttrib}
          </div>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.pillars.map((pillar, i) => (
            <div
              key={i}
              className="glass-card rounded-xl p-6 hover:border-[#C9A84C]/50 transition-all duration-300 group hover:bg-[#C9A84C]/5"
            >
              <div className="text-[#C9A84C] mb-4 group-hover:scale-110 transition-transform duration-300 w-fit">
                {pillarIcons[i]}
              </div>
              <h3 className="text-lg font-bold text-[#F5F5F5] mb-3">{pillar.title}</h3>
              <p className="text-sm text-[#F5F5F5]/50 leading-relaxed">{pillar.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
