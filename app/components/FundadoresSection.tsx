"use client";

import Jersey3DViewer from "./Jersey3DViewer";

export default function FundadoresSection() {
  const features = [
    { label: "Producción total", value: "1,000 piezas" },
    { label: "Ventas públicas desde", value: "No. 0003/1000" },
    { label: "Diseño", value: "Exclusivo" },
    { label: "Disponibilidad", value: "Única vez" },
  ];

  const reserved = [
    {
      number: "0001",
      owner: "Ricky",
      desc: "El visionario detrás del movimiento. La pieza que inició todo.",
      color: "#C9A84C",
    },
    {
      number: "0002",
      owner: "PasalaPro",
      desc: "El motor tecnológico oficial de Harpia FC. Patrocinador fundador.",
      color: "#0AAFAA",
    },
  ];

  return (
    <section id="fundadores" className="relative py-24 sm:py-32 bg-[#0D0D0D]">
      <div className="section-divider mb-0" />

      {/* Background accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A84C]/4 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-[#C9A84C] mb-4">
            Colección Exclusiva
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#F5F5F5] mb-4">
            Edición Fundadores
          </h2>
          <div className="inline-block px-6 py-2 border border-[#C9A84C]/50 rounded-full mb-6">
            <span className="text-[#C9A84C] font-bold tracking-widest text-sm uppercase">
              Solo existirán 1,000 jerseys
            </span>
          </div>
          <p className="text-lg text-[#F5F5F5]/50 max-w-2xl mx-auto leading-relaxed">
            No es solo un jersey. Es tu lugar en la historia. Cada pieza
            financia la primera etapa de Harpia FC y te convierte en parte
            del movimiento desde el día cero.
          </p>
        </div>

        {/* Reserved pieces */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#F5F5F5]/30">
              Las primeras dos piezas han sido reservadas para el inicio del movimiento
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {reserved.map((item) => (
              <div
                key={item.number}
                className="relative glass-card rounded-2xl p-6 overflow-hidden"
                style={{ borderColor: `${item.color}30` }}
              >
                <div
                  className="absolute top-0 left-0 w-full h-0.5"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`,
                  }}
                />
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center font-black text-lg tracking-tight"
                    style={{
                      background: `${item.color}12`,
                      border: `1px solid ${item.color}30`,
                      color: item.color,
                    }}
                  >
                    {item.number}
                  </div>
                  <div>
                    <div
                      className="text-xs uppercase tracking-[0.2em] mb-1"
                      style={{ color: item.color }}
                    >
                      Reservada
                    </div>
                    <div className="font-black text-[#F5F5F5] text-lg mb-1">
                      {item.owner}
                    </div>
                    <p className="text-xs text-[#F5F5F5]/40 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-2 mt-6 mb-2">
            <div className="w-px h-8 bg-gradient-to-b from-[#C9A84C]/30 to-transparent" />
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30">
              <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-pulse" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C9A84C]">
                Las ventas públicas comienzan desde la pieza No. 0003
              </span>
              <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* 3D viewer + info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* 3D Jersey */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Ambient glow behind viewer */}
              <div className="absolute inset-0 bg-[#C9A84C]/8 rounded-3xl blur-3xl scale-110 pointer-events-none" />

              {/* 3D Canvas container — explicit dark bg prevents white flash */}
              <div className="relative rounded-2xl overflow-hidden border border-[#C9A84C]/20 bg-[#111111]"
                style={{ height: "520px" }}
              >
                <Jersey3DViewer />
              </div>

              {/* Edition badge below viewer */}
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-3 px-5 py-3 bg-[#C9A84C]/10 rounded-full border border-[#C9A84C]/30">
                  <div className="w-2 h-2 bg-[#C9A84C] rounded-full" />
                  <span className="text-sm font-bold text-[#C9A84C] tracking-widest">
                    No. 0003 / 1000
                  </span>
                  <div className="w-2 h-2 bg-[#C9A84C] rounded-full" />
                </div>
                <p className="text-xs text-[#F5F5F5]/25 mt-2 tracking-wide">
                  Tu pieza empieza aquí
                </p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-3xl sm:text-4xl font-black text-[#F5F5F5] mb-6">
              Sé parte del{" "}
              <span className="text-[#C9A84C]">nacimiento</span> de Harpia FC
            </h3>

            <p className="text-[#F5F5F5]/60 leading-relaxed mb-4 text-lg">
              Cada jersey de la Edición Fundadores es numerado, único y
              coleccionable. Los primeros 1,000 en unirse construyen la base
              del club y llevan su número en la historia del movimiento.
            </p>

            <p className="text-[#F5F5F5]/40 leading-relaxed mb-8 text-base">
              Las piezas No. 0001 y No. 0002 pertenecen a los creadores del
              movimiento. Las tuyas empiezan desde la No. 0003 — y una vez
              agotadas las 1,000, no habrá más.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="glass-card rounded-xl p-4 border border-[#C9A84C]/15"
                >
                  <div className="text-[#F5F5F5]/40 text-xs uppercase tracking-wider mb-1">
                    {f.label}
                  </div>
                  <div className="text-[#C9A84C] font-bold text-sm">
                    {f.value}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="#cta"
              className="inline-block px-8 py-4 text-base font-bold tracking-widest uppercase bg-[#C9A84C] text-[#080808] rounded hover:bg-[#E8C96A] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(201,168,76,0.5)]"
            >
              Reservar mi Edición Fundadores
            </a>

            <p className="mt-4 text-xs text-[#F5F5F5]/30 tracking-wide">
              * Solo existirán 1,000 jerseys de la Edición Fundadores. Sin
              reimpresión. Sin excepciones.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
