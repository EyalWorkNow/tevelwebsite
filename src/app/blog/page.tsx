import type { Metadata } from "next";
import Link from "next/link";
import { Placeholder, Reveal } from "@/components/ui";
import { BlogCard } from "@/components/pages/blog/Card";
import { featured, posts } from "@/components/pages/blog/data";

export const metadata: Metadata = { title: "Insights" };

export default function BlogIndex() {
  return (
    <section className="wrap">
      <div className="inner flex flex-col gap-10 pb-20 pt-10 md:gap-16 md:pt-20">
        <Reveal><h1 className="font-serif text-[36px] font-light leading-10 tracking-[-0.05em] md:text-5xl md:leading-[48px]">Insights</h1></Reveal>

        <Reveal delay={80}>
          <Link href={featured.href} className="group grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-5">
            <div className="relative aspect-[334/188] overflow-hidden rounded-xl md:order-2 md:col-span-7 md:aspect-auto md:h-[400px] md:rounded-[32px]">
              <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.02]"><Placeholder seed={1} className="size-full" /></div>
            </div>
            <div className="flex flex-col gap-4 md:order-1 md:col-span-5 md:gap-8">
              <span className="label self-start rounded-lg border border-line-2 px-3 py-1.5 text-[11px] leading-4">מומלץ</span>
              <div className="flex flex-col gap-3">
                <h2 className="font-serif text-[26px] font-light leading-[30px] tracking-[-0.04em] md:text-[39px] md:leading-[44px]">{featured.title}</h2>
                <p className="hidden text-xl leading-8 tracking-[0.01em] text-stone-2 md:block">{featured.lede}</p>
                <p className="mb-2 flex items-center gap-2 text-sm leading-6 tracking-[0.01em] text-muted md:text-base">
                  <span>{featured.date}</span><span aria-hidden className="text-[10px]">•</span><span>{featured.author}</span>
                </p>
              </div>
            </div>
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={i} delay={(i % 3) * 60}><BlogCard card={p} /></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
