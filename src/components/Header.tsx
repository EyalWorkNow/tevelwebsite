"use client";
import { useEffect, useState } from "react";
import { Logo, Arrow } from "./icons";

const links = ["Platform", "Use cases", "Pricing", "Developers", "Company", "Resources"];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 64);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className="wrap relative z-50">
      <div className="inner flex h-16 items-center justify-between">
        <a href="#" className="flex items-center gap-2 text-paper" aria-label="Meridian home">
          <Logo />
          <span className="font-serif text-[22px] tracking-[-0.03em]">Meridian</span>
        </a>
        <div className="hidden items-center gap-2 md:flex">
          <a href="#" className="label rounded-full px-3.5 py-2 hover:text-stone">Log in</a>
          <a href="#" className="label rounded-full bg-paper-2 px-3.5 py-2 text-ink hover:bg-paper">Contact sales</a>
        </div>
        <button className="label rounded-full border border-line-2 px-3.5 py-2 md:hidden" onClick={() => setOpen(!open)} aria-expanded={open}>
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Fixed centred pill — logo scrolls away, nav stays */}
      <nav className="fixed left-1/2 top-3 hidden -translate-x-1/2 md:block" aria-label="Main">
        <ul className="flex h-10 items-center rounded-full bg-ink/40 px-1 backdrop-blur-[12px]">
          {links.map((l) => (
            <li key={l}>
              <a href="#" className="label inline-flex h-8 items-center whitespace-nowrap rounded-full px-4 leading-3 transition-colors duration-300 hover:bg-ink-2">{l}</a>
            </li>
          ))}
          <li className={`overflow-hidden transition-all duration-300 ${scrolled ? "ml-1 max-w-40 opacity-100" : "max-w-0 opacity-0"}`}>
            <a href="#" tabIndex={scrolled ? 0 : -1} className="label inline-flex h-8 items-center whitespace-nowrap rounded-full bg-paper-2 px-3.5 text-ink">Contact sales</a>
          </li>
        </ul>
      </nav>

      {open && (
        <div className="fixed inset-x-4 top-16 rounded-2xl border border-line bg-ink-2 p-4 md:hidden">
          {links.map((l) => (
            <a key={l} href="#" className="label flex items-center justify-between border-b border-line py-4 last:border-0">{l}<Arrow /></a>
          ))}
          <a href="#" className="btn-light mt-4 w-full justify-center">Contact sales</a>
        </div>
      )}
    </header>
  );
}
