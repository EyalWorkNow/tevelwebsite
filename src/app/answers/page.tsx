import { AnswersIndex, indexMetadata } from "@/components/answers/AnswerViews";

export const metadata = indexMetadata("he");

export default function Page() {
  return <AnswersIndex lang="he" />;
}
