import { paragraph, sentence, title, words } from "@/lib/lorem";

// Block model mirroring the reference's long-form rhythm: h2 / h3 / p / ul / table / hr.
export type Run = { t: string; b?: boolean; href?: string };
export type Block =
  | { k: "p"; runs: Run[] }
  | { k: "ul"; items: Run[][] }
  | { k: "h2"; text: string; id: string }
  | { k: "h3"; text: string }
  | { k: "table"; head: string[]; rows: Run[][][] }
  | { k: "hr" };

/** Small deterministic PRNG so every slug gets its own (but stable) shape. */
function rng(seed: number) {
  let s = (seed * 9301 + 49297) % 233280 || 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, "-");

export function buildLegal(index: number): { heading: string; lede: string; blocks: Block[] } {
  const r = rng(index + 3);
  const int = (a: number, b: number) => a + Math.floor(r() * (b - a + 1));
  let seed = 100 + index * 97;
  const nx = () => (seed += 13);

  const para = (): Block => {
    const runs: Run[] = [{ t: paragraph(int(2, 4), nx()) }];
    if (r() < 0.15) runs.push({ t: " " + sentence(3, nx()).slice(0, -1) + " " }, { t: words(2, nx()), href: "#" }, { t: "." });
    return { k: "p", runs };
  };
  const list = (lead = r() < 0.6): Block => ({
    k: "ul",
    items: Array.from({ length: int(2, 6) }, () =>
      lead ? [{ t: title(int(1, 3), nx()) + ".", b: true }, { t: " " + paragraph(int(1, 2), nx()) }] : [{ t: sentence(int(5, 14), nx()) }],
    ),
  });
  const table = (): Block => {
    const cols = r() < 0.5 ? 2 : 3;
    const head = Array.from({ length: cols }, () => title(int(2, 4), nx()));
    const rows = Array.from({ length: int(4, 7) }, () =>
      Array.from({ length: cols }, (_, c) =>
        c === cols - 1 && cols === 3
          ? Array.from({ length: int(1, 3) }, (_, j) => [{ t: (j ? "\n" : "") + title(int(1, 2), nx()) + ".", b: true }, { t: " " + sentence(int(9, 20), nx()) }]).flat()
          : [{ t: c === 0 ? sentence(int(3, 18), nx()) : cols === 2 ? sentence(int(8, 26), nx()) : title(int(2, 6), nx()).replace(/ /g, ", ") }],
      ),
    );
    return { k: "table", head, rows };
  };

  const blocks: Block[] = [];
  // Intro: short lead + bulleted overview, as in the reference
  blocks.push({ k: "p", runs: [{ t: sentence(int(4, 8), nx()) }] }, list(true), para(), list(false), para());

  const parts = int(2, 4);
  let tablesLeft = int(1, 3);
  for (let p = 0; p < parts; p++) {
    if (p > 0) blocks.push({ k: "hr" });
    const sections = int(2, 4);
    for (let s = 0; s < sections; s++) {
      const h = title(int(2, 5), nx());
      blocks.push({ k: "h2", text: h, id: `${slugify(h)}-${p}-${s}` });
      for (let i = int(1, 3); i > 0; i--) blocks.push(para());
      if (r() < 0.45) blocks.push(list());
      for (let sub = int(0, 3); sub > 0; sub--) {
        blocks.push({ k: "h3", text: title(int(2, 7), nx()) });
        for (let i = int(1, 3); i > 0; i--) blocks.push(para());
        if (r() < 0.4) blocks.push(list());
      }
      if (tablesLeft > 0 && r() < 0.35) {
        tablesLeft--;
        blocks.push(para(), table(), para());
      }
    }
  }
  if (tablesLeft > 0 && !blocks.some((b) => b.k === "table")) blocks.splice(8, 0, table());
  blocks.push({ k: "hr" }, { k: "h2", text: title(int(3, 5), nx()), id: "closing" }, para());

  return { heading: title(index % 3 === 2 ? 3 : 2, 300 + index * 11), lede: sentence(int(20, 34), 400 + index * 17), blocks };
}
