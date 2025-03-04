import QueryClientProvider from "@/components/QueryClientProvider";
import type { Metadata } from "next";
import { Cabin, Labrada } from "next/font/google";
import { ReactNode } from "react";

import "./global.css";

const fontSerif = Labrada({
  variable: "--font-serif",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const fontSans = Cabin({
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
      className={`${fontSerif.variable} ${fontSans.variable} antialiased text-gray-800`}
    >
      <body>
        <div style={{ filter: "url(#filmgrain)", mixBlendMode: "hard-light" }}>
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
