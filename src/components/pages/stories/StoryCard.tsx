import Link from "next/link";
import { Placeholder } from "@/components/ui";
import { Arrow } from "@/components/icons";
import { Wordmark } from "./Wordmark";

export function StoryCard({ href, seed, brand, title }: { href: string; seed: number; brand: string; title: string }) {
  return (
    <Link href={href} className="group relative block h-[360px] overflow-hidden rounded-2xl text-white md:h-[440px]">
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"><Placeholder seed={seed} className="size-full" /></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/5 to-black/75" />
      <div className="relative flex h-full flex-col justify-between px-6 py-5 md:px-8">
        <Wordmark name={brand} seed={seed} />
        <div>
          <h3 className="mb-3 max-w-[700px] text-xl font-medium leading-[1.3] md:text-2xl">{title}</h3>
          <span className="flex items-center gap-2 font-mono text-sm uppercase opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:translate-y-1">
            לקריאת התרחיש <Arrow width={15} height={15} className="transition-transform duration-300 group-hover:-translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
