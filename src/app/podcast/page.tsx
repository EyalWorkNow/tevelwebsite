import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import { CtaBand, Reveal } from "@/components/ui";
import { EpisodeList, PlatformButton, type Episode } from "@/components/pages/podcast/Episodes";

export const metadata: Metadata = seo("/podcast");

// R&D capabilities and process (R&D master §4–§11, §21–§24). Same 14-entry list shape as before.
const entries: [guest: string, title: string, body: string, date: string][] = [
  ["שירותי R&D", "Technology Research", "מחקר טכנולוגי ממוקד סביב בעיה או מוצר: טכנולוגיות, Open Source, APIs, SDKs, מודלים, hardware, ספקים ומגבלות רישוי. התוצר אינו רשימת כלים — המטרה היא להגיע להחלטה הנדסית.", "Phase 2 · Research"],
  ["שירותי R&D", "Feasibility Study", "לפני שמשקיעים בפיתוח מלא, בודקים אם הפתרון אפשרי: ביצועים, דיוק, latency, אינטגרציה, אבטחה, זמינות מידע ועלות. בסוף התהליך: GO / CONDITIONAL GO / NO-GO — והסבר למה.", "Phase 2 · Research"],
  ["שירותי R&D", "Proof of Concept", "PoC נועד לענות על שאלה טכנולוגית קריטית — למשל, האם אפשר להגיע לזמן תגובה שמתאים למוצר. הוא אינו מוצר מוגמר; המטרה היא להקטין אי-ודאות לפני השקעה גדולה.", "Phase 3–4 · Experiment & PoC"],
  ["שירותי R&D", "Rapid Prototyping", "אחרי שהיתכנות בסיסית הוכחה, בונים Prototype שיכול לכלול UI, hardware, AI, backend, אפליקציה וחיבור חיישנים — כדי לראות איך החלקים מתחברים למוצר.", "Phase 5 · Prototype"],
  ["שירותי R&D", "Product Engineering", "כשהניסוי הופך למוצר: ארכיטקטורה, frontend, backend, mobile, data, APIs, cloud, אבטחה, בדיקות, deployment, ניטור ותיעוד.", "Phase 6 · Productization"],
  ["Custom Technology", "Custom Technology", "לא כל פרויקט נכנס לקטגוריה קיימת. במקום לדחוף אותו לתבנית של ״אפליקציה״ או ״אתר״, מגדירים את הארכיטקטורה בהתאם לבעיה.", "Phase 1 · Problem Definition"],
  ["מערכות פיזיות", "Robotics & Physical Systems", "תבל מובילה את שכבת המחקר, המוצר, התוכנה והאינטגרציה, ובונה לפי הפרויקט צוות משולב עם מומחים הנדסיים רלוונטיים.", "Sensors → Edge → Logic → Control"],
  ["מערכות פיזיות", "IoT & Connected Systems", "חיבור בין Device, Connectivity, Backend, Data, Logic ו-Interface: telemetry, התראות, ניהול מכשירים, דשבורדים ואפליקציות שליטה.", "Device → Cloud → Interface"],
  ["AI ונתונים", "Computer Vision", "מערכות שמקבלות מידע מתמונה או וידאו — זיהוי, מעקב, OCR, בקרת איכות וספירה — ומתחברות ל-ERP, CRM, התראות ותהליכי עבודה.", "Camera → Model → Action"],
  ["AI ונתונים", "Edge AI", "לא כל AI צריך לרוץ בענן. כשנדרשים latency נמוך, עבודה בלי אינטרנט, פרטיות או חיבור ישיר לחומרה — בוחנים inference על Edge Device, לפי דרישות הפרויקט.", "Cloud או Edge"],
  ["למידה", "Learning Systems & EdTech", "לומדות, מערכות LMS, פלטפורמות הדרכה ו-Onboarding, Assessment, Adaptive Learning, AI Tutors, סימולציות ו-Learning Analytics.", "Learning Technology"],
  ["תשתיות", "APIs & Infrastructure", "לפעמים המוצר אינו UI: APIs, פלטפורמות פנימיות, שכבות אינטגרציה, backend services, event systems, אימות והרשאות.", "Backend & Integration"],
  ["תשתיות", "Internal Tools", "לפעמים כלי פנימי קטן הוא המקום עם ההשפעה הגדולה: dashboard, admin panel, כלי ייבוא ובקרה, workflow manager או operations console. לא כל פתרון צריך להפוך למוצר ענק.", "Phase 7 · Deployment"],
  ["תהליך", "Prototype vs Production", "Prototype נועד ללמוד מהר; Production דורש אבטחה, אמינות, ניטור, גיבוי, הרשאות, QA ותיעוד. אנחנו שקופים לגבי השלב שבו נמצא הפרויקט — ומודדים ומשפרים גם אחרי ההטמעה.", "Phase 8 · Iterate"],
];

const episodes: Episode[] = entries.map(([guest, title, body, date], i) => ({
  n: String(i + 1).padStart(2, "0"),
  guest,
  title,
  body,
  date,
  duration: 28 + ((i * 17) % 40),
  seed: i,
}));

export default function PodcastPage() {
  return (
    <>
    <div className="mx-auto max-w-[1400px] px-7 pt-10 md:px-10 md:pt-20">
      <section className="flex flex-col items-center text-center">
        <Reveal>
          <h1 className="font-serif text-[32px] leading-10 tracking-[-0.04em] md:text-[72px] md:leading-[72px]">R&amp;D &amp; Custom Technology</h1>
        </Reveal>
        <div className="mt-2 flex max-w-[748px] flex-col gap-3 md:mt-5 md:gap-5">
          <Reveal delay={80}>
            <p className="text-base leading-6 tracking-[0.01em] text-stone-2 md:text-xl md:leading-8">יש בעיות טכנולוגיות שעדיין אין להן פתרון מוכן. אנחנו חוקרים, מתכננים ובונים פתרונות טכנולוגיים מיוחדים — מ-PoC ואבות-טיפוס ועד מערכות AI, לומדות, Computer Vision, IoT ושילובי תוכנה–חומרה.</p>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-base leading-6 tracking-[0.01em] text-stone-2 md:text-xl md:leading-8">לא חייבים להגיע עם Specification. אפשר להגיע עם שאלה — האם אפשר לבנות את זה? האם הטכנולוגיה מספיק בשלה? אנחנו יכולים לחקור את הבעיה, לבדוק היתכנות ולהגדיר את הדרך הטכנולוגית הנכונה — וגם לומר מתי לא כדאי לבנות.</p>
          </Reveal>
        </div>
        <Reveal delay={200} className="mt-8 flex flex-col items-center gap-3.5 md:flex-row md:gap-5">
          <PlatformButton label="תביאו את הבעיה" glyph="play" href="/contact" />
          <PlatformButton label="איך עובד תהליך R&D" glyph="wave" href="#process" />
          <PlatformButton label="R&D & Custom Technology" glyph="rss" href="/solutions/rd" />
        </Reveal>
      </section>

      <section id="process" className="mt-16 md:mt-24">
        <Reveal>
          <h2 className="pb-5 text-center font-serif text-[30px] leading-9 tracking-[-0.04em] md:pb-8 md:text-[49px] md:leading-[52px]">יכולות ותהליך</h2>
        </Reveal>
        <EpisodeList episodes={episodes} />
      </section>
    </div>
    <CtaBand />
    </>
  );
}
