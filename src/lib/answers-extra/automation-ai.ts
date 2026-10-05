import type { Answer } from "../answers";

// Answer pages: automation & AI cluster. Source of truth: project setup/ briefs (§6.4–6.6, §19–20, §29, §31, R&D §44).
// No invented clients, metrics, prices, timelines, accuracy figures or certifications.

export const answers: Answer[] = [
  {
    slug: "whatsapp-crm-integration",
    links: [{ href: "/products/integrations", he: "אוטומציות ואינטגרציות", en: "Automations & integrations" }, { href: "/products/custom-crm", he: "CRM בהתאמה אישית", en: "Custom CRM" }, { href: "/answers/ai-customer-service", he: "שירות לקוחות מבוסס AI", en: "AI customer service" }],
    he: {
      q: "איך מחברים WhatsApp ל-CRM?",
      short: "חיבור WhatsApp ל-CRM",
      tldr: "תבל (TEVEL) מחברת WhatsApp ל-CRM דרך שכבת אינטגרציה שמבוססת על WhatsApp Business API הרשמי — ישירות או דרך ספק שמספק גישה אליו — כך שכל שיחה נרשמת אצל הלקוח הנכון, לידים נפתחים אוטומטית ו-Follow-ups לא נשכחים. מה בדיוק אפשר לבצע תלוי ביכולות, במדיניות ובהרשאות של הפלטפורמה ושל ה-CRM שלכם, ולכן מתחילים במיפוי התהליך ולא בבחירת כלי.",
      sections: [
        { h: "למה זה בכלל בעיה", p: "בעסקים רבים לידים ושיחות נמצאים ב-WhatsApp, הלקוחות ב-CRM והמידע עובר ביניהם ידנית — או לא עובר בכלל. התוצאה: פניות שלא טופלו, היסטוריה שנמצאת בטלפון של עובד אחד ותמונת מצב חלקית. החיבור נועד להפוך את WhatsApp לערוץ שמזין את המערכת, לא למערכת מקבילה." },
        { h: "מה חיבור כזה יכול לכלול", p: "בהתאם ליכולות ה-API, ל-CRM ולהרשאות:", list: ["זיהוי הפונה ושיוך השיחה ל-Contact או ל-Lead קיים", "פתיחת ליד חדש מהודעה נכנסת וניתוב לאיש המכירות או הנציג המתאים", "תיעוד הודעות והיסטוריית לקוח בתוך ה-CRM", "שליחת הודעות מתוך ה-CRM, כולל הודעות תבנית (Templates) מאושרות כשהן נדרשות", "תזכורות ו-Follow-ups אוטומטיים לפי סטטוס", "שכבת AI אופציונלית לסיווג פניות, סיכום שיחה או מענה ראשוני — רק כשיש לה תפקיד ברור"] },
        { h: "מה חשוב לבדוק מראש", p: "WhatsApp Business API כפוף למדיניות של הפלטפורמה: הסכמת לקוח (Opt-in), כללים לגבי הודעות יזומות ותבניות, ועלויות שימוש שנקבעות על ידי הפלטפורמה. חיבור דרך פתרונות לא רשמיים עלול להפר את תנאי השימוש ולסכן את המספר. בנוסף בודקים מה ה-CRM הקיים מאפשר (API, Webhooks, הרשאות) — ולפעמים עדיף לבנות שכבת עבודה ייעודית מעליו." },
      ],
      faq: [
        ["אפשר לחבר WhatsApp ל-CRM שכבר יש לנו?", "במקרים רבים כן, בכפוף ל-APIs, להרשאות וליכולות של ה-CRM ושל WhatsApp Business API."],
        ["אפשר להשתמש באפליקציית WhatsApp Business הרגילה?", "האפליקציה מתאימה לעבודה ידנית. לחיבור מערכתי ואוטומציות נדרש בדרך כלל WhatsApp Business API, ישירות או דרך ספק שמספק אליו גישה."],
        ["האם WhatsApp יכול לענות ללקוחות אוטומטית?", "כן, בכפוף למדיניות הפלטפורמה. מגדירים מראש מה נענה אוטומטית, מאילו מקורות מאושרים ומתי השיחה עוברת לנציג אנושי עם ההקשר המלא."],
      ],
      cta: "ספרו לנו איך אתם עובדים היום",
    },
    en: {
      q: "How do we connect WhatsApp to our CRM?",
      short: "WhatsApp–CRM integration",
      tldr: "TEVEL (תבל) connects WhatsApp to CRM systems through an integration layer built on the official WhatsApp Business API — directly or through a provider that offers access to it — so every conversation is logged against the right customer, leads are created automatically and follow-ups aren't forgotten. What's possible depends on the capabilities, policies and permissions of the platform and of your CRM, so work starts by mapping the process, not by picking a tool.",
      sections: [
        { h: "Why this is a problem in the first place", p: "In many businesses leads and conversations live in WhatsApp, customers live in the CRM and information moves between them by hand — or not at all. The result: unanswered inquiries, history stuck on one employee's phone and an incomplete picture. The integration turns WhatsApp into a channel that feeds the system, not a parallel system." },
        { h: "What such an integration can include", p: "Depending on the API, the CRM and permissions:", list: ["Identifying the sender and linking the conversation to an existing contact or lead", "Creating a new lead from an incoming message and routing it to the right salesperson or agent", "Logging messages and customer history inside the CRM", "Sending messages from the CRM, including approved template messages where required", "Automatic reminders and follow-ups based on status", "An optional AI layer for classifying requests, summarizing conversations or first responses — only where it has a clear role"] },
        { h: "What to check up front", p: "The WhatsApp Business API is subject to the platform's policies: customer opt-in, rules for business-initiated messages and templates, and usage costs set by the platform. Connecting through unofficial workarounds can breach the terms of service and put the number at risk. We also check what the existing CRM allows (API, webhooks, permissions) — sometimes it's better to build a dedicated workflow layer on top of it." },
      ],
      faq: [
        ["Can WhatsApp connect to the CRM we already have?", "In many cases yes, subject to the APIs, permissions and capabilities of the CRM and of the WhatsApp Business API."],
        ["Can we use the regular WhatsApp Business app?", "The app suits manual work. A system integration with automations usually requires the WhatsApp Business API, directly or through a provider that offers access to it."],
        ["Can WhatsApp reply to customers automatically?", "Yes, within the platform's policies. We define up front what is answered automatically, from which approved sources, and when the conversation moves to a human agent with full context."],
      ],
      cta: "Tell us how you work today",
    },
  },
  {
    slug: "lead-automation",
    links: [{ href: "/products/integrations", he: "אוטומציות ואינטגרציות", en: "Automations & integrations" }, { href: "/blog/automation-fit", he: "איך מזהים תהליך לאוטומציה?", en: "How to spot an automation-ready process" }, { href: "/answers/whatsapp-crm-integration", he: "איך מחברים WhatsApp ל-CRM?", en: "How to connect WhatsApp to a CRM" }],
    he: {
      q: "איך עושים אוטומציה לטיפול בלידים ול-Follow-ups?",
      short: "אוטומציה ללידים ו-Follow-ups",
      tldr: "תבל (TEVEL) בונה Lead workflows ו-Follow-up workflows שקולטים לידים מכל הערוצים, מתעדים אותם במקום אחד, מנתבים אותם לאדם הנכון ומזכירים — או מבצעים — את הצעד הבא בזמן. המטרה היא שלידים ו-Follow-ups לא ייפלו בין הכיסאות, בלי להוסיף עוד כלי שצריך לזכור לבדוק.",
      sections: [
        { h: "איפה לידים הולכים לאיבוד", p: "ליד מגיע מטופס באתר, משיחה, מ-WhatsApp או מקמפיין — ונשאר במייל, באקסל או בטלפון של עובד. אף אחד לא בטוח מי אחראי, ה-Follow-up תלוי בזיכרון, וההנהלה לא רואה כמה לידים באמת טופלו. זו בדיוק 'נקודת דימום' של הכנסה." },
        { h: "מה אפשר לאוטמט", p: "בהתאם למערכות הקיימות ולהרשאות:", list: ["קליטת לידים מטפסים, WhatsApp, מייל ומקורות נוספים לתוך CRM אחד", "מניעת כפילויות ושיוך לאיש קשר או לחברה קיימים", "ניתוב לפי כללים: אזור, מוצר, זמינות או סוג פנייה", "הודעת אישור ללקוח והתראה לאיש המכירות", "משימות ותזכורות Follow-up לפי שלב ב-Pipeline", "התראה כשליד לא טופל בזמן שהוגדר", "AI לסיווג או לסיכום פנייה לא מובנית — רק כשהכללים לא מספיקים"] },
        { h: "איך ניגשים לזה", p: "ממפים את מסלול הליד בפועל — מאיפה הוא מגיע, מי נוגע בו ומה קורה כשאף אחד לא נוגע. רוב השלבים מתאימים לאוטומציה דטרמיניסטית עם כללים ברורים, שהיא אמינה וזולה יותר. מגדירים נקודות שבהן נדרש שיקול דעת אנושי, ובונים את האוטומציה בתוך ה-CRM הקיים או מעליו." },
      ],
      faq: [
        ["צריך CRM חדש כדי לעשות אוטומציה ללידים?", "לא בהכרח. לעיתים מספיק לחבר את המערכות הקיימות ולבנות מעליהן workflow; לעיתים ה-CRM הקיים הוא חלק מהבעיה."],
        ["האם ה-Follow-ups יישלחו ללקוחות אוטומטית?", "רק אם זה מתאים לתהליך ולמדיניות של הערוץ. לעיתים נכון יותר שהאוטומציה תיצור משימה ותזכיר לאיש המכירות, והשיחה עצמה תישאר אנושית."],
        ["איך יודעים שזה עובד?", "מגדירים מראש מה מודדים — למשל לידים שלא טופלו וזמן עד מענה ראשון — ובודקים את המצב לפני ואחרי, על הנתונים של העסק."],
      ],
      cta: "ספרו לנו איך אתם עובדים היום",
    },
    en: {
      q: "How do we automate lead handling and follow-ups?",
      short: "Lead & follow-up automation",
      tldr: "TEVEL (תבל) builds lead and follow-up workflows that capture leads from every channel, record them in one place, route them to the right person and remind — or perform — the next step on time. The goal is that leads and follow-ups stop falling through the cracks, without adding yet another tool someone has to remember to check.",
      sections: [
        { h: "Where leads get lost", p: "A lead arrives from a website form, a call, WhatsApp or a campaign — and stays in an inbox, a spreadsheet or someone's phone. Nobody is sure who owns it, the follow-up depends on memory, and management can't see how many leads were actually handled. That's a revenue 'bleeding point'." },
        { h: "What can be automated", p: "Depending on existing systems and permissions:", list: ["Capturing leads from forms, WhatsApp, email and other sources into one CRM", "De-duplication and linking to an existing contact or company", "Rule-based routing by region, product, availability or request type", "Confirmation to the customer and a notification to the salesperson", "Follow-up tasks and reminders based on pipeline stage", "Alerts when a lead isn't handled within a defined time", "AI to classify or summarize unstructured inquiries — only where rules aren't enough"] },
        { h: "How we approach it", p: "We map the lead's real path — where it comes from, who touches it and what happens when nobody does. Most steps fit deterministic automation with clear rules, which is more reliable and cheaper. We define where human judgment is needed and build the automation inside the existing CRM or on top of it." },
      ],
      faq: [
        ["Do we need a new CRM to automate leads?", "Not necessarily. Sometimes it's enough to connect existing systems and build a workflow on top; sometimes the current CRM is part of the problem."],
        ["Will follow-ups be sent to customers automatically?", "Only if it fits the process and the channel's policies. Often it's better for automation to create a task and remind the salesperson, while the conversation itself stays human."],
        ["How do we know it's working?", "We define up front what to measure — for example unhandled leads and time to first response — and compare before and after on the business's own data."],
      ],
      cta: "Tell us how you work today",
    },
  },
  {
    slug: "where-ai-helps",
    links: [{ href: "/solutions/ai-automation", he: "AI & Automation", en: "AI & Automation" }, { href: "/blog/when-not-ai", he: "מתי לא צריך AI?", en: "When you don't need AI" }, { href: "/products/ai-for-business", he: "AI לעסקים", en: "AI for business" }],
    he: {
      q: "איפה AI באמת יכול לעזור לעסק שלי?",
      short: "איפה AI עוזר לעסק",
      tldr: "לפי הגישה של תבל (TEVEL), AI עוזר בעיקר במקומות שבהם יש מידע לא מובנה שצריך להבין — מיילים, מסמכים, שיחות ופניות — ולהפוך אותו לפעולה. תהליכים עם כללים ברורים מקבלים בדרך כלל מענה טוב יותר באוטומציה דטרמיניסטית, ולכן מתחילים מהבעיה העסקית ורק אחר כך מחליטים אם בכלל צריך AI.",
      sections: [
        { h: "איפה AI יוצר ערך", p: "שימושים שבהם AI יכול לתרום כשהם מוגדרים היטב:", list: ["Document Understanding, OCR & Extraction — קריאת מסמכים והפיכתם לנתונים", "Classification ו-Routing — סיווג פניות וניתובן", "Summarization — סיכום שיחות, מיילים ותיקים", "Knowledge Assistants ו-RAG — מענה מתוך הידע המאושר של העסק", "Internal Copilots — עזרה לעובדים בתוך המערכות שהם כבר עובדים בהן", "Conversation Analysis ו-Recommendation", "AI Agents שמבצעים פעולות מוגדרות בהרשאות מוגבלות"] },
        { h: "מתי לא צריך AI", p: "אם התהליך חוזר על עצמו ויש לו כללים ברורים — העברת נתונים בין מערכות, תזכורות, אישורים, סנכרון — workflow דטרמיניסטי יהיה אמין יותר, צפוי יותר וזול יותר. AI אינו מטרה; אין סיבה להכניס LLM למקום שבו הוא לא נדרש." },
        { h: "איך מוצאים את המקום הנכון", p: "ממפים תהליכים ומחפשים 'נקודות דימום' של זמן, כסף, כוח אדם, מידע, הכנסה וחוויית לקוח. מתעדפים לפי Impact / Cost / Complexity / Risk, ולכל שימוש ב-AI מגדירים מראש הרשאות, מקורות מידע מאושרים, תיעוד (Logging) ונקודות אישור אנושי." },
      ],
      faq: [
        ["האם AI יחליף עובדים אצלנו?", "המטרה היא לזהות אילו פעולות ניתן לבצע אוטומטית ואיפה נדרש שיקול דעת אנושי — לא להבטיח החלפת עובדים."],
        ["אפשר לעבוד עם תבל רק על AI?", "כן, כאשר קיימת בעיה שמתאימה ל-AI. אם יתברר שאוטומציה רגילה פותרת אותה טוב יותר — זו תהיה ההמלצה."],
        ["מאיפה כדאי להתחיל?", "מתהליך אחד שבו הערך הכי ברור והסיכון נמוך יחסית, עם מדד הצלחה מוגדר, ולא מפרויקט AI כללי."],
      ],
      cta: "בואו נמצא איפה AI באמת יכול לעזור",
    },
    en: {
      q: "Where can AI actually help my business?",
      short: "Where AI helps a business",
      tldr: "TEVEL (תבל) implements AI where it genuinely helps: mostly where there is unstructured information to understand — emails, documents, conversations and requests — and turn into action. Processes with clear rules are usually better served by deterministic automation, so the work starts with the business problem and only then decides whether AI is needed at all.",
      sections: [
        { h: "Where AI creates value", p: "Uses where AI can contribute when well defined:", list: ["Document understanding, OCR and extraction — turning documents into data", "Classification and routing of requests", "Summarization of calls, emails and case files", "Knowledge assistants and RAG — answers from the company's approved knowledge", "Internal copilots — helping staff inside the systems they already use", "Conversation analysis and recommendation", "AI agents that perform defined actions with limited permissions"] },
        { h: "When you don't need AI", p: "If a process is repetitive with clear rules — moving data between systems, reminders, approvals, sync — a deterministic workflow will be more reliable, more predictable and cheaper. AI is not the goal; there's no reason to add an LLM where it isn't needed." },
        { h: "How to find the right place", p: "We map processes and look for 'bleeding points' in time, money, people, information, revenue and customer experience. We prioritize by impact, cost, complexity and risk, and for every AI use define permissions, approved data sources, logging and human approval points up front." },
      ],
      faq: [
        ["Will AI replace our employees?", "The goal is to identify which actions can be automated and where human judgment is needed — not to promise headcount replacement."],
        ["Can we work with TEVEL on AI only?", "Yes, when there's a problem that genuinely fits AI. If plain automation turns out to solve it better, that will be the recommendation."],
        ["Where should we start?", "With one process where the value is clearest and the risk relatively low, with a defined success measure — not with a generic AI project."],
      ],
      cta: "Let's find where AI can really help",
    },
  },
  {
    slug: "company-knowledge-ai",
    links: [{ href: "/solutions/ai-automation", he: "AI & Automation", en: "AI & Automation" }, { href: "/products/ai-for-business", he: "AI לעסקים", en: "AI for business" }, { href: "/answers/where-ai-helps", he: "איפה AI באמת עוזר?", en: "Where AI really helps" }],
    he: {
      q: "איך בונים עוזר AI שעונה מתוך המסמכים והידע של החברה?",
      short: "עוזר AI על ידע החברה",
      tldr: "תבל (TEVEL) בונה Knowledge Assistants ו-AI Agents שעונים מתוך המסמכים והמערכות של החברה בגישת RAG — שליפה של מידע רלוונטי ממקורות מאושרים ורק אז ניסוח תשובה, עם הפניה למקור. ההבדל בין הדגמה מרשימה לכלי שאפשר לסמוך עליו נמצא בהרשאות, בבחירת המקורות, בתיעוד ובהגדרה ברורה של מה העוזר לא עושה.",
      sections: [
        { h: "איך זה עובד", p: "RAG (Retrieval-Augmented Generation) מחבר מודל שפה למאגר הידע של הארגון: המסמכים מעובדים ומאונדקסים לחיפוש סמנטי (Semantic Search), ובכל שאלה המערכת שולפת את הקטעים הרלוונטיים ועונה על בסיסם. כך התשובה נשענת על הידע של החברה ולא רק על הידע הכללי של המודל, ואפשר להציג מאיזה מסמך היא הגיעה." },
        { h: "מה הופך אותו לאמין", p: "העקרונות שמגדירים לפני שכותבים שורת קוד:", list: ["מקורות מאושרים בלבד — מה נכנס למאגר ומי אחראי לעדכן אותו", "הרשאות — כל משתמש מקבל תשובות רק ממידע שמותר לו לראות", "הפניה למקור בכל תשובה, כדי שאפשר יהיה לבדוק", "מענה שקוף כשאין מידע מספיק, במקום ניחוש", "Logging של שאלות, תשובות ומקורות לבקרה ולשיפור", "פעולות (אם יש) מוגדרות מראש ודורשות אישור כשצריך"] },
        { h: "שימושים אפשריים", p: "Copilot פנימי לעובדים (נהלים, מדיניות, ידע מוצר), עוזר לנציגי שירות שמציע תשובה מתוך הידע המאושר, חיפוש בארכיון מסמכים, או שכבת ידע בתוך מערך שירות לקוחות. תמיד בתוך המערכות שבהן העובדים כבר עובדים — לא כעוד כלי נפרד." },
      ],
      faq: [
        ["האם המידע של החברה עובר לאימון המודל?", "את ארכיטקטורת המערכת, ספקי המודלים ותנאי השימוש בנתונים בוחרים לפי דרישות הארגון. ב-RAG המידע נשלף בזמן השאלה ואינו נדרש לאימון מודל."],
        ["מה קורה כשהעוזר לא יודע את התשובה?", "מגדירים שהוא אומר זאת במפורש ומפנה לגורם אנושי, במקום לנחש."],
        ["אפשר לחבר אותו גם ל-CRM או ל-ERP?", "במקרים רבים כן, בכפוף ל-APIs ולהרשאות, כך שהעוזר יוכל לשלוף נתונים עדכניים ולא רק מסמכים."],
      ],
      cta: "בואו נמצא איפה AI באמת יכול לעזור",
    },
    en: {
      q: "How do we build an AI assistant that answers from our company's own documents?",
      short: "AI assistant on company knowledge",
      tldr: "TEVEL (תבל) builds knowledge assistants and AI agents that answer from the company's own documents and systems using RAG — retrieving relevant information from approved sources first, then composing an answer that cites the source. The difference between an impressive demo and a tool people can trust lies in permissions, source selection, logging and a clear definition of what the assistant does not do.",
      sections: [
        { h: "How it works", p: "RAG (retrieval-augmented generation) connects a language model to the organization's knowledge base: documents are processed and indexed for semantic search, and for every question the system retrieves the relevant passages and answers based on them. The answer relies on company knowledge rather than only the model's general knowledge, and can show which document it came from." },
        { h: "What makes it trustworthy", p: "Principles defined before any code is written:", list: ["Approved sources only — what goes into the knowledge base and who keeps it up to date", "Permissions — each user gets answers only from information they're allowed to see", "Source references on every answer, so it can be checked", "A transparent response when there isn't enough information, instead of guessing", "Logging of questions, answers and sources for oversight and improvement", "Actions (if any) defined up front and requiring approval where needed"] },
        { h: "Possible uses", p: "An internal copilot for staff (procedures, policies, product knowledge), an assistant that suggests answers to service agents from approved knowledge, search across a document archive, or a knowledge layer inside a customer-service operation. Always inside the systems people already work in — not as yet another separate tool." },
      ],
      faq: [
        ["Is our data used to train the model?", "System architecture, model providers and data-use terms are chosen to fit the organization's requirements. With RAG, information is retrieved at question time and isn't needed for model training."],
        ["What happens when the assistant doesn't know?", "It's set up to say so explicitly and refer to a person, rather than guess."],
        ["Can it connect to our CRM or ERP too?", "In many cases yes, subject to APIs and permissions, so the assistant can retrieve live data and not only documents."],
      ],
      cta: "Let's find where AI can really help",
    },
  },
  {
    slug: "document-ai",
    links: [{ href: "/solutions/ai-automation", he: "AI & Automation", en: "AI & Automation" }, { href: "/products/erp-operations", he: "ERP ומערכות תפעול", en: "ERP & operations" }, { href: "/blog/manual-process-cost", he: "כמה עולה תהליך ידני?", en: "What a manual process really costs" }],
    he: {
      q: "איך עושים קליטה אוטומטית של חשבוניות ומסמכים למערכת?",
      short: "קריאה אוטומטית של מסמכים",
      tldr: "תבל (TEVEL) בונה תהליכי Document AI שקוראים חשבוניות, הזמנות, טפסים ומסמכים אחרים, מחלצים מהם את השדות הרלוונטיים והופכים אותם לנתונים מובנים שנכנסים ל-ERP, ל-CRM או למערכת אחרת. הנתונים עוברים בדיקות ואישור אנושי בנקודות שהוגדרו מראש, כך שהקלדה ידנית מצטמצמת בלי לוותר על בקרה.",
      sections: [
        { h: "הבעיה", p: "מסמכים מגיעים במייל, כסריקה או כצילום, ומישהו מקליד אותם ידנית למערכת. זה איטי, חוזר על עצמו ופתוח לטעויות — ושעות אנושיות מושקעות בפעולה טכנית במקום בעבודה שדורשת שיקול דעת." },
        { h: "איך נראה התהליך", p: "Document flow טיפוסי, מותאם לסוגי המסמכים של העסק:", list: ["קליטה — ממייל, מתיקייה, מהעלאה או מצילום", "OCR — זיהוי הטקסט במסמך", "Classification — זיהוי סוג המסמך", "Extraction — חילוץ שדות כמו ספק, תאריך, סכומים ושורות", "Validation — בדיקה מול כללים ונתונים קיימים במערכת", "אישור אנושי במקרים חריגים או לפי מדיניות (Approval flow)", "כתיבה ל-ERP או ל-CRM דרך API ושמירת המסמך המקורי"] },
        { h: "בקרה ואחריות", p: "Extraction מבוסס AI אינו מושלם, ולכן מתכננים מראש מה קורה כשהמערכת לא בטוחה: המסמך מסומן לבדיקה ולא נכנס אוטומטית. כל פעולה מתועדת, ההרשאות מוגדרות, ואיכות החילוץ נבדקת על המסמכים האמיתיים של העסק לפני הרחבת השימוש." },
      ],
      faq: [
        ["מה רמת הדיוק של קריאת המסמכים?", "היא תלויה באיכות המסמכים, בסוגם ובמגוון הפורמטים. לכן בודקים על מדגם מסמכים אמיתי ומגדירים מתי נדרש אישור אנושי — במקום להבטיח מספר."],
        ["אפשר לחבר את זה ל-ERP שכבר יש לנו?", "במקרים רבים כן, בכפוף ל-APIs, להרשאות וליכולות של המערכת."],
        ["זה מתאים רק לחשבוניות?", "לא. אותו עיקרון מתאים להזמנות, תעודות משלוח, טפסים, חוזים ומסמכים אחרים שהמידע בהם צריך להגיע למערכת."],
      ],
      cta: "בואו נמצא איפה AI באמת יכול לעזור",
    },
    en: {
      q: "How can we automatically read invoices and documents into our systems?",
      short: "Document AI & extraction",
      tldr: "TEVEL (תבל) builds document AI workflows that read invoices, orders, forms and other documents, extract the relevant fields and turn them into structured data that flows into the ERP, CRM or another system. The data goes through validation and human approval at points defined up front, so manual data entry shrinks without giving up control.",
      sections: [
        { h: "The problem", p: "Documents arrive by email, as scans or as photos, and someone types them into the system by hand. It's slow, repetitive and error-prone — and human hours go into a technical task instead of work that needs judgment." },
        { h: "What the workflow looks like", p: "A typical document flow, adapted to the business's document types:", list: ["Intake — from email, a folder, an upload or a photo", "OCR — recognizing the text in the document", "Classification — identifying the document type", "Extraction — pulling fields such as supplier, date, amounts and line items", "Validation — checking against rules and existing data in the system", "Human approval for exceptions or by policy (approval flow)", "Writing to the ERP or CRM via API and storing the original document"] },
        { h: "Control and accountability", p: "AI-based extraction isn't perfect, so we plan up front what happens when the system isn't confident: the document is flagged for review rather than entered automatically. Every action is logged, permissions are defined, and extraction quality is tested on the business's real documents before usage expands." },
      ],
      faq: [
        ["How accurate is document reading?", "It depends on document quality, type and the variety of formats. That's why we test on a real sample and define when human approval is required — instead of promising a number."],
        ["Can it connect to the ERP we already use?", "In many cases yes, subject to the APIs, permissions and capabilities of that system."],
        ["Is it only for invoices?", "No. The same approach fits orders, delivery notes, forms, contracts and other documents whose data needs to reach a system."],
      ],
      cta: "Let's find where AI can really help",
    },
  },
];
