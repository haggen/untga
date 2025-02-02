import type { Metadata } from "next";
import { Cormorant } from "next/font/google";
import { ReactNode } from "react";
import "./global.css";

const fontFamily = Cormorant({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Untitle Web Game",
  description: "...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontFamily.className} antialiased`}>{children}</body>
    </html>
  );
}
