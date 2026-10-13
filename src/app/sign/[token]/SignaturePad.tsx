"use client";
import { useEffect, useRef, useState } from "react";
import type { Signature } from "@/lib/relay/types";

// Draw with a finger or mouse, or type the name. Same value shapes as the CRM's own page (600×200 pad, SVG paths).
const PAD_W = 600, PAD_H = 200;

export default function SignaturePad({ title, defaultName, onDone, onCancel }: { title: string; defaultName: string; onDone: (value: Signature) => void; onCancel: () => void }) {
  const [mode, setMode] = useState<"draw" | "type">("draw");
  const [typed, setTyped] = useState(defaultName);
  const [paths, setPaths] = useState<string[]>([]);
  const canvas = useRef<HTMLCanvasElement>(null);
  const current = useRef<string | null>(null);
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    ctx.lineWidth = 2.6; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#0d1f66";
  }, [mode]);

  useEffect(() => {
    dialog.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onCancel(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return [Math.round(((event.clientX - rect.left) / rect.width) * PAD_W * 10) / 10, Math.round(((event.clientY - rect.top) / rect.height) * PAD_H * 10) / 10];
  };
  const down = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const [x, y] = point(event);
    current.current = `M${x} ${y}`;
    const ctx = event.currentTarget.getContext("2d")!;
    ctx.beginPath(); ctx.moveTo(x, y);
  };
  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!current.current) return;
    const [x, y] = point(event);
    current.current += ` L${x} ${y}`;
    const ctx = event.currentTarget.getContext("2d")!;
    ctx.lineTo(x, y); ctx.stroke();
  };
  const up = () => {
    let path = current.current;
    if (!path) return;
    if (!path.includes("L")) { const [x, y] = path.slice(1).split(" "); path += ` L${Number(x) + 0.5} ${y}`; }
    current.current = null;
    setPaths((list) => [...list, path!]);
  };
  const clear = () => {
    setPaths([]);
    const ctx = canvas.current?.getContext("2d");
    ctx?.clearRect(0, 0, PAD_W, PAD_H);
  };
  const ready = mode === "draw" ? paths.length > 0 : typed.trim().length > 0;
  const done = () => {
    if (!ready) return;
    onDone(mode === "draw" ? { kind: "DRAWN", paths, width: PAD_W, height: PAD_H } : { kind: "TYPED", text: typed.trim().slice(0, 80) });
  };

  return (
    <div className="sign-modal" role="dialog" aria-modal="true" aria-labelledby="pad-title" ref={dialog}>
      <div className="sign-sheet">
        <h2 id="pad-title">{title}</h2>
        <div className="sign-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={mode === "draw"} onClick={() => setMode("draw")}>ציור</button>
          <button type="button" role="tab" aria-selected={mode === "type"} onClick={() => setMode("type")}>הקלדה</button>
        </div>
        {mode === "draw" ? (
          <div>
            <canvas ref={canvas} className="sign-pad" width={PAD_W * 2} height={PAD_H * 2} aria-label="משטח חתימה: מציירים עם האצבע או העכבר"
              onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} data-autofocus tabIndex={0} />
            <button type="button" className="sign-link" onClick={clear}>ניקוי</button>
          </div>
        ) : (
          <div>
            <label className="sign-label" htmlFor="typed-sign">השם המלא</label>
            <input id="typed-sign" className="sign-input" value={typed} onChange={(event) => setTyped(event.target.value)} maxLength={80} autoComplete="name" data-autofocus />
            <div className="sign-typed" aria-hidden="true">{typed}</div>
          </div>
        )}
        <div className="sign-actions">
          <button type="button" className="sign-primary" onClick={done} disabled={!ready}>שמירת החתימה</button>
          <button type="button" className="sign-secondary" onClick={onCancel}>ביטול</button>
        </div>
      </div>
    </div>
  );
}

export function SignaturePreview({ value }: { value: Signature }) {
  if (value.kind === "TYPED") return <span className="sign-typed-small">{value.text}</span>;
  // eslint-disable-next-line @next/next/no-img-element -- a data: URL the customer just chose
  if (value.kind === "IMAGE") return <img src={value.dataUrl} alt="החתימה" className="sign-preview-img" />;
  return (
    <svg viewBox={`0 0 ${value.width} ${value.height}`} className="sign-preview-svg" role="img" aria-label="החתימה שלך">
      {value.paths.map((d, index) => <path key={index} d={d} fill="none" stroke="#0d1f66" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />)}
    </svg>
  );
}
