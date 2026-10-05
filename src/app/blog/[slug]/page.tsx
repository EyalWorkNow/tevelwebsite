import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { slugs } from "@/lib/site";
import { Placeholder, Reveal } from "@/components/ui";
import { BackLink } from "@/components/pages/blog/BackLink";
import { article } from "@/components/pages/blog/data";

export function generateStaticParams() {
  return slugs.posts.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: article(slug).title };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slugs.posts.includes(slug)) notFound();
  const a = article(slug);
  return (
    <section className="wrap">
      <div className="inner grid grid-cols-1 gap-8 pb-20 pt-10 md:pt-20 lg:grid-cols-[1fr_minmax(0,837px)_1fr]">
        <div><BackLink href="/blog">חזרה ל-Insights</BackLink></div>
        <article className="flex flex-col gap-8">
          <Reveal className="flex flex-col items-center gap-5 text-center">
            <h1 className="max-w-[640px] font-serif text-[30px] font-light leading-8 tracking-[-0.04em] md:text-[49px] md:leading-[52px]">{a.title}</h1>
            <p className="max-w-[748px] text-base leading-6 tracking-[0.01em] text-stone-2 md:text-xl md:leading-8">{a.lede}</p>
          </Reveal>
          <Reveal delay={80} className="flex items-center gap-5">
            <Placeholder seed={a.seed + 2} className="size-10 shrink-0 rounded-full bg-line" />
            <div className="leading-6 tracking-[0.01em]">
              <p>{a.author}</p>
              <p className="text-stone-2">{a.date}</p>
            </div>
          </Reveal>
          <Reveal delay={140} as="div">
            <figure className="relative aspect-[837/502] overflow-hidden rounded-xl"><div className="absolute inset-0"><Placeholder seed={a.seed} className="size-full" /></div></figure>
          </Reveal>
          <div className="text-base leading-6 tracking-[0.01em] md:text-[18px] md:leading-8">
            {a.sections.map((s, k) => (
              <div key={k}>
                <h3 className={`mb-3 font-serif text-[25px] font-light leading-8 tracking-[-0.04em] ${k ? "mt-5" : ""}`}>{s.heading}</h3>
                {s.paras.map((p, j) => <p key={j} className={j ? "mt-3" : ""}>{p}</p>)}
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
