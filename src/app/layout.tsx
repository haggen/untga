import QueryClientProvider from "@/components/QueryClientProvider";
import type { Metadata } from "next";
import { Cabin, Macondo } from "next/font/google";
import Link from "next/link";
import { ReactNode } from "react";

import "./global.css";

// Other fonts I liked: Eczar, Grenze_Gotisch, Labrada
const fontSerif = Macondo({
  variable: "--font-serif",
  weight: ["400"],
  subsets: ["latin"],
});

// Other fonts I liked: Cabin, Rambla, Rosario,
// Signika, Alegreya_Sans, Anek_Latin, Livvic
const fontSans = Cabin({
  variable: "--font-sans",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Untga",
  description: "A text-based browser MMORPG.",
};

type Props = Readonly<{
  children: ReactNode;
}>;

export default function Layout({ children }: Props) {
  return (
    <html
      lang="en"
      className={`${fontSerif.variable} ${fontSans.variable} antialiased text-stone-100 bg-stone-900`}
    >
      <body>
        <QueryClientProvider>
          <div className="flex flex-col mx-auto max-w-md min-h-dvh px-2 pb-2 filter-[url(#grain)]">
            <header className="flex items-center justify-between px-3 h-9">
              <h1 className="font-bold">
                <Link href="/">✠ Untga</Link>
              </h1>
              <p className="text-sm">
                &copy; 2025 Untga contributors. Source on{" "}
                <a href="https://github.com/haggen/untga" className="font-bold">
                  GitHub
                </a>
                .
              </p>
            </header>

            <div className="grow flex flex-col px-3 py-12 text-stone-800 rounded bg-stone-200 bg-[url(/concrete.png),url(/halftone.png)] bg-blend-multiply">
              {children}
            </div>
          </div>
        </QueryClientProvider>

        <svg xmlns="http://www.w3.org/2000/svg" height="0" width="0">
          <defs>
            <filter id="grain">
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
