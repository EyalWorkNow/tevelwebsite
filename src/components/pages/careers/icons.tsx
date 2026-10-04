import type { SVGProps } from "react";

// Original 20px line glyphs for the careers page (no third-party artwork).
type P = SVGProps<SVGSVGElement>;
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.25, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const paths: Record<string, string> = {
  sparkle: "M8 3.5l1.3 3.7L13 8.5l-3.7 1.3L8 13.5l-1.3-3.7L3 8.5l3.7-1.3zM14.5 11.5l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6zM14.5 3v2.5M13.25 4.25h2.5",
  globe: "M10 3a7 7 0 100 14 7 7 0 000-14zM4 7.5c2 .5 3 1.6 3 3.2 0 1.8 1.5 2 1.5 3.8M12.5 3.5c-.6 1.4-.2 2.6 1.2 3 1.2.4 2.7.1 3.1 1.4M11 16.8c.2-1.6 1-2.6 2.5-2.8",
  desk: "M3 7h14M4 7v7M16 7v7M4 10h12M7.5 7v3M12.5 7v3",
  building: "M5 17V6l5-2.5V17M10 8h5v9M3 17h14M7 9v.01M7 12v.01M12.5 11v.01M12.5 14v.01",
  pin: "M10 17.5s-5.5-4.6-5.5-9a5.5 5.5 0 0111 0c0 4.4-5.5 9-5.5 9zM10 10.5a2 2 0 100-4 2 2 0 000 4zM6 17.5h8",
  book: "M3 5h4.5A2.5 2.5 0 0110 7.5V16a2 2 0 00-2-2H3zM17 5h-4.5A2.5 2.5 0 0010 7.5V16a2 2 0 012-2h5zM12.5 8.5h2.5M12.5 11h2.5",
  figure: "M10 5.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM4.5 8h11M10 8v4l-3.5 5M10 12l3.5 5",
  hands: "M2.5 9l3-3 3 1.2L11 6l6.5 3M17.5 9l-2.5 3-2-1.5M2.5 9l4 4 1.5-1 1.5 1.5 1.5-1 1.5 1 2-1.5M8 7.5l2.5 2.5",
  card: "M2.5 5h15v10h-15zM2.5 8h15M11 12h4M13 12.01",
  heart: "M10 16.5S3 12.6 3 7.7A3.6 3.6 0 0110 6a3.6 3.6 0 017 1.7c0 4.9-7 8.8-7 8.8zM5 10h2.5L9 8l2 4 1.5-2H15",
  bank: "M3 8l7-4 7 4M4.5 8v7M8 8v7M12 8v7M15.5 8v7M3 16.5h14",
  shield: "M10 2.5l6 2.5v4.5c0 4-2.6 6.8-6 8-3.4-1.2-6-4-6-8V5zM7.5 10l1.8 1.8L13 8",
  trend: "M3 14l5-5 3 3 6-6M12 6h5v5",
  cap: "M2.5 8L10 4.5 17.5 8 10 11.5zM5.5 9.5v4c1.5 1.5 3 2 4.5 2s3-.5 4.5-2v-4M17.5 8v4",
  clock: "M10 3a7 7 0 100 14 7 7 0 000-14zM10 6v4l3 2",
  chat: "M3 9a5 5 0 015-5h1a5 5 0 010 10H5l-2 2zM12.5 14.5A5 5 0 0017 10",
  pram: "M4 4h2l1 3h9a5 5 0 01-5 5H8.5A3.5 3.5 0 015 8.5zM7 15.5a1.25 1.25 0 100 .01M14 15.5a1.25 1.25 0 100 .01M16 7c0-2 1-3 2-3",
  plane: "M8.5 11.5L3 10l1-1 5 .5 4.5-4.5c1-1 2.5-1.5 3-1s0 2-1 3L11 11.5l.5 5-1 1-1.5-5.5-3 3v2l-1 1-1-2.5-2.5-1 1-1h2z",
  fire: "M10 3c2 2.5 3.5 4.5 3.5 7a3.5 3.5 0 01-7 0c0-1.5.7-2.5 1.5-3.5.3 1.2 1 1.8 2 2-.5-2 0-3.8 0-5.5zM4 17l12-2.5M16 17L4 14.5",
  cup: "M4 8h10v4a4 4 0 01-4 4H8a4 4 0 01-4-4zM14 9h1.5a2 2 0 010 4H14M7 3v2.5M10 3v2.5M3 17.5h12",
  quote: "M4 5h4v4c0 3-1.5 5-4 6M12 5h4v4c0 3-1.5 5-4 6",
};
export function CIcon({ name, ...p }: P & { name: keyof typeof paths | string }) {
  return <svg viewBox="0 0 20 20" width={20} height={20} {...base} {...p}><path d={paths[name] ?? paths.sparkle} /></svg>;
}
