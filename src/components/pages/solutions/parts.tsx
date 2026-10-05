import Link from "next/link";
import type { ReactNode } from "react";
import AsciiField from "@/components/AsciiField";
import { Button, Reveal } from "@/components/ui";
import { Arrow, Glyph } from "@/components/icons";

// Shared building blocks for /solutions/[slug] and /products/[slug].
// Measured on the reference (1440 viewport): content padding 80/40, display 48/48 -0.05em,
// badge mono 11/16 px-12 py-6 r-8, banner 128px with top/bottom rule.

/** Section shell with optional top rule; 80/40 content padding on desktop. */
export function Block({ children, rule = true, className = "", pad = true }: { children: ReactNode; rule?: boolean; className?: string; pad?: boolean }) {
  return (
    <section className={rule ? "border-t border-line" : ""}>
      <div className="wrap">
        <div className={`${pad ? "inner py-12 md:py-20" : ""} ${className}`}>{children}</div>
      </div>
    </section>
  );
}

export function Heading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`font-serif text-[32px] font-light leading-9 tracking-[-0.05em] md:text-[40px] md:leading-[44px] ${className}`}>{children}</h2>;
}

/** Centred hero: eyebrow pill, serif h1, lede, two buttons, optional extra row, then the ASCII band. */
type HeroLink = { label: string; href: string };

export function CenteredHero({ eyebrow, heading, lede, wideLede, extra, after, primary = { label: "בואו נדבר", href: "/contact" }, secondary = { label: "איך עובדים", href: "/pricing" } }: { eyebrow: string; heading: string; lede: string; wideLede?: boolean; extra?: ReactNode; after?: ReactNode; primary?: HeroLink; secondary?: HeroLink }) {
  return (
    <section>
      <div className="wrap">
        <div className="flex flex-col items-center gap-8 px-2 py-14 text-center md:px-10 md:py-20">
          <Reveal>
            <span className="inline-flex rounded-lg border border-line-2 px-3 py-1.5 font-mono text-[11px] uppercase leading-4 tracking-[0.06em]">{eyebrow}</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="max-w-[576px] font-serif text-[40px] font-light leading-[42px] tracking-[-0.05em] md:text-[48px] md:leading-[48px]">{heading}</h1>
          </Reveal>
          <Reveal delay={160}>
            <p className={`font-light ${wideLede ? "max-w-[616px] text-lg leading-[26px] md:text-xl md:leading-7" : "max-w-[555px] text-lg leading-[26px]"}`}>{lede}</p>
          </Reveal>
          <Reveal delay={240} className="flex flex-wrap justify-center gap-4">
            <Button variant="default" href={primary.href}>{primary.label}</Button>
            <Button href={secondary.href} arrow>{secondary.label}</Button>
          </Reveal>
          {extra && <Reveal delay={320}>{extra}</Reveal>}
        </div>
      </div>
      <div className="h-[128px] border-y border-line"><AsciiField /></div>
      {after}
    </section>
  );
}

/** Neutral badge: plain circle + short principle line + link. */
export function HeroBadge({ title, body, link }: { title: string; body: string; link: HeroLink }) {
  return (
    <div className="flex items-center gap-3 text-start">
      <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-full border border-line-2 bg-ink-2">
        <span className="size-5 rounded-full border border-muted" />
      </span>
      <p className="max-w-[222px] text-xs font-light leading-4 text-muted">
        <strong className="font-normal text-paper">{title}.</strong> {body}.{" "}
        <Link href={link.href} className="underline underline-offset-2 transition-colors hover:text-paper">{link.label}</Link>
      </p>
    </div>
  );
}

const featureIcons = ["bank", "people", "swap", "shield", "eye", "trend", "lock", "pulse", "frame", "globe", "percent", "book"];

/** 4-up icon feature list (28px glyph, 16/22 title, 14/20 stone body). */
export function FeatureList({ seed, items }: { seed: number; items: { title: string; body: string }[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-20">
      {items.map((item, i) => (
        <Reveal as="li" key={i} delay={i * 80}>
          <div className="mb-2 h-[35px]">
            <Glyph name={featureIcons[(seed + i * 5) % featureIcons.length]} width={28} height={28} strokeWidth={1.25} />
          </div>
          <h3 className="text-base leading-[22px]">{item.title}</h3>
          <p className="mt-1 max-w-[259px] text-sm font-light leading-5 text-stone">{item.body}</p>
        </Reveal>
      ))}
    </ul>
  );
}

/** Bordered card with title, arrow top-right and description pinned to the bottom (measured 20/28 + 16/24). */
export function LearnCard({ href, heading, body }: { href: string; heading: string; body: string }) {
  return (
    <Link href={href} className="group flex min-h-[146px] flex-col justify-between gap-9 rounded-lg border border-line p-4 transition-colors duration-300 hover:border-line-2 hover:bg-ink-2 md:min-h-[202px]">
      <div className="flex justify-between gap-3">
        <span className="max-w-[252px] text-xl font-light leading-7">{heading}</span>
        <Arrow width={20} height={20} strokeWidth={1.25} className="shrink-0 text-muted transition-all duration-300 group-hover:-translate-x-0.5 group-hover:text-paper" />
      </div>
      <p className="max-w-[284px] font-light leading-6 text-muted">{body}</p>
    </Link>
  );
}

