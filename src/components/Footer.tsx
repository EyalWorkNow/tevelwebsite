import { Logo } from "./icons";

const cols: [string, string[]][] = [
  ["Product", ["Pricing", "Labels and rates", "Smart routing", "Tracking", "Returns", "Customs", "Warehousing"]],
  ["Company", ["About", "Team", "Careers", "Blog", "Press", "Contact"]],
  ["Legal", ["Privacy", "Cookies", "Terms", "Security", "Sustainability"]],
];

export default function Footer() {
  return (
    <footer className="rule">
      <div className="wrap">
        <div className="inner grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div className="text-[11px] leading-4 text-muted">
            <div className="mb-4 flex items-center gap-2 text-paper"><Logo /><span className="font-serif text-[22px]">Meridian</span></div>
            <p className="max-w-[230px]">Meridian is a fictional company used for this design study. Nothing here is a real offer.</p>
          </div>
          {cols.map(([h, l]) => (
            <div key={h}>
              <h3 className="label mb-4">{h}</h3>
              <ul className="space-y-2 text-[13px] text-stone">{l.map((x) => <li key={x}><a href="#" className="hover:text-paper">{x}</a></li>)}</ul>
            </div>
          ))}
          <div>
            <h3 className="label mb-4">Developers</h3>
            <ul className="space-y-2 text-[13px] text-stone">{["Sandbox", "Docs", "Changelog", "Status"].map((x) => <li key={x}><a href="#" className="hover:text-paper">{x}</a></li>)}</ul>
          </div>
        </div>
        <div className="inner flex flex-col justify-between gap-2 border-t border-line py-4 text-[11px] text-muted md:flex-row">
          <span>© 2026 Meridian (fictional)</span>
          <span>Design study — layout inspired by a public marketing site</span>
        </div>
      </div>
    </footer>
  );
}
