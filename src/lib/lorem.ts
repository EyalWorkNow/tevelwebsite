// Deterministic lorem ipsum — same seed, same text, so SSR and client match.
const W = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");

/** `n` words starting at an offset derived from `seed`. */
export function words(n: number, seed = 0): string {
  const out: string[] = [];
  for (let i = 0; i < n; i++) out.push(W[(seed * 7 + i * 3 + Math.floor(i / W.length)) % W.length]);
  return out.join(" ");
}

/** Sentence case, trailing period. */
export function sentence(n: number, seed = 0): string {
  const s = words(n, seed);
  return s[0].toUpperCase() + s.slice(1) + ".";
}

/** Title case-ish heading without period. */
export function title(n: number, seed = 0): string {
  const s = words(n, seed);
  return s[0].toUpperCase() + s.slice(1);
}

export function paragraph(sentences = 3, seed = 0): string {
  return Array.from({ length: sentences }, (_, i) => sentence(8 + ((seed + i) % 7), seed + i * 5)).join(" ");
}
