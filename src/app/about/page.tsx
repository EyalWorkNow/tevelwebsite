import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import { Reveal } from "@/components/ui";
import { ExploreCard, Shell } from "@/components/pages/company/parts";

export const metadata: Metadata = seo("/about");

// Each paragraph: optional bold lead-in + body.
const sections: { heading: string; paras: { lead?: string; body: string }[] }[] = [
  {
    heading: "מי אנחנו",
    paras: [
      { body: "TEVEL | תבל היא בית תוכנה, שותף טכנולוגי וסטודיו R&D שמתכנן ובונה מערכות ומוצרים טכנולוגיים מקצה לקצה. ממערכות מידע, CRM ו-ERP ועד AI, אוטומציות, מערכי שירות חכמים, אפליקציות, לומדות ופתרונות R&D מיוחדים — אנחנו מתחילים מהבעיה ובונים סביבה את הטכנולוגיה הנכונה." },
      { body: "הגישה שלנו מתחילה לפני הקוד. אנחנו מבינים את העסק, האנשים, תהליכי העבודה, זרימת המידע והבעיה העסקית שמאחורי הדרישה — ורק אז מחליטים מה נכון לבנות, לחבר, להחליף, להפוך לאוטומטי או להשאיר כפי שהוא." },
    ],
  },
  {
    heading: "המיצוב שלנו",
    paras: [
      { lead: "הכול תחת גוף אחד.", body: "Software House, Business Technology Partner, פיתוח מערכות מידע, AI & Automation Engineering, Product & UX ו-Digital Transformation." },
      { lead: "יכולות, לא תוויות.", body: "תבל אינה רק חברת אוטומציות, חברת AI, סטודיו לאפליקציות, חברת CRM או חברת בניית אתרים. אלה יכולות בתוך מעטפת רחבה יותר." },
      { lead: "למי אנחנו בונים.", body: "עבור עסקים וארגונים שהמערכות הקיימות שלהם כבר אינן עומדות בקצב הפעילות, תבל היא בית תוכנה ושותף טכנולוגי שמבין את התהליך העסקי לפני הפיתוח ומסוגל לתכנן, לבנות ולהטמיע את המערכת הנכונה — במקום למכור פתרון מדף ולדרוש מהעסק להתאים את עצמו אליו." },
    ],
  },
  {
    heading: "ההבטחה ודרך העבודה",
    paras: [
      { lead: "אפשר להגיע עם בעיה, לא עם מפרט.", body: "במקום לתאם בין יועץ, מעצב, מפתח, חברת אוטומציות וספק AI — תבל מסתכלת על המערכת כמכלול." },
      { lead: "אחריות על כל הרצף.", body: "Discovery → Business Mapping → Product Strategy → UX/UI → Architecture → Development → Integrations → AI → Deployment → Maintenance → Improvement." },
      { lead: "Engineering.", body: "כאשר הבעיה ברורה, אנחנו מתכננים ובונים את המערכת — מערכות מידע, CRM ו-ERP, AI ואוטומציות, אפליקציות ומערכות Web." },
      { lead: "R&D.", body: "כאשר הפתרון עדיין אינו ברור, אנחנו חוקרים, בודקים היתכנות ומפתחים אותו: Research → Feasibility → Architecture → PoC → Prototype → Product → Production." },
    ],
  },
];

const explore = [
  { title: "הצוות והתחומים", body: "התחומים שמרכיבים כל פרויקט — Product ו-UX, הנדסת תוכנה, AI, Data, ענן ואבטחה — והמומחים שמצטרפים לפי הצורך.", href: "/team" },
  { title: "ערכים", body: "Understand first, Build with purpose, Design for people, Measure impact, Own the outcome — חמשת העקרונות שמנחים כל החלטה שלנו.", href: "/culture" },
  { title: "עבודה איתנו", body: "מודל Boutique, קשר ישיר עם האנשים שבונים, ודרכי עבודה מ-Discovery ועד פיתוח שוטף.", href: "/careers" },
  { title: "תבל בקצרה", body: "דף עובדות: מה אנחנו עושים, ארבע השכבות BUILD, INTELLIGENCE, TRANSFORM ו-INVENT, למי זה מתאים ושאלות נפוצות.", href: "/company-facts" },
  { title: "Insights", body: "תוכן מקצועי על Build vs Buy, מתי לא צריך AI, ואיך ממפים עסק לפני פיתוח.", href: "/blog" },
  { title: "איך עובדים", body: "שלוש רמות פתרון — Focused Fix, Core Transformation ו-Full Transformation — וההמלצה נקבעת לפי כדאיות אמיתית.", href: "/pricing" },
];

export default function AboutPage() {
  return (
    <>
      <Shell>
        <article className="mx-auto max-w-[820px] px-2 md:mt-8 md:px-0">
          <Reveal>
            <p className="label mb-4 text-brand">אודות בית תוכנה תבל</p>
            <h1 className="font-serif text-[32px] font-light leading-9 tracking-[-0.04em] md:text-[49px] md:leading-[52px]">טכנולוגיה צריכה להבין את העסק.</h1>
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-2 max-w-[748px] text-base leading-6 md:mt-5 tracking-[0.01em] text-stone-2 md:text-xl md:leading-8">אנחנו לא מוכרים טכנולוגיה לשם טכנולוגיה. אנחנו משתמשים בטכנולוגיה כדי לגרום לעסק לעבוד טוב יותר.</p>
          </Reveal>
          <div className="mt-8">
            {sections.map((s, i) => (
              <Reveal key={i} delay={160 + i * 40}>
                <h2 className={`mb-8 font-serif text-[26px] font-light leading-8 tracking-[-0.04em] md:text-[31px] md:leading-10 ${i ? "mt-16" : ""}`}>{s.heading}</h2>
                {s.paras.map(({ lead, body }, j) => (
                  <p key={j} className="mt-3 text-sm leading-5 tracking-[0.01em] md:text-base md:leading-6">
                    {lead && <b className="font-medium">{lead} </b>}
                    {body}
                  </p>
                ))}
              </Reveal>
            ))}
          </div>
        </article>
      </Shell>

      <Shell rule className="grid gap-6">
        <Reveal><h2 className="h2">להכיר את תבל</h2></Reveal>
        <ul className="grid gap-4 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
          {explore.map((c, i) => (
            <ExploreCard key={i} seed={i + 3} delay={i * 60} {...c} />
          ))}
        </ul>
      </Shell>
    </>
  );
}
