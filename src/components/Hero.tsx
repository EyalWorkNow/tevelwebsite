import Link from "next/link";
import AsciiField from "./AsciiField";
import { Button } from "./ui";
import { Arrow } from "./icons";

// Measured: content padding 80/40/40, 2×660 grid, h1 72/72 -0.02em, lede 20/28, band 252px w/ top rule.
export default function Hero() {
  return (
    <section className="wrap">
      <div className="inner grid gap-6 pb-10 pt-12 md:grid-cols-2 md:items-end md:pt-20">
        <div>
          <h1 className="display">
            <span className="block animate-[slide-up-and-fade_.7s_cubic-bezier(.16,1,.3,1)_both]">העסק שלכם לא צריך</span>
            <span className="block animate-[slide-up-and-fade_.7s_.08s_cubic-bezier(.16,1,.3,1)_both]">לעבוד סביב התוכנה שלו.</span>
          </h1>
          <p className="mt-6 max-w-[616px] text-lg font-light leading-7 animate-[slide-up-and-fade_.7s_.16s_cubic-bezier(.16,1,.3,1)_both] md:text-xl">
            אנחנו מתכננים ובונים מערכות מידע, CRM ו-ERP, AI ואוטומציות, מערכי שירות לקוחות חכמים, אפליקציות ומערכות Web{" "}
            <span className="text-muted">— סביב הדרך שבה העסק שלכם באמת עובד.</span>
          </p>
          <div className="mt-6 flex flex-wrap gap-4 animate-[slide-up-and-fade_.7s_.24s_cubic-bezier(.16,1,.3,1)_both]">
            <Button href="/contact" arrow>בואו נדבר</Button>
            <Button variant="default" href="/solutions/business-systems">לכל הפתרונות</Button>
          </div>
        </div>
        <Link href="/solutions/rd" className="group hidden items-center gap-3 justify-self-end font-mono text-sm uppercase leading-[14px] tracking-[0.06em] transition-colors duration-300 hover:text-muted md:flex">
          <span className="size-[7px] rounded-full bg-paper animate-[pulse-ring_3s_ease_infinite]" />
          R&amp;D &amp; Custom Technology
          <Arrow className="text-muted transition-transform duration-300 group-hover:-translate-x-0.5" />
        </Link>
      </div>
      <div className="-mx-4 h-[180px] border-t border-line md:h-[252px]"><AsciiField /></div>
    </section>
  );
}
