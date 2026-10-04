import { IconBox, IconRoute, IconShield, IconStack, IconWarehouse, IconScan, IconSwap, IconGlobe } from "./icons";
import type { ComponentType } from "react";
import { title, words } from "@/lib/lorem";

type Item = { i: ComponentType; t: string; d: string };
const mk = (n: number, s: number, icons: ComponentType[]): Item[] => icons.slice(0, n).map((i, k) => ({ i, t: title(3, s + k * 2), d: words(6, s + k * 3 + 1) }));
const left: [string, Item[]][] = [[title(2, 110), mk(4, 111, [IconBox, IconRoute, IconShield, IconStack])]];
const right: [string, Item[]][] = [
  [title(2, 120), mk(1, 121, [IconWarehouse])],
  [title(1, 125), mk(1, 126, [IconScan])],
  [title(1, 130), mk(2, 131, [IconSwap, IconGlobe])],
];

const Row = ({ it }: { it: Item }) => (
  <a href="#" className="group flex items-center gap-4 border-b border-dashed border-line py-3 last:border-0">
    <span className="grid size-10 shrink-0 place-items-center rounded border border-line-2 text-stone transition-colors duration-300 group-hover:border-stone group-hover:text-paper"><it.i /></span>
    <span>
      <span className="block leading-6">{it.t}</span>
      <span className="block text-[13px] text-muted">{it.d}</span>
    </span>
  </a>
);

const Col = ({ groups }: { groups: [string, Item[]][] }) => (
  <div>
    {groups.map(([h, list], i) => (
      <div key={h} className={i ? "mt-2 border-t border-line pt-4" : ""}>
        <h3 className="mb-3 text-[22px] font-light leading-8 md:text-[28px]">{h}</h3>
        {list.map((it) => <Row key={it.t} it={it} />)}
      </div>
    ))}
  </div>
);

export default function Products() {
  return (
    <section className="rule">
      <div className="wrap">
        <div className="inner py-14 md:py-[72px]">
          <h2 className="h2 mb-10">Lorem products</h2>
          <div className="grid gap-10 md:grid-cols-2 md:gap-24">
            <Col groups={left} />
            <Col groups={right} />
          </div>
        </div>
      </div>
    </section>
  );
}
