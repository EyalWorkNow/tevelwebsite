import type { Metadata } from "next";
import Link from "next/link";
import AsciiField from "@/components/AsciiField";
import Logos from "@/components/Logos";
import { Glyph, Arrow } from "@/components/icons";
import { Reveal, CtaBand } from "@/components/ui";
import PrintButton from "./PrintButton";
import LearningLoop from "./LearningLoop";

// Hidden executive summary ("תכלס"): not in nav, sitemap or llms.txt, and not indexed. Share www.tevel.space/tahles.
export const metadata: Metadata = {
  title: "תכלס — תבל במבט אחד",
  description: "תקציר מנהלים: מה תבל עושה, השירותים, איך עובדים ולמי זה מתאים.",
  robots: { index: false, follow: false, nocache: true },
};

const rise = (d: number) => ({ animation: `slide-up-and-fade .7s ${d}s cubic-bezier(.16,1,.3,1) both` });

const layers = [
  { tag: "BUILD", t: "בונים תוכנה", d: "מערכות מידע, CRM ו-ERP, Back Office, Web Apps ואפליקציות.", c: "var(--color-teal)" },
  { tag: "INTELLIGENCE", t: "מחברים ומוסיפים חוכמה", d: "AI, אוטומציות, אינטגרציות ושירות לקוחות מבוסס AI.", c: "var(--color-brand)" },
  { tag: "TRANSFORM", t: "מבינים מה צריך להשתנות", d: "מיפוי העסק, ניתוח תהליכים ו-Technology Roadmap.", c: "var(--color-amber)" },
  { tag: "INVENT", t: "R&D כשאין פתרון מוכן", d: "מחקר, היתכנות, PoC, אבות-טיפוס ולומדות — עד מוצר.", c: "var(--color-violet)" },
];

const services: [string, string, string, string][] = [
  ["frame", "מערכות מידע ו-Back Office", "מערכות תפעול, פורטלים, דשבורדים והרשאות — מותאמות לתהליך.", "״רק עובד אחד יודע איך התהליך עובד.״"],
  ["people", "CRM בהתאמה אישית", "מליד ועד שימור: Pipelines, משימות, Follow-ups ואנליטיקה.", "״ה-CRM לא מתאים לנו.״"],
  ["bank", "ERP ומערכות תפעול", "רכש, מלאי, ספקים והזמנות — מודול, שכבה או מערכת שלמה.", "״הכול אצלנו באקסלים.״"],
  ["swap", "אוטומציות ואינטגרציות", "מערכות שמדברות זו עם זו. פחות Copy/Paste, פחות טעויות.", "״המערכות שלנו לא מדברות.״"],
  ["spark", "AI לעסקים", "Agents, Copilots, RAG ו-Document AI — רק איפה שיש ערך אמיתי.", "״רוצים AI אבל לא יודעים איפה הוא יעזור.״"],
  ["chat", "שירות לקוחות מבוסס AI", "AI מטפל בנפח, אנשים במה שדורש אנשים — עם הקשר מלא.", "״אנחנו מקבלים יותר מדי פניות.״"],
  ["code", "אפליקציות ו-Web", "אפליקציות מובייל, Web Apps, פורטלים ואתרים — מאפיון ועד השקה.", "״יש לנו מוצר לבנות.״"],
  ["book", "לומדות ומערכות למידה", "לומדות, LMS מותאם, Adaptive Learning ו-AI Tutors.", "״ההדרכה אצלנו לא נמדדת.״"],
  ["pulse", "R&D ו-Custom Technology", "PoC, אבות-טיפוס, Computer Vision ו-IoT.", "״אפשר בכלל לבנות את זה?״"],
];

const learning: [string, string][] = [
  ["לומדות ממוקדות", "תוכן אינטראקטיבי עם תרגול, משוב ובדיקת הבנה — לא רק ״קורס באתר״."],
  ["LMS מותאם לארגון", "קורסים, מודולים, מבחנים, הסמכות, קבוצות, הרשאות ודוחות — כשה-LMS מהמדף לא מתאים."],
  ["Adaptive Learning", "המסלול מתאים את עצמו לפי ביצועים, טעויות, קצב ורמת ידע."],
  ["AI בלמידה", "AI Tutor, שאלות ותשובות, יצירת תרגול ומשוב מותאם — עם גבולות ומקורות ידע מוגדרים."],
  ["סימולציות והכשרה", "תרגול תרחישים: שירות, מכירות, נהלים תפעוליים ו-Onboarding."],
  ["Learning Analytics", "מה המנהל צריך לראות: התקדמות, נושאים חלשים, נשירה — ונתונים שאפשר לקבל לפיהם החלטות."],
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

const why: [string, string, string][] = [
  ["מתחילים מהבעיה", "לא שואלים ״איזו מערכת?״ אלא ״מה מנסים לפתור?״", "eye"],
  ["Custom רק כשצריך", "אם מוצר מדף פותר — נגיד את זה.", "frame"],
  ["AI עם תכלית", "AI נכנס רק כשיש לו תפקיד עסקי ברור.", "spark"],
  ["UX בליבה", "מערכת טובה היא מערכת שעובדים משתמשים בה.", "people"],
  ["מקצה לקצה", "גורם אחד אחראי — במקום לתאם חמישה ספקים.", "stack"],
  ["מודל בוטיק", "עבודה קרובה וקשר ישיר עם מי שבונה.", "chat"],
];

function Head({ n, eyebrow, children }: { n: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <p className="label flex items-center gap-3 text-muted"><span className="font-mono text-brand" dir="ltr">{n}</span>{eyebrow}</p>
      <h2 className="h2 mt-3">{children}</h2>
    </Reveal>
  );
}

export default function Tachles() {
  return (
    <div className="tachles">
      {/* Hero — same language as the home page */}
      <section className="w-full">
        <div className="wrap">
          <div className="inner grid gap-6 pb-10 pt-12 md:grid-cols-[1.4fr_1fr] md:items-end md:pt-20">
            <div>
              <p className="label text-brand" style={rise(0)}>תכלס · תבל במבט אחד</p>
              <h1 className="display mt-6">
                <span className="block" style={rise(0.05)}>תבל בונה את המערכות</span>
                <span className="block" style={rise(0.12)}>שעליהן עסקים עובדים.</span>
              </h1>
              <p className="mt-6 max-w-[640px] text-lg font-light leading-8 md:text-xl" style={rise(0.2)}>
                בית תוכנה, שותף טכנולוגי וסטודיו R&amp;D. אנחנו מבינים איך העסק עובד{" "}
                <span className="text-muted">— ובונים את הטכנולוגיה שתגרום לו לעבוד טוב יותר.</span>
              </p>
              <div className="mt-8 flex flex-wrap gap-3 print:hidden" style={rise(0.28)}>
                <Link href="/contact" className="btn-light group">בואו נדבר <Arrow className="transition-transform duration-300 group-hover:-translate-x-0.5" /></Link>
                <PrintButton />
              </div>
            </div>
            <div className="grid gap-3" style={rise(0.3)}>
              {[["מה", "תוכנה עסקית, AI, אוטומציות, לומדות ומוצרים דיגיטליים — מקצה לקצה."], ["למי", "עסקים וארגונים עם מורכבות תפעולית אמיתית."], ["איך", "מתחילים מהבעיה, לא מהטכנולוגיה."]].map(([k, v]) => (
                <div key={k} className="flex gap-4 rounded-lg border border-line bg-ink/60 p-4 backdrop-blur">
                  <span className="label shrink-0 pt-1 text-brand">{k}</span><span className="leading-7">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-[140px] w-full border-t border-line print:hidden md:h-[200px]"><AsciiField /></div>
      </section>

      <div className="print:hidden"><Logos /></div>

      {/* 01 Layers */}
      <section className="rule">
        <div className="wrap"><div className="inner py-14 md:py-[72px]">
          <Head n="01" eyebrow="מה אנחנו">ארבע שכבות, DNA אחד</Head>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {layers.map((l, i) => (
              <Reveal key={l.tag} delay={i * 90}>
                <div className="group h-full rounded-lg border border-line p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-ink-2" style={{ borderTopColor: l.c, borderTopWidth: 2 }}>
                  <p className="font-mono text-xs tracking-[0.08em]" style={{ color: l.c }} dir="ltr">{l.tag}</p>
                  <p className="mt-4 text-xl font-light">{l.t}</p>
                  <p className="mt-2 text-sm leading-6 text-stone-2">{l.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div></div>
      </section>

      {/* 02 Services */}
      <section className="rule">
        <div className="wrap"><div className="inner py-14 md:py-[72px]">
          <Head n="02" eyebrow="השירותים">מה אנחנו יודעים לעשות</Head>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(([icon, t, d, pain], i) => (
              <Reveal key={t} delay={(i % 3) * 80}>
                <div className="group flex h-full flex-col rounded-lg border border-line p-5 transition-all duration-300 hover:-translate-y-1 hover:border-line-2 hover:bg-ink-2">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded border border-line-2 text-stone transition-colors group-hover:border-brand group-hover:text-brand"><Glyph name={icon} /></span>
                    <h3 className="text-lg leading-6">{t}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-stone">{d}</p>
                  <p className="mt-auto pt-5 text-sm text-muted">{pain}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div></div>
      </section>

      {/* 03 Learning */}
      <section className="rule">
        <div className="wrap"><div className="inner grid items-center gap-12 py-14 md:grid-cols-[1.2fr_1fr] md:py-[72px]">
          <div>
            <Head n="03" eyebrow="לומדות ו-Learning Technology">מערכות שלא רק מציגות תוכן — אלא יודעות לנהל למידה.</Head>
            <Reveal delay={80}>
              <p className="mt-5 max-w-[560px] text-lg font-light leading-8 text-stone">
                אנחנו מפתחים לומדות, מערכות הדרכה ופלטפורמות למידה שמודדות התקדמות, מזהות פערי ידע, מתאימות תרגול ונותנות למנהלים תמונה של תהליך הלמידה.
              </p>
            </Reveal>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {learning.map(([t, d], i) => (
                <Reveal key={t} delay={(i % 2) * 80}>
                  <div className="h-full rounded-lg border border-line p-4 transition-colors duration-300 hover:border-line-2 hover:bg-ink-2">
                    <p className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-brand" />{t}</p>
                    <p className="mt-1.5 text-sm leading-6 text-stone-2">{d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={120}><p className="mt-5 text-sm text-muted">Gamification משרתת את מטרת הלמידה — לא הסחת דעת. ו-AI עובד עם גבולות ומקורות ידע מוגדרים.</p></Reveal>
          </div>
          <Reveal delay={150}><LearningLoop /></Reveal>
        </div></div>
      </section>

      {/* 04 Process */}
      <section className="rule">
        <div className="wrap"><div className="inner py-14 md:py-[72px]">
          <Head n="04" eyebrow="התהליך">איך זה עובד</Head>
          <ol className="relative mt-10 grid gap-3 md:grid-cols-5">
            <span className="absolute inset-x-0 top-[26px] hidden h-px bg-gradient-to-l from-brand via-line-2 to-line md:block" aria-hidden />
            {steps.map(([t, d], i) => (
              <Reveal as="li" key={t} delay={i * 100} className="relative">
                <div className="h-full rounded-lg border border-line bg-ink p-5 transition-colors duration-300 hover:bg-ink-2">
                  <span className="grid size-7 place-items-center rounded-full border border-brand font-mono text-xs text-brand" dir="ltr">0{i + 1}</span>
                  <p className="mt-4 text-lg">{t}</p>
                  <p className="mt-1 text-sm leading-6 text-stone-2">{d}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div></div>
      </section>

      {/* 05 Levels + audience */}
      <section className="rule">
        <div className="wrap"><div className="inner grid gap-12 py-14 md:grid-cols-2 md:py-[72px]">
          <div>
            <Head n="05" eyebrow="רמות פתרון">שלוש רמות, לפי כדאיות</Head>
            <div className="mt-8 space-y-3">
              {levels.map(([en, he, d], i) => (
                <Reveal key={en} delay={i * 90}>
                  <div className="flex items-start justify-between gap-4 rounded-lg border border-line p-4 transition-colors duration-300 hover:border-line-2 hover:bg-ink-2">
                    <div><p className="text-lg">{he}</p><p className="text-sm text-stone-2">{d}</p></div>
                    <span className="label shrink-0 text-muted" dir="ltr">{en}</span>
                  </div>
                </Reveal>
              ))}
              <p className="text-sm text-muted">ההמלצה מבוססת על כדאיות אמיתית — לא על האפשרות היקרה ביותר.</p>
            </div>
          </div>
          <div>
            <Head n="06" eyebrow="למי זה מתאים">עסקים עם מורכבות אמיתית</Head>
            <ul className="mt-8 space-y-3 text-lg text-stone">
              {["כ-10 עובדים ומעלה, כמה מחלקות או בעלי תפקידים", "נפח לקוחות משמעותי ומערכות שונות", "הרבה עבודה ידנית ומידע מפוזר", "רוצים לגדול בלי להוסיף אנשים על כל גידול", "ארגונים שצריכים הדרכה ולמידה שנמדדות", "יזמים וחברות עם רעיון טכנולוגי שצריך להוכיח"].map((x, i) => (
                <Reveal as="li" key={x} delay={i * 60} className="flex gap-3"><span className="mt-3 size-1.5 shrink-0 rounded-full bg-brand" />{x}</Reveal>
              ))}
            </ul>
          </div>
        </div></div>
      </section>

      {/* 07 Why */}
      <section className="rule">
        <div className="wrap"><div className="inner py-14 md:py-[72px]">
          <Head n="07" eyebrow="למה תבל">מה מבדל אותנו</Head>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {why.map(([t, d, icon], i) => (
              <Reveal key={t} delay={(i % 3) * 80}>
                <div className="group h-full rounded-lg border border-line p-5 transition-all duration-300 hover:-translate-y-1 hover:border-line-2 hover:bg-ink-2">
                  <span className="grid size-10 place-items-center rounded border border-line-2 text-stone transition-colors group-hover:border-brand group-hover:text-brand"><Glyph name={icon} /></span>
                  <p className="mt-5 text-lg">{t}</p>
                  <p className="mt-1 text-sm leading-6 text-stone-2">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div></div>
      </section>

      <div className="rule"><CtaBand /></div>
    </div>
  );
}
