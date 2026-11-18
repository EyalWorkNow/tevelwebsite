"use client";
// "התראות" → "התראות מערכת": the code-defined pushes of the invoicing app in one list. The admin
// can edit wording (with the push's own {variables}), image, target screen and switch a push off —
// security pushes are locked, account (subscription) pushes stay on. Defaults live in code;
// "שחזור ברירת מחדל" clears the override. Server: /platform-admin/notifications/system/*.
/* eslint-disable @next/next/no-img-element */
import { Fragment, useCallback, useEffect, useState } from "react";
import { api, ApiError } from "./api";
import { fmtDateTime } from "./labels";

interface Row {
  key: string; path: "catalogue" | "mobile"; kind: string; category: string; title: string; body: string; link: string;
  variables: { key: string; label: string; sample: string }[]; locked: boolean; canDisable: boolean; inUse: boolean; note: string | null; foregroundText: string;
  override: { enabled: boolean; title: string | null; body: string | null; route: string | null; imageId: string | null; version: number; updatedBy: string; updatedAt: string } | null;
  image: { url: string | null; expired: boolean } | null;
  effective: { enabled: boolean; title: string; body: string; route: string | null };
}
const CATEGORY_HE: Record<string, string> = { DOCUMENTS: "מסמכים", PAYMENTS: "תשלומים", CUSTOMERS: "לקוחות", TEAM: "צוות", SUBSCRIPTION: "מנוי", REPORTS: "דוחות", SECURITY: "אבטחה", BUSINESS: "התראות העסק" };
const errText = (e: unknown) => (e instanceof ApiError ? (e.code === "SYSTEM_PUSH_LOCKED" ? "התראה נעולה: אי אפשר לשנות אותה." : e.message) : "שגיאה");
const fill = (t: string, vars: Row["variables"]) => t.replace(/\{(\w+)\}/g, (_, k: string) => vars.find((v) => v.key === k)?.sample ?? "");

export default function SystemPushes() {
  const [data, setData] = useState<{ rows: Row[]; routes: { route: string; label: string }[]; foregroundNote: string } | null>(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const load = useCallback(() => {
    api<{ rows: Row[]; routes: { route: string; label: string }[]; foregroundNote: string }>("/notifications/system").then(setData).catch((e) => setError(errText(e)));
  }, []);
  useEffect(load, [load]);
  if (!data) return error ? <p className="adm-error">{error}</p> : <p className="adm-muted">טוען…</p>;
  return (
    <section className="adm-card">
      <h2 className="adm-h2" style={{ margin: 0 }}>התראות מערכת</h2>
      <p className="adm-muted" style={{ fontSize: 13 }}>
        ההתראות שהאפליקציה שולחת לבד (תשלום התקבל, הצעה אושרה, מסמך לחתימה, תזכורות…). אפשר לשנות נוסח, תמונה ומסך, או לכבות. התראות אבטחה נעולות.
      </p>
      <p className="adm-card" style={{ fontSize: 13, borderColor: "var(--color-amber)" }}>{data.foregroundNote}</p>
      {error && <p className="adm-error">{error}</p>}
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead><tr><th>התראה</th><th>קטגוריה</th><th>מצב</th><th>עודכן</th></tr></thead>
          <tbody>
            {data.rows.map((r) => (
              <Fragment key={r.key}>
                <tr onClick={() => setOpen(open === r.key ? null : r.key)}>
                  <td style={{ minWidth: 240 }}>
                    <strong>{r.effective.title}</strong>
                    <div className="adm-muted" style={{ fontSize: 13 }}>{r.effective.body}</div>
                    <div className="adm-row" style={{ marginTop: 4 }}>
                      {r.override && (r.override.title || r.override.body || r.override.route || r.override.imageId) && <span className="adm-pill adm-pill-warn">נערכה</span>}
                      {r.locked && <span className="adm-pill">🔒 נעולה</span>}
                      {!r.locked && !r.canDisable && <span className="adm-pill">תמיד פועלת</span>}
                      {!r.inUse && <span className="adm-pill">לא נשלחת כרגע</span>}
                      <span className="adm-mono adm-muted" style={{ fontSize: 11 }}>{r.key}</span>
                    </div>
                  </td>
                  <td>{CATEGORY_HE[r.category] ?? r.category}</td>
                  <td>{r.effective.enabled ? <span className="adm-pill adm-pill-ok">פועלת</span> : <span className="adm-pill adm-pill-bad">כבויה</span>}</td>
                  <td className="adm-mono" style={{ fontSize: 12 }}>{r.override ? <>{fmtDateTime(r.override.updatedAt)}<br /><span className="adm-muted">{r.override.updatedBy}</span></> : "ברירת מחדל"}</td>
                </tr>
                {open === r.key && <tr style={{ cursor: "default" }}><td colSpan={4}><Editor row={r} routes={data.routes} onSaved={load} /></td></tr>}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Editor({ row, routes, onSaved }: { row: Row; routes: { route: string; label: string }[]; onSaved: () => void }) {
  const [title, setTitle] = useState(row.override?.title ?? row.title);
  const [body, setBody] = useState(row.override?.body ?? row.body);
  const [route, setRoute] = useState(row.override?.route ?? "");
  const [enabled, setEnabled] = useState(row.effective.enabled);
  const [image, setImage] = useState<{ id: string; url: string } | null>(row.override?.imageId && row.image?.url ? { id: row.override.imageId, url: row.image.url } : null);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");
  if (row.locked) return <p className="adm-muted">התראת אבטחה: נשלחת תמיד בנוסח הקבוע ({row.title} — {row.body}).</p>;
  const save = async () => {
    setError(""); setFlash("");
    try {
      await api(`/notifications/system/${encodeURIComponent(row.key)}`, {
        method: "PATCH",
        body: { enabled, title: title === row.title ? null : title, body: body === row.body ? null : body, route: route || null, imageId: image?.id ?? null },
      });
      setFlash("נשמר."); onSaved();
    } catch (e) { setError(errText(e)); }
  };
  const restore = async () => {
    if (!window.confirm("להחזיר את הנוסח, המסך והתמונה של ברירת המחדל ולהפעיל?")) return;
    try { await api(`/notifications/system/${encodeURIComponent(row.key)}/restore`, { body: {} }); onSaved(); } catch (e) { setError(errText(e)); }
  };
  const upload = async (file: File | undefined) => {
    if (!file) return;
    try {
      const dataBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).replace(/^data:[^,]*,/, ""));
        reader.onerror = () => reject(new Error("read"));
        reader.readAsDataURL(file);
      });
      setImage((await api<{ image: { id: string; url: string } }>("/notifications/images", { body: { dataBase64 } })).image);
    } catch (e) { setError(errText(e)); }
  };
  return (
    <div className="adm-notif" style={{ marginTop: 6 }}>
      <div className="adm-notif-form">
        <div className="adm-row" style={{ marginBottom: 8 }}>
          {row.variables.map((v) => <button key={v.key} className="adm-tab" style={{ padding: "4px 10px", fontSize: 13 }} onClick={() => setBody((b) => `${b} {${v.key}}`)} title={`לדוגמה: ${v.sample}`}>{v.label}</button>)}
          {row.variables.length === 0 && <span className="adm-muted" style={{ fontSize: 13 }}>אין משתנים להתראה הזו.</span>}
        </div>
        <label className="adm-field"><span>כותרת (עד 60)</span><input className="adm-input" value={title} onChange={(e) => setTitle(e.target.value)} /></label>
        <label className="adm-field"><span>תוכן (עד 180)</span><textarea className="adm-textarea" rows={2} value={body} onChange={(e) => setBody(e.target.value)} /></label>
        <label className="adm-field"><span>מסך שייפתח</span>
          <select className="adm-select" value={route} onChange={(e) => setRoute(e.target.value)}>
            <option value="">ברירת המחדל ({row.link})</option>
            {routes.map((r) => <option key={r.route} value={r.route}>{r.label}</option>)}
          </select>
        </label>
        <div className="adm-field"><span>תמונה (מגרסה 16; נשמרת 90 יום, אחר כך נשלחת בלי תמונה)</span>
          <div className="adm-row"><input type="file" accept="image/jpeg,image/png,image/gif" onChange={(e) => void upload(e.target.files?.[0])} aria-label="תמונה" />{image && <button className="adm-link" onClick={() => setImage(null)}>הסרה</button>}</div>
        </div>
        <label className="adm-check"><input type="checkbox" checked={enabled} disabled={!row.canDisable} onChange={(e) => setEnabled(e.target.checked)} />פועלת{!row.canDisable && " (התראת חשבון — תמיד פועלת)"}</label>
        {row.note && <p className="adm-muted" style={{ fontSize: 13 }}>{row.note}</p>}
        <p className="adm-muted" style={{ fontSize: 13 }}>כשהאפליקציה פתוחה על העסק היא מציגה במקום זה: &quot;{row.foregroundText}&quot;.</p>
        {error && <p className="adm-error">{error}</p>}
        {flash && <p className="adm-ok">{flash}</p>}
        <div className="adm-row">
          <button className="adm-btn" onClick={() => void save()}>שמירה</button>
          <button className="adm-btn-ghost" onClick={() => void restore()}>שחזור ברירת מחדל</button>
        </div>
      </div>
      <aside className="adm-notif-side">
        <div className="adm-phone"><div className="adm-phone-screen">
          <div className="adm-phone-banner">
            <div className="adm-phone-head"><span className="adm-phone-icon" aria-hidden="true">ת</span><span>תבל חשבוניות</span><span className="adm-phone-now">עכשיו</span></div>
            <div className="adm-phone-body"><div style={{ minWidth: 0, flex: 1 }}><strong>{fill(title, row.variables)}</strong><p>{fill(body, row.variables)}</p></div>
              {image && <img className="adm-phone-thumb" src={image.url} alt="" />}</div>
          </div>
          <div className="adm-phone-meta">{enabled ? "פועלת" : "כבויה — לא תישלח"}</div>
        </div></div>
      </aside>
    </div>
  );
}
