import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import { Placeholder, Reveal } from "@/components/ui";
import { CenterHeading, PhotoMarquee, Shell } from "@/components/pages/company/parts";

export const metadata: Metadata = seo("/team");

// Disciplines, not people: name = discipline, role = what it does, bio = 1–2 lines.
type Discipline = { name: string; role: string; bio: string; note?: string };

const core: Discipline[] = [
  { name: "Product & UX", role: "אפיון, Product Strategy ו-UX/UI", bio: "מתרגמים את הבעיה העסקית למוצר ברור: תהליכים, מסכים וחוויית שימוש.", note: "מערכת עסקית לא טובה אם העובדים מתקשים להשתמש בה." },
  { name: "Software Engineering", role: "Architecture, Frontend ו-Backend", bio: "מתכננים ובונים מערכות מידע, CRM ו-ERP, Web Apps ואפליקציות מובייל — מבסיס הנתונים ועד הממשק.", note: "מהבעיה ועד מערכת עובדת." },
  { name: "AI Engineering", role: "Agents, RAG, Document AI ושירות לקוחות חכם", bio: "מטמיעים AI בתוך תהליכי העבודה — רק כשיש לו תפקיד עסקי ברור.", note: "אם workflow פשוט עושה את העבודה טוב יותר, אין סיבה להכניס LLM." },
  { name: "Data", role: "Databases, Data Processing ו-Dashboards", bio: "דואגים שהמידע יגיע בזמן לאדם הנכון ושתהיה להנהלה תמונת מצב אחת.", note: "פחות מידע שעובר ידנית בין מערכות." },
  { name: "DevOps & Cloud", role: "Cloud, Deployment ו-Monitoring", bio: "מעלים מערכות לאוויר ושומרים עליהן יציבות, זמינות וניטור לאורך זמן.", note: "Deployment, Maintenance ו-Continued development." },
  { name: "Security", role: "Security hardening, הרשאות ופרטיות", bio: "מגדירים הרשאות, אבטחה ובקרה כחלק מהתכנון — לא כתוספת בסוף.", note: "כולל Logging ו-Human approval במקומות הנדרשים." },
  { name: "Integrations", role: "APIs, Webhooks ואוטומציות", bio: "גורמים למערכות הקיימות לדבר זו עם זו: סנכרון נתונים, תהליכי אישור ותהליכים מתוזמנים.", note: "פחות Copy/Paste, פחות פעולות שחייבים לזכור." },
  { name: "R&D", role: "Research, Feasibility, PoC ו-Prototype", bio: "מובילים פרויקטים שאין להם עדיין פתרון מוכן — מהשאלה הטכנולוגית ועד אב-טיפוס עובד.", note: "R&D טוב כולל גם את היכולת לומר לא כדאי לבנות." },
];

const specialists: Discipline[] = [
  { name: "UX Research", role: "מחקר משתמשים", bio: "מצטרפים כשצריך להבין לעומק איך אנשים עובדים בפועל לפני שמתכננים." },
  { name: "Embedded", role: "תוכנה משובצת", bio: "בפרויקטים שבהם התוכנה צריכה לרוץ על התקן או לשלוט בחומרה." },
  { name: "Electronics", role: "הנדסת אלקטרוניקה", bio: "בפרויקטים של IoT, חיישנים ושילובי חומרה–תוכנה." },
  { name: "Mechanical", role: "הנדסת מכונות", bio: "בפרויקטים רובוטיים ומערכות פיזיות, לצד שכבות התוכנה, ה-AI והאינטגרציה שתבל מובילה." },
  { name: "Industrial Design", role: "עיצוב תעשייתי", bio: "כשהמוצר כולל רכיב פיזי שצריך להיות שמיש ומוכן לייצור." },
  { name: "Domain Experts", role: "מומחי תוכן ותחום", bio: "מומחים מהתחום של הלקוח — למשל הדרכה ולמידה — כשהפרויקט דורש ידע ייעודי." },
];

function Member({ seed, d, delay }: { seed: number; d: Discipline; delay: number }) {
  return (
    <Reveal as="li" delay={delay} className="flex items-start gap-5 md:gap-8">
      <Placeholder seed={seed} label={d.name} className="aspect-[3/4] w-24 shrink-0 rounded-xl bg-ink-2 md:w-40" />
      <div className="min-w-0 flex-1">
        <h3 className="text-base leading-6 md:text-xl md:leading-7">{d.name}</h3>
        <p className="text-sm font-light leading-5 text-stone md:text-base md:leading-6">{d.role}</p>
        <p className="mt-2 max-w-[414px] text-sm font-light leading-5">
          {d.bio}{d.note && <> <em>{d.note}</em></>}
        </p>
      </div>
    </Reveal>
  );
}

function Grid({ people, start }: { people: Discipline[]; start: number }) {
  return (
    <ul className="mx-auto mt-6 grid w-full max-w-[960px] gap-10 md:grid-cols-2 md:gap-12">
      {people.map((d, i) => (
        <Member key={d.name} seed={start + i} d={d} delay={(i % 2) * 80} />
      ))}
    </ul>
  );
}

export default function TeamPage() {
  return (
    <>
      <section className="wrap">
        <div className="inner flex justify-center pb-6 pt-12 md:py-20">
          <Reveal>
            <h1 className="max-w-[576px] text-center font-serif text-[32px] font-light leading-9 tracking-[-0.05em] md:text-[48px] md:leading-[48px]">בעיה אחת, כל היכולות סביבה</h1>
          </Reveal>
        </div>
      </section>

      <PhotoMarquee />

      <Shell pad="py-10 md:py-20">
        <CenterHeading>הליבה</CenterHeading>
        <Grid people={core} start={1} />
      </Shell>

      <Shell pad="py-10 md:py-20">
        <CenterHeading>מומחים לפי פרויקט</CenterHeading>
        <Grid people={specialists} start={20} />
      </Shell>
    </>
  );
}
