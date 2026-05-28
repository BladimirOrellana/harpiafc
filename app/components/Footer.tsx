import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#080808] border-t border-[#C9A84C]/15 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-12 h-12">
                <Image
                  src="/harpia-fc.png"
                  alt="Harpia FC"
                  fill
                  sizes="48px"
                  className="object-contain"
                  style={{ filter: "drop-shadow(0 0 8px rgba(201,168,76,0.5))" }}
                />
              </div>
              <div>
                <div className="text-xl font-black tracking-widest text-[#C9A84C]">
                  HARPIA FC
                </div>
                <div className="text-xs text-[#F5F5F5]/30 tracking-wider">
                  El Salvador
                </div>
              </div>
            </div>
            <p className="text-sm text-[#F5F5F5]/40 leading-relaxed max-w-sm mb-6">
              Un club. Una comunidad. Un movimiento. El futuro del fútbol
              salvadoreño empieza desde cero.
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#0AAFAA]/10 border border-[#0AAFAA]/20 rounded-lg w-fit">
              <div className="w-1.5 h-1.5 bg-[#0AAFAA] rounded-full animate-pulse" />
              <span className="text-xs text-[#0AAFAA] font-semibold tracking-wider">
                Impulsado por PasalaPro
              </span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#F5F5F5]/30 mb-5">
              Navegación
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Inicio", href: "#" },
                { label: "Misión", href: "#mision" },
                { label: "Edición Fundadores", href: "#fundadores" },
                { label: "PasalaPro", href: "#pasalapro" },
                { label: "Patrocinadores", href: "#patrocinadores" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-[#F5F5F5]/50 hover:text-[#C9A84C] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#F5F5F5]/30 mb-5">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hola@harpiafc.com"
                  className="text-sm text-[#F5F5F5]/50 hover:text-[#C9A84C] transition-colors"
                >
                  hola@harpiafc.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:patrocinios@harpiafc.com"
                  className="text-sm text-[#F5F5F5]/50 hover:text-[#C9A84C] transition-colors"
                >
                  patrocinios@harpiafc.com
                </a>
              </li>
              <li className="text-sm text-[#F5F5F5]/30">El Salvador, C.A.</li>
            </ul>

            {/* Social placeholders */}
            <div className="flex gap-3 mt-6">
              {["instagram", "twitter", "tiktok"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 rounded-full border border-[#F5F5F5]/10 flex items-center justify-center text-[#F5F5F5]/30 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-all duration-300"
                  aria-label={social}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    {social === "instagram" && (
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    )}
                    {social === "twitter" && (
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    )}
                    {social === "tiktok" && (
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.28 8.28 0 004.83 1.53V6.77a4.84 4.84 0 01-1.06-.08z" />
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="section-divider mb-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#F5F5F5]/20 tracking-wide">
            © {currentYear} Harpia FC. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2 text-xs text-[#F5F5F5]/20">
            <span>Tecnología by</span>
            <span className="text-[#0AAFAA] font-bold tracking-wider">
              PasalaPro
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
