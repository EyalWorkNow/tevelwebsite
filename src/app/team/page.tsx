import type { Metadata } from "next";
import { Placeholder, Reveal } from "@/components/ui";
import { CenterHeading, PhotoMarquee, Shell } from "@/components/pages/company/parts";
import { sentence, words } from "@/lib/lorem";

export const metadata: Metadata = { title: "Team" };

const cap = (s: string) => s.replace(/\b\w/g, (m) => m.toUpperCase());

// [role words, bio words] per person — mirrors the reference word counts.
const leadership: [number, number][] = [[4, 38], [4, 35], [3, 49], [3, 50], [3, 38], [4, 32], [3, 40], [3, 34]];
const board: [number, number][] = [[4, 44], [3, 36], [2, 46], [2, 50], [2, 40], [2, 44], [3, 38], [2, 42], [2, 36]];

function Member({ seed, role, bio, delay }: { seed: number; role: number; bio: number; delay: number }) {
  return (
    <Reveal as="li" delay={delay} className="flex items-start gap-5 md:gap-8">
      <Placeholder seed={seed} label={`Portrait ${seed}`} className="aspect-[3/4] w-24 shrink-0 rounded-xl bg-ink-2 md:w-40" />
      <div className="min-w-0 flex-1">
        <h3 className="text-base leading-6 md:text-xl md:leading-7">{cap(words(2, seed * 3 + 5))}</h3>
        <p className="text-sm font-light leading-5 text-stone md:text-base md:leading-6">{cap(words(role, seed + 17))}</p>
        <p className="mt-2 max-w-[414px] text-sm font-light leading-5">
          {sentence(Math.round(bio * 0.85) - 3, seed * 2 + 9)} {seed % 3 === 0 ? <em>{sentence(3, seed + 4)}</em> : sentence(3, seed + 4)}
        </p>
      </div>
    </Reveal>
  );
}

function Grid({ people, start }: { people: [number, number][]; start: number }) {
  return (
    <ul className="mx-auto mt-6 grid w-full max-w-[960px] gap-10 md:grid-cols-2 md:gap-12">
      {people.map(([role, bio], i) => (
        <Member key={i} seed={start + i} role={role} bio={bio} delay={(i % 2) * 80} />
      ))}
    </ul>
  );
}

export default function TeamPage() {
  return (
    <>
      <section className="wrap">
        <div className="inner flex justify-center pb-6 pt-12 md:py-20">
          <Reveal>
            <h1 className="max-w-[576px] text-center font-serif text-[32px] font-light leading-9 tracking-[-0.05em] md:text-[48px] md:leading-[48px]">{sentence(3, 2).slice(0, -1)}</h1>
          </Reveal>
        </div>
      </section>

      <PhotoMarquee />

      <Shell pad="py-10 md:py-20">
        <CenterHeading>{cap(words(1, 6))}</CenterHeading>
        <Grid people={leadership} start={1} />
      </Shell>

      <Shell pad="py-10 md:py-20">
        <CenterHeading>{cap(words(2, 8))}</CenterHeading>
        <Grid people={board} start={20} />
      </Shell>
    </>
  );
}
