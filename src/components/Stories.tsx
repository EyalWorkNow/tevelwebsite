import { Arrow } from "./icons";
import Link from "next/link";
import ScrollSplitCard, { type ScrollSplitCardItem } from "./ScrollSplitCard";

const cards: [ScrollSplitCardItem, ScrollSplitCardItem, ScrollSplitCardItem] = [
  {
    label: "BUSINESS SYSTEMS",
    title: "כל העסק, בתמונה אחת",
    description: "לקוחות, משימות ותפעול במערכת אחת. בלי לרדוף אחרי אקסלים ובלי לאבד מידע בדרך.",
    href: "/solutions/business-systems",
    accent: "var(--color-teal)",
    preview: "system",
  },
  {
    label: "AUTOMATION",
    title: "התהליך ממשיך מעצמו",
    description: "פנייה נכנסת, משימה נפתחת והצוות מתעדכן. מחברים את הכלים כדי שהעבודה תתקדם.",
    href: "/products/integrations",
    accent: "var(--color-brand)",
    preview: "workflow",
  },
  {
    label: "APPLIED AI",
    title: "המידע הופך לפעולה",
    description: "מענה ללקוחות, עיבוד מסמכים וחיפוש בידע הארגוני. AI שמחובר לעבודה האמיתית שלכם.",
    href: "/products/ai-for-business",
    accent: "var(--color-violet)",
    preview: "assistant",
  },
];

export default function Stories() {
  return (
    <section className="rule" aria-labelledby="stories-heading">
      <div className="wrap">
        <div className="inner pt-14 md:pt-[72px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="label mb-4 text-brand">מהרעיון לעבודה היומיומית</p>
              <h2 id="stories-heading" className="h2">איך זה נראה בפועל</h2>
              <p className="mt-4 max-w-lg text-base leading-7 text-stone-2">מערכות, אוטומציות ו-AI. שלוש דרכים להפוך עומס לתהליך שעובד.</p>
            </div>
            <Link href="/customer-stories" className="label inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line-2 px-3.5 py-2 transition-colors hover:border-stone">לתרחישים לדוגמה <Arrow /></Link>
          </div>
          <ScrollSplitCard cards={cards} />
        </div>
      </div>
    </section>
  );
}
