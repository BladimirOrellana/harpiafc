"use client";

import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

const tierColors = [
  { color: "#C9A84C", colorBg: "rgba(201,168,76,0.08)", colorBorder: "rgba(201,168,76,0.3)" },
  { color: "#C0C0C0", colorBg: "rgba(192,192,192,0.06)", colorBorder: "rgba(192,192,192,0.2)" },
  { color: "#0AAFAA", colorBg: "rgba(10,175,170,0.06)", colorBorder: "rgba(10,175,170,0.2)" },
];

export default function PatrocinadoresSection() {
  const { lang } = useLanguage();
  const t = translations[lang].patrocinadores;

  return (
    <section id="patrocinadores" className="relative py-24 sm:py-32 bg-[#0D0D0D]">
      <div className="section-divider mb-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-[#C9A84C] mb-4">
            {t.tag}
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#F5F5F5] mb-6">
            {t.headlineA}{" "}
            <span className="text-[#C9A84C]">{t.headlineB}</span>{" "}
            {t.headlineC}
          </h2>
          <p className="text-lg text-[#F5F5F5]/50 max-w-3xl mx-auto leading-relaxed">
            {t.body}
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {t.tiers.map((tier, i) => {
            const colors = tierColors[i];
            return (
              <div
                key={i}
                className="rounded-2xl p-8 transition-all duration-300 hover:scale-105 relative overflow-hidden"
                style={{
                  background: colors.colorBg,
                  border: `1px solid ${colors.colorBorder}`,
                  backdropFilter: "blur(12px)",
                }}
              >
                {i === 0 && (
                  <div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${colors.color}, transparent)`,
                    }}
                  />
                )}

                <div
                  className="text-sm font-bold tracking-widest uppercase mb-2"
                  style={{ color: colors.color }}
                >
                  {tier.name}
                </div>

                <ul className="mt-6 space-y-3">
                  {tier.perks.map((perk, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <svg
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: colors.color }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-[#F5F5F5]/70">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-[#F5F5F5]/40 text-sm mb-6 tracking-wide">{t.note}</p>
          <a
            href="#cta"
            className="inline-flex items-center gap-3 px-10 py-5 text-base font-bold tracking-widest uppercase border border-[#C9A84C]/60 text-[#C9A84C] rounded hover:bg-[#C9A84C]/10 transition-all duration-300 hover:border-[#C9A84C] group"
          >
            <svg
              className="w-5 h-5 group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            {t.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
