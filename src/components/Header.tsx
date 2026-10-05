"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/lib/site";
import { TevelLogo, Glyph } from "./icons";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [acc, setAcc] = useState<string | null>(null);
  const close = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 64);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  const open = (l: string | null) => { clearTimeout(close.current); setMenu(l); };
  const leave = () => { close.current = setTimeout(() => setMenu(null), 150); };

  return (
    <header className="wrap relative z-50">
      <div className="inner flex h-16 items-center justify-between">
        <Link href="/" aria-label="תבל — דף הבית"><TevelLogo className="h-7 w-auto md:h-8" /></Link>
        <div className="hidden items-center gap-2 md:flex">
                    <Link href="/contact" className="label rounded-full bg-paper-2 px-3.5 py-2 text-ink transition-colors hover:bg-paper">בואו נדבר</Link>
        </div>
        <button className="label rounded-full border border-line-2 px-3.5 py-2 md:hidden" onClick={() => setMobile(!mobile)} aria-expanded={mobile}>
          {mobile ? "סגירה" : "תפריט"}
        </button>
      </div>

      {/* Fixed centred pill: logo scrolls away, nav stays */}
      <nav className="fixed left-1/2 top-3 hidden -translate-x-1/2 md:block" aria-label="ניווט ראשי" onMouseLeave={leave}>
        <ul className="relative flex h-10 items-center rounded-full bg-ink/40 px-1 backdrop-blur-[12px]">
          {nav.map((item) => (
            <li key={item.label} className="relative" onMouseEnter={() => open(item.groups ? item.label : null)}>
              {item.href ? (
                <Link href={item.href} className="label inline-flex h-8 items-center whitespace-nowrap rounded-full px-4 leading-3 transition-colors duration-300 hover:bg-line">{item.label}</Link>
              ) : (
                <button
                  onClick={() => open(menu === item.label ? null : item.label)}
                  onFocus={() => open(item.label)}
                  aria-expanded={menu === item.label}
                  className={`label inline-flex h-8 items-center whitespace-nowrap rounded-full px-4 leading-3 transition-colors duration-300 ${menu === item.label ? "bg-line-2/80" : "hover:bg-line"}`}
                >
                  {item.label}
                </button>
              )}
              {menu === item.label && item.groups && (
                <div
                  onMouseEnter={() => open(item.label)}
                  className="absolute start-0 top-[calc(100%+10px)] min-w-[240px] origin-top animate-[menu-in_.2s_ease_both] rounded-2xl border border-white/[0.12] bg-[#121211]/92 p-4 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.85),inset_0_1px_1px_0_rgba(255,255,255,0.22),inset_0_-1px_1px_0_rgba(0,0,0,0.4)] backdrop-blur-2xl backdrop-saturate-[180%] [perspective:2000px]"
                >
                  {item.groups.map((grp) => (
                    <div key={grp.label || "g"}>
                      {grp.label && (
                        <div className="label mb-2 mt-1 flex items-center gap-2 text-[10px] text-stone-2 first:mt-0">
                          <span className="whitespace-nowrap font-medium tracking-wider text-stone-2">{grp.label}</span>
                          <span className="h-px flex-1 bg-white/10" />
                        </div>
                      )}
                      <ul className="mb-2">
                        {grp.links.map((l) => (
                          <li key={l.href + l.label}>
                            <Link href={l.href} onClick={() => setMenu(null)} className="group flex items-center gap-3 rounded-xl p-2 transition-all duration-200 hover:bg-white/[0.06]">
                              {l.icon && (
                                <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-stone shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-200 group-hover:border-brand/40 group-hover:bg-brand/[0.08] group-hover:text-paper">
                                  <Glyph name={l.icon} width={18} height={18} />
                                </span>
                              )}
                              <span>
                                <span className="block whitespace-nowrap leading-5 text-paper transition-colors group-hover:text-white">{l.label}</span>
                                {l.desc && <span className="block whitespace-nowrap text-xs text-stone-2 transition-colors group-hover:text-stone">{l.desc}</span>}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
          <li className={`overflow-hidden transition-all duration-300 ${scrolled ? "ms-1 max-w-40 opacity-100" : "max-w-0 opacity-0"}`}>
            <Link href="/contact" tabIndex={scrolled ? 0 : -1} className="label inline-flex h-8 items-center whitespace-nowrap rounded-full bg-paper-2 px-3.5 text-ink">בואו נדבר</Link>
          </li>
        </ul>
      </nav>

      {/* Mobile: full-width sheet with accordion groups */}
      {mobile && (
        <div className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-ink px-6 pb-10 md:hidden animate-[slide-down-and-fade_.2s_ease_both]">
          {nav.map((item) => (
            <div key={item.label} className="border-b border-line">
              {item.href ? (
                <Link href={item.href} onClick={() => setMobile(false)} className="label flex py-5">{item.label}</Link>
              ) : (
                <>
                  <button className="label flex w-full items-center justify-between py-5" onClick={() => setAcc(acc === item.label ? null : item.label)} aria-expanded={acc === item.label}>
                    {item.label}<span className={`transition-transform duration-300 ${acc === item.label ? "rotate-45" : ""}`}>+</span>
                  </button>
                  <div className={`grid transition-all duration-300 ${acc === item.label ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      {item.groups!.flatMap((g) => g.links).map((l) => (
                        <Link key={l.href + l.label} href={l.href} onClick={() => setMobile(false)} className="block pb-4 text-stone">{l.label}</Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
          <div className="mt-6 grid gap-3">
            <Link href="/contact" className="btn-light justify-center">בואו נדבר</Link>
                      </div>
        </div>
      )}
    </header>
  );
}
