import Image from "next/image";

export default function CtaSection() {
  return (
    <section id="cta" className="relative py-24 sm:py-32 bg-[#080808] overflow-hidden">
      <div className="section-divider mb-0" />

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#C9A84C]/6 rounded-full blur-[150px]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(circle, #C9A84C 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Crest */}
        <div className="flex justify-center mb-10">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28">
            <div className="absolute inset-0 bg-[#C9A84C]/20 rounded-full blur-2xl" />
            <Image
              src="/harpia-fc.png"
              alt="Harpia FC"
              fill
              sizes="(max-width: 640px) 96px, 112px"
              className="object-contain relative z-10"
              style={{ filter: "drop-shadow(0 0 16px rgba(201,168,76,0.7))" }}
            />
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#F5F5F5] mb-6 leading-tight">
          Sé parte del{" "}
          <span className="shimmer-text">nacimiento</span>
          <br />
          de Harpia FC
        </h2>

        <p className="text-lg sm:text-xl text-[#F5F5F5]/50 mb-4 max-w-2xl mx-auto leading-relaxed">
          El futuro del fútbol salvadoreño empieza desde cero. Los primeros
          1,000 son los que escriben la historia.
        </p>

        <p className="text-base text-[#F5F5F5]/40 mb-12 max-w-xl mx-auto">
          &ldquo;De la comunidad para la cancha.&rdquo;
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a
            href="https://pasalapro.com/shops/harpia"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-5 text-base font-black tracking-widest uppercase bg-[#C9A84C] text-[#080808] rounded hover:bg-[#E8C96A] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(201,168,76,0.6)]"
          >
            Reservar mi Edición Fundadores
          </a>
          <a
            href="mailto:info@pasalapro.com?subject=Harpia%20FC%20-%20Contacto"
            className="px-10 py-5 text-base font-bold tracking-widest uppercase border border-[#F5F5F5]/20 text-[#F5F5F5]/70 rounded hover:border-[#F5F5F5]/50 hover:text-[#F5F5F5] transition-all duration-300"
          >
            Contactar al equipo
          </a>
        </div>

        {/* Counter display */}
        <div className="inline-flex items-center gap-6 px-8 py-5 glass-card rounded-2xl border border-[#C9A84C]/25">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-[#C9A84C]">
              1,000
            </div>
            <div className="text-xs text-[#F5F5F5]/30 uppercase tracking-widest mt-1">
              Jerseys totales
            </div>
          </div>
          <div className="w-px h-12 bg-[#C9A84C]/20" />
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-[#F5F5F5]">
              0003
            </div>
            <div className="text-xs text-[#F5F5F5]/30 uppercase tracking-widest mt-1">
              Desde aquí
            </div>
          </div>
          <div className="w-px h-12 bg-[#C9A84C]/20" />
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-[#0AAFAA]">
              ∞
            </div>
            <div className="text-xs text-[#F5F5F5]/30 uppercase tracking-widest mt-1">
              Impacto
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
