import { Button, CtaBand, Reveal } from "@/components/ui";
import { Glyph } from "@/components/icons";
import { slugs } from "@/lib/site";
import { products } from "./content";
import { Block, CenteredHero, FeatureList, Heading } from "@/components/pages/solutions/parts";

const marks = ["frame", "spark", "globe", "swap", "pulse", "lock"];

/** Capability strip under the ASCII band — neutral labels, not logos. */
function Wordmarks({ seed, labels }: { seed: number; labels: string[] }) {
  return (
    <div className="wrap">
      <ul className="grid grid-cols-3 border-x border-line">
        {[0, 1, 2].map((i) => (
          <li key={i} className={`flex h-12 items-center justify-center gap-1.5 text-paper md:h-16 ${i ? "border-s border-line" : ""}`}>
            <Glyph name={marks[(seed + i) % marks.length]} width={16} height={16} strokeWidth={2} />
            <span className="text-[15px] font-semibold tracking-[-0.03em] md:text-lg">{labels[i]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Original line icon: checklist. */
const ChecklistIcon = () => (
  <svg viewBox="0 0 32 32" width={32} height={32} fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 8.5l1.8 1.8L10 7M5 16.5l1.8 1.8L10 15M5 24.5l1.8 1.8L10 23M14 9h13M14 17h13M14 25h13" />
  </svg>
);

/** Neutral badge: plain circle + mono label. */
const BadgeStub = ({ label }: { label: string }) => (
  <span aria-hidden className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-stone">
    <span className="size-5 rounded-full border border-line-2 bg-ink-2" />
    {label}
  </span>
);

export default function ProductPage({ index }: { index: number }) {
  const s = 400 + index * 17; // per-slug seed (icons only)
  const c = products[slugs.products[index]];

  return (
    <>
      <CenteredHero
        eyebrow={c.hero.eyebrow}
        heading={c.hero.heading}
        lede={c.hero.lede}
        primary={c.hero.primary}
        secondary={c.hero.secondary}
        wideLede
        after={<Wordmarks seed={s + 3} labels={c.marks} />}
      />

      {/* Highlights: two halves with a centre rule */}
      <section className="border-t border-line">
        <div className="wrap">
          <div className="grid md:grid-cols-2">
            {[0, 1].map((k) => (
              <Reveal key={k} delay={k * 120} className={`inner py-12 md:py-20 ${k ? "border-t border-line max-md:-mx-4 max-md:px-10 md:border-s md:border-t-0" : ""}`}>
                <Glyph name={k ? "spark" : "swap"} width={32} height={32} strokeWidth={1.1} />
                <h2 className="mt-2 font-serif text-[28px] font-light leading-8 tracking-[-0.05em] md:text-[32px] md:leading-9">{c.highlights[k].title}</h2>
                <p className="mt-4 max-w-[493px] font-light leading-6">{c.highlights[k].body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Block>
        <Reveal><Heading className="max-w-[640px]">{c.featuresTitle}</Heading></Reveal>
        <div className="mt-6"><FeatureList seed={s + 11} items={c.features} /></div>
      </Block>

      {/* Editorial list: title left, caption right, dashed separators */}
      <Block>
        <Reveal><Heading className="max-w-[640px]">{c.listTitle}</Heading></Reveal>
        <ul className="mt-6">
          {c.list.map((row, i) => (
            <Reveal as="li" key={i} className={`grid gap-2 md:grid-cols-2 md:gap-x-10 ${i ? "border-t border-dashed border-line pt-6 md:pt-8" : ""} pb-6 md:pb-8`}>
              <h3 className="text-2xl font-light leading-[1.2] md:text-[28px]">{row.title}</h3>
              <p className="max-w-[394px] font-light leading-[22.4px]">{row.body}</p>
            </Reveal>
          ))}
          <Reveal as="li" className="grid gap-2 border-t border-dashed border-line pt-6 md:grid-cols-2 md:gap-x-10 md:pt-8">
            <p className="max-w-[460px] font-light leading-6 text-stone">{c.note[0]}<br />{c.note[1]}</p>
            <div className="pt-1 md:pt-0"><Button variant="default" href={c.noteButton.href}>{c.noteButton.label}</Button></div>
          </Reveal>
        </ul>
      </Block>

      <CtaBand text={c.cta.text} cta={c.cta.label} href={c.cta.href} />

      {/* Eligibility / protection pair */}
      <section className="border-t border-line">
        <div className="wrap">
          <div className="grid md:grid-cols-2">
            {[0, 1].map((k) => (
              <Reveal key={k} delay={k * 120} className={`inner py-12 md:py-20 ${k ? "border-t border-line max-md:-mx-4 max-md:px-10 md:border-s md:border-t-0" : ""}`}>
                {k ? <Glyph name="shield" width={32} height={32} strokeWidth={1.1} /> : <ChecklistIcon />}
                <Heading className="mt-3">{c.pair[k].title}</Heading>
                <p className="mt-2 max-w-[394px] font-light leading-[22.4px]">{c.pair[k].body}</p>
                <div className="mt-5 flex items-center gap-4">
                  <Button variant="default" href={c.pair[k].button.href}>{c.pair[k].button.label}</Button>
                  {k === 1 && <BadgeStub label={c.pair[1].badge} />}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
