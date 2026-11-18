"use client";
import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "./api";
import type { Meta } from "./AdminApp";
import { PlanPill, StatusPill } from "./Accounts";
import { AuditTable, type AuditRow } from "./AuditLog";
import Confirm, { type ConfirmRequest } from "./Confirm";
import { UserNotificationsPanel, type AudiencePick } from "./Notifications";
import { strongPassword } from "./CreateUser";
import { BUSINESS_TYPE_HE, PLAN_HE, PROVIDER_HE, ROLE_HE, SUB_STATUS_HE, fmtDate, fmtDateTime } from "./labels";

interface Profile {
  legalName: string; tradingName: string | null; businessType: string; taxId: string | null;
  address: { street: string; number: string; city: string; postalCode: string | null } | null;
  phone: string | null; email: string | null; website: string | null; vatReporting: string | null;
  withholdingFileNumber: string | null; section46ApprovalNumber: string | null; identityLocked: boolean;
}
interface Subscription {
  planCode: string; status: string; periodEnd: string | null; cancelAtPeriodEnd: boolean;
  billingProvider: string; renewalEnabled: boolean; compNote: string | null; active: boolean;
}
interface Business {
  businessId: string; role: string; status: string; createdAt: string; profile: Profile; subscription: Subscription | null;
  usage: { finalizedDocuments: number; finalizedDocumentsLast30Days: number; lastDocumentAt: string | null; invoicesThisMonth: number; customers: number; members: number };
}
interface UserDetail {
  user: {
    userId: string; email: string; displayName: string | null; status: string; isDemo: boolean; createdAt: string;
    hasPassword: boolean; lastActiveAt: string | null; identities: Record<string, boolean>;
    mfa: { totp: boolean; email: boolean; passkeys: number };
    sessions: { id: string; createdAt: string; lastUsedAt: string; ip: string | null; userAgent: string | null }[];
    devices: { id: string; label: string; createdAt: string; expiresAt: string | null }[];
  };
  businesses: Business[];
  audit: AuditRow[];
}

const msg = (e: unknown) => (e instanceof ApiError ? e.message : "שגיאה");

export default function AccountDrawer({ meta, userId, onClose, onNotify }: { meta: Meta; userId: string; onClose: () => void; onNotify: (a: AudiencePick) => void }) {
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);
  const [flash, setFlash] = useState("");

  const load = useCallback(() => {
    api<UserDetail>(`/users/${userId}`).then((d) => { setDetail(d); setError(""); }).catch((e) => setError(msg(e)));
  }, [userId]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && confirm === null) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, confirm]);

  const done = (text: string) => { setFlash(text); load(); };
  const u = detail?.user;

  return (
    <div className="adm-drawer-bg" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <aside className="adm-drawer" role="dialog" aria-modal="true" aria-label="פרטי חשבון">
        <div className="adm-drawer-head">
          <div>
            <p className="adm-eyebrow">חשבון</p>
            <h2 className="adm-h1" style={{ fontSize: 26 }}>{u?.displayName ?? u?.email ?? "…"}</h2>
            {u && <div className="adm-row"><span className="adm-mono adm-muted">{u.email}</span><StatusPill status={u.status} kind="user" />{u.isDemo && <span className="adm-pill adm-pill-warn">דמו</span>}</div>}
          </div>
          <div className="adm-row">
            {u && <button className="adm-btn" disabled={u.status !== "ACTIVE"} data-testid="drawer-notify"
              onClick={() => onNotify({ type: "USER", value: u.userId, label: `${u.displayName ?? u.email} (${u.email})` })}>🔔 שלח התראה</button>}
            <button className="adm-btn-ghost" onClick={onClose} aria-label="סגירה">סגירה</button>
          </div>
        </div>
        {error && <p className="adm-error" role="alert">{error}</p>}
        {flash && <p className="adm-ok" role="status">{flash}</p>}
        {u && detail && (
          <>
            <UserCard detail={detail} meta={meta} setConfirm={setConfirm} done={done} />
            {detail.businesses.map((b) => <BusinessCard key={b.businessId} b={b} meta={meta} setConfirm={setConfirm} done={done} />)}
            <AddBusiness userId={u.userId} meta={meta} done={done} disabled={u.status !== "ACTIVE"} />
            <UserNotificationsPanel userId={u.userId} onSend={() => onNotify({ type: "USER", value: u.userId, label: `${u.displayName ?? u.email} (${u.email})` })} />
            <section className="adm-card">
              <h3 className="adm-h3">פעולות אחרונות על המשתמש והעסקים שלו</h3>
              <AuditTable rows={detail.audit} />
            </section>
          </>
        )}
      </aside>
      {confirm && <Confirm request={confirm} onClose={() => setConfirm(null)} />}
    </div>
  );
}

function UserCard({ detail, meta, setConfirm, done }: { detail: UserDetail; meta: Meta; setConfirm: (c: ConfirmRequest) => void; done: (t: string) => void }) {
  const u = detail.user;
  const [name, setName] = useState(u.displayName ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const suspended = u.status !== "ACTIVE";
  const saveName = async () => {
    setError("");
    try { await api(`/users/${u.userId}`, { method: "PATCH", body: { displayName: name } }); done("השם עודכן"); }
    catch (e) { setError(msg(e)); }
  };
  const identities = Object.entries(u.identities).filter(([, v]) => v).map(([k]) => k);
  return (
    <section className="adm-card">
      <h3 className="adm-h3">מי הוא</h3>
      <dl className="adm-kv">
        <dt>נוצר</dt><dd className="adm-mono">{fmtDateTime(u.createdAt)}</dd>
        <dt>פעילות אחרונה</dt><dd className="adm-mono">{fmtDateTime(u.lastActiveAt)}</dd>
        <dt>כניסה דרך</dt><dd>{[...identities, ...(u.hasPassword ? ["סיסמה מקומית"] : [])].join(", ") || "—"}</dd>
        <dt>אימות דו-שלבי</dt><dd>{[u.mfa.email && "מייל", u.mfa.totp && "אפליקציה", u.mfa.passkeys > 0 && `${u.mfa.passkeys} מפתחות`].filter(Boolean).join(", ") || "אין"}</dd>
        <dt>חיבורים פעילים</dt><dd>{u.sessions.length} בדפדפן, {u.devices.length} מכשירים</dd>
        <dt>עסקים</dt><dd>{detail.businesses.map((b) => `${b.profile.tradingName ?? b.profile.legalName} (${ROLE_HE[b.role] ?? b.role})`).join(", ") || "—"}</dd>
      </dl>
      <hr className="adm-sep" />
      <div className="adm-grid">
        <label className="adm-field"><span>שם מלא</span>
          <div className="adm-row" style={{ flexWrap: "nowrap" }}>
            <input className="adm-input" value={name} onChange={(e) => setName(e.target.value)} />
            <button className="adm-btn-ghost" disabled={name.trim().length < 2 || name === (u.displayName ?? "")} onClick={saveName}>שמירה</button>
          </div>
        </label>
        <label className="adm-field"><span>סיסמה חדשה</span>
          <div className="adm-row" style={{ flexWrap: "nowrap" }}>
            <input className="adm-input adm-mono" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder="12 תווים לפחות" />
            <button className="adm-btn-ghost" onClick={() => setPassword(strongPassword())}>יצירה</button>
          </div>
        </label>
      </div>
      {error && <p className="adm-error" role="alert">{error}</p>}
      <div className="adm-row" style={{ marginTop: 14 }}>
        <button className="adm-btn-ghost" disabled={suspended || password.length < 12} onClick={() => setConfirm({
          title: "קביעת סיסמה", text: "הסיסמה תוחלף וכל החיבורים והמכשירים של המשתמש ינותקו. מסרו לו את הסיסמה בערוץ בטוח.", confirmLabel: "קביעה", danger: true,
          run: async () => { await api(`/users/${u.userId}/password`, { body: { mode: "set", password } }); setPassword(""); done("הסיסמה הוחלפה"); },
        })}>קביעת סיסמה</button>
        <button className="adm-btn-ghost" disabled={suspended} onClick={() => setConfirm({
          title: "שליחת קישור איפוס", text: `יישלח מייל איפוס סיסמה אל ${u.email}${meta.authMode === "supabase" ? " (דרך Supabase)" : ""}.`, confirmLabel: "שליחה",
          run: async () => { await api(`/users/${u.userId}/password`, { body: { mode: "link" } }); done("קישור איפוס נשלח"); },
        })}>שליחת קישור איפוס</button>
        <button className="adm-btn-ghost" onClick={() => setConfirm({
          title: "ניתוק כל החיבורים", text: "כל החיבורים בדפדפן ובאפליקציה ינותקו. המשתמש יוכל להתחבר שוב.", confirmLabel: "ניתוק", danger: true,
          run: async () => { await api(`/users/${u.userId}/revoke-sessions`, { body: {} }); done("החיבורים נותקו"); },
        })}>ניתוק חיבורים</button>
        {suspended ? (
          <button className="adm-btn" onClick={() => setConfirm({
            title: "הפעלת המשתמש", text: "המשתמש יוכל להתחבר שוב.", confirmLabel: "הפעלה", withReason: true,
            run: async (reason) => { await api(`/users/${u.userId}/reactivate`, { body: { reason } }); done("המשתמש הופעל"); },
          })}>הפעלת משתמש</button>
        ) : (
          <button className="adm-btn-danger" onClick={() => setConfirm({
            title: "השהיית המשתמש", text: "הכניסה תיחסם בכל הדרכים וכל החיבורים ינותקו. שום נתון לא נמחק, ואפשר להפעיל שוב בכל עת.", confirmLabel: "השהיה", withReason: true, danger: true,
            run: async (reason) => { await api(`/users/${u.userId}/suspend`, { body: { reason } }); done("המשתמש הושהה"); },
          })}>השהיית משתמש</button>
        )}
      </div>
    </section>
  );
}

function BusinessCard({ b, meta, setConfirm, done }: { b: Business; meta: Meta; setConfirm: (c: ConfirmRequest) => void; done: (t: string) => void }) {
  const p = b.profile;
  const initial = {
    legalName: p.legalName, tradingName: p.tradingName ?? "", businessType: p.businessType, taxId: p.taxId ?? "",
    phone: p.phone ?? "", email: p.email ?? "", website: p.website ?? "", vatReporting: p.vatReporting ?? "",
    street: p.address?.street ?? "", number: p.address?.number ?? "", city: p.address?.city ?? "", postalCode: p.address?.postalCode ?? "",
  };
  const [f, setF] = useState(initial);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState(b.subscription?.active ? b.subscription.planCode : "GROW");
  const [until, setUntil] = useState("");
  const [note, setNote] = useState("");
  const set = (k: keyof typeof initial) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const save = async () => {
    setError("");
    const body: Record<string, unknown> = {};
    const str = (k: keyof typeof initial, key = k) => { if (f[k] !== initial[k]) body[key] = f[k].trim() === "" ? null : f[k].trim(); };
    str("legalName"); str("tradingName"); str("taxId"); str("phone"); str("email"); str("website");
    if (f.businessType !== initial.businessType) body.businessType = f.businessType;
    if (f.vatReporting !== initial.vatReporting) body.vatReporting = f.vatReporting || null;
    if (["street", "number", "city", "postalCode"].some((k) => f[k as keyof typeof initial] !== initial[k as keyof typeof initial])) {
      body.address = f.street.trim() || f.city.trim() ? { street: f.street.trim(), number: f.number.trim(), city: f.city.trim(), postalCode: f.postalCode.trim() || null } : null;
    }
    if (Object.keys(body).length === 0) return;
    try { await api(`/businesses/${b.businessId}/profile`, { method: "PATCH", body }); done("פרטי העסק נשמרו"); }
    catch (e) { setError(msg(e)); }
  };

  const applyPlan = (overridePaid: boolean) => api(`/businesses/${b.businessId}/plan`, { body: { planCode: plan, until: until || null, note, overridePaid } });
  const s = b.subscription;
  const paidLive = s !== null && s.active && s.billingProvider !== "COMP";
  const suspended = b.status !== "ACTIVE";

  return (
    <section className="adm-card">
      <div className="adm-row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
        <h3 className="adm-h2" style={{ margin: 0 }}>{p.tradingName ?? p.legalName}</h3>
        <div className="adm-row"><StatusPill status={b.status} kind="business" /><PlanPill plan={s?.active ? s.planCode : null} /></div>
      </div>
      <dl className="adm-kv">
        <dt>תפקיד המשתמש</dt><dd>{ROLE_HE[b.role] ?? b.role}</dd>
        <dt>נפתח</dt><dd className="adm-mono">{fmtDate(b.createdAt)}</dd>
        <dt>שימוש</dt><dd>{b.usage.finalizedDocuments} מסמכים ({b.usage.finalizedDocumentsLast30Days} ב-30 יום), {b.usage.invoicesThisMonth} חשבוניות החודש, {b.usage.customers} לקוחות, {b.usage.members} חברי צוות</dd>
        <dt>מסמך אחרון</dt><dd className="adm-mono">{fmtDateTime(b.usage.lastDocumentAt)}</dd>
      </dl>

      <hr className="adm-sep" />
      <h3 className="adm-h3">פרטי העסק</h3>
      {p.identityLocked && <p className="adm-muted" style={{ fontSize: 13 }}>הופקו מסמכים: סוג העסק ומספר העוסק נעולים (מופיעים על מסמכים שהונפקו).</p>}
      <div className="adm-grid">
        <label className="adm-field"><span>שם רשמי</span><input className="adm-input" value={f.legalName} onChange={set("legalName")} /></label>
        <label className="adm-field"><span>שם מסחרי</span><input className="adm-input" value={f.tradingName} onChange={set("tradingName")} /></label>
        <label className="adm-field"><span>סוג עסק</span>
          <select className="adm-select" value={f.businessType} onChange={set("businessType")} disabled={p.identityLocked}>
            {meta.businessTypes.map((t) => <option key={t} value={t}>{BUSINESS_TYPE_HE[t] ?? t}</option>)}
          </select>
        </label>
        <label className="adm-field"><span>ח.פ / ע.מ</span><input className="adm-input adm-mono" dir="ltr" value={f.taxId} onChange={set("taxId")} disabled={p.identityLocked} /></label>
        <label className="adm-field"><span>טלפון</span><input className="adm-input adm-mono" dir="ltr" value={f.phone} onChange={set("phone")} /></label>
        <label className="adm-field"><span>מייל</span><input className="adm-input" dir="ltr" value={f.email} onChange={set("email")} /></label>
        <label className="adm-field"><span>אתר</span><input className="adm-input" dir="ltr" value={f.website} onChange={set("website")} /></label>
        <label className="adm-field"><span>דיווח מע״מ</span>
          <select className="adm-select" value={f.vatReporting} onChange={set("vatReporting")}>
            <option value="">לא הוגדר</option><option value="MONTHLY">חודשי</option><option value="BIMONTHLY">דו-חודשי</option><option value="NONE">פטור</option>
          </select>
        </label>
        <label className="adm-field"><span>רחוב</span><input className="adm-input" value={f.street} onChange={set("street")} /></label>
        <label className="adm-field"><span>מספר</span><input className="adm-input" value={f.number} onChange={set("number")} /></label>
        <label className="adm-field"><span>עיר</span><input className="adm-input" value={f.city} onChange={set("city")} /></label>
        <label className="adm-field"><span>מיקוד</span><input className="adm-input adm-mono" dir="ltr" value={f.postalCode} onChange={set("postalCode")} /></label>
      </div>
      {error && <p className="adm-error" role="alert">{error}</p>}
      <div className="adm-row" style={{ marginTop: 12 }}><button className="adm-btn" onClick={save} disabled={JSON.stringify(f) === JSON.stringify(initial)}>שמירת פרטי העסק</button></div>

      <hr className="adm-sep" />
      <h3 className="adm-h3">מנוי</h3>
      {s === null ? <p className="adm-muted">אין מנוי (העסק לא יכול להפיק מסמכים עד שייבחר מסלול).</p> : (
        <dl className="adm-kv">
          <dt>מסלול</dt><dd>{PLAN_HE[s.planCode] ?? s.planCode} · {SUB_STATUS_HE[s.status] ?? s.status}{s.active ? "" : " (לא בתוקף)"}</dd>
          <dt>מקור</dt><dd>{PROVIDER_HE[s.billingProvider] ?? s.billingProvider}{s.renewalEnabled ? " · חידוש אוטומטי" : ""}{s.cancelAtPeriodEnd ? " · יבוטל בסוף התקופה" : ""}</dd>
          <dt>בתוקף עד</dt><dd className="adm-mono">{fmtDate(s.periodEnd)}</dd>
          {s.compNote && <><dt>הערה</dt><dd>{s.compNote}</dd></>}
        </dl>
      )}
      <div className="adm-grid" style={{ marginTop: 12 }}>
        <label className="adm-field"><span>מסלול חדש</span>
          <select className="adm-select" value={plan} onChange={(e) => setPlan(e.target.value)}>
            {meta.plans.map((x) => <option key={x.code} value={x.code}>{PLAN_HE[x.code] ?? x.name} ({x.invoiceLimit === null ? "ללא הגבלה" : `${x.invoiceLimit} חשבוניות`})</option>)}
          </select>
        </label>
        <label className="adm-field"><span>עד תאריך (ריק = ללא הגבלה)</span><input className="adm-input" type="date" value={until} onChange={(e) => setUntil(e.target.value)} /></label>
        <label className="adm-field"><span>הערה</span><input className="adm-input" maxLength={200} value={note} onChange={(e) => setNote(e.target.value)} /></label>
      </div>
      <div className="adm-row" style={{ marginTop: 12 }}>
        <button className="adm-btn" onClick={() => setConfirm({
          title: "עדכון מסלול",
          text: paidLive
            ? `לעסק יש מנוי בתשלום פעיל (${PROVIDER_HE[s!.billingProvider] ?? s!.billingProvider}). המסלול יוחלף במסלול שהוענק ידנית והחידוש האוטומטי ב-Cardcom יכובה. מנוי App Store מנוהל על ידי Apple ועלול להתחדש שם.`
            : `המסלול ${PLAN_HE[plan] ?? plan} יוענק ${until ? `עד ${fmtDate(new Date(until).toISOString())}` : "ללא הגבלת זמן"}, ללא חיוב.`,
          confirmLabel: "עדכון", danger: paidLive,
          run: async () => { await applyPlan(paidLive); done("המסלול עודכן"); },
        })}>עדכון מסלול</button>
        {s?.status === "ACTIVE" && (
          <>
            {!s.cancelAtPeriodEnd && <button className="adm-btn-ghost" onClick={() => setConfirm({
              title: "ביטול בסוף התקופה", text: `המנוי לא יתחדש ויסתיים ב-${fmtDate(s.periodEnd)}.`, confirmLabel: "ביטול בסוף התקופה", withReason: true,
              run: async (reason) => { await api(`/businesses/${b.businessId}/cancel-subscription`, { body: { mode: "AT_PERIOD_END", note: reason } }); done("המנוי יבוטל בסוף התקופה"); },
            })}>ביטול בסוף התקופה</button>}
            <button className="adm-btn-danger" onClick={() => setConfirm({
              title: "ביטול מיידי", text: "המנוי יבוטל עכשיו והעסק לא יוכל להפיק מסמכים עד שייבחר מסלול. מסמכים קיימים נשמרים.", confirmLabel: "ביטול עכשיו", withReason: true, danger: true,
              run: async (reason) => { await api(`/businesses/${b.businessId}/cancel-subscription`, { body: { mode: "NOW", note: reason } }); done("המנוי בוטל"); },
            })}>ביטול מיידי</button>
          </>
        )}
      </div>

      <hr className="adm-sep" />
      <div className="adm-row">
        {suspended ? (
          <button className="adm-btn" disabled={b.status === "CLOSED"} onClick={() => setConfirm({
            title: "הפעלת העסק", text: "העסק יחזור לפעול באפליקציה.", confirmLabel: "הפעלה", withReason: true,
            run: async (reason) => { await api(`/businesses/${b.businessId}/reactivate`, { body: { reason } }); done("העסק הופעל"); },
          })}>הפעלת העסק</button>
        ) : (
          <button className="adm-btn-danger" onClick={() => setConfirm({
            title: "השהיית העסק", text: "כל הגישה לעסק באפליקציה ובממשק תיחסם, לכל חברי הצוות. המסמכים ונתוני הנהלת החשבונות נשמרים, ואפשר להפעיל שוב.", confirmLabel: "השהיה", withReason: true, danger: true,
            run: async (reason) => { await api(`/businesses/${b.businessId}/suspend`, { body: { reason } }); done("העסק הושהה"); },
          })}>השהיית העסק</button>
        )}
        <span className="adm-muted adm-mono" style={{ fontSize: 12 }}>{b.businessId}</span>
      </div>
    </section>
  );
}

function AddBusiness({ userId, meta, done, disabled }: { userId: string; meta: Meta; done: (t: string) => void; disabled: boolean }) {
  const [open, setOpen] = useState(false);
  const [legalName, setLegalName] = useState("");
  const [businessType, setBusinessType] = useState("OSEK_MURSHE");
  const [taxId, setTaxId] = useState("");
  const [error, setError] = useState("");
  if (!open) return <div className="adm-row" style={{ marginBottom: 16 }}><button className="adm-btn-ghost" disabled={disabled} onClick={() => setOpen(true)}>+ עסק נוסף למשתמש</button></div>;
  const add = async () => {
    setError("");
    try { await api(`/users/${userId}/businesses`, { body: { legalName, businessType, taxId } }); setOpen(false); setLegalName(""); setTaxId(""); done("העסק נפתח"); }
    catch (e) { setError(msg(e)); }
  };
  return (
    <section className="adm-card">
      <h3 className="adm-h3">עסק נוסף</h3>
      <div className="adm-grid">
        <label className="adm-field"><span>שם רשמי</span><input className="adm-input" value={legalName} onChange={(e) => setLegalName(e.target.value)} /></label>
        <label className="adm-field"><span>סוג</span>
          <select className="adm-select" value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
            {meta.businessTypes.map((t) => <option key={t} value={t}>{BUSINESS_TYPE_HE[t] ?? t}</option>)}
          </select>
        </label>
        <label className="adm-field"><span>ח.פ / ע.מ</span><input className="adm-input adm-mono" dir="ltr" value={taxId} onChange={(e) => setTaxId(e.target.value)} /></label>
      </div>
      {error && <p className="adm-error" role="alert">{error}</p>}
      <div className="adm-row" style={{ marginTop: 12 }}><button className="adm-btn" disabled={legalName.trim().length < 2} onClick={add}>פתיחת עסק</button><button className="adm-btn-ghost" onClick={() => setOpen(false)}>ביטול</button></div>
    </section>
  );
}
