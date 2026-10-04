import Link from "next/link";
import type { ReactNode } from "react";
import { Placeholder, Reveal } from "@/components/ui";
import { Arrow } from "@/components/icons";
import { paragraph, sentence, title, words } from "@/lib/lorem";
import { CIcon } from "./icons";

/* ---------- shells ---------- */
function Shell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className="wrap">
      <div className={`inner py-10 md:py-20 ${className}`}>{children}</div>
    </section>
  );
}
const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="text-center font-serif text-[32px] font-light leading-9 tracking-[-0.05em] md:text-[40px] md:leading-[44px]">{children}</h2>
);
const IconBox = ({ name }: { name: string }) => (
  <span className="mb-3 grid size-11 place-items-center rounded-[12px] border border-line-2 text-stone">
    <CIcon name={name} />
  </span>
);
const InlineLink = ({ children }: { children: ReactNode }) => (
  <Link href="#" className="underline decoration-1 underline-offset-2 transition-colors hover:text-paper">{children}</Link>
);

/* ---------- hero ---------- */
export function CareersHero() {
  return (
    <section className="wrap">
      <div className="inner flex flex-col items-center gap-8 pb-10 pt-10 text-center md:py-20">
        <Reveal><h1 className="max-w-[576px] font-serif text-[36px] font-light leading-10 tracking-[-0.05em] md:text-[48px] md:leading-[48px]">{title(3, 4)}</h1></Reveal>
        <Reveal delay={80}><p className="max-w-[616px] text-lg font-light leading-[25px] md:text-xl md:leading-7">{sentence(19, 9)}</p></Reveal>
        <Reveal delay={160}>
          <Link href="#open-roles" className="group btn-dark bg-ink">
            {words(2, 11)}
            <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- photo marquee: two identical grids, translateX(-50%) over 140s ---------- */
const tiles: [string, string][] = [
  ["1/3", "1/3"], ["3/4", "1/2"], ["4/5", "1/2"], ["3/5", "2/3"], ["5/7", "1/3"], ["7/8", "1/2"],
  ["7/8", "2/3"], ["8/10", "1/3"], ["10/12", "1/3"], ["12/13", "1/2"], ["12/13", "2/3"],
];
function TileGroup({ hidden }: { hidden?: boolean }) {
  return (
    <div
      aria-hidden={hidden}
      className="grid shrink-0 gap-[var(--g)] pr-[var(--g)]"
      style={{ gridTemplateColumns: "repeat(12, var(--c))", gridTemplateRows: "repeat(2, var(--r))" }}
    >
      {tiles.map(([c, r], i) => (
        <div key={i} style={{ gridColumn: c, gridRow: r }}>
          <Placeholder seed={i + 3} className="size-full rounded bg-ink-2" label={hidden ? undefined : `${words(2, i)} ${i + 1}`} />
        </div>
      ))}
    </div>
  );
}
export function PhotoMarquee() {
  return (
    <div className="overflow-hidden [--c:135px] [--g:12px] [--r:84px] md:[--c:300px] md:[--g:16px] md:[--r:200px]">
      <div className="flex w-max animate-[marquee_140s_linear_infinite] hover:[animation-play-state:paused]">
        <TileGroup />
        <TileGroup hidden />
      </div>
    </div>
  );
}

/* ---------- centred feature rows ---------- */
type Feat = { icon: string; title: string; body: ReactNode };
function CenteredFeatures({ items }: { items: Feat[] }) {
  return (
    <ul className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-center md:gap-20">
      {items.map((f, i) => (
        <Reveal as="li" key={f.title} delay={i * 80} className="flex w-[260px] flex-col items-center text-center">
          <IconBox name={f.icon} />
          <h3 className="text-lg leading-6">{f.title}</h3>
          <p className="mt-1 text-[15px] font-light leading-[22px] text-stone">{f.body}</p>
        </Reveal>
      ))}
    </ul>
  );
}
function FeatureSection({ heading, lede, items }: { heading?: string; lede?: string; items: Feat[] }) {
  return (
    <Shell>
      {heading && (
        <div className="mb-6 grid gap-4 text-center">
          <Reveal><H2>{heading}</H2></Reveal>
          {lede && <Reveal delay={60}><p className="text-lg font-light leading-[25px] text-stone md:text-xl md:leading-7">{lede}</p></Reveal>}
        </div>
      )}
      <CenteredFeatures items={items} />
    </Shell>
  );
}

export function Intro() {
  return (
    <FeatureSection
      items={[
        { icon: "sparkle", title: title(2, 21), body: <>{sentence(7, 2).slice(0, -1)}. {words(4, 6)} <InlineLink>{words(4, 13)}</InlineLink>.</> },
        { icon: "globe", title: title(3, 17), body: sentence(6, 8) },
      ]}
    />
  );
}
export function Remote() {
  return (
    <FeatureSection
      heading={title(2, 5)}
      lede={sentence(11, 14)}
      items={[
        { icon: "desk", title: title(2, 30), body: sentence(15, 3) },
        { icon: "building", title: title(2, 31), body: sentence(12, 19) },
        { icon: "pin", title: title(2, 32), body: <>{sentence(11, 25).slice(0, -1)} <InlineLink>{words(1, 7)}</InlineLink>.</> },
      ]}
    />
  );
}
export function Values() {
  return (
    <FeatureSection
      heading={title(4, 26)}
      items={[
        { icon: "book", title: title(1, 3), body: sentence(15, 12) },
        { icon: "figure", title: title(1, 9), body: sentence(15, 27) },
        { icon: "hands", title: title(1, 15), body: sentence(15, 33) },
      ]}
    />
  );
}
export function Together() {
  return (
    <FeatureSection
      heading={title(3, 40)}
      items={[
        { icon: "fire", title: title(1, 41), body: sentence(20, 42) },
        { icon: "cup", title: title(2, 43), body: sentence(17, 44) },
      ]}
    />
  );
}

/* ---------- expense callout ---------- */
export function Callout() {
  return (
    <Shell>
      <Reveal>
        <div className="flex flex-col gap-6 rounded-2xl border border-line bg-ink p-6 md:flex-row md:p-8">
          <CIcon name="card" width={30} height={30} className="shrink-0 text-stone" />
          <div className="flex flex-col gap-2 leading-6 text-muted">
            <strong className="text-lg font-medium leading-6 text-paper">{title(2, 50)}</strong>
            <p className="text-base md:text-[16px]">{paragraph(2, 51)}</p>
          </div>
        </div>
      </Reveal>
    </Shell>
  );
}

/* ---------- benefits grid ---------- */
const benefitIcons = ["heart", "bank", "shield", "trend", "cap", "clock", "chat", "pram", "plane"];
export function Benefits() {
  return (
    <Shell>
      <Reveal className="mb-6"><H2>{title(1, 60)}</H2></Reveal>
      <ul className="grid gap-8 md:grid-cols-3 md:gap-20">
        {benefitIcons.map((ic, i) => (
          <Reveal as="li" key={ic} delay={(i % 3) * 80} className="flex flex-col items-start">
            <IconBox name={ic} />
            <h3 className="text-lg leading-6">{title(2 + (i % 3 === 1 ? 1 : 0), 61 + i * 4)}</h3>
            <p className="mt-1 max-w-[370px] text-[15px] font-light leading-[22px] text-stone">
              {i === 6 ? <>{sentence(6, 70).slice(0, -1)} <InlineLink>{words(1, 71)}</InlineLink>.</> : sentence(6 + ((i * 5) % 9), 62 + i * 3)}
            </p>
          </Reveal>
        ))}
      </ul>
    </Shell>
  );
}

/* ---------- testimonial ---------- */
export function Testimonial() {
  return (
    <Shell>
      <Reveal>
        <figure className="flex flex-col rounded-2xl border border-line bg-ink p-6 md:p-8">
          <CIcon name="quote" width={30} height={30} className="text-stone" />
          <blockquote className="mt-4 text-[22px] font-light leading-7 md:text-2xl md:leading-8">{paragraph(3, 80)}</blockquote>
          <figcaption className="mt-8 flex items-center gap-3">
            <Placeholder seed={4} className="size-10 rounded-full" />
            <div className="text-sm leading-[18px]">
              <div className="font-medium">{title(2, 81)}</div>
              <div className="text-muted">{title(2, 82)}</div>
            </div>
          </figcaption>
        </figure>
      </Reveal>
    </Shell>
  );
}

/* ---------- open roles grouped by department ---------- */
const departments: { name: string; roles: string[] }[] = [
  { name: words(1, 90), roles: [title(2, 91)] },
  { name: words(1, 92), roles: [title(2, 93)] },
  { name: words(1, 94), roles: [title(4, 95) + " (1st " + words(1, 96) + ")", title(3, 97)] },
  { name: words(1, 98), roles: [title(2, 99), title(2, 100)] },
];
export function OpenRoles() {
  const where = sentence(6, 101).slice(0, -1);
  return (
    <Shell>
      <div id="open-roles" className="scroll-mt-24">
        <Reveal className="mb-6"><H2>{title(2, 102)}</H2></Reveal>
        <ul className="flex flex-col gap-12">
          {departments.map((d) => (
            <li key={d.name} className="flex flex-col gap-2">
              <span className="mb-2 inline-flex self-start rounded-lg border border-line-2 px-3 py-1.5 font-mono text-[11px] uppercase leading-4 tracking-[0.06em]">{d.name}</span>
              <ul className="flex flex-col">
                {d.roles.map((r) => (
                  <li key={r} className="border-t border-line">
                    <Link href="#" className="group flex flex-col gap-x-6 gap-y-2 py-5 md:flex-row md:items-center md:justify-between">
                      <span className="text-xl leading-7 transition-colors duration-200 group-hover:text-stone md:text-2xl md:leading-8">{r}</span>
                      <span className="flex items-center gap-1.5 leading-6 text-muted">
                        <CIcon name="pin" width={16} height={16} />
                        {where}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}

export function CareersCta() {
  return (
    <Shell className="flex flex-col items-center text-center">
      <Reveal><h2 className="max-w-[340px] font-serif text-[32px] font-light leading-9 tracking-[-0.05em] md:max-w-none md:text-[40px] md:leading-[44px]">{sentence(7, 110).replace(".", "?")}</h2></Reveal>
      <Reveal delay={100}><Link href="#" className="btn-light mt-12 md:mt-12">{words(1, 111)}</Link></Reveal>
    </Shell>
  );
}
