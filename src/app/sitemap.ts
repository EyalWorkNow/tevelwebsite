import type { MetadataRoute } from "next";
import { slugs } from "@/lib/site";
import { answers } from "@/lib/answers";

// Set NEXT_PUBLIC_SITE_URL (e.g. https://tevel.co.il) in the hosting env once the domain is live.
const BASE = (process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3010")).replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/", "/pricing", "/contact", "/contact/sales", "/about", "/team", "/culture", "/careers", "/reports",
    "/company-facts", "/podcast", "/onboarding", "/blog", "/customer-stories",
    ...slugs.solutions.map((s) => `/solutions/${s}`),
    ...slugs.products.map((s) => `/products/${s}`),
    ...slugs.posts.map((s) => `/blog/${s}`),
    ...slugs.stories.map((s) => `/customer-stories/${s}`),
    ...slugs.legal.map((s) => `/legal/${s}`),
    "/answers", "/en/answers",
    ...answers.flatMap((a) => [`/answers/${a.slug}`, `/en/answers/${a.slug}`]),
  ];
  return paths.map((p) => ({ url: BASE + p, changeFrequency: "monthly", priority: p === "/" ? 1 : 0.7 }));
}
