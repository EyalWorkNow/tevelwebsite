import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

// One family site-wide: Heebo (headings, body and labels)
const heebo = Heebo({ variable: "--font-heebo", subsets: ["hebrew", "latin"], weight: ["300", "400", "500", "700"] });

export const metadata: Metadata = {
  title: { default: "TEVEL | תבל — בית תוכנה ושותף טכנולוגי", template: "%s | תבל" },
  description: "תבל בונה את התשתית הטכנולוגית שמאחורי העסק — מערכות מידע, CRM ו-ERP, AI, אוטומציות, שירות לקוחות חכם ומוצרים דיגיטליים.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} antialiased`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
