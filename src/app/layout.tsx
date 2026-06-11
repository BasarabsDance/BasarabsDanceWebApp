import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Cormorant_Garamond, Marcellus } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Basarab's Dance",
  description: "O companie de dans care transformă emoția în spectacol.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className="dark">
      <body
        className={`${geistSans.variable} ${cormorant.variable} ${marcellus.variable} antialiased bg-[#060606] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
