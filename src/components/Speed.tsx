import { ArrowUpRight } from "./icons";
import Link from "next/link";

const cards = [
  ["שיחת היכרות", "ספרו לנו מה לא עובד — בלי מפרט, בלי התחייבות.", "/contact"],
  ["Discovery ומיפוי", "ממפים אנשים, מערכות, מידע ותהליכים ומוצאים את נקודות הדימום.", "/reports"],
  ["R&D", "כשאין פתרון מוכן — מחקר, היתכנות, PoC ואב-טיפוס.", "/solutions/rd"],
  ["Tevel Invoice", "המוצר שלנו לניהול מסמכים ופעילות עסקית-פיננסית.", "/products/tevel-invoice"],
];

export default function Speed() {
  return (
    <section className="rule">
      <div className="wrap">
        <div className="inner py-14 md:py-[72px]">
          <h2 className="h2">מאיפה מתחילים</h2>
          <p className="mt-4 max-w-[420px] font-light leading-6 text-stone">
            לקוח יכול להגיע לתבל עם בעיה ולא עם מפרט טכני. הפתרון נקבע אחרי הבנת הבעיה.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(([t, d, href]) => (
              <Link key={t} href={href} className="group flex min-h-[150px] flex-col justify-between rounded border border-line p-4 transition-colors duration-300 hover:border-line-2 hover:bg-ink-2">
                <div className="flex justify-between"><span className="text-lg font-light">{t}</span><ArrowUpRight className="text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper" /></div>
                <p className="mt-8 text-sm text-muted">{d}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
