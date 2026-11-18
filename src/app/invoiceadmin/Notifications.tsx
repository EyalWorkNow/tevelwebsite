"use client";
// "התראות": compose a push notification for the Tevel invoicing app (title, subtitle, body, image,
// screen, sound, badge, interruption level, grouping, replace, expiry, priority, "חשוב"), pick the
// audience (everyone / plan / business type / one business / one user), preview who it reaches,
// confirm, send now or at an Israel time; templates; history with delivery counts.
// Server: /platform-admin/notifications/* (invoice repo, docs/operations/PLATFORM-ADMIN.md).
// Images come from the invoice API host (CSP img-src), so plain <img>, not next/image.
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useState } from "react";
import { api, ApiError } from "./api";
import type { AccountRow } from "./Accounts";
import { BUSINESS_TYPE_HE, PLAN_HE, fmtDateTime } from "./labels";

interface Capability { supported: boolean; note: string }
export interface NotifMeta {
  routes: { route: string; label: string }[];
  plans: string[];
  businessTypes: string[];
  titleMax: number;
  bodyMax: number;
  broadcastWindowMinutes: number;
  maxScheduleDays: number;
  confirmWord: string;
  importantWord: string;
  defaultThreadId: string;
  ttl: { min: number; max: number; default: number };
  capabilities: Record<string, Capability>;
  image: { maxBytes: number; maxSide: number; retentionDays: number; types: string[] };
  adminIsAppUser: boolean;
}
interface UploadedImage { id: string; url: string; width: number; height: number; bytes: number; expiresAt: string }
export interface AudiencePick { type: "ALL" | "PLAN" | "BUSINESS_TYPE" | "BUSINESS" | "USER"; value: string | null; label: string }
interface Preview { users: number; businesses: number; optedOut: number; noDevice: number; devices: number; deferredQuiet: number; quietUntil: string | null; broadcast: boolean }
interface Announcement {
  id: string; title: string; subtitle: string | null; body: string; route: string; audienceType: string; audienceValue: string | null;
  inFeed: boolean; isTest: boolean; important: boolean; status: string; scheduledFor: string; createdBy: string; createdAt: string;
  sentAt: string | null; cancelledAt: string | null; targetedUsers: number | null; devices: number | null; optedOut: number | null;
  noDevice: number | null; deferredQuiet: number | null; imageUrl: string | null; templateId: string | null; templateVersion: number | null;
  delivery: { pending: number; delivered: number; failed: number }; openedInApp: number; lastError: string | null;
}
interface Template {
  id: string; name: string; version: number; title: string; subtitle: string | null; body: string; route: string; imageId: string | null;
  inFeed: boolean; sound: boolean; badge: number | null; interruptionLevel: "passive" | "active"; threadId: string | null; collapseKey: string | null;
  ttlSeconds: number; priority: 5 | 10; variables: string[]; image: UploadedImage | null; updatedAt: string;
}

const msg = (e: unknown) => (e instanceof ApiError ? e.message : "שגיאה");
const NOTIF_ERRORS: Record<string, string> = {
  ANNOUNCEMENT_RATE_LIMITED: "אפשר לשלוח הודעה רחבה אחת בכל 10 דקות.",
  ANNOUNCEMENT_NOT_SCHEDULED: "אפשר לבטל רק שליחה מתוזמנת שעוד לא יצאה.",
  CONFIRMATION_REQUIRED: "חסר אישור.",
  ADMIN_NOT_APP_USER: "המייל שלך לא רשום כמשתמש באפליקציה, ולכן אין לאן לשלוח בדיקה. אפשר להיכנס לאפליקציה עם המייל הזה (או ליצור משתמש כזה) ואז לנסות שוב.",
  IMAGE_INVALID: "אפשר להעלות רק תמונת JPEG, PNG או GIF תקינה.",
  IMAGE_TOO_LARGE: "התמונה גדולה מדי (עד 5MB ועד 2048×2048 פיקסלים).",
};
const errText = (e: unknown) => (e instanceof ApiError && NOTIF_ERRORS[e.code] ? NOTIF_ERRORS[e.code] : msg(e));

const TTL_OPTIONS: [number, string][] = [[3600, "שעה"], [21600, "6 שעות"], [86400, "יום"], [259200, "3 ימים"], [604800, "שבוע"], [2419200, "4 שבועות"]];
const STATUS_HE: Record<string, [string, string]> = {
  SCHEDULED: ["מתוזמנת", "adm-pill adm-pill-warn"], SENDING: ["נשלחת", "adm-pill adm-pill-warn"], SENT: ["נשלחה", "adm-pill adm-pill-ok"],
  CANCELLED: ["בוטלה", "adm-pill"], FAILED: ["נכשלה", "adm-pill adm-pill-bad"],
};

export function audienceText(type: string, value: string | null, label?: string): string {
  if (type === "ALL") return "כל המשתמשים";
  if (type === "PLAN") return `מסלול: ${PLAN_HE[value ?? ""] ?? value}`;
  if (type === "BUSINESS_TYPE") return `סוג עסק: ${BUSINESS_TYPE_HE[value ?? ""] ?? value}`;
  if (type === "BUSINESS") return label ? `עסק: ${label}` : "עסק אחד";
  return label ? `משתמש: ${label}` : "משתמש אחד";
}

interface Draft {
  title: string; subtitle: string; body: string; route: string; image: UploadedImage | null; sound: boolean;
  badgeMode: "leave" | "clear" | "set"; badge: number; interruptionLevel: "passive" | "active"; threadId: string; collapseKey: string;
  ttlSeconds: number; priority: 5 | 10; inFeed: boolean; important: boolean; when: "now" | "later"; scheduledFor: string; templateId: string | null;
}
const EMPTY: Draft = {
  title: "", subtitle: "", body: "", route: "/home", image: null, sound: true, badgeMode: "leave", badge: 1, interruptionLevel: "active",
  threadId: "", collapseKey: "", ttlSeconds: 259200, priority: 10, inFeed: true, important: false, when: "now", scheduledFor: "", templateId: null,
};

function israelNowLocal(offsetMinutes: number): string {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jerusalem", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .formatToParts(new Date(Date.now() + offsetMinutes * 60_000)).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

function payloadOf(d: Draft) {
  return {
    title: d.title, subtitle: d.subtitle.trim() || null, body: d.body, route: d.route, imageId: d.image?.id ?? null, sound: d.sound,
    badge: d.badgeMode === "leave" ? null : d.badgeMode === "clear" ? 0 : d.badge, interruptionLevel: d.interruptionLevel,
    threadId: d.threadId.trim() || null, collapseKey: d.collapseKey.trim() || null, ttlSeconds: d.ttlSeconds, priority: d.priority, inFeed: d.inFeed,
  };
}

/** `preset` (from an account's "send to this user") seeds the audience; the parent remounts on change. */
export default function Notifications({ preset }: { preset: AudiencePick | null }) {
  const [meta, setMeta] = useState<NotifMeta | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<{ total: number; rows: Announcement[] } | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [audience, setAudience] = useState<AudiencePick>(() => preset ?? { type: "USER", value: null, label: "" });
  const [flash, setFlash] = useState("");
  const [confirm, setConfirm] = useState<{ preview: Preview } | null>(null);
  const [busy, setBusy] = useState(false);

  const loadHistory = useCallback(() => {
    api<{ total: number; rows: Announcement[] }>("/notifications?limit=50").then(setHistory).catch((e) => setError(errText(e)));
  }, []);
  const loadTemplates = useCallback(() => {
    api<{ rows: Template[] }>("/notifications/templates").then((r) => setTemplates(r.rows)).catch(() => undefined);
  }, []);
  useEffect(() => {
    api<NotifMeta>("/notifications/meta").then((m) => { setMeta(m); setDraft((d) => ({ ...d, ttlSeconds: m.ttl.default })); }).catch((e) => setError(errText(e)));
    loadHistory(); loadTemplates();
  }, [loadHistory, loadTemplates]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const hasVariable = /\{[^{}]*\}/.test(`${draft.title} ${draft.subtitle} ${draft.body}`);
  const audienceReady = audience.type === "ALL" || audience.value !== null;
  const contentReady = draft.title.trim().length >= 2 && draft.body.trim().length >= 2 && !hasVariable && (draft.when === "now" || draft.scheduledFor !== "");

  const openPreview = async () => {
    setError(""); setFlash(""); setBusy(true);
    try {
      const p = await api<Preview>("/notifications/preview", { body: { audience: { type: audience.type, value: audience.value }, important: draft.important } });
      setConfirm({ preview: p });
    } catch (e) { setError(errText(e)); } finally { setBusy(false); }
  };
  const sendTest = async () => {
    setError(""); setFlash(""); setBusy(true);
    try {
      const r = await api<{ announcement: Announcement }>("/notifications/test", { body: { ...payloadOf(draft) } });
      setFlash(`בדיקה נשלחה ל-${r.announcement.devices ?? 0} מכשירים שלך.`); loadHistory();
    } catch (e) { setError(errText(e)); } finally { setBusy(false); }
  };
  const send = async (words: { confirmWord: string; importantWord: string }) => {
    const r = await api<{ announcement: Announcement }>("/notifications", {
      body: {
        ...payloadOf(draft), audience: { type: audience.type, value: audience.value }, important: draft.important, templateId: draft.templateId,
        scheduledFor: draft.when === "later" ? draft.scheduledFor : null, confirm: true, ...words,
      },
    });
    const a = r.announcement;
    setFlash(a.status === "SCHEDULED" ? `ההתראה תוזמנה ל-${fmtDateTime(a.scheduledFor)}.` : `ההתראה נשלחה: ${a.targetedUsers ?? 0} משתמשים, ${a.devices ?? 0} מכשירים.`);
    setDraft((d) => ({ ...EMPTY, ttlSeconds: d.ttlSeconds }));
    loadHistory();
  };
  const loadTemplate = (id: string) => {
    const t = templates.find((x) => x.id === id);
    if (!t) return;
    setDraft((d) => ({
      ...d, title: t.title, subtitle: t.subtitle ?? "", body: t.body, route: t.route, image: t.image, sound: t.sound,
      badgeMode: t.badge === null ? "leave" : t.badge === 0 ? "clear" : "set", badge: t.badge && t.badge > 0 ? t.badge : 1,
      interruptionLevel: t.interruptionLevel, threadId: t.threadId ?? "", collapseKey: t.collapseKey ?? "", ttlSeconds: t.ttlSeconds,
      priority: t.priority, inFeed: t.inFeed, templateId: t.id,
    }));
  };
  const saveTemplate = async () => {
    const name = window.prompt("שם התבנית", templates.find((t) => t.id === draft.templateId)?.name ?? draft.title);
    if (!name) return;
    setError("");
    try {
      const existing = templates.find((t) => t.id === draft.templateId && t.name === name);
      const r = await api<{ template: Template }>(existing ? `/notifications/templates/${existing.id}` : "/notifications/templates", { method: existing ? "PATCH" : "POST", body: { name, ...payloadOf(draft) } });
      set("templateId", r.template.id); setFlash(`התבנית "${r.template.name}" נשמרה (גרסה ${r.template.version}).`); loadTemplates();
    } catch (e) { setError(errText(e)); }
  };

  if (!meta) return error ? <p className="adm-error" role="alert">{error}</p> : <p className="adm-muted">טוען…</p>;

  return (
    <>
      <div className="adm-notif">
        <section className="adm-card adm-notif-form">
          <div className="adm-row" style={{ justifyContent: "space-between" }}>
            <h2 className="adm-h2" style={{ margin: 0 }}>התראה חדשה</h2>
            <div className="adm-row">
              <select className="adm-select" style={{ width: "auto" }} value={draft.templateId ?? ""} onChange={(e) => (e.target.value ? loadTemplate(e.target.value) : set("templateId", null))} aria-label="תבנית">
                <option value="">בלי תבנית</option>
                {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <button className="adm-btn-ghost" onClick={saveTemplate} disabled={draft.title.trim().length < 2 || draft.body.trim().length < 2}>שמירה כתבנית</button>
            </div>
          </div>
          <Content draft={draft} set={set} meta={meta} setError={setError} />
          {hasVariable && <p className="adm-error">בשליחה ידנית אין משתנים כמו {"{firstName}"}. הם יתמלאו רק בהתראות אוטומטיות (בקרוב). צריך לכתוב את הטקסט המלא.</p>}
          <hr className="adm-sep" />
          <Presentation draft={draft} set={set} meta={meta} />
          <hr className="adm-sep" />
          <h3 className="adm-h3">למי</h3>
          <AudiencePicker meta={meta} value={audience} onChange={setAudience} />
          <hr className="adm-sep" />
          <h3 className="adm-h3">מתי</h3>
          <div className="adm-row">
            <label className="adm-check"><input type="radio" name="when" checked={draft.when === "now"} onChange={() => set("when", "now")} />עכשיו</label>
            <label className="adm-check"><input type="radio" name="when" checked={draft.when === "later"} onChange={() => { set("when", "later"); if (!draft.scheduledFor) set("scheduledFor", israelNowLocal(60)); }} />בזמן מתוזמן (שעון ישראל)</label>
            {draft.when === "later" && <input className="adm-input adm-mono" style={{ width: "auto" }} type="datetime-local" min={israelNowLocal(2)} max={israelNowLocal(meta.maxScheduleDays * 1440)} value={draft.scheduledFor} onChange={(e) => set("scheduledFor", e.target.value)} aria-label="מועד שליחה" />}
          </div>
          <p className="adm-muted" style={{ fontSize: 13 }}>
            ברירת המחדל מכבדת את המשתמשים: מי שכיבה &quot;הודעות מצוות תבל&quot; באפליקציה לא יקבל התראה (רק פריט ב&quot;עדכונים&quot;), ובשעות השקט (22:00–08:00, שבת וחג) ההתראה תחכה לבוקר.
          </p>
          {error && <p className="adm-error" role="alert">{error}</p>}
          {flash && <p className="adm-ok" role="status">{flash}</p>}
          <div className="adm-row" style={{ marginTop: 12 }}>
            <button className="adm-btn" disabled={busy || !contentReady || !audienceReady} onClick={openPreview}>{busy ? "רגע…" : "בדיקת קהל ושליחה"}</button>
            <button className="adm-btn-ghost" disabled={busy || !contentReady || !meta.adminIsAppUser} onClick={sendTest} title={meta.adminIsAppUser ? "" : NOTIF_ERRORS.ADMIN_NOT_APP_USER}>שליחת בדיקה אליי</button>
          </div>
          {!meta.adminIsAppUser && <p className="adm-muted" style={{ fontSize: 13 }}>{NOTIF_ERRORS.ADMIN_NOT_APP_USER}</p>}
        </section>
        <aside className="adm-notif-side">
          <PhonePreview draft={draft} meta={meta} />
        </aside>
      </div>
      <History data={history} reload={loadHistory} />
      {confirm && <SendConfirm preview={confirm.preview} audience={audience} draft={draft} meta={meta} onClose={() => setConfirm(null)} onSend={send} />}
    </>
  );
}

function Counter({ value, max }: { value: string; max: number }) {
  const n = [...value].length;
  return <small className={n > max ? "adm-error" : "adm-muted"} style={{ margin: 0 }}>{n}/{max}</small>;
}

function Content({ draft, set, meta, setError }: { draft: Draft; set: <K extends keyof Draft>(k: K, v: Draft[K]) => void; meta: NotifMeta; setError: (s: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const upload = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    if (file.size > meta.image.maxBytes) { setError(NOTIF_ERRORS.IMAGE_TOO_LARGE); return; }
    setUploading(true);
    try {
      const dataBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).replace(/^data:[^,]*,/, ""));
        reader.onerror = () => reject(new Error("read"));
        reader.readAsDataURL(file);
      });
      const r = await api<{ image: UploadedImage }>("/notifications/images", { body: { dataBase64 } });
      set("image", r.image);
    } catch (e) { setError(errText(e)); } finally { setUploading(false); }
  };
  return (
    <div className="adm-grid" style={{ gridTemplateColumns: "1fr", marginTop: 12 }}>
      <label className="adm-field"><span className="adm-row" style={{ justifyContent: "space-between" }}>כותרת <Counter value={draft.title} max={meta.titleMax} /></span>
        <input className="adm-input" value={draft.title} maxLength={meta.titleMax + 10} onChange={(e) => set("title", e.target.value)} placeholder="למשל: חדש בתבל" />
      </label>
      <label className="adm-field"><span className="adm-row" style={{ justifyContent: "space-between" }}>כותרת משנה (רשות) <Counter value={draft.subtitle} max={meta.titleMax} /></span>
        <input className="adm-input" value={draft.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
      </label>
      <label className="adm-field"><span className="adm-row" style={{ justifyContent: "space-between" }}>תוכן <Counter value={draft.body} max={meta.bodyMax} /></span>
        <textarea className="adm-textarea" rows={3} value={draft.body} onChange={(e) => set("body", e.target.value)} placeholder="בלי סכומים, מספרי זהות או פרטים אישיים: ההתראה מוצגת גם על מסך נעול" />
      </label>
      <label className="adm-field"><span>מסך שייפתח</span>
        <select className="adm-select" value={draft.route} onChange={(e) => set("route", e.target.value)}>
          {meta.routes.map((r) => <option key={r.route} value={r.route}>{r.label}</option>)}
        </select>
        <small className="adm-muted">{meta.capabilities.route?.note}</small>
      </label>
      <div className="adm-field"><span>תמונה (רשות)</span>
        <div className="adm-row">
          <input key={draft.image?.id ?? "none"} type="file" accept="image/jpeg,image/png,image/gif" disabled={uploading} onChange={(e) => void upload(e.target.files?.[0])} aria-label="העלאת תמונה" />
          {uploading && <span className="adm-muted">מעלה…</span>}
          {draft.image && <><span className="adm-mono adm-muted">{draft.image.width}×{draft.image.height}</span><button className="adm-link" onClick={() => set("image", null)}>הסרה</button></>}
        </div>
        <small className="adm-muted">JPEG / PNG / GIF, עד 5MB ו-{meta.image.maxSide}px. נשמרת {meta.image.retentionDays} יום. {meta.capabilities.image?.note}</small>
      </div>
    </div>
  );
}

function Presentation({ draft, set, meta }: { draft: Draft; set: <K extends keyof Draft>(k: K, v: Draft[K]) => void; meta: NotifMeta }) {
  const cap = meta.capabilities;
  return (
    <details className="adm-notif-adv" open>
      <summary className="adm-h3" style={{ cursor: "pointer" }}>איך ההתראה תתנהג</summary>
      <div className="adm-grid" style={{ marginTop: 10 }}>
        <label className="adm-field"><span>צליל</span>
          <select className="adm-select" value={draft.sound ? "1" : "0"} onChange={(e) => set("sound", e.target.value === "1")}>
            <option value="1">צליל רגיל</option><option value="0">שקט</option>
          </select>
        </label>
        <label className="adm-field"><span>רמת הפרעה</span>
          <select className="adm-select" value={draft.interruptionLevel} onChange={(e) => set("interruptionLevel", e.target.value as Draft["interruptionLevel"])}>
            <option value="active">רגילה</option>
            <option value="passive">שקטה (בלי להדליק מסך)</option>
            <option value="time-sensitive" disabled>דחופה (Time Sensitive) — לא נתמך</option>
          </select>
          <small className="adm-muted">{cap.interruptionTimeSensitive?.note}</small>
        </label>
        <label className="adm-field"><span>מספר על סמל האפליקציה</span>
          <div className="adm-row" style={{ flexWrap: "nowrap" }}>
            <select className="adm-select" value={draft.badgeMode} onChange={(e) => set("badgeMode", e.target.value as Draft["badgeMode"])}>
              <option value="leave">לא לשנות</option><option value="clear">לאפס</option><option value="set">לקבוע</option>
            </select>
            {draft.badgeMode === "set" && <input className="adm-input adm-mono" type="number" min={1} max={99} style={{ width: 80 }} value={draft.badge} onChange={(e) => set("badge", Math.max(1, Math.min(99, Number(e.target.value) || 1)))} aria-label="מספר" />}
          </div>
          {draft.badgeMode === "set" && <small className="adm-error" style={{ margin: 0 }}>{cap.badge?.note}</small>}
        </label>
        <label className="adm-field"><span>תוקף (אם הטלפון לא מחובר)</span>
          <select className="adm-select" value={draft.ttlSeconds} onChange={(e) => set("ttlSeconds", Number(e.target.value))}>
            {TTL_OPTIONS.map(([s, l]) => <option key={s} value={s}>{l}</option>)}
          </select>
        </label>
        <label className="adm-field"><span>עדיפות</span>
          <select className="adm-select" value={draft.priority} onChange={(e) => set("priority", Number(e.target.value) as 5 | 10)}>
            <option value={10}>מיד (10)</option><option value={5}>חוסך סוללה (5)</option>
          </select>
        </label>
        <label className="adm-field"><span>קיבוץ (thread id)</span>
          <input className="adm-input adm-mono" dir="ltr" placeholder={meta.defaultThreadId} maxLength={40} value={draft.threadId} onChange={(e) => set("threadId", e.target.value.replace(/[^A-Za-z0-9_-]/g, ""))} />
        </label>
        <label className="adm-field"><span>מחליפה התראה קודמת עם המפתח</span>
          <input className="adm-input adm-mono" dir="ltr" placeholder="ללא" maxLength={40} value={draft.collapseKey} onChange={(e) => set("collapseKey", e.target.value.replace(/[^A-Za-z0-9_-]/g, ""))} />
        </label>
      </div>
      <div className="adm-row" style={{ marginTop: 12, gap: 18 }}>
        <label className="adm-check"><input type="checkbox" checked={draft.inFeed} onChange={(e) => set("inFeed", e.target.checked)} />להוסיף גם ל&quot;עדכונים&quot; באפליקציה</label>
        <label className="adm-check"><input type="checkbox" checked={draft.important} onChange={(e) => set("important", e.target.checked)} />חשוב: לשלוח גם בשעות השקט ולמי שכיבה הודעות</label>
      </div>
      {draft.important && <p className="adm-muted" style={{ fontSize: 13, color: "var(--color-amber)" }}>רק לתקלה או שינוי מהותי בשירות. דורש אישור נוסף ונרשם ביומן. גם &quot;חשוב&quot; לא מגיע למכשיר שבו כובו ההתראות של העסק.</p>}
      <p className="adm-muted" style={{ fontSize: 12, marginTop: 10 }}>לא נתמך באפליקציה: {[cap.actions, cap.interruptionTimeSensitive].filter((c) => c && !c.supported).map((c) => c!.note).join(" · ")}</p>
    </details>
  );
}

function PhonePreview({ draft, meta }: { draft: Draft; meta: NotifMeta }) {
  const now = new Date().toLocaleTimeString("he-IL", { timeZone: "Asia/Jerusalem", hour: "2-digit", minute: "2-digit" });
  const route = meta.routes.find((r) => r.route === draft.route)?.label ?? draft.route;
  const title = draft.title.trim() || "כותרת ההתראה";
  const body = draft.body.trim() || "כאן יופיע התוכן…";
  return (
    <div className="adm-phone" aria-label="תצוגה מקדימה של ההתראה">
      <div className="adm-phone-screen">
        <div className="adm-phone-time adm-mono">{now}</div>
        <div className={`adm-phone-banner${draft.interruptionLevel === "passive" ? " adm-phone-passive" : ""}`}>
          <div className="adm-phone-head">
            <span className="adm-phone-icon" aria-hidden="true">ת</span>
            <span>תבל חשבוניות</span>
            <span className="adm-phone-now">עכשיו</span>
          </div>
          <div className="adm-phone-body">
            <div style={{ minWidth: 0, flex: 1 }}>
              <strong>{title}</strong>
              {draft.subtitle.trim() && <strong className="adm-phone-sub">{draft.subtitle.trim()}</strong>}
              <p>{body}</p>
            </div>
            {draft.image && <img className="adm-phone-thumb" src={draft.image.url} alt="" />}
          </div>
          {draft.image && <img className="adm-phone-image" src={draft.image.url} alt="תמונת ההתראה" />}
        </div>
        <div className="adm-phone-meta">
          {draft.sound ? "🔔 צליל" : "🔕 שקט"} · {draft.interruptionLevel === "passive" ? "שקטה" : "רגילה"}
          {draft.badgeMode !== "leave" && ` · סמל: ${draft.badgeMode === "clear" ? "מתאפס" : draft.badge}`}
          {draft.important && " · חשוב"}
        </div>
      </div>
      {draft.inFeed && (
        <div className="adm-phone-feed">
          <p className="adm-eyebrow" style={{ margin: "0 0 6px" }}>ב&quot;עדכונים&quot; באפליקציה</p>
          <div className="adm-phone-feed-row">
            <span className="adm-phone-bell" aria-hidden="true">🔔</span>
            <div style={{ minWidth: 0 }}><div className="adm-phone-feed-title">{title} · {body}</div><small className="adm-muted">{now} · נגיעה פותחת: {route}</small></div>
          </div>
        </div>
      )}
      {draft.image && <p className="adm-muted" style={{ fontSize: 12 }}>התמונה תוצג רק בגרסת האפליקציה הבאה. בגרסה הנוכחית (TestFlight 15) תופיע ההתראה בלי תמונה.</p>}
    </div>
  );
}

function AudiencePicker({ meta, value, onChange }: { meta: NotifMeta; value: AudiencePick; onChange: (a: AudiencePick) => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<AccountRow[]>([]);
  useEffect(() => {
    if (value.type !== "USER" && value.type !== "BUSINESS") return;
    const term = q.trim();
    if (term.length < 2) return;
    const t = setTimeout(() => {
      api<{ rows: AccountRow[] }>(`/accounts?q=${encodeURIComponent(term)}&limit=8`).then((r) => setResults(r.rows)).catch(() => setResults([]));
    }, 250);
    return () => clearTimeout(t);
  }, [q, value.type]);
  const types: [AudiencePick["type"], string][] = [["USER", "משתמש אחד"], ["BUSINESS", "עסק אחד"], ["ALL", "כולם"], ["PLAN", "לפי מסלול"], ["BUSINESS_TYPE", "לפי סוג עסק"]];
  return (
    <div>
      <div className="adm-tabs" role="radiogroup" aria-label="קהל" style={{ marginBottom: 10 }}>
        {types.map(([t, l]) => (
          <button key={t} role="radio" aria-checked={value.type === t} className="adm-tab"
            onClick={() => onChange(t === "ALL" ? { type: "ALL", value: null, label: "" } : t === "PLAN" ? { type: "PLAN", value: meta.plans[0] ?? "NONE", label: "" } : t === "BUSINESS_TYPE" ? { type: "BUSINESS_TYPE", value: meta.businessTypes[0] ?? null, label: "" } : { type: t, value: null, label: "" })}>{l}</button>
        ))}
      </div>
      {value.type === "PLAN" && (
        <select className="adm-select" value={value.value ?? ""} onChange={(e) => onChange({ type: "PLAN", value: e.target.value, label: "" })} aria-label="מסלול">
          {meta.plans.map((p) => <option key={p} value={p}>{PLAN_HE[p] ?? p}</option>)}
        </select>
      )}
      {value.type === "BUSINESS_TYPE" && (
        <select className="adm-select" value={value.value ?? ""} onChange={(e) => onChange({ type: "BUSINESS_TYPE", value: e.target.value, label: "" })} aria-label="סוג עסק">
          {meta.businessTypes.map((t) => <option key={t} value={t}>{BUSINESS_TYPE_HE[t] ?? t}</option>)}
        </select>
      )}
      {value.type === "ALL" && <p className="adm-muted">כל המשתמשים הפעילים בעסקים פעילים. בשליחה צריך להקליד &quot;{meta.confirmWord}&quot;. אפשר הודעה רחבה אחת בכל {meta.broadcastWindowMinutes} דקות.</p>}
      {(value.type === "USER" || value.type === "BUSINESS") && (
        value.value !== null ? (
          <div className="adm-row"><span className="adm-pill adm-pill-ok">{value.label}</span><button className="adm-link" onClick={() => onChange({ type: value.type, value: null, label: "" })}>החלפה</button></div>
        ) : (
          <div>
            <input className="adm-input" placeholder="חיפוש לפי שם, מייל, שם עסק, ח.פ. או טלפון" value={q} onChange={(e) => { setQ(e.target.value); if (e.target.value.trim().length < 2) setResults([]); }} aria-label="חיפוש נמען" />
            {q.trim().length >= 2 && results.length > 0 && (
              <ul className="adm-pick">
                {results.flatMap((u) => value.type === "USER"
                  ? [<li key={u.userId}><button onClick={() => onChange({ type: "USER", value: u.userId, label: `${u.displayName ?? u.email} (${u.email})` })}>{u.displayName ?? u.email} <span className="adm-mono adm-muted">{u.email}</span></button></li>]
                  : u.businesses.map((b) => <li key={`${u.userId}-${b.businessId}`}><button onClick={() => onChange({ type: "BUSINESS", value: b.businessId, label: b.tradingName ?? b.legalName })}>{b.tradingName ?? b.legalName} <span className="adm-muted">· {u.displayName ?? u.email}</span></button></li>))}
              </ul>
            )}
          </div>
        )
      )}
    </div>
  );
}

function SendConfirm({ preview, audience, draft, meta, onClose, onSend }: {
  preview: Preview; audience: AudiencePick; draft: Draft; meta: NotifMeta; onClose: () => void;
  onSend: (w: { confirmWord: string; importantWord: string }) => Promise<void>;
}) {
  const [word, setWord] = useState("");
  const [importantWord, setImportantWord] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const needWord = audience.type === "ALL";
  const ok = (!needWord || word.trim() === meta.confirmWord) && (!draft.important || importantWord.trim() === meta.importantWord) && preview.users > 0;
  const go = async () => {
    setBusy(true); setError("");
    try { await onSend({ confirmWord: word.trim(), importantWord: importantWord.trim() }); onClose(); }
    catch (e) { setError(errText(e)); setBusy(false); }
  };
  return (
    <div className="adm-modal-bg" role="dialog" aria-modal="true" aria-labelledby="adm-send-title" onClick={(e) => { if (e.target === e.currentTarget && !busy) onClose(); }}>
      <div className="adm-modal">
        <h2 className="adm-h2" id="adm-send-title">{draft.when === "later" ? "לתזמן את ההתראה?" : "לשלוח את ההתראה?"}</h2>
        <p className="adm-sub" style={{ color: "var(--color-stone)" }}><strong>{draft.title}</strong> — {audienceText(audience.type, audience.value, audience.label)}{draft.when === "later" && ` · ${draft.scheduledFor.replace("T", " ")} (שעון ישראל)`}</p>
        <dl className="adm-kv">
          <dt>משתמשים</dt><dd className="adm-mono">{preview.users}</dd>
          <dt>עסקים</dt><dd className="adm-mono">{preview.businesses}</dd>
          <dt>מכשירים שיקבלו התראה</dt><dd className="adm-mono">{preview.devices}</dd>
          <dt>כיבו הודעות מתבל</dt><dd className="adm-mono">{preview.optedOut}</dd>
          <dt>בלי מכשיר עם התראות פעילות</dt><dd className="adm-mono">{preview.noDevice}</dd>
          {preview.deferredQuiet > 0 && draft.when === "now" && <><dt>יחכו לסוף שעות השקט</dt><dd className="adm-mono">{preview.deferredQuiet} (עד {fmtDateTime(preview.quietUntil)})</dd></>}
        </dl>
        <p className="adm-muted" style={{ fontSize: 13 }}>{draft.inFeed ? `כל ${preview.users} המשתמשים יראו אותה ב"עדכונים", גם בלי התראה בטלפון.` : "לא תתווסף ל\"עדכונים\"."}</p>
        {preview.users === 0 && <p className="adm-error">אין אף משתמש בקהל הזה.</p>}
        {needWord && <label className="adm-field"><span>לשליחה לכולם יש להקליד: {meta.confirmWord}</span><input className="adm-input" value={word} onChange={(e) => setWord(e.target.value)} autoFocus /></label>}
        {draft.important && <label className="adm-field" style={{ marginTop: 8 }}><span>התראה &quot;חשובה&quot; עוקפת את שעות השקט ואת הבחירה של המשתמש. להקליד: {meta.importantWord}</span><input className="adm-input" value={importantWord} onChange={(e) => setImportantWord(e.target.value)} /></label>}
        {error && <p className="adm-error" role="alert">{error}</p>}
        <div className="adm-row" style={{ marginTop: 16 }}>
          <button className="adm-btn" disabled={busy || !ok} onClick={go}>{busy ? "רגע…" : draft.when === "later" ? "תזמון" : "שליחה"}</button>
          <button className="adm-btn-ghost" disabled={busy} onClick={onClose}>ביטול</button>
        </div>
      </div>
    </div>
  );
}

function History({ data, reload }: { data: { total: number; rows: Announcement[] } | null; reload: () => void }) {
  const [error, setError] = useState("");
  const cancel = async (id: string) => {
    if (!window.confirm("לבטל את השליחה המתוזמנת?")) return;
    setError("");
    try { await api(`/notifications/${id}/cancel`, { body: {} }); reload(); } catch (e) { setError(errText(e)); }
  };
  const rows = useMemo(() => data?.rows ?? [], [data]);
  return (
    <section className="adm-card">
      <div className="adm-row" style={{ justifyContent: "space-between" }}>
        <h2 className="adm-h2" style={{ margin: 0 }}>היסטוריה</h2>
        <button className="adm-btn-ghost" onClick={reload}>רענון</button>
      </div>
      {error && <p className="adm-error" role="alert">{error}</p>}
      {data === null ? <p className="adm-muted">טוען…</p> : rows.length === 0 ? <p className="adm-muted">עוד לא נשלחו התראות.</p> : (
        <div className="adm-table-wrap" style={{ marginTop: 12 }}>
          <table className="adm-table">
            <thead><tr><th>מתי</th><th>התראה</th><th>קהל</th><th>מצב</th><th>משתמשים</th><th>מכשירים</th><th>נמסרו</th><th>נכשלו</th><th>ממתינות</th><th>נפתחו ב&quot;עדכונים&quot;</th><th /></tr></thead>
            <tbody>
              {rows.map((a) => {
                const [label, cls] = STATUS_HE[a.status] ?? [a.status, "adm-pill"];
                return (
                  <tr key={a.id} style={{ cursor: "default" }}>
                    <td className="adm-mono">{fmtDateTime(a.sentAt ?? a.scheduledFor)}<br /><small className="adm-muted">{a.createdBy}</small></td>
                    <td style={{ minWidth: 220 }}>
                      <div className="adm-row" style={{ flexWrap: "nowrap", alignItems: "flex-start" }}>
                        {a.imageUrl && <img className="adm-hist-thumb" src={a.imageUrl} alt="" />}
                        <div><strong>{a.title}</strong>{a.subtitle && <div className="adm-muted">{a.subtitle}</div>}<div className="adm-muted" style={{ fontSize: 13 }}>{a.body}</div></div>
                      </div>
                      <div className="adm-row" style={{ marginTop: 4 }}>
                        {a.isTest && <span className="adm-pill">בדיקה</span>}{a.important && <span className="adm-pill adm-pill-warn">חשוב</span>}
                        {!a.inFeed && <span className="adm-pill">בלי עדכונים</span>}{a.templateId && <span className="adm-pill">מתבנית v{a.templateVersion}</span>}
                      </div>
                    </td>
                    <td>{audienceText(a.audienceType, a.audienceValue)}{a.audienceValue && <div className="adm-mono adm-muted" style={{ fontSize: 11 }}>{a.audienceValue.slice(0, 8)}</div>}</td>
                    <td><span className={cls}>{label}</span>{a.lastError && <div className="adm-error" style={{ fontSize: 12 }}>{a.lastError}</div>}</td>
                    <td className="adm-mono">{a.targetedUsers ?? "—"}{a.optedOut ? <div className="adm-muted" style={{ fontSize: 12 }}>{a.optedOut} כיבו</div> : null}</td>
                    <td className="adm-mono">{a.devices ?? "—"}</td>
                    <td className="adm-mono">{a.delivery.delivered}</td>
                    <td className="adm-mono">{a.delivery.failed}</td>
                    <td className="adm-mono">{a.delivery.pending}</td>
                    <td className="adm-mono">{a.openedInApp}</td>
                    <td>{a.status === "SCHEDULED" && <button className="adm-btn-danger" onClick={() => void cancel(a.id)}>ביטול</button>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="adm-muted" style={{ fontSize: 12, marginTop: 8 }}>&quot;נמסרו&quot; = Apple קיבלה את ההתראה למסירה. האפליקציה לא מדווחת על פתיחת התראה, ולכן &quot;נפתחו&quot; סופר מי שפתח אותה ב&quot;עדכונים&quot;.</p>
    </section>
  );
}

/* ------------------------------------------------------------------ account drawer panel */

interface Panel {
  devices: { id: string; environment: string; appVersion: string | null; registeredAt: string; lastSeenAt: string; live: boolean; disabledReason: string | null; businesses: { businessId: string; on: boolean }[] }[];
  preferences: { disabledCategories: string[]; enabledKinds: string[]; quietHours: boolean; configured: boolean };
  recentPushes: { id: string; kind: string; title: string; status: string; createdAt: string; sentAt: string | null; lastError: string | null }[];
  announcements: { id: string; title: string; sentAt: string | null }[];
  businesses: { businessId: string; legalName: string }[];
}
const CATEGORY_HE: Record<string, string> = { DOCUMENTS: "מסמכים", PAYMENTS: "תשלומים", CUSTOMERS: "לקוחות", TEAM: "צוות", SUBSCRIPTION: "מנוי", REPORTS: "דוחות", SECURITY: "אבטחה", ANNOUNCEMENTS: "הודעות מתבל" };
const PUSH_STATUS_HE: Record<string, string> = { PENDING: "ממתינה", LEASED: "בשליחה", SENT: "נמסרה", FAILED: "נכשלה", DROPPED: "המכשיר נותק" };

export function UserNotificationsPanel({ userId, onSend }: { userId: string; onSend: () => void }) {
  const [panel, setPanel] = useState<Panel | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { api<Panel>(`/users/${userId}/notifications`).then(setPanel).catch((e) => setError(msg(e))); }, [userId]);
  const name = (id: string) => panel?.businesses.find((b) => b.businessId === id)?.legalName ?? id.slice(0, 8);
  return (
    <section className="adm-card">
      <div className="adm-row" style={{ justifyContent: "space-between" }}>
        <h3 className="adm-h3" style={{ margin: 0 }}>מכשירים והתראות</h3>
        <button className="adm-btn-ghost" onClick={onSend}>שליחת התראה למשתמש הזה</button>
      </div>
      {error && <p className="adm-error">{error}</p>}
      {panel && (
        <>
          {panel.devices.length === 0 ? <p className="adm-muted">אין מכשיר שנרשם להתראות (ההתראות לא הופעלו באפליקציה).</p> : (
            <div className="adm-table-wrap" style={{ marginTop: 10 }}>
              <table className="adm-table"><thead><tr><th>מכשיר</th><th>גרסה</th><th>נרשם</th><th>נראה לאחרונה</th><th>התראות לפי עסק</th></tr></thead>
                <tbody>{panel.devices.map((d) => (
                  <tr key={d.id} style={{ cursor: "default" }}>
                    <td>iPhone {d.live ? <span className="adm-pill adm-pill-ok">פעיל</span> : <span className="adm-pill">{d.disabledReason ?? "כבוי"}</span>}{d.environment === "sandbox" && <span className="adm-pill" style={{ marginInlineStart: 4 }}>פיתוח</span>}</td>
                    <td className="adm-mono">{d.appVersion ?? "—"}</td>
                    <td className="adm-mono">{fmtDateTime(d.registeredAt)}</td>
                    <td className="adm-mono">{fmtDateTime(d.lastSeenAt)}</td>
                    <td>{d.live ? d.businesses.map((b) => <div key={b.businessId}>{name(b.businessId)}: <span className={b.on ? "adm-pill adm-pill-ok" : "adm-pill adm-pill-bad"}>{b.on ? "פועלות" : "כבויות"}</span></div>) : "—"}</td>
                  </tr>))}</tbody>
              </table>
            </div>
          )}
          <dl className="adm-kv" style={{ marginTop: 12 }}>
            <dt>סוגים שכובו</dt><dd>{panel.preferences.disabledCategories.map((c) => CATEGORY_HE[c] ?? c).join(", ") || "אין (הכול פועל)"}</dd>
            <dt>שעות שקט</dt><dd>{panel.preferences.quietHours ? "מכובדות (22:00–08:00, שבת וחג)" : "כבויות — התראות בכל שעה"}</dd>
          </dl>
          <h3 className="adm-h3" style={{ marginTop: 14 }}>התראות אחרונות</h3>
          {panel.recentPushes.length === 0 ? <p className="adm-muted">לא נשלחו התראות ב-60 הימים האחרונים.</p> : (
            <ul className="adm-plain">{panel.recentPushes.map((p) => (
              <li key={p.id}><span className="adm-mono adm-muted">{fmtDateTime(p.sentAt ?? p.createdAt)}</span> {p.title} <span className="adm-pill">{PUSH_STATUS_HE[p.status] ?? p.status}</span>{p.kind === "ANNOUNCEMENT" && <span className="adm-pill" style={{ marginInlineStart: 4 }}>מהניהול</span>}</li>
            ))}</ul>
          )}
          {panel.announcements.length > 0 && <p className="adm-muted" style={{ fontSize: 13 }}>הודעות מהניהול שקיבל: {panel.announcements.length}</p>}
        </>
      )}
    </section>
  );
}
