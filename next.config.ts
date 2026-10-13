import type { NextConfig } from "next";

// Customers' signing pages and the CRM mailbox API: never indexed or cached, no framing, no referrer,
// only this site's own scripts (pdf.js runs from /pdfjs), camera/mic/location off.
const PRIVATE_HEADERS = [
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
  { key: "Cache-Control", value: "no-store, max-age=0" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];
const SIGN_CSP = [
  "default-src 'self'", `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'"}`, "style-src 'self' 'unsafe-inline'", "img-src 'self' data: blob:",
  "font-src 'self' data:", "connect-src 'self'", "worker-src 'self' blob:", "object-src 'none'", "base-uri 'none'", "form-action 'self'", "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  // Friendly spellings for the shareable executive summary page
  async redirects() {
    return ["/tahles", "/takhles", "/tachlas", "/tachless"].map((source) => ({ source, destination: "/tachles", permanent: true }));
  },
  async headers() {
    return [
      { source: "/sign/:path*", headers: [...PRIVATE_HEADERS, { key: "Content-Security-Policy", value: SIGN_CSP }] },
      { source: "/api/sign", headers: PRIVATE_HEADERS },
      { source: "/api/relay/:path*", headers: PRIVATE_HEADERS },
    ];
  },
};

export default nextConfig;
