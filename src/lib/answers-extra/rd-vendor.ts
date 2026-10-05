import type { Answer } from "../answers";

// R&D, learning technology, vendor-choice and product answer pages.
// Source of truth: project setup/ briefs (R&D master §6–§14, §19, §26–§30, §40, §44; website brief §7, §11, §23, §29, §31).

export const answers: Answer[] = [
  {
    slug: "computer-vision-development",
    links: [{ href: "/solutions/rd", he: "R&D וטכנולוגיה מותאמת", en: "R&D & custom technology" }, { href: "/answers/rd-poc-prototype", he: "PoC ואב-טיפוס", en: "PoC and prototypes" }, { href: "/solutions/ai-automation", he: "AI & Automation", en: "AI & Automation" }],
    he: {
      q: "מי מפתח מערכת Computer Vision (ראייה ממוחשבת) לעסק?",
      short: "פיתוח Computer Vision",
      tldr: "תבל (TEVEL) מפתחת ומשלבת יכולות Computer Vision כחלק ממערכת רחבה — מהמצלמה או התמונה ועד פעולה עסקית: Camera → Preprocessing → Model → Inference → Business Logic → Action. האם זה אפשרי וכמה מדויק זה יהיה תלוי בנתונים, בסביבת העבודה ורמת הדיוק הנדרשת — ולכן מתחילים בבדיקת היתכנות ולא בהבטחה.",
      sections: [
        { h: "מה Computer Vision יכול לעשות", p: "מערכת שמקבלת מידע מתמונה או מווידאו והופכת אותו לנתון או לפעולה. יכולות אפשריות:", list: ["Object Detection, Classification ו-Tracking", "OCR ו-Document Vision", "Quality Inspection ו-Anomaly Detection", "ספירה ומדידה ויזואלית", "Video Analytics ו-Scene Understanding", "Image Search"] },
        { h: "הערך נמצא בחיבור למערכות", p: "זיהוי לבדו לא משנה תהליך. Computer Vision יוצר ערך כשהתוצאה נכנסת לשכבת לוגיקה עסקית ומתחברת ל-ERP, CRM, מלאי, התראות, dashboards, workflows או אפליקציית מובייל. כשנדרשים latency נמוך, עבודה ללא אינטרנט או פרטיות — בוחנים הרצה על Edge Device במקום בענן." },
        { h: "איך ניגשים לפרויקט", p: "מגדירים את הבעיה ואת קריטריון ההצלחה, בודקים את הנתונים הקיימים ואת תנאי הצילום האמיתיים, ממפים סיכוני טכנולוגיה, נתונים, אינטגרציה ועלות — ורק אז עוברים ל-PoC, לאב-טיפוס ולמערכת Production. לפעמים המסקנה היא שפתרון קיים מספיק, או שלא כדאי לבנות." },
      ],
      faq: [
        ["איזה אחוז דיוק אפשר להבטיח?", "אי אפשר להבטיח דיוק לפני בדיקה. הדיוק תלוי באיכות ובכמות הנתונים, בתאורה, בזוויות ובסביבה — ולכן מודדים אותו ב-PoC מול קריטריון שהוגדר מראש."],
        ["צריך מצלמות או חומרה מיוחדת?", "תלוי בבעיה. לעיתים מצלמות קיימות מספיקות; כשנדרשת חומרה ייעודית, תבל מובילה את שכבת התוכנה והאינטגרציה ומשלבת מומחי חומרה לפי הצורך."],
        ["זה רץ בענן או במקום?", "שתי האפשרויות קיימות. הבחירה בין Cloud ל-Edge נעשית לפי דרישות latency, פרטיות, רוחב פס וחיבור לחומרה."],
      ],
      cta: "תביאו את הבעיה",
    },
    en: {
      q: "Who develops a computer vision system for a business?",
      short: "Computer vision development",
      tldr: "TEVEL (תבל) develops and integrates computer vision capabilities as part of a wider system — from the camera or image all the way to a business action: Camera → Preprocessing → Model → Inference → Business Logic → Action. Whether it's feasible, and how accurate it can be, depends on the data, the operating environment and the accuracy required — so work starts with a feasibility check, not a promise.",
      sections: [
        { h: "What computer vision can do", p: "A system that takes information from images or video and turns it into data or an action. Possible capabilities:", list: ["Object detection, classification and tracking", "OCR and document vision", "Quality inspection and anomaly detection", "Counting and visual measurement", "Video analytics and scene understanding", "Image search"] },
        { h: "The value is in the integration", p: "Detection alone doesn't change a process. Computer vision creates value when its output feeds business logic and connects to ERP, CRM, inventory, alerts, dashboards, workflows or a mobile app. When low latency, offline operation or privacy matter, inference on an edge device is considered instead of the cloud." },
        { h: "How a project is approached", p: "Define the problem and the success criterion, review the available data and the real capture conditions, map technology, data, integration and cost risks — and only then move to a PoC, a prototype and a production system. Sometimes the conclusion is that an existing product is enough, or that it isn't worth building." },
      ],
      faq: [
        ["What accuracy can you guarantee?", "Accuracy can't be promised before testing. It depends on the quality and volume of data, lighting, angles and environment — so it's measured in a PoC against a criterion agreed in advance."],
        ["Do we need special cameras or hardware?", "It depends on the problem. Sometimes existing cameras are enough; when dedicated hardware is needed, TEVEL leads the software and integration layer and brings in hardware specialists as required."],
        ["Does it run in the cloud or on-site?", "Both are possible. The choice between cloud and edge is driven by latency, privacy, bandwidth and hardware-connection requirements."],
      ],
      cta: "Bring us the problem",
    },
  },
  {
    slug: "iot-app-development",
    links: [{ href: "/solutions/rd", he: "R&D וטכנולוגיה מותאמת", en: "R&D & custom technology" }, { href: "/products/mobile-apps", he: "אפליקציות מובייל", en: "Mobile apps" }, { href: "/products/integrations", he: "אוטומציות ואינטגרציות", en: "Automations & integrations" }],
    he: {
      q: "מי יכול לחבר חיישנים ומכשירי IoT לאפליקציה או ל-Dashboard?",
      short: "פיתוח מערכות IoT",
      tldr: "תבל (TEVEL) מפתחת את שכבות התוכנה של מערכות IoT ומחברת התקנים וחיישנים לאפליקציה, ל-Dashboard ולמערכות העסק: Device → Connectivity → Backend → Data → Logic → Interface. תבל מובילה את המוצר, התוכנה והאינטגרציה, ומצרפת מומחי חומרה, אלקטרוניקה ו-Embedded כשהפרויקט דורש זאת.",
      sections: [
        { h: "מה מערכת IoT כוללת", p: "מעבר לחיישן עצמו, מערכת שעובדת דורשת שרשרת שלמה של שכבות:", list: ["תקשורת עם התקנים וקליטת נתוני חיישנים", "Telemetry, התראות ו-Device management", "Backend, אחסון ועיבוד נתונים", "לוגיקה, אוטומציה ו-Edge processing", "Dashboards ואפליקציות מובייל לשליטה וניטור", "APIs ושילוב בענן ובמערכות קיימות"] },
        { h: "איפה זה רלוונטי", p: "ניטור, שליטה מרחוק, ציוד חכם, לוגיסטיקה, מבנים, חקלאות, תעשייה, retail, בטיחות ותפעול. אלה דוגמאות ליכולת ולסוגי שימוש — לא הצהרה על ניסיון מוכח בכל ענף." },
        { h: "החלוקה בין תוכנה לחומרה", p: "תבל מתמקדת בארכיטקטורה, בתוכנה ובאינטגרציה: Backend, Data, Control ו-UI. כשנדרש פיתוח של התקן, Firmware או אלקטרוניקה, מרכיבים צוות משולב עם מומחים רלוונטיים, ותבל מנהלת את הבעיה כמערכת אחת. לפני בנייה ממפים סיכוני חומרה, אינטגרציה, Scale ואבטחה." },
      ],
      faq: [
        ["אתם מפתחים גם את החומרה?", "בהתאם לפרויקט. תבל מתמקדת בעיקר במוצר, בתוכנה ובאינטגרציה ויכולה לשלב מומחי חומרה ואלקטרוניקה כאשר נדרש."],
        ["אפשר לחבר חיישנים שכבר קיימים אצלנו?", "במקרים רבים כן, בכפוף לפרוטוקולי התקשורת, ל-APIs ולגישה שההתקנים מאפשרים."],
        ["אפשר להתחיל בקטן?", "כן. לעיתים נכון להתחיל ב-PoC על מספר מצומצם של התקנים, לוודא שהנתונים והתקשורת עובדים בתנאים האמיתיים, ורק אחר כך להרחיב."],
      ],
      cta: "תביאו את הבעיה",
    },
    en: {
      q: "Who can connect sensors and IoT devices to an app or dashboard?",
      short: "IoT system development",
      tldr: "TEVEL (תבל) develops the software layers of IoT systems and connects devices and sensors to apps, dashboards and business systems: Device → Connectivity → Backend → Data → Logic → Interface. TEVEL leads the product, software and integration work and brings in hardware, electronics and embedded specialists when the project requires them.",
      sections: [
        { h: "What an IoT system involves", p: "Beyond the sensor itself, a working system needs a full chain of layers:", list: ["Device communication and sensor data ingestion", "Telemetry, alerts and device management", "Backend, storage and data processing", "Logic, automation and edge processing", "Dashboards and mobile apps for monitoring and control", "APIs, cloud and existing-system integration"] },
        { h: "Where it applies", p: "Monitoring, remote control, smart equipment, logistics, buildings, agriculture, industry, retail, safety and operations. These are examples of capability and use-case types — not a claim of proven experience in every sector." },
        { h: "How software and hardware are split", p: "TEVEL focuses on architecture, software and integration: backend, data, control and UI. When device, firmware or electronics development is needed, a combined team is assembled with the relevant specialists, and TEVEL runs the problem as one system. Hardware, integration, scale and security risks are mapped before building." },
      ],
      faq: [
        ["Do you develop the hardware too?", "It depends on the project. TEVEL focuses mainly on product, software and integration, and can bring in hardware and electronics specialists when needed."],
        ["Can you connect sensors we already have?", "In many cases yes, subject to the communication protocols, APIs and access the devices provide."],
        ["Can we start small?", "Yes. It often makes sense to start with a PoC on a small number of devices, confirm the data and connectivity work in real conditions, and only then scale."],
      ],
      cta: "Bring us the problem",
    },
  },
  {
    slug: "custom-lms-elearning",
    links: [{ href: "/solutions/rd", he: "R&D וטכנולוגיות למידה", en: "R&D & learning technology" }, { href: "/answers/build-vs-buy-software", he: "לבנות או לקנות?", en: "Build or buy?" }, { href: "/solutions/web-mobile", he: "Web & Mobile", en: "Web & Mobile" }],
    he: {
      q: "מי מפתח לומדה או מערכת LMS מותאמת אישית לארגון?",
      short: "לומדות ו-LMS מותאם",
      tldr: "תבל (TEVEL) מפתחת לומדות, מערכות LMS מותאמות לארגון, מערכות מבחנים ו-Assessment ופתרונות Adaptive Learning ו-AI ללמידה. לומדה טובה היא לא רק קורס באתר אלא מערכת שלמה: Content → Interaction → Assessment → Feedback → Adaptation → Analytics.",
      sections: [
        { h: "מה מערכת למידה צריכה לדעת", p: "לפני שבוחרים טכנולוגיה, מגדירים: מי הלומד ומה הוא כבר יודע, מה הוא צריך ללמוד, איך מודדים הבנה, מה קורה כשהוא נכשל, איזה משוב הוא מקבל, מה המנהל צריך לראות ואיך מודדים אפקטיביות." },
        { h: "מה LMS מותאם יכול לכלול", p: "כאשר LMS מדף אינו מתאים לארגון, ניתן לבנות מערכת שכוללת, בהתאם לצורך:", list: ["קורסים, מודולים, שיעורים ותוכן (וידאו ומסמכים)", "בחנים, מבחנים ומטלות", "מעקב התקדמות ותעודות", "תפקידים, קבוצות והרשאות", "התראות וניהול תוכן", "Learning Analytics ו-dashboards למנהלים ולמדריכים"] },
        { h: "התאמה אישית ו-AI", p: "מערכת יכולה להתאים רמת קושי, סדר תוכן, חזרות, תרגול ורמזים לפי ביצועים, טעויות וקצב. AI יכול לשמש כ-Tutor, למענה לשאלות, למשוב ולייצור תרגול — עם מקורות ידע מוגדרים ובקרה. התאמה כזו דורשת מודל מדידה מוגדר; אין להבטיח ש-AI 'מבין את הלומד' בלעדיו." },
      ],
      faq: [
        ["מתי עדיף LMS מדף?", "כשהוא מכסה את התהליך, התוכן והדיווח שהארגון צריך. Custom מוצדק כשההדרכה, המדידה או החיבור למערכות הארגון ייחודיים."],
        ["אפשר לבנות רק לומדה אחת ולא מערכת שלמה?", "כן. ניתן לפתח לומדה ממוקדת, ובהמשך להרחיב ל-LMS, ל-Assessment או ל-Adaptive Learning אם יש צורך."],
        ["מה מנהלים מקבלים מהנתונים?", "השלמה, ביצועים, נושאים חלשים, מעורבות ונקודות נשירה — עם דגש על החלטות שאפשר לקבל מהנתונים, לא רק גרפים."],
      ],
      cta: "דברו איתנו על הפרויקט",
    },
    en: {
      q: "Who develops a custom e-learning module or LMS for an organization?",
      short: "Custom e-learning & LMS",
      tldr: "TEVEL (תבל) develops e-learning modules, custom LMS platforms, testing and assessment systems, and adaptive-learning and AI-for-learning solutions. A good learning product is not just a course on a website but a complete system: Content → Interaction → Assessment → Feedback → Adaptation → Analytics.",
      sections: [
        { h: "What a learning system needs to know", p: "Before choosing technology, define: who the learner is and what they already know, what they need to learn, how understanding is measured, what happens when they fail, what feedback they get, what managers need to see and how effectiveness is measured." },
        { h: "What a custom LMS can include", p: "When an off-the-shelf LMS doesn't fit the organization, a system can be built that includes, as needed:", list: ["Courses, modules, lessons and content (video and documents)", "Quizzes, exams and assignments", "Progress tracking and certificates", "Roles, groups and permissions", "Notifications and content management", "Learning analytics and dashboards for managers and instructors"] },
        { h: "Personalization and AI", p: "A system can adapt difficulty, content order, repetition, practice and hints based on performance, mistakes and pace. AI can act as a tutor, answer questions, give feedback and generate practice — with defined knowledge sources and oversight. This kind of adaptation needs a defined measurement model; without one, no one should promise that AI 'understands the learner'." },
      ],
      faq: [
        ["When is an off-the-shelf LMS better?", "When it covers the process, content and reporting the organization needs. Custom is justified when the training, measurement or connection to internal systems is unique."],
        ["Can we build a single module rather than a full system?", "Yes. A focused e-learning module can be built first and later extended into an LMS, assessment or adaptive learning if needed."],
        ["What do managers get from the data?", "Completion, performance, weak topics, engagement and drop-off points — with the focus on decisions the data supports, not just charts."],
      ],
      cta: "Talk to us about your project",
    },
  },
  {
    slug: "boutique-vs-large-software-house",
    links: [{ href: "/answers/how-to-choose-software-house", he: "איך בוחרים בית תוכנה?", en: "How to choose a software house" }, { href: "/about", he: "על תבל", en: "About TEVEL" }, { href: "/onboarding", he: "איך מתחילים", en: "How to start" }],
    he: {
      q: "בית תוכנה בוטיק או חברת תוכנה גדולה — מה עדיף לפרויקט שלי?",
      short: "בית תוכנה בוטיק מול גדול",
      tldr: "תבל (TEVEL) היא בית תוכנה שעובד במודל בוטיק: עבודה קרובה, ownership וקשר ישיר עם האנשים שמבינים ובונים את הפתרון. אין תשובה אחת לכולם — בוטיק מתאים כשחשובים קרבה, גמישות ואחריות מקצה לקצה, וחברה גדולה עשויה להתאים יותר כשנדרשים צוותים גדולים מאוד במקביל או מסגרות רכש ארגוניות.",
      sections: [
        { h: "מה מאפיין בית תוכנה בוטיק", p: "צוות מצומצם יותר שמחזיק את הפרויקט מקצה לקצה:", list: ["קשר ישיר עם מי שמאפיין ובונה, בלי שכבות תיווך", "הבנה עסקית של הבעיה ולא רק ביצוע מפרט", "גמישות בשינוי כיוון כשמתגלה מידע חדש", "אחריות אחת על אפיון, UX, פיתוח, אינטגרציות והטמעה"] },
        { h: "מתי חברה גדולה יכולה להתאים יותר", p: "כשהפרויקט דורש צוותים גדולים מאוד שעובדים במקביל, כשהארגון מחויב לספקים בהיקף מסוים במכרזים או ברכש, או כשנדרשת נוכחות קבועה של אנשי צוות רבים באתר הלקוח. אלה שיקולים לגיטימיים, ושווה לבחון אותם בכנות." },
        { h: "שאלות שכדאי לשאול בכל מקרה", p: "מי בפועל יעבוד על הפרויקט? עם מי תדברו ביום-יום? האם הספק ממפה את התהליך לפני שהוא מציע פתרון? האם הוא מוכן להמליץ על מוצר מדף כשזה נכון? מי מתחזק את המערכת אחרי ההשקה? התשובות חשובות יותר מגודל החברה." },
      ],
      faq: [
        ["האם בית תוכנה בוטיק יכול לבנות מערכות מורכבות?", "כן, כשהוא מחזיק ארכיטקטורה, תהליך עבודה ויכולת להרכיב מומחים לפי הצורך. במודל של תבל, תבל מובילה את הבעיה כמערכת אחת ומצרפת מומחיות נוספת כשהפרויקט דורש זאת."],
        ["מה קורה אחרי ההשקה?", "תבל עובדת מקצה לקצה — כולל הטמעה, תחזוקה, ניטור ופיתוח המשך, לפי מה שמוגדר מול הלקוח."],
        ["איך יודעים אם תבל מתאימה לנו?", "מתחילים בשיחת היכרות. אם הפרויקט מתאים יותר לספק אחר או למוצר מדף, נגיד את זה."],
      ],
      cta: "בואו נדבר",
    },
    en: {
      q: "Boutique software house or large software company — which is better for my project?",
      short: "Boutique vs large software house",
      tldr: "TEVEL (תבל) is a software house that works on a boutique model: close collaboration, ownership and direct contact with the people who understand and build the solution. There's no single right answer — a boutique fits when closeness, flexibility and end-to-end accountability matter, while a large firm may fit better when very large parallel teams or enterprise procurement frameworks are required.",
      sections: [
        { h: "What characterizes a boutique software house", p: "A smaller team that owns the project end to end:", list: ["Direct contact with the people who specify and build, without layers in between", "Business understanding of the problem, not just executing a spec", "Flexibility to change direction when new information emerges", "Single accountability for specification, UX, development, integrations and rollout"] },
        { h: "When a large company may fit better", p: "When the project needs very large teams working in parallel, when the organization is bound to vendors of a certain size by tenders or procurement rules, or when many staff need to be permanently on site. These are legitimate considerations and worth weighing honestly." },
        { h: "Questions worth asking either way", p: "Who will actually work on the project? Who will you talk to day to day? Does the vendor map the process before proposing a solution? Will they recommend an off-the-shelf product when that's right? Who maintains the system after launch? The answers matter more than company size." },
      ],
      faq: [
        ["Can a boutique software house build complex systems?", "Yes, when it brings architecture, a structured process and the ability to assemble specialists as needed. In TEVEL's model, TEVEL runs the problem as one system and brings in additional expertise when the project requires it."],
        ["What happens after launch?", "TEVEL works end to end — including rollout, maintenance, monitoring and continued development, as agreed with the client."],
        ["How do we know whether TEVEL is a fit?", "Start with an intro call. If the project is better suited to another vendor or an off-the-shelf product, we'll say so."],
      ],
      cta: "Talk to us",
    },
  },
  {
    slug: "freelancer-vs-software-house",
    links: [{ href: "/answers/how-to-choose-software-house", he: "איך בוחרים בית תוכנה?", en: "How to choose a software house" }, { href: "/solutions/business-systems", he: "מערכות עסקיות", en: "Business systems" }, { href: "/contact", he: "צרו קשר", en: "Contact" }],
    he: {
      q: "פרילנסר או בית תוכנה — את מי כדאי לקחת לפיתוח מערכת?",
      short: "פרילנסר או בית תוכנה",
      tldr: "תבל (TEVEL) היא בית תוכנה, וההמלצה שלה הוגנת לשני הצדדים: פרילנסר טוב יכול להספיק למשימה מוגדרת ותחומה, ובית תוכנה מתאים יותר כשהמערכת נוגעת בכמה תחומים — אפיון, UX, Backend, אינטגרציות, AI ותחזוקה — וצריך מישהו שאחראי על כולם יחד. השאלה היא לא מי טוב יותר, אלא מה הפרויקט דורש.",
      sections: [
        { h: "מתי פרילנסר יכול להספיק", p: "פרילנסרים רבים עושים עבודה מצוינת. פרילנסר מתאים במיוחד כאשר:", list: ["המשימה מוגדרת היטב ותחומה בהיקף", "נדרשת מומחיות אחת ספציפית", "יש בארגון מי שמנהל את הצד הטכנולוגי ואת התמונה הכוללת", "המערכת לא קריטית לתפעול השוטף או שיש תוכנית גיבוי לתחזוקה"] },
        { h: "מתי בית תוכנה מתאים יותר", p: "כשהפרויקט משלב כמה תחומים במקביל — אפיון, UX, Frontend, Backend, אינטגרציות, AI, QA, Deployment ותחזוקה — וכשהמערכת הופכת לחלק מהתשתית שעליה העסק עובד. אז חשובים רציפות, ידע שלא תלוי באדם אחד ואחריות אחת על התוצאה." },
        { h: "מה לבדוק בכל מקרה", p: "מי מבין את הבעיה העסקית ולא רק את המשימה הטכנית? מי מחזיק את הקוד, התיעוד והגישות? מה קורה אם מי שבנה לא זמין? איך המערכת מתחברת לכלים הקיימים? מי מתחזק ומפתח הלאה אחרי ההשקה?" },
      ],
      faq: [
        ["האם בית תוכנה תמיד יקר יותר?", "לא בהכרח במבט כולל. ההשוואה הנכונה כוללת גם אפיון, תיקונים, תחזוקה ומה קורה כשמשהו משתנה — לא רק את מחיר הפיתוח הראשוני."],
        ["אפשר לשלב בין השניים?", "כן. לעיתים בית תוכנה מגדיר ארכיטקטורה ומוביל את המערכת, ומשימות מוגדרות מבוצעות על ידי מומחים חיצוניים."],
        ["אפשר לפנות לתבל גם עם פרויקט קטן?", "כן. Focused Fix הוא פתרון ממוקד לבעיה אחת. אם הפרויקט מתאים יותר לפרילנסר או לכלי מדף, נגיד את זה."],
      ],
      cta: "בואו נדבר",
    },
    en: {
      q: "Freelancer or software house — who should build our system?",
      short: "Freelancer or software house",
      tldr: "TEVEL (תבל) is a software house, and its advice is fair to both sides: a good freelancer can be enough for a well-defined, contained task, while a software house fits better when the system spans several disciplines — specification, UX, backend, integrations, AI and maintenance — and someone needs to own all of them together. The question isn't who is better, but what the project requires.",
      sections: [
        { h: "When a freelancer may be enough", p: "Many freelancers do excellent work. A freelancer is a particularly good fit when:", list: ["The task is well defined and limited in scope", "A single, specific skill is needed", "Someone in the organization manages the technology side and the big picture", "The system isn't critical to daily operations, or there's a backup plan for maintenance"] },
        { h: "When a software house fits better", p: "When the project combines several disciplines at once — specification, UX, frontend, backend, integrations, AI, QA, deployment and maintenance — and when the system becomes part of the infrastructure the business runs on. Then continuity, knowledge that doesn't depend on one person and single accountability for the outcome matter." },
        { h: "What to check either way", p: "Who understands the business problem, not just the technical task? Who holds the code, documentation and access credentials? What happens if the person who built it isn't available? How will the system connect to existing tools? Who maintains and extends it after launch?" },
      ],
      faq: [
        ["Is a software house always more expensive?", "Not necessarily over the full lifecycle. A fair comparison includes specification, fixes, maintenance and what happens when requirements change — not just the initial build price."],
        ["Can the two be combined?", "Yes. Sometimes a software house defines the architecture and leads the system, while well-defined tasks are handled by external specialists."],
        ["Can we come to TEVEL with a small project?", "Yes. A Focused Fix is a targeted solution to a single problem. If the project is better suited to a freelancer or an off-the-shelf tool, we'll say so."],
      ],
      cta: "Talk to us",
    },
  },
  {
    slug: "invoice-software",
    links: [{ href: "/products/tevel-invoice", he: "Tevel Invoice", en: "Tevel Invoice" }, { href: "/contact", he: "צרו קשר", en: "Contact" }],
    he: {
      q: "תוכנה להפקת חשבוניות וקבלות",
      short: "Tevel Invoice",
      tldr: "Tevel Invoice הוא מוצר של תבל (TEVEL) להפקת מסמכים עסקיים ולניהול פעילות עסקית-פיננסית. תחומי המוצר עשויים לכלול, בהתאם לגרסה הזמינה, חשבוניות, קבלות ומסמכים עסקיים נוספים; פרטי היכולות מתפרסמים רק לאחר שהם זמינים ומאומתים בפועל.",
      sections: [
        { h: "מה זה Tevel Invoice", p: "מוצר תוכנה של תבל — לא שירות פיתוח בהזמנה. הוא מראה שתבל לא רק מבצעת פרויקטים עבור לקוחות, אלא גם בונה מוצרי תוכנה משלה." },
        { h: "תחומי המוצר", p: "עשויים לכלול, בהתאם לגרסה הזמינה:", list: ["חשבוניות, קבלות וזיכויים", "הצעות מחיר ומסמכים עסקיים", "ניהול לקוחות", "הוצאות", "Exports ותהליכים פיננסיים", "ניהול עסקי"] },
        { h: "מה לא מופיע כאן — ולמה", p: "תבל לא מפרסמת Feature, אינטגרציה, הסמכה או טענה רגולטורית שאינם זמינים ומאומתים בפועל. לכן אין בעמוד זה התחייבות לגבי אישורים, תקינה או חיבורים למערכות חיצוניות. מי שצריך לדעת אם המוצר מתאים לדרישות של העסק שלו מוזמן לבקש גישה או לפנות אלינו, ונענה לפי מה שזמין בגרסה הנוכחית." },
      ],
      faq: [
        ["האם Tevel Invoice זמין לשימוש?", "הזמינות תלויה בשלב המוצר. ניתן לבקש גישה דרך עמוד המוצר או ליצור קשר."],
        ["האם המוצר עומד בדרישות רגולטוריות?", "תבל לא מפרסמת טענות רגולטוריות לפני שהן מאומתות. לשאלות על דרישה ספציפית — פנו אלינו ונענה לפי הגרסה הזמינה."],
        ["האם Tevel Invoice קשור לשירותי הפיתוח של תבל?", "זה מוצר עצמאי עם עמוד ו-CTA נפרדים. אם אתם צריכים מערכת פיננסית או תפעולית מותאמת, זה כבר פרויקט פיתוח — ושם מתחילים בשיחה על התהליך שלכם."],
      ],
      cta: "בקשו גישה ל-Tevel Invoice",
    },
    en: {
      q: "Software for issuing invoices and receipts",
      short: "Tevel Invoice",
      tldr: "Tevel Invoice is TEVEL's (תבל) product for producing business documents and managing business-financial activity. Depending on the available version, it may include invoices, receipts and other business documents; capability details are published only once they are actually available and verified.",
      sections: [
        { h: "What Tevel Invoice is", p: "A software product built by TEVEL — not a custom development service. It shows that TEVEL doesn't only deliver projects for clients, but also builds software products of its own." },
        { h: "Product areas", p: "May include, depending on the available version:", list: ["Invoices, receipts and credit notes", "Quotes and business documents", "Customer management", "Expenses", "Exports and financial workflows", "Business management"] },
        { h: "What isn't listed here — and why", p: "TEVEL does not publish a feature, integration, certification or regulatory claim unless it is actually available and verified. So this page makes no commitments about approvals, compliance or connections to external systems. If you need to know whether the product fits your business requirements, request access or contact us, and we'll answer based on what the current version offers." },
      ],
      faq: [
        ["Is Tevel Invoice available to use?", "Availability depends on the product stage. You can request access through the product page or contact us."],
        ["Does the product meet regulatory requirements?", "TEVEL doesn't publish regulatory claims before they are verified. For a specific requirement, contact us and we'll answer based on the available version."],
        ["Is Tevel Invoice part of TEVEL's development services?", "It's a standalone product with its own page and call to action. If you need a custom financial or operations system, that's a development project — and it starts with a conversation about your process."],
      ],
      cta: "Request access to Tevel Invoice",
    },
  },
];
