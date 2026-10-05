import { Button, CtaBand, Reveal } from "@/components/ui";
import { slugs } from "@/lib/site";
import { solutions, type SolutionContent } from "./content";
import { Block, CenteredHero, FeatureList, Heading, HeroBadge, LearnCard } from "./parts";

/** Two-column text block: serif title, bold lead-ins, outline button. */
function Column({ col, delay }: { col: SolutionContent["columns"][number]; delay: number }) {
  return (
    <Reveal delay={delay} className="flex flex-col items-start gap-5">
      <Heading>{col.title}</Heading>
      <div className="flex flex-col gap-4 font-light leading-6 text-muted">
        {col.points.map((pt, k) => (
          <p key={k}>
            <strong className="font-medium text-paper">{pt.lead}.</strong>{" "}
            {pt.body}
          </p>
        ))}
      </div>
      <Button variant="default" href={col.button.href} arrow>{col.button.label}</Button>
    </Reveal>
  );
}

export default function SolutionPage({ index }: { index: number }) {
  const s = 200 + index * 13; // per-slug seed (feature icons only)
  const c = solutions[slugs.solutions[index]];

  return (
    <>
      <CenteredHero
        eyebrow={c.hero.eyebrow}
        heading={c.hero.heading}
        lede={c.hero.lede}
        primary={c.hero.primary}
        secondary={c.hero.secondary}
        extra={<HeroBadge title={c.badge.title} body={c.badge.body} link={c.badge.link} />}
      />

      <Block rule={false}>
        <h2 className="sr-only">{c.featuresTitle}</h2>
        <FeatureList seed={s + 5} items={c.features} />
      </Block>

      <Block>
        <div className="grid gap-14 md:grid-cols-2 md:gap-10">
          <Column col={c.columns[0]} delay={0} />
          <Column col={c.columns[1]} delay={120} />
        </div>
      </Block>

      <Block>
        <Reveal><Heading className="max-w-[640px]">{c.cardsTitle}</Heading></Reveal>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.cards.map((card, i) => (
            <Reveal as="li" key={i} delay={i * 80}>
              <LearnCard href={card.href} heading={card.title} body={card.body} />
            </Reveal>
          ))}
        </ul>
      </Block>

      <CtaBand text={c.cta.text} cta={c.cta.label} />
    </>
  );
}
