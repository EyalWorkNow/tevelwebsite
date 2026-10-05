// Sitemap (structure unchanged from the design study) — labels/content now TEVEL, per project setup/ briefs.
export const slugs = {
  solutions: ["business-systems", "crm-erp", "ai-automation", "ai-customer-service", "web-mobile", "rd"],
  products: ["information-systems", "custom-crm", "erp-operations", "ai-for-business", "integrations", "mobile-apps", "tevel-invoice"],
  stories: ["service-at-scale", "operations-company", "sales-team", "training-organization"],
  posts: ["when-custom-crm", "when-not-ai", "automation-fit", "ai-service-architecture", "build-vs-buy", "manual-process-cost"],
  legal: ["privacy", "terms", "accessibility", "cookies"],
};

// Display names shared by nav, footer and pages.
export const names = {
  solutions: ["Business Systems", "CRM & ERP", "AI & Automation", "AI Customer Service", "Web & Mobile", "R&D & Custom Technology"],
  solutionsDesc: ["מערכות שנבנות סביב העבודה", "מותאמים לתהליך שלכם", "AI שעובד בתוך העסק", "שירות שגדל בלי שהעומס יגדל", "מוצרים דיגיטליים לעסק", "כשאין עדיין פתרון מוכן"],
  products: ["מערכות מידע ותוכנה עסקית", "CRM בהתאמה אישית", "ERP ומערכות תפעול", "AI לעסקים", "אוטומציות ואינטגרציות", "אפליקציות מובייל", "Tevel Invoice"],
  productsDesc: ["Back Office, פורטלים ודשבורדים", "מחזור החיים האמיתי של הלקוח", "רכש, מלאי, הזמנות ותפעול", "Agents, Copilots, RAG", "מערכות שמדברות זו עם זו", "מאפיון ועד השקה", "מסמכים ופעילות עסקית-פיננסית"],
  stories: ["מוקד שירות בסקייל", "חברת תפעול והפצה", "צוות מכירות", "ארגון הדרכה"],
  posts: ["מתי Custom CRM מוצדק?", "מתי לא צריך AI?", "איך מזהים תהליך שמתאים לאוטומציה?", "AI Customer Service Architecture", "Build vs Buy vs Integrate", "כמה עולה תהליך ידני?"],
  legal: ["מדיניות פרטיות", "תנאי שימוש", "הצהרת נגישות", "מדיניות עוגיות"],
};

export type NavLink = { href: string; label: string; desc?: string; icon?: string };
export type NavGroup = { label: string; links: NavLink[] };
export type NavItem = { label: string; href?: string; groups?: NavGroup[] };

const pIcons = ["frame", "people", "bank", "spark", "swap", "code", "book"];
const sIcons = ["frame", "people", "spark", "chat", "code", "pulse"];

export const nav: NavItem[] = [
  {
    label: "תחומים",
    groups: [
      { label: "פיתוח", links: [0, 1, 2].map((i) => ({ href: `/products/${slugs.products[i]}`, label: names.products[i], desc: names.productsDesc[i], icon: pIcons[i] })) },
      { label: "Intelligence", links: [3, 4].map((i) => ({ href: `/products/${slugs.products[i]}`, label: names.products[i], desc: names.productsDesc[i], icon: pIcons[i] })) },
      { label: "מוצרים דיגיטליים", links: [5].map((i) => ({ href: `/products/${slugs.products[i]}`, label: names.products[i], desc: names.productsDesc[i], icon: pIcons[i] })) },
      { label: "המוצר שלנו", links: [6].map((i) => ({ href: `/products/${slugs.products[i]}`, label: names.products[i], desc: names.productsDesc[i], icon: pIcons[i] })) },
    ],
  },
  { label: "פתרונות", groups: [{ label: "", links: slugs.solutions.map((s, i) => ({ href: `/solutions/${s}`, label: names.solutions[i], desc: names.solutionsDesc[i], icon: sIcons[i] })) }] },
  { label: "איך עובדים", href: "/pricing" },
  {
    label: "תהליך",
    groups: [{ label: "", links: [
      { href: "/onboarding", label: "למי זה מתאים", desc: "עסקים עם מורכבות תפעולית אמיתית", icon: "people" },
      { href: "/reports", label: "שלוש רמות פתרון", desc: "Focused Fix · Core · Full", icon: "stack" },
      { href: "/podcast", label: "R&D", desc: "מחקר, PoC ואבות-טיפוס", icon: "pulse" },
      { href: "/customer-stories", label: "תרחישים לדוגמה", desc: "איך זה נראה בפועל", icon: "chat" },
    ] }],
  },
  {
    label: "חברה",
    groups: [{ label: "", links: [
      { href: "/about", label: "אודות" }, { href: "/team", label: "הצוות והתחומים" }, { href: "/culture", label: "ערכים" },
      { href: "/careers", label: "עבודה איתנו" }, { href: "/company-facts", label: "תבל בקצרה" }, { href: "/contact", label: "צרו קשר" },
    ] }],
  },
  {
    label: "Insights",
    groups: [{ label: "", links: [
      { href: "/blog", label: "Insights" }, { href: "/customer-stories", label: "תרחישים לדוגמה" }, { href: "/podcast", label: "R&D" }, { href: "/onboarding", label: "למי זה מתאים" },
    ] }],
  },
];

export const footer: { label: string; links: NavLink[] }[] = [
  { label: "תחומים", links: [{ href: "/pricing", label: "איך עובדים" }, ...slugs.products.map((s, i) => ({ href: `/products/${s}`, label: names.products[i] }))] },
  { label: "חברה", links: [["/about", "אודות"], ["/team", "הצוות והתחומים"], ["/culture", "ערכים"], ["/careers", "עבודה איתנו"], ["/blog", "Insights"], ["/reports", "רמות פתרון"], ["/company-facts", "תבל בקצרה"], ["/contact", "צרו קשר"]].map(([href, label]) => ({ href, label })) },
  { label: "משפטי", links: slugs.legal.map((s, i) => ({ href: `/legal/${s}`, label: names.legal[i] })) },
  { label: "פתרונות", links: slugs.solutions.map((s, i) => ({ href: `/solutions/${s}`, label: names.solutions[i] })) },
];
