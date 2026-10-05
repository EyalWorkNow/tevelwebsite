import { trimDesc } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { slugs } from "@/lib/site";
import { CtaBand, Placeholder, Reveal } from "@/components/ui";
import { BackLink } from "@/components/pages/blog/BackLink";
import { Wordmark } from "@/components/pages/stories/Wordmark";
import { story, LABEL } from "@/components/pages/stories/data";

export function generateStaticParams() {
  return slugs.stories.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = story(slug);
  return { title: `${s.brand} · תרחיש לדוגמה`, description: trimDesc(`${LABEL}. ${s.lede ?? ""}`), alternates: { canonical: `/customer-stories/${slug}` } };
}

const Crosshairs = () => (
  <>
    {["left-[5%] top-[6%]", "left-1/2 top-[6%]", "left-[95%] top-[6%]", "left-[5%] top-1/2", "left-[5%] top-[94%]", "left-1/2 top-[94%]", "left-[95%] top-[94%]"].map((p) => (
      <span key={p} className={`absolute ${p} -translate-x-1/2 -translate-y-1/2 text-sm font-light leading-none text-white/70`}>+</span>
    ))}
  </>
);

export default async function Story({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slugs.stories.includes(slug)) notFound();
  const s = story(slug);
  return (
    <>
      <section className="wrap">
        <div className="inner grid grid-cols-1 gap-8 pb-10 pt-10 md:pt-20 lg:grid-cols-[1fr_minmax(0,837px)_1fr]">
          <div><BackLink href="/customer-stories">חזרה לתרחישים לדוגמה</BackLink></div>
          <article className="flex flex-col gap-12 md:gap-16">
            <Reveal className="flex flex-col items-center gap-5 text-center">
              <h1 className="font-serif text-[30px] font-light leading-8 tracking-[-0.04em] md:text-[49px] md:leading-[52px]">{s.title}</h1>
              <p className="max-w-[748px] text-base leading-6 tracking-[0.01em] text-stone-2 md:text-xl md:leading-8">{s.lede}</p>
            </Reveal>
            <Reveal delay={80}>
              <figure className="relative aspect-[2.1/1] overflow-hidden rounded-lg">
                <div className="absolute inset-0"><Placeholder seed={s.seed} className="size-full" /></div>
                <div className="absolute inset-0 bg-black/15" />
                <Crosshairs />
                <Wordmark name={s.brand} seed={s.seed} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(36px,7vw,80px)] text-white" />
              </figure>
            </Reveal>
            <div className="flex gap-16 text-base leading-6 md:text-lg tracking-[0.01em]">
              <div>
                <p className="font-medium">סוג ארגון</p>
                <a href="/onboarding" className="text-stone-2 underline decoration-line-2 underline-offset-4 transition-colors hover:decoration-stone-2">{s.org}</a>
              </div>
              <div>
                <p className="font-medium">תחום</p>
                <p className="text-stone-2">{s.industry}</p>
              </div>
            </div>
            <div className="text-base leading-6 tracking-[0.01em] md:text-lg md:leading-7">
              {s.body.map((b, k) => {
                const first = k === 0;
                switch (b.t) {
                  case "quote":
                    return (
                      <figure key={k} className={first ? "" : "mt-8"}>
                        <blockquote className="ps-8 text-xl font-light leading-6 tracking-[0.01em] text-stone md:text-[25px] md:leading-8">{b.text}</blockquote>
                        <figcaption className="my-5 flex gap-2 pb-8 ps-8 text-base leading-4 text-stone-2"><span aria-hidden>—</span>{b.by}</figcaption>
                      </figure>
                    );
                  case "h2":
                  case "h4": {
                    const H = b.t;
                    return <H key={k} className={`${b.t === "h4" ? "mt-8" : "mt-5"} mb-3 font-serif text-[26px] font-light leading-8 tracking-[-0.04em] md:text-[31px] md:leading-10`}>{b.text}</H>;
                  }
                  case "p":
                    return <p key={k} className={s.body[k - 1]?.t === "p" || s.body[k - 1]?.t === "img" ? "mt-3" : ""}>{b.text}</p>;
                  case "ul":
                    return (
                      <ul key={k} className="my-5 list-disc ps-8 marker:text-paper">
                        {b.items.map((it, j) => <li key={j} className={j ? "mt-2" : ""}><strong className="font-medium">{it.lead}</strong>: {it.text}</li>)}
                      </ul>
                    );
                  case "img":
                    return <div key={k} className="relative mt-3 aspect-[837/438] overflow-hidden rounded-lg"><div className="absolute inset-0"><Placeholder seed={b.seed} className="size-full" /></div></div>;
                }
              })}
            </div>
          </article>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
