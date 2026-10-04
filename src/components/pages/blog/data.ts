import { slugs } from "@/lib/site";
import { paragraph, sentence, title, words } from "@/lib/lorem";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const monthsLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

/** Fake, strictly descending dates so the index reads like a real archive. */
export function fakeDate(i: number) {
  const m = 11 - ((i * 2) % 12);
  const y = 2026 - Math.floor((i * 2) / 12);
  const d = 28 - ((i * 5) % 26);
  return { short: `${d} ${months[m]} ${y}`, long: `${days[i % 5]}, ${d} ${monthsLong[m]} ${y}` };
}

export const author = (seed: number) => title(2, 90 + seed).replace(/ (\w)/, (_, c) => " " + c.toUpperCase());

export type PostCard = { slug: string; href: string; seed: number; date: string; author: string; title: string; excerpt: string; art: "photo" | "mark" | "grid" };

const arts: PostCard["art"][] = ["photo", "mark", "photo", "grid", "photo", "photo", "mark", "photo", "grid"];

/** 15 cards; hrefs cycle through the six real post slugs. */
export const posts: PostCard[] = Array.from({ length: 15 }, (_, i) => {
  const seed = i + 3;
  const slug = slugs.posts[i % slugs.posts.length];
  return {
    slug,
    href: `/blog/${slug}`,
    seed,
    date: fakeDate(i + 1).short,
    author: author(i % 4),
    title: title(7 + ((i * 5) % 9), 200 + seed * 3),
    excerpt: sentence(18 + (i % 4) * 2, 300 + seed),
    art: arts[i % arts.length],
  };
});

export const featured = {
  href: `/blog/${slugs.posts[0]}`,
  title: title(7, 11),
  lede: sentence(22, 12),
  date: fakeDate(0).short,
  author: author(0),
};

/** Article body: sections of h3 + 2–5 paragraphs, matching the reference rhythm. */
export function article(slug: string) {
  const i = Math.max(0, slugs.posts.indexOf(slug));
  const s = 400 + i * 37;
  const shape = [3, 3, 3, 4, 4][i % 5];
  const counts = [5, 3, 3, 4, 4, 3].slice(0, shape + 1);
  return {
    title: title(5 + (i % 3), s),
    lede: sentence(28 + (i % 4) * 2, s + 1),
    author: author(i % 4),
    date: fakeDate(i).long,
    seed: i + 1,
    sections: counts.map((n, k) => ({
      heading: title(3 + ((k + i) % 4), s + 10 + k * 7),
      paras: Array.from({ length: n }, (_, j) => paragraph(3 + ((k + j + i) % 3), s + 20 + k * 11 + j * 3)),
    })),
  };
}

export const wordmark = (seed: number) => words(1, 500 + seed * 3);
