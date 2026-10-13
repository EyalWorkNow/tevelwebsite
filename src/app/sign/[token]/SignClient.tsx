"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FieldValue, RelayField, RelayManifest, Signature } from "@/lib/relay/types";
import { TevelLogo } from "@/components/icons";
import PdfPages from "./PdfPages";
import SignaturePad, { SignaturePreview } from "./SignaturePad";

export type SignModel = {
  state: "SIGN" | "VIEW" | "SIGNED" | "DECLINED" | "PREPARING";
  title: string; number: string; kindLabel: string; business: RelayManifest["business"]; signerName: string; consentText: string; contentHash: string;
  expiresAt: string; commercial: RelayManifest["commercial"]; fields: RelayField[]; values: Record<string, FieldValue>; docName: string; signedCopy: boolean; actionAt: string | null;
};

const dateText = (iso: string) => new Intl.DateTimeFormat("he-IL", { timeZone: "Asia/Jerusalem", day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso));
const dateTimeText = (iso: string) => new Intl.DateTimeFormat("he-IL", { timeZone: "Asia/Jerusalem", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

const post = async (token: string, body: Record<string, unknown>) => {
  const response = await fetch("/api/sign", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, ...body }) });
  return response;
};

const saveFile = (bytes: ArrayBuffer, name: string) => {
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url; link.download = name; document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
};

export default function SignClient({ token, model }: { token: string; model: SignModel }) {
  const [state, setState] = useState(model.state);
  const [pdf, setPdf] = useState<ArrayBuffer | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const nameField = model.fields.find((field) => field.key === "signerName" && field.type === "TEXT");
  const [values, setValues] = useState<Record<string, FieldValue>>(() => ({ ...model.values, ...(nameField && !model.values.signerName && model.signerName ? { signerName: model.signerName } : {}) }));
  const [signerName, setSignerName] = useState(model.signerName);
  const [consent, setConsent] = useState(false);
  const [pad, setPad] = useState<RelayField | null>(null);
  const [declining, setDeclining] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missing, setMissing] = useState<Set<string>>(new Set());
  const [doneAt, setDoneAt] = useState<string | null>(model.actionAt);

  // First open → "נצפתה" in the CRM (once; link previews and bots are ignored on the server).
  useEffect(() => { if (model.state === "SIGN" || model.state === "VIEW") post(token, { action: "view" }).catch(() => undefined); }, [token, model.state]);

  useEffect(() => {
    if (state === "PREPARING") { const timer = setTimeout(() => window.location.reload(), 15_000); return () => clearTimeout(timer); }
    let cancelled = false;
    // Signed and the signed copy is back: that is the document shown.
    post(token, { action: state === "SIGNED" && model.signedCopy ? "signed-pdf" : "pdf" }).then(async (response) => {
      if (cancelled) return;
      if (!response.ok) { const data = await response.json().catch(() => ({})); setPdfError(data.error ?? "לא הצלחנו לטעון את המסמך"); return; }
      setPdf(await response.arrayBuffer());
    }).catch(() => !cancelled && setPdfError("אין חיבור לאינטרנט. אפשר לנסות שוב."));
    return () => { cancelled = true; };
  }, [token, state, model.signedCopy]);

  const download = useCallback(async (signed: boolean) => {
    if (!signed && pdf) return saveFile(pdf, model.docName || "document.pdf");
    const response = await post(token, { action: signed ? "signed-pdf" : "pdf" });
    if (!response.ok) { const data = await response.json().catch(() => ({})); setError(data.error ?? "ההורדה נכשלה"); return; }
    saveFile(await response.arrayBuffer(), signed ? `${model.title || "document"} - חתום.pdf` : model.docName || "document.pdf");
  }, [pdf, token, model.docName, model.title]);

  const setValue = (key: string, value: FieldValue) => { setValues((current) => ({ ...current, [key]: value })); setMissing((current) => { const next = new Set(current); next.delete(key); return next; }); };

  const filled = (field: RelayField) => {
    const value = values[field.key];
    if (value === null || value === undefined || value === false) return false;
    return typeof value === "string" ? value.trim().length > 0 : true;
  };
  const requiredLeft = model.fields.filter((field) => field.required && !filled(field));
  const effectiveName = (nameField ? String(values.signerName ?? "") : signerName).trim();

  const submit = async () => {
    setError(null);
    if (requiredLeft.length || !effectiveName) {
      setMissing(new Set(requiredLeft.map((field) => field.key).concat(effectiveName ? [] : ["__name"])));
      setError(`חסר: ${[...(effectiveName ? [] : ["שם מלא"]), ...requiredLeft.map((field) => field.label)].join(", ")}`);
      return;
    }
    if (!consent) { setError("צריך לסמן את האישור לפני החתימה"); return; }
    setBusy(true);
    try {
      const response = await post(token, { action: "sign", values, signerName: effectiveName, consent: true, contentHash: model.contentHash });
      const data = await response.json().catch(() => ({}));
      if (data.ok) { setDoneAt(data.at); setState("SIGNED"); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
      if (data.reload) { window.location.reload(); return; }
      if (Array.isArray(data.issues)) setMissing(new Set(data.issues.map((issue: { key: string }) => issue.key)));
      setError(data.error ?? "החתימה לא נשמרה. אפשר לנסות שוב.");
    } catch { setError("אין חיבור לאינטרנט. החתימה לא נשלחה – אפשר לנסות שוב."); }
    finally { setBusy(false); }
  };

  const decline = async () => {
    setBusy(true); setError(null);
    try {
      const response = await post(token, { action: "decline", reason });
      const data = await response.json().catch(() => ({}));
      if (data.ok) { setDeclining(false); setDoneAt(data.at); setState("DECLINED"); return; }
      setError(data.error ?? "התשובה לא נשמרה. אפשר לנסות שוב.");
    } catch { setError("אין חיבור לאינטרנט. אפשר לנסות שוב."); }
    finally { setBusy(false); }
  };

  const heading = useMemo(() => [model.kindLabel, model.number].filter(Boolean).join(" "), [model.kindLabel, model.number]);
  const signing = state === "SIGN";

  return (
    <div className="sign-root">
      <header className="sign-top">
        <div className="sign-wrap">
          <div className="sign-brand"><TevelLogo className="h-7 w-auto" /></div>
          <p className="sign-eyebrow">{heading || "מסמך"} · {model.business.name || "בית תוכנה תבל"}</p>
          <h1>{model.title || heading}</h1>
          <p className="sign-meta">
            {model.commercial?.total ? <span>סה״כ {model.commercial.total}</span> : null}
            {signing ? <span>הקישור בתוקף עד {dateText(model.expiresAt)}</span> : null}
          </p>
        </div>
      </header>

      <main className="sign-wrap" id="sign-main">
        {state === "SIGNED" && (
          <section className="sign-card sign-done" role="status">
            <div className="sign-ok" aria-hidden="true">✓</div>
            <h2>{model.commercial?.kind === "QUOTE" ? "ההצעה אושרה ונחתמה" : "המסמך נחתם"}</h2>
            <p>תודה{effectiveName ? `, ${effectiveName}` : ""}! {doneAt ? `החתימה התקבלה ב-${dateTimeText(doneAt)}.` : "החתימה התקבלה."} {model.business.name || "העסק"} {model.signedCopy ? "הכין את העותק החתום:" : "יקבל אותה ויכין עותק חתום עם תעודת חתימה. העותק יופיע כאן להורדה."}</p>
            <div className="sign-actions sign-center">
              {model.signedCopy ? <button type="button" className="sign-primary" onClick={() => download(true)}>הורדת העותק החתום</button> : null}
              <button type="button" className="sign-secondary" onClick={() => download(false)}>הורדת המסמך (PDF)</button>
            </div>
          </section>
        )}
        {state === "DECLINED" && (
          <section className="sign-card sign-done" role="status">
            <h2>תודה על התשובה</h2>
            <p>{model.business.name || "העסק"} יקבל/תקבל הודעה שאינך מעוניין/ת{doneAt ? ` (${dateTimeText(doneAt)})` : ""}. אם זו טעות, אפשר לפנות ישירות לעסק.</p>
          </section>
        )}
        {state === "PREPARING" && (
          <section className="sign-card sign-done" role="status" aria-live="polite">
            <h2>המסמך בהכנה</h2>
            <p>העסק שלח את המסמך ממש עכשיו והוא נטען. הדף יתרענן לבד בעוד כמה שניות.</p>
          </section>
        )}

        {state !== "PREPARING" && (
          <section className="sign-doc" aria-label="המסמך">
            {pdf ? <PdfPages bytes={pdf} label={model.title || heading} /> : pdfError ? <p className="sign-error" role="alert">{pdfError}</p> : <div className="sign-skeleton">טוען את המסמך…</div>}
            {state !== "SIGNED" && pdf ? (
              <div className="sign-actions sign-center"><button type="button" className="sign-secondary" onClick={() => download(false)}>הורדת PDF</button></div>
            ) : null}
          </section>
        )}

        {signing && (
          <section className="sign-card" aria-labelledby="accept-title">
            <h2 id="accept-title">{model.commercial?.kind === "QUOTE" ? "אישור ההצעה" : "מילוי וחתימה"}</h2>
            {!nameField && (
              <div className={`sign-field${missing.has("__name") ? " sign-missing" : ""}`}>
                <label className="sign-label" htmlFor="signer-name">שם מלא <span aria-hidden="true">*</span></label>
                <input id="signer-name" className="sign-input" value={signerName} onChange={(event) => setSignerName(event.target.value)} maxLength={120} autoComplete="name" required />
              </div>
            )}
            {model.fields.map((field) => (
              <FieldInput key={field.key} field={field} value={values[field.key]} missing={missing.has(field.key)} onChange={(value) => setValue(field.key, value)} onSign={() => setPad(field)} />
            ))}
            <label className="sign-consent">
              <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
              <span>{model.consentText || "קראתי את המסמך ואני מאשר/ת שהחתימה כאן היא חתימה אלקטרונית שלי."}</span>
            </label>
            {error && <p className="sign-error" role="alert">{error}</p>}
            <div className="sign-actions">
              <button type="button" className="sign-primary" onClick={submit} disabled={busy} aria-busy={busy}>{busy ? "שולח…" : model.commercial?.kind === "QUOTE" ? "אישור וחתימה" : "חתימה ושליחה"}</button>
            </div>
            <p className="sign-fine">החתימה נשמרת עם זמן החתימה, סוג המכשיר וכתובת רשת חלקית, כראיה לחתימה. המסמך עצמו לא משתנה.</p>
            <div className="sign-center"><button type="button" className="sign-link" onClick={() => setDeclining(true)}>לא מעוניין/ת</button></div>
          </section>
        )}
        {!signing && error && <p className="sign-error" role="alert">{error}</p>}
        <p className="sign-fine">קישור אישי מ{model.business.name || "העסק"} · נשלח דרך מערכת התפעול של בית תוכנה תבל</p>
      </main>

      {pad && (
        <SignaturePad title={pad.label || "חתימה"} defaultName={effectiveName} onCancel={() => setPad(null)} onDone={(value: Signature) => { setValue(pad.key, value); setPad(null); }} />
      )}
      {declining && (
        <div className="sign-modal" role="dialog" aria-modal="true" aria-labelledby="decline-title">
          <div className="sign-sheet">
            <h2 id="decline-title">לא מעוניין/ת?</h2>
            <label className="sign-label" htmlFor="decline-reason">אפשר לכתוב לעסק למה (לא חובה)</label>
            <textarea id="decline-reason" className="sign-input" rows={3} value={reason} onChange={(event) => setReason(event.target.value)} maxLength={1000} />
            {error && <p className="sign-error" role="alert">{error}</p>}
            <div className="sign-actions">
              <button type="button" className="sign-danger" onClick={decline} disabled={busy}>שליחת התשובה</button>
              <button type="button" className="sign-secondary" onClick={() => setDeclining(false)}>חזרה</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FieldInput({ field, value, missing, onChange, onSign }: { field: RelayField; value: FieldValue | undefined; missing: boolean; onChange: (value: FieldValue) => void; onSign: () => void }) {
  const id = `f-${field.key}`;
  const label = <label className="sign-label" htmlFor={id}>{field.label}{field.required ? <span aria-hidden="true"> *</span> : null}</label>;
  const text = typeof value === "string" ? value : "";
  const wrap = (children: React.ReactNode) => <div className={`sign-field${missing ? " sign-missing" : ""}`}>{children}</div>;
  switch (field.type) {
    case "CHECKBOX":
      return wrap(<label className="sign-check"><input id={id} type="checkbox" checked={value === true} onChange={(event) => onChange(event.target.checked)} /><span>{field.label}{field.required ? " *" : ""}</span></label>);
    case "MULTILINE":
      return wrap(<>{label}<textarea id={id} className="sign-input" rows={3} value={text} onChange={(event) => onChange(event.target.value)} maxLength={2000} required={field.required} /></>);
    case "CHOICE":
      return wrap(<>{label}<select id={id} className="sign-input" value={text} onChange={(event) => onChange(event.target.value)} required={field.required}><option value="">בחירה…</option>{field.options.map((option) => <option key={option} value={option}>{option}</option>)}</select></>);
    case "DATE":
      return wrap(<>{label}<input id={id} className="sign-input" type="date" value={/^\d{4}-\d{2}-\d{2}$/.test(text) ? text : ""} onChange={(event) => onChange(event.target.value)} required={field.required} /></>);
    case "SIGNATURE":
    case "INITIALS":
      return wrap(<>
        <span className="sign-label" id={id}>{field.label}{field.required ? <span aria-hidden="true"> *</span> : null}</span>
        <button type="button" className={`sign-sigbtn${value ? " sign-sigdone" : ""}`} onClick={onSign} aria-describedby={id}>
          {value && typeof value === "object" ? <SignaturePreview value={value as Signature} /> : field.type === "INITIALS" ? "לחצו לראשי תיבות" : "לחצו כאן לחתימה"}
        </button>
      </>);
    case "IMAGE":
    case "STAMP":
      return wrap(<>{label}<input id={id} type="file" accept="image/png,image/jpeg" className="sign-input" onChange={(event) => { const file = event.target.files?.[0]; if (file) imageToDataUrl(file).then((dataUrl) => onChange({ kind: "IMAGE", dataUrl })).catch(() => undefined); }} />
        {value && typeof value === "object" ? <SignaturePreview value={value as Signature} /> : null}</>);
    default:
      return wrap(<>{label}<input id={id} className="sign-input" value={text} onChange={(event) => onChange(event.target.value)} maxLength={2000} required={field.required}
        inputMode={field.type === "NUMBER" || field.type === "ID_NUMBER" ? "numeric" : undefined} autoComplete={field.key === "signerName" ? "name" : "off"} /></>);
  }
}

// Photos from the phone are shrunk to ≤ 1200px JPEG so they stay under the CRM's size limit.
const imageToDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => {
    const scale = Math.min(1, 1200 / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    let quality = 0.85, data = canvas.toDataURL("image/jpeg", quality);
    while (data.length > 580_000 && quality > 0.3) { quality -= 0.15; data = canvas.toDataURL("image/jpeg", quality); }
    resolve(data);
  };
  image.onerror = reject;
  image.src = url;
});
