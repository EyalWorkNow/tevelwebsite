"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

// Accessibility menu (IS 5568 / WCAG 2.0 AA conventions): text size, contrast modes, link highlight,
// readable font, spacing, motion stop, big cursor, reset — persisted per visitor, applied as classes on <html>.
type Prefs = { zoom: number; contrast: "none" | "high" | "light" | "gray" | "invert"; links: boolean; readable: boolean; spacing: boolean; motion: boolean; cursor: boolean; headings: boolean };
const DEFAULT: Prefs = { zoom: 1, contrast: "none", links: false, readable: false, spacing: false, motion: false, cursor: false, headings: false };
const KEY = "tevel-a11y";
const ZOOMS = [1, 1.15, 1.3, 1.5];

function apply(p: Prefs) {
  const h = document.documentElement;
  h.style.setProperty("--a11y-zoom", String(p.zoom));
  const flags: Record<string, boolean> = {
    "a11y-contrast-high": p.contrast === "high", "a11y-contrast-light": p.contrast === "light",
    "a11y-gray": p.contrast === "gray", "a11y-invert": p.contrast === "invert",
    "a11y-links": p.links, "a11y-readable": p.readable, "a11y-spacing": p.spacing,
    "a11y-no-motion": p.motion, "a11y-cursor": p.cursor, "a11y-headings": p.headings,
  };
  for (const [c, on] of Object.entries(flags)) h.classList.toggle(c, on);
}

const Icon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="4.5" r="1.8" fill="currentColor" stroke="none" />
    <path d="M5 8.5c2.3.8 4.6 1.2 7 1.2s4.7-.4 7-1.2M12 9.7v4.6M12 14.3l-3.2 6M12 14.3l3.2 6" />
  </svg>
);

function Toggle({ on, label, desc, onClick }: { on: boolean; label: string; desc: string; onClick: () => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={onClick}
      className={`flex min-h-[76px] flex-col items-start justify-between rounded-lg border p-3 text-start transition-colors duration-200 ${on ? "border-brand bg-brand/10" : "border-line-2 hover:border-stone-2 hover:bg-ink"}`}>
      <span className="flex w-full items-center justify-between gap-2">
        <span className="text-sm font-medium text-paper">{label}</span>
        <span className={`relative h-4 w-7 shrink-0 rounded-full transition-colors ${on ? "bg-brand" : "bg-line-2"}`} aria-hidden>
          <span className={`absolute top-0.5 size-3 rounded-full bg-paper transition-all ${on ? "start-3.5" : "start-0.5"}`} />
        </span>
      </span>
      <span className="mt-1 text-xs leading-4 text-stone-2">{desc}</span>
    </button>
  );
}

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [p, setP] = useState<Prefs>(DEFAULT);
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try { const s = localStorage.getItem(KEY); if (s) { const v = { ...DEFAULT, ...JSON.parse(s) }; setP(v); apply(v); } } catch {}
  }, []);

  const update = useCallback((patch: Partial<Prefs>) => {
    setP((prev) => {
      const next = { ...prev, ...patch };
      apply(next);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  // Esc closes; focus moves into the dialog and is trapped there; returns to the trigger on close.
  useEffect(() => {
    if (!open) return;
    const el = panel.current!;
    el.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); trigger.current?.focus(); }
      if (e.key !== "Tab") return;
      const f = [...el.querySelectorAll<HTMLElement>("button, a")];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const zi = ZOOMS.indexOf(p.zoom);
  const contrastModes: [Prefs["contrast"], string][] = [["none", "רגיל"], ["high", "ניגודיות גבוהה"], ["light", "רקע בהיר"], ["gray", "גווני אפור"], ["invert", "היפוך צבעים"]];

  return (
    <div id="a11y-root" className="a11y-keep">
      <button ref={trigger} type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="a11y-panel"
        aria-label="תפריט נגישות" title="תפריט נגישות (Alt+A)" accessKey="a"
        className="fixed bottom-6 start-6 z-[60] grid size-14 place-items-center rounded-full bg-brand text-ink shadow-[0_8px_24px_rgba(2,189,143,.35)] transition-transform duration-200 hover:scale-105 focus-visible:outline-offset-4">
        <Icon />
      </button>

      {open && (
        <div ref={panel} id="a11y-panel" role="dialog" aria-modal="true" aria-labelledby="a11y-title"
          className="fixed bottom-24 start-4 z-[60] max-h-[calc(100dvh-8rem)] w-[min(380px,calc(100vw-2rem))] overflow-y-auto rounded-xl bg-ink-2/95 p-5 shadow-[inset_0_0_0_1px_#514e4b,0_20px_60px_rgba(0,0,0,.5)] backdrop-blur-xl animate-[slide-up-and-fade_.25s_ease_both]">
          <div className="flex items-center justify-between">
            <h2 id="a11y-title" className="text-lg font-medium">תפריט נגישות</h2>
            <button type="button" onClick={() => { setOpen(false); trigger.current?.focus(); }} aria-label="סגירת תפריט הנגישות"
              className="grid size-8 place-items-center rounded-full border border-line-2 text-stone transition-colors hover:border-stone hover:text-paper">✕</button>
          </div>

          <p className="label mt-5 text-muted">גודל טקסט</p>
          <div className="mt-2 flex items-center gap-2" role="group" aria-label="גודל טקסט">
            <button type="button" onClick={() => update({ zoom: ZOOMS[Math.max(0, zi - 1)] })} disabled={zi === 0} aria-label="הקטנת טקסט"
              className="grid h-11 flex-1 place-items-center rounded-lg border border-line-2 text-lg transition-colors hover:border-stone disabled:opacity-40">א−</button>
            <span className="w-16 text-center font-medium" aria-live="polite">{Math.round(p.zoom * 100)}%</span>
            <button type="button" onClick={() => update({ zoom: ZOOMS[Math.min(ZOOMS.length - 1, zi + 1)] })} disabled={zi === ZOOMS.length - 1} aria-label="הגדלת טקסט"
              className="grid h-11 flex-1 place-items-center rounded-lg border border-line-2 text-lg transition-colors hover:border-stone disabled:opacity-40">א+</button>
          </div>

          <p className="label mt-5 text-muted">צבעים וניגודיות</p>
          <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="מצב צבעים">
            {contrastModes.map(([v, l]) => (
              <button key={v} type="button" role="radio" aria-checked={p.contrast === v} onClick={() => update({ contrast: v })}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${p.contrast === v ? "border-brand bg-brand text-ink" : "border-line-2 hover:border-stone"}`}>{l}</button>
            ))}
          </div>

          <p className="label mt-5 text-muted">תוכן וניווט</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Toggle on={p.links} label="הדגשת קישורים" desc="קו תחתון ומסגרת לכל קישור" onClick={() => update({ links: !p.links })} />
            <Toggle on={p.headings} label="הדגשת כותרות" desc="סימון מבנה הכותרות בעמוד" onClick={() => update({ headings: !p.headings })} />
            <Toggle on={p.readable} label="גופן קריא" desc="גופן מערכת פשוט ומשקל רגיל" onClick={() => update({ readable: !p.readable })} />
            <Toggle on={p.spacing} label="ריווח טקסט" desc="ריווח שורות, מילים ואותיות" onClick={() => update({ spacing: !p.spacing })} />
            <Toggle on={p.motion} label="עצירת אנימציות" desc="ללא תנועה, הבהובים ומעברים" onClick={() => update({ motion: !p.motion })} />
            <Toggle on={p.cursor} label="סמן גדול" desc="סמן עכבר מוגדל וברור" onClick={() => update({ cursor: !p.cursor })} />
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
            <button type="button" onClick={() => update(DEFAULT)} className="label rounded-full border border-line-2 px-3.5 py-2 transition-colors hover:border-stone">איפוס הגדרות</button>
            <Link href="/legal/accessibility" onClick={() => setOpen(false)} className="text-sm text-stone underline underline-offset-4 hover:text-paper">הצהרת נגישות</Link>
          </div>
        </div>
      )}
    </div>
  );
}
