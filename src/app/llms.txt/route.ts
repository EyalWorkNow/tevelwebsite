import { slugs, names } from "@/lib/site";
import { answers } from "@/lib/answers";

// llms.txt (llmstxt.org): a plain-markdown map of the site for AI assistants and answer engines.
const BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://tevelwebsite.vercel.app").replace(/\/$/, "");
const link = (path: string, title: string, desc?: string) => `- [${title}](${BASE}${path})${desc ? `: ${desc}` : ""}`;

export function GET() {
  const body = `# TEVEL | תבל

> TEVEL (תבל) is an Israeli software house, technology partner and R&D studio. It designs and builds the systems businesses run on — information systems, custom CRM and ERP, AI and automation, AI-powered customer service, web and mobile products, learning technology and custom R&D — starting from the business problem, not the technology.

תבל היא בית תוכנה, שותף טכנולוגי וסטודיו R&D שמתכנן ובונה מערכות ומוצרים טכנולוגיים מקצה לקצה. אנחנו מתחילים מהבעיה העסקית ובונים סביבה את הטכנולוגיה הנכונה.

Key facts:
- Language of the site: Hebrew (RTL). Location: Israel.
- Approach: Discovery → Business Mapping → Product Strategy → UX/UI → Architecture → Development → Integrations → AI → Deployment → Maintenance → Improvement.
- Engagement levels: Focused Fix, Core Transformation, Full Transformation.
- Own product: Tevel Invoice (business documents and business-financial activity).
- Contact: ${BASE}/contact

## Questions & answers (direct answers about TEVEL)
${answers.map((a) => link(`/en/answers/${a.slug}`, a.en.q, a.en.tldr.split(". ")[0] + ".")).join("\n")}
${answers.map((a) => link(`/answers/${a.slug}`, a.he.q)).join("\n")}

## Solutions
${slugs.solutions.map((s, i) => link(`/solutions/${s}`, names.solutions[i], names.solutionsDesc[i])).join("\n")}

## Capabilities & products
${slugs.products.map((s, i) => link(`/products/${s}`, names.products[i], names.productsDesc[i])).join("\n")}

## How we work
${link("/pricing", "איך עובדים", "Discovery call, mapping and proposal — no public price list")}
${link("/reports", "שלוש רמות פתרון", "Focused Fix / Core Transformation / Full Transformation")}
${link("/onboarding", "למי זה מתאים", "typical customer profile and fit")}
${link("/podcast", "R&D & Custom Technology", "research, feasibility, PoC and prototypes")}

## Insights
${slugs.posts.map((s, i) => link(`/blog/${s}`, names.posts[i])).join("\n")}

## Company
${link("/about", "אודות")}
${link("/company-facts", "תבל בקצרה", "fact sheet")}
${link("/culture", "ערכים")}
${link("/contact", "צרו קשר")}

## Optional
${slugs.stories.map((s, i) => link(`/customer-stories/${s}`, names.stories[i], "illustrative scenario, not a real client")).join("\n")}
${slugs.legal.map((s, i) => link(`/legal/${s}`, names.legal[i])).join("\n")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
