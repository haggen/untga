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
      className={`${fontSerif.variable} ${fontSans.variable} antialiased text-stone-800`}
    >
      <body>
        <QueryClientProvider>{children}</QueryClientProvider>

        <svg xmlns="http://www.w3.org/2000/svg" height="0" width="0">
          <defs>
            <filter id="distorted">
              <feTurbulence
                type="fractalNoise"
                id="turbulence"
                baseFrequency="0.5"
                numOctaves="2"
              />
              <feDisplacementMap
                id="displacement"
                in="SourceGraphic"
                scale="2"
              />
            </filter>
          </defs>
        </svg>
      </body>
    </html>
  );
}
