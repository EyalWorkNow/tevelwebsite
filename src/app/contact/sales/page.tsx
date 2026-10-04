import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui";
import { SalesForm } from "@/components/pages/contact/Form";
import { sentence, title, words } from "@/lib/lorem";

export const metadata: Metadata = { title: "Contact sales" };

export default function ContactSalesPage() {
  return (
    <div className="mt-10 mb-10 flex flex-col items-center gap-10 md:my-16 md:gap-16">
      <header className="flex max-w-[820px] flex-col items-center gap-3 px-5 text-center md:gap-5">
        <div className="flex max-w-[748px] flex-col gap-3 md:gap-5">
          <Reveal><h1 className="font-serif text-[34px] font-light leading-10 tracking-[-0.04em] md:text-[72px] md:leading-[72px]">{title(3, 60)}</h1></Reveal>
          <Reveal delay={80}><p className="leading-6 tracking-[0.01em] text-stone-2 md:text-xl md:leading-8">{sentence(11, 61)} {sentence(11, 62)}</p></Reveal>
        </div>
        <Reveal delay={160}>
          <p className="text-[13px] leading-4 text-stone-2">
            {sentence(11, 63).slice(0, -1)} <Link href="#" className="text-paper underline underline-offset-2">{words(2, 64)}</Link>.
          </p>
        </Reveal>
      </header>
      <div className="w-full max-w-[642px] px-4">
        <Reveal><div className="p-6 md:p-10"><SalesForm /></div></Reveal>
      </div>
    </div>
  );
}
