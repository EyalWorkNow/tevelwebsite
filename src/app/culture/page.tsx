import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/ui";
import { Shell } from "@/components/pages/company/parts";
import { sentence, title, words } from "@/lib/lorem";

export const metadata: Metadata = { title: "Culture" };

// Each card: [title words, lead words, ...paragraph word counts] — mirrors the reference.
const values: number[][] = [[4, 7, 34, 28], [1, 4, 15, 36], [3, 6, 34, 66]];
const behaviours: number[][] = [[3, 4, 29, 15], [1, 3, 37, 39], [1, 3, 43, 39, 29]];

const body = "text-sm leading-5 tracking-[0.01em] md:text-base md:leading-6";

function Intro({ heading, lead, children, seed }: { heading: string; lead?: ReactNode; children: ReactNode; seed: number }) {
  return (
    <Reveal className="flex max-w-[768px] flex-col gap-5">
      <h2 className="font-serif text-2xl font-light leading-8 tracking-[-0.04em] md:text-[39px] md:leading-[44px]" id={`s${seed}`}>{heading}</h2>
      {lead}
      {children}
    </Reveal>
  );
}

function Card({ spec, seed, delay, link }: { spec: number[]; seed: number; delay: number; link?: boolean }) {
  const [t, lead, ...paras] = spec;
  return (
    <Reveal as="section" delay={delay} className="rounded-lg border border-line p-8 md:p-16">
      <div className="flex flex-col gap-3">
        <h3 className="font-serif text-xl font-light leading-7 md:text-[25px] md:leading-8 tracking-[-0.04em]">{title(t, seed)}</h3>
        <div className={`flex flex-col gap-5 ${body}`}>
          <span className="font-medium">{sentence(lead, seed + 1)}</span>
          {paras.map((n, i) => {
            const last = link && i === paras.length - 1;
            return (
              <span key={i}>
                {last ? (
                  <>
                    {sentence(6, seed + 9).slice(0, -1)}{" "}
                    <Link href="/about" className="underline underline-offset-2 transition-colors hover:text-stone">{words(3, seed + 3)}</Link>
                    . {sentence(n - 9, seed + i * 4 + 2)}
                  </>
                ) : (
                  sentence(n, seed + i * 4 + 2)
                )}
              </span>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}

export default function CulturePage() {
  return (
    <Shell>
      <div className="flex flex-col gap-12 md:gap-16">
        <div className="flex flex-col gap-5">
          <Reveal>
            <h1 className="font-serif text-[28px] font-semibold leading-8 tracking-[-0.04em] md:text-[49px] md:leading-[52px]">{title(7, 17)}</h1>
          </Reveal>
          <Reveal delay={80} className="flex flex-col gap-4 text-base leading-6 tracking-[0.01em] text-stone-2 md:gap-5 md:text-xl md:leading-8">
            <p>{sentence(17, 4)}</p>
            <p>{sentence(6, 5).slice(0, -1)} <em>{words(7, 6)}</em>. {sentence(9, 7)}</p>
            <p>{sentence(19, 8)}</p>
          </Reveal>
        </div>

        <hr className="border-line" />

        <Intro seed={1} heading={title(2, 12)} lead={<span className={body}><b className="font-medium">{title(2, 13)}</b> {words(7, 14)}.</span>}>
          <span className={body}>{sentence(36, 15)}</span>
        </Intro>

        <div className="grid gap-8 md:grid-cols-2 md:gap-16">
          {values.map((v, i) => <Card key={i} spec={v} seed={20 + i * 7} delay={(i % 2) * 80} />)}
        </div>

        <Intro seed={2} heading={title(2, 40)}>
          <p className={body}>{sentence(27, 41)}</p>
          <p className={body}>{sentence(14, 42).slice(0, -1)} <em>{words(1, 43)}</em> {words(15, 44)}.</p>
        </Intro>

        <div className="grid gap-8 md:grid-cols-2 md:gap-16">
          {behaviours.map((v, i) => <Card key={i} spec={v} seed={50 + i * 7} delay={(i % 2) * 80} link={i === 2} />)}
        </div>
      </div>
    </Shell>
  );
}
