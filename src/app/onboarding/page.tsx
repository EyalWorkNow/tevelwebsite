import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { Placeholder, Reveal } from "@/components/ui";
import { Arrow } from "@/components/icons";

export const metadata: Metadata = seo("/onboarding");

type Item = { title: string; body: string; cta?: string };
type Group = { heading: string; sub: string; items: Item[] };

// Item / group counts mirror the reference page (3 · 3 · 6 · 3 · 1); copy per brief §10 + R&D §29–30.
const groups: Group[] = [
  {
    heading: "פרופיל טיפוסי",
    sub: "עסקים וארגונים עם פעילות ומורכבות תפעולית אמיתית.",
    items: [
      { title: "כ-10 עובדים ומעלה", body: "מספר מחלקות או בעלי תפקידים, ומחזור של מיליוני שקלים." },
      { title: "נפח לקוחות משמעותי", body: "פניות, הזמנות ולקוחות בכמות שכבר אי אפשר לנהל בזיכרון של עובד אחד או בקובץ משותף." },
      { title: "מערכות שונות ומידע מפוזר", body: "עבודה ידנית, מידע שמתפצל בין כלים — וצורך לגדול בצורה יעילה." },
    ],
  },
  {
    heading: "מאיפה מתחילים",
    sub: "אפשר להגיע עם בעיה ולא עם מפרט טכני.",
    items: [
      { title: "יש בעיה, אין מפרט", body: "ספרו לנו מה לא עובד. הפתרון נקבע אחרי הבנת הבעיה.", cta: "בואו נדבר" },
      { title: "לא ברור מה באמת לא עובד", body: "מתחילים ב-Discovery: ממפים אנשים, מערכות, מידע ותהליכים.", cta: "קבעו שיחת Discovery" },
      { title: "רוצים AI אבל לא יודעים איפה", body: "AI נכנס כשיש לו תפקיד עסקי ברור. לפעמים אוטומציה פשוטה תהיה אמינה וזולה יותר — ואנחנו נגיד את זה.", cta: "בואו נדבר" },
    ],
  },
  {
    heading: "סימנים שאתם במקום הנכון",
    sub: "משפטים שאנחנו שומעים בשיחה הראשונה.",
    items: [
      { title: "״הכול אצלנו באקסלים.״", body: "נתונים בקבצים, מסמכים במייל ומשימות בקבוצות.", cta: "בואו נדבר" },
      { title: "״המערכות שלנו לא מדברות.״", body: "עובדים מעתיקים מידע ידנית בין כלים.", cta: "בואו נדבר" },
      { title: "״רק עובד אחד יודע איך התהליך עובד.״", body: "תלות באנשים ספציפיים במקום בתהליך.", cta: "בואו נדבר" },
      { title: "״אין לי תמונת מצב.״", body: "להנהלה קשה לראות את העסק במקום אחד.", cta: "בואו נדבר" },
      { title: "״ה-CRM לא מתאים לנו.״", body: "המערכת מכתיבה את הדרך שבה העסק עובד — ולא להפך.", cta: "בואו נדבר" },
      { title: "״כל צמיחה מחייבת עוד אנשים.״", body: "ככל שהעסק גדל, החיכוך גדל איתו.", cta: "בואו נדבר" },
    ],
  },
  {
    heading: "R&D: למי זה מתאים",
    sub: "כשאין עדיין פתרון מוכן — ולמי זה פחות מתאים.",
    items: [
      { title: "מוצר חדש או בעיה בלי SaaS מתאים", body: "חברה שרוצה לפתח מוצר חדש, יזם שצריך להוכיח היתכנות, או ארגון שרוצה לבדוק טכנולוגיה לפני השקעה מלאה.", cta: "תביאו את הבעיה" },
      { title: "תוכנה, חומרה, AI ולמידה", body: "חיבור תוכנה לחומרה, רעיון AI מורכב, Prototype, או לומדה ומערכת הדרכה מותאמת.", cta: "תביאו את הבעיה" },
      { title: "מתי R&D פחות מתאים", body: "כשמחפשים התחייבות לתוצאה לפני בדיקת היתכנות, כשאין דרך סבירה לבדוק את הרעיון, או כשמוצר מדף פותר את הבעיה באופן מלא וזול משמעותית. R&D טוב כולל גם את היכולת לומר: לא כדאי לבנות." },
    ],
  },
  {
    heading: "מה להכין לשיחה",
    sub: "לא צריך מצגת ולא מסמך דרישות.",
    items: [
      { title: "לפני השיחה הראשונה", body: "תיאור קצר של הבעיה, אילו מערכות וכלים אתם משתמשים בהם היום, מי מעורב בתהליך ואיפה הוא נתקע.", cta: "קבעו שיחת Discovery" },
    ],
  },
];

const intro = [
  "ליבת השירות של תבל מיועדת לעסקים וארגונים עם פעילות ומורכבות תפעולית אמיתית — כאלה שגדלו, ועכשיו הכלים שלהם כבר לא עובדים יחד.",
  "לידים ב-WhatsApp, לקוחות ב-CRM, נתונים ב-Excel, מסמכים במייל ושירות הלקוחות במקום נוסף. עובדים מעתיקים מידע ידנית, וההנהלה מתקשה לקבל תמונת מצב אחת.",
  "לא צריך להגיע עם מפרט טכני. מספיק להגיע עם בעיה.",
];

function GuideButton({ children }: { children: string }) {
  return (
    <Link
      href="/contact"
      className="group inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-lg bg-paper px-5 font-mono text-base uppercase leading-4 text-ink-2 transition-colors duration-300 hover:bg-paper-2 md:mb-3 md:self-center"
    >
      {children}
      <Arrow className="transition-transform duration-300 group-hover:-translate-x-0.5" />
    </Link>
  );
}

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-12 pb-20 pt-16 md:px-20 md:pt-[100px]">
      {/* Intro: copy left, photo right */}
      <section className="grid gap-12 md:grid-cols-2 md:gap-5">
        <div className="flex flex-col gap-3 md:gap-5">
          <Reveal>
            <h1 className="font-serif text-[30px] leading-9 tracking-[-0.04em] md:text-[49px] md:leading-[52px]">למי זה מתאים</h1>
          </Reveal>
          {intro.map((t, i) => (
            <Reveal key={i} delay={80 + i * 60}>
              <p className="text-base leading-6 tracking-[0.01em] text-stone-2 md:text-xl md:leading-8">{t}</p>
            </Reveal>
          ))}
          <Reveal delay={260}>
            <p className="text-base leading-6 tracking-[0.01em] text-stone-2 md:text-xl md:leading-8">ספרו לנו איך אתם עובדים היום.</p>
          </Reveal>
        </div>
        <Reveal delay={120} className="md:pt-[7px]">
          <Placeholder seed={2} className="aspect-[3/2] w-full" label="תהליכים · מערכות · מידע" />
        </Reveal>
      </section>

      {/* Audience groups */}
      <div className="mt-16 flex flex-col gap-16 md:mt-32 md:gap-32">
        {groups.map((g, gi) => (
          <section key={gi} className="grid gap-10 md:grid-cols-2 md:gap-5">
            <Reveal>
              <div className="flex max-w-[400px] flex-col gap-2 md:gap-5">
                <h2 className="font-serif text-[30px] leading-9 tracking-[-0.04em] md:text-[49px] md:leading-[52px]">{g.heading}</h2>
                <p className="text-base leading-6 tracking-[0.01em] text-stone-2 md:text-xl md:leading-8">{g.sub}</p>
              </div>
            </Reveal>
            <ul className="flex flex-col gap-8">
              {g.items.map((it, i) => (
                <Reveal as="li" key={i} delay={i * 60} className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                  <div className={`flex flex-col gap-2.5 md:gap-3 ${it.cta ? "md:max-w-[400px]" : ""}`}>
                    <h3 className="text-base leading-6 tracking-[0.01em] md:text-xl md:leading-8">{it.title}</h3>
                    <p className="text-sm leading-5 tracking-[0.01em] text-stone-2 md:text-base md:leading-6">{it.body}</p>
                  </div>
                  {it.cta && <GuideButton>{it.cta}</GuideButton>}
                </Reveal>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
