import Link from "next/link";
import { Placeholder } from "@/components/ui";
import type { PostCard } from "./data";

/** Faint blueprint grid with corner ticks, used behind the graphic covers. */
function Blueprint() {
  return (
    <>
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="absolute inset-[6%] rounded-md border border-white/10" />
      {["left-[6%] top-[6%]", "right-[6%] top-[6%]", "left-[6%] bottom-[6%]", "right-[6%] bottom-[6%]"].map((p) => (
        <span key={p} className={`absolute ${p} -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] leading-none text-white/30`}>+</span>
      ))}
    </>
  );
}

const marks = ["#a78bfa", "#3ad4c4", "#f35c95", "#e5b53a"];

export function Cover({ card }: { card: Pick<PostCard, "art" | "seed" | "tag" | "word"> }) {
  const { art, seed, tag, word } = card;
  if (art === "photo") return <div className="absolute inset-0"><Placeholder seed={seed} className="size-full" /></div>;
  if (art === "mark")
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]">
        <Blueprint />
        <span className="relative flex items-center gap-3 text-[clamp(28px,3vw,40px)] font-semibold tracking-[-0.03em] text-white">
          <svg viewBox="0 0 24 32" className="h-[1.05em] w-auto" aria-hidden><path d="M14 0L2 18h9l-3 14L22 12h-9z" fill={marks[seed % marks.length]} /></svg>
          {tag}
        </span>
      </div>
    );
  const q = seed % 4;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a1a1a]">
      <Blueprint />
      <span className="relative text-center leading-[0.95] text-white">
        <span className="block text-[clamp(28px,3vw,40px)] font-semibold tracking-[-0.03em]">{tag}</span>
        <span className="block font-serif text-[clamp(30px,3.2vw,44px)] font-light tracking-[-0.03em]">{word}</span>
      </span>
      <span dir="ltr" className="relative mt-4 flex gap-2 font-mono text-[clamp(16px,1.6vw,22px)]">
        {["01", "02", "03", "04"].map((l, k) => (
          <span key={l} className={`rounded-md border px-2 py-0.5 ${k === q ? "border-transparent bg-violet text-white" : "border-white/10 text-white/15"}`}>{l}</span>
        ))}
      </span>
    </div>
  );
}

export function BlogCard({ card }: { card: PostCard }) {
  return (
    <Link href={card.href} className="group block rounded-xl px-0 py-4 transition-colors duration-300 md:px-3 md:hover:bg-ink-2/60">
      <div className="relative mb-3 aspect-[405/228] overflow-hidden rounded-xl bg-[#1a1a1a]">
        <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-[1.03]"><Cover card={card} /></div>
      </div>
      <div className="flex flex-col">
        <div className="mb-2 flex items-center gap-2 text-sm leading-[22px] text-muted">
          <span>{card.date}</span><span aria-hidden className="text-[10px]">•</span><span>{card.author}</span>
        </div>
        <h3 className="mb-2.5 line-clamp-3 font-serif text-xl font-light leading-7 text-paper">{card.title}</h3>
        <p className="line-clamp-2 leading-[22.4px] text-muted">{card.excerpt}</p>
      </div>
    </Link>
  );
}
