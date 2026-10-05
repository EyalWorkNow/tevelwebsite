import type { Answer } from "../answers";

// Apps & web answer pages. Source of truth: project setup/ briefs.
// No prices, ranges, timelines, clients, statistics or savings percentages.
export const answers: Answer[] = [
  {
    slug: "cost-of-app",
    links: [{ href: "/solutions/web-mobile", he: "Web & Mobile", en: "Web & Mobile" }, { href: "/products/mobile-apps", he: "אפליקציות מובייל", en: "Mobile apps" }, { href: "/pricing", he: "איך מתמחרים פרויקט", en: "How projects are priced" }],
    he: {
      q: "כמה עולה לפתח אפליקציה לעסק?",
      short: "עלות פיתוח אפליקציה",
      tldr: "תבל (TEVEL) לא נותנת מחיר לאפליקציה לפני שמבינים מה היא צריכה לעשות — כי העלות נקבעת בעיקר לפי היקף, פלטפורמות, Backend ואינטגרציות, עומק ה-UX, שימוש ב-AI ותחזוקה. לכן מתחילים ב-Discovery שמגדיר את הבעיה, את ההיקף ואת רמת הפתרון המתאימה, ורק אז מתמחרים.",
      sections: [
        { h: "מה קובע את העלות", p: "שתי אפליקציות שנראות דומות על המסך יכולות להיות שונות מאוד מאחורי הקלעים. הגורמים העיקריים:", list: ["היקף: כמה מסכים, תהליכים וסוגי משתמשים", "פלטפורמות: iOS, Android, Web — או שילוב שלהן", "Backend, APIs ואינטגרציות ל-CRM, ERP, תשלומים ומערכות קיימות", "עומק ה-UX/UI: מסך פונקציונלי מול חוויה שעוצבה ונבדקה מול משתמשים", "AI: האם יש לו תפקיד עסקי ברור, ומה הוא צריך לדעת ולעשות", "Authentication, Notifications, Analytics, אבטחה והרשאות", "תחזוקה, ניטור ופיתוח שוטף אחרי ההשקה"] },
        { h: "למה מתחילים ב-Discovery", p: "הרבה פעמים מה שנראה כמו 'צריך אפליקציה' הוא בעצם תהליך שצריך לסדר, פורטל Web, או חיבור בין מערכות קיימות. Discovery ממפה את המשתמשים, התהליך והמערכות, ומאפשר להעריך עלות על בסיס הגדרה אמיתית — לא על בסיס רשימת פיצ'רים. כשיש אי-ודאות טכנולוגית, אפשר להתחיל ב-PoC או אב-טיפוס לפני פיתוח מלא." },
        { h: "שלוש רמות פתרון", p: "ההמלצה מבוססת על כדאיות, לא על האפשרות היקרה ביותר:", list: ["Focused Fix — פותרים את הבעיה המרכזית שבגללה הגעתם", "Core Transformation — פותרים את הבעיה ואת הגורמים המרכזיים שמייצרים אותה", "Full Transformation — מתכננים מחדש שכבה רחבה מהתשתית הדיגיטלית והתפעולית"] },
      ],
      faq: [
        ["אפשר לקבל הערכת מחיר בטלפון?", "בדרך כלל לא באופן אחראי. מחיר שנותנים לפני שמבינים את ההיקף, האינטגרציות והמשתמשים הוא ניחוש. Discovery קצר מאפשר הערכה שאפשר לעמוד מאחוריה."],
        ["חייבים לפתח גם ל-iOS וגם ל-Android?", "לא תמיד. לפעמים Web App או פורטל עונים על הצורך, ולפעמים מתחילים בפלטפורמה אחת. ההחלטה נגזרת מהמשתמשים ומהשימוש בפועל."],
        ["העלות נגמרת בהשקה?", "לא. אפליקציה עסקית צריכה תחזוקה, עדכונים, ניטור ושיפור לפי השימוש. כדאי לקחת את זה בחשבון כבר בשלב התכנון."],
      ],
      cta: "קבעו שיחת Discovery",
    },
    en: {
      q: "How much does it cost to develop a business app in Israel?",
      short: "Business app development cost",
      tldr: "TEVEL (תבל) doesn't quote a price for an app before understanding what it needs to do — because cost is driven mainly by scope, platforms, backend and integrations, UX depth, AI and maintenance. Work starts with discovery to define the problem, the scope and the right solution level, and only then is the project priced.",
      sections: [
        { h: "What drives the cost", p: "Two apps that look similar on screen can be very different underneath. The main drivers:", list: ["Scope: how many screens, workflows and user types", "Platforms: iOS, Android, web — or a combination", "Backend, APIs and integrations with CRM, ERP, payments and existing systems", "UX/UI depth: a functional screen versus an experience designed and tested with users", "AI: whether it has a clear business role, and what it needs to know and do", "Authentication, notifications, analytics, security and permissions", "Maintenance, monitoring and ongoing development after launch"] },
        { h: "Why discovery comes first", p: "What looks like 'we need an app' is often a process that needs fixing, a web portal, or a connection between existing systems. Discovery maps the users, the process and the systems, so cost can be estimated from a real definition rather than a feature list. Where there's technical uncertainty, a PoC or prototype can come before full development." },
        { h: "Three solution levels", p: "The recommendation is based on real value, not on the most expensive option:", list: ["Focused Fix — solve the core problem you came with", "Core Transformation — solve the problem and the main causes behind it", "Full Transformation — redesign a broad layer of the digital and operational infrastructure"] },
      ],
      faq: [
        ["Can we get a price estimate over the phone?", "Usually not responsibly. A price given before understanding the scope, integrations and users is a guess. A short discovery phase produces an estimate you can rely on."],
        ["Do we need both iOS and Android?", "Not always. Sometimes a web app or portal meets the need, and sometimes you start with one platform. The decision follows the users and real usage."],
        ["Does the cost end at launch?", "No. A business app needs maintenance, updates, monitoring and improvement based on usage — worth planning for from the start."],
      ],
      cta: "Book a discovery call",
    },
  },
  {
    slug: "customer-portal-dashboard",
    links: [{ href: "/solutions/web-mobile", he: "Web & Mobile", en: "Web & Mobile" }, { href: "/products/information-systems", he: "מערכות מידע", en: "Information systems" }, { href: "/products/integrations", he: "אוטומציות ואינטגרציות", en: "Automations & integrations" }],
    he: {
      q: "מי מפתח פורטל לקוחות ודשבורד ניהולי לעסק?",
      short: "פורטל לקוחות ודשבורדים",
      tldr: "תבל (TEVEL) מפתחת Customer Portals ו-Dashboards כחלק מהתשתית של העסק — מחוברים ל-CRM, ל-ERP ולמערכות שבהן הנתונים באמת נמצאים. פורטל נותן ללקוחות לראות ולעשות דברים בעצמם, ודשבורד נותן להנהלה תמונת מצב אחת במקום לאסוף אותה מכמה קבצים ומערכות.",
      sections: [
        { h: "מה פורטל לקוחות יכול לכלול", p: "בהתאם לתהליך ולהרשאות:", list: ["כניסה מאובטחת וזיהוי לקוח (Authentication)", "סטטוס הזמנות, פניות או פרויקטים", "מסמכים, חשבוניות והיסטוריה", "פתיחת בקשות ומעקב אחריהן", "עדכון פרטים ותקשורת עם העסק", "Notifications על שינויים רלוונטיים"] },
        { h: "דשבורד שעונה על שאלות אמיתיות", p: "דשבורד טוב לא מתחיל בגרפים אלא בשאלה: מה צריך לדעת, מי צריך לדעת את זה ומתי. משם מגדירים מקורות נתונים, הרשאות ותצוגות לכל תפקיד. כשהנתונים מפוזרים בין Excel, CRM ומערכות אחרות — עיקר העבודה הוא באינטגרציה ובסנכרון, לא בתצוגה." },
        { h: "איך זה נבנה", p: "Discovery ומיפוי המשתמשים והנתונים → UX ואפיון → Architecture, APIs ואינטגרציות → פיתוח ו-QA → השקה, Analytics ושיפור לפי השימוש בפועל. לפעמים כלי פנימי ממוקד — Admin Panel או Operations Console — הוא כל מה שנדרש." },
      ],
      faq: [
        ["הפורטל יכול לעבוד על המערכות שכבר יש לנו?", "במקרים רבים כן, בכפוף ל-APIs, להרשאות וליכולות של המערכות הקיימות. לעיתים בונים שכבת אינטגרציה שמזינה את הפורטל."],
        ["כל משתמש יראה רק את מה שמותר לו?", "כן — הרשאות לפי לקוח, תפקיד ומחלקה מוגדרות כבר בשלב האפיון."],
        ["צריך פורטל או אפליקציה?", "תלוי איך ומתי המשתמשים עובדים. במקרים רבים Web App מספיק; כשיש צורך בשימוש מהנייד, Notifications או עבודה בשטח — אפליקציה יכולה להתאים יותר."],
      ],
      cta: "יש לכם מוצר לבנות?",
    },
    en: {
      q: "Who develops customer portals and business dashboards?",
      short: "Customer portals & dashboards",
      tldr: "TEVEL (תבל) builds customer portals and dashboards as part of the business's infrastructure — connected to the CRM, ERP and the systems where the data actually lives. A portal lets customers see and do things themselves; a dashboard gives management one clear picture instead of piecing it together from files and systems.",
      sections: [
        { h: "What a customer portal can include", p: "Depending on the process and permissions:", list: ["Secure login and customer identification (authentication)", "Status of orders, requests or projects", "Documents, invoices and history", "Opening and tracking requests", "Updating details and communicating with the business", "Notifications on relevant changes"] },
        { h: "A dashboard that answers real questions", p: "A good dashboard doesn't start with charts but with a question: what needs to be known, by whom and when. From there come data sources, permissions and views per role. When data is scattered across Excel, the CRM and other systems, most of the work is integration and sync, not display." },
        { h: "How it's built", p: "Discovery and mapping of users and data → UX and specification → architecture, APIs and integrations → development and QA → launch, analytics and improvement based on real usage. Sometimes a focused internal tool — an admin panel or operations console — is all that's needed." },
      ],
      faq: [
        ["Can the portal run on the systems we already have?", "In many cases yes, subject to the APIs, permissions and capabilities of the existing systems. Sometimes an integration layer is built to feed the portal."],
        ["Will each user see only what they're allowed to?", "Yes — permissions by customer, role and department are defined during specification."],
        ["Do we need a portal or an app?", "It depends on how and when users work. A web app is often enough; when mobile use, notifications or field work matter, an app may fit better."],
      ],
      cta: "Have a product to build?",
    },
  },
  {
    slug: "business-website-integrated",
    links: [{ href: "/solutions/web-mobile", he: "Web & Mobile", en: "Web & Mobile" }, { href: "/products/custom-crm", he: "CRM בהתאמה אישית", en: "Custom CRM" }, { href: "/answers/custom-crm-israel", he: "CRM מותאם אישית בישראל", en: "Custom CRM in Israel" }],
    he: {
      q: "מי בונה אתר לעסק שמחובר ל-CRM ולניהול לידים?",
      short: "אתר עסקי מחובר למערכות",
      tldr: "תבל (TEVEL) בונה אתרים עסקיים שמחוברים ל-CRM ולתהליכי הלידים של העסק, כך שכל פנייה מהאתר נכנסת למערכת, מנותבת לאדם הנכון ומקבלת Follow-up. האתר נבנה לא רק לנראות, אלא גם ל-UX, ל-conversion, לביצועים, לאינטגרציות ול-Analytics.",
      sections: [
        { h: "למה אתר יפה לא מספיק", p: "כשליד מהאתר מגיע למייל, מועתק ידנית ל-Excel או ל-CRM ומחכה שמישהו ייזכר לחזור אליו — חלק מהפניות נופלות בין הכיסאות. אתר עסקי צריך להיות תחילת התהליך, לא תיבת דואר נפרדת." },
        { h: "מה אתר מחובר כולל", p: "בהתאם לצורך:", list: ["UX ומבנה עמודים שמובילים לפעולה ברורה", "טפסים וערוצי פנייה שמזינים ישירות את ה-CRM", "Lead workflows: ניתוב, שיוך לאחראי ומשימות Follow-up", "Notifications לצוות על פנייה חדשה", "Performance ו-SEO טכני", "Analytics שמראה מאיפה הגיעו הפניות ומה קרה איתן", "ממשק ניהול תוכן שהצוות יכול לעבוד איתו"] },
        { h: "איך עובדים", p: "מתחילים במיפוי מסלול הליד: מאיפה הוא מגיע, מי מטפל בו ומה קורה אחרי. משם נגזרים מבנה האתר, האינטגרציות והמדידה. Discovery → UX → UI → Engineering → QA → Launch → Iteration." },
      ],
      faq: [
        ["האתר יכול להתחבר ל-CRM שכבר יש לנו?", "במקרים רבים כן, בכפוף ל-APIs ולהרשאות של ה-CRM. אם אין CRM מתאים, אפשר לבחון מוצר קיים, הרחבה או מערכת מותאמת."],
        ["תבל בונה גם אתרי E-commerce?", "כן — אתרי חברה, אתרי שיווק ו-E-commerce, ומערכות Web."],
        ["אפשר לחבר גם WhatsApp ומייל לאותו תהליך?", "במקרים רבים כן, בהתאם ליכולות ולהרשאות של כל ערוץ, כך שכל הפניות מתרכזות במקום אחד."],
      ],
      cta: "ספרו לנו איך אתם עובדים היום",
    },
    en: {
      q: "Who builds a business website connected to the CRM and lead management?",
      short: "Business website connected to systems",
      tldr: "TEVEL (תבל) builds business websites connected to the company's CRM and lead workflows, so every inquiry from the site enters the system, is routed to the right person and gets a follow-up. The site is built not just for looks but for UX, conversion, performance, integrations and analytics.",
      sections: [
        { h: "Why a good-looking site isn't enough", p: "When a website lead lands in an inbox, is copied by hand into Excel or the CRM and waits for someone to remember to call back, some inquiries fall through the cracks. A business website should be the start of the process, not a separate mailbox." },
        { h: "What a connected website includes", p: "Depending on the need:", list: ["UX and page structure that lead to a clear action", "Forms and contact channels that feed the CRM directly", "Lead workflows: routing, owner assignment and follow-up tasks", "Team notifications on new inquiries", "Performance and technical SEO", "Analytics showing where inquiries came from and what happened to them", "A content management interface the team can actually use"] },
        { h: "How we work", p: "Start by mapping the lead journey: where it comes from, who handles it and what happens next. Site structure, integrations and measurement follow from that. Discovery → UX → UI → engineering → QA → launch → iteration." },
      ],
      faq: [
        ["Can the website connect to the CRM we already use?", "In many cases yes, subject to the CRM's APIs and permissions. If there's no suitable CRM, an off-the-shelf product, an extension or a custom system can be considered."],
        ["Does TEVEL build e-commerce sites too?", "Yes — corporate, marketing and e-commerce websites, as well as web systems."],
        ["Can WhatsApp and email be part of the same flow?", "In many cases yes, depending on each channel's capabilities and permissions, so all inquiries end up in one place."],
      ],
      cta: "Tell us how you work today",
    },
  },
  {
    slug: "field-employee-app",
    links: [{ href: "/products/mobile-apps", he: "אפליקציות מובייל", en: "Mobile apps" }, { href: "/products/erp-operations", he: "ERP ומערכות תפעול", en: "ERP & operations" }, { href: "/solutions/business-systems", he: "Business Systems", en: "Business Systems" }],
    he: {
      q: "איך מפתחים אפליקציה פנימית לעובדי שטח?",
      short: "אפליקציה לעובדי שטח",
      tldr: "תבל (TEVEL) מפתחת אפליקציות פנימיות לעובדי שטח ולצוותי תפעול, שמחוברות למערכות של העסק — משימות, טפסים, דיווחים ומסמכים עוברים מהשטח ישירות למשרד בלי הקלדה כפולה. התהליך מתחיל בהבנת יום העבודה האמיתי של העובדים, כי אפליקציה שלא נוחה לשימוש בשטח פשוט לא תשמש.",
      sections: [
        { h: "מה אפליקציה לעובדי שטח יכולה לעשות", p: "בהתאם לתהליך ולהרשאות:", list: ["לקבל משימות, שיבוצים ועדכונים", "למלא טפסים, דוחות ורשימות בדיקה", "לצלם, לצרף מסמכים ולאסוף חתימות", "לעדכן סטטוס בזמן אמת", "לגשת למידע על לקוח, אתר או הזמנה", "לקבל Notifications על שינויים"] },
        { h: "UX לעבודה בשטח", p: "עובד בשטח עובד בתנאים אחרים מעובד מול מחשב: מסך קטן, זמן קצר, לפעמים בלי קליטה טובה. לכן ה-UX נבנה סביב מעט פעולות ברורות, טפסים קצרים ומה שקורה כשאין חיבור. מערכת עסקית לא טובה אם העובדים מתקשים להשתמש בה." },
        { h: "החיבור למשרד", p: "הערך האמיתי הוא בחיבור: מה שמדווח בשטח מגיע ל-CRM, ל-ERP או למערכת התפעול, ומשם לדשבורד של ההנהלה. כך מצטמצמים העתקות ידניות, טעויות ופערי מידע בין השטח למשרד." },
      ],
      faq: [
        ["האפליקציה תעבוד גם בלי קליטה?", "אפשר לתכנן אותה כך שתשמור נתונים במכשיר ותסנכרן כשיש חיבור — זה מוגדר כבר באפיון, לפי אופי העבודה."],
        ["היא תתחבר למערכות שכבר יש לנו?", "במקרים רבים כן, בכפוף ל-APIs, להרשאות וליכולות של אותן מערכות."],
        ["אפשר להתחיל בתהליך אחד?", "כן. לעיתים Focused Fix — למשל דיווח עבודה או טופס אחד — הוא נקודת ההתחלה הנכונה, ומרחיבים לפי השימוש."],
      ],
      cta: "ספרו לנו איך אתם עובדים היום",
    },
    en: {
      q: "How do you develop an internal app for field employees?",
      short: "Field employee app",
      tldr: "TEVEL (תבל) builds internal apps for field and frontline teams, connected to the company's systems — tasks, forms, reports and documents move from the field straight to the office without double entry. The process starts with understanding the employees' real working day, because an app that's awkward to use in the field simply won't get used.",
      sections: [
        { h: "What a field employee app can do", p: "Depending on the process and permissions:", list: ["Receive tasks, assignments and updates", "Fill in forms, reports and checklists", "Take photos, attach documents and collect signatures", "Update status in real time", "Access information about a customer, site or order", "Receive notifications on changes"] },
        { h: "UX for field work", p: "Field employees work in different conditions than someone at a desk: small screen, little time, sometimes poor reception. So the UX is built around a few clear actions, short forms and what happens when there's no connection. A business system isn't good if employees struggle to use it." },
        { h: "The connection to the office", p: "The real value is in the connection: what's reported in the field reaches the CRM, ERP or operations system, and from there management's dashboard. That reduces manual copying, errors and information gaps between the field and the office." },
      ],
      faq: [
        ["Will the app work without reception?", "It can be designed to store data on the device and sync when a connection is available — defined during specification, based on the nature of the work."],
        ["Will it connect to the systems we already have?", "In many cases yes, subject to the APIs, permissions and capabilities of those systems."],
        ["Can we start with a single process?", "Yes. Sometimes a Focused Fix — such as a work report or a single form — is the right starting point, expanded based on usage."],
      ],
      cta: "Tell us how you work today",
    },
  },
  {
    slug: "high-volume-support",
    links: [{ href: "/solutions/ai-customer-service", he: "AI Customer Service", en: "AI Customer Service" }, { href: "/blog/ai-service-architecture", he: "ארכיטקטורת שירות מבוסס AI", en: "AI service architecture" }, { href: "/answers/ai-customer-service", he: "איך מקימים שירות לקוחות מבוסס AI", en: "Setting up AI customer service" }],
    he: {
      q: "יש לנו יותר מדי פניות למוקד השירות — מה עושים?",
      short: "עומס פניות במוקד השירות",
      tldr: "תבל (TEVEL) בונה מערכי שירות שמשלבים AI, אוטומציות ונציגים אנושיים, כדי שהמוקד יוכל לגדול בלי שהעומס יגדל באותו קצב. AI מטפל בנפח ובפעולות המתאימות, אוטומציות מבצעות את מה שחוזר על עצמו, ואנשים מטפלים במקרים שדורשים אדם.",
      sections: [
        { h: "מתחילים בהבנת הפניות", p: "לפני שמוסיפים טכנולוגיה, ממפים: אילו סוגי פניות מגיעים, באילו ערוצים, כמה מהן חוזרות על עצמן, איזה מידע הנציג צריך כדי לענות ואילו פעולות הוא מבצע במערכות. לעיתים חלק מהעומס נוצר מתפעול פנימי — סטטוס שהלקוח לא יכול לראות בעצמו, או מידע שלא מגיע בזמן." },
        { h: "שלוש שכבות שעובדות יחד", p: "Channel → AI Layer → Knowledge → Business Systems → Action → Human Escalation:", list: ["AI: זיהוי מטרת הפנייה, מענה ממידע מאושר בלבד, איסוף פרטים וסיכום שיחה", "אוטומציה: פתיחת קריאה, עדכון מערכת, ניתוב ופעולות מוגדרות מראש", "נציגים: מקרים מורכבים, רגישים או חריגים — עם ההקשר המלא כבר מולם", "Self-service: פורטל או עדכוני סטטוס שמונעים חלק מהפניות מלכתחילה"] },
        { h: "Governance ותוצאות", p: "מגדירים מראש אילו פעולות מותרות לביצוע אוטומטי, מאילו מקורות מותר לענות, מה מתועד ומתי חובה להעביר לאדם. התוצאות האפשריות: זמן תגובה קצר יותר, קיבולת גבוהה יותר, שירות עקבי ופחות עבודה חוזרת. תבל לא מבטיחה אחוז חיסכון קבוע — התוצאה תלויה בתהליכים ובנתונים של כל עסק." },
      ],
      faq: [
        ["הפתרון הוא להחליף נציגים ב-AI?", "לא. המטרה היא שה-AI ייקח את הנפח והפעולות המתאימות, והנציגים יתפנו למקרים שבאמת צריכים אדם."],
        ["זה עובד ב-WhatsApp, בצ'אט ובמייל?", "בערוצים שהעסק משתמש בהם, בהתאם ליכולות ולהרשאות של כל ערוץ."],
        ["צריך להחליף את מערכת השירות הקיימת?", "לא בהכרח. במקרים רבים בונים את השכבה החדשה מעל המערכות הקיימות ומחברים אותן ב-APIs."],
      ],
      cta: "תכננו איתנו את מערך השירות הבא שלכם",
    },
    en: {
      q: "Our support center gets too many inquiries — what should we do?",
      short: "High support volume",
      tldr: "TEVEL (תבל) builds service operations that combine AI, automation and human agents, so a support center can grow without the workload growing at the same rate. AI handles the volume and suitable actions, automation runs what repeats, and people handle what needs people.",
      sections: [
        { h: "Start by understanding the inquiries", p: "Before adding technology, map it out: which types of inquiries arrive, on which channels, how many repeat, what information an agent needs to answer and which actions they take in which systems. Sometimes part of the load comes from internal operations — a status the customer can't see themselves, or information that doesn't arrive in time." },
        { h: "Three layers working together", p: "Channel → AI layer → knowledge → business systems → action → human escalation:", list: ["AI: detecting intent, answering from approved information only, collecting details and summarizing conversations", "Automation: opening tickets, updating systems, routing and predefined actions", "Agents: complex, sensitive or unusual cases — with full context already in front of them", "Self-service: a portal or status updates that prevent some inquiries in the first place"] },
        { h: "Governance and outcomes", p: "Defined up front: which actions may run automatically, which sources answers may come from, what is logged and when escalation to a person is mandatory. Possible outcomes: faster response times, higher capacity, consistent service and less repetitive work. TEVEL does not promise a fixed savings percentage — results depend on each company's processes and data." },
      ],
      faq: [
        ["Is the answer to replace agents with AI?", "No. The goal is for AI to take the volume and suitable actions, freeing agents for the cases that genuinely need a person."],
        ["Does it work on WhatsApp, chat and email?", "On the channels the business uses, subject to each channel's capabilities and permissions."],
        ["Do we need to replace our existing service system?", "Not necessarily. In many cases the new layer is built on top of existing systems and connected through APIs."],
      ],
      cta: "Plan your next service operation with us",
    },
  },
];
