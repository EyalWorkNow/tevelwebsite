import Link from "next/link";
import type { ReactNode } from "react";
import { Placeholder, Reveal } from "@/components/ui";
import { Arrow } from "@/components/icons";
import { CIcon } from "./icons";

/* ---------- shells ---------- */
function Shell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className="wrap">
      <div className={`inner py-10 md:py-20 ${className}`}>{children}</div>
    </section>
  );
}
const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="text-center font-serif text-[32px] font-light leading-9 tracking-[-0.05em] md:text-[40px] md:leading-[44px]">{children}</h2>
);
const IconBox = ({ name }: { name: string }) => (
  <span className="mb-3 grid size-11 place-items-center rounded-[12px] border border-line-2 text-stone">
    <CIcon name={name} />
  </span>
);
const InlineLink = ({ href = "#", children }: { href?: string; children: ReactNode }) => (
  <Link href={href} className="underline decoration-1 underline-offset-2 transition-colors hover:text-paper">{children}</Link>
);

/* ---------- hero ---------- */
export function CareersHero() {
  return (
    <section className="wrap">
      <div className="inner flex flex-col items-center gap-8 pb-10 pt-10 text-center md:py-20">
        <Reveal><h1 className="max-w-[576px] font-serif text-[36px] font-light leading-10 tracking-[-0.05em] md:text-[48px] md:leading-[48px]">עובדים ישירות עם מי שבונה</h1></Reveal>
        <Reveal delay={80}><p className="max-w-[616px] text-lg font-light leading-[25px] md:text-xl md:leading-7">לא צריך להגיע עם מפרט טכני. ספרו לנו מה לא עובד — ואנחנו ניקח את זה משם: מהבנת העסק, דרך תכנון ופיתוח, ועד מערכת עובדת.</p></Reveal>
        <Reveal delay={160}>
          <Link href="#open-roles" className="group btn-dark bg-ink">
            דרכי עבודה
            <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- photo marquee: two identical grids, translateX(-50%) over 140s ---------- */
const tiles: [string, string][] = [
  ["1/3", "1/3"], ["3/4", "1/2"], ["4/5", "1/2"], ["3/5", "2/3"], ["5/7", "1/3"], ["7/8", "1/2"],
  ["7/8", "2/3"], ["8/10", "1/3"], ["10/12", "1/3"], ["12/13", "1/2"], ["12/13", "2/3"],
];
function TileGroup({ hidden }: { hidden?: boolean }) {
  return (
    <div
      aria-hidden={hidden}
      className="grid shrink-0 gap-[var(--g)] pr-[var(--g)]"
      style={{ gridTemplateColumns: "repeat(12, var(--c))", gridTemplateRows: "repeat(2, var(--r))" }}
    >
      {tiles.map(([c, r], i) => (
        <div key={i} style={{ gridColumn: c, gridRow: r }}>
          <Placeholder seed={i + 3} className="size-full rounded bg-ink-2" label={hidden ? undefined : `תמונה ${i + 1}`} />
        </div>
      ))}
    </div>
  );
}
export function PhotoMarquee() {
  return (
    <div dir="ltr" className="overflow-hidden [--c:135px] [--g:12px] [--r:84px] md:[--c:300px] md:[--g:16px] md:[--r:200px]">
      <div className="flex w-max animate-[marquee_140s_linear_infinite] hover:[animation-play-state:paused]">
        <TileGroup />
        <TileGroup hidden />
      </div>
    </div>
  );
}

/* ---------- centred feature rows ---------- */
type Feat = { icon: string; title: string; body: ReactNode };
function CenteredFeatures({ items }: { items: Feat[] }) {
  return (
    <ul className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-center md:gap-20">
      {items.map((f, i) => (
        <Reveal as="li" key={f.title} delay={i * 80} className="flex w-[260px] flex-col items-center text-center">
          <IconBox name={f.icon} />
          <h3 className="text-lg leading-6">{f.title}</h3>
          <p className="mt-1 text-[15px] font-light leading-[22px] text-stone">{f.body}</p>
        </Reveal>
      ))}
    </ul>
  );
}
function FeatureSection({ heading, lede, items }: { heading?: string; lede?: string; items: Feat[] }) {
  return (
    <Shell>
      {heading && (
        <div className="mb-6 grid gap-4 text-center">
          <Reveal><H2>{heading}</H2></Reveal>
          {lede && <Reveal delay={60}><p className="text-lg font-light leading-[25px] text-stone md:text-xl md:leading-7">{lede}</p></Reveal>}
        </div>
      )}
      <CenteredFeatures items={items} />
    </Shell>
  );
}

export function Intro() {
  return (
    <FeatureSection
      items={[
        { icon: "sparkle", title: "Boutique Model", body: <>עבודה קרובה, ownership וקשר ישיר עם האנשים שמבינים ובונים את הפתרון. <InlineLink href="/team">הצוות והתחומים</InlineLink>.</> },
        { icon: "globe", title: "End-to-End", body: "מהבעיה ועד מערכת עובדת — בלי לתאם בין יועץ, מעצב, מפתח וספק AI." },
      ]}
    />
  );
}
export function Remote() {
  return (
    <FeatureSection
      heading="איך מתחילים"
      lede="התהליך מתחיל בשיחה ובהבנת הבעיה — לא בהצעת מחיר."
      items={[
        { icon: "desk", title: "שיחה ראשונה", body: "מספרים לנו מה אתם מנסים לשפר. לא צריך לדעת איזו מערכת אתם צריכים." },
        { icon: "building", title: "Discovery ומיפוי", body: "לומדים מחלקות, מערכות, תהליכי עבודה ומידע, ומזהים איפה הולכים לאיבוד זמן, כסף ומידע." },
        { icon: "pin", title: "פתרון והצעה", body: <>ממליצים על רמת הפתרון הנכונה לפי Impact / Cost / Complexity / Risk. <InlineLink href="/pricing">איך עובדים</InlineLink>.</> },
      ]}
    />
  );
}
export function Values() {
  return (
    <FeatureSection
      heading="למה תבל"
      items={[
        { icon: "book", title: "Business + Technology", body: "מבינים את הבעיה העסקית ואת המערכת שצריכה לפתור אותה." },
        { icon: "figure", title: "UX at the Core", body: "מערכת עסקית לא טובה אם העובדים מתקשים להשתמש בה." },
        { icon: "hands", title: "AI With Purpose", body: "AI נכנס כשיש לו תפקיד עסקי ברור — ולא כשאוטומציה פשוטה תעשה את העבודה טוב יותר." },
      ]}
    />
  );
}
export function Together() {
  return (
    <FeatureSection
      heading="למי זה מתאים"
      items={[
        { icon: "fire", title: "עסקים עם מורכבות תפעולית", body: "בדרך כלל כ-10 עובדים ומעלה, כמה מחלקות או בעלי תפקידים, נפח לקוחות משמעותי ומערכות שונות שלא מדברות זו עם זו." },
        { icon: "cup", title: "סימנים שזה הזמן", body: "\"הכול אצלנו באקסלים.\" \"רק עובד אחד יודע איך התהליך עובד.\" \"כל צמיחה מחייבת עוד אנשים.\"" },
      ]}
    />
  );
}

/* ---------- callout ---------- */
export function Callout() {
  return (
    <Shell>
      <Reveal>
        <div className="flex flex-col gap-6 rounded-2xl border border-line bg-ink p-6 md:flex-row md:p-8">
          <CIcon name="card" width={30} height={30} className="shrink-0 text-stone" />
          <div className="flex flex-col gap-2 leading-6 text-muted">
            <strong className="text-lg font-medium leading-6 text-paper">לא בוחרים אוטומטית באפשרות היקרה</strong>
            <p className="text-base md:text-[16px]">לא כל לקוח צריך מערכת חדשה מאפס. לעיתים מוצר מדף ואינטגרציה נכונה מספיקים, ולעיתים נכון יותר לפתח מודול או שכבה משלימה. ההמלצה שלנו מבוססת על כדאיות אמיתית — וכוללת גם את היכולת לומר שלא כדאי לבנות.</p>
          </div>
        </div>
      </Reveal>
    </Shell>
  );
}

/* ---------- what you get ---------- */
const benefits: Feat[] = [
  { icon: "heart", title: "אפיון ו-Product Strategy", body: "הגדרה ברורה של הבעיה, המשתמשים והתהליך לפני שכותבים קוד." },
  { icon: "bank", title: "Architecture", body: "תכנון מערכת שמחזיקה לאורך זמן: נתונים, הרשאות ו-APIs." },
  { icon: "shield", title: "Security hardening", body: "אבטחה, הרשאות ובקרה כחלק מהתכנון, לא כתוספת בסוף." },
  { icon: "trend", title: "שיפור מתמשך", body: "מודדים, לומדים ומשפרים גם אחרי ההשקה." },
  { icon: "cap", title: "UX/UI", body: "ממשקים שהעובדים והלקוחות שלכם מבינים ורוצים להשתמש בהם." },
  { icon: "clock", title: "QA ו-Monitoring", body: "בדיקות לפני השקה וניטור אחריה." },
  { icon: "chat", title: "Technical consulting", body: <>ייעוץ טכנולוגי שעוזר להחליט מה לבנות, מה לקנות ומה לחבר. <InlineLink href="/blog">Insights</InlineLink>.</> },
  { icon: "pram", title: "Integrations", body: "חיבור למערכות הקיימות, בכפוף ל-APIs, להרשאות וליכולות שלהן." },
  { icon: "plane", title: "Deployment ותחזוקה", body: "הטמעה בסביבה האמיתית, תחזוקה ופיתוח המשך." },
];
export function Benefits() {
  return (
    <Shell>
      <Reveal className="mb-6"><H2>מה מקבלים</H2></Reveal>
      <ul className="grid gap-8 md:grid-cols-3 md:gap-20">
        {benefits.map((b, i) => (
          <Reveal as="li" key={b.title} delay={(i % 3) * 80} className="flex flex-col items-start">
            <IconBox name={b.icon} />
            <h3 className="text-lg leading-6">{b.title}</h3>
            <p className="mt-1 max-w-[370px] text-[15px] font-light leading-[22px] text-stone">{b.body}</p>
          </Reveal>
        ))}
      </ul>
    </Shell>
  );
}

/* ---------- positioning statement (in place of a testimonial) ---------- */
export function Testimonial() {
  return (
    <Shell>
      <Reveal>
        <figure className="flex flex-col rounded-2xl border border-line bg-ink p-6 md:p-8">
          <CIcon name="quote" width={30} height={30} className="text-stone" />
          <blockquote className="mt-4 text-[22px] font-light leading-7 md:text-2xl md:leading-8">עבור עסקים וארגונים שהמערכות הקיימות שלהם כבר אינן עומדות בקצב הפעילות, תבל היא בית תוכנה ושותף טכנולוגי שמבין את התהליך העסקי לפני הפיתוח ומסוגל לתכנן, לבנות ולהטמיע את המערכת הנכונה — במקום למכור פתרון מדף ולדרוש מהעסק להתאים את עצמו אליו.</blockquote>
          <figcaption className="mt-8 flex items-center gap-3">
            <Placeholder seed={4} className="size-10 rounded-full" />
            <div className="text-sm leading-[18px]">
              <div className="font-medium">TEVEL | תבל</div>
              <div className="text-muted">הצהרת המיצוב שלנו</div>
            </div>
          </figcaption>
        </figure>
      </Reveal>
    </Shell>
  );
}

/* ---------- ways to work with us, grouped ---------- */
const departments: { name: string; roles: { title: string; note: string }[] }[] = [
  { name: "התחלה", roles: [{ title: "Discovery ומיפוי העסק", note: "כשלא בטוחים מה צריך לבנות" }] },
  {
    name: "רמות פתרון",
    roles: [
      { title: "Focused Fix — פתרון ממוקד", note: "הבעיה המרכזית שבגללה הגעתם" },
      { title: "Core Transformation — טיפול שורש", note: "הבעיה והגורמים שמייצרים אותה" },
      { title: "Full Transformation — שינוי מערכתי", note: "שכבה רחבה מהתשתית הדיגיטלית והתפעולית" },
    ],
  },
  { name: "R&D", roles: [{ title: "פרויקט R&D", note: "מבדיקת היתכנות ו-PoC ועד מוצר" }] },
  { name: "לאורך זמן", roles: [{ title: "פיתוח ותחזוקה שוטפים", note: "הזרוע הטכנולוגית של העסק" }] },
];
export function OpenRoles() {
  return (
    <Shell>
      <div id="open-roles" className="scroll-mt-24">
        <Reveal className="mb-6"><H2>דרכי עבודה איתנו</H2></Reveal>
        <ul className="flex flex-col gap-12">
          {departments.map((d) => (
            <li key={d.name} className="flex flex-col gap-2">
              <span className="mb-2 inline-flex self-start rounded-lg border border-line-2 px-3 py-1.5 font-mono text-[11px] uppercase leading-4 tracking-[0.06em]">{d.name}</span>
              <ul className="flex flex-col">
                {d.roles.map((r) => (
                  <li key={r.title} className="border-t border-line">
                    <Link href="/contact" className="group flex flex-col gap-x-6 gap-y-2 py-5 md:flex-row md:items-center md:justify-between">
                      <span className="text-xl leading-7 transition-colors duration-200 group-hover:text-stone md:text-2xl md:leading-8">{r.title}</span>
                      <span className="flex items-center gap-1.5 leading-6 text-muted">
                        <CIcon name="sparkle" width={16} height={16} />
                        {r.note}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}

export function CareersCta() {
  return (
    <Shell className="flex flex-col items-center text-center">
      <Reveal><h2 className="max-w-[340px] font-serif text-[32px] font-light leading-9 tracking-[-0.05em] md:max-w-none md:text-[40px] md:leading-[44px]">ספרו לנו מה לא עובד. אנחנו נתחיל משם.</h2></Reveal>
      <Reveal delay={100}><Link href="/contact" className="btn-light mt-12 md:mt-12">בואו נדבר</Link></Reveal>
    </Shell>
  );
}
