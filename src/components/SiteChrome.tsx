"use client";
import { usePathname } from "next/navigation";

// The marketing chrome (header, footer, Meta Pixel) stays off the customers' signing pages (/sign/<token>):
// a focused page, and no tracking where people sign documents.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/sign/")) return null;
  return <>{children}</>;
}
