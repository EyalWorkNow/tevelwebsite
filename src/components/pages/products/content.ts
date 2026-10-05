// Per-slug copy for /products/[slug] (TEVEL's domains). Source: project setup/TEVEL_WEBSITE_MASTER_BRIEF_HE.md §6.1–6.4, §6.6–6.7, §7, §23, §31.
// Tevel Invoice: no unverified features, integrations, certifications or regulatory claims (§7).

export type Link = { label: string; href: string };
export type Item = { title: string; body: string };

export type ProductContent = {
  hero: { eyebrow: string; heading: string; lede: string; primary: Link; secondary: Link };
  marks: [string, string, string];
  highlights: [Item, Item];
  featuresTitle: string;
  features: Item[]; // 4
  listTitle: string;
  list: Item[]; // 4
  note: [string, string];
  noteButton: Link;
  cta: { text: string; label: string; href: string };
  pair: [Item & { button: Link }, Item & { button: Link; badge: string }];
};

export const products: Record<string, ProductContent> = {
  "information-systems": {
    hero: {
      eyebrow: "מערכות מידע ותוכנה עסקית",
      heading: "העסק לא צריך לעבוד סביב התוכנה שלו",
      lede: "תכנון ופיתוח מערכות שמותאמות לתהליכים של הארגון: Back Office, מערכות תפעול, ניהול Workflows, פורטלים ללקוחות ולעובדים, דשבורדים, ניהול מסמכים ומשימות, הרשאות, דוחות, APIs ואינטגרציות. במקומות שבהם יש הצדקה עסקית, התוכנה צריכה להתאים לתהליך.",
      primary: { label: "ספרו לנו איך אתם עובדים היום", href: "/contact" },
      secondary: { label: "Business Systems", href: "/solutions/business-systems" },
    },
    marks: ["Back Office", "Portals", "Dashboards"],
    highlights: [
      { title: "מערכת אחת במקום מידע מפוזר", body: "לקוחות, הזמנות, מסמכים ומשימות במקום אחד, עם תהליכים מוגדרים במקום העתקה בין קבצים ומערכות." },
      { title: "Custom היכן שזה מוצדק", body: "לא כל דבר צריך Custom. כאשר התהליך ייחודי ומצדיק זאת, מערכת מותאמת יכולה להפוך לנכס של העסק — ובמקרים אחרים מוצר קיים ואינטגרציה נכונה מספיקים." },
    ],
    featuresTitle: "מה אפשר לבנות",
    features: [
      { title: "Operations Systems", body: "מערכות לניהול הזמנות, משימות ותהליכי עבודה יומיומיים." },
      { title: "Customer & Employee Portals", body: "ממשקים ללקוחות ולעובדים, לפי תפקיד והרשאות." },
      { title: "Document Management", body: "ניהול מסמכים ותהליכי אישור בתוך המערכת." },
      { title: "Reporting", body: "דשבורדים ודוחות על בסיס המידע שכבר קיים בארגון." },
    ],
    listTitle: "איך זה נבנה",
    list: [
      { title: "מיפוי", body: "אנשים, מערכות, מידע ותהליכים — לפני שמחליטים מה לבנות." },
      { title: "אפיון ו-UX", body: "מערכת עסקית לא טובה אם העובדים מתקשים להשתמש בה." },
      { title: "פיתוח ואינטגרציה", body: "Frontend, Backend, Databases ו-APIs, מחוברים למערכות הקיימות של העסק." },
      { title: "הטמעה והמשך", body: "Deployment, QA, Monitoring, תחזוקה ופיתוח המשך." },
    ],
    note: ["לא בטוחים מה צריך לבנות?", "זה בדיוק התפקיד של שיחת ה-Discovery."],
    noteButton: { label: "קבעו שיחת Discovery", href: "/contact" },
    cta: { text: "ספרו לנו מה לא עובד. אנחנו נתחיל משם.", label: "בואו נדבר", href: "/contact" },
    pair: [
      { title: "למי זה מתאים", body: "עסקים וארגונים עם מורכבות תפעולית, כמה מחלקות ומערכות שלא מדברות זו עם זו.", button: { label: "למי זה מתאים", href: "/onboarding" } },
      { title: "רמות פתרון", body: "Focused Fix, Core Transformation או Full Transformation — לפי כדאיות.", button: { label: "רמות פתרון", href: "/reports" }, badge: "Problem First" },
    ],
  },

  "custom-crm": {
    hero: {
      eyebrow: "CRM בהתאמה אישית",
      heading: "CRM שלא רק שומר לקוחות — אלא מנהל את הדרך שבה העסק עובד איתם",
      lede: "מערכות CRM שמנהלות את מחזור החיים האמיתי של הלקוח: Leads, אנשי קשר, חברות, עסקאות, Pipelines, משימות, תקשורת, Follow-ups והיסטוריית לקוח. אפשר לפתח CRM מותאם, להרחיב מערכת קיימת או לבנות שכבת עבודה ואינטגרציות מעל כלים קיימים.",
      primary: { label: "ספרו לנו איך אתם עובדים היום", href: "/contact" },
      secondary: { label: "CRM & ERP", href: "/solutions/crm-erp" },
    },
    marks: ["Leads", "Pipelines", "Retention"],
    highlights: [
      { title: "מחזור החיים המלא", body: "Lead → Sale → Customer → Service → Retention, עם משימות ו-Follow-ups שלא נשענים על זיכרון." },
      { title: "לבנות, להרחיב או לחבר", body: "לא תמיד צריך להחליף את ה-CRM. לעיתים נכון יותר להרחיב מערכת קיימת או לבנות מעליה שכבת עבודה ואינטגרציות שמתאימות לתהליך שלכם." },
    ],
    featuresTitle: "מה נכלל",
    features: [
      { title: "Deals ו-Pipelines", body: "ניהול עסקאות ושלבי מכירה לפי התהליך האמיתי של הצוות." },
      { title: "Communications", body: "תקשורת והיסטוריית לקוח במקום אחד." },
      { title: "Automations", body: "Follow-ups, משימות והתראות שמתבצעים בזמן." },
      { title: "Permissions ו-Analytics", body: "הרשאות לפי תפקיד ותמונת מצב על המכירות והשירות." },
    ],
    listTitle: "מעבר למכירה",
    list: [
      { title: "Service workflows", body: "תהליכי שירות שמחוברים לכרטיס הלקוח." },
      { title: "Retention", body: "מעקב אחרי לקוחות קיימים ולא רק אחרי לידים חדשים." },
      { title: "Upsell", body: "זיהוי הזדמנויות מתוך ההיסטוריה של הלקוח." },
      { title: "Integrations", body: "חיבור ל-ERP, לערוצי תקשורת ולמערכות שהעסק כבר עובד איתן." },
    ],
    note: ["ה-CRM לא מתאים לכם?", "ספרו לנו איפה הוא לא עומד בתהליך."],
    noteButton: { label: "בואו נדבר", href: "/contact" },
    cta: { text: "ספרו לנו איך אתם עובדים היום. נתחיל משם.", label: "ספרו לנו איך אתם עובדים היום", href: "/contact" },
    pair: [
      { title: "מתי Custom CRM מוצדק?", body: "מתי מוצר מדף מספיק ומתי מערכת מותאמת הופכת לנכס.", button: { label: "לקריאה", href: "/blog/when-custom-crm" } },
      { title: "Build vs Buy", body: "אם מוצר קיים פותר את הבעיה היטב, אין סיבה לבנות מערכת מיותרת.", button: { label: "לקריאה", href: "/blog/build-vs-buy" }, badge: "CRM" },
    ],
  },

  "erp-operations": {
    hero: {
      eyebrow: "ERP ומערכות תפעול",
      heading: "מערכות תפעול שמחברות בין ההזמנה, המלאי והכסף",
      lede: "בהתאם לצורך: רכש, מלאי, ספקים, לקוחות, הזמנות, תפעול, מסמכים, תהליכי אישור, מחסנים, הרשאות, דוחות, אינטגרציות ורכיבים פיננסיים ותפעוליים. לא כל לקוח צריך ERP שלם מאפס — לעיתים נכון יותר לפתח מודול, שכבת Orchestration או אינטגרציה למערכות קיימות.",
      primary: { label: "ספרו לנו איך אתם עובדים היום", href: "/contact" },
      secondary: { label: "CRM & ERP", href: "/solutions/crm-erp" },
    },
    marks: ["Orders", "Inventory", "Suppliers"],
    highlights: [
      { title: "Order → Operations → Finance", body: "תהליך אחד מההזמנה, דרך התפעול, המלאי והספקים ועד הרכיבים הפיננסיים." },
      { title: "בהתאם להיקף", body: "מודול ייעודי, שכבה משלימה או אינטגרציה למערכות קיימות — הבחירה נקבעת לפי הבעיה ולפי הכדאיות, לא לפי גודל הפרויקט." },
    ],
    featuresTitle: "רכיבים אפשריים",
    features: [
      { title: "רכש וספקים", body: "ניהול הזמנות רכש, ספקים ותהליכי אישור." },
      { title: "מלאי ומחסנים", body: "תמונת מלאי עדכנית ותנועות בין מחסנים." },
      { title: "הזמנות ותפעול", body: "מעקב אחר הזמנות משלב הקליטה ועד הביצוע." },
      { title: "מסמכים ודוחות", body: "מסמכים, הרשאות ודוחות תפעוליים במקום אחד." },
    ],
    listTitle: "איך ניגשים לזה",
    list: [
      { title: "מיפוי התהליך", body: "מה קורה היום בין ההזמנה לאספקה, ואיפה המידע עובר ידנית." },
      { title: "מודול או מערכת", body: "החלטה על היקף: מודול, שכבת Orchestration או מערכת רחבה." },
      { title: "אינטגרציה", body: "חיבור למערכות הנהלת חשבונות, CRM ומערכות קיימות, בכפוף ל-APIs ולהרשאות שלהן." },
      { title: "Migration", body: "העברת מידע מסודרת ממערכות ישנות ומקבצים." },
    ],
    note: ["המערכת לא עומדת בצמיחה?", "נתחיל בהבנה מה באמת לא עובד."],
    noteButton: { label: "קבעו שיחת Discovery", href: "/contact" },
    cta: { text: "ספרו לנו איך התפעול שלכם עובד היום.", label: "ספרו לנו איך אתם עובדים היום", href: "/contact" },
    pair: [
      { title: "כמה עולה תהליך ידני?", body: "איך מעריכים את העלות של עבודה שחוזרת על עצמה.", button: { label: "לקריאה", href: "/blog/manual-process-cost" } },
      { title: "רמות פתרון", body: "Focused Fix, Core Transformation או Full Transformation.", button: { label: "רמות פתרון", href: "/reports" }, badge: "ERP" },
    ],
  },

  "ai-for-business": {
    hero: {
      eyebrow: "AI לעסקים",
      heading: "AI שנכנס כשיש לו תפקיד עסקי ברור",
      lede: "תבל מזהה היכן AI מסוגל ליצור ערך ממשי ומטמיעה אותו בתוך תהליכי העבודה: AI Agents, Copilots פנימיים, עוזרי ידע, RAG, חיפוש סמנטי, הבנת מסמכים, OCR וחילוץ נתונים, סיווג, סיכום, ניתוב וניתוח שיחות. אם workflow דטרמיניסטי פשוט עושה את העבודה טוב יותר — אין סיבה להכניס LLM.",
      primary: { label: "בואו נמצא איפה AI באמת יכול לעזור", href: "/contact" },
      secondary: { label: "AI & Automation", href: "/solutions/ai-automation" },
    },
    marks: ["Agents", "Copilots", "RAG"],
    highlights: [
      { title: "AI בתוך התהליך", body: "AI שפועל בתוך המערכות והתהליכים הקיימים, עם הרשאות מוגדרות ופעולות מאושרות." },
      { title: "AI אינו מטרה", body: "לפני שמכניסים מודל, בודקים אם אוטומציה פשוטה תהיה אמינה וזולה יותר. AI נכנס רק היכן שהוא פותר בעיה שכלים אחרים לא פותרים היטב." },
    ],
    featuresTitle: "יכולות אפשריות",
    features: [
      { title: "Knowledge Assistants", body: "מענה על בסיס הידע המאושר של הארגון, באמצעות RAG וחיפוש סמנטי." },
      { title: "Document Understanding", body: "OCR, חילוץ וסיווג של מסמכים שנכנסים לעסק." },
      { title: "Summarization ו-Routing", body: "סיכום שיחות ומסמכים וניתוב פניות לגורם הנכון." },
      { title: "Recommendation", body: "המלצות על בסיס מידע עסקי קיים." },
    ],
    listTitle: "שליטה ובקרה",
    list: [
      { title: "Human approval", body: "פעולות רגישות עוברות אישור אנושי." },
      { title: "Permissions", body: "AI ניגש רק למידע ולפעולות שהוגדרו לו." },
      { title: "Logging", body: "תיעוד של מה בוצע ועל בסיס איזה מידע." },
      { title: "Evaluation", body: "בדיקה שהמערכת עונה נכון לפני שמרחיבים את השימוש בה." },
    ],
    note: ["רוצים AI אבל לא יודעים איפה הוא באמת יעזור?", "נתחיל מהתהליך, לא מהמודל."],
    noteButton: { label: "בואו נדבר", href: "/contact" },
    cta: { text: "ספרו לנו מה לא עובד. נבדוק יחד אם AI הוא התשובה.", label: "בואו נמצא איפה AI באמת יכול לעזור", href: "/contact" },
    pair: [
      { title: "מתי לא צריך AI?", body: "המקרים שבהם workflow פשוט עדיף על מודל שפה.", button: { label: "לקריאה", href: "/blog/when-not-ai" } },
      { title: "AI Customer Service", body: "מערכי שירות שמשלבים AI, אוטומציות ונציגים אנושיים.", button: { label: "לפתרון", href: "/solutions/ai-customer-service" }, badge: "AI" },
    ],
  },

  integrations: {
    hero: {
      eyebrow: "אוטומציות ואינטגרציות",
      heading: "לא כל בעיה דורשת מערכת חדשה",
      lede: "לעיתים צריך לגרום למערכות הקיימות לדבר זו עם זו. אנחנו בונים אינטגרציות API, Webhooks, תהליכים מבוססי אירועים, סנכרון נתונים, התראות, תהליכי לידים ו-Follow-up, תהליכי אישור, זרימת מסמכים, תהליכים מתוזמנים ואוטומציות פנימיות.",
      primary: { label: "ספרו לנו איך אתם עובדים היום", href: "/contact" },
      secondary: { label: "AI & Automation", href: "/solutions/ai-automation" },
    },
    marks: ["API", "Webhooks", "Sync"],
    highlights: [
      { title: "פחות Copy/Paste", body: "מידע שעובר אוטומטית בין מערכות במקום העתקה ידנית ועדכונים כפולים." },
      { title: "פחות פעולות שחייבים לזכור", body: "Follow-ups, אישורים והתראות שמתבצעים כחלק מהתהליך — ולא תלויים בכך שמישהו יזכור לבצע אותם בזמן." },
    ],
    featuresTitle: "מה אנחנו בונים",
    features: [
      { title: "API integrations", body: "חיבור בין מערכות קיימות, בכפוף ל-APIs ולהרשאות שלהן." },
      { title: "Event-driven workflows", body: "תהליכים שמופעלים מאירוע במערכת אחת ומעדכנים אחרת." },
      { title: "Data synchronization", body: "סנכרון נתונים בין מערכות כך שכולן מציגות את אותו מידע." },
      { title: "Approval & Document flows", body: "תהליכי אישור וזרימת מסמכים בין גורמים ומערכות." },
    ],
    listTitle: "תהליכים נפוצים",
    list: [
      { title: "Lead workflows", body: "ליד שנכנס מגיע לגורם הנכון, עם המידע הנדרש." },
      { title: "Follow-up workflows", body: "תזכורות והמשכי טיפול שלא נופלים בין הכיסאות." },
      { title: "Notifications", body: "התראות לאנשים הנכונים כשמשהו דורש טיפול." },
      { title: "Scheduled processes", body: "תהליכים שרצים בזמנים קבועים, בלי התערבות ידנית." },
    ],
    note: ["המערכות שלכם לא מדברות?", "ספרו לנו אילו מערכות ואיזה מידע עובר ביניהן."],
    noteButton: { label: "בואו נדבר", href: "/contact" },
    cta: { text: "ספרו לנו מה עובר ידנית בין המערכות שלכם.", label: "בואו נדבר", href: "/contact" },
    pair: [
      { title: "איך מזהים תהליך שמתאים לאוטומציה?", body: "סימנים לתהליך שכדאי להפוך לאוטומטי.", button: { label: "לקריאה", href: "/blog/automation-fit" } },
      { title: "Build vs Buy vs Integrate", body: "לעיתים מוצר קיים ואינטגרציה נכונה מספיקים.", button: { label: "לקריאה", href: "/blog/build-vs-buy" }, badge: "API" },
    ],
  },

  "mobile-apps": {
    hero: {
      eyebrow: "אפליקציות מובייל",
      heading: "אפליקציות מקצה לקצה — מאפיון ועד השקה",
      lede: "Discovery, אסטרטגיית מוצר, UX/UI, ארכיטקטורה, Backend, APIs, פיתוח מובייל, אימות משתמשים, התראות, Analytics, Deployment ותחזוקה. אפליקציות ללקוחות, לעובדים, לשירות, למסחר, ל-Membership, לתפעול ולמוצרים דיגיטליים.",
      primary: { label: "יש לכם מוצר לבנות?", href: "/contact" },
      secondary: { label: "Web & Mobile", href: "/solutions/web-mobile" },
    },
    marks: ["iOS", "Android", "Backend"],
    highlights: [
      { title: "מוצר, לא רק מסכים", body: "מתחילים מהשאלה מה האפליקציה צריכה לעשות עבור העסק ועבור המשתמשים." },
      { title: "מחוברת לעסק", body: "Backend, APIs ואינטגרציות שמחברים את האפליקציה למערכות שהעסק כבר עובד איתן — CRM, מערכות תפעול ומערכות שירות." },
    ],
    featuresTitle: "מה נכלל",
    features: [
      { title: "UX/UI", body: "חוויית משתמש שמתוכננת לשימוש יומיומי." },
      { title: "Architecture ו-Backend", body: "תשתית, APIs ומסדי נתונים שמתאימים למוצר." },
      { title: "Authentication ו-Notifications", body: "כניסת משתמשים, הרשאות והתראות." },
      { title: "Analytics", body: "מדידה של השימוש במוצר לצורך שיפור מתמשך." },
    ],
    listTitle: "תהליך",
    list: [
      { title: "Discovery", body: "הבנת הבעיה, המשתמשים והצורך העסקי." },
      { title: "UX → UI", body: "תכנון זרימות ומסכים לפני שמתחילים לפתח." },
      { title: "Engineering ו-QA", body: "פיתוח, בדיקות והכנה להשקה." },
      { title: "Launch ו-Iteration", body: "השקה, תחזוקה ופיתוח המשך לפי מה שלומדים מהשימוש." },
    ],
    note: ["יש לכם רעיון למוצר?", "נתחיל באפיון ובשאלה מה המוצר צריך לפתור."],
    noteButton: { label: "בואו נדבר", href: "/contact" },
    cta: { text: "יש לכם מוצר לבנות? ספרו לנו עליו.", label: "בואו נדבר", href: "/contact" },
    pair: [
      { title: "Web Apps ואתרים", body: "SaaS, פורטלים, דשבורדים ואתרים עסקיים ומסחריים.", button: { label: "Web & Mobile", href: "/solutions/web-mobile" } },
      { title: "R&D", body: "כשהמוצר דורש טכנולוגיה שעדיין אין לה פתרון מוכן.", button: { label: "R&D", href: "/solutions/rd" }, badge: "Mobile" },
    ],
  },

  "tevel-invoice": {
    hero: {
      eyebrow: "Tevel Invoice",
      heading: "ניהול מסמכים עסקיים ופיננסיים — בדרך של תבל",
      lede: "Tevel Invoice הוא מוצר של תבל להפקת מסמכים עסקיים ולניהול פעילות עסקית-פיננסית. תחומי המוצר עשויים לכלול, בהתאם לגרסה הזמינה: חשבוניות, קבלות, זיכויים, הצעות מחיר, מסמכים עסקיים, לקוחות, הוצאות ו-exports.",
      primary: { label: "דברו איתנו על Tevel Invoice", href: "/contact?source=invoice" },
      secondary: { label: "צרו קשר", href: "/contact" },
    },
    marks: ["Tevel Invoice", "מסמכים", "לקוחות"],
    highlights: [
      { title: "מוצר של תבל", body: "תבל אינה רק חברת פרויקטים — היא בונה גם מוצרי תוכנה משל עצמה." },
      { title: "בהתאם לגרסה", body: "היכולות הזמינות משתנות בהתאם לגרסת המוצר. לפרטים על מה שזמין כרגע ועל אפשרויות הגישה — דברו איתנו." },
    ],
    featuresTitle: "תחומי המוצר",
    features: [
      { title: "מסמכים", body: "חשבוניות, קבלות, זיכויים והצעות מחיר — בהתאם לגרסה." },
      { title: "לקוחות", body: "ניהול פרטי הלקוחות שאליהם מופקים המסמכים." },
      { title: "הוצאות", body: "תיעוד הוצאות העסק, בהתאם לגרסה." },
      { title: "Exports", body: "ייצוא מידע לשימוש מחוץ למוצר, בהתאם לגרסה." },
    ],
    listTitle: "סקירה",
    list: [
      { title: "Product overview", body: "מוצר לניהול מסמכים עסקיים ופעילות עסקית-פיננסית." },
      { title: "Financial workflows", body: "תהליכים פיננסיים וניהול עסקי, עשויים להיכלל בהתאם לגרסה." },
      { title: "Management", body: "ניהול המסמכים והלקוחות של העסק במקום אחד." },
      { title: "Getting started", body: "אפשרויות הגישה למוצר נקבעות בהתאם למצב המוצר — צרו קשר לפרטים." },
    ],
    note: ["מעוניינים ב-Tevel Invoice?", "השאירו פרטים ונחזור אליכם עם המידע העדכני."],
    noteButton: { label: "דברו איתנו", href: "/contact?source=invoice" },
    cta: { text: "רוצים לשמוע על Tevel Invoice?", label: "דברו איתנו", href: "/contact?source=invoice" },
    pair: [
      { title: "שירותי הפיתוח של תבל", body: "מערכות מידע, CRM, ERP, AI ואוטומציות — בנפרד מהמוצר.", button: { label: "איך עובדים", href: "/pricing" } },
      { title: "שאלות על המוצר", body: "יש שאלה על יכולת מסוימת? נבדוק אותה מול הגרסה הזמינה.", button: { label: "צרו קשר", href: "/contact?source=invoice" }, badge: "Tevel" },
    ],
  },
};
