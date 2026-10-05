import { Fragment } from "react";
import type { Block, Run } from "./content";

function Runs({ runs }: { runs: Run[] }) {
  return runs.map((r, i) =>
    r.href ? (
      <a key={i} href={r.href} className="underline decoration-paper/50 underline-offset-[3px] transition-[text-decoration-color] duration-150 hover:decoration-paper">{r.t}</a>
    ) : r.b ? <strong key={i} className="font-medium">{r.t}</strong> : <Fragment key={i}>{r.t}</Fragment>,
  );
}

/* Full-bleed bordered table: breaks out of the 837px text column to ~1261px on desktop, scrolls on mobile. */
function Table({ head, rows }: { head: string[]; rows: Run[][][] }) {
  const three = head.length === 3;
  return (
    <div className="my-8 -ml-7 overflow-x-auto md:ml-0 md:relative md:left-1/2 md:w-[min(1261px,calc(100vw-48px))] md:-translate-x-1/2 md:overflow-visible">
      <table className="w-full min-w-[600px] border-separate border-spacing-0 overflow-hidden rounded-md border border-[#e4e2e4] text-start md:min-w-0">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} scope="col" className={`border-[#e4e2e4] px-4 py-[17px] text-base font-normal leading-6 ${i ? "border-s" : ""} ${three ? ["w-[36%]", "w-[22%]", ""][i] : i ? "" : "w-[21%]"}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className={`border-t border-[#e4e2e4] px-4 py-[17px] align-middle ${ci ? "border-s" : ""} ${three && ci === 2 ? "whitespace-pre-line text-[18px] leading-7 tracking-[0.01em]" : "text-base leading-[26px]"}`}>
                  <Runs runs={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const body = "text-base leading-6 tracking-[0.01em] md:text-[18px] md:leading-7";

export function LegalDoc({ blocks }: { blocks: Block[] }) {
  return (
    <div className={body}>
      {blocks.map((b, i) => {
        switch (b.k) {
          case "p":
            return <p key={i} className="mt-3 first:mt-0"><Runs runs={b.runs} /></p>;
          case "ul":
            return (
              <ul key={i} className="my-5 list-disc ps-8 marker:text-paper">
                {b.items.map((it, j) => <li key={j} className="mt-2 first:mt-0"><Runs runs={it} /></li>)}
              </ul>
            );
          case "h2":
            return <h2 key={i} id={b.id} className="mb-3 mt-5 scroll-mt-24 font-serif text-[25px] font-light leading-7 tracking-[-0.04em] md:text-[31px] md:leading-10">{b.text}</h2>;
          case "h3":
            return <h3 key={i} className="mb-3 mt-5 text-base leading-6 tracking-[0.01em] md:text-xl md:leading-8">{b.text}</h3>;
          case "table":
            return <Table key={i} head={b.head} rows={b.rows} />;
          case "hr":
            return <hr key={i} className="my-16 border-line" />;
        }
      })}
    </div>
  );
}
