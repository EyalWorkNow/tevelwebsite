"use client";
import { useState } from "react";
import { Placeholder } from "./ui";
import { sentence, title } from "@/lib/lorem";

// Fictional lorem wordmarks in varied type treatments — no third-party logos.
const marks: [string, string][] = [
  ["lorem", "font-sans font-semibold lowercase text-lg"],
  ["IPSUM", "font-sans font-black tracking-tight text-lg"],
  ["Dolor", "font-serif italic text-xl"],
  ["sitamet", "font-sans font-light text-lg"],
  ["CONSECT", "font-mono tracking-[0.2em] text-sm"],
  ["Adipisc", "font-serif text-xl"],
  ["elit·sed", "font-mono text-sm"],
  ["Tempor", "font-sans font-medium text-lg"],
  ["Magna&Co", "font-serif italic text-lg"],
  ["ALIQUA", "font-mono font-bold text-sm"],
];
const kinds = ["Customer story", "Blog", "Podcast"];

export default function Logos() {
  const [hover, setHover] = useState<number | null>(null);

  const Cell = ({ n }: { n: number }) => (
    <li
      onMouseEnter={() => setHover(n)}
      onMouseLeave={() => setHover(null)}
      className="relative grid h-16 place-items-center border-b border-r border-dashed border-line text-stone-2"
    >
      <span className={`transition-opacity duration-300 ${hover === n ? "opacity-0" : "opacity-80"} ${marks[n][1]}`}>{marks[n][0]}</span>
      {hover === n && (
        <span className="label absolute rounded-full bg-line px-2.5 py-1 text-[10px] text-stone animate-[fade-in_.2s_ease_both]">{kinds[n % 3]}</span>
      )}
    </li>
  );

  return (
    <section className="wrap relative">
      <ul className="grid grid-cols-2 border-l border-dashed border-line md:grid-cols-6">
        <Cell n={0} /><Cell n={1} />
        <li className="col-span-2 grid h-16 place-items-center border-b border-r border-dashed border-line font-mono text-sm uppercase tracking-[0.06em] text-muted">
          <span>Trusted by <span className="text-paper">50+ lorem</span></span>
        </li>
        <Cell n={2} /><Cell n={3} />
        {[4, 5, 6, 7, 8, 9].map((n) => <Cell key={n} n={n} />)}
      </ul>

      {/* Quote popover — fixed bottom-left like the reference */}
      {hover !== null && (
        <div className="pointer-events-none fixed bottom-6 left-6 z-40 hidden w-[280px] rounded-lg bg-ink-2/90 p-5 shadow-[inset_0_0_0_1px_#514e4b] backdrop-blur-xl animate-[slide-up-and-fade_.25s_ease_both] md:block">
          <div className="font-serif text-4xl leading-none text-stone">“</div>
          <p className="mt-2 font-medium leading-6">{sentence(14, hover * 3)}</p>
          <div className="mt-5 flex items-end justify-between">
            <div className="text-[13px] leading-5"><div>{title(2, hover + 20)}</div><div className="text-muted">{title(3, hover + 30)}</div><div className="text-muted">{marks[hover][0]}</div></div>
            <Placeholder seed={hover} className="size-12 rounded" />
          </div>
        </div>
      )}
    </section>
  );
}
