"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function CrestDisplay() {
  const crestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = crestRef.current;
    if (!el) return;

    let animFrame: number;
    let startTime: number | null = null;
    const duration = 10000; // 10 seconds per full rotation

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;
      const angle = progress * 360;

      // Create a realistic 3D perspective rotation
      const scale = 1 - 0.15 * Math.abs(Math.sin((angle * Math.PI) / 180));

      el.style.transform = `perspective(1200px) rotateY(${angle}deg) scale(${scale})`;

      // Adjust brightness for realistic lighting effect
      const brightness = 0.7 + 0.5 * Math.cos((angle * Math.PI) / 180);
      el.style.filter = `brightness(${brightness})`;

      animFrame = requestAnimationFrame(animate);
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-80 h-80 rounded-full border border-[#C9A84C]/10 animate-ping" style={{ animationDuration: "3s" }} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 rounded-full border border-[#C9A84C]/15" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 rounded-full border border-[#C9A84C]/10" />
      </div>

      {/* Glow background */}
      <div className="absolute w-72 h-72 rounded-full bg-[#C9A84C]/8 blur-[60px]" />
      <div className="absolute w-48 h-48 rounded-full bg-[#0AAFAA]/5 blur-[40px]" />

      {/* Floating platform */}
      <div className="crest-float relative z-10">
        {/* Shadow below crest */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-6 bg-[#C9A84C]/20 rounded-full blur-xl" />

        {/* Crest container */}
        <div
          ref={crestRef}
          className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Glow ring around crest */}
          <div className="absolute inset-0 rounded-full glow-pulse" />

          {/* Main crest image */}
          <div className="relative w-full h-full p-4">
            <Image
              src="/harpia-fc.png"
              alt="Harpia FC — Escudo oficial"
              fill
              priority
              sizes="(max-width: 640px) 224px, (max-width: 1024px) 256px, 288px"
              className="object-contain drop-shadow-2xl"
              style={{
                filter: "drop-shadow(0 0 20px rgba(201, 168, 76, 0.6))",
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom label */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center">
        <div className="text-xs font-bold tracking-[0.4em] text-[#C9A84C]/60 uppercase whitespace-nowrap">
          Est. 2025 · El Salvador
        </div>
      </div>
    </div>
  );
}
