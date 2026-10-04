import { Button, CtaBand, Reveal } from "@/components/ui";
import { sentence, title, words } from "@/lib/lorem";
import { slugs } from "@/lib/site";
import { Block, CenteredHero, FeatureList, Heading, HeroBadge, LearnCard } from "./parts";

/** Two-column text block: serif title, bold lead-ins, outline button. */
function Column({ seed, delay }: { seed: number; delay: number }) {
  return (
    <Reveal delay={delay} className="flex flex-col items-start gap-5">
      <Heading>{title(2 + (seed % 2), seed)}</Heading>
      <div className="flex flex-col gap-4 font-light leading-6 text-muted">
        {[0, 1].map((k) => (
          <p key={k}>
            <strong className="font-medium text-paper">{title(3 + ((seed + k) % 2), seed + 11 * (k + 1))}.</strong>{" "}
            {sentence(10 + ((seed + k * 3) % 8), seed + 5 + k * 9)}
          </p>
        ))}
      </div>
      <Button variant="default" href={`/products/${slugs.products[seed % slugs.products.length]}`} arrow>{words(2, seed + 3)}</Button>
    </Reveal>
  );
}

export default function SolutionPage({ index }: { index: number }) {
  const s = 200 + index * 13; // per-slug seed so every page reads differently
  const cardWords = [1, 5, 5, 1];
  const bodyWords = [12, 6, 8, 9];
  const cardHrefs = ["/pricing", `/blog/${slugs.posts[index % slugs.posts.length]}`, `/blog/${slugs.posts[(index + 1) % slugs.posts.length]}`, "/onboarding"];

  return (
    <>
      <CenteredHero
        eyebrow={words(3, s)}
        heading={sentence(9, s + 1).slice(0, -1)}
        lede={sentence(14, s + 2)}
        extra={<HeroBadge seed={s + 3} />}
      />

      <Block rule={false}>
        <h2 className="sr-only">{title(2, s + 4)}</h2>
        <FeatureList seed={s + 5} />
      </Block>

      <Block>
        <div className="grid gap-14 md:grid-cols-2 md:gap-10">
          <Column seed={s + 6} delay={0} />
          <Column seed={s + 7} delay={120} />
        </div>
      </Block>

      <Block>
        <Reveal><Heading className="max-w-[640px]">{title(6, s + 8)}</Heading></Reveal>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cardWords.map((n, i) => (
            <Reveal as="li" key={i} delay={i * 80}>
              <LearnCard href={cardHrefs[i]} heading={i === 0 ? "Pricing" : i === 3 ? title(1, s + 30) : title(n, s + 9 + i * 4)} body={sentence(bodyWords[i], s + 20 + i * 6)} />
            </Reveal>
          ))}
        </ul>
      </Block>

      <CtaBand />
    </>
  );
}
