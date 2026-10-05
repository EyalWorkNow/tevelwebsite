"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Placeholder, Reveal } from "@/components/ui";

export type Episode = { n: string; guest: string; title: string; body: string; date: string; duration: number; seed: number };

/* Original, brand-neutral platform glyphs (no third-party logos). */
export function PlatformGlyph({ name, className = "" }: { name: "play" | "wave" | "rss" | "pause"; className?: string }) {
  if (name === "play" || name === "pause")
    return (
      <svg viewBox="0 0 28 20" width={28} height={20} className={className} aria-hidden>
        <rect x="0.5" y="0.5" width="27" height="19" rx="5" fill="var(--color-paper)" />
        {name === "play" ? <path d="M11.5 6.2v7.6l6.2-3.8z" fill="var(--color-ink)" /> : <path d="M11 6.5v7M17 6.5v7" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" />}
      </svg>
    );
  if (name === "wave")
    return (
      <svg viewBox="0 0 22 22" width={22} height={22} className={className} aria-hidden>
        <circle cx="11" cy="11" r="11" fill="var(--color-mint)" />
        <path d="M6.5 9.5v3M9.5 7.5v7M12.5 6v10M15.5 8.5v5" stroke="var(--color-ink)" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg viewBox="0 0 22 22" width={22} height={22} className={className} aria-hidden>
      <rect width="22" height="22" rx="6" fill="var(--color-violet)" />
      <circle cx="7" cy="15" r="1.6" fill="var(--color-ink)" />
      <path d="M6 10.2a5.8 5.8 0 0 1 5.8 5.8M6 6a10 10 0 0 1 10 10" fill="none" stroke="var(--color-ink)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const pill =
  "relative inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-ink px-5 font-mono text-xs uppercase leading-4 tracking-[0.06em] text-paper shadow-[inset_0_0_0_1px_var(--color-line)] transition-shadow duration-300 hover:shadow-[inset_0_0_0_1px_var(--color-stone-2)]";

export function PlatformButton({ label, glyph, href = "#" }: { label: string; glyph: "play" | "wave" | "rss"; href?: string }) {
  return (
    <Link href={href} className={`${pill} w-[220px] justify-between`}>
      <span className="flex-1 text-center">{label}</span>
      <PlatformGlyph name={glyph} />
    </Link>
  );
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/* Visual-only player: no audio, just a ticking progress bar. */
function MiniPlayer({ ep, playing, toggle }: { ep: Episode; playing: boolean; toggle: () => void }) {
  const total = ep.duration * 60;
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT((v) => (v + 1 >= total ? 0 : v + 1)), 1000);
    return () => clearInterval(id);
  }, [playing, total]);
  return (
    <div className="mt-4 flex animate-[slide-up-and-fade_.4s_cubic-bezier(.16,1,.3,1)_both] items-center gap-3 rounded-full px-1 py-1 pe-5 shadow-[inset_0_0_0_1px_var(--color-line)] md:max-w-[560px]">
      <button onClick={toggle} aria-label={playing ? "עצירה" : "הפעלה"} className="grid size-9 shrink-0 place-items-center rounded-full bg-paper text-ink transition-colors hover:bg-paper-2">
        {playing ? (
          <svg viewBox="0 0 12 12" width={12} height={12} aria-hidden><path d="M3.5 2v8M8.5 2v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        ) : (
          <svg viewBox="0 0 12 12" width={12} height={12} aria-hidden><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg>
        )}
      </button>
      <span className="font-mono text-xs tabular-nums text-stone">{fmt(t)}</span>
      <button
        className="group relative h-6 flex-1"
        aria-label="התקדמות"
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setT(Math.round(((e.clientX - r.left) / r.width) * total));
        }}
      >
        <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-line" />
        <span className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-paper transition-[width] duration-1000 ease-linear" style={{ width: `${(t / total) * 100}%` }} />
        <span className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper opacity-0 transition-opacity group-hover:opacity-100" style={{ left: `${(t / total) * 100}%` }} />
      </button>
      <span className="font-mono text-xs tabular-nums text-muted">{fmt(total)}</span>
    </div>
  );
}

function Bars() {
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="w-[3px] origin-bottom rounded-sm bg-paper" style={{ height: "100%", animation: `eq-bar ${0.7 + i * 0.13}s ease-in-out ${i * 0.1}s infinite alternate` }} />
      ))}
    </span>
  );
}

function Cover({ ep, active, playing }: { ep: Episode; active: boolean; playing: boolean }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg md:w-[356px]">
      <div className="absolute inset-0"><Placeholder seed={ep.seed} className="size-full" /></div>
      {/* original cover typography */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-5">
        <span className="font-serif text-lg leading-none tracking-[-0.03em] text-paper/90">TEVEL <span className="rounded-sm bg-paper px-1 text-ink">R&amp;D</span></span>
        <div>
          <span className="block font-mono text-[10px] uppercase tracking-[0.08em] text-paper/80">{ep.n}</span>
          <span className="mt-1 block max-w-[80%] font-sans text-[22px] font-semibold uppercase leading-[22px] tracking-[-0.02em] text-paper md:text-2xl md:leading-6">{ep.title.split(" ").slice(0, 3).join(" ")}</span>
        </div>
      </div>
      <div className={`absolute end-3 top-3 flex items-center gap-2 rounded-full bg-ink/80 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-paper backdrop-blur transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`}>
        {playing ? <Bars /> : null}
        {playing ? "פתוח" : "סגור"}
      </div>
    </div>
  );
}

export function EpisodeList({ episodes }: { episodes: Episode[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  const start = (n: string) => {
    if (active === n) setPlaying((p) => !p);
    else { setActive(n); setPlaying(true); }
  };

  return (
    <>
      <style>{`@keyframes eq-bar { from { transform: scaleY(.25) } to { transform: scaleY(1) } }`}</style>
      <ul className="flex flex-col gap-10 md:gap-16">
        {episodes.map((ep, i) => {
          const isActive = active === ep.n;
          return (
            <Reveal as="li" key={ep.n} delay={i < 3 ? i * 80 : 0} className="flex max-w-[1304px] flex-col gap-4 md:flex-row md:items-start md:gap-5">
              <figure className="flex shrink-0 justify-center md:w-[32.3%]">
                <button onClick={() => start(ep.n)} className="group block w-full text-start md:w-auto" aria-label={`פרטים: ${ep.title}`}>
                  <span className="block transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.02]">
                    <Cover ep={ep} active={isActive} playing={isActive && playing} />
                  </span>
                </button>
              </figure>
              <div className="min-w-0 flex-1 md:py-0.5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm uppercase leading-4 text-stone md:text-base">{ep.guest}</span>
                  <span className="hidden font-mono text-xs uppercase leading-4 text-muted md:inline">· {ep.date}</span>
                </div>
                <div className="mt-2 flex flex-col md:gap-2">
                  <h3 className="font-serif text-2xl leading-7 tracking-[-0.04em] md:text-[31px] md:leading-10">{ep.n}: {ep.title}</h3>
                  <p className="pt-2.5 text-sm leading-5 tracking-[0.01em] text-stone-2 md:text-base md:leading-6">{ep.body}</p>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <button onClick={() => start(ep.n)} className={pill}>
                    {isActive && playing ? "סגירה" : "פרטים"}
                    <PlatformGlyph name={isActive && playing ? "pause" : "play"} />
                  </button>
                  <Link href="/solutions/rd" aria-label="קראו עוד" className="transition-transform duration-300 hover:-translate-y-0.5"><PlatformGlyph name="wave" /></Link>
                  {i % 4 !== 1 && <Link href="/contact" aria-label="תביאו את הבעיה" className="transition-transform duration-300 hover:-translate-y-0.5"><PlatformGlyph name="rss" /></Link>}
                </div>
                {isActive && <MiniPlayer ep={ep} playing={playing} toggle={() => setPlaying((p) => !p)} />}
              </div>
            </Reveal>
          );
        })}
      </ul>
    </>
  );
}
