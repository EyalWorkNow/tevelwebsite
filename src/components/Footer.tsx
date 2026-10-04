import Link from "next/link";
import { footer } from "@/lib/site";
import { sentence } from "@/lib/lorem";
import { Logo } from "./icons";

export default function Footer() {
  return (
    <footer className="rule">
      <div className="wrap">
        <div className="inner grid gap-10 py-14 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] md:py-[72px]">
          <div className="space-y-3 text-[11px] leading-4 text-stone-2">
            <Link href="/" className="mb-6 flex items-center gap-2 text-paper"><Logo /><span className="font-serif text-[24px] tracking-[-0.03em]">Lorem</span></Link>
            <p className="max-w-[240px]">{sentence(16, 3)}</p>
            <p className="max-w-[240px]">{sentence(22, 9)}</p>
            <p>{sentence(6, 14)}</p>
            <div className="!mt-6 grid size-14 place-items-center rounded-full border border-line-2 font-mono text-[9px] uppercase text-muted">Badge</div>
          </div>
          {footer.map((col) => (
            <div key={col.label}>
              <h3 className="label mb-5">{col.label}</h3>
              <ul className="space-y-2.5 text-[13px] text-stone">
                {col.links.map((l) => <li key={l.href + l.label}><Link href={l.href} className="transition-colors hover:text-paper">{l.label}</Link></li>)}
              </ul>
              {col.label === "Developers" && (
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
          <span>© 2026 Lorem Ipsum Ltd</span>
          <span>{sentence(12, 40)}</span>
        </div>
      </div>
    </footer>
  );
}
