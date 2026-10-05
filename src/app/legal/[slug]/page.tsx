import { trimDesc } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { slugs } from "@/lib/site";
import { buildLegal } from "@/components/pages/legal/content";
import { LegalDoc } from "@/components/pages/legal/LegalDoc";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return slugs.legal.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const i = slugs.legal.indexOf(slug);
  if (i < 0) return {};
  const d = buildLegal(i);
  return { title: d.heading, description: trimDesc(d.lede), alternates: { canonical: `/legal/${slug}` } };
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  const i = slugs.legal.indexOf(slug);
  if (i < 0) notFound();
  const { heading, lede, blocks } = buildLegal(i);

  return (
    <div className="wrap">
      <div className="px-3 pb-20 pt-12 md:px-10 md:pt-20">
        {/* 3-col grid as in the reference: empty rails either side of an 837px article column */}
        <div className="lg:grid lg:grid-cols-[1fr_minmax(0,837px)_1fr] lg:gap-8">
          <article className="flex flex-col gap-8 lg:col-start-2">
            <header className="flex flex-col items-center gap-5 text-center">
              <p className="text-sm text-amber">טיוטה — יש להשלים פרטים ולבדוק משפטית לפני פרסום</p>
              <h1 className="font-serif text-[40px] font-light leading-[44px] tracking-[-0.04em] md:text-[49px] md:leading-[52px]">{heading}</h1>
              <p className="max-w-[748px] text-lg leading-7 tracking-[0.01em] text-stone-2 md:text-xl md:leading-8">{lede}</p>
            </header>
            <LegalDoc blocks={blocks} />
          </article>
        </div>
      </div>
    </div>
  );
}
