import { Arrow } from "./icons";
import { Placeholder } from "./ui";
import Link from "next/link";
import { slugs, names } from "@/lib/site";

// Gradient "photos" — swap for real imagery later.
const stories = [
  { k: "תרחיש לדוגמה", t: names.stories[0], href: `/customer-stories/${slugs.stories[0]}`, seed: 0 },
  { k: "Insight", t: names.posts[1], href: `/blog/${slugs.posts[1]}`, seed: 1 },
  { k: "Insight", t: names.posts[4], href: `/blog/${slugs.posts[4]}`, seed: 2 },
];

export default function Stories() {
  return (
    <section className="rule">
      <div className="wrap">
        <div className="inner py-14 md:py-[72px]">
          <div className="mb-10 flex items-end justify-between gap-6">
            <h2 className="h2">איך זה נראה בפועל</h2>
            <Link href="/blog" className="label hidden shrink-0 items-center gap-1.5 rounded-full border border-line-2 px-3.5 py-2 transition-colors hover:border-stone md:inline-flex">לכל ה-Insights <Arrow /></Link>
          </div>
          <div className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
            {stories.map((s) => (
              <Link key={s.t} href={s.href} className="group w-[80%] shrink-0 snap-start md:w-auto">
                <div className="aspect-[337/190] overflow-hidden">
                  <Placeholder seed={s.seed} className="size-full transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="label mt-4 text-muted">{s.k}</div>
                <p className="mt-2 text-xl font-light leading-7 transition-colors group-hover:text-stone">{s.t}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
