"use client";
import { useState } from "react";

export interface ConfirmRequest {
  title: string;
  text: string;
  confirmLabel: string;
  /** Ask for a reason (written to the audit log). */
  withReason?: boolean;
  danger?: boolean;
  run: (reason: string) => Promise<void>;
}

export default function Confirm({ request, onClose }: { request: ConfirmRequest; onClose: () => void }) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const go = async () => {
    setBusy(true); setError("");
    try { await request.run(reason.trim()); onClose(); }
    catch (e) { setError(e instanceof Error ? e.message : "שגיאה"); setBusy(false); }
  };
  return (
    <div className="adm-modal-bg" role="dialog" aria-modal="true" aria-labelledby="adm-confirm-title" onClick={(e) => { if (e.target === e.currentTarget && !busy) onClose(); }}>
      <div className="adm-modal">
        <h2 className="adm-h2" id="adm-confirm-title">{request.title}</h2>
        <p className="adm-sub" style={{ color: "var(--color-stone)" }}>{request.text}</p>
        {request.withReason && (
          <label className="adm-field"><span>סיבה (נרשמת ביומן)</span>
            <input className="adm-input" maxLength={200} value={reason} onChange={(e) => setReason(e.target.value)} autoFocus />
          </label>
        )}
        {error && <p className="adm-error" role="alert">{error}</p>}
        <div className="adm-row" style={{ marginTop: 16 }}>
          <button className={request.danger ? "adm-btn-danger" : "adm-btn"} disabled={busy} onClick={go}>{busy ? "רגע…" : request.confirmLabel}</button>
          <button className="adm-btn-ghost" disabled={busy} onClick={onClose}>ביטול</button>
        </div>
      </div>
    </div>
  );
}
