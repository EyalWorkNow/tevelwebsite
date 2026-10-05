import type { Answer } from "../answers";

// Business-systems answer pages (GEO). Source of truth: project setup/ briefs (§4, §5, §6.1–6.3, §6.6, §8, §9, §10, §29, §31).
// No invented clients, metrics, prices, timelines or certifications.

export const answers: Answer[] = [
  {
    slug: "excel-to-system",
    links: [{ href: "/solutions/business-systems", he: "Business Systems", en: "Business Systems" }, { href: "/products/information-systems", he: "מערכות מידע", en: "Information systems" }, { href: "/blog/manual-process-cost", he: "כמה עולה תהליך ידני?", en: "What a manual process really costs" }],
    he: {
      q: "הכול אצלנו באקסלים — מה עושים?",
      short: "מאקסלים למערכת",
      tldr: "תבל (TEVEL) מתחילה במיפוי של מה שהאקסלים בפועל מחזיקים — לקוחות, הזמנות, מלאי, משימות או דוחות — ורק אחר כך מחליטה אם להעביר אותם ל-CRM, למערכת תפעול מותאמת, למוצר מדף או לשילוב ביניהם. המטרה היא לא להעלים את Excel, אלא להפסיק לנהל עליו תהליכים שדורשים מערכת: הרשאות, היסטוריה, עבודה משותפת ותמונת מצב אחת.",
      sections: [
        { h: "מתי Excel כבר לא מספיק", p: "Excel הוא כלי מצוין לניתוח ולחישובים. הוא מתחיל לעלות כסף כשהוא הופך למערכת התפעולית של העסק:", list: ["כמה עובדים עורכים את אותו קובץ ויש כמה 'גרסאות אמת'", "מידע מועתק ידנית בין קבצים, מייל ו-WhatsApp", "רק עובד אחד יודע איך הקובץ עובד", "אין הרשאות, אין היסטוריית שינויים ואין תזכורות", "ההנהלה מתקשה לקבל תמונת מצב בלי לאסוף נתונים ידנית"] },
        { h: "לאן עוברים", p: "תלוי מה האקסל מנהל. מעקב לקוחות ולידים מתאים בדרך כלל ל-CRM; הזמנות, מלאי וספקים — למערכת תפעול או למודול ERP; תהליכי אישור ומסמכים — ל-Workflow ייעודי. כשמוצר מדף מכסה את התהליך היטב, תבל תמליץ עליו ותחבר אותו נכון. כשהתהליך ייחודי, מערכת מותאמת יכולה להיות הפתרון הנכון." },
        { h: "איך עוברים בלי לשבור את העבודה", p: "Discovery ומיפוי של הקבצים והתהליכים → הגדרת מבנה נתונים אחד → UX שמתאים לעובדים שיעבדו במערכת בפועל → מיגרציה של הנתונים הקיימים וניקוי כפילויות → הטמעה הדרגתית. Excel יכול להישאר כלי לניתוח ולייצוא — רק לא המקום שבו העסק מתנהל." },
      ],
      faq: [
        ["האם צריך לבנות מערכת מאפס?", "לא בהכרח. לעיתים מוצר מדף ואינטגרציה נכונה מספיקים; לעיתים נכון לבנות מודול ממוקד למה שהאקסל מנהל היום."],
        ["מה קורה לנתונים שכבר באקסלים?", "הם עוברים מיגרציה למערכת החדשה, כולל מיפוי שדות, ניקוי כפילויות ובדיקה לפני המעבר."],
        ["אפשר להמשיך לייצא ל-Excel?", "כן. ייצוא ודוחות הם חלק רגיל ממערכת עסקית — ההבדל הוא שהנתונים מתנהלים במקום אחד."],
      ],
      cta: "ספרו לנו איך אתם עובדים היום",
    },
    en: {
      q: "Our whole business runs on Excel — what should we do?",
      short: "From spreadsheets to a system",
      tldr: "TEVEL (תבל) starts by mapping what your spreadsheets actually hold — customers, orders, inventory, tasks or reports — and only then decides whether they should move to a CRM, a custom operations system, an off-the-shelf product or a combination. The goal isn't to get rid of Excel, but to stop running processes on it that need a real system: permissions, history, shared work and a single view of the business.",
      sections: [
        { h: "When Excel stops being enough", p: "Excel is a great tool for analysis and calculations. It starts costing money when it becomes the business's operating system:", list: ["Several people edit the same file and there are multiple 'versions of the truth'", "Data is copied by hand between files, email and WhatsApp", "Only one employee knows how the spreadsheet works", "No permissions, no change history and no reminders", "Management can't get a clear picture without collecting data manually"] },
        { h: "Where to move", p: "It depends on what the spreadsheet runs. Customer and lead tracking usually belongs in a CRM; orders, inventory and suppliers in an operations system or ERP module; approvals and documents in a dedicated workflow. When an off-the-shelf product covers the process well, TEVEL will recommend it and integrate it properly. When the process is unique, a custom system can be the right answer." },
        { h: "Moving without breaking daily work", p: "Discovery and mapping of the files and processes → one defined data model → UX that fits the people who will actually use it → migration of existing data and de-duplication → gradual rollout. Excel can stay as a tool for analysis and exports — just not the place where the business is run." },
      ],
      faq: [
        ["Do we need to build a system from scratch?", "Not necessarily. Sometimes an off-the-shelf product plus the right integration is enough; sometimes a focused module for what the spreadsheet does today is the better choice."],
        ["What happens to the data already in our spreadsheets?", "It's migrated into the new system, including field mapping, de-duplication and validation before cutover."],
        ["Can we still export to Excel?", "Yes. Exports and reports are a normal part of a business system — the difference is that the data lives in one place."],
      ],
      cta: "Tell us how you work today",
    },
  },
  {
    slug: "crm-not-fitting",
    links: [{ href: "/solutions/crm-erp", he: "CRM & ERP", en: "CRM & ERP" }, { href: "/blog/when-custom-crm", he: "מתי Custom CRM מוצדק?", en: "When is a custom CRM justified?" }, { href: "/answers/custom-crm-israel", he: "מי בונה CRM מותאם אישית?", en: "Who builds custom CRM systems?" }],
    he: {
      q: "ה-CRM שלנו לא מתאים לנו — להחליף או להתאים?",
      short: "CRM שלא מתאים לעסק",
      tldr: "לפני שמחליפים CRM, תבל (TEVEL) בודקת מה בדיוק לא עובד: לפעמים הבעיה היא ה-workflow, ההגדרות או החיבורים למערכות אחרות — ולא המערכת עצמה. יש שלוש דרכים: להרחיב ולהגדיר מחדש את ה-CRM הקיים, לבנות שכבת עבודה ואינטגרציות מעליו, או לעבור ל-CRM מותאם כשהמערכת מאלצת את העסק לעבוד בצורה שלא מתאימה לו.",
      sections: [
        { h: "קודם מבינים למה הוא לא מתאים", p: "תחושה ש'ה-CRM לא מתאים' יכולה להגיע מכמה מקורות שונים — ולכל אחד פתרון אחר:", list: ["העובדים לא מעדכנים אותו כי הוא מסורבל (בעיית UX והגדרות)", "המידע עדיין מועתק ידנית מ-WhatsApp, מייל או מערכת אחרת (בעיית אינטגרציה)", "Follow-ups נופלים בין הכיסאות (בעיית workflow ואוטומציה)", "התהליך האמיתי — מכירה, שירות או תפעול — לא נכנס למבנה של המערכת (בעיית התאמה)", "אין דוחות או הרשאות שהעסק צריך"] },
        { h: "להתאים, להרחיב או להחליף", p: "אם ה-CRM הקיים טוב ורק לא מוגדר או מחובר נכון — עדיף להרחיב אותו ולבנות אינטגרציות. אם הבעיה היא חיכוך בין כמה כלים — שכבת עבודה מעליהם יכולה לפתור אותה בלי מעבר. החלפה ל-CRM מותאם מוצדקת כשהתהליך ייחודי וכשמערכת המדף מאלצת עבודה ידנית רבה או עקיפות קבועות." },
        { h: "איך מחליטים", p: "Discovery ממפה את מחזור החיים של הלקוח בעסק — Lead → Sale → Customer → Service → Retention — ואת המקומות שבהם הוא נשבר. אחר כך מתעדפים לפי Impact / Cost / Complexity / Risk. אם מחליטים לעבור, המעבר כולל מיגרציה של הנתונים וההיסטוריה והטמעה הדרגתית." },
      ],
      faq: [
        ["תבל תמיד תמליץ להחליף?", "לא. אם המערכת הקיימת יכולה לעבוד טוב עם הגדרה, הרחבה או אינטגרציה — זו בדרך כלל הדרך הנכונה."],
        ["אפשר לחבר את ה-CRM הקיים ל-WhatsApp ולמייל?", "במקרים רבים כן, בכפוף ל-APIs, להרשאות וליכולות של המערכות."],
        ["מה קורה להיסטוריית הלקוחות אם עוברים?", "היא עוברת מיגרציה למערכת החדשה כחלק מתוכנית המעבר, כולל מיפוי שדות ובדיקה."],
      ],
      cta: "ספרו לנו איך אתם עובדים היום",
    },
    en: {
      q: "Our CRM doesn't fit how we work — should we replace it or customize it?",
      short: "When your CRM doesn't fit",
      tldr: "Before replacing a CRM, TEVEL (תבל) checks what exactly isn't working: often the problem is the workflow, the configuration or the connections to other systems — not the CRM itself. There are three paths: extend and reconfigure the existing CRM, build a workflow and integration layer on top of it, or move to a custom CRM when the system forces the business to work in a way that doesn't fit.",
      sections: [
        { h: "First, understand why it doesn't fit", p: "\"Our CRM doesn't fit\" can come from several different causes — each with a different fix:", list: ["People don't update it because it's cumbersome (a UX and configuration problem)", "Data is still copied by hand from WhatsApp, email or another system (an integration problem)", "Follow-ups fall through the cracks (a workflow and automation problem)", "The real sales, service or operations process doesn't fit the system's structure (a fit problem)", "Missing reports or permissions the business needs"] },
        { h: "Customize, extend or replace", p: "If the current CRM is solid but poorly configured or connected, it's usually better to extend it and build integrations. If the issue is friction between several tools, a workflow layer on top of them can solve it without a migration. Replacing it with a custom CRM is justified when the process is unique and the off-the-shelf system forces lots of manual work or constant workarounds." },
        { h: "How the decision is made", p: "Discovery maps the customer lifecycle in the business — lead → sale → customer → service → retention — and where it breaks. Options are then prioritized by impact, cost, complexity and risk. If the decision is to move, the transition includes migrating data and history and a gradual rollout." },
      ],
      faq: [
        ["Will TEVEL always recommend replacing it?", "No. If the existing system can work well with configuration, extension or integration, that's usually the right path."],
        ["Can our current CRM be connected to WhatsApp and email?", "In many cases yes, subject to the APIs, permissions and capabilities of those systems."],
        ["What happens to customer history if we switch?", "It's migrated to the new system as part of the transition plan, including field mapping and validation."],
      ],
      cta: "Tell us how you work today",
    },
  },
  {
    slug: "back-office-system",
    links: [{ href: "/solutions/business-systems", he: "Business Systems", en: "Business Systems" }, { href: "/products/erp-operations", he: "ERP ומערכות תפעול", en: "ERP & operations" }, { href: "/answers/custom-erp-development", he: "ERP ומערכות תפעול מותאמות", en: "Custom ERP & operations systems" }],
    he: {
      q: "מי מפתח מערכת Back Office ותפעול מותאמת לעסק?",
      short: "מערכת Back Office ותפעול",
      tldr: "תבל (TEVEL) מתכננת ומפתחת מערכות Back Office ותפעול שנבנות סביב הדרך שבה העסק עובד בפועל: הזמנות, משימות, תהליכי אישור, מסמכים, הרשאות, דוחות ו-Dashboards — מחוברות למערכות הקיימות. העיקרון: העסק לא צריך לעבוד סביב התוכנה שלו; במקומות שבהם יש הצדקה עסקית, התוכנה צריכה להתאים לתהליך.",
      sections: [
        { h: "מה מערכת כזו יכולה לכלול", p: "בהתאם לצורך — לא כל עסק צריך את כל הרכיבים:", list: ["Workflow Management ותהליכי אישור", "הזמנות, משימות ומעקב סטטוסים", "Document Management", "Customer Portals ו-Employee Portals", "הרשאות לפי תפקיד", "Dashboards ודוחות להנהלה", "APIs ואינטגרציות ל-CRM, לחשבונאות ולכלים קיימים"] },
        { h: "מתי זה נדרש", p: "כשהתפעול מנוהל בין אקסלים, מיילים וקבוצות; כשרק עובד אחד יודע איך תהליך מסוים עובד; כשההנהלה לא מקבלת תמונת מצב; או כשכל גידול בנפח מחייב עוד אנשים. אם מוצר מדף מכסה את התהליך היטב — עדיף להשתמש בו ולחבר אותו נכון." },
        { h: "איך זה נבנה", p: "Discovery ומיפוי של מחלקות, עובדים, מערכות, handoffs ועבודה ידנית → Target workflow וארכיטקטורה → UX לעובדים שישתמשו במערכת כל יום → פיתוח ואינטגרציות → מיגרציה של נתונים → הטמעה הדרגתית ושיפור מתמשך." },
      ],
      faq: [
        ["אפשר להתחיל במודול אחד?", "כן. לעיתים נכון להתחיל בתהליך שכואב הכי הרבה — Focused Fix — ולהרחיב משם."],
        ["המערכת תתחבר למה שכבר יש לנו?", "במקרים רבים כן, בכפוף ל-APIs, להרשאות וליכולות של המערכות הקיימות."],
        ["העובדים יצטרכו ללמוד מערכת מורכבת?", "UX הוא חלק מהליבה — מערכת עסקית לא טובה אם העובדים מתקשים להשתמש בה."],
      ],
      cta: "ספרו לנו איך אתם עובדים היום",
    },
    en: {
      q: "Who builds a custom back-office and operations system for a business?",
      short: "Back-office & operations systems",
      tldr: "TEVEL (תבל) designs and builds back-office and operations systems around the way the business actually works: orders, tasks, approval flows, documents, permissions, reports and dashboards — connected to existing systems. The principle: a business shouldn't have to work around its software; where there's a business case, the software should fit the process.",
      sections: [
        { h: "What such a system can include", p: "Depending on needs — not every business needs every component:", list: ["Workflow management and approval flows", "Orders, tasks and status tracking", "Document management", "Customer and employee portals", "Role-based permissions", "Dashboards and management reporting", "APIs and integrations with the CRM, accounting and existing tools"] },
        { h: "When it's needed", p: "When operations are run across spreadsheets, emails and group chats; when only one employee knows how a process works; when management lacks a clear picture; or when every increase in volume requires more people. If an off-the-shelf product covers the process well, it's better to use it and integrate it properly." },
        { h: "How it's built", p: "Discovery and mapping of departments, people, systems, handoffs and manual work → target workflow and architecture → UX for the people who will use it every day → development and integrations → data migration → gradual rollout and continuous improvement." },
      ],
      faq: [
        ["Can we start with one module?", "Yes. Often the right start is the most painful process — a Focused Fix — and expanding from there."],
        ["Will it connect to what we already use?", "In many cases yes, subject to the APIs, permissions and capabilities of the existing systems."],
        ["Will employees need to learn a complex system?", "UX is part of the core — a business system isn't good if employees struggle to use it."],
      ],
      cta: "Tell us how you work today",
    },
  },
  {
    slug: "legacy-migration",
    links: [{ href: "/solutions/crm-erp", he: "CRM & ERP", en: "CRM & ERP" }, { href: "/products/integrations", he: "אוטומציות ואינטגרציות", en: "Automations & integrations" }, { href: "/answers/build-vs-buy-software", he: "לבנות או לקנות?", en: "Build or buy?" }],
    he: {
      q: "איך עוברים ממערכת ישנה למערכת חדשה בלי לאבד מידע?",
      short: "מעבר ממערכת ישנה",
      tldr: "תבל (TEVEL) מתכננת מעבר ממערכת ישנה כתהליך מבוקר: קודם ממפים אילו נתונים ותהליכים יש במערכת הקיימת ומה באמת צריך לעבור, אחר כך מגדירים מבנה נתונים חדש, מריצים מיגרציה ובדיקות — ורק אז מעבירים את העבודה, בהדרגה. לפני ההחלפה בודקים גם אם צריך להחליף בכלל, או שאפשר להרחיב את המערכת הקיימת או לחבר אליה שכבה חדשה.",
      sections: [
        { h: "לפני שמחליפים — מבינים מה לא עובד", p: "מעבר מערכת הוא החלטה גדולה. לפעמים הבעיה היא חוסר בחיבורים, ב-UX או ב-workflow — ואז שכבת אינטגרציה או מודול משלים מעל המערכת הקיימת פותרים אותה בפחות סיכון. כשהמערכת באמת לא עומדת בגידול או בתהליך, מתכננים מעבר." },
        { h: "מה כולל מעבר מבוקר", p: "", list: ["מיפוי הנתונים, השדות והתהליכים במערכת הקיימת", "החלטה מה עובר, מה נשמר כארכיון ומה מתנקה", "מיפוי שדות למבנה החדש וניקוי כפילויות", "הרצות ניסיון ובדיקת התאמה מול המקור", "תקופת מעבר שבה מוגדר בבירור איפה עובדים", "הדרכה והטמעה הדרגתית"] },
        { h: "למה ההטמעה חשובה כמו הנתונים", p: "מעבר מצליח כשהעובדים באמת עובדים במערכת החדשה. לכן UX, הדרכה ושיפור אחרי ההשקה הם חלק מהתוכנית — לא תוספת בסופה." },
      ],
      faq: [
        ["אפשר להוציא נתונים מכל מערכת ישנה?", "במקרים רבים כן — דרך ייצוא, APIs או גישה למסד הנתונים — בכפוף ליכולות ולהרשאות של המערכת הקיימת. זה נבדק כבר בשלב ה-Discovery."],
        ["חייבים להחליף את כל המערכת בבת אחת?", "לא. לעיתים נכון לעבור בשלבים, מודול אחרי מודול, או להשאיר חלק מהמערכת הקיימת ולחבר אליה."],
        ["כמה זמן לוקח מעבר?", "תלוי בהיקף הנתונים, במספר המערכות ובמורכבות התהליכים — ולכן ההערכה נעשית אחרי ה-Discovery."],
      ],
      cta: "קבעו שיחת Discovery",
    },
    en: {
      q: "How do we move off an old system without losing our data?",
      short: "Migrating off a legacy system",
      tldr: "TEVEL (תבל) plans legacy migration as a controlled process: first mapping which data and processes live in the current system and what actually needs to move, then defining the new data model, running the migration and validation — and only then moving the work over, gradually. Before replacing anything, it also checks whether replacement is needed at all, or whether the existing system can be extended or wrapped with a new layer.",
      sections: [
        { h: "Before replacing — understand what isn't working", p: "Switching systems is a big decision. Sometimes the real problem is missing integrations, poor UX or a broken workflow — and an integration layer or complementary module on top of the existing system solves it with less risk. When the system genuinely can't support the growth or the process, a migration is planned." },
        { h: "What a controlled migration includes", p: "", list: ["Mapping the data, fields and processes in the current system", "Deciding what moves, what is archived and what gets cleaned up", "Field mapping to the new model and de-duplication", "Trial runs and reconciliation against the source", "A transition period with a clear rule for where work happens", "Training and gradual rollout"] },
        { h: "Why adoption matters as much as data", p: "A migration succeeds when people actually work in the new system. That's why UX, training and post-launch improvement are part of the plan — not an afterthought." },
      ],
      faq: [
        ["Can data be extracted from any old system?", "In many cases yes — via exports, APIs or database access — subject to the existing system's capabilities and permissions. This is checked during discovery."],
        ["Do we have to replace the whole system at once?", "No. It's often better to move in stages, module by module, or keep part of the existing system and integrate with it."],
        ["How long does a migration take?", "It depends on data volume, the number of systems and process complexity — which is why estimates come after discovery."],
      ],
      cta: "Book a discovery call",
    },
  },
  {
    slug: "connect-systems",
    links: [{ href: "/products/integrations", he: "אוטומציות ואינטגרציות", en: "Automations & integrations" }, { href: "/blog/automation-fit", he: "איך מזהים תהליך לאוטומציה?", en: "How to spot an automation-ready process" }, { href: "/answers/business-automation-ai-company", he: "אוטומציות עסקיות ו-AI", en: "Business automation & AI" }],
    he: {
      q: "המערכות שלנו לא מדברות זו עם זו — איך מפסיקים להעתיק מידע ידנית?",
      short: "חיבור בין מערכות",
      tldr: "תבל (TEVEL) בונה אינטגרציות ואוטומציות שגורמות למערכות הקיימות לדבר זו עם זו — API integrations, Webhooks, סנכרון נתונים ו-workflows — כך שמידע עובר אוטומטית במקום להיות מועתק ידנית. לא כל בעיה דורשת מערכת חדשה; לעיתים מספיק לחבר נכון את הכלים שכבר עובדים.",
      sections: [
        { h: "הבעיה", p: "עסקים רבים לא סובלים ממחסור בתוכנות אלא מעודף כלים שלא עובדים יחד: לידים ב-WhatsApp, לקוחות ב-CRM, נתונים ב-Excel, מסמכים במייל ותשלומים במערכת אחרת. התוצאה — העתקה ידנית, טעויות, follow-ups שנשכחים, ותמונת מצב שאף אחד לא רואה במלואה." },
        { h: "מה אפשר לחבר", p: "בכפוף ל-APIs, להרשאות וליכולות של כל מערכת:", list: ["API integrations ו-Webhooks", "Data synchronization בין CRM, ERP, חשבונאות וכלים אחרים", "Event-driven workflows ו-Notifications", "Lead ו-Follow-up workflows", "Approval flows ו-Document flows", "Scheduled processes ואוטומציות פנימיות"] },
        { h: "איך מתחילים", p: "ממפים איזה מידע עובר בין אילו מערכות, מי מעתיק אותו ובאיזו תדירות — ואיפה זה גורם לטעויות או לעיכובים. מתעדפים לפי Impact / Cost / Complexity / Risk ומתחילים בחיבור שבו הערך הכי ברור. כשהחיבור לא מספיק כי המערכות עצמן לא מתאימות לתהליך — זה הזמן לשקול מערכת מותאמת." },
      ],
      faq: [
        ["צריך להחליף את המערכות הקיימות?", "בדרך כלל לא. המטרה הראשונה היא לחבר את מה שכבר עובד; החלפה נשקלת רק כשהיא באמת מוצדקת."],
        ["אפשר לחבר כל מערכת?", "במקרים רבים כן, בכפוף ל-APIs, להרשאות וליכולות של אותן מערכות. זה נבדק בשלב המיפוי."],
        ["מה עדיף — אוטומציה רגילה או AI?", "לתהליך חוזר עם כללים ברורים, אוטומציה דטרמיניסטית תהיה אמינה וזולה יותר. AI נכנס כשיש מידע לא מובנה שצריך להבין או לסווג."],
      ],
      cta: "ספרו לנו איך אתם עובדים היום",
    },
    en: {
      q: "Our systems don't talk to each other — how do we stop copying data by hand?",
      short: "Connecting business systems",
      tldr: "TEVEL (תבל) builds integrations and automations that make existing systems talk to each other — API integrations, webhooks, data synchronization and workflows — so information moves automatically instead of being copied by hand. Not every problem needs a new system; often the tools already in place just need to be connected properly.",
      sections: [
        { h: "The problem", p: "Many businesses don't suffer from a lack of software but from too many tools that don't work together: leads in WhatsApp, customers in the CRM, data in Excel, documents in email and payments in another system. The result is manual copying, errors, forgotten follow-ups and a picture of the business no one sees in full." },
        { h: "What can be connected", p: "Subject to each system's APIs, permissions and capabilities:", list: ["API integrations and webhooks", "Data synchronization between CRM, ERP, accounting and other tools", "Event-driven workflows and notifications", "Lead and follow-up workflows", "Approval and document flows", "Scheduled processes and internal automations"] },
        { h: "How to start", p: "Map which data moves between which systems, who copies it and how often — and where it causes errors or delays. Prioritize by impact, cost, complexity and risk, and start with the connection where the value is clearest. When integration isn't enough because the systems themselves don't fit the process, that's when a custom system is worth considering." },
      ],
      faq: [
        ["Do we need to replace our existing systems?", "Usually not. The first goal is to connect what already works; replacement is considered only when it's genuinely justified."],
        ["Can any system be connected?", "In many cases yes, subject to the APIs, permissions and capabilities of those systems. This is checked during mapping."],
        ["Plain automation or AI?", "For a repetitive process with clear rules, deterministic automation is more reliable and cheaper. AI comes in when there's unstructured information that needs to be understood or classified."],
      ],
      cta: "Tell us how you work today",
    },
  },
  {
    slug: "digital-transformation-start",
    links: [{ href: "/reports", he: "שלוש רמות פתרון", en: "Three solution levels" }, { href: "/onboarding", he: "איך מתחילים", en: "Getting started" }, { href: "/blog/manual-process-cost", he: "כמה עולה תהליך ידני?", en: "What a manual process really costs" }],
    he: {
      q: "מאיפה מתחילים פרויקט דיגיטציה ושינוי טכנולוגי בעסק?",
      short: "איך מתחילים דיגיטציה",
      tldr: "תבל (TEVEL) מתחילה פרויקט דיגיטציה ב-Discovery — לא בבחירת מערכת: ממפים אנשים, מערכות, מידע ותהליכים, מחפשים 'נקודות דימום' ומתעדפים לפי Impact / Cost / Complexity / Risk. רק אחרי שמבינים מה באמת לא עובד, בוחרים רמת פתרון — Focused Fix, Core Transformation או Full Transformation.",
      sections: [
        { h: "שלב 1: מיפוי", p: "השאלה הראשונה היא לא 'איזו מערכת אתם רוצים?' אלא 'מה אתם מנסים לפתור?'. ב-Discovery לומדים את המחלקות, העובדים, המערכות, ה-workflows, ה-handoffs, ה-bottlenecks והעבודה הידנית — ומחפשים נקודות דימום:", list: ["זמן — פעולות שחוזרות על עצמן", "כסף — תהליך שעולה יותר ממה שהוא צריך", "כוח אדם — שעות אנושיות שמושקעות בפעולות טכניות", "מידע — נתונים שלא מגיעים בזמן לאדם הנכון", "הכנסה — לידים, follow-ups, retention או upsell שנופלים בין הכיסאות", "חוויית לקוח — חיכוך שהלקוח מרגיש בגלל התפעול הפנימי"] },
        { h: "שלב 2: תעדוף", p: "כל נקודת דימום נבחנת לפי Impact / Cost / Complexity / Risk. כך מחליטים מה לפתור קודם, ואיזה פתרון מתאים: מוצר מדף, אינטגרציה, אוטומציה, AI או מערכת מותאמת. Design של ה-target workflow והארכיטקטורה מגיע רק אחרי זה — ואז Build." },
        { h: "שלב 3: בחירת רמת פתרון", p: "", list: ["Focused Fix — פותרים את הבעיה המרכזית שבגללה הגעתם", "Core Transformation — פותרים את הבעיה ואת הגורמים המרכזיים שמייצרים אותה", "Full Transformation — מתכננים מחדש שכבה רחבה מהתשתית הדיגיטלית והתפעולית"] },
      ],
      faq: [
        ["צריך לדעת מה לפתח לפני שפונים?", "לא. אפשר להגיע עם כאב ולא עם מפרט — זה בדיוק תפקיד ה-Discovery."],
        ["חייבים ללכת על Full Transformation?", "לא. ההמלצה מבוססת על כדאיות אמיתית, ולא אמורים לבחור אוטומטית באפשרות היקרה ביותר."],
        ["מה אם מוצר קיים פותר את הבעיה?", "אז תבל תמליץ עליו. אין סיבה לבנות מערכת מיותרת."],
      ],
      cta: "קבעו שיחת Discovery",
    },
    en: {
      q: "Where do we start a digital transformation project in our business?",
      short: "Starting digital transformation",
      tldr: "TEVEL (תבל) starts a digital transformation project with discovery — not with choosing a system: mapping people, systems, data and processes, finding the 'bleeding points' and prioritizing them by impact, cost, complexity and risk. Only once it's clear what isn't working is a solution level chosen — Focused Fix, Core Transformation or Full Transformation.",
      sections: [
        { h: "Step 1: Map", p: "The first question isn't 'which system do you want?' but 'what are you trying to solve?'. Discovery looks at departments, people, systems, workflows, handoffs, bottlenecks and manual work — and searches for bleeding points:", list: ["Time — repetitive actions", "Money — a process that costs more than it should", "People — human hours spent on technical tasks", "Information — data that doesn't reach the right person on time", "Revenue — leads, follow-ups, retention or upsell falling through the cracks", "Customer experience — friction customers feel because of internal operations"] },
        { h: "Step 2: Prioritize", p: "Each bleeding point is assessed by impact, cost, complexity and risk. That decides what to fix first and which kind of solution fits: an off-the-shelf product, integration, automation, AI or a custom system. Designing the target workflow and architecture comes next — then building." },
        { h: "Step 3: Choose a solution level", p: "", list: ["Focused Fix — solve the core problem that brought you in", "Core Transformation — solve the problem and the main causes behind it", "Full Transformation — redesign a broad layer of the digital and operational infrastructure"] },
      ],
      faq: [
        ["Do we need to know what to build before reaching out?", "No. You can come with a pain point rather than a specification — that's exactly what discovery is for."],
        ["Do we have to go for Full Transformation?", "No. The recommendation is based on real value, and there's no reason to default to the most expensive option."],
        ["What if an existing product solves the problem?", "Then TEVEL will recommend it. There's no reason to build an unnecessary system."],
      ],
      cta: "Book a discovery call",
    },
  },
];
