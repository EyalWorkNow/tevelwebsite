import { ArrowUpRight } from "./icons";
import { sentence, title } from "@/lib/lorem";

const cards = [0, 1, 2, 3].map((i) => [title(1 + (i % 2), 170 + i * 2), sentence(9, 175 + i)]);

export default function Speed() {
  return (
    <section className="rule">
      <div className="wrap">
        <div className="inner py-14 md:py-[72px]">
          <h2 className="h2">Lorem for speed</h2>
          <p className="mt-4 max-w-[420px] font-light leading-6 text-stone">
            {sentence(22, 180)}
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
