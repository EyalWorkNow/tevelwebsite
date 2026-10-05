import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SolutionPage from "@/components/pages/solutions/SolutionPage";
import { names, slugs } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return slugs.solutions.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: names.solutions[slugs.solutions.indexOf(slug)] };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = slugs.solutions.indexOf(slug);
  if (index < 0) notFound();
  return <SolutionPage index={index} />;
}
