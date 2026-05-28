"use client";

import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Misión", href: "#mision" },
    { label: "Fundadores", href: "#fundadores" },
    { label: "PasalaPro", href: "#pasalapro" },
    { label: "Patrocinadores", href: "#patrocinadores" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/90 backdrop-blur-md border-b border-[#C9A84C]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <Image
                src="/harpia-fc.png"
                alt="Harpia FC"
                fill
                priority
                sizes="40px"
                className="object-contain"
              />
            </div>
            <span className="font-black text-lg tracking-widest text-[#C9A84C] group-hover:text-[#E8C96A] transition-colors">
              HARPIA FC
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#F5F5F5]/70 hover:text-[#C9A84C] transition-colors tracking-wider uppercase"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#fundadores"
              className="px-5 py-2 text-sm font-bold tracking-wider uppercase bg-[#C9A84C] text-[#080808] rounded hover:bg-[#E8C96A] transition-colors"
            >
              Edición Fundadores
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-[#F5F5F5] p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#C9A84C]/20 py-4 flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-[#F5F5F5]/70 hover:text-[#C9A84C] transition-colors tracking-wider uppercase px-2"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#fundadores"
              onClick={() => setMenuOpen(false)}
              className="mx-2 px-5 py-2 text-sm font-bold tracking-wider uppercase bg-[#C9A84C] text-[#080808] rounded hover:bg-[#E8C96A] transition-colors text-center"
            >
              Edición Fundadores
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
