"use client";
import { useEffect, useState } from "react";

// Learn → Practice → Assess → Feedback → Adapt → Measure (R&D brief §12), cycling highlight.
const steps = [["Learn", "לומדים"], ["Practice", "מתרגלים"], ["Assess", "נבחנים"], ["Feedback", "מקבלים משוב"], ["Adapt", "המסלול מתאים את עצמו"], ["Measure", "מודדים"]];

export default function LearningLoop() {
  const [on, setOn] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setOn((i) => (i + 1) % steps.length), 1400);
    return () => clearInterval(t);
  }, []);
  const R = 120, C = 160;
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[340px]" dir="ltr">
      <svg viewBox="0 0 320 320" className="absolute inset-0 size-full" aria-hidden>
        <circle cx={C} cy={C} r={R} fill="none" stroke="#363533" strokeDasharray="3 6" />
        <circle cx={C} cy={C} r={R} fill="none" stroke="#02bd8f" strokeWidth="1.5" pathLength={6} strokeDasharray="1 5"
          style={{ strokeDashoffset: -on, transition: "stroke-dashoffset .6s cubic-bezier(.2,.7,.2,1)", transform: "rotate(-90deg)", transformOrigin: "center" }} />
      </svg>
      {steps.map(([en, he], i) => {
        const a = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
        const x = 50 + (Math.cos(a) * R / 320) * 100, y = 50 + (Math.sin(a) * R / 320) * 100;
        const active = i === on;
        return (
          <div key={en} className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: `${x}%`, top: `${y}%` }}>
            <span className={`mx-auto block size-3 rounded-full border transition-all duration-500 ${active ? "scale-125 border-brand bg-brand shadow-[0_0_0_6px_rgba(2,189,143,.15)]" : "border-line-2 bg-ink"}`} />
            <span className={`mt-1.5 block whitespace-nowrap font-mono text-[11px] transition-colors ${active ? "text-paper" : "text-muted"}`}>{en}</span>
            <span className={`block whitespace-nowrap text-[11px] transition-colors ${active ? "text-brand" : "text-line-2"}`} dir="rtl">{he}</span>
          </div>
        );
      })}
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center" dir="rtl"><p className="text-2xl font-light">למידה</p><p className="text-sm text-muted">שמודדת ומשתפרת</p></div>
      </div>
    </div>
  );
}
