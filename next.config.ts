import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Friendly spellings for the shareable executive summary page
  async redirects() {
    return ["/tahles", "/takhles", "/tachlas", "/tachless"].map((source) => ({ source, destination: "/tachles", permanent: true }));
  },
};

export default nextConfig;
