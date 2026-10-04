import { ArrowUpRight } from "./icons";

const cards = [
  ["Pricing", "Pay per label. Volume discounts kick in automatically."],
  ["Sandbox", "Real carrier responses, zero charges, no commitment."],
  ["Documentation", "Guides and references for every endpoint."],
  ["Go-live checklist", "Everything you need before your first real parcel."],
];

export default function Speed() {
  return (
    <section className="rule">
      <div className="wrap">
        <div className="inner py-14 md:py-[72px]">
          <h2 className="h2">Ready when you are</h2>
          <p className="mt-4 max-w-[420px] font-light leading-6 text-stone">
            Sign up and send a test shipment in minutes. No demo call, no trial clock, no paperwork.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(([t, d]) => (
              <a key={t} href="#" className="group flex min-h-[150px] flex-col justify-between rounded border border-line p-4 transition-colors duration-300 hover:border-line-2 hover:bg-ink-2">
                <div className="flex justify-between"><span className="text-lg font-light">{t}</span><ArrowUpRight className="text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper" /></div>
                <p className="mt-8 text-sm text-muted">{d}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
