import { IconBox, IconRoute, IconShield, IconStack, IconWarehouse, IconScan, IconSwap, IconGlobe } from "./icons";
import type { ComponentType } from "react";

type Item = { i: ComponentType; t: string; d: string };
const left: [string, Item[]][] = [["Shipping", [
  { i: IconBox, t: "Labels and rates", d: "Compare and buy postage from every carrier" },
  { i: IconRoute, t: "Smart routing", d: "Rules that pick the best lane per order" },
  { i: IconShield, t: "Shipment protection", d: "Cover loss and damage at checkout" },
  { i: IconStack, t: "Batch operations", d: "Thousands of labels in one request" },
]]];
const right: [string, Item[]][] = [
  ["Fulfilment", [{ i: IconWarehouse, t: "Warehouse network", d: "Store inventory close to your customers" }]],
  ["Visibility", [{ i: IconScan, t: "Tracking", d: "Normalised events from every carrier" }]],
  ["Cross-border", [{ i: IconSwap, t: "Returns", d: "Labels, refunds and restocking in one flow" }, { i: IconGlobe, t: "Customs", d: "Duties, taxes and documents, pre-filled" }]],
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
          <h2 className="h2 mb-10">What you can build</h2>
          <div className="grid gap-10 md:grid-cols-2 md:gap-24">
            <Col groups={left} />
            <Col groups={right} />
          </div>
        </div>
      </div>
    </section>
  );
}
