import Link from "next/link";
import { footer } from "@/lib/site";
import { TevelLogo } from "./icons";

export default function Footer() {
  return (
    <footer className="rule">
      <div className="wrap">
        <div className="inner grid gap-10 py-14 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] md:py-[72px]">
          <div className="space-y-3 text-[11px] leading-4 text-stone-2">
            <Link href="/" className="mb-6 inline-block"><TevelLogo className="h-8 w-auto" /></Link>
            <p className="text-paper">בית תוכנה תבל</p>
            <p className="label text-muted">Software House &amp; Technology Partner</p>
            <p className="max-w-[260px]">תבל בונה את המערכות שעליהן עסקים עובדים — ממערכות מידע, CRM ו-ERP ועד AI, אוטומציות ומוצרים דיגיטליים.</p>
            <p>Understand first. Build what matters.</p>
                      </div>
          {footer.map((col) => (
            <div key={col.label}>
              <h3 className="label mb-5">{col.label}</h3>
              <ul className="space-y-2.5 text-[13px] text-stone">
                {col.links.map((l) => <li key={l.href + l.label}><Link href={l.href} className="transition-colors hover:text-paper">{l.label}</Link></li>)}
              </ul>
              {false && (
                <>
                  <h3 className="label mb-4 mt-8">Social</h3>
                  <div className="flex gap-3 text-stone">
                    {["in", "yt", "x"].map((s) => <a key={s} href="#" aria-label={s} className="grid size-6 place-items-center rounded border border-line-2 font-mono text-[9px] uppercase transition-colors hover:text-paper">{s}</a>)}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="inner flex flex-col justify-between gap-2 border-t border-line py-5 text-[11px] text-stone-2 md:flex-row">
          <span>© {new Date().getFullYear()} TEVEL | תבל</span>
          <span className="label text-muted">Technology built around the business.</span>
        </div>
      </div>
    </footer>
  );
}
