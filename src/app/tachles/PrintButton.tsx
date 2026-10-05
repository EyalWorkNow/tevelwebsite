"use client";

export default function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn-dark">
      הורדה כ-PDF / הדפסה
    </button>
  );
}
