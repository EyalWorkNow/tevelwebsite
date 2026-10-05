import { notFound } from "next/navigation";
import { answerBySlug } from "@/lib/answers";
import { AnswerPage, answerMetadata, answerSlugs } from "@/components/answers/AnswerViews";

export const dynamicParams = false;
export const generateStaticParams = answerSlugs;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const a = answerBySlug((await params).slug);
  return a ? answerMetadata(a, "en") : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const a = answerBySlug((await params).slug);
  if (!a) notFound();
  return <AnswerPage a={a} lang="en" />;
}
