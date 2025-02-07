import type { Metadata } from "next";
import { Inria_Serif, Merriweather_Sans } from "next/font/google";
import { ReactNode } from "react";
import "./global.css";

const fontSerif = Inria_Serif({
  variable: "--font-serif",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const fontSans = Merriweather_Sans({
  variable: "--font-sans",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Untitled Game",
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
