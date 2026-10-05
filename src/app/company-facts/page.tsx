import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/ui";

export const metadata: Metadata = seo("/company-facts");

/* ---------- prose primitives (measured: p 18/28, h2 serif 31/40, h3 20/32, ul ps-32) ---------- */
const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href} className="[overflow-wrap:anywhere] underline decoration-paper/70 decoration-1 underline-offset-[3px] transition-[text-decoration-color] duration-150 hover:decoration-transparent">
    {children}
  </Link>
);
const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="mb-3 mt-5 font-serif text-2xl font-light leading-8 tracking-[-0.04em] md:text-[31px] md:leading-10">{children}</h2>
);
const H3 = ({ children, first }: { children: ReactNode; first?: boolean }) => (
  <h3 className={`mb-3 text-base leading-6 tracking-[0.01em] md:text-xl md:leading-8 ${first ? "mt-3" : "mt-5"}`}>{children}</h3>
);
const Fact = ({ k, children }: { k?: string; children: ReactNode }) => (
  <>
    {k && <strong className="font-medium">{k}{k.endsWith("?") ? " " : ": "}</strong>}
    {children}
  </>
);
const P = ({ k, children }: { k?: string; children: ReactNode }) => (
  <p className="mt-3 first:mt-0 [h3+&]:mt-0"><Fact k={k}>{children}</Fact></p>
);
const Ul = ({ children, nested }: { children: ReactNode; nested?: boolean }) => (
  <ul className={`list-disc ps-8 marker:text-paper ${nested ? "mb-8 mt-3" : "my-5"} [&>li+li]:mt-2`}>{children}</ul>
);
const Li = ({ k, children }: { k?: string; children: ReactNode }) => <li><Fact k={k}>{children}</Fact></li>;

/* ---------- the layers (brief §44, R&D §45) ---------- */
type Layer = { title: string; href: string; page: string; tagline: string; items: string[] };
const layers: Layer[] = [
  { title: "BUILD — Software Engineering", href: "/solutions/business-systems", page: "Business Systems", tagline: "אנחנו בונים תוכנה.", items: ["Business Systems", "CRM & ERP", "Web & Mobile"] },
  { title: "INTELLIGENCE — AI & Automation", href: "/solutions/ai-automation", page: "AI & Automation", tagline: "אנחנו הופכים את התוכנה לחכמה ומחוברת.", items: ["AI", "Automation", "Integrations", "AI Customer Service"] },
  { title: "TRANSFORM — Business Technology Transformation", href: "/pricing", page: "איך עובדים", tagline: "אנחנו עוזרים להבין מה בכלל צריך להשתנות.", items: ["Business Mapping", "Process Analysis", "Technology Roadmap", "Transformation"] },
  { title: "INVENT — R&D & Custom Technology", href: "/solutions/rd", page: "R&D & Custom Technology", tagline: "כאשר אין פתרון מוכן, אנחנו חוקרים, בודקים היתכנות ומפתחים אותו.", items: ["Research & Prototyping", "AI & Computer Vision", "Robotics & IoT", "Learning Technology", "Custom Products"] },
  { title: "PRODUCTS", href: "/products/tevel-invoice", page: "Tevel Invoice", tagline: "אנחנו גם בונים מוצרים משלנו.", items: ["Tevel Invoice — מוצר של תבל להפקת מסמכים עסקיים ולניהול פעילות עסקית-פיננסית"] },
];

function Product({ layer, first }: { layer: Layer; first?: boolean }) {
  return (
    <>
      <H3 first={first}>{layer.title}</H3>
      <Ul>
        <Li>עמוד: <A href={layer.href}>{layer.page}</A></Li>
        <Li>במשפט: {layer.tagline}</Li>
        <Li>
          כולל:
          <Ul nested>{layer.items.map((it) => <Li key={it}>{it}</Li>)}</Ul>
        </Li>
      </Ul>
    </>
  );
}

/* ---------- FAQ (brief §31, R&D §40) ---------- */
const faq: { group: string; qa: [string, string][] }[] = [
  {
    group: "החברה והגישה",
    qa: [
      ["אתם חברת תוכנה או חברת ייעוץ?", "אנחנו בית תוכנה שמתחיל מהבעיה העסקית. כאשר נדרש, אנחנו מבצעים Discovery ומיפוי ולאחר מכן מתכננים, מפתחים ומטמיעים את הפתרון."],
      ["אתם עובדים רק עם Custom?", "לא. אם מוצר קיים פותר את הבעיה היטב, אין סיבה לבנות מערכת מיותרת."],
      ["אפשר להגיע בלי לדעת מה צריך לפתח?", "כן. זה בדיוק תפקיד ה-Discovery וה-Transformation."],
      ["AI יכול להחליף את כל שירות הלקוחות?", "לא בהכרח, וברוב המקרים זו אינה נקודת המוצא הנכונה. אנחנו מגדירים מה ניתן לבצע אוטומטית ומה דורש אדם."],
    ],
  },
  {
    group: "מה אנחנו בונים",
    qa: [
      ["אפשר לעבוד אתכם רק על AI?", "כן, כאשר קיימת בעיה שמתאימה ל-AI."],
      ["אתם מפתחים CRM?", "כן. ניתן לפתח CRM מותאם, להרחיב מערכת קיימת או לבנות אינטגרציות ושכבות מעליה."],
      ["אתם מפתחים ERP?", "כן, בהתאם להיקף. לעיתים נכון יותר לבנות מודולים או שכבה משלימה."],
      ["אתם בונים אפליקציות?", "כן, מאפיון ו-UX ועד Backend, Mobile והשקה."],
      ["אתם בונים אתרים?", "כן, כולל אתרים עסקיים, מסחריים ומערכות Web."],
      ["אתם עובדים עם מערכות קיימות?", "במקרים רבים כן, בכפוף ל-APIs, הרשאות והיכולות של אותן מערכות."],
    ],
  },
  {
    group: "R&D",
    qa: [
      ["אפשר להגיע רק עם רעיון?", "כן. R&D נועד בדיוק למצבים שבהם הפתרון עדיין אינו מוגדר."],
      ["האם כל רעיון ניתן לבנייה?", "לא. זו בדיוק הסיבה ל-Feasibility ו-PoC. תהליך R&D רציני צריך להיות מסוגל גם להוכיח שהפתרון אינו כדאי או אינו אפשרי בתנאים הקיימים."],
    ],
  },
];

const profile = ["כ-10 עובדים ומעלה", "מספר מחלקות או בעלי תפקידים", "מחזור של מיליוני שקלים", "נפח לקוחות משמעותי", "מערכות שונות", "עבודה ידנית", "מידע מפוזר", "צורך לגדול בצורה יעילה"];
const signs = ["\"הכול אצלנו באקסלים.\"", "\"המערכות שלנו לא מדברות.\"", "\"רק עובד אחד יודע איך התהליך עובד.\"", "\"אנחנו מקבלים יותר מדי פניות.\"", "\"אנחנו עושים את אותה פעולה כל היום.\"", "\"אין לי תמונת מצב.\"", "\"ה-CRM לא מתאים לנו.\"", "\"אנחנו רוצים AI אבל לא יודעים איפה הוא באמת יעזור.\"", "\"כל צמיחה מחייבת עוד אנשים.\""];

export default function CompanyFactsPage() {
  return (
    <section className="wrap">
      <div className="inner pb-16 pt-12 md:py-20">
        <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-[1fr_minmax(0,837px)_1fr] md:gap-8">
          <article className="flex min-w-0 flex-col gap-5 md:col-start-2 md:gap-8">
            <header className="flex flex-col gap-2 text-center md:gap-5">
              <Reveal><h1 className="font-serif text-[28px] font-light leading-8 tracking-[-0.04em] md:text-[49px] md:leading-[52px]">תבל בקצרה</h1></Reveal>
              <Reveal delay={80}><p className="mx-auto max-w-[748px] text-base leading-6 tracking-[0.01em] text-stone-2 md:text-xl md:leading-8">תבל בונה את התשתית הטכנולוגית שמאחורי העסק — מערכות מידע, CRM ו-ERP, AI, אוטומציות, שירות לקוחות חכם ומוצרים דיגיטליים.</p></Reveal>
            </header>

            <Reveal delay={140} className="text-base leading-6 tracking-[0.01em] md:text-lg md:leading-7">
              <p>עודכן לאחרונה: אוקטובר 2026</p>

              <H2>החברה</H2>
              <H3 first>מי אנחנו</H3>
              <P k="מה זה תבל?">תבל היא בית תוכנה, שותף טכנולוגי וסטודיו R&D שמתכנן ובונה מערכות ומוצרים טכנולוגיים מקצה לקצה — מתחילים מהבעיה ובונים סביבה את הטכנולוגיה הנכונה.</P>
              <P k="שם">TEVEL | תבל</P>
              <P k="הגדרה">Software House & Technology Partner, R&D Studio</P>
              <P k="אתר"><a href="https://www.tevel.space" className="underline underline-offset-4">www.tevel.space</a></P>
              <P k="יצירת קשר"><A href="/contact">טופס יצירת קשר</A></P>
              <P k="תחומים">מערכות מידע ותוכנה עסקית, CRM ו-ERP בהתאמה אישית, AI ואוטומציות, מערכי שירות לקוחות מבוססי AI, אינטגרציות, אפליקציות מובייל, Web Apps ואתרים, R&D ופיתוח טכנולוגי מיוחד.</P>
              <P k="קהל יעד">עסקים וארגונים עם פעילות ומורכבות תפעולית אמיתית</P>
              <P k="מוצרים">Tevel Invoice</P>
              <P k="מיקום">ישראל</P>

              <H3>Elevator pitch</H3>
              <P k="10 שניות">תבל היא בית תוכנה שבונה מערכות עסקיות, AI ואוטומציות סביב הדרך שבה העסק באמת עובד.</P>
              <P k="20 שניות">אנחנו מפתחים מערכות מידע, CRM ו-ERP, אפליקציות ומערכות Web ומטמיעים AI ואוטומציות. כשצריך, אנחנו מתחילים במיפוי העסק כדי להבין איפה הטכנולוגיה באמת יכולה לחסוך זמן, כסף ועבודה ידנית.</P>

              <H3>Elevator pitch — R&D</H3>
              <Ul>
                <Li k="10 שניות">תבל מספקת גם שירותי R&D לפרויקטים מיוחדים — מ-PoC ולומדות ועד AI, Computer Vision, IoT ורובוטיקה.</Li>
                <Li k="30 שניות">מעבר למערכות עסקיות, יש לנו שכבת R&D שמיועדת לפרויקטים שאין עבורם פתרון מוכן. אנחנו יכולים להתחיל ממחקר ובדיקת היתכנות, לבנות PoC ואב-טיפוס ולהתקדם למוצר — כולל AI, לומדות, Computer Vision, IoT ושילובי תוכנה וחומרה, עם מומחים נוספים כאשר הפרויקט דורש זאת.</Li>
              </Ul>

              <H3>מיצוב</H3>
              <Ul>
                <Li k="Positioning statement">עבור עסקים וארגונים שהמערכות הקיימות שלהם כבר אינן עומדות בקצב הפעילות, תבל היא בית תוכנה ושותף טכנולוגי שמבין את התהליך העסקי לפני הפיתוח ומסוגל לתכנן, לבנות ולהטמיע את המערכת הנכונה — במקום למכור פתרון מדף ולדרוש מהעסק להתאים את עצמו אליו.</Li>
                <Li k="Engineering ו-R&D">תבל פועלת בשני מצבים משלימים. כאשר הבעיה ברורה, אנחנו מתכננים ובונים את המערכת. כאשר הפתרון עדיין אינו ברור, אנחנו חוקרים, בודקים היתכנות ומפתחים אותו.</Li>
              </Ul>

              <H3>ההבטחה</H3>
              <Ul>
                <Li k="נקודת הפתיחה">לקוח יכול להגיע לתבל עם בעיה ולא עם מפרט טכני.</Li>
                <Li k="הרצף">Discovery → Business Mapping → Product Strategy → UX/UI → Architecture → Development → Integrations → AI → Deployment → Maintenance → Improvement</Li>
                <Li k="Differentiator">Business understanding + UX + Engineering + End-to-End execution</Li>
                <Li k="Primary outcome">Less friction. Better operations. Scalable technology.</Li>
              </Ul>

              <H2>השכבות של תבל</H2>
              {layers.map((l, i) => <Product key={l.title} layer={l} first={i === 0} />)}

              <H3>ההיגיון שמחבר הכול</H3>
              <P>Understand the business → Build its technology → Connect it → Make it intelligent → Improve it continuously.</P>

              <H2>שירותים וקהל יעד</H2>
              <H3 first>שירותים</H3>
              <Ul>
                <Li k="פיתוח">מערכות מידע, Back Office, פורטלים, דשבורדים, CRM, ERP, Web Apps, אפליקציות מובייל, אתרים ו-APIs</Li>
                <Li k="Intelligence">AI Agents, Internal Copilots, RAG, Document AI, אוטומציות, אינטגרציות ומערכי שירות לקוחות מבוססי AI</Li>
                <Li k="שירותי תוכנה מקיפים">אפיון, Product Strategy, UX/UI, Architecture, Cloud, Deployment, QA, Monitoring, Security hardening, תחזוקה, פיתוח המשך וייעוץ טכנולוגי</Li>
              </Ul>
              <H3>פרופיל לקוח טיפוסי</H3>
              <Ul>{profile.map((p) => <Li key={p}>{p}</Li>)}</Ul>

              <H2>סימנים לפנייה מתאימה</H2>
              <Ul>{signs.map((s) => <Li key={s}>{s}</Li>)}</Ul>

              <H2>שאלות נפוצות</H2>
              <Ul>
                {faq.map((g) => (
                  <Li key={g.group} k={g.group}>
                    <Ul nested>{g.qa.map(([q, a]) => <Li key={q} k={q}>{a}</Li>)}</Ul>
                  </Li>
                ))}
              </Ul>

              <H2>משפטי מותג</H2>
              <Ul>
                <Li k="Brand line">TEVEL builds the systems businesses run on.</Li>
                <Li k="עברית">תבל בונה את המערכות שעליהן עסקים עובדים.</Li>
                <Li k="Differentiation line">אנחנו מבינים איך העסק עובד — ובונים את הטכנולוגיה שתגרום לו לעבוד טוב יותר.</Li>
                <Li k="Core belief">Technology should serve the business, not become another problem the business has to manage.</Li>
                <Li k="R&D">TEVEL — Build what matters.</Li>
                <Li k="המסר הרחב">Bring us the problem. We&apos;ll find the technology.</Li>
                <Li k="בואו נדבר"><A href="/contact">ספרו לנו מה לא עובד</A></Li>
              </Ul>
            </Reveal>
          </article>
        </div>
      </div>
    </section>
  );
}
