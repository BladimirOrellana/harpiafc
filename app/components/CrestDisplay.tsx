import Image from "next/image";

// Server component — uses only CSS animation, no RAF/JS loop.
export default function CrestDisplay() {
  return (
    <div className="relative flex items-center justify-center">
      <style>{`
        @keyframes crestRotateY {
          from { transform: perspective(1100px) rotateY(0deg); }
          to   { transform: perspective(1100px) rotateY(360deg); }
        }
      `}</style>

      {/* Ambient glow */}
      <div className="absolute w-64 h-64 rounded-full bg-[#C9A84C]/8 blur-[60px] pointer-events-none" />

      {/* Subtle orbit ring */}
      <div className="absolute w-72 h-72 rounded-full border border-[#C9A84C]/10 pointer-events-none" />

      {/* Crest */}
      <div className="crest-float relative z-10">
        {/* Ground shadow */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-36 h-4 bg-[#C9A84C]/15 rounded-full blur-lg" />

        <div
          className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72"
          style={{
            animation: "crestRotateY 14s linear infinite",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="absolute inset-0 rounded-full glow-pulse" />
          <div className="relative w-full h-full p-4">
            <Image
              src="/harpia-fc.png"
              alt="Harpia FC — Escudo oficial"
              fill
              priority
              sizes="(max-width: 640px) 224px, (max-width: 1024px) 256px, 288px"
              className="object-contain"
              style={{ filter: "drop-shadow(0 0 20px rgba(201, 168, 76, 0.6))" }}
            />
          </div>
        </div>
      </div>

      {/* Est. label */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center">
        <div className="text-xs font-bold tracking-[0.4em] text-[#C9A84C]/50 uppercase whitespace-nowrap">
          Est. 2025 · El Salvador
        </div>
      </div>
    </div>
  );
}
