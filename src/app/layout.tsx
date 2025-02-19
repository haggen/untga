import Providers from "@/components/Providers";
import type { Metadata } from "next";
import { Cabin, Coustard } from "next/font/google";
import { ReactNode } from "react";
import "./global.css";

const fontSerif = Coustard({
  variable: "--font-serif",
  weight: ["400", "900"],
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

// const style = { filter: "url(#noise)" };
const style = {};

export default function Layout({ children }: Props) {
  return (
    <html
      lang="en"
      className={`${fontSerif.variable} ${fontSans.variable} antialiased`}
    >
      <body>
        <svg xmlns="http://www.w3.org/2000/svg" height="0" width="0">
          <defs>
            <filter id="noise">
              <feTurbulence
                type="fractalNoise"
                id="turbulence"
                baseFrequency="1"
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

        <div style={style}>
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
