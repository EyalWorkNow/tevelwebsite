import Link from "next/link";
import { Arrow } from "@/components/icons";

export function BackLink({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 whitespace-nowrap text-sm leading-[26px] text-stone-2 md:text-base transition-colors hover:text-paper">
      <Arrow width={14} height={14} className="rotate-180 transition-transform duration-300 group-hover:translate-x-0.5" />
      {children}
    </Link>
  );
}
