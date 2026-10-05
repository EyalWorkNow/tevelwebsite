"use client";
import { useState } from "react";

// What TEVEL builds — capability wordmarks (no client logos until verified, brief §28).
const marks: [string, string, string][] = [
  ["CRM", "font-sans font-semibold text-lg", "CRM שלא רק שומר לקוחות — אלא מנהל את הדרך שבה העסק עובד איתם."],
  ["ERP", "font-sans font-black tracking-tight text-lg", "רכש, מלאי, ספקים, הזמנות ותפעול — כמודול, שכבה או מערכת שלמה."],
  ["AI Agents", "font-serif italic text-xl", "סוכנים שמבצעים פעולות מוגדרות בתוך תהליכי העבודה."],
  ["RAG", "font-mono tracking-[0.2em] text-sm", "AI שעונה מתוך הידע המאושר של הארגון."],
  ["Automation", "font-sans font-light text-lg", "פחות Copy/Paste, פחות פעולות שחייבים לזכור."],
  ["Integrations", "font-serif text-xl", "מערכות קיימות שמתחילות לדבר זו עם זו."],
  ["Web Apps", "font-mono text-sm", "פורטלים, דשבורדים ומערכות פנימיות."],
  ["Mobile", "font-sans font-medium text-lg", "אפליקציות מאפיון ו-UX ועד השקה."],
  ["Computer Vision", "font-serif italic text-lg", "מערכות שמקבלות מידע מתמונה ומווידאו."],
  ["IoT", "font-mono font-bold text-sm", "חיבור בין תוכנה, חיישנים והעולם הפיזי."],
];
const kinds = ["Build", "Intelligence", "R&D"];

export default function Logos() {
  const [hover, setHover] = useState<number | null>(null);

  const Cell = ({ n }: { n: number }) => (
    <li
      onMouseEnter={() => setHover(n)}
      onMouseLeave={() => setHover(null)}
      className="relative grid h-16 place-items-center border-b border-r border-dashed border-line text-stone-2"
    >
      <span className={`transition-opacity duration-300 ${hover === n ? "opacity-0" : "opacity-80"} ${marks[n][1]}`}>{marks[n][0]}</span>
      {hover === n && (
        <span className="label absolute rounded-full bg-line px-2.5 py-1 text-[10px] text-stone animate-[fade-in_.2s_ease_both]">{kinds[n % 3]}</span>
      )}
    </li>
  );

  return (
    <section className="wrap relative">
      <ul className="grid grid-cols-2 border-l border-dashed border-line md:grid-cols-6">
        <Cell n={0} /><Cell n={1} />
        <li className="col-span-2 grid h-16 place-items-center border-b border-r border-dashed border-line font-mono text-sm uppercase tracking-[0.06em] text-muted">
          <span>מה <span className="text-paper">אנחנו בונים</span></span>
        </li>
        <Cell n={2} /><Cell n={3} />
        {[4, 5, 6, 7, 8, 9].map((n) => <Cell key={n} n={n} />)}
      </ul>

      {/* Quote popover — fixed bottom-left like the reference */}
      {hover !== null && (
        <div className="pointer-events-none fixed bottom-6 start-6 z-40 hidden w-[280px] rounded-lg bg-ink-2/90 p-5 shadow-[inset_0_0_0_1px_#514e4b] backdrop-blur-xl animate-[slide-up-and-fade_.25s_ease_both] md:block">
          <div className="label text-brand" dir="ltr">{marks[hover][0]}</div>
          <p className="mt-3 leading-6">{marks[hover][2]}</p>
          <p className="mt-4 text-[13px] text-muted">{kinds[hover % 3]}</p>
        </div>
      )}
    </section>
  );
}
