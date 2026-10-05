import type { Metadata } from "next";
import Link from "next/link";
import { TevelLogo, Glyph } from "@/components/icons";
import PrintButton from "./PrintButton";

// Hidden executive summary ("תכלס"): not in nav, sitemap or llms.txt, and not indexed. Share the link directly.
export const metadata: Metadata = {
  title: "תכלס — תבל במבט אחד",
  robots: { index: false, follow: false, nocache: true },
};

const layers = [
  { tag: "BUILD", t: "בונים תוכנה", d: "מערכות מידע, CRM ו-ERP, Back Office, Web Apps ואפליקציות.", c: "var(--color-teal)" },
  { tag: "INTELLIGENCE", t: "מחברים ומוסיפים חוכמה", d: "AI, אוטומציות, אינטגרציות ושירות לקוחות מבוסס AI.", c: "var(--color-brand)" },
  { tag: "TRANSFORM", t: "מבינים מה צריך להשתנות", d: "מיפוי העסק, ניתוח תהליכים ו-Technology Roadmap.", c: "var(--color-amber)" },
  { tag: "INVENT", t: "R&D כשאין פתרון מוכן", d: "מחקר, היתכנות, PoC ואבות-טיפוס — עד מוצר.", c: "var(--color-violet)" },
];

const services: [string, string, string, string][] = [
  ["frame", "מערכות מידע ו-Back Office", "מערכות תפעול, פורטלים, דשבורדים והרשאות — מותאמות לתהליך.", "״רק עובד אחד יודע איך התהליך עובד.״"],
  ["people", "CRM בהתאמה אישית", "מליד ועד שימור: Pipelines, משימות, Follow-ups ואנליטיקה.", "״ה-CRM לא מתאים לנו.״"],
  ["bank", "ERP ומערכות תפעול", "רכש, מלאי, ספקים והזמנות — מודול, שכבה או מערכת שלמה.", "״הכול אצלנו באקסלים.״"],
  ["swap", "אוטומציות ואינטגרציות", "מערכות שמדברות זו עם זו. פחות Copy/Paste, פחות טעויות.", "״המערכות שלנו לא מדברות.״"],
  ["spark", "AI לעסקים", "Agents, Copilots, RAG ו-Document AI — רק איפה שיש ערך אמיתי.", "״רוצים AI אבל לא יודעים איפה הוא יעזור.״"],
  ["chat", "שירות לקוחות מבוסס AI", "AI מטפל בנפח, אנשים במה שדורש אנשים — עם הקשר מלא.", "״אנחנו מקבלים יותר מדי פניות.״"],
  ["code", "אפליקציות ו-Web", "אפליקציות מובייל, Web Apps, פורטלים ואתרים — מאפיון ועד השקה.", "״יש לנו מוצר לבנות.״"],
  ["pulse", "R&D ו-Custom Technology", "PoC, אבות-טיפוס, Computer Vision, IoT ולומדות.", "״אפשר בכלל לבנות את זה?״"],
  ["book", "Tevel Invoice", "המוצר שלנו לניהול מסמכים ופעילות עסקית-פיננסית.", "הוכחה שאנחנו בונים גם מוצרים."],
];

const steps: [string, string][] = [
  ["שיחה", "מספרים לנו מה לא עובד. בלי מפרט, בלי התחייבות."],
  ["Discovery", "ממפים אנשים, מערכות, מידע ותהליכים ומוצאים את נקודות הדימום."],
  ["המלצה", "מה לבנות, לחבר, להפוך לאוטומטי — או להשאיר כמו שהוא."],
  ["בנייה", "UX, ארכיטקטורה, פיתוח, אינטגרציות, AI והטמעה."],
  ["שיפור", "מודדים, מתחזקים וממשיכים לפתח."],
];

const levels: [string, string, string][] = [
  ["Focused Fix", "פתרון ממוקד", "פותרים את הבעיה המרכזית שבגללה הגעתם."],
  ["Core Transformation", "טיפול שורש", "הבעיה + הגורמים המרכזיים שמייצרים אותה."],
  ["Full Transformation", "שינוי מערכתי", "תכנון מחדש של שכבה רחבה מהתשתית."],
];

const why: [string, string][] = [
  ["מתחילים מהבעיה", "לא שואלים ״איזו מערכת?״ אלא ״מה מנסים לפתור?״"],
  ["Custom רק כשצריך", "אם מוצר מדף פותר — נגיד את זה."],
  ["AI עם תכלית", "AI נכנס רק כשיש לו תפקיד עסקי ברור."],
  ["UX בליבה", "מערכת טובה היא מערכת שעובדים משתמשים בה."],
  ["מקצה לקצה", "גורם אחד אחראי — במקום לתאם חמישה ספקים."],
  ["מודל בוטיק", "עבודה קרובה וקשר ישיר עם מי שבונה."],
];

const H = ({ n, children }: { n: string; children: React.ReactNode }) => (
  <h2 className="flex items-baseline gap-3 text-2xl font-light md:text-[28px]"><span className="font-mono text-sm text-brand" dir="ltr">{n}</span>{children}</h2>
);

export default function Tachles() {
  return (
    <div className="tachles wrap">
      <div className="inner mx-auto max-w-[1100px] py-12 md:py-16">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-6 border-b border-line pb-10">
          <div>
            <p className="label text-brand">תכלס · תבל במבט אחד</p>
            <h1 className="mt-4 text-[38px] font-light leading-[46px] md:text-[56px] md:leading-[64px]">תבל בונה את המערכות<br />שעליהן עסקים עובדים.</h1>
            <p className="mt-5 max-w-[680px] text-lg leading-8 text-stone">
              בית תוכנה, שותף טכנולוגי וסטודיו R&amp;D. אנחנו מבינים איך העסק עובד — ובונים את הטכנולוגיה שתגרום לו לעבוד טוב יותר: מערכות מידע, CRM ו-ERP, AI ואוטומציות, שירות לקוחות חכם, אפליקציות ו-R&amp;D.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3 print:hidden">
            <TevelLogo className="h-8 w-auto" />
            <PrintButton />
          </div>
        </header>

        {/* In one sentence */}
        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {[["מה", "תוכנה עסקית, AI, אוטומציות ומוצרים דיגיטליים — מקצה לקצה."], ["למי", "עסקים וארגונים עם מורכבות תפעולית אמיתית שרוצים לגדול ביעילות."], ["איך", "מתחילים מהבעיה, לא מהטכנולוגיה. בונים רק מה שבאמת צריך."]].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-line p-5"><p className="label text-muted">{k}</p><p className="mt-2 text-lg leading-7">{v}</p></div>
          ))}
        </section>

        {/* Layers */}
        <section className="mt-14">
          <H n="01">ארבע שכבות, DNA אחד</H>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {layers.map((l) => (
              <div key={l.tag} className="rounded-lg border border-line p-5" style={{ borderTopColor: l.c, borderTopWidth: 2 }}>
                <p className="font-mono text-xs tracking-[0.08em]" style={{ color: l.c }} dir="ltr">{l.tag}</p>
                <p className="mt-3 text-lg">{l.t}</p>
                <p className="mt-1 text-sm leading-6 text-stone-2">{l.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="mt-14">
          <H n="02">מה אנחנו יודעים לעשות</H>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(([icon, t, d, pain]) => (
              <div key={t} className="flex flex-col rounded-lg border border-line p-5 break-inside-avoid">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded border border-line-2 text-brand"><Glyph name={icon} width={18} height={18} /></span>
                  <h3 className="text-lg leading-6">{t}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-stone">{d}</p>
                <p className="mt-auto pt-4 text-sm text-muted">{pain}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="mt-14">
          <H n="03">איך זה עובד</H>
          <ol className="mt-6 grid gap-3 md:grid-cols-5">
            {steps.map(([t, d], i) => (
              <li key={t} className="rounded-lg border border-line p-5">
                <p className="font-mono text-xs text-muted" dir="ltr">0{i + 1}</p>
                <p className="mt-3 text-lg">{t}</p>
                <p className="mt-1 text-sm leading-6 text-stone-2">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Levels + audience */}
        <section className="mt-14 grid gap-10 md:grid-cols-2">
          <div>
            <H n="04">שלוש רמות פתרון</H>
            <div className="mt-6 space-y-3">
              {levels.map(([en, he, d]) => (
                <div key={en} className="flex items-start justify-between gap-4 rounded-lg border border-line p-4">
                  <div><p className="text-lg">{he}</p><p className="text-sm text-stone-2">{d}</p></div>
                  <span className="label shrink-0 text-muted" dir="ltr">{en}</span>
                </div>
              ))}
              <p className="text-sm text-muted">ההמלצה מבוססת על כדאיות אמיתית — לא על האפשרות היקרה ביותר.</p>
            </div>
          </div>
          <div>
            <H n="05">למי זה מתאים</H>
            <ul className="mt-6 space-y-2 text-stone">
              {["כ-10 עובדים ומעלה, כמה מחלקות או בעלי תפקידים", "נפח לקוחות משמעותי ומערכות שונות", "הרבה עבודה ידנית ומידע מפוזר", "רוצים לגדול בלי להוסיף אנשים על כל גידול"].map((x) => (
                <li key={x} className="flex gap-3"><span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand" />{x}</li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-muted">וגם: יזמים וחברות עם רעיון טכנולוגי שצריך להוכיח — דרך מסלול ה-R&amp;D.</p>
          </div>
        </section>

        {/* Why */}
        <section className="mt-14">
          <H n="06">למה תבל</H>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {why.map(([t, d]) => (
              <div key={t} className="rounded-lg border border-line p-4"><p className="text-lg">{t}</p><p className="mt-1 text-sm leading-6 text-stone-2">{d}</p></div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-14 flex flex-col items-start justify-between gap-6 rounded-xl border border-brand/40 bg-brand/5 p-6 md:flex-row md:items-center md:p-8">
          <div>
            <p className="text-2xl font-light">ספרו לנו מה לא עובד. אנחנו נתחיל משם.</p>
            <p className="mt-2 text-stone">לא צריך לדעת איזו מערכת אתם צריכים.</p>
          </div>
          <Link href="/contact" className="btn-light shrink-0 print:hidden">בואו נדבר</Link>
        </section>

        <p className="mt-10 text-center text-sm text-muted">Understand first. Build what matters.</p>
      </div>
    </div>
  );
}
