import { IconBox, IconRoute, IconShield, IconStack, IconWarehouse, IconScan, IconSwap, IconGlobe } from "./icons";
import type { ComponentType } from "react";
import { slugs, names } from "@/lib/site";

type Item = { i: ComponentType; t: string; d: string; href: string };
const it = (k: number, i: ComponentType): Item => ({ i, t: names.products[k], d: names.productsDesc[k], href: `/products/${slugs.products[k]}` });
const left: [string, Item[]][] = [["פיתוח מערכות", [it(0, IconBox), it(1, IconRoute), it(2, IconStack), it(5, IconShield)]]];
const right: [string, Item[]][] = [
  ["Intelligence", [it(3, IconScan)]],
  ["חיבורים", [it(4, IconSwap)]],
  ["המוצר שלנו", [it(6, IconWarehouse), { i: IconGlobe, t: "R&D & Custom Technology", d: "כשאין עדיין פתרון מוכן", href: "/solutions/rd" }]],
];

const Row = ({ it }: { it: Item }) => (
  <a href={it.href} className="group flex items-center gap-4 border-b border-dashed border-line py-3 last:border-0">
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
          <h2 className="h2 mb-10">תחומי הפעילות</h2>
          <div className="grid gap-10 md:grid-cols-2 md:gap-24">
            <Col groups={left} />
            <Col groups={right} />
          </div>
        </div>
      </div>
    </section>
  );
}
