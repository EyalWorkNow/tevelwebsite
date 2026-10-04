"use client";
import { useEffect, useRef, useState } from "react";

const steps = [
  { tag: "Lorem ipsum", title: "Dolor sit", body: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt.", color: "var(--color-teal)", notes: [["Lorem UI", -150, -250, -40, -95], ["Ipsum dolor", 175, -205, 75, -60]] },
  { tag: "Sit amet", title: "Consectetur", body: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.", color: "var(--color-amber)", notes: [["Elit API", -175, -150, -60, -20], ["Tempor", 185, -110, 70, 10]] },
  { tag: "Adipiscing", title: "Eiusmod", body: "Duis aute irure dolor in reprehenderit in voluptate velit.", color: "var(--color-violet)", notes: [["Magna core", -180, -60, -70, 40], ["Labore", 180, -20, 80, 60]] },
  { tag: "Tempor elit", title: "Incididunt", body: "Excepteur sint occaecat cupidatat non proident, sunt in culpa.", color: "var(--color-rose)", notes: [["Aliqua", -175, 40, -60, 140], ["Veniam ledger", 170, 80, 70, 160]] },
] as const;

const S = 150; // half-size of each plate in flat coords
const ISO = "matrix(0.707 0.409 -0.707 0.409 0 0)"; // rotate 45° + squash = isometric

/** Flat artwork per plate, drawn in a -S..S square then projected. */
function Art({ i, on }: { i: number; on: boolean }) {
  const fg = on ? "#f9f5ef" : "#514e4b";
  if (i === 0) return (<>
    <rect x={-S + 20} y={-S + 20} width={170} height={110} fill="#000" />
    <rect x={-S + 20} y={-S + 145} width={80} height={135} fill="#000" />
    <rect x={-S + 115} y={-S + 145} width={165} height={135} fill="#000" />
    <rect x={-S + 205} y={-S + 20} width={75} height={50} fill="#000" />
    {Array.from({ length: 9 }, (_, k) => <line key={k} x1={-S + 205 + k * 9} y1={-S + 80} x2={-S + 205 + k * 9} y2={-S + 130} stroke={fg} strokeWidth={1} />)}
  </>);
  if (i === 1) return (<>
    {Array.from({ length: 11 }, (_, k) => <rect key={k} x={-S + 30 + (k % 3) * 20} y={-S + 30 + k * 22} width={140 + ((k * 37) % 90)} height={9} fill={fg} />)}
  </>);
  if (i === 2) return (<>
    <rect x={-S + 25} y={-S + 25} width={250} height={250} fill="#000" />
    {Array.from({ length: 5 }, (_, r) => Array.from({ length: 5 }, (_, k) => (
      <circle key={`${r}${k}`} cx={-S + 65 + k * 42} cy={-S + 65 + r * 42} r={4} fill={fg} />
    )))}
    <path d={`M${-S + 65} ${-S + 65} L${-S + 149} ${-S + 107} L${-S + 191} ${-S + 233} L${-S + 233} ${-S + 149}`} stroke={fg} fill="none" />
  </>);
  return (<>
    {Array.from({ length: 12 }, (_, r) => Array.from({ length: 12 }, (_, k) => (
      <rect key={`${r}${k}`} x={-S + 20 + k * 22} y={-S + 20 + r * 22} width={10} height={(r * 7 + k * 3) % 5 === 0 ? 10 : 3} fill={fg} />
    )))}
  </>);
}

export default function Platform() {
  const ref = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const on = () => {
      const el = ref.current!;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - innerHeight;
      setP(Math.min(1, Math.max(0, -r.top / total)));
    };
    on();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); };
  }, []);

  // 0–0.12 intro, then four equal step windows
  const intro = p < 0.12;
  const sp = Math.max(0, (p - 0.12) / 0.88);
  const active = intro ? -1 : Math.min(3, Math.floor(sp * 4));
  const spread = intro ? p / 0.12 : 1 - Math.max(0, sp - 0.85) / 0.15;
  const color = active >= 0 ? steps[active].color : "var(--color-line-2)";

  return (
    <section ref={ref} className="rule relative h-[420vh]">
      <div className="wrap sticky top-0 h-screen">
        <div className="grid h-full md:grid-cols-2">
          {/* Left: intro copy, then the timeline */}
          <div className="inner relative border-line md:border-r">
            <div className={`absolute inset-x-6 top-1/2 -translate-y-1/2 transition-opacity duration-500 md:inset-x-10 ${intro ? "opacity-100" : "pointer-events-none opacity-0"}`}>
              <h2 className="h2">Lorem ipsum dolor sit <em>amet</em></h2>
              <p className="mt-4 max-w-[380px] font-light leading-6">
                Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.{" "}
                <a href="#" className="underline underline-offset-4 hover:text-stone">Magna aliqua</a>. Ut enim. Ad minim veniam.
              </p>
            </div>

            <div className={`absolute inset-y-16 left-6 w-px bg-line md:left-10 transition-opacity duration-500 ${intro ? "opacity-0" : "opacity-100"}`}>
              <div className="absolute inset-x-0 top-0 transition-[height,background] duration-300" style={{ height: `${sp * 100}%`, background: color }} />
            </div>

            <ol className={`absolute inset-y-16 left-6 right-6 transition-opacity duration-500 md:left-10 ${intro ? "opacity-0" : "opacity-100"}`}>
              {steps.map((s, i) => {
                const isActive = i === active;
                const above = i < active;
                return (
                  <li
                    key={s.tag}
                    className="absolute left-0 right-0 -translate-y-1/2 transition-all duration-500"
                    style={{ top: isActive ? "45%" : above ? `${i * 4}%` : `${88 + (i - active - 1) * 4}%` }}
                  >
                    <div key={`${i}-${active}`} className="label flex items-center gap-4 animate-[step-up_.35s_ease-out_both]">
                      <span className="-ml-[7px] grid size-[15px] place-items-center rounded-full bg-ink" style={{ boxShadow: isActive ? `0 0 0 1px ${s.color}` : "none" }}>
                        <span className="size-[5px] rounded-full" style={{ background: isActive ? s.color : "var(--color-line-2)" }} />
                      </span>
                      <span className="text-line-2">0{i + 1}</span>
                      <span className={isActive ? "text-paper animate-[eyebrow-wipe_.5s_ease-out_both]" : "text-line-2"}>{s.tag}</span>
                    </div>
                    <div className={`overflow-hidden pl-[26px] transition-all duration-500 ${isActive ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                      <h3 key={active} className="h2 mt-3 animate-[fade-in_.5s_ease-out_both]">{s.title}</h3>
                      <p key={-active - 1} className="mt-3 max-w-[300px] text-xl font-light leading-7 animate-[fade-in_.5s_.1s_ease-out_both]">{s.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Right: exploding isometric stack */}
          <div className="hidden items-center justify-center md:flex" style={{ backgroundImage: "radial-gradient(#363533 1px, transparent 1px)", backgroundSize: "16px 16px" }}>
            <svg viewBox="-280 -330 560 660" className="h-[80vh] max-h-[660px] w-auto" aria-hidden>
              {steps.map((s, i) => {
                const y = (i - 1.5) * (40 + 110 * spread);
                const on = i === active;
                return (
                  <g key={i} style={{ transform: `translateY(${y}px)`, transition: "transform .5s cubic-bezier(.2,.7,.2,1)" }}>
                    <g transform={`translate(0 10) ${ISO}`}><rect x={-S} y={-S} width={S * 2} height={S * 2} fill="#0c0c0b" stroke="#363533" /></g>
                    <g transform={ISO}>
                      <rect x={-S} y={-S} width={S * 2} height={S * 2} fill="#1a1918" stroke={on ? s.color : "#514e4b"} style={{ transition: "stroke .4s" }} />
                      <Art i={i} on={on} />
                    </g>
                  </g>
                );
              })}
              {active >= 0 && steps[active].notes.map(([label, lx, ly, px, py], k) => {
                const right = lx > 0;
                const elbowX = right ? lx - 20 : lx + 20;
                return (
                  <g key={`${active}-${k}`} className="font-mono" style={{ fontSize: 13, letterSpacing: "0.06em" }}>
                    <polyline points={`${right ? lx - 8 : lx + 8 + label.length * 8.5},${ly} ${elbowX + (right ? -30 : 30 + label.length * 8.5)},${ly} ${px},${py}`} pathLength={1} strokeDasharray="1" fill="none" stroke="#959089" strokeWidth={1}
                      style={{ animation: "line-draw .55s ease-out .15s both" }} />
                    <circle cx={right ? lx - 8 : lx + 8 + label.length * 8.5} cy={ly} r={3} fill={steps[active].color} style={{ animation: "fade-in .3s ease-out both" }} />
                    <text x={right ? lx : lx} y={ly + 4} fill="#f9f5ef" textAnchor="start" style={{ animation: "fade-in .3s ease-out .1s both", textTransform: "uppercase" }}>{label}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
