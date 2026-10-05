"use client";

export default function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="label rounded-full border border-line-2 px-3.5 py-2 transition-colors hover:border-brand">
      הורדה כ-PDF / הדפסה
    </button>
  );
}
