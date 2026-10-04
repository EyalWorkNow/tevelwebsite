"use client";
import { useEffect, useRef } from "react";

// Drifting character field drawn on canvas — the hero's bottom band.
const CHARS = "+×+×#";

export default function AsciiField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cell = 12;
    let raf = 0, w = 0, h = 0;

    const resize = () => {
      const dpr = devicePixelRatio || 1;
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = "11px var(--font-mono), monospace";
      ctx.textBaseline = "top";
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const s = t / 2400;
      for (let y = 2; y < h; y += cell) {
        for (let x = 2; x < w; x += cell * 0.75) {
          // ponytail: cheap sine "noise" — swap for simplex if it looks too regular
          const v = Math.sin(x * 0.011 + s) + Math.sin(y * 0.045 - s * 1.3) + Math.sin((x + y) * 0.006 + s * 0.6);
          const n = (v + 3) / 6;
          if (n > 0.62) { ctx.fillStyle = `rgba(212,207,198,${0.35 + (n - 0.62) * 1.6})`; ctx.fillText(CHARS[(x * 7 + y) % CHARS.length], x, y); }
          else { ctx.fillStyle = "rgba(81,78,75,0.55)"; ctx.fillText("/", x, y); }
        }
      }
      if (!still) raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} aria-hidden className={`block h-full w-full ${className}`} />;
}
