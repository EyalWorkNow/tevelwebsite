import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui";
import CurrencyField from "@/components/pages/reports/CurrencyField";
import { sentence, title, words } from "@/lib/lorem";

export const metadata: Metadata = { title: "Annual reports" };

type Doc = { name: string; body: string };
const years: { year: number; docs: Doc[]; padded: boolean }[] = [2025, 2024, 2023].map((year, k) => ({
  year,
  padded: k !== 1,
  docs: [
    { name: title(5, 3), body: sentence(22, 5) },
    k === 2 ? { name: title(3, 12), body: sentence(18, 14) } : { name: title(3, 8), body: sentence(10, 9) },
  ],
}));

export default function ReportsPage() {
  return (
    <>
      <section className="wrap">
        <div className="inner flex flex-col items-center gap-8 pb-10 pt-10 text-center md:py-20">
          <Reveal><h1 className="font-serif text-[36px] font-light leading-10 tracking-[-0.05em] md:text-[48px] md:leading-[48px]">{title(2, 40)}</h1></Reveal>
          <Reveal delay={80}><p className="max-w-[616px] text-lg font-light leading-6 md:text-xl md:leading-7">{sentence(13, 41)}</p></Reveal>
        </div>
      </section>
      <div className="h-[180px] border-y border-line md:h-32"><CurrencyField /></div>

      {years.map(({ year, docs, padded }) => (
        <section key={year} className="wrap">
          <div className="inner py-16 md:py-20">
            <div className={`grid gap-y-8 md:grid-cols-12 px-2 md:gap-x-5 md:px-8 ${padded ? "md:py-16" : ""}`}>
              <Reveal className="flex flex-col gap-5 md:col-span-5">
                <h2 className="font-serif text-[32px] font-light leading-9 tracking-[-0.04em] md:text-[49px] md:leading-[52px]">{year}</h2>
                <p className="max-w-[400px] text-base leading-6 tracking-[0.01em] text-stone-2 md:text-xl md:leading-8">
                  {sentence(7, 44).slice(0, -1)} 30 {words(1, 45)} {year}.
                </p>
              </Reveal>
              <ul className="grid gap-8 md:col-span-6 md:col-start-7">
                {docs.map((d, i) => (
                  <Reveal as="li" key={d.name} delay={80 + i * 80} className="grid gap-x-5 gap-y-3 md:grid-cols-[minmax(0,400px)_1fr]">
                    <h3 className="text-base leading-6 tracking-[0.01em] md:col-span-2 md:text-xl md:leading-8">{d.name}</h3>
                    <p className="text-sm leading-5 tracking-[0.01em] text-stone-2 md:text-base md:leading-6">{d.body}</p>
                    <Link
                      href="#"
                      className="mt-2 inline-flex h-11 items-center self-center justify-self-start rounded-lg bg-paper px-5 font-mono text-base uppercase leading-4 text-ink-2 transition-[background-color,box-shadow] duration-200 hover:bg-paper-2 hover:shadow-[inset_0_0_0_1px_#c2bcb2] md:mt-0 md:justify-self-end"
                    >
                      {words(2, 50)}
                    </Link>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
