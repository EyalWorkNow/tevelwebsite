"use client";
import { usePathname } from "next/navigation";

// The marketing chrome (header, footer, Meta Pixel) stays off the customers' signing pages (/sign/<token>)
// and the invoicing admin console (/invoiceadmin):
// a focused page, and no tracking where people sign documents.
export default function SiteChrome({ children, campaignFooter }: { children: React.ReactNode; campaignFooter?: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/sign/")) return null;
  // The invoicing admin console: private, no marketing chrome and no tracking.
  if (pathname === "/invoiceadmin" || pathname?.startsWith("/invoiceadmin/")) return null;
  if (pathname === "/app14" && campaignFooter) return <>{campaignFooter}</>;
  return <>{children}</>;
}
