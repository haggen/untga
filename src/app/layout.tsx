import QueryClientProvider from "@/components/QueryClientProvider";
import type { Metadata } from "next";
import { Eczar, Rosario } from "next/font/google";
import { ReactNode } from "react";

import "./global.css";

// Eczar
// Grenze
// Labrada
const fontSerif = Eczar({
  variable: "--font-serif",
  weight: ["400", "700"],
  subsets: ["latin"],
});

// Cabin
// Rambla
// Rosario
// Signika
// Alegreya_Sans
// Anek_Latin
// Livvic
const fontSans = Rosario({
  variable: "--font-sans",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Untga",
  description: "A text-based browser RPG.",
};

type Props = Readonly<{
  children: ReactNode;
}>;

export default function Layout({ children }: Props) {
  return (
    <html
      lang="en"
      className={`${fontSerif.variable} ${fontSans.variable} antialiased text-neutral-900 inner-glow inner-glow-18 inner-glow-orange-900/50`}
    >
      <body>
        <div className="filter-[url(#filmgrain)] mix-blend-hard-light">
          <QueryClientProvider>{children}</QueryClientProvider>
        </div>

        <svg xmlns="http://www.w3.org/2000/svg" height="0" width="0">
          <defs>
            <filter id="filmgrain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="1"
                numOctaves="2"
                stitchTiles="stitch"
              />
              <feDisplacementMap in="SourceGraphic" scale="1.5" />
            </filter>
          </defs>
        </svg>
      </body>
    </html>
  );
}
