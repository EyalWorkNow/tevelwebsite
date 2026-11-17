import type { Metadata } from "next";
import "./admin.css";

// The owner's console for the Tevel invoicing product. Private: never indexed, no marketing chrome,
// no analytics (SiteChrome hides header/footer/Meta Pixel/widget here), strict headers in next.config.ts.
export const metadata: Metadata = {
  title: { absolute: "ניהול תבל חשבוניות" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

export default function InvoiceAdminLayout({ children }: LayoutProps<"/invoiceadmin">) {
  return <div className="adm-root">{children}</div>;
}
