"use client";
import { useEffect, useRef } from "react";

// Original drifting glyph band: code marks clustered in a field of slashes.
export default function CurrencyField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cw = 12, ch = 14;
    let raf = 0, w = 0, h = 0, last = 0;
    const resize = () => {
      const dpr = devicePixelRatio || 1;
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `12px ${getComputedStyle(c).fontFamily}`;
      ctx.textBaseline = "top";
    };
    const draw = (t: number) => {
      if (t - last > 120 || !last) {
        last = t;
        ctx.clearRect(0, 0, w, h);
        const s = t / 9000;
        for (let j = 0; j * ch < h; j++) {
          for (let i = 0; i * cw < w; i++) {
            const x = i * cw + 2, y = j * ch + 2;
            const v = Math.sin(i * 0.31 + s * 3) * Math.cos(j * 0.9 - s * 2) + Math.sin(i * 0.07 - j * 0.4 + s * 5) + Math.sin((i * 13 + j * 7) * 0.37);
            if (v > 1.05) { ctx.fillStyle = "rgba(194,188,178,.75)"; ctx.fillText((i * 3 + j) % 5 < 3 ? "{" : "}", x, y); }
            else if (v > 0.75) { ctx.fillStyle = "rgba(149,144,137,.55)"; ctx.fillText("<", x, y); }
            else { ctx.fillStyle = "rgba(81,78,75,.7)"; ctx.fillText(v < -1.6 ? "·" : "/", x, y); }
          }
        }
      }
      if (!still) raf = requestAnimationFrame(draw);
    };
    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} aria-hidden className="block h-full w-full font-mono" />;
}
