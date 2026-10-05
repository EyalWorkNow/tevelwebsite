import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui";
import CurrencyField from "@/components/pages/reports/CurrencyField";

export const metadata: Metadata = seo("/reports");

type Doc = { name: string; body: string };
const years: { year: string; intro: string; docs: Doc[]; padded: boolean }[] = [
  {
    year: "Focused Fix",
    intro: "פתרון ממוקד: פותרים את הבעיה המרכזית שבגללה הגעתם — בלי לפרק את מה שכבר עובד.",
    docs: [
      { name: "מפת תהליכים ממוקדת", body: "מיפוי של התהליך הבעייתי: מי עושה מה, איפה העבודה נתקעת, מה נעשה ידנית ואיפה המידע מתפצל בין מערכות, קבצים והודעות." },
      { name: "אוטומציה או אינטגרציה נקודתית", body: "חיבור בין מערכות קיימות, אוטומציה לתהליך חוזר או כלי פנימי קטן שסוגר את הפער." },
    ],
  },
  {
    year: "Core Transformation",
    intro: "טיפול שורש: פותרים את הבעיה ואת הגורמים המרכזיים שמייצרים אותה.",
    docs: [
      { name: "תכנון ארכיטקטורה", body: "Target workflow וארכיטקטורה טכנולוגית: איך התהליכים, המערכות והמידע מתחברים — כך שהפתרון יחזיק גם כשהעסק גדל." },
      { name: "מערכת ליבה מותאמת", body: "מערכת, אינטגרציה, AI או אוטומציה שנבנים סביב הדרך שבה העסק באמת עובד — כולל הטמעה ושיפור שוטף." },
    ],
  },
  {
    year: "Full Transformation",
    intro: "שינוי מערכתי: מתכננים מחדש שכבה רחבה מהתשתית הדיגיטלית והתפעולית — בשלבים.",
    docs: [
      { name: "Technology Roadmap", body: "מפת דרכים בשלבים: מה בונים קודם, מה מחברים, מה מחליפים ומה לא עושים בכלל — לפי Impact, עלות, מורכבות וסיכון." },
      { name: "תוכנית מימוש מדורגת", body: "מערכות, אוטומציות ו-AI שנכנסים לעבודה בהדרגה, עם מדידה ושיפור בכל שלב." },
    ],
  },
].map((y, k) => ({ ...y, padded: k !== 1 }));

export default function ReportsPage() {
  return (
    <>
      <section className="wrap">
        <div className="inner flex flex-col items-center gap-8 pb-10 pt-10 text-center md:py-20">
          <Reveal><h1 className="font-serif text-[36px] font-light leading-10 tracking-[-0.05em] md:text-[48px] md:leading-[48px]">שלוש רמות פתרון</h1></Reveal>
          <Reveal delay={80}><p className="max-w-[616px] text-lg font-light leading-6 md:text-xl md:leading-7">לא בוחרים אוטומטית באפשרות היקרה ביותר. אחרי שמבינים מה באמת לא עובד, ממליצים על הרמה שמתאימה לעסק — וההמלצה מבוססת על כדאיות אמיתית.</p></Reveal>
        </div>
      </section>
      <div className="h-[180px] border-y border-line md:h-32"><CurrencyField /></div>

      {years.map(({ year, intro, docs, padded }) => (
        <section key={year} className="wrap">
          <div className="inner py-16 md:py-20">
            <div className={`grid gap-y-8 md:grid-cols-12 px-2 md:gap-x-5 md:px-8 ${padded ? "md:py-16" : ""}`}>
              <Reveal className="flex flex-col gap-5 md:col-span-5">
                <h2 className="font-serif text-[32px] font-light leading-9 tracking-[-0.04em] md:text-[49px] md:leading-[52px]">{year}</h2>
                <p className="max-w-[400px] text-base leading-6 tracking-[0.01em] text-stone-2 md:text-xl md:leading-8">
                  {intro}
                </p>
              </Reveal>
              <ul className="grid gap-8 md:col-span-6 md:col-start-7">
                {docs.map((d, i) => (
                  <Reveal as="li" key={d.name} delay={80 + i * 80} className="grid gap-x-5 gap-y-3 md:grid-cols-[minmax(0,400px)_1fr]">
                    <h3 className="text-base leading-6 tracking-[0.01em] md:col-span-2 md:text-xl md:leading-8">{d.name}</h3>
                    <p className="text-sm leading-5 tracking-[0.01em] text-stone-2 md:text-base md:leading-6">{d.body}</p>
                    <Link
                      href="/contact"
                      className="mt-2 inline-flex h-11 items-center self-center justify-self-start rounded-lg bg-paper px-5 font-mono text-base uppercase leading-4 text-ink-2 transition-[background-color,box-shadow] duration-200 hover:bg-paper-2 hover:shadow-[inset_0_0_0_1px_#c2bcb2] md:mt-0 md:justify-self-end"
                    >
                      לשיחת Discovery
                    </Link>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
