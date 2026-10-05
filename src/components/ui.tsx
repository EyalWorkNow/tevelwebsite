"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { Arrow } from "./icons";

/* ---------- Buttons (pill, mono, uppercase) ---------- */
export function Button({ href = "#", children, variant = "accent", arrow, className = "" }: { href?: string; children: ReactNode; variant?: "accent" | "default"; arrow?: boolean; className?: string }) {
  return (
    <Link href={href} className={`group ${variant === "accent" ? "btn-light" : "btn-dark"} ${className}`}>
      {children}
      {arrow && <Arrow className="transition-transform duration-300 group-hover:-translate-x-0.5" />}
    </Link>
  );
}

/** Small outlined mono pill used above centred page titles. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="label inline-flex rounded-md border border-line-2 px-2.5 py-1.5 text-[11px] text-stone">{children}</span>;
}

/* ---------- Reveal: slide-up-and-fade when scrolled into view ---------- */
export function Reveal({ children, delay = 0, className = "", as: Tag = "div" }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "li" | "section" }) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { rootMargin: "0px 0px -10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const style: CSSProperties = { animationDelay: `${delay}ms` };
  return (
    // @ts-expect-error polymorphic ref
    <Tag ref={ref} style={style} className={`${on ? "animate-[slide-up-and-fade_.6s_cubic-bezier(.16,1,.3,1)_both]" : "opacity-0"} ${className}`}>
      {children}
    </Tag>
  );
}

/* ---------- Placeholder for photography (no third-party images) ---------- */
const tones = [
  ["#2b2723", "#6b5f53", "#b9a993"],
  ["#1f2329", "#4d5866", "#a9b4c0"],
  ["#22261f", "#56604a", "#b3bb9d"],
  ["#2a2226", "#6a4f5a", "#c4a7b2"],
  ["#262626", "#5a5a5a", "#bdbdbd"],
];
export function Placeholder({ seed = 0, className = "", label }: { seed?: number; className?: string; label?: string }) {
  const [a, b, c] = tones[seed % tones.length];
  const angle = 110 + (seed * 37) % 120;
  return (
    <div className={`${/\b(absolute|fixed|sticky)\b/.test(className) ? "" : "relative"} overflow-hidden ${className}`} style={{ background: `linear-gradient(${angle}deg, ${a}, ${b} 55%, ${c})` }} aria-hidden={!label} role={label ? "img" : undefined} aria-label={label}>
      <div className="absolute inset-0 opacity-[0.18] mix-blend-overlay" style={{ backgroundImage: "radial-gradient(#fff 0.6px, transparent 0.6px)", backgroundSize: "3px 3px" }} />
    </div>
  );
}

/* ---------- Link card (bordered, arrow top-right) ---------- */
export function LinkCard({ href = "#", title, body, image }: { href?: string; title: string; body?: string; image?: number }) {
  return (
    <Link href={href} className="group flex flex-col overflow-hidden rounded-lg border border-line transition-colors duration-300 hover:border-line-2 hover:bg-ink-2">
      {image !== undefined && <Placeholder seed={image} className="aspect-[16/9]" />}
      <div className="flex min-h-[202px] flex-1 flex-col justify-between p-4">
        <div className="flex justify-between gap-4">
          <span className="text-xl font-light leading-7">{title}</span>
          <Arrow width={20} height={20} className="shrink-0 text-muted transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:text-paper" />
        </div>
        {body && <p className="mt-8 leading-6 text-muted">{body}</p>}
      </div>
    </Link>
  );
}

/* ---------- Section shell: top rule + container ---------- */
export function Section({ children, className = "", rule = true, id }: { children: ReactNode; className?: string; rule?: boolean; id?: string }) {
  return (
    <section id={id} className={rule ? "rule" : ""}>
      <div className="wrap"><div className={`inner py-14 md:py-[72px] ${className}`}>{children}</div></div>
    </section>
  );
}

/* ---------- Closing CTA band (identical on every page) ---------- */
export function CtaBand({ text = "ספרו לנו מה לא עובד. אנחנו נתחיל משם.", cta = "בואו נדבר", href = "/contact" }: { text?: string; cta?: string; href?: string }) {
  return (
    <section className="wrap">
      <div className="inner flex flex-col items-center py-24 text-center md:py-[120px]">
        <Reveal><p className="max-w-[480px] font-serif text-[32px] font-light leading-9 tracking-[-0.04em] md:text-[40px] md:leading-[44px]">{text}</p></Reveal>
        <Reveal delay={120}><Button className="mt-8" href={href} arrow>{cta}</Button></Reveal>
      </div>
    </section>
  );
}

/* ---------- Centred page hero (solutions / products / pricing) ---------- */
export function PageHero({ eyebrow, heading, lede, children }: { eyebrow?: string; heading: string; lede?: string; children?: ReactNode }) {
  return (
    <section className="wrap">
      <div className="inner flex flex-col items-center pb-16 pt-12 text-center md:pt-[72px]">
        {eyebrow && <Reveal><Eyebrow>{eyebrow}</Eyebrow></Reveal>}
        <Reveal delay={80}><h1 className="mt-6 max-w-[620px] font-serif text-[40px] font-light leading-[44px] tracking-[-0.05em] md:text-[48px] md:leading-[48px]">{heading}</h1></Reveal>
        {lede && <Reveal delay={160}><p className="mt-6 max-w-[560px] text-lg font-light leading-[26px]">{lede}</p></Reveal>}
        {children && <Reveal delay={240} className="mt-8 flex flex-wrap justify-center gap-3">{children}</Reveal>}
      </div>
    </section>
  );
}
