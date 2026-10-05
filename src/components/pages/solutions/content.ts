// Per-slug copy for /solutions/[slug]. Source: project setup/TEVEL_WEBSITE_MASTER_BRIEF_HE.md §6, §17–21, §29, §31
// and TEVEL_RD_CUSTOM_TECH_LEARNING_MASTER.md §34, §40. No clients, metrics or claims beyond the briefs.

export type Link = { label: string; href: string };
export type Item = { title: string; body: string };

export type SolutionContent = {
  hero: { eyebrow: string; heading: string; lede: string; primary: Link; secondary: Link };
  badge: { title: string; body: string; link: Link };
  featuresTitle: string;
  features: Item[]; // 4
  columns: { title: string; points: { lead: string; body: string }[]; button: Link }[]; // 2 × (2 points)
  cardsTitle: string;
  cards: (Item & { href: string })[]; // 4
  cta: { text: string; label: string };
};

export const solutions: Record<string, SolutionContent> = {
  "business-systems": {
    hero: {
      eyebrow: "Business Systems",
      heading: "מערכות מידע שנבנות סביב העבודה — לא להפך",
      lede: "Back Office, מערכות תפעול, פורטלים ודשבורדים שמותאמים לתהליכים של הארגון. העסק לא צריך לעבוד סביב התוכנה שלו — במקומות שבהם יש הצדקה עסקית, התוכנה צריכה להתאים לתהליך.",
      primary: { label: "בואו נבחן את המערכת שלכם", href: "/contact" },
      secondary: { label: "איך עובדים", href: "/pricing" },
    },
    badge: { title: "Problem First", body: "הפתרון נקבע אחרי הבנת הבעיה, לא לפני", link: { label: "למי זה מתאים", href: "/onboarding" } },
    featuresTitle: "יכולות במערכות מידע",
    features: [
      { title: "Back Office ותפעול", body: "מערכות לניהול הזמנות, משימות, מסמכים ותהליכי עבודה פנימיים במקום אחד." },
      { title: "פורטלים ללקוחות ולעובדים", body: "ממשק אחד שבו כל משתמש רואה את מה שרלוונטי לו, לפי תפקיד והרשאות." },
      { title: "Workflows ותהליכי אישור", body: "תהליכים מוגדרים במקום פעולות שחייבים לזכור, עם סטטוס ברור לכל שלב." },
      { title: "דשבורדים ודוחות", body: "תמונת מצב על בסיס המידע שכבר קיים בארגון, בלי לאסוף אותו ידנית מאקסלים." },
    ],
    columns: [
      {
        title: "הבעיה במערכות מפוצלות",
        points: [
          { lead: "מידע מפוזר", body: "לקוחות, הזמנות ומסמכים יושבים בכמה מערכות ובקבצים, ואף אחת מהן לא מציגה תמונה מלאה." },
          { lead: "עבודה ידנית בין מערכות", body: "העתקה, עדכונים כפולים ותהליכים שרק עובד אחד יודע איך הם עובדים." },
        ],
        button: { label: "אוטומציות ואינטגרציות", href: "/products/integrations" },
      },
      {
        title: "Build vs Buy",
        points: [
          { lead: "כשמוצר מדף מספיק", body: "אם מוצר קיים פותר את הבעיה היטב, אין סיבה לבנות מערכת מיותרת — לעיתים אינטגרציה נכונה מספיקה." },
          { lead: "כש-Custom מוצדק", body: "כאשר התהליך ייחודי ומערכות המדף מאלצות את העסק לעבוד בצורה שאינה מתאימה לו." },
        ],
        button: { label: "מערכות מידע ותוכנה עסקית", href: "/products/information-systems" },
      },
    ],
    cardsTitle: "להמשך קריאה",
    cards: [
      { title: "איך עובדים", body: "מהבעיה ועד מערכת עובדת, ברמת פתרון שמתאימה לכדאיות.", href: "/pricing" },
      { title: "Build vs Buy vs Integrate", body: "איך מחליטים מה לבנות, מה לקנות ומה לחבר.", href: "/blog/build-vs-buy" },
      { title: "כמה עולה תהליך ידני?", body: "איך מעריכים את העלות של עבודה שחוזרת על עצמה.", href: "/blog/manual-process-cost" },
      { title: "רמות פתרון", body: "Focused Fix, Core Transformation או Full Transformation.", href: "/reports" },
    ],
    cta: { text: "ספרו לנו איך המערכות שלכם עובדות היום.", label: "בואו נבחן את המערכת שלכם" },
  },

  "crm-erp": {
    hero: {
      eyebrow: "CRM & ERP",
      heading: "CRM ו-ERP שמתאימים לתהליך שלכם",
      lede: "CRM שמנהל את מחזור החיים האמיתי של הלקוח, ומערכות תפעול שמחברות בין הזמנות, מלאי, ספקים ומסמכים. מפתחים מערכת מותאמת, מרחיבים מערכת קיימת או בונים שכבת עבודה מעליה.",
      primary: { label: "ספרו לנו איך אתם עובדים היום", href: "/contact" },
      secondary: { label: "איך עובדים", href: "/pricing" },
    },
    badge: { title: "לא כל לקוח צריך ERP שלם", body: "לעיתים נכון יותר לבנות מודול או שכבה משלימה", link: { label: "רמות פתרון", href: "/reports" } },
    featuresTitle: "יכולות ב-CRM וב-ERP",
    features: [
      { title: "CRM מקצה לקצה", body: "Lead → Sale → Customer → Service → Retention, עם משימות, Follow-ups והיסטוריית לקוח." },
      { title: "ERP ותפעול", body: "Order → Operations → Inventory → Suppliers → Finance, בהתאם לצורך ולהיקף." },
      { title: "מודולים מותאמים", body: "מודול ייעודי או שכבת Orchestration במקום החלפה של כל המערכת." },
      { title: "אינטגרציות והגירה", body: "חיבור למערכות קיימות והעברת מידע מסודרת ממערכות ישנות." },
    ],
    columns: [
      {
        title: "CRM",
        points: [
          { lead: "יותר מרשימת לקוחות", body: "Leads, Deals, Pipelines, תקשורת והרשאות — CRM שמנהל את הדרך שבה העסק עובד עם הלקוחות." },
          { lead: "להרחיב במקום להחליף", body: "אפשר לפתח CRM מותאם, להרחיב מערכת קיימת או לבנות אינטגרציות ושכבות מעליה." },
        ],
        button: { label: "CRM בהתאמה אישית", href: "/products/custom-crm" },
      },
      {
        title: "ERP",
        points: [
          { lead: "תפעול בהתאם לצורך", body: "רכש, מלאי, ספקים, הזמנות, מחסנים, תהליכי אישור ודוחות." },
          { lead: "בהתאם להיקף", body: "לא כל ארגון צריך ERP מאפס. לעיתים מודול או אינטגרציה למערכות קיימות הם הפתרון הנכון." },
        ],
        button: { label: "ERP ומערכות תפעול", href: "/products/erp-operations" },
      },
    ],
    cardsTitle: "להמשך קריאה",
    cards: [
      { title: "איך עובדים", body: "מהבעיה ועד מערכת עובדת, ברמת פתרון שמתאימה לכדאיות.", href: "/pricing" },
      { title: "מתי Custom CRM מוצדק?", body: "מתי מוצר מדף מספיק ומתי מערכת מותאמת הופכת לנכס.", href: "/blog/when-custom-crm" },
      { title: "Build vs Buy vs Integrate", body: "איך מחליטים מה לבנות, מה לקנות ומה לחבר.", href: "/blog/build-vs-buy" },
      { title: "אוטומציות ואינטגרציות", body: "כשהמערכות הקיימות צריכות לדבר זו עם זו.", href: "/products/integrations" },
    ],
    cta: { text: "ספרו לנו איך אתם עובדים היום. נתחיל משם.", label: "ספרו לנו איך אתם עובדים היום" },
  },

  "ai-automation": {
    hero: {
      eyebrow: "AI & Automation",
      heading: "AI שעובד בתוך העסק — לא לידו",
      lede: "מזהים היכן AI מסוגל ליצור ערך ממשי ומטמיעים אותו בתוך תהליכי העבודה. AI אינו מטרה: אם workflow דטרמיניסטי פשוט עושה את העבודה טוב יותר — אין סיבה להכניס LLM.",
      primary: { label: "בואו נמצא איפה AI באמת יכול לעזור", href: "/contact" },
      secondary: { label: "AI לעסקים", href: "/products/ai-for-business" },
    },
    badge: { title: "AI With Purpose", body: "AI נכנס כשיש לו תפקיד עסקי ברור", link: { label: "מתי לא צריך AI", href: "/blog/when-not-ai" } },
    featuresTitle: "יכולות AI ואוטומציה",
    features: [
      { title: "Agents ו-Copilots", body: "סוכנים ועוזרים פנימיים שפועלים בתוך תהליך מוגדר ובהרשאות מוגדרות." },
      { title: "Knowledge ו-RAG", body: "חיפוש ומענה על בסיס הידע המאושר של הארגון, לא על בסיס ניחוש." },
      { title: "Document AI", body: "OCR, חילוץ נתונים, סיווג וסיכום של מסמכים שנכנסים לעסק." },
      { title: "Workflow automation", body: "תהליכים אוטומטיים ואינטגרציות בין מערכות, עם אישור אנושי היכן שנדרש." },
    ],
    columns: [
      {
        title: "AI או אוטומציה?",
        points: [
          { lead: "אוטומציה דטרמיניסטית", body: "כשהכללים ברורים, אוטומציה פשוטה תהיה לרוב אמינה וזולה יותר." },
          { lead: "AI", body: "כשהמשימה דורשת הבנת טקסט, מסמכים או שיחות — סיווג, חילוץ, סיכום וניתוב." },
        ],
        button: { label: "אוטומציות ואינטגרציות", href: "/products/integrations" },
      },
      {
        title: "שליטה ובקרה",
        points: [
          { lead: "Human approval", body: "פעולות רגישות עוברות אישור אנושי לפני ביצוע." },
          { lead: "Permissions ו-Logging", body: "כל פעולה מתבצעת לפי הרשאות מוגדרות ומתועדת כך שאפשר לבדוק אותה." },
        ],
        button: { label: "AI לעסקים", href: "/products/ai-for-business" },
      },
    ],
    cardsTitle: "להמשך קריאה",
    cards: [
      { title: "איך עובדים", body: "מהבעיה ועד מערכת עובדת, ברמת פתרון שמתאימה לכדאיות.", href: "/pricing" },
      { title: "מתי לא צריך AI?", body: "המקרים שבהם workflow פשוט עדיף על מודל שפה.", href: "/blog/when-not-ai" },
      { title: "איך מזהים תהליך שמתאים לאוטומציה?", body: "סימנים לתהליך שכדאי להפוך לאוטומטי.", href: "/blog/automation-fit" },
      { title: "AI Customer Service", body: "מערכי שירות שמשלבים AI, אוטומציות ונציגים.", href: "/solutions/ai-customer-service" },
    ],
    cta: { text: "ספרו לנו מה לא עובד. נבדוק יחד אם AI הוא התשובה.", label: "בואו נמצא איפה AI באמת יכול לעזור" },
  },

  "ai-customer-service": {
    hero: {
      eyebrow: "AI Customer Service",
      heading: "שירות לקוחות שמסוגל לגדול בלי שהעומס יגדל באותו קצב",
      lede: "אנחנו בונים מערכי שירות שמשלבים AI, אוטומציות ונציגים אנושיים ומחברים אותם לידע ולמערכות של העסק.",
      primary: { label: "תכננו איתנו את מערך השירות הבא שלכם", href: "/contact" },
      secondary: { label: "איך עובדים", href: "/pricing" },
    },
    badge: { title: "AI handles the volume", body: "People handle what needs people", link: { label: "ארכיטקטורה", href: "/blog/ai-service-architecture" } },
    featuresTitle: "Channel → AI Layer → Knowledge → Business Systems → Action → Human Escalation",
    features: [
      { title: "Intent detection", body: "הבנת מטרת הפנייה וזיהוי הלקוח, בכל ערוץ שבו הוא פונה." },
      { title: "Knowledge retrieval", body: "שליפת מידע מאושר והקשר לקוח מתוך הידע והמערכות של העסק." },
      { title: "Approved actions", body: "ביצוע פעולות מוגדרות בלבד: פתיחת קריאה, עדכון מערכת, איסוף פרטים." },
      { title: "Escalation ו-Routing", body: "זיהוי מתי נדרש אדם והעברה לנציג עם ההקשר המלא וסיכום השיחה." },
    ],
    columns: [
      {
        title: "למה שירות מסורתי מתקשה בסקייל",
        points: [
          { lead: "נפח שגדל עם העסק", body: "יותר לקוחות פירושם יותר פניות, ובמודל מסורתי — עוד אנשים לכל גידול." },
          { lead: "עבודה חוזרת", body: "חלק ניכר מהפניות חוזר על עצמו ודורש מידע שכבר קיים במערכות." },
        ],
        button: { label: "AI לעסקים", href: "/products/ai-for-business" },
      },
      {
        title: "מה המערכת יכולה לשפר",
        points: [
          { lead: "תגובה וקיבולת", body: "זמן תגובה קצר יותר, קיבולת גבוהה יותר ושירות עקבי, בהתאם לתהליך." },
          { lead: "Governance", body: "הגדרה ברורה מה מבוצע אוטומטית ומה דורש אדם, עם Analytics ותיעוד." },
        ],
        button: { label: "CRM בהתאמה אישית", href: "/products/custom-crm" },
      },
    ],
    cardsTitle: "להמשך קריאה",
    cards: [
      { title: "איך עובדים", body: "מהבעיה ועד מערכת עובדת, ברמת פתרון שמתאימה לכדאיות.", href: "/pricing" },
      { title: "AI Customer Service Architecture", body: "איך בנויה שכבת השירות מהערוץ ועד הנציג.", href: "/blog/ai-service-architecture" },
      { title: "מתי לא צריך AI?", body: "המקרים שבהם workflow פשוט עדיף על מודל שפה.", href: "/blog/when-not-ai" },
      { title: "תרחישים לדוגמה", body: "איך זה נראה בפועל.", href: "/customer-stories" },
    ],
    cta: { text: "AI מטפל בנפח. אנשים מטפלים במה שדורש אנשים.", label: "תכננו איתנו את מערך השירות הבא שלכם" },
  },

  "web-mobile": {
    hero: {
      eyebrow: "Web & Mobile",
      heading: "מוצרים דיגיטליים שהופכים לחלק מהעסק",
      lede: "אפליקציות מובייל, Web Apps ואתרים — מאפיון ו-UX ועד Backend, השקה ותחזוקה. אנחנו מסתכלים לא רק על נראות, אלא על UX, ביצועים, אינטגרציות, Analytics וניהול.",
      primary: { label: "יש לכם מוצר לבנות?", href: "/contact" },
      secondary: { label: "אפליקציות מובייל", href: "/products/mobile-apps" },
    },
    badge: { title: "UX at the Core", body: "מערכת לא טובה אם קשה להשתמש בה", link: { label: "איך עובדים", href: "/pricing" } },
    featuresTitle: "Discovery → UX → UI → Engineering → QA → Launch → Iteration",
    features: [
      { title: "Mobile", body: "אפליקציות ללקוחות, לעובדים, לשירות ולמוצרים דיגיטליים." },
      { title: "Web Apps", body: "SaaS, פורטלים, דשבורדים ומערכות פנימיות." },
      { title: "Websites", body: "אתרים עסקיים, שיווקיים ומסחריים." },
      { title: "Backend ו-APIs", body: "ארכיטקטורה, אימות משתמשים, התראות ואינטגרציות למערכות העסק." },
    ],
    columns: [
      {
        title: "Mobile",
        points: [
          { lead: "מקצה לקצה", body: "Discovery, Product Strategy, UX/UI, ארכיטקטורה, Backend ופיתוח מובייל." },
          { lead: "אחרי ההשקה", body: "Analytics, Deployment, תחזוקה ופיתוח המשך." },
        ],
        button: { label: "אפליקציות מובייל", href: "/products/mobile-apps" },
      },
      {
        title: "Web",
        points: [
          { lead: "Web Apps", body: "ממשקי SaaS, פורטלים ללקוחות, דשבורדים ומערכות פנימיות." },
          { lead: "אתרים", body: "אתרי תדמית, אתרים שיווקיים ו-E-commerce, עם דגש על conversion וביצועים." },
        ],
        button: { label: "מערכות מידע ותוכנה עסקית", href: "/products/information-systems" },
      },
    ],
    cardsTitle: "להמשך קריאה",
    cards: [
      { title: "איך עובדים", body: "מהבעיה ועד מוצר עובד, ברמת פתרון שמתאימה לכדאיות.", href: "/pricing" },
      { title: "Build vs Buy vs Integrate", body: "איך מחליטים מה לבנות, מה לקנות ומה לחבר.", href: "/blog/build-vs-buy" },
      { title: "אוטומציות ואינטגרציות", body: "חיבור המוצר למערכות שהעסק כבר עובד איתן.", href: "/products/integrations" },
      { title: "R&D", body: "כשאין עדיין פתרון מוכן.", href: "/solutions/rd" },
    ],
    cta: { text: "יש לכם מוצר לבנות? ספרו לנו עליו.", label: "בואו נדבר" },
  },

  rd: {
    hero: {
      eyebrow: "TEVEL R&D — Custom Technology",
      heading: "יש בעיות טכנולוגיות שעדיין אין להן פתרון מוכן",
      lede: "אנחנו חוקרים, מתכננים ובונים פתרונות טכנולוגיים מיוחדים — מ-PoC ואבות-טיפוס ועד מערכות AI, לומדות, Computer Vision, IoT ושילובי תוכנה–חומרה.",
      primary: { label: "תביאו את הבעיה", href: "/contact" },
      secondary: { label: "איך עובד תהליך R&D", href: "/podcast" },
    },
    badge: { title: "לא חייבים Specification", body: "אפשר להגיע עם שאלה: האם אפשר לבנות את זה?", link: { label: "תהליך R&D", href: "/podcast" } },
    featuresTitle: "יכולות R&D",
    features: [
      { title: "Research & Prototyping", body: "מחקר, היתכנות, PoC ואבות-טיפוס." },
      { title: "AI & Computer Vision", body: "מערכות שמבינות טקסט, תמונה, וידאו ומידע." },
      { title: "Robotics & IoT", body: "חיבור בין תוכנה, חיישנים, חומרה והעולם הפיזי." },
      { title: "Learning Technology", body: "לומדות, LMS, Adaptive Learning, AI Tutors ו-Learning Analytics." },
    ],
    columns: [
      {
        title: "When software leaves the screen",
        points: [
          { lead: "תוכנה ועולם פיזי", body: "שכבות התוכנה, המידע, הבקרה וה-AI שמחברות בין מערכות דיגיטליות לחיישנים, ציוד ומוצרים פיזיים." },
          { lead: "חומרה לפי הצורך", body: "תבל מתמקדת במוצר, תוכנה ואינטגרציה, ומשלבת מומחי חומרה ואלקטרוניקה כאשר נדרש." },
        ],
        button: { label: "תהליך R&D", href: "/podcast" },
      },
      {
        title: "מ-PoC למוצר",
        points: [
          { lead: "Research → Feasibility → PoC", body: "ממפים את הבעיה, בודקים מה אפשרי ומה מסוכן, ומוכיחים את ההנחה המרכזית." },
          { lead: "Prototype → Engineering → Production", body: "מחברים את הרכיבים לחוויה, בונים ארכיטקטורה והופכים את הפתרון למערכת שניתן להפעיל." },
        ],
        button: { label: "AI לעסקים", href: "/products/ai-for-business" },
      },
    ],
    cardsTitle: "להמשך קריאה",
    cards: [
      { title: "איך עובדים", body: "שלבי העבודה ורמות הפתרון.", href: "/pricing" },
      { title: "האם כל רעיון ניתן לבנייה?", body: "לא. בשביל זה יש Feasibility ו-PoC.", href: "/podcast" },
      { title: "Web & Mobile", body: "כשהפתרון צריך להפוך למוצר דיגיטלי.", href: "/solutions/web-mobile" },
      { title: "AI & Automation", body: "AI שעובד בתוך העסק — לא לידו.", href: "/solutions/ai-automation" },
    ],
    cta: { text: "לא צריך לדעת איזו טכנולוגיה תפתור את הבעיה. את זה נחקור יחד.", label: "דברו איתנו על הפרויקט" },
  },
};
