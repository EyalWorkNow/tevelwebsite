import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import "./globals.css";

// One family site-wide: Heebo (headings, body and labels)
const heebo = Heebo({ variable: "--font-heebo", subsets: ["hebrew", "latin"], weight: ["300", "400", "500", "700"] });


const BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://tevel.tech").replace(/\/$/, "");
// Structured data so search and AI engines understand who TEVEL is.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization", "@id": `${BASE}/#org`, name: "TEVEL | תבל", alternateName: ["TEVEL", "תבל", "תבל בית תוכנה"], url: BASE,
      logo: `${BASE}/brand/tevel-logo.svg`, areaServed: "IL",
      description: "בית תוכנה, שותף טכנולוגי וסטודיו R&D שמתכנן ובונה מערכות מידע, CRM ו-ERP, AI ואוטומציות, שירות לקוחות מבוסס AI, אפליקציות ומוצרים דיגיטליים.",
      knowsAbout: ["Custom CRM", "ERP", "Information systems", "AI agents", "RAG", "Automation", "Integrations", "AI customer service", "Web apps", "Mobile apps", "Computer Vision", "IoT", "R&D", "Proof of Concept"],
      contactPoint: { "@type": "ContactPoint", contactType: "sales", url: `${BASE}/contact`, availableLanguage: ["he", "en"] },
    },
    { "@type": "WebSite", "@id": `${BASE}/#site`, url: BASE, name: "TEVEL | תבל", inLanguage: "he-IL", publisher: { "@id": `${BASE}/#org` } },
  ],
};

export const metadata: Metadata = {
  title: { default: "TEVEL | תבל — בית תוכנה ושותף טכנולוגי", template: "%s | תבל" },
  metadataBase: new URL(BASE),
  alternates: { canonical: "/", types: { "text/plain": "/llms.txt" } },
  openGraph: { type: "website", locale: "he_IL", siteName: "TEVEL | תבל" },
  description: "תבל בונה את התשתית הטכנולוגית שמאחורי העסק — מערכות מידע, CRM ו-ERP, AI, אוטומציות, שירות לקוחות חכם ומוצרים דיגיטליים.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} antialiased`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a href="#main" className="skip-link">דילוג לתוכן הראשי</a>
        <Header />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
        <AccessibilityWidget />
      </body>
    </html>
  );
}
