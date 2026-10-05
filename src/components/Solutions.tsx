"use client";
import { useState } from "react";
import { IconBox } from "./icons";
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

const events = [["TKT-2041", "פנייה חדשה", "WhatsApp", "+ AI"], ["ORD-1198", "הזמנה", "ERP", "+ סונכרן"], ["LEAD-387", "ליד חדש", "CRM", "+ נותב"], ["DOC-072", "מסמך", "OCR", "− ממתין לאישור"]];

export default function Solutions() {
  const [open, setOpen] = useState(0);
  const [mode, setMode] = useState<"ui" | "api">("ui");

  return (
    <section className="rule">
      <div className="wrap">
        <div className="inner grid gap-10 py-14 md:grid-cols-2 md:gap-6 md:py-0">
          <div className="md:py-[72px]">
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

          {/* Visual: generated dusk gradient instead of a photo */}
          <div className="relative grid min-h-[560px] place-items-center overflow-hidden md:-me-10"
            style={{ background: "radial-gradient(120% 80% at 70% 30%, #e26d4f 0%, #6b2f46 30%, #1c2a4a 60%, #0d1424 100%)" }}>
            <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: "repeating-linear-gradient(0deg,#fff 0 1px,transparent 1px 4px)" }} />
            <div className="relative w-[360px] max-w-[88%] rounded-lg border border-line bg-ink/90 p-4 font-mono text-xs shadow-2xl backdrop-blur">
              {mode === "ui" ? (
                <>
                  <div className="flex justify-between">
                    <div><div className="text-paper">TEVEL · OPERATIONS</div><div className="text-muted">דוגמה להמחשה</div></div>
                    <div className="text-brand">● LIVE</div>
                  </div>
                  <div className="mt-4 font-sans text-muted">אירועים שטופלו היום</div>
                  <div className="mt-2 text-end text-3xl text-paper">128</div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {[["מערכות", "6"], ["אוטומציות", "14"], ["AI", "פעיל"], ["נציגים", "3"]].map(([a, b]) => (
                      <div key={a} className="flex justify-between rounded border border-line px-2 py-2"><span className="font-sans text-muted">{a}</span><span>{b}</span></div>
                    ))}
                  </div>
                  <div className="mt-4 font-sans text-muted">אירועים אחרונים</div>
                  {events.map(([id, s, c, t]) => (
                    <div key={id} className="mt-2 flex justify-between font-sans">
                      <span>{id} <span className="text-muted">{s}</span></span>
                      <span className={t.startsWith("+") ? "text-mint" : "text-stone"}>{t}</span>
                    </div>
                  ))}
                </>
              ) : (
                <pre className="overflow-x-auto leading-5 text-stone">{`GET /v1/events?today

{
  "handled": 128,
  "automated": 94,
  "data": [
    { "id": "tkt-2041",
      "type": "workflow",
      "route": "ai → crm" }
  ]
}`}</pre>
              )}
            </div>
            <div className="absolute bottom-8 flex items-center gap-2 rounded-full border border-line bg-ink/90 px-2 py-1 font-mono text-[10px]">
              <span className={mode === "ui" ? "text-paper" : "text-muted"}>UI</span>
              <button onClick={() => setMode(mode === "ui" ? "api" : "ui")} aria-label="Toggle UI or API view" className="relative h-4 w-8 rounded-full bg-line">
                <span className={`absolute top-0.5 size-3 rounded-full bg-paper transition-all duration-300 ${mode === "ui" ? "left-0.5" : "left-[18px]"}`} />
              </button>
              <span className={mode === "api" ? "text-paper" : "text-muted"}>API</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
