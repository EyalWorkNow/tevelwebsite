import { slugs } from "@/lib/site";
import { paragraph, sentence, title, words } from "@/lib/lorem";

export const brand = (i: number) => words(1, 700 + i * 5);

export const stories = slugs.stories.map((slug, i) => ({
  slug,
  href: `/customer-stories/${slug}`,
  seed: i + 1,
  brand: brand(i),
  title: sentence(12 + ((i * 3) % 5), 720 + i * 9).replace(/\.$/, ""),
}));

type Block =
  | { t: "h2" | "h4"; text: string }
  | { t: "p"; text: string }
  | { t: "ul"; items: { lead: string; text: string }[] }
  | { t: "quote"; text: string; by: string }
  | { t: "img"; seed: number };

/** Story body mirrors the reference sequence: quote, vision, challenge (list), solution with sub-heads + figures, closing quotes. */
export function story(slug: string) {
  const i = Math.max(0, slugs.stories.indexOf(slug));
  const s = 800 + i * 41;
  const by = `${title(2, s + 90)}, ${title(3, s + 91)}`;
  const body: Block[] = [
    { t: "quote", text: `“${paragraph(4, s)}”`, by },
    { t: "h2", text: title(9, s + 2) },
    { t: "p", text: paragraph(3, s + 3) },
    { t: "p", text: paragraph(4, s + 4) },
    { t: "p", text: paragraph(4, s + 5) },
    { t: "h2", text: title(6, s + 6) },
    { t: "p", text: paragraph(2, s + 7) },
    { t: "ul", items: [{ lead: title(5, s + 8), text: paragraph(2, s + 9) }, { lead: title(3, s + 10), text: paragraph(3, s + 11) }] },
    { t: "h2", text: title(9 + (i % 3), s + 12) },
    { t: "p", text: paragraph(2, s + 13) },
    { t: "h4", text: title(4, s + 14) },
    { t: "p", text: paragraph(3, s + 15) },
    { t: "img", seed: i + 2 },
    { t: "p", text: paragraph(2, s + 16) },
    { t: "h4", text: title(2, s + 17) },
    { t: "p", text: paragraph(4, s + 18) },
    { t: "img", seed: i + 3 },
    { t: "h4", text: title(3, s + 19) },
    { t: "p", text: paragraph(2, s + 20) },
    { t: "quote", text: `“${paragraph(3, s + 21)}”`, by },
    { t: "h2", text: title(13, s + 22) },
    { t: "p", text: paragraph(3, s + 23) },
    { t: "p", text: paragraph(3, s + 24) },
    { t: "quote", text: `“${paragraph(2, s + 25)}”`, by: title(2, s + 92) },
  ];
  return {
    ...stories[i],
    lede: sentence(18 + (i % 3) * 2, s + 30),
    industry: title(2, s + 31),
    body,
  };
}
