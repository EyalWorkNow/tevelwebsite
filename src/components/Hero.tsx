import AsciiField from "./AsciiField";
import { Arrow } from "./icons";

export default function Hero() {
  return (
    <section className="wrap relative -mt-16">
      <div className="flex min-h-[700px] flex-col justify-end md:min-h-[950px]">
        <div className="inner grid gap-6 pb-10 pt-32 md:grid-cols-2 md:items-end">
          <div>
            <h1 className="display">
              <span className="block">Freight that</span>
              <span className="block">runs on code</span>
            </h1>
            <p className="mt-6 max-w-[616px] text-lg font-light leading-7 md:text-xl">
              Quote, book and track shipments across every carrier from a single API.{" "}
              <span className="text-muted">Spend your sprints on product, not on carrier integrations and paperwork.</span>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#" className="btn-light">Start building <Arrow /></a>
              <a href="#" className="btn-dark">Talk to us</a>
            </div>
          </div>
          <a href="#" className="group label hidden items-center gap-3 justify-self-end text-sm tracking-[0.06em] transition-colors duration-300 hover:text-muted md:flex">
            <span className="grid size-4 place-items-center rounded-full bg-line-2"><span className="size-1.5 rounded-full bg-paper" /></span>
            Read our 2026 network report
            <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </div>
        <div className="h-[180px] md:h-[252px]"><AsciiField /></div>
      </div>
    </section>
  );
}
