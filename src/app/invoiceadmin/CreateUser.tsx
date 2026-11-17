"use client";
import { useState } from "react";
import { api, ApiError } from "./api";
import type { Meta } from "./AdminApp";
import { BUSINESS_TYPE_HE, PLAN_HE } from "./labels";

export function strongPassword(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("").replace(/^(.{4})(.{4})(.{4})(.{4})$/, "$1-$2-$3-$4");
}

const empty = {
  email: "", displayName: "", password: "", withBusiness: true,
  legalName: "", businessType: "OSEK_MURSHE", taxId: "", phone: "", bizEmail: "", street: "", number: "", city: "",
  plan: "", until: "", note: "",
};

export default function CreateUser({ meta, onCreated }: { meta: Meta; onCreated: (userId: string) => void }) {
  const [f, setF] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (key: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF({ ...f, [key]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError("");
    const profile: Record<string, unknown> = {};
    if (f.phone.trim()) profile.phone = f.phone.trim();
    if (f.bizEmail.trim()) profile.email = f.bizEmail.trim();
    if (f.street.trim() || f.city.trim()) profile.address = { street: f.street.trim(), number: f.number.trim(), city: f.city.trim() };
    try {
      const created = await api<{ userId: string }>("/users", {
        body: {
          email: f.email.trim(),
          displayName: f.displayName.trim(),
          password: f.password,
          business: f.withBusiness ? { legalName: f.legalName.trim(), businessType: f.businessType, taxId: f.taxId.trim(), profile } : null,
          plan: f.withBusiness && f.plan ? { planCode: f.plan, until: f.until || null, note: f.note.trim() } : null,
        },
      });
      setF(empty);
      onCreated(created.userId);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "שגיאה");
    } finally {
      setBusy(false);
    }
  };

  const blocked = meta.authMode === "supabase" && !meta.supabaseAdminConfigured;
  return (
    <form className="adm-card" onSubmit={submit}>
      <h2 className="adm-h2">משתמש חדש</h2>
      <p className="adm-sub">
        {meta.authMode === "supabase"
          ? "המשתמש נוצר ב-Supabase עם מייל מאומת ומקושר לחשבון תבל. מסרו לו את הסיסמה בערוץ בטוח, או שלחו לו אחר כך קישור איפוס."
          : "המשתמש נוצר עם סיסמה מקומית (סביבת פיתוח)."}
      </p>
      <h3 className="adm-h3">מי הוא</h3>
      <div className="adm-grid">
        <label className="adm-field"><span>שם מלא</span><input className="adm-input" required minLength={2} value={f.displayName} onChange={set("displayName")} /></label>
        <label className="adm-field"><span>מייל (שם משתמש)</span><input className="adm-input" dir="ltr" type="email" required value={f.email} onChange={set("email")} /></label>
        <label className="adm-field"><span>סיסמה (לפחות 12 תווים)</span>
          <div className="adm-row" style={{ flexWrap: "nowrap" }}>
            <input className="adm-input adm-mono" dir="ltr" required minLength={12} value={f.password} onChange={set("password")} autoComplete="new-password" />
            <button type="button" className="adm-btn-ghost" onClick={() => setF({ ...f, password: strongPassword() })}>יצירה</button>
          </div>
        </label>
      </div>
      <hr className="adm-sep" />
      <label className="adm-check"><input type="checkbox" checked={f.withBusiness} onChange={set("withBusiness")} /> לפתוח לו עסק (הוא יהיה הבעלים)</label>
      {f.withBusiness && (
        <>
          <div className="adm-grid" style={{ marginTop: 12 }}>
            <label className="adm-field"><span>שם העסק (רשמי)</span><input className="adm-input" required minLength={2} value={f.legalName} onChange={set("legalName")} /></label>
            <label className="adm-field"><span>סוג עסק</span>
              <select className="adm-select" value={f.businessType} onChange={set("businessType")}>
                {meta.businessTypes.map((t) => <option key={t} value={t}>{BUSINESS_TYPE_HE[t] ?? t}</option>)}
              </select>
            </label>
            <label className="adm-field"><span>ח.פ / ע.מ (לא חובה)</span><input className="adm-input adm-mono" dir="ltr" inputMode="numeric" value={f.taxId} onChange={set("taxId")} /></label>
            <label className="adm-field"><span>טלפון העסק</span><input className="adm-input adm-mono" dir="ltr" value={f.phone} onChange={set("phone")} /></label>
            <label className="adm-field"><span>מייל העסק</span><input className="adm-input" dir="ltr" type="email" value={f.bizEmail} onChange={set("bizEmail")} /></label>
            <label className="adm-field"><span>רחוב</span><input className="adm-input" value={f.street} onChange={set("street")} /></label>
            <label className="adm-field"><span>מספר</span><input className="adm-input" value={f.number} onChange={set("number")} /></label>
            <label className="adm-field"><span>עיר</span><input className="adm-input" value={f.city} onChange={set("city")} /></label>
          </div>
          <h3 className="adm-h3" style={{ marginTop: 16 }}>מנוי</h3>
          <div className="adm-grid">
            <label className="adm-field"><span>מסלול</span>
              <select className="adm-select" value={f.plan} onChange={set("plan")}>
                <option value="">בלי מסלול (יבחר בעצמו באפליקציה)</option>
                {meta.plans.map((p) => <option key={p.code} value={p.code}>{PLAN_HE[p.code] ?? p.name}</option>)}
              </select>
            </label>
            {f.plan && <label className="adm-field"><span>עד תאריך (ריק = ללא הגבלה)</span><input className="adm-input" type="date" value={f.until} onChange={set("until")} /></label>}
            {f.plan && <label className="adm-field"><span>הערה</span><input className="adm-input" maxLength={200} value={f.note} onChange={set("note")} placeholder="למשל: פיילוט" /></label>}
          </div>
        </>
      )}
      {error && <p className="adm-error" role="alert">{error}</p>}
      <div className="adm-row" style={{ marginTop: 18 }}>
        <button className="adm-btn" disabled={busy || blocked}>{busy ? "יוצר…" : "יצירת משתמש"}</button>
      </div>
    </form>
  );
}
