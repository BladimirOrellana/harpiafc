export default function PasalaProSection() {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: "Jugadores",
      desc: "Perfil digital, estadísticas y visibilidad ante reclutadores y clubes.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Equipos",
      desc: "Gestión de plantel, calendarios, resultados y comunicación centralizada.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Patrocinadores",
      desc: "Conexión directa con clubes y jugadores con métricas de impacto real.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Comunidad",
      desc: "Fans, creadores y seguidores conectados al ecosistema del club.",
    },
  ];

  return (
    <section id="pasalapro" className="relative py-24 sm:py-32 bg-[#080808]">
      <div className="section-divider mb-0" />

      {/* Teal accent bg */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#0AAFAA]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top badge */}
        <div className="text-center mb-20">
          <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-[#0AAFAA] mb-4">
            Patrocinador Oficial
          </span>

          {/* PasalaPro brand */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px flex-1 max-w-24 bg-[#0AAFAA]/30" />
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black">
              <span className="text-[#F5F5F5]">Pasala</span>
              <span className="text-[#0AAFAA]">Pro</span>
            </h2>
            <div className="h-px flex-1 max-w-24 bg-[#0AAFAA]/30" />
          </div>

          <p className="text-lg sm:text-xl text-[#F5F5F5]/50 max-w-3xl mx-auto leading-relaxed">
            PasalaPro es la plataforma tecnológica oficial detrás de Harpia FC.
            El motor que conecta el fútbol con el mundo moderno.
          </p>
        </div>

        {/* Main card */}
        <div className="relative glass-card rounded-3xl overflow-hidden mb-16 border border-[#0AAFAA]/20">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0AAFAA] to-transparent" />

          <div className="p-8 sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl sm:text-4xl font-black text-[#F5F5F5] mb-6 leading-tight">
                  La tecnología que{" "}
                  <span className="text-[#0AAFAA]">mueve el fútbol</span>{" "}
                  salvadoreño
                </h3>
                <p className="text-[#F5F5F5]/60 leading-relaxed mb-6 text-lg">
                  PasalaPro no es solo un patrocinador. Es el sistema operativo
                  de Harpia FC. Conecta a cada jugador, equipo, patrocinador y
                  fan en un ecosistema digital pensado para el fútbol
                  latinoamericano.
                </p>
                <p className="text-[#F5F5F5]/60 leading-relaxed">
                  Gracias a PasalaPro, Harpia FC puede descubrir talentos,
                  gestionar oportunidades y crear una comunidad real alrededor
                  del fútbol salvadoreño — desde el primer día.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "1", label: "Plataforma unificada" },
                  { value: "4", label: "Tipos de usuarios" },
                  { value: "∞", label: "Conexiones posibles" },
                  { value: "SV", label: "Hecho para El Salvador" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-[#0AAFAA]/8 border border-[#0AAFAA]/20 rounded-xl p-6 text-center hover:border-[#0AAFAA]/50 transition-colors"
                  >
                    <div className="text-4xl font-black text-[#0AAFAA] mb-2">
                      {stat.value}
                    </div>
                    <div className="text-xs text-[#F5F5F5]/40 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="glass-card rounded-xl p-6 border border-[#0AAFAA]/15 hover:border-[#0AAFAA]/40 transition-all duration-300 group"
            >
              <div className="text-[#0AAFAA] mb-4 group-hover:scale-110 transition-transform duration-300 w-fit">
                {feature.icon}
              </div>
              <h4 className="font-bold text-[#F5F5F5] mb-2">{feature.title}</h4>
              <p className="text-sm text-[#F5F5F5]/40 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
