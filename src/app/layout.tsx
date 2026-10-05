import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import "./globals.css";

// One family site-wide: Heebo (headings, body and labels)
const heebo = Heebo({ variable: "--font-heebo", subsets: ["hebrew", "latin"], weight: ["300", "400", "500", "700"] });


const BASE = (process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3010")).replace(/\/$/, "");
// Structured data so search and AI engines understand who TEVEL is.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization", "@id": `${BASE}/#org`, name: "בית תוכנה תבל", alternateName: ["TEVEL", "TEVEL | תבל", "תבל", "תבל בית תוכנה", "Tevel Space"], url: BASE,
      logo: `${BASE}/brand/tevel-logo.svg`, areaServed: "IL",
      description: "בית תוכנה, שותף טכנולוגי וסטודיו R&D שמתכנן ובונה מערכות מידע, CRM ו-ERP, AI ואוטומציות, שירות לקוחות מבוסס AI, אפליקציות ומוצרים דיגיטליים.",
      knowsAbout: ["Custom CRM", "ERP", "Information systems", "AI agents", "RAG", "Automation", "Integrations", "AI customer service", "Web apps", "Mobile apps", "Computer Vision", "IoT", "R&D", "Proof of Concept"],
      contactPoint: { "@type": "ContactPoint", contactType: "sales", url: `${BASE}/contact`, availableLanguage: ["he", "en"] },
      founder: { "@type": "Person", "@id": `${BASE}/#founder`, name: "Eyal Atia", worksFor: { "@id": `${BASE}/#org` }, sameAs: ["https://www.linkedin.com/in/eyal-atia-24a8a5246"] },
    },
    { "@type": "WebSite", "@id": `${BASE}/#site`, url: BASE, name: "בית תוכנה תבל", alternateName: ["TEVEL", "תבל", "Tevel Space"], inLanguage: "he-IL", publisher: { "@id": `${BASE}/#org` } },
  ],
};

export const metadata: Metadata = {
  title: { default: "TEVEL | תבל — בית תוכנה ושותף טכנולוגי", template: "%s | בית תוכנה תבל" },
  metadataBase: new URL(BASE),
  alternates: { types: { "text/plain": "/llms.txt" } },
  openGraph: { type: "website", locale: "he_IL", siteName: "בית תוכנה תבל", images: [{ url: "/og.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  description: "תבל בונה את התשתית הטכנולוגית שמאחורי העסק — מערכות מידע, CRM ו-ERP, AI, אוטומציות, שירות לקוחות חכם ומוצרים דיגיטליים.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning className={`${heebo.variable} antialiased`}>
      <head>
        {/* Content stays visible without JS; reveal animations only hide it once JS is running */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
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
