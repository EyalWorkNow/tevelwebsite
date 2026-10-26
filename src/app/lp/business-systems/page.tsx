import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";
import { Button, Section } from "@/components/ui";
import { Arrow } from "@/components/icons";

export const metadata: Metadata = {
  title: "CRM ומערכות מידע לעסק בצמיחה",
  description: "הטמעת CRM, פיתוח מערכות מידע ואוטומציה לתהליכים של העסק שלכם. מתחילים בשיחת אפיון עם בית תוכנה תבל.",
  alternates: { canonical: "/lp/business-systems" },
  robots: { index: false, follow: false },
};

const solutions = [
  { number: "01", title: "CRM שמתאים לדרך שבה אתם עובדים", body: "ריכוז לקוחות, פניות ומשימות, והתאמת תהליך המכירה והשירות לתחום של העסק שלכם.", example: "מפנייה ראשונה ועד טיפול בלקוח, בתהליך מסודר אחד." },
  { number: "02", title: "מערכת מידע סביב התפעול שלכם", body: "פיתוח מערכת מותאמת לניהול תהליכים, מידע ודוחות כשכלי מדף כבר לא נותנים מענה.", example: "ממשק אחד שמחבר את הצוותים ואת המידע שהם צריכים." },
  { number: "03", title: "הכלים שלכם מתחילים לדבר", body: "חיבור בין מערכות קיימות ואוטומציה של פעולות חוזרות כדי להפחית העתקות ועבודה ידנית.", example: "מידע שעובר בין השלבים בלי להזין אותו מחדש." },
];

export default function BusinessSystemsLandingPage() {
  return (
    <>
      <section className="wrap">
        <div className="inner grid gap-12 pb-16 pt-12 md:py-20 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <p className="label mb-6 text-brand">TEVEL · מערכות מידע לעסקים בצמיחה</p>
            <h1 className="display max-w-[720px]">העסק גדל.<br />המערכת צריכה<br /><span className="text-brand">לגדול איתו.</span></h1>
            <p className="mt-6 max-w-[590px] text-lg font-light leading-8 text-stone md:text-xl">לקוחות באקסל, משימות בוואטסאפ ומידע שמוזן שוב ושוב? תבל מטמיעה CRM, מפתחת מערכות מידע ומחברת תהליכים סביב הדרך שבה העסק שלכם באמת עובד.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="#consultation" arrow>בואו נאפיין את הצורך שלכם</Button>
              <span className="text-sm text-muted">אפשר להתחיל מבעיה, לא ממפרט טכני.</span>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-line bg-ink-2">
            <div className="flex items-center justify-between border-b border-line px-6 py-4"><span className="label text-stone">ממידע מפוזר לתהליך מחובר</span><span className="size-2 rounded-full bg-brand" aria-hidden /></div>
            <div className="p-6 md:p-8">
              <p className="label mb-4 text-muted">כך יכול להיראות התהליך שלכם</p>
              <div className="grid grid-cols-3 gap-2 text-center text-sm text-stone">{["פניות", "לקוחות", "משימות"].map((label) => <div key={label} className="rounded-lg border border-line-2 py-4">{label}</div>)}</div>
              <div className="mx-auto h-8 w-px bg-brand/50" aria-hidden />
              <div className="rounded-xl border border-brand/50 bg-brand/5 px-5 py-7 text-center"><p className="label text-brand">מערכת אחת · תהליך משותף</p><p className="mt-3 text-2xl font-light">המידע הנכון. בזמן הנכון.</p></div>
              <div className="mx-auto h-8 w-px bg-brand/50" aria-hidden />
              <div className="grid grid-cols-3 gap-2 text-center text-sm text-stone">{["מכירות", "תפעול", "שירות"].map((label) => <div key={label} className="rounded-lg border border-line-2 py-4">{label}</div>)}</div>
              <p className="mt-5 text-xs text-muted">תרשים להמחשת התהליך. הפתרון ייקבע בהתאם לאפיון העסק.</p>
            </div>
          </div>
        </div>
      </section>
      <Section>
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><h2 className="h2 max-w-xl">לא מתחילים מטכנולוגיה.<br />מתחילים ממה שמאט את העסק.</h2><p className="max-w-md leading-7 text-stone-2">לעסקים שצריכים סדר בתהליך המכירה, לחברות עם תפעול מורכב ולצוותים שהמידע שלהם מפוזר בין מערכות.</p></div>
        <div className="grid gap-6 md:grid-cols-3">{solutions.map((item) => <article key={item.number} className="flex flex-col border-t border-line-2 pt-6"><span className="label text-brand">{item.number}</span><h3 className="mt-5 text-2xl font-light leading-8">{item.title}</h3><p className="mt-4 leading-7 text-stone-2">{item.body}</p><p className="mt-6 border-r border-brand/50 pr-4 text-sm leading-6 text-stone">{item.example}</p></article>)}</div>
      </Section>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]"><div><p className="label mb-4 text-brand">מהשיחה הראשונה ועד ההטמעה</p><h2 className="h2">צעד ברור בכל שלב.</h2></div><ol className="grid gap-8 sm:grid-cols-3">{[
          ["מבינים", "ממפים את הצורך, הכלים הקיימים והנקודות שבהן העבודה נעצרת."],
          ["מתכננים", "בודקים מה נכון להטמיע, מה צריך לפתח ומה כדאי לחבר."],
          ["בונים ומטמיעים", "מתקדמים לפי היקף מוסכם, עם בדיקות והתאמה לשימוש של הצוות."],
        ].map(([title, body], index) => <li key={title}><span className="label text-muted">0{index + 1}</span><h3 className="mt-4 text-xl">{title}</h3><p className="mt-3 text-sm leading-7 text-stone-2">{body}</p></li>)}</ol></div>
      </Section>
      <Section id="consultation" className="scroll-mt-20">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div><p className="label mb-4 text-brand">מתחילים בשיחת אפיון</p><h2 className="h2">מה אתם רוצים<br />שיעבוד טוב יותר?</h2><p className="mt-6 leading-8 text-stone-2">ספרו לנו על העסק ועל הצורך המרכזי. נחזור אליכם כדי להבין את התהליך ולבדוק אם הפתרון שלנו מתאים. לא צריך להכין מסמך דרישות מראש.</p><div className="mt-8 flex items-start gap-3 text-sm leading-7 text-stone"><Arrow className="mt-1 shrink-0 text-brand" /><p>CRM, מערכת תפעולית או אוטומציה: נבחר את הכיוון בהתאם לצורך, בלי להניח מראש שצריך לפתח הכול.</p></div></div>
          <div className="rounded-2xl border border-line bg-ink-2/40 p-5 md:p-8"><LeadForm source="meta-business-systems" campaign /><p className="mt-6 text-xs leading-6 text-muted">הפרטים ישמשו ליצירת קשר בקשר לפנייה שלכם. <Link href="/legal/privacy" className="underline underline-offset-4">מדיניות פרטיות</Link></p></div>
        </div>
      </Section>
      <Section>
        <h2 className="h2 mb-8">לפני שמתחילים</h2>
        <div className="max-w-3xl">{[
          ["צריך להחליף את כל המערכות?", "לא בהכרח. נבדוק קודם מה כבר עובד ואיפה חיבור או התאמה של מערכת קיימת יכולים לתת מענה."],
          ["זה מתאים גם לעסק קטן?", "כן, כשהצורך ברור. היקף העבודה נקבע לפי התהליך שאתם רוצים לשפר והמשאבים שעומדים לרשותכם."],
          ["כמה זה עולה וכמה זמן זה לוקח?", "זה תלוי בהיקף, בחיבורים ובמורכבות. אחרי הבנת הצורך נוכל להגדיר דרך עבודה והצעה מתאימה."],
        ].map(([question, answer]) => <details key={question} className="border-b border-line py-5"><summary className="cursor-pointer text-lg">{question}</summary><p className="mt-4 leading-8 text-stone-2">{answer}</p></details>)}</div>
      </Section>
    </>
  );
}
