import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const spaceGrotesk = localFont({
  src: [{ path: "../fonts/Space_Grotesk/SpaceGrotesk-VariableFont_wght.ttf", weight: "300 700" }],
  variable: "--font-sg",
  display: "swap",
});

const crimsonText = localFont({
  src: [
    { path: "../fonts/Crimson_Text/CrimsonText-Regular.ttf",          weight: "400", style: "normal" },
    { path: "../fonts/Crimson_Text/CrimsonText-Italic.ttf",           weight: "400", style: "italic" },
    { path: "../fonts/Crimson_Text/CrimsonText-SemiBold.ttf",         weight: "600", style: "normal" },
    { path: "../fonts/Crimson_Text/CrimsonText-SemiBoldItalic.ttf",   weight: "600", style: "italic" },
    { path: "../fonts/Crimson_Text/CrimsonText-Bold.ttf",             weight: "700", style: "normal" },
    { path: "../fonts/Crimson_Text/CrimsonText-BoldItalic.ttf",       weight: "700", style: "italic" },
  ],
  variable: "--font-ct",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brick Community — Compra, vende e intercambia LEGO en México",
  description:
    "Toma una foto de tus minifiguras o sets de LEGO y publícalos en segundos. Vende, intercambia o crea tu lista de deseos. Validando la idea en México.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${crimsonText.variable}`}>
      <body>{children}</body>
    </html>
  );
}
