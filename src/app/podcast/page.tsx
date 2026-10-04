import type { Metadata } from "next";
import { CtaBand, Reveal } from "@/components/ui";
import { paragraph, sentence, title, words } from "@/lib/lorem";
import { EpisodeList, PlatformButton, type Episode } from "@/components/pages/podcast/Episodes";

export const metadata: Metadata = { title: "Podcast" };

const COUNT = 14;
const episodes: Episode[] = Array.from({ length: COUNT }, (_, i) => {
  const n = 40 - i;
  return {
    n: String(n).padStart(3, "0"),
    guest: words(i % 4 === 3 ? 4 : 2, 200 + i * 5).toUpperCase(),
    title: title(4 + (i % 4), 120 + i * 6),
    body: paragraph(i % 3 === 2 ? 3 : 2, 300 + i * 4),
    date: `${String(28 - (i * 2) % 27).padStart(2, "0")}.${String(12 - (i % 12)).padStart(2, "0")}.2026`,
    duration: 28 + ((i * 17) % 40),
    seed: i,
  };
});

export default function PodcastPage() {
  return (
    <>
    <div className="mx-auto max-w-[1400px] px-7 pt-10 md:px-10 md:pt-20">
      <section className="flex flex-col items-center text-center">
        <Reveal>
          <h1 className="font-serif text-[32px] leading-10 tracking-[-0.04em] md:text-[72px] md:leading-[72px]">{title(2, 4)}</h1>
        </Reveal>
        <div className="mt-2 flex max-w-[748px] flex-col gap-3 md:mt-5 md:gap-5">
          <Reveal delay={80}>
            <p className="text-base leading-6 tracking-[0.01em] text-stone-2 md:text-xl md:leading-8">{sentence(19, 8)}</p>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-base leading-6 tracking-[0.01em] text-stone-2 md:text-xl md:leading-8">{sentence(27, 15)}</p>
          </Reveal>
        </div>
        <Reveal delay={200} className="mt-8 flex flex-col items-center gap-3.5 md:flex-row md:gap-5">
          <PlatformButton label="Watch lorem ipsum" glyph="play" />
          <PlatformButton label="Listen dolor sit" glyph="wave" />
          <PlatformButton label="Listen amet elit" glyph="rss" />
        </Reveal>
      </section>

      <section className="mt-16 md:mt-24">
        <Reveal>
          <h2 className="pb-5 text-center font-serif text-[30px] leading-9 tracking-[-0.04em] md:pb-8 md:text-[49px] md:leading-[52px]">{title(2, 22)}</h2>
        </Reveal>
        <EpisodeList episodes={episodes} />
      </section>
    </div>
    <CtaBand />
    </>
  );
}
