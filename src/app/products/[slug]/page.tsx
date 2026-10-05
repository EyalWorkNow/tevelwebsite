import { productTitles, trimDesc, OG_IMAGES } from "@/lib/seo";
import { products } from "@/components/pages/products/content";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductPage from "@/components/pages/products/ProductPage";
import { names, slugs } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return slugs.products.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = products[slug];
  return { title: productTitles[slug] ?? names.products[slugs.products.indexOf(slug)], description: c ? trimDesc(c.hero.lede) : undefined, alternates: { canonical: `/products/${slug}` }, openGraph: { url: `/products/${slug}`, images: OG_IMAGES } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = slugs.products.indexOf(slug);
  if (index < 0) notFound();
  return <ProductPage index={index} />;
}
