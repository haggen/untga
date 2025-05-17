import type { Metadata } from "next";
import { Cabin, Macondo } from "next/font/google";
import Link from "next/link";
import { ReactNode } from "react";

import "./global.css";

// Fonts I liked: Eczar, Macondo, Grenze_Gotisch, Labrada.
const fontSerif = Macondo({
  variable: "--font-serif",
  weight: ["400"],
  subsets: ["latin"],
});

// Fonts I liked: Cabin, Rambla, Rosario, Signika, Alegreya_Sans, Anek_Latin, Livvic.
const fontSans = Cabin({
  variable: "--font-sans",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s at Untga",
    default: "Untga",
  },
  description: "An open-source text-based browser MMORPG.",
};

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSerif.variable} ${fontSans.variable} antialiased text-foreground bg-background`}
    >
      <body>
        <div className="flex flex-col max-w-md mx-auto min-h-dvh">
          <header className="flex items-center justify-between px-2 basis-10 sticky top-0 text-foreground-inverted bg-background">
            <h1 className="font-bold">
              <Link href="/">✠ Untga</Link>
            </h1>
            <p className="text-sm">
              &copy; 2025 Untga contributors.{" "}
              <a
                href="https://github.com/haggen/untga/discussions"
                className="font-bold"
              >
                Need help?
              </a>
            </p>
          </header>

          {children}
        </div>
      </body>
    </html>
  );
}
