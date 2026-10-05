import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, Reveal } from "@/components/ui";
import { LeadForm } from "@/components/LeadForm";

export const metadata: Metadata = seo("/contact");

/* Original 24px line icons in the reference's thin-stroke style. */
const icon = (d: string) => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>
);
const icons = [
  icon("M12 2.8l2.4 1.6 2.9-.1.9 2.7 2.3 1.8-.9 2.7.9 2.7-2.3 1.8-.9 2.7-2.9-.1L12 21.2l-2.4-1.6-2.9.1-.9-2.7-2.3-1.8.9-2.7-.9-2.7 2.3-1.8.9-2.7 2.9.1zM10 9.6a2 2 0 113 1.7c-.7.4-1 .9-1 1.6M12 15.3v.2"),
  icon("M20.5 3.5L3.5 10l7 2.5 2.5 7zM10.5 12.5L20.5 3.5"),
  icon("M3.5 5h11v7.5H8l-3 2.5v-2.5H3.5zM14.5 8.5h6v7.5H19V18l-3-2h-5.5v-3.5"),
  icon("M4 8.5h4.5l8-4v14l-8-4H4zM8.5 14.5l1.5 5h2.5l-1.2-4.6M19 9.5v4"),
  icon("M6 3.5h12v17H6zM9 7.5h6M9 10.5h6M9 13.5h4"),
  icon("M8.5 7l-5 5 5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15"),
];
const cards = [
  ["שיחת Discovery", "קבעו שיחת Discovery", "#leave-details"],
  ["מערכות, CRM ו-ERP", "ספרו לנו איך אתם עובדים היום", "/contact/sales"],
  ["AI בעסק", "בואו נמצא איפה AI באמת יכול לעזור", "/products/ai-for-business"],
  ["שירות לקוחות", "תכננו איתנו את מערך השירות הבא שלכם", "/solutions/ai-customer-service"],
  ["פרויקט R&D וטכנולוגיה מותאמת", "R&D וטכנולוגיה מותאמת", "/solutions/rd"],
  ["Tevel Invoice", "על Tevel Invoice", "/products/tevel-invoice"],
];

export default function ContactPage() {
  return (
    <>
      <div className="my-10 flex flex-col gap-10 md:my-16 md:gap-16">
        <header className="mx-auto flex max-w-[820px] flex-col gap-3 px-6 text-center md:gap-5">
          <Reveal><h1 className="font-serif text-[30px] font-light leading-9 tracking-[-0.04em] md:text-[49px] md:leading-[52px]">ספרו לנו מה לא עובד.</h1></Reveal>
          <Reveal delay={80}><p className="mx-auto max-w-[598px] leading-6 tracking-[0.01em] text-stone-2 md:text-xl md:leading-8">לא צריך לדעת איזו מערכת אתם צריכים. ספרו לנו מה אתם מנסים לשפר ואנחנו נתחיל מהבעיה.</p></Reveal>
        </header>

        <ul className="mx-auto grid w-full max-w-[1304px] gap-5 px-5 md:grid-cols-2 md:px-8 lg:grid-cols-3">
          {cards.map(([h, link, href], i) => (
            <Reveal as="li" key={h} delay={i * 60}>
              <div className="group flex h-full flex-col gap-2 rounded-xl border border-line bg-ink-2 p-6 transition-colors duration-300 hover:border-line-2 md:p-7">
                <span className="mb-1 text-paper">{icons[i]}</span>
                <h3 className="text-lg leading-7 md:text-xl">{h}</h3>
                <Link href={href} className="self-start leading-6 underline decoration-paper/70 underline-offset-[5px] transition-[text-decoration-color] duration-150 hover:decoration-transparent">{link}</Link>
              </div>
            </Reveal>
          ))}
        </ul>

        <section id="leave-details" className="flex scroll-mt-24 flex-col gap-10 md:gap-16">
          <header className="mx-auto flex max-w-[820px] flex-col gap-3 px-6 text-center md:gap-5">
            <Reveal><h2 className="font-serif text-[26px] font-light leading-8 tracking-[-0.04em] md:text-[39px] md:leading-[44px]">השאירו פרטים</h2></Reveal>
            <Reveal delay={80}><p className="mx-auto max-w-[748px] leading-6 tracking-[0.01em] text-stone-2 md:text-xl md:leading-8">נחזור אליכם לשיחת Discovery קצרה — בלי מפרט ובלי התחייבות לפרויקט. בשיחה נבין איך אתם עובדים היום, נמפה את התהליכים והמערכות, ורק אז נציע פתרון והצעה.</p></Reveal>
          </header>
          <div className="mx-auto w-full max-w-[852px] px-5 md:px-4">
            <Reveal>
              <div className="rounded-xl border border-line bg-ink-2 p-6 md:p-10">
                <LeadForm source="contact" />
              </div>
            </Reveal>
          </div>
        </section>
      </div>
      <CtaBand />
    </>
  );
}
