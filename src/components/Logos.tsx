// Fictional customer wordmarks rendered as text — no third-party logos.
const names = [
  ["Harbor&Co", "font-serif italic text-xl"],
  ["NORTHLINE", "font-mono tracking-[0.2em] text-sm"],
  ["kestrel", "font-sans font-semibold text-lg lowercase"],
  ["Ostra Freight", "font-sans font-light text-lg"],
  ["PALLETIQ", "font-sans font-black tracking-tight text-lg"],
  ["Drift", "font-serif text-2xl"],
  ["cargonaut", "font-mono text-sm"],
  ["Loop/Mile", "font-sans font-medium text-lg"],
  ["Tessera", "font-serif italic text-xl"],
  ["AXLE·9", "font-mono font-bold text-sm"],
];

const Cell = ({ n }: { n: number }) => (
  <div className="grid h-[52px] place-items-center border-b border-r border-dashed border-line text-stone-2 opacity-80 transition-opacity duration-300 hover:opacity-100">
    <span className={names[n][1]}>{names[n][0]}</span>
  </div>
);

export default function Logos() {
  return (
    <section className="rule">
      <div className="wrap">
        <div className="grid grid-cols-2 border-l border-dashed border-line md:mx-[60px] md:grid-cols-6">
          <Cell n={0} /><Cell n={1} />
          <div className="label col-span-2 grid h-[52px] place-items-center border-b border-r border-dashed border-line text-muted">
            <span>Trusted by <span className="text-paper">120+ shippers</span></span>
          </div>
          <Cell n={2} /><Cell n={3} />
          {[4, 5, 6, 7, 8, 9].map((n) => <Cell key={n} n={n} />)}
        </div>
      </div>
    </section>
  );
}
