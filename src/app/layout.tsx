import type { Metadata } from "next";
import { Inria_Serif, Lato } from "next/font/google";
import { ReactNode } from "react";
import "./global.css";

const fontSerif = Inria_Serif({
  variable: "--font-serif",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const fontSans = Lato({
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
      className={`${fontSerif.variable} ${fontSans.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
