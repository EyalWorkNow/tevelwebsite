import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import { CtaBand, Reveal } from "@/components/ui";
import { StoryCard } from "@/components/pages/stories/StoryCard";
import { stories } from "@/components/pages/stories/data";

export const metadata: Metadata = seo("/customer-stories");

// Alternating wide/narrow rows on the 12-column grid, as in the reference.
const spans = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7"];

export default function CustomerStories() {
  return (
    <>
      <section className="wrap">
        <div className="inner flex flex-col gap-12 pt-10 md:gap-16 md:pt-20">
          <Reveal className="mx-auto flex max-w-[1083px] flex-col items-center gap-5 text-center">
            <h1 className="max-w-[660px] font-serif text-[34px] font-light leading-9 tracking-[-0.04em] md:text-[72px] md:leading-[72px]">איך זה נראה כשמתחילים מהבעיה</h1>
            <p className="text-base leading-6 tracking-[0.01em] text-stone-2 md:text-xl md:leading-8">תרחישים לדוגמה, להמחשה בלבד: מצבים טיפוסיים שאנחנו פוגשים בעסקים, ומה היינו ממפים ובונים</p>
          </Reveal>
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-12">
            {stories.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={(i % 2) * 80} className={spans[i % 4]}>
                <StoryCard {...s} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
