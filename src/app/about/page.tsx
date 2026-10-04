import type { Metadata } from "next";
import { Reveal } from "@/components/ui";
import { ExploreCard, Shell } from "@/components/pages/company/parts";
import { sentence, title } from "@/lib/lorem";

export const metadata: Metadata = { title: "About" };

// Word counts mirror the reference prose: [lead-in words, body words]
const sections: { heading: string; paras: [number, number][] }[] = [
  { heading: title(3, 11), paras: [[0, 27], [0, 23]] },
  { heading: title(3, 12), paras: [[3, 13], [2, 16], [3, 14]] },
  { heading: title(4, 13), paras: [[6, 12], [4, 20], [4, 14], [4, 12]] },
];

const explore = [
  { title: title(2, 21), body: sentence(19, 31), href: "/team" },
  { title: title(2, 22), body: sentence(23, 32), href: "/culture" },
  { title: title(2, 23), body: sentence(13, 33) },
  { title: title(3, 24), body: sentence(25, 34) },
  { title: title(2, 25), body: sentence(15, 35) },
  { title: title(3, 26), body: sentence(18, 36) },
];

export default function AboutPage() {
  return (
    <>
      <Shell>
        <article className="mx-auto max-w-[820px] px-2 md:mt-8 md:px-0">
          <Reveal>
            <h1 className="font-serif text-[32px] font-light leading-9 tracking-[-0.04em] md:text-[49px] md:leading-[52px]">{title(3, 1)}</h1>
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-2 max-w-[748px] text-base leading-6 md:mt-5 tracking-[0.01em] text-stone-2 md:text-xl md:leading-8">{sentence(11, 2)}</p>
          </Reveal>
          <div className="mt-8">
            {sections.map((s, i) => (
              <Reveal key={i} delay={160 + i * 40}>
                <h2 className={`mb-8 font-serif text-[26px] font-light leading-8 tracking-[-0.04em] md:text-[31px] md:leading-10 ${i ? "mt-16" : ""}`}>{s.heading}</h2>
                {s.paras.map(([lead, body], j) => (
                  <p key={j} className="mt-3 text-sm leading-5 tracking-[0.01em] md:text-base md:leading-6">
                    {lead > 0 && <b className="font-medium">{sentence(lead, i * 10 + j + 40)} </b>}
                    {sentence(body, i * 10 + j + 50)}
                  </p>
                ))}
              </Reveal>
            ))}
          </div>
        </article>
      </Shell>

      <Shell rule className="grid gap-6">
        <Reveal><h2 className="h2">{title(2, 7)}</h2></Reveal>
        <ul className="grid gap-4 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
          {explore.map((c, i) => (
            <ExploreCard key={i} seed={i + 3} delay={i * 60} {...c} />
          ))}
        </ul>
      </Shell>
    </>
  );
}
