import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const Arrow = (p: P) => (
  <svg viewBox="0 0 16 16" width={12} height={12} {...base} {...p} className={`rtl:-scale-x-100 ${p.className ?? ""}`}><path d="M3 8h10M9 4l4 4-4 4" /></svg>
);
export const ArrowUpRight = (p: P) => (
  <svg viewBox="0 0 16 16" width={14} height={14} {...base} {...p} className={`rtl:-scale-x-100 ${p.className ?? ""}`}><path d="M5 11l6-6M6 5h5v5" /></svg>
);
export const Check = (p: P) => (
  <svg viewBox="0 0 16 16" width={16} height={16} {...p}>
    <circle cx="8" cy="8" r="8" fill="currentColor" />
    <path d="M4.8 8.2l2 2 4.4-4.4" fill="none" stroke="#0c0c0b" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
/** TEVEL wordmark (user-supplied, /public/brand). */
export const TevelLogo = ({ className = "h-7 w-auto" }: { className?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src="/brand/tevel-logo.svg" alt="TEVEL תבל" className={className} />
);
/** Legacy placeholder mark. */
export const Logo = (p: P) => (
  <svg viewBox="0 0 28 28" width={28} height={28} {...base} {...p}>
    <circle cx="14" cy="14" r="11" />
    <path d="M14 3v22M9 8.5c3 2.5 7 2.5 10 0M9 19.5c3-2.5 7-2.5 10 0" />
  </svg>
);
// Product icons — 20px line glyphs
export const IconBox = (p: P) => (<svg viewBox="0 0 20 20" width={20} height={20} {...base} {...p}><path d="M3 6.5L10 3l7 3.5v7L10 17l-7-3.5z M3 6.5L10 10l7-3.5M10 10v7" /></svg>);
export const IconRoute = (p: P) => (<svg viewBox="0 0 20 20" width={20} height={20} {...base} {...p}><circle cx="5" cy="15" r="2" /><circle cx="15" cy="5" r="2" /><path d="M7 15h5a3 3 0 000-6H8a3 3 0 010-6h5" /></svg>);
export const IconShield = (p: P) => (<svg viewBox="0 0 20 20" width={20} height={20} {...base} {...p}><path d="M10 2.5l6 2.5v4.5c0 4-2.6 6.8-6 8-3.4-1.2-6-4-6-8V5z M7.5 10l1.8 1.8L13 8" /></svg>);
export const IconStack = (p: P) => (<svg viewBox="0 0 20 20" width={20} height={20} {...base} {...p}><path d="M10 3l7 3.5-7 3.5-7-3.5z M3 10l7 3.5 7-3.5M3 13.5L10 17l7-3.5" /></svg>);
export const IconWarehouse = (p: P) => (<svg viewBox="0 0 20 20" width={20} height={20} {...base} {...p}><path d="M2.5 17V7.5L10 3l7.5 4.5V17M6 17v-6h8v6M6 14h8" /></svg>);
export const IconScan = (p: P) => (<svg viewBox="0 0 20 20" width={20} height={20} {...base} {...p}><path d="M3 7V4a1 1 0 011-1h3M13 3h3a1 1 0 011 1v3M17 13v3a1 1 0 01-1 1h-3M7 17H4a1 1 0 01-1-1v-3M6 10h8" /></svg>);
export const IconSwap = (p: P) => (<svg viewBox="0 0 20 20" width={20} height={20} {...base} {...p}><path d="M4 7h12l-3-3M16 13H4l3 3" /></svg>);
export const IconGlobe = (p: P) => (<svg viewBox="0 0 20 20" width={20} height={20} {...base} {...p}><circle cx="10" cy="10" r="7" /><path d="M3 10h14M10 3c2 2.2 2.8 4.5 2.8 7S12 14.8 10 17c-2-2.2-2.8-4.5-2.8-7S8 5.2 10 3z" /></svg>);

// Menu / feature glyphs — original line drawings, 20px grid.
const g = (d: string) => function Glyph(p: P) { return <svg viewBox="0 0 20 20" width={20} height={20} {...base} {...p}><path d={d} /></svg>; };
export const glyphs: Record<string, (p: P) => React.JSX.Element> = {
  bank: g("M3 8l7-4 7 4M4.5 8v7M8 8v7M12 8v7M15.5 8v7M3 16.5h14"),
  frame: g("M4 7V4h3M13 4h3v3M16 13v3h-3M7 16H4v-3"),
  trend: g("M3 14l5-5 3 3 6-6M12 6h5v5"),
  shield: g("M10 2.5l6 2.5v4.5c0 4-2.6 6.8-6 8-3.4-1.2-6-4-6-8V5zM7.5 10l1.8 1.8L13 8"),
  people: g("M7 9.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM13.5 9.5a2.5 2.5 0 100-5M2.5 16c.6-2.6 2.3-4 4.5-4s3.9 1.4 4.5 4M13 12c2 0 3.6 1.3 4.2 4"),
  eye: g("M2 10s3-5.5 8-5.5S18 10 18 10s-3 5.5-8 5.5S2 10 2 10zM10 12.3a2.3 2.3 0 100-4.6 2.3 2.3 0 000 4.6z"),
  swap: g("M4 7h12l-3-3M16 13H4l3 3"),
  code: g("M7 6l-4 4 4 4M13 6l4 4-4 4M11 4l-2 12"),
  book: g("M4 4.5h5a2 2 0 012 2V16a1.5 1.5 0 00-1.5-1.5H4zM16 4.5h-5M16 4.5v10h-4.5"),
  pulse: g("M2.5 10h3.5l2-4.5 4 9 2-4.5h3.5"),
  chat: g("M3.5 4.5h13v9h-7l-4 3v-3h-2z"),
  percent: g("M5 15L15 5M6 7.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM14 15.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"),
  globe: g("M10 3a7 7 0 100 14 7 7 0 000-14zM3 10h14M10 3c2 2.2 2.8 4.5 2.8 7S12 14.8 10 17c-2-2.2-2.8-4.5-2.8-7S8 5.2 10 3z"),
  lock: g("M5 9h10v8H5zM7 9V6.5a3 3 0 016 0V9"),
  stack: g("M10 3l7 3.5-7 3.5-7-3.5zM3 10l7 3.5 7-3.5M3 13.5L10 17l7-3.5"),
  spark: g("M10 2.5v4M10 13.5v4M2.5 10h4M13.5 10h4M5 5l2.5 2.5M12.5 12.5L15 15M15 5l-2.5 2.5M7.5 12.5L5 15"),
};
export const Glyph = ({ name, ...p }: P & { name: string }) => { const G = glyphs[name] ?? glyphs.spark; return <G {...p} />; };
