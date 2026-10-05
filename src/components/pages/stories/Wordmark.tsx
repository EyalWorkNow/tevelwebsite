/** Neutral scenario label: an original geometric glyph + scenario name (no company names). */
const shapes = [
  "M2 14L10 4l8 10M6 14l4-5 4 5",
  "M3 3h14v4H3zM3 10h8v7H3z",
  "M4 3c0 6 3 9 6 9s6-3 6-9M10 12v6",
  "M10 2l8 8-8 8-8-8z",
];
export function Wordmark({ name, seed, className = "" }: { name: string; seed: number; className?: string }) {
  return (
    <span className={`flex items-center gap-2 text-[22px] font-semibold leading-none tracking-[-0.02em] ${className}`}>
      <svg viewBox="0 0 20 20" className="size-[1.1em]" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={shapes[seed % shapes.length]} />
      </svg>
      {name}
    </span>
  );
}
