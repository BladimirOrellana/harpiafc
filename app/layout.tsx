import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://harpiafc.com"),
  title: "Harpia FC — Un Club. Una Comunidad. Un Movimiento.",
  description:
    "Harpia FC es un movimiento de fútbol salvadoreño moderno impulsado por PasalaPro. Únete a la Edición Fundadores — limitada a 1,000 jerseys.",
  keywords: [
    "Harpia FC",
    "fútbol salvadoreño",
    "PasalaPro",
    "Edición Fundadores",
    "fútbol El Salvador",
    "club de fútbol",
  ],
  openGraph: {
    title: "Harpia FC — Un Club. Una Comunidad. Un Movimiento.",
    description:
      "Sé parte del nacimiento de Harpia FC. El futuro del fútbol salvadoreño empieza desde cero.",
    type: "website",
    locale: "es_SV",
    images: [
      {
        url: "/harpia-fc.png",
        width: 1200,
        height: 630,
        alt: "Harpia FC Crest",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Harpia FC — Un Club. Una Comunidad. Un Movimiento.",
    description:
      "Sé parte del nacimiento de Harpia FC. El futuro del fútbol salvadoreño empieza desde cero.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#080808] text-[#F5F5F5]">
        {children}
      </body>
    </html>
  );
}
