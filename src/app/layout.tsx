import type { Metadata } from "next";
import { Inter, Newsreader, IBM_Plex_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

// ponytail: free stand-ins for the reference's licensed Söhne / Cambon / Söhne Mono
const sans = Inter({ variable: "--font-sans-src", subsets: ["latin"] });
const serif = Newsreader({ variable: "--font-serif-src", subsets: ["latin"], weight: ["300"], style: ["normal", "italic"] });
const mono = IBM_Plex_Mono({ variable: "--font-mono-src", subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: { default: "Lorem — Ipsum dolor sit amet", template: "%s — Lorem" },
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable} antialiased`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
