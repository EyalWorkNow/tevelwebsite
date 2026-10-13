"use client";
import { useEffect, useRef, useState } from "react";

// Draws every page of the PDF with pdf.js onto canvases as wide as the screen (sharp on retina, fine on a 390px phone).
export default function PdfPages({ bytes, label }: { bytes: ArrayBuffer; label: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const node = holder.current;
    if (!node) return;
    (async () => {
      try {
        // Glyphs drawn as paths (not browser fonts): the embedded Hebrew subsets render exactly, as in the CRM.
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
        const doc = await pdfjs.getDocument({ data: new Uint8Array(bytes.slice(0)), disableFontFace: true }).promise;
        if (cancelled) return;
        node.replaceChildren();
        const width = Math.max(280, node.clientWidth);
        const ratio = Math.min(window.devicePixelRatio || 1, 2.5);
        for (let number = 1; number <= doc.numPages; number += 1) {
          const page = await doc.getPage(number);
          if (cancelled) return;
          const base = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: (width / base.width) * ratio });
          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          canvas.className = "sign-page";
          canvas.setAttribute("role", "img");
          canvas.setAttribute("aria-label", `${label} – עמוד ${number} מתוך ${doc.numPages}`);
          node.appendChild(canvas);
          await page.render({ canvas, viewport }).promise;
          if (number === 1) setPages(doc.numPages);
        }
      } catch (problem) {
        console.error(problem);
        if (!cancelled) setError("לא הצלחנו להציג את המסמך בדפדפן הזה. אפשר להוריד אותו כ-PDF.");
      }
    })();
    return () => { cancelled = true; };
  }, [bytes, label]);

  return (
    <div>
      {pages === 0 && !error && <div className="sign-skeleton">טוען את המסמך…</div>}
      {/* pdf.js fills this one; React never renders children into it */}
      <div ref={holder} className="sign-pages" aria-busy={pages === 0 && !error} />
      {error && <p className="sign-error" role="alert">{error}</p>}
    </div>
  );
}
