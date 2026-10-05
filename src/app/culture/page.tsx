import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/ui";
import { Shell } from "@/components/pages/company/parts";

export const metadata: Metadata = seo("/culture");

type CardSpec = { title: string; lead: string; paras: ReactNode[] };

const linkCls = "underline underline-offset-2 transition-colors hover:text-stone";

// The five values (brief §24) with explanations drawn from the brief.
const values: CardSpec[] = [
  {
    title: "Understand first",
    lead: "מבינים לפני שבונים.",
    paras: [
      "אנחנו לא מתחילים בשאלה \"איזו מערכת אתם רוצים?\", אלא \"מה אתם מנסים לפתור?\". לקוח עשוי לחשוב שהוא צריך CRM חדש כאשר הבעיה היא workflow, או לבקש AI כאשר אוטומציה פשוטה תהיה אמינה וזולה יותר.",
      "הפתרון נקבע אחרי הבנת הבעיה — לפעמים זו מערכת, לפעמים אינטגרציה, ולפעמים לא לבנות דבר חדש בכלל.",
    ],
  },
  {
    title: "Build with purpose",
    lead: "בונים רק את מה שיש לו תפקיד.",
    paras: [
      "לא כל דבר צריך Custom. אם מוצר קיים פותר את הבעיה היטב, אין סיבה לבנות מערכת מיותרת. כאשר התהליך ייחודי ומצדיק זאת, Custom יכול להפוך לנכס.",
      "אותו כלל חל על AI: הוא נכנס כשיש לו תפקיד עסקי ברור. אם workflow דטרמיניסטי פשוט עושה את העבודה טוב יותר — אין סיבה להכניס LLM.",
    ],
  },
  {
    title: "Design for people",
    lead: "מערכת טובה היא מערכת שמשתמשים בה.",
    paras: [
      "מערכת עסקית לא טובה אם העובדים מתקשים להשתמש בה. UX נמצא בליבת העבודה, לא בשכבה האחרונה.",
      "גם כשאנחנו מטמיעים AI, המטרה אינה להחליף אנשים: AI מטפל בנפח ובפעולות המתאימות, ואנשים מטפלים במקרים שבהם נדרש אדם.",
    ],
  },
  {
    title: "Measure impact",
    lead: "מודדים מה השתנה בפועל.",
    paras: [
      "אנחנו מחפשים את נקודות הדימום — זמן, כסף, כוח אדם, מידע, הכנסה וחוויית לקוח — ומתעדפים לפי Impact / Cost / Complexity / Risk.",
      "לפני ניסוי מגדירים מה נחשב הצלחה, ואנחנו לא מבטיחים ROI או אחוזי חיסכון ללא נתונים.",
    ],
  },
  {
    title: "Own the outcome",
    lead: "אחריות עד מערכת עובדת.",
    paras: [
      "אנחנו לוקחים אחריות על הרצף — מ-Discovery ומיפוי העסק, דרך UX, ארכיטקטורה ופיתוח, ועד הטמעה, תחזוקה ושיפור מתמשך.",
      "עבודה קרובה, ownership וקשר ישיר עם האנשים שמבינים ובונים את הפתרון.",
    ],
  },
];

// How we speak (brief §12) and the core belief (§45).
const behaviours: CardSpec[] = [
  {
    title: "מה אנחנו כן",
    lead: "בטוחים, מדויקים, ספציפיים.",
    paras: [
      "לא \"Transform with AI\", אלא הסבר קונקרטי: מה הבעיה, איך הפתרון עובד ומה ישתנה בעסק.",
      "אנחנו מסבירים כיצד ולא רק מה, ומעדיפים להראות מערכות, workflows ותהליכים במקום סיסמאות.",
    ],
  },
  {
    title: "ממה אנחנו נמנעים",
    lead: "בלי hype.",
    paras: [
      "בלי buzzwords ללא משמעות, בלי \"מהפכני\" ו\"פורץ דרך\" בכל פסקה ובלי AI hype.",
      "בלי הבטחות ROI ללא נתונים, בלי הבטחות להחלפת עובדים ובלי טקסט שמנסה להוכיח כמה החברה \"מדהימה\".",
    ],
  },
  {
    title: "האמונה שלנו",
    lead: "Technology should serve the business, not become another problem the business has to manage.",
    paras: [
      "טכנולוגיה צריכה לשרת את העסק — לא להפוך לעוד בעיה שהעסק צריך לנהל.",
      <>
        רוצים להכיר את הגישה מקרוב?{" "}
        <Link href="/about" className={linkCls}>קראו עוד על תבל</Link>
        . אנחנו מבינים איך העסק עובד — ובונים את הטכנולוגיה שתגרום לו לעבוד טוב יותר.
      </>,
    ],
  },
];

const body = "text-sm leading-5 tracking-[0.01em] md:text-base md:leading-6";

function Intro({ heading, lead, children, seed }: { heading: string; lead?: ReactNode; children: ReactNode; seed: number }) {
  return (
    <Reveal className="flex max-w-[768px] flex-col gap-5">
      <h2 className="font-serif text-2xl font-light leading-8 tracking-[-0.04em] md:text-[39px] md:leading-[44px]" id={`s${seed}`}>{heading}</h2>
      {lead}
      {children}
    </Reveal>
  );
}

function Card({ spec, delay }: { spec: CardSpec; delay: number }) {
  return (
    <Reveal as="section" delay={delay} className="rounded-lg border border-line p-8 md:p-16">
      <div className="flex flex-col gap-3">
        <h3 className="font-serif text-xl font-light leading-7 md:text-[25px] md:leading-8 tracking-[-0.04em]">{spec.title}</h3>
        <div className={`flex flex-col gap-5 ${body}`}>
          <span className="font-medium">{spec.lead}</span>
          {spec.paras.map((p, i) => <span key={i}>{p}</span>)}
        </div>
      </div>
    </Reveal>
  );
}

export default function CulturePage() {
  return (
    <Shell>
      <div className="flex flex-col gap-12 md:gap-16">
        <div className="flex flex-col gap-5">
          <Reveal>
            <h1 className="font-serif text-[28px] font-semibold leading-8 tracking-[-0.04em] md:text-[49px] md:leading-[52px]">קודם מבינים. אחר כך בונים את מה שחשוב.</h1>
          </Reveal>
          <Reveal delay={80} className="flex flex-col gap-4 text-base leading-6 tracking-[0.01em] text-stone-2 md:gap-5 md:text-xl md:leading-8">
            <p>Software is not the starting point. העסק הוא נקודת ההתחלה — האנשים, הלקוחות, המידע, התהליך והמקומות שבהם דברים נתקעים.</p>
            <p>רק אחרי שמבינים אותם אפשר לדעת אם הפתרון הוא <em>מערכת, אינטגרציה, אוטומציה, AI — או בכלל לא לבנות דבר חדש</em>. Understand first. Build what matters.</p>
            <p>אנחנו לא מוכרים טכנולוגיה לשם טכנולוגיה. אנחנו משתמשים בטכנולוגיה כדי לגרום לעסק לעבוד טוב יותר.</p>
          </Reveal>
        </div>

        <hr className="border-line" />

        <Intro seed={1} heading="חמשת הערכים" lead={<span className={body}><b className="font-medium">Understand first. Build what matters.</b> העיקרון שמחבר את כל השאר.</span>}>
          <span className={body}>הערכים האלה מנחים את האופן שבו אנחנו ניגשים לכל פרויקט — ממערכת CRM ועד PoC — ואת האופן שבו אנחנו ממליצים מה לבנות, מה לחבר ומה להשאיר כפי שהוא.</span>
        </Intro>

        <div className="grid gap-8 md:grid-cols-2 md:gap-16">
          {values.map((v, i) => <Card key={v.title} spec={v} delay={(i % 2) * 80} />)}
        </div>

        <Intro seed={2} heading="איך אנחנו מדברים">
          <p className={body}>האתר, ההצעות והשיחות שלנו צריכים להיות בטוחים, מדויקים, נקיים, עסקיים, טכנולוגיים, בוגרים, אנושיים וספציפיים.</p>
          <p className={body}>כל עמוד וכל שיחה בנויים לפי אותו רצף: <em>Problem → Insight → Solution → Capability → Outcome → CTA</em>.</p>
        </Intro>

        <div className="grid gap-8 md:grid-cols-2 md:gap-16">
          {behaviours.map((v, i) => <Card key={v.title} spec={v} delay={(i % 2) * 80} />)}
        </div>
      </div>
    </Shell>
  );
}
