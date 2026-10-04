import { Arrow } from "./icons";

// Gradient "photos" — swap for real imagery later.
const stories = [
  { k: "Customer story", t: "How Harbor&Co cut label costs by a third in one quarter", g: "linear-gradient(135deg,#3b2a20,#a0643c 55%,#e2b07a)" },
  { k: "Podcast", t: "Rebuilding a 40-year-old forwarder on modern rails", g: "linear-gradient(135deg,#1d2433,#3f5a7a 50%,#b9c7d6)" },
  { k: "Blog", t: "What the new EU customs rules mean for your checkout", g: "linear-gradient(135deg,#232a22,#4f6b45 55%,#c9d3a8)" },
];

export default function Stories() {
  return (
    <section className="rule">
      <div className="wrap">
        <div className="inner py-14 md:py-[72px]">
          <div className="mb-10 flex items-end justify-between gap-6">
            <h2 className="h2">Moving the industry forward</h2>
            <a href="#" className="label hidden shrink-0 items-center gap-1.5 rounded-full border border-line-2 px-3.5 py-2 transition-colors hover:border-stone md:inline-flex">View all stories <Arrow /></a>
          </div>
          <div className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
            {stories.map((s) => (
              <a key={s.t} href="#" className="group w-[80%] shrink-0 snap-start md:w-auto">
                <div className="aspect-[337/190] overflow-hidden">
                  <div className="size-full transition-transform duration-500 group-hover:scale-[1.03]" style={{ background: s.g }} />
                </div>
                <div className="label mt-4 text-muted">{s.k}</div>
                <p className="mt-2 text-xl font-light leading-7 transition-colors group-hover:text-stone">{s.t}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
