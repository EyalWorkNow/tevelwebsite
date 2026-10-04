import type { Metadata } from "next";
import Link from "next/link";
import { Placeholder, Reveal } from "@/components/ui";
import { Arrow } from "@/components/icons";
import { paragraph, sentence, title, words } from "@/lib/lorem";

export const metadata: Metadata = { title: "Onboarding" };

type Item = { title: string; body: string; cta?: string };
type Group = { heading: string; sub: string; items: Item[] };

// Item / group counts and text lengths mirror the reference page.
const shape: [number, number[], (string | null)[], number[]][] = [
  // [heading words, item title words, ctas, item body words]
  [4, [4, 2, 5], [null, null, null], [11, 24, 11]],
  [3, [4, 4, 3], ["Lorem ipsum", "Lorem ipsum", "Dolor sit"], [8, 9, 29]],
  [5, [1, 1, 4, 2, 4, 2], ["Amet elit", "Sed do", "Tempor ut", "Magna aliqua", "Lorem ipsum", "Veniam quis"], [9, 8, 7, 5, 8, 8]],
  [3, [4, 3, 1], ["Tempor ut", "Nisi aliquip", null], [14, 11, 12]],
  [3, [2], ["Lorem ipsum"], [10]],
];

const groups: Group[] = shape.map(([hw, tws, ctas, bws], g) => ({
  heading: title(hw, 30 + g * 4),
  sub: sentence(4 + (g % 3), 50 + g * 3),
  items: tws.map((tw, i) => ({ title: title(tw + 1, 70 + g * 9 + i * 2), body: sentence(bws[i], 90 + g * 7 + i * 3), cta: ctas[i] ?? undefined })),
}));

function GuideButton({ children }: { children: string }) {
  return (
    <Link
      href="#"
      className="group inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-lg bg-paper px-5 font-mono text-base uppercase leading-4 text-ink-2 transition-colors duration-300 hover:bg-paper-2 md:mb-3 md:self-center"
    >
      {children}
      <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5" />
    </Link>
  );
}

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-12 pb-20 pt-16 md:px-20 md:pt-[100px]">
      {/* Intro: copy left, photo right */}
      <section className="grid gap-12 md:grid-cols-2 md:gap-5">
        <div className="flex flex-col gap-3 md:gap-5">
          <Reveal>
            <h1 className="font-serif text-[30px] leading-9 tracking-[-0.04em] md:text-[49px] md:leading-[52px]">{title(2, 11)}</h1>
          </Reveal>
          {[3, 3, 2].map((n, i) => (
            <Reveal key={i} delay={80 + i * 60}>
              <p className="text-base leading-6 tracking-[0.01em] text-stone-2 md:text-xl md:leading-8">{paragraph(n === 3 ? 2 : 1, 12 + i * 4)}</p>
            </Reveal>
          ))}
          <Reveal delay={260}>
            <p className="text-base leading-6 tracking-[0.01em] text-stone-2 md:text-xl md:leading-8">{sentence(3, 40)}</p>
          </Reveal>
        </div>
        <Reveal delay={120} className="md:pt-[7px]">
          <Placeholder seed={2} className="aspect-[3/2] w-full" label={words(3, 5)} />
        </Reveal>
      </section>

      {/* Audience groups */}
      <div className="mt-16 flex flex-col gap-16 md:mt-32 md:gap-32">
        {groups.map((g, gi) => (
          <section key={gi} className="grid gap-10 md:grid-cols-2 md:gap-5">
            <Reveal>
              <div className="flex max-w-[400px] flex-col gap-2 md:gap-5">
                <h2 className="font-serif text-[30px] leading-9 tracking-[-0.04em] md:text-[49px] md:leading-[52px]">{g.heading}</h2>
                <p className="text-base leading-6 tracking-[0.01em] text-stone-2 md:text-xl md:leading-8">{g.sub}</p>
              </div>
            </Reveal>
            <ul className="flex flex-col gap-8">
              {g.items.map((it, i) => (
                <Reveal as="li" key={i} delay={i * 60} className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                  <div className={`flex flex-col gap-2.5 md:gap-3 ${it.cta ? "md:max-w-[400px]" : ""}`}>
                    <h3 className="text-base leading-6 tracking-[0.01em] md:text-xl md:leading-8">{it.title}</h3>
                    <p className="text-sm leading-5 tracking-[0.01em] text-stone-2 md:text-base md:leading-6">{it.body}</p>
                  </div>
                  {it.cta && <GuideButton>{it.cta}</GuideButton>}
                </Reveal>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
