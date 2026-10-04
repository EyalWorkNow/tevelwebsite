import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Logos from "@/components/Logos";
import { Button, CtaBand, Eyebrow, Reveal } from "@/components/ui";
import { sentence, title, words } from "@/lib/lorem";

export const metadata: Metadata = { title: "Pricing" };

/* ---------- building blocks (measured from the reference: pricing_card / cardHeader / cardBody) ---------- */
function Card({ children, as: Tag = "div" }: { children: ReactNode; as?: "div" | "section" }) {
  return <Tag className="overflow-hidden rounded-xl border border-line bg-ink-2">{children}</Tag>;
}

function CardHeader({ heading, cta }: { heading: string; cta?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-x-3 gap-y-2 px-4 py-5 text-center md:flex-row md:justify-between md:text-left">
      <h3 className="text-base leading-6 md:text-[28px] md:leading-9">{heading}</h3>
      {cta && <Button variant="default" href="/contact/sales" arrow className="shrink-0 bg-ink">Talk to us</Button>}
    </div>
  );
}

function StepHeader({ n, heading, fee }: { n: string; heading: string; fee?: ReactNode }) {
  return (
    <div className="flex flex-col gap-x-3 gap-y-2 px-3 py-4 md:flex-row md:items-center md:justify-between md:px-4 md:py-5">
      <h3 className="flex items-baseline gap-2 text-base leading-6 md:gap-3.5 md:text-[28px] md:leading-9">
        <span className="font-mono text-muted">{n}</span>
        {heading}
      </h3>
      {fee && <p className="text-[13px] leading-5 text-muted md:shrink-0 md:text-base">{fee}</p>}
    </div>
  );
}

function CardBody({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 border-t border-line p-4 md:p-5">{children}</div>;
}

function Lead({ strong, rest }: { strong: string; rest: string }) {
  return <p className="font-light leading-6 text-muted"><span className="text-paper">{strong}</span> {rest}</p>;
}

function Note() {
  return (
    <div className="mt-4 text-center text-[13px] leading-[18px] text-muted">
      <p><span>*</span> {sentence(8, 70)}</p>
      <p><Link href="#" className="text-paper underline decoration-paper/60 underline-offset-2 transition-[text-decoration-color] duration-150 hover:decoration-paper">{title(2, 71)}</Link> {words(1, 72)}.</p>
    </div>
  );
}

function SectionHead({ heading, lede }: { heading: string; lede: string }) {
  return (
    <Reveal className="grid gap-3 text-center md:gap-4">
      <h2 className="h2">{heading}</h2>
      <p className="mx-auto max-w-[560px] text-lg font-light leading-6 text-stone md:text-xl md:leading-7">{lede}</p>
    </Reveal>
  );
}

const tile = "grid place-items-center content-center rounded-lg border border-line bg-ink/40 px-3 text-center transition-colors duration-300 hover:border-line-2";

/* ---------- page ---------- */
export default function PricingPage() {
  const packages: [string, string?][] = [["$3,500"], ["$5,000", `${title(1, 80)} 20%`], ["$10,000", `${title(1, 80)} 40%`], [title(1, 81), title(1, 82)]];
  const categories = [title(1, 90), title(1, 91), title(1, 92)];

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="wrap">
          <div className="inner flex flex-col items-center gap-6 py-16 text-center md:gap-8 md:py-[120px]">
            <Reveal><Eyebrow>Pricing</Eyebrow></Reveal>
            <Reveal delay={80}>
              <h1 className="max-w-[576px] font-serif text-[34px] font-light leading-[34px] tracking-[-0.05em] md:text-5xl md:leading-[48px]">
                {title(5, 1)}. <span className="text-stone">{title(6, 2)}.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}><p className="max-w-[616px] text-lg font-light leading-6 md:text-xl md:leading-7">{sentence(11, 3)}</p></Reveal>
            <Reveal delay={240}><Button variant="default" href="/contact/sales" arrow className="bg-ink">Let&apos;s chat</Button></Reveal>
          </div>
        </div>
      </section>

      <Logos />

      {/* Business banking */}
      <section className="rule">
        <div className="wrap">
          <div className="grid gap-6 px-3 py-14 md:px-10 md:py-20">
            <SectionHead heading={title(2, 10)} lede={sentence(6, 11).slice(0, -1)} />
            <div className="mx-auto flex w-full max-w-[768px] flex-col gap-5">
              <Reveal>
                <Card>
                  <CardHeader heading={title(3, 12)} cta />
                  <CardBody>
                    <dl className="grid">
                      {[[title(2, 13), "From $100"], [title(2, 14), "From 1.75%*"]].map(([k, v], i) => (
                        <div key={k} className={`flex justify-between gap-6 ${i ? "border-t border-line pt-4" : "pb-4"}`}>
                          <dt className="font-light leading-6 text-muted">{k}</dt>
                          <dd className="whitespace-nowrap leading-6">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardBody>
                </Card>
              </Reveal>
              <Note />
            </div>
          </div>
        </div>
      </section>

      {/* Platform banking */}
      <section className="rule">
        <div className="wrap">
          <div className="grid gap-6 px-3 py-14 md:px-10 md:py-20">
            <SectionHead heading={title(2, 20)} lede={sentence(7, 21).slice(0, -1)} />
            <div className="mx-auto flex w-full max-w-[768px] flex-col gap-5">
              <ol className="flex flex-col gap-5">
                <Reveal as="li">
                  <Card as="section">
                    <StepHeader n="01" heading={title(3, 22)} fee={<>{title(3, 23)}, from <span className="text-paper">$15,000</span></>} />
                    <CardBody><Lead strong={sentence(5, 24)} rest={sentence(5, 25)} /></CardBody>
                  </Card>
                </Reveal>
                <Reveal as="li">
                  <Card as="section">
                    <StepHeader n="02" heading={title(4, 26)} />
                    <CardBody>
                      <Lead strong={sentence(4, 27)} rest={sentence(5, 28)} />
                      <ul className="grid grid-cols-2 gap-2 md:grid-cols-4">
                        {packages.map(([v, sub]) => (
                          <li key={v} className={`${tile} h-[82px] md:h-[82px]`}>
                            <span className="leading-6">{v}</span>
                            {sub && <span className="text-sm leading-6 text-muted">{sub}</span>}
                          </li>
                        ))}
                      </ul>
                    </CardBody>
                  </Card>
                </Reveal>
                <Reveal as="li">
                  <Card as="section">
                    <StepHeader n="03" heading={title(3, 30)} />
                    <CardBody>
                      <Lead strong={sentence(8, 31)} rest={`${sentence(6, 32).slice(0, -1)} 1.75% *`} />
                      <ul className="grid gap-2 md:grid-cols-3">
                        {categories.map((c) => <li key={c} className={`${tile} h-[58px]`}>{c}</li>)}
                      </ul>
                    </CardBody>
                  </Card>
                </Reveal>
              </ol>
              <Reveal>
                <Card as="section"><CardHeader heading={title(5, 34)} cta /></Card>
              </Reveal>
              <Note />
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
