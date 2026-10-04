import { Arrow, Check } from "./icons";

const points = [
  ["Designed API-first", "Predictable REST resources with JSON everywhere"],
  ["Docs you can trust", "Every endpoint documented with runnable examples"],
  ["Event-sourced core", "An append-only log behind every shipment state"],
  ["Built to scale", "Multi-region, horizontally scaled infrastructure"],
  ["Open sandbox", "Test with real carrier responses, no contract needed"],
];

export default function Developers() {
  return (
    <section className="rule">
      <div className="wrap">
        <div className="inner grid gap-10 py-14 md:grid-cols-2 md:gap-6 md:py-0">
          <div className="md:py-[72px]">
            <h2 className="h2">Build your first shipment today</h2>
            <ul className="mt-10 space-y-5">
              {points.map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-1 shrink-0 text-mint" />
                  <div><div className="leading-6">{t}</div><div className="text-sm text-muted">{d}</div></div>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#" className="btn-light">Get API keys <Arrow /></a>
              <a href="#" className="btn-dark">Read the docs</a>
            </div>
          </div>

          <div className="relative grid min-h-[560px] place-items-center overflow-hidden md:-mr-10"
            style={{ background: "linear-gradient(180deg,#6e8db0 0%,#b9cde0 45%,#e9eef2 70%,#7d8b97 100%)" }}>
            <div className="w-[360px] max-w-[88%] space-y-2 font-mono text-xs">
              <div className="rounded-md border border-line bg-ink p-3">
                <div className="text-muted">// CREATE SHIPMENT</div>
                <div className="mt-3 font-sans text-[10px] text-muted">Destination</div>
                <div className="flex items-center gap-2 font-sans text-2xl">Lyon, FR <Check className="text-mint" /></div>
              </div>
              <div className="rounded-md border border-line bg-ink p-3">
                <div className="flex justify-between text-muted"><span>// REQUEST</span><span>+</span></div>
                <pre className="mt-3 overflow-x-auto leading-5">
<span className="text-paper">curl</span> <span className="text-stone">https://api.meridian.dev/v1/shipments</span>{"\n"}
<span className="text-rose">  -H</span> <span className="text-stone">{`"Authorization: Bearer $MERIDIAN_KEY"`}</span>{"\n"}
<span className="text-rose">  -d</span> <span className="text-stone">{`'{`}</span>{"\n"}
<span className="text-muted">{`    "from": "NL-3011",`}</span>{"\n"}
<span className="text-muted">{`    "to": "FR-69002",`}</span>{"\n"}
<span className="text-muted">{`    "weight_kg": 4.2`}</span>{"\n"}
<span className="text-stone">{`  }'`}</span>
                </pre>
              </div>
              <div className="flex justify-between rounded-md border border-line bg-ink p-3 text-muted"><span>// RESPONSE</span><span>+</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
