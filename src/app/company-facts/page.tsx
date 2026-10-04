import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/ui";
import { sentence, title, words } from "@/lib/lorem";

export const metadata: Metadata = { title: "Company facts" };

/* ---------- prose primitives (measured: p 18/28, h2 serif 31/40, h3 20/32, ul pl-32) ---------- */
const url = (seed: number, path = words(2, seed).replace(" ", "-")) => `https://lorem.example/${path}`;
const A = ({ seed, path }: { seed: number; path?: string }) => (
  <Link href="#" className="[overflow-wrap:anywhere] underline decoration-paper/70 decoration-1 underline-offset-[3px] transition-[text-decoration-color] duration-150 hover:decoration-transparent">
    {url(seed, path)}
  </Link>
);
const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="mb-3 mt-5 font-serif text-2xl font-light leading-8 tracking-[-0.04em] md:text-[31px] md:leading-10">{children}</h2>
);
const H3 = ({ children, first }: { children: ReactNode; first?: boolean }) => (
  <h3 className={`mb-3 text-base leading-6 tracking-[0.01em] md:text-xl md:leading-8 ${first ? "mt-3" : "mt-5"}`}>{children}</h3>
);
const Fact = ({ k, children }: { k?: string; children: ReactNode }) => (
  <>
    {k && <strong className="font-medium">{k}{k.endsWith("?") ? " " : ": "}</strong>}
    {children}
  </>
);
const P = ({ k, children }: { k?: string; children: ReactNode }) => (
  <p className="mt-3 first:mt-0 [h3+&]:mt-0"><Fact k={k}>{children}</Fact></p>
);
const Ul = ({ children, nested }: { children: ReactNode; nested?: boolean }) => (
  <ul className={`list-disc pl-8 marker:text-paper ${nested ? "mb-8 mt-3" : "my-5"} [&>li+li]:mt-2`}>{children}</ul>
);
const Li = ({ k, children }: { k?: string; children: ReactNode }) => <li><Fact k={k}>{children}</Fact></li>;

const label = (n: number, seed: number) => title(n, seed);
const plain = (n: number, seed: number) => sentence(n, seed).slice(0, -1).toLowerCase();

function Product({ seed, usps, rails, first }: { seed: number; usps: number; rails?: boolean; first?: boolean }) {
  return (
    <>
      <H3 first={first}>{title(3, seed)}</H3>
      <Ul>
        <Li>{label(2, seed + 1)}: <A seed={seed} path={`products/${words(2, seed + 2).replace(" ", "-")}`} /></Li>
        {!rails && <Li>{label(1, seed + 3)}: {plain(9 + (seed % 9), seed + 4)}.</Li>}
        <Li>
          {rails ? `${label(3, seed + 5)}:` : `${label(3, seed + 6)}:`}
          <Ul nested>{Array.from({ length: usps }, (_, i) => <Li key={i}>{sentence(5 + ((seed + i) % 7), seed + 10 + i * 3).slice(0, -1)}</Li>)}</Ul>
        </Li>
        {rails ? (
          <Li>
            {label(2, seed + 7)}:
            <Ul nested>{[2, 2, 4].map((n, i) => <Li key={i}>{title(n, seed + 20 + i * 2)}</Li>)}</Ul>
          </Li>
        ) : (
          <Li>{label(3, seed + 8)}: {plain(10 + (seed % 14), seed + 9)}</Li>
        )}
      </Ul>
    </>
  );
}

export default function CompanyFactsPage() {
  return (
    <section className="wrap">
      <div className="inner pb-16 pt-12 md:py-20">
        <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-[1fr_minmax(0,837px)_1fr] md:gap-8">
          <article className="flex min-w-0 flex-col gap-5 md:col-start-2 md:gap-8">
            <header className="flex flex-col gap-2 text-center md:gap-5">
              <Reveal><h1 className="font-serif text-[28px] font-light leading-8 tracking-[-0.04em] md:text-[49px] md:leading-[52px]">{title(2, 30)}</h1></Reveal>
              <Reveal delay={80}><p className="mx-auto max-w-[748px] text-base leading-6 tracking-[0.01em] text-stone-2 md:text-xl md:leading-8">{sentence(16, 31)}</p></Reveal>
            </header>

            <Reveal delay={140} className="text-base leading-6 tracking-[0.01em] md:text-lg md:leading-7">
              <p>{title(2, 32)}: 2026-08-26</p>

              <H2>{title(1, 33)}</H2>
              <H3 first>{title(2, 34)}</H3>
              <P k={sentence(4, 35).slice(0, -1) + "?"}>{sentence(20, 36)}</P>
              <P k={label(2, 37)}>{title(1, 38)}</P>
              <P k={label(2, 39)}>{title(2, 40)}</P>
              <P k={label(1, 41)}><A seed={41} path="" /></P>
              <P k={label(2, 42)}><A seed={42} path="ipsum/" /></P>
              <P k={label(2, 43)}>{sentence(30, 44)} 970920.</P>
              <P k={label(1, 45)}>{Array.from({ length: 7 }, (_, i) => title(1 + (i % 2), 46 + i * 3)).join(", ")}</P>
              <P k={label(1, 47)}>{title(1, 48)}, {title(2, 49)}</P>
              <P k={label(4, 50)}><A seed={50} path="register/firm?id=0000L0R3M1PSUMD0L0R" /></P>
              <P k={label(4, 51)}><A seed={51} path="find-and-update/company-information/lorem/00000000" /></P>

              <H3>{title(1, 52)}</H3>
              <P k={label(3, 53)}>{title(2, 54)} (ex {title(1, 55)})</P>
              <P k={label(3, 56)}>{title(2, 57)} ({title(2, 58)})</P>

              <H3>{title(3, 59)}</H3>
              <Ul>
                <Li k={label(2, 60)}>{plain(5, 61)} 2022, {plain(4, 62)} 2023, {plain(3, 63)} 2024</Li>
                <Li k={label(5, 64)}>{sentence(6, 65).slice(0, -1)}</Li>
              </Ul>

              <H3>{title(1, 66)}</H3>
              <Ul>
                <Li k={label(1, 67)}>{sentence(7, 68).slice(0, -1)} 2023, {plain(3, 69)} 2024 {plain(5, 70)}</Li>
                <Li k={label(2, 71)}>{plain(2, 72)}</Li>
              </Ul>

              <H3>{title(1, 73)}</H3>
              <Ul>
                <Li k={`${label(2, 74)} (LI)`}>{Array.from({ length: 7 }, (_, i) => title(1 + (i % 2), 75 + i * 2)).join(", ")}</Li>
                <Li k={label(2, 76)}>{Array.from({ length: 4 }, (_, i) => `${title(2, 77 + i * 5)} (${title(2, 78 + i * 5)})`).join(", ")}</Li>
                <Li k={label(2, 79)}>{title(1, 80)} B</Li>
                <Li k={label(2, 81)}>{plain(2, 82)} c. $42m</Li>
              </Ul>

              <H2>{title(1, 83)}</H2>
              <Product seed={84} usps={2} first />
              <Product seed={110} usps={2} />
              <Product seed={136} usps={2} />
              <Product seed={162} usps={4} />
              <Product seed={188} usps={3} />
              <Product seed={214} usps={3} />
              <Product seed={240} usps={3} rails />

              <H3>{title(3, 270)}</H3>
              <P>{title(2, 271)} <A seed={271} path="board" />.</P>

              <H2>{title(3, 272)}</H2>
              <H3 first>{title(2, 273)}</H3>
              <Ul>
                <Li k={label(1, 274)}>{Array.from({ length: 7 }, (_, i) => title(1, 275 + i * 2)).join(", ")}</Li>
                <Li k={label(1, 276)}>{Array.from({ length: 3 }, (_, i) => title(1 + (i % 2), 277 + i * 3)).join(", ")}</Li>
                <Li k={label(1, 278)}>{sentence(8, 279).slice(0, -1)}</Li>
              </Ul>
              <H3>{title(2, 280)}</H3>
              <Ul>{Array.from({ length: 14 }, (_, i) => <Li key={i}>{title(1 + (i % 3 === 0 ? 1 : 0), 281 + i * 2)}</Li>)}</Ul>

              <H2>{title(3, 300)}</H2>
              <Ul>
                <Li k="API">{sentence(5, 301).slice(0, -1)} (<A seed={301} path="docs/index.html" />).</Li>
                <Li k={label(1, 302)}>{sentence(12, 303).slice(0, -1)} <A seed={303} path="app/register" /></Li>
                <Li k={label(3, 304)}>{sentence(12, 305).slice(0, -1)}</Li>
                <Li k={`${label(4, 306)} (LIP)`}>{plain(7, 307)} 2025. {title(3, 308)} <A seed={308} path="lorem/ipsum-dolor-server" /></Li>
                <Li k={label(1, 309)}>{plain(2, 310)} <A seed={310} path="status/" /></Li>
              </Ul>

              <H2>{title(3, 311)}</H2>
              <Ul>
                <Li k={label(3, 312)}>
                  <Ul nested>
                    <Li>{title(1, 313)}: {plain(24, 314)}</Li>
                    <Li>{title(1, 315)}: 8 {plain(18, 316)}</Li>
                  </Ul>
                </Li>
                <Li k={label(3, 317)}>
                  <Ul nested>
                    <Li>{title(1, 318)}: {plain(14, 319)}</Li>
                    <Li>{title(1, 320)}: {plain(20, 321)}</Li>
                  </Ul>
                </Li>
              </Ul>

              <H2>{title(5, 322)}</H2>
              <Ul>
                <Li k={label(2, 323)}><A seed={323} path="docs/index.html" /></Li>
                <Li k={label(1, 324)}>{sentence(4, 325).slice(0, -1)} <A seed={325} path="app/register" /></Li>
                <Li k={label(1, 326)}><A seed={326} path="social/lorem-ipsum" /></Li>
                <Li k={label(1, 327)}><A seed={327} path="video/@LoremIpsum" /></Li>
                <Li k={label(1, 328)}><A seed={328} path="contact/sales" /></Li>
                <Li k={label(1, 329)}>support@lorem.example</Li>
                <Li k={label(1, 330)}><A seed={330} path="community/shared_invite/zt-0l0rem1psum-D0L0RS1TAm3tC0nsecteturAd1p1sc1ng" /></Li>
              </Ul>
            </Reveal>
          </article>
        </div>
      </div>
    </section>
  );
}
