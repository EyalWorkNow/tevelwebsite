import { AnswersIndex, indexMetadata } from "@/components/answers/AnswerViews";

export const metadata = indexMetadata("en");

export default function Page() {
  return <AnswersIndex lang="en" />;
}
