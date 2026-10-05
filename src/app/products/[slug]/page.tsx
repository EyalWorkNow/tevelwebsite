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
  return { title: names.products[slugs.products.indexOf(slug)] };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = slugs.products.indexOf(slug);
  if (index < 0) notFound();
  return <ProductPage index={index} />;
}
