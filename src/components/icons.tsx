import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const Arrow = (p: P) => (
  <svg viewBox="0 0 16 16" width={12} height={12} {...base} {...p}><path d="M3 8h10M9 4l4 4-4 4" /></svg>
);
export const ArrowUpRight = (p: P) => (
  <svg viewBox="0 0 16 16" width={14} height={14} {...base} {...p}><path d="M5 11l6-6M6 5h5v5" /></svg>
);
export const Check = (p: P) => (
  <svg viewBox="0 0 16 16" width={16} height={16} {...p}>
    <circle cx="8" cy="8" r="8" fill="currentColor" />
    <path d="M4.8 8.2l2 2 4.4-4.4" fill="none" stroke="#0c0c0b" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
/** Original mark for the fictional brand — a compass meridian. */
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
