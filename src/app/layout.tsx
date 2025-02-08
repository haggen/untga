import type { Metadata } from "next";
import { Alegreya, Inria_Serif } from "next/font/google";
import { ReactNode } from "react";
import "./global.css";

const fontSerif = Inria_Serif({
  variable: "--font-serif",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const fontSans = Alegreya({
  variable: "--font-sans",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Untga",
  description: "A text based browser RPG.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSerif.variable} ${fontSans.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
