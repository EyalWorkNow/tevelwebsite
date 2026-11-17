"use client";
import { useState } from "react";
import { IconBox, Glyph } from "./icons";
import Link from "next/link";
import { slugs, names } from "@/lib/site";

const items = [
  { d: "מערכות מידע, Back Office ומערכות תפעול שמותאמות לתהליכים של הארגון. העסק לא צריך לעבוד סביב התוכנה שלו.", f: ["Workflow Management", "Customer & Employee Portals", "Dashboards ודוחות"] },
  { d: "CRM שמנהל את הדרך שבה העסק עובד עם הלקוחות, ו-ERP מלא, מודול או שכבת אינטגרציה — לפי מה שנכון.", f: ["Lead → Sale → Customer → Retention", "Order → Inventory → Suppliers", "Custom modules ו-Migration"] },
  { d: "AI שעובד בתוך העסק — לא לידו. ואם workflow דטרמיניסטי פשוט עושה את העבודה טוב יותר, אין סיבה להכניס LLM.", f: ["Agents ו-Internal Copilots", "RAG ו-Document AI", "Workflow automation"] },
  { d: "מערכי שירות שמשלבים AI, אוטומציות ונציגים, ומחוברים לידע ולמערכות של העסק. AI מטפל בנפח, אנשים במה שדורש אנשים.", f: ["Intent detection ו-Routing", "Approved actions", "Escalation עם הקשר מלא"] },
  { d: "אפליקציות, Web Apps ואתרים שנבנים כחלק מהעסק — UX, performance, אינטגרציות ואנליטיקה, לא רק נראות.", f: ["Mobile apps", "SaaS, Portals, Dashboards", "Corporate & Commerce websites"] },
  { d: "כשאין פתרון מוכן: מחקר, בדיקת היתכנות, PoC ואבות-טיפוס — עד מוצר שאפשר להפעיל.", f: ["Research & Feasibility", "PoC ו-Prototype", "AI, Computer Vision, IoT"] },
].map((x, i) => ({ ...x, t: names.solutions[i], href: `/solutions/${slugs.solutions[i]}` }));

const workflow = [
  { title: "הלקוח שולח הודעה", body: "״איפה ההזמנה שלי?״ — פנייה שמגיעה בוואטסאפ.", icon: "chat", status: "פנייה נכנסת" },
  { title: "המערכת בודקת את הפרטים", body: "מזהים את הלקוח ושולפים את סטטוס ההזמנה מהמערכת.", icon: "swap", status: "בדיקה אוטומטית" },
  { title: "הלקוח מקבל תשובה", body: "נשלח עדכון בוואטסאפ. אם צריך, נציג ממשיך עם כל המידע.", icon: "people", status: "מענה ושירות" },
];

export default function Solutions() {
  const [open, setOpen] = useState(0);

  return (
    <section className="rule">
      <div className="wrap">
        <div className="inner grid gap-10 py-14 md:grid-cols-2 md:gap-6 md:py-0">
          <div className="min-w-0 md:py-[72px]">
            <h2 className="h2">טכנולוגיה שנבנית סביב העסק</h2>
            <div className="mt-10">
              {items.map((it, i) => (
                <div key={it.t} className={i ? "border-t border-line" : ""}>
                  <button
                    onClick={() => setOpen(i)}
                    aria-expanded={open === i}
                    className={`w-full py-4 text-start font-serif font-light transition-all duration-300 ${open === i ? "text-[32px] leading-10 tracking-[-0.05em] text-paper" : "text-xl leading-7 tracking-[-0.02em] text-stone-2 hover:text-paper"}`}
                  >
                    {it.t}
                  </button>
                  <div className={`grid transition-all duration-500 ${open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <p className="max-w-[478px] leading-6">{it.d}</p>
                      <ul className="mt-5 space-y-3 text-sm">
                        {it.f.map((f) => <li key={f} className="flex items-center gap-3"><IconBox width={16} height={16} className="text-muted" />{f}</li>)}
                      </ul>
                      <Link href={it.href} className="label mt-6 mb-6 inline-flex rounded-full border border-line-2 px-3.5 py-2 transition-colors hover:border-brand">למידע נוסף</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <figure className="min-w-0 self-center rounded-2xl border border-line bg-ink-2 p-4 sm:p-7 md:my-12" aria-labelledby="workflow-demo-title">
            <figcaption>
              <p className="text-xs font-medium text-brand">דוגמה לתהליך מחובר</p>
              <h3 id="workflow-demo-title" className="mt-3 text-2xl font-bold leading-8 text-paper">מפנייה של לקוח<br />לתשובה שהוא צריך.</h3>
              <p className="mt-3 text-sm leading-6 text-stone-2">ההודעה, המידע והטיפול עוברים יחד בין המערכות.</p>
            </figcaption>
            <ol className="mt-6 space-y-3">
              {workflow.map((step, index) => (
                <li key={step.title} className="relative min-w-0 rounded-xl border border-line bg-ink p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand"><Glyph name={step.icon} /></span>
                    <span className="min-w-0 flex-1 text-xs font-medium leading-5 text-brand">{step.status}</span>
                    <span aria-hidden="true" dir="ltr" className="shrink-0 text-xs text-muted">0{index + 1}</span>
                  </div>
                  <h4 className="mt-3 text-base font-bold leading-6 text-paper">{step.title}</h4>
                  <p className="mt-1.5 text-sm leading-6 text-stone-2">{step.body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-xs leading-5 text-muted">הדמיה להמחשה. התהליך והחיבורים נקבעים לפי צורכי העסק.</p>
          </figure>
        </div>
      </div>
    </section>
  );
}
