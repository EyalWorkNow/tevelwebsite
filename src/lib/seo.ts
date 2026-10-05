import type { Metadata } from "next";

// One place for per-page titles/descriptions + self-canonical (fixes the layout-wide canonical "/").
export const SITE = (process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://www.tevel.space")).replace(/\/$/, "");

const pages: Record<string, [title: string, description: string]> = {
  "/": ["TEVEL | תבל — בית תוכנה לפיתוח מערכות, CRM, AI ואוטומציות לעסקים", "תבל היא בית תוכנה ושותף טכנולוגי: פיתוח מערכות מידע, CRM ו-ERP בהתאמה אישית, AI ואוטומציות, שירות לקוחות מבוסס AI, אפליקציות ו-R&D — סביב הדרך שבה העסק שלכם עובד."],
  "/pricing": ["איך עובדים עם בית תוכנה תבל — מהבעיה לפתרון", "איך מתחילים עבודה עם תבל: שיחת היכרות, Discovery ומיפוי, והמלצה ברמה המתאימה — Focused Fix, Core Transformation או Full Transformation. בלי מחירון, לפי כדאיות אמיתית."],
  "/contact": ["צרו קשר — ספרו לנו מה לא עובד", "השאירו פרטים ונחזור אליכם. לא צריך לדעת איזו מערכת אתם צריכים — ספרו לנו מה אתם מנסים לשפר ונתחיל מהבעיה."],
  "/contact/sales": ["בואו נדבר — שיחת היכרות עם תבל", "תיאום שיחת היכרות עם בית תוכנה תבל: אפשר להגיע עם בעיה ולא עם מפרט טכני. נבין את התהליך, ונציע את הדרך הנכונה להתקדם."],
  "/about": ["אודות תבל — בית תוכנה, שותף טכנולוגי וסטודיו R&D", "מי אנחנו: בית תוכנה שמתחיל מהבעיה העסקית ובונה מקצה לקצה — מערכות מידע, CRM ו-ERP, AI, אוטומציות, אפליקציות ופרויקטי R&D."],
  "/team": ["הצוות ותחומי המומחיות של תבל", "תחומי המומחיות בליבת תבל — Product & UX, Software Engineering, AI, Data, DevOps, Security ואינטגרציות — והמומחים שמצטרפים לפי פרויקט."],
  "/culture": ["הערכים של תבל — Understand first. Build what matters.", "חמשת הערכים שמנחים את העבודה בתבל: להבין קודם, לבנות עם תכלית, לעצב לאנשים, למדוד השפעה ולקחת אחריות על התוצאה."],
  "/careers": ["עבודה עם תבל — מודל בוטיק מקצה לקצה", "איך עובדים עם תבל: Discovery, Focused Fix, Core או Full Transformation, פרויקט R&D או פיתוח שוטף — עבודה קרובה וקשר ישיר עם מי שבונה."],
  "/reports": ["שלוש רמות פתרון — Focused Fix, Core ו-Full Transformation", "שלוש רמות פתרון לעסקים: פתרון ממוקד לבעיה המרכזית, טיפול שורש בגורמים, או שינוי מערכתי רחב — ומה מקבלים בכל רמה."],
  "/company-facts": ["תבל בקצרה — דף עובדות על בית התוכנה", "דף עובדות על תבל: מה החברה עושה, ארבע השכבות BUILD, INTELLIGENCE, TRANSFORM ו-INVENT, השירותים, קהל היעד ושאלות נפוצות."],
  "/podcast": ["R&D ו-Custom Technology — מחקר, PoC ואבות-טיפוס", "שכבת ה-R&D של תבל: מחקר טכנולוגי, בדיקת היתכנות, PoC, אבות-טיפוס, Computer Vision, IoT ולומדות — עד מוצר שאפשר להפעיל."],
  "/onboarding": ["למי זה מתאים — עסקים עם מורכבות תפעולית אמיתית", "למי מתאימה העבודה עם תבל: עסקים עם כמה מחלקות, מערכות שונות, עבודה ידנית ומידע מפוזר — וגם יזמים עם רעיון טכנולוגי שצריך להוכיח."],
  "/blog": ["Insights — מדריכים על CRM, אוטומציה, AI ו-Build vs Buy", "מדריכים מעשיים של תבל: מתי Custom CRM מוצדק, מתי לא צריך AI, איך מזהים תהליך לאוטומציה, ארכיטקטורת שירות מבוסס AI ועוד."],
  "/customer-stories": ["תרחישים לדוגמה — איך זה נראה בפועל", "תרחישים להמחשה (לא לקוחות אמיתיים): מוקד שירות בסקייל, חברת תפעול והפצה, צוות מכירות וארגון הדרכה — הבעיה, המיפוי והפתרון האפשרי."],
};

export const OG_IMAGES = [{ url: "/og.png", width: 1200, height: 630, alt: "TEVEL | תבל — בית תוכנה ושותף טכנולוגי" }];

export function seo(path: string, override?: { title?: string; description?: string }): Metadata {
  const [t, d] = pages[path] ?? ["", ""];
  const title = override?.title ?? t;
  const description = override?.description ?? d;
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, images: OG_IMAGES },
  };
}

/** Trim to ~155 chars at a sentence (or word) boundary — never mid-word. */
export function trimDesc(s: string, max = 160) {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const dot = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
  if (dot > 80) return cut.slice(0, dot + 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:—-]\s*$/, "") + "…";
}

// Search-friendly Hebrew titles for the dynamic service pages.
export const productTitles: Record<string, string> = {
  "information-systems": "פיתוח מערכות מידע ו-Back Office לעסקים",
  "custom-crm": "פיתוח CRM בהתאמה אישית לעסקים",
  "erp-operations": "פיתוח ERP ומערכות תפעול מותאמות",
  "ai-for-business": "הטמעת AI לעסקים — Agents, RAG ו-Document AI",
  "integrations": "אוטומציות ואינטגרציות בין מערכות עסקיות",
  "mobile-apps": "פיתוח אפליקציות מובייל לעסקים",
  "tevel-invoice": "Tevel Invoice — מסמכים ופעילות עסקית-פיננסית",
};
export const solutionTitles: Record<string, string> = {
  "business-systems": "מערכות מידע שנבנות סביב העבודה — Business Systems",
  "crm-erp": "CRM ו-ERP שמתאימים לתהליך שלכם",
  "ai-automation": "AI ואוטומציות שעובדים בתוך העסק",
  "ai-customer-service": "שירות לקוחות מבוסס AI — AI Customer Service",
  "web-mobile": "פיתוח Web ואפליקציות — מוצרים דיגיטליים לעסק",
  "rd": "R&D ו-Custom Technology — PoC, אבות-טיפוס ומחקר",
};
