import Link from "next/link";
import type { ReactNode } from "react";
import { Placeholder, Reveal } from "@/components/ui";
import { Arrow } from "@/components/icons";

/** Page container: wrap + inner, 80px vertical rhythm (measured LayoutContent padding). */
export function Shell({ children, rule, className = "", pad = "py-16 md:py-20" }: { children: ReactNode; rule?: boolean; className?: string; pad?: string }) {
  return (
    <section className={rule ? "rule" : ""}>
      <div className="wrap"><div className={`inner ${pad} ${className}`}>{children}</div></div>
    </section>
  );
}

/** Image link card used in the "Explore" grid (article-card-list). */
export function ExploreCard({ href = "#", title, body, seed, delay = 0 }: { href?: string; title: string; body: string; seed: number; delay?: number }) {
  return (
    <Reveal as="li" delay={delay} className="group relative grid content-start grid-cols-[1fr_20px] gap-x-3 gap-y-5 rounded-lg border border-line p-4 font-light transition-colors duration-200 hover:border-line-2">
      <div className="col-span-2 -mx-4 -mt-4 overflow-hidden rounded-t-[7px] bg-ink-2">
        <Placeholder seed={seed} className="aspect-video grayscale transition-[scale] duration-[400ms] group-hover:scale-[1.03]" />
      </div>
      <Link href={href} className="text-base leading-6 transition-colors md:text-xl md:leading-7 duration-200 after:absolute after:inset-0 after:content-['']">{title}</Link>
      <Arrow width={20} height={20} className="mt-1 text-muted transition-[color,translate] duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 group-hover:text-paper" />
      <p className="col-span-2 text-sm leading-5 text-stone md:text-base md:leading-6">{body}</p>
    </Reveal>
  );
}

/** Centred section heading (team page). */
export function CenterHeading({ children }: { children: ReactNode }) {
  return <Reveal><h2 className="h2 text-center">{children}</h2></Reveal>;
}

/* ---------- Photo marquee (team hero): 12-col mosaic, two copies, 140s linear loop ---------- */
// [col, row, col-span, row-span] for each tile of one group, as measured.
const mosaic = [[1, 1, 2, 2], [3, 1, 1, 1], [4, 1, 1, 1], [3, 2, 2, 1], [5, 1, 2, 2], [7, 1, 1, 1], [7, 2, 1, 1], [8, 1, 2, 2], [10, 1, 2, 2], [12, 1, 1, 1], [12, 2, 1, 1]];

function MosaicGroup({ hidden }: { hidden?: boolean }) {
  return (
    <div aria-hidden={hidden} className="grid shrink-0 grid-cols-[repeat(12,var(--col))] grid-rows-[repeat(2,var(--row))] gap-[var(--gap)] pr-[var(--gap)]">
      {mosaic.map(([x, y, c, r], i) => (
        <div key={i} style={{ gridColumn: `${x} / span ${c}`, gridRow: `${y} / span ${r}` }} className="overflow-hidden rounded-xl bg-ink-2">
          <Placeholder seed={i * 3 + 1} className="h-full w-full" />
        </div>
      ))}
    </div>
  );
}

export function PhotoMarquee() {
  return (
    <div dir="ltr" className="overflow-hidden py-6 [--col:126px] [--gap:12px] [--row:100px] md:[--col:266.4px] md:[--gap:22px] md:[--row:177.6px]">
      <div className="flex w-max animate-[marquee_140s_linear_infinite]">
        <MosaicGroup />
        <MosaicGroup hidden />
      </div>
    </div>
  );
}
