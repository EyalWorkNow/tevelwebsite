"use client";
// "התראות": compose a push notification for the Tevel invoicing app. Order on the page: 1. למי (one user
// first, with search) + live reachability ("יגיע ל-N מכשירים", red when 0); 2. מה (title, subtitle, body,
// image with preview, screen); 3. הגדרות מתקדמות (sound, badge, interruption, grouping, replace, expiry,
// priority, "עדכונים", חשוב) — an always-visible panel that can be collapsed; 4. מתי. Then the real send
// (preview → confirm) and, separately, "שליחת בדיקה ל..." to any app user the admin picks.
// Server: /platform-admin/notifications/* (invoice repo, docs/operations/PLATFORM-ADMIN.md).
// Images come from the invoice API host (CSP img-src), so plain <img>, not next/image.
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
  /** Present from server fix/admin-push-ux on: the admin's own app user, if the admin e-mail is one. */
  adminAppUser?: { userId: string; email: string; displayName: string | null } | null;
  /** Present from server feat/notch-push on (Live Activity "נוטצ׳"). Absent on older servers → feature disabled. */
  notch?: { minMinutes: number; maxMinutes: number; defaultMinutes: number; minIos: string; icons: { id: NotchIcon; label: string }[] };
}
export type NotchIcon = "megaphone" | "gift" | "sparkles" | "bell" | "star" | "tag" | "info" | "heart";
type DisplayStyle = "standard" | "notch";
interface UploadedImage { id: string; url: string; width: number; height: number; bytes: number; expiresAt: string }
export interface AudiencePick { type: "ALL" | "PLAN" | "BUSINESS_TYPE" | "BUSINESS" | "USER"; value: string | null; label: string }
interface Preview { users: number; businesses: number; optedOut: number; noDevice: number; devices: number; deferredQuiet: number; quietUntil: string | null; broadcast: boolean;
  /** Newer servers only: devices with a Live Activity push-to-start token (iOS 17.2+) / the rest (normal push). */
  notchDevices?: number; fallbackDevices?: number }
interface Announcement {
  id: string; title: string; subtitle: string | null; body: string; route: string; audienceType: string; audienceValue: string | null;
  inFeed: boolean; isTest: boolean; important: boolean; status: string; scheduledFor: string; createdBy: string; createdAt: string;
  sentAt: string | null; cancelledAt: string | null; targetedUsers: number | null; devices: number | null; optedOut: number | null;
  noDevice: number | null; deferredQuiet: number | null; imageUrl: string | null; templateId: string | null; templateVersion: number | null;
  sound?: boolean; badge?: number | null; interruptionLevel?: string; threadId?: string | null; collapseKey?: string | null; ttlSeconds?: number; priority?: number;
  delivery: { pending: number; delivered: number; failed: number; openedPush?: number }; openedInApp: number; lastError: string | null;
  displayStyle?: DisplayStyle; notchMinutes?: number | null; notchIcon?: string | null; notchDevices?: number | null; notchFallback?: number | null;
  notch?: { pending: number; started: number; fallback: number; ended: number; failed: number };
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
  ADMIN_NOT_APP_USER: "צריך לבחור למי לשלוח את הבדיקה.",
  USER_NOT_ACTIVE: "המשתמש שנבחר לבדיקה מושהה. צריך לבחור משתמש פעיל.",
  IMAGE_INVALID: "אפשר להעלות רק תמונת JPEG, PNG או GIF תקינה.",
  IMAGE_TOO_LARGE: "התמונה גדולה מדי (עד 5MB ועד 2048×2048 פיקסלים).",
};
const errText = (e: unknown) => (e instanceof ApiError && NOTIF_ERRORS[e.code] ? NOTIF_ERRORS[e.code] : msg(e));

const TTL_OPTIONS: [number, string][] = [[3600, "שעה"], [21600, "6 שעות"], [86400, "יום"], [259200, "3 ימים"], [604800, "שבוע"], [2419200, "4 שבועות"]];
const STATUS_HE: Record<string, [string, string]> = {
  SCHEDULED: ["מתוזמנת", "adm-pill adm-pill-warn"], SENDING: ["נשלחת", "adm-pill adm-pill-warn"], SENT: ["נשלחה", "adm-pill adm-pill-ok"],
  CANCELLED: ["בוטלה", "adm-pill"], FAILED: ["נכשלה", "adm-pill adm-pill-bad"],
};
export const NO_DEVICE_ONE =
  "למשתמש הזה אין מכשיר רשום להתראות — ההתראה תופיע רק בעדכונים בתוך האפליקציה, ותגיע לטלפון רק אחרי שייכנס לאפליקציה ויאשר התראות";
const NO_DEVICE_MANY =
  "לאף משתמש בקהל הזה אין מכשיר רשום להתראות — ההתראה תופיע רק בעדכונים בתוך האפליקציה, ותגיע לטלפון רק אחרי שהמשתמשים ייכנסו לאפליקציה ויאשרו התראות";

export function audienceText(type: string, value: string | null, label?: string): string {
  if (type === "ALL") return "כל המשתמשים";
  if (type === "PLAN") return `מסלול: ${PLAN_HE[value ?? ""] ?? value}`;
  if (type === "BUSINESS_TYPE") return `סוג עסק: ${BUSINESS_TYPE_HE[value ?? ""] ?? value}`;
  if (type === "BUSINESS") return label ? `עסק: ${label}` : "עסק אחד";
  return label ? `משתמש: ${label}` : "משתמש אחד";
}

/* ---------------------------------------------------------------- the remembered test recipient */

export interface TestRecipient { userId: string; label: string }
const TEST_KEY = "tevel-adm-test-recipient";
export function loadTestRecipient(): TestRecipient | null {
  try {
    const v = JSON.parse(window.localStorage.getItem(TEST_KEY) ?? "null") as TestRecipient | null;
    return v && typeof v.userId === "string" && typeof v.label === "string" ? v : null;
  } catch { return null; }
}
function saveTestRecipient(r: TestRecipient | null) {
  try { if (r) window.localStorage.setItem(TEST_KEY, JSON.stringify(r)); else window.localStorage.removeItem(TEST_KEY); } catch { /* private mode */ }
}
const userLabel = (u: { displayName: string | null; email: string }) => `${u.displayName ?? u.email} (${u.email})`;

/* ---------------------------------------------------------------- draft */

interface Draft {
  title: string; subtitle: string; body: string; route: string; image: UploadedImage | null; sound: boolean;
  badgeMode: "leave" | "clear" | "set"; badge: number; interruptionLevel: "passive" | "active"; threadId: string; collapseKey: string;
  ttlSeconds: number; priority: 5 | 10; inFeed: boolean; important: boolean; when: "now" | "later"; scheduledFor: string; templateId: string | null;
  displayStyle: DisplayStyle; notchMinutes: number; notchIcon: NotchIcon;
}
const EMPTY: Draft = {
  title: "", subtitle: "", body: "", route: "/home", image: null, sound: true, badgeMode: "leave", badge: 1, interruptionLevel: "active",
  threadId: "", collapseKey: "", ttlSeconds: 259200, priority: 10, inFeed: true, important: false, when: "now", scheduledFor: "", templateId: null,
  displayStyle: "standard", notchMinutes: 10, notchIcon: "megaphone",
};
type SetDraft = <K extends keyof Draft>(k: K, v: Draft[K]) => void;

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

/** The display-style fields for send / test — only when the server knows them (meta.notch), never to an old server. */
function notchPayloadOf(d: Draft, meta: NotifMeta) {
  if (!meta.notch) return {};
  return d.displayStyle === "notch"
    ? { displayStyle: "notch" as const, notchMinutes: clampMinutes(d.notchMinutes, meta), notchIcon: d.notchIcon }
    : { displayStyle: "standard" as const };
}
const clampMinutes = (m: number, meta: NotifMeta) =>
  Math.round(Math.max(meta.notch?.minMinutes ?? 1, Math.min(meta.notch?.maxMinutes ?? 480, Number.isFinite(m) ? m : meta.notch?.defaultMinutes ?? 10)));
/** "10 דק׳" / "שעה" / "4 שעות" */
export function minutesText(m: number): string {
  if (m % 60 === 0) return m === 60 ? "שעה" : m === 120 ? "שעתיים" : `${m / 60} שעות`;
  return m > 60 ? `${Math.floor(m / 60)} ש׳ ${m % 60} דק׳` : `${m} דק׳`;
}

/** Live "who does this reach" for an audience (debounced). null while unknown / not applicable.
 *  `displayStyle` is sent only when given (i.e. the server supports it). */
function useReach(audience: { type: string; value: string | null } | null, important: boolean, displayStyle?: DisplayStyle): { preview: Preview | null; error: string } {
  const [state, setState] = useState<{ key: string; preview: Preview | null; error: string }>({ key: "", preview: null, error: "" });
  const ready = audience !== null && (audience.type === "ALL" || audience.value !== null);
  const key = ready ? `${audience.type}:${audience.value}:${important}:${displayStyle ?? ""}` : "";
  useEffect(() => {
    if (!ready || !audience) return;
    let live = true;
    const t = setTimeout(() => {
      api<Preview>("/notifications/preview", { body: { audience: { type: audience.type, value: audience.value }, important, ...(displayStyle ? { displayStyle } : {}) } })
        .then((p) => { if (live) setState({ key, preview: p, error: "" }); })
        .catch((e) => { if (live) setState({ key, preview: null, error: errText(e) }); });
    }, 300);
    return () => { live = false; clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return state.key === key && ready ? { preview: state.preview, error: state.error } : { preview: null, error: "" };
}

/** "יגיע ל-N מכשירים" — the one number that says whether a phone will light up; red when 0. */
export function ReachBox({ preview, single, inFeed, compact, notch }: { preview: Preview | null; single: boolean; inFeed: boolean; compact?: boolean; notch?: boolean }) {
  if (preview === null) return <div className="adm-reach adm-reach-wait" data-testid="reach">בודק כמה מכשירים יקבלו…</div>;
  const zero = preview.devices === 0;
  const optedOutOnly = zero && preview.users > 0 && preview.optedOut >= preview.users;
  return (
    <div className={`adm-reach${zero ? " adm-reach-bad" : " adm-reach-ok"}`} role={zero ? "alert" : "status"} data-testid="reach" data-devices={preview.devices}>
      <strong className="adm-reach-n">{zero ? "לא יגיע לאף טלפון (0 מכשירים)" : `יגיע ל-${preview.devices} ${preview.devices === 1 ? "מכשיר" : "מכשירים"}`}</strong>
      {!compact && <span className="adm-reach-sub">{preview.users} {preview.users === 1 ? "משתמש" : "משתמשים"} · {preview.noDevice} בלי מכשיר רשום · {preview.optedOut} כיבו הודעות מתבל</span>}
      {notch && !zero && <NotchSplit preview={preview} />}
      {zero && preview.users > 0 && (
        <p className="adm-reach-warn">
          {optedOutOnly ? "המשתמש כיבה באפליקציה את \"הודעות מצוות תבל\" — ההתראה לא תגיע לטלפון (רק \"חשוב\" עוקף זאת)." : single ? NO_DEVICE_ONE : NO_DEVICE_MANY}
          {!inFeed && " שימו לב: \"להוסיף גם לעדכונים\" כבוי — אף אחד לא יראה את ההתראה."}
        </p>
      )}
      {preview.users === 0 && <p className="adm-reach-warn">אין אף משתמש בקהל הזה.</p>}
    </div>
  );
}

/** "נוטצ׳: N מכשירים · רגילה (fallback): M מכשירים" — only when the server reported the split. */
function NotchSplit({ preview }: { preview: Preview }) {
  if (typeof preview.notchDevices !== "number") return <span className="adm-reach-sub" data-testid="reach-notch" data-known="0">חלוקה לנוטצ׳ / רגילה: לא ידועה (השרת לא דיווח)</span>;
  const fallback = typeof preview.fallbackDevices === "number" ? preview.fallbackDevices : Math.max(0, preview.devices - preview.notchDevices);
  const n = (k: number) => `${k} ${k === 1 ? "מכשיר" : "מכשירים"}`;
  return (
    <span className="adm-reach-sub adm-reach-notch" data-testid="reach-notch" data-notch={preview.notchDevices} data-fallback={fallback}>
      נוטצ׳: <strong>{n(preview.notchDevices)}</strong> · רגילה (fallback): <strong>{n(fallback)}</strong>
    </span>
  );
}

/* ---------------------------------------------------------------- composer */

/** `preset` (from "שלח התראה" on an account) seeds the audience; the parent remounts on change. */
export default function Notifications({ preset }: { preset: AudiencePick | null }) {
  const [meta, setMeta] = useState<NotifMeta | null>(null);
  const [loadError, setLoadError] = useState("");
  const [history, setHistory] = useState<{ total: number; rows: Announcement[] } | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [audience, setAudience] = useState<AudiencePick>(() => preset ?? { type: "USER", value: null, label: "" });
  const [sendError, setSendError] = useState("");
  const [flash, setFlash] = useState("");
  const [lastSent, setLastSent] = useState<Announcement | null>(null);
  const [confirm, setConfirm] = useState<{ preview: Preview } | null>(null);
  const [busy, setBusy] = useState(false);
  const top = useRef<HTMLDivElement>(null);

  const loadHistory = useCallback(() => {
    api<{ total: number; rows: Announcement[] }>("/notifications?limit=50").then(setHistory).catch((e) => setLoadError(errText(e)));
  }, []);
  const loadTemplates = useCallback(() => {
    api<{ rows: Template[] }>("/notifications/templates").then((r) => setTemplates(r.rows)).catch(() => undefined);
  }, []);
  useEffect(() => {
    api<NotifMeta>("/notifications/meta").then((m) => { setMeta(m); setDraft((d) => ({ ...d, ttlSeconds: m.ttl.default, notchMinutes: m.notch?.defaultMinutes ?? d.notchMinutes })); }).catch((e) => setLoadError(errText(e)));
    loadHistory(); loadTemplates();
  }, [loadHistory, loadTemplates]);
  useEffect(() => { if (preset) top.current?.scrollIntoView({ block: "start" }); }, [preset]);

  const set: SetDraft = (k, v) => setDraft((d) => ({ ...d, [k]: v }));
  const hasVariable = /\{[^{}]*\}/.test(`${draft.title} ${draft.subtitle} ${draft.body}`);
  const audienceReady = audience.type === "ALL" || audience.value !== null;
  const contentReady = draft.title.trim().length >= 2 && draft.body.trim().length >= 2 && !hasVariable && (draft.when === "now" || draft.scheduledFor !== "");
  const styleForServer: DisplayStyle | undefined = meta?.notch ? draft.displayStyle : undefined;
  const isNotch = styleForServer === "notch";
  const reach = useReach(audienceReady ? audience : null, draft.important, styleForServer);

  const openPreview = async () => {
    setSendError(""); setFlash(""); setLastSent(null); setBusy(true);
    try {
      const p = await api<Preview>("/notifications/preview", { body: { audience: { type: audience.type, value: audience.value }, important: draft.important, ...(styleForServer ? { displayStyle: styleForServer } : {}) } });
      setConfirm({ preview: p });
    } catch (e) { setSendError(errText(e)); } finally { setBusy(false); }
  };
  const send = async (words: { confirmWord: string; importantWord: string }) => {
    const r = await api<{ announcement: Announcement }>("/notifications", {
      body: {
        ...payloadOf(draft), ...(meta ? notchPayloadOf(draft, meta) : {}), audience: { type: audience.type, value: audience.value }, important: draft.important, templateId: draft.templateId,
        scheduledFor: draft.when === "later" ? draft.scheduledFor : null, confirm: true, ...words,
      },
    });
    const a = r.announcement;
    setLastSent(a);
    setFlash(a.status === "SCHEDULED" ? `ההתראה תוזמנה ל-${fmtDateTime(a.scheduledFor)}.` : "");
    setDraft((d) => ({ ...EMPTY, ttlSeconds: d.ttlSeconds, notchMinutes: meta?.notch?.defaultMinutes ?? EMPTY.notchMinutes }));
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
    setSendError("");
    try {
      const existing = templates.find((t) => t.id === draft.templateId && t.name === name);
      const r = await api<{ template: Template }>(existing ? `/notifications/templates/${existing.id}` : "/notifications/templates", { method: existing ? "PATCH" : "POST", body: { name, ...payloadOf(draft) } });
      set("templateId", r.template.id); setFlash(`התבנית "${r.template.name}" נשמרה (גרסה ${r.template.version}).`); loadTemplates();
    } catch (e) { setSendError(errText(e)); }
  };

  if (!meta) return loadError ? <p className="adm-error" role="alert">{loadError}</p> : <p className="adm-muted">טוען…</p>;
  const single = audience.type === "USER";

  return (
    <>
      <div className="adm-notif" ref={top}>
        <section className="adm-card adm-notif-form">
          <div className="adm-row" style={{ justifyContent: "space-between" }}>
            <h2 className="adm-h2" style={{ margin: 0 }}>התראה חדשה</h2>
            <div className="adm-row" style={{ maxWidth: "100%", minWidth: 0 }}>
              <select className="adm-select" style={{ width: "auto", maxWidth: "100%", minWidth: 0 }} value={draft.templateId ?? ""} onChange={(e) => (e.target.value ? loadTemplate(e.target.value) : set("templateId", null))} aria-label="תבנית">
                <option value="">בלי תבנית</option>
                {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <button className="adm-btn-ghost" onClick={saveTemplate} disabled={draft.title.trim().length < 2 || draft.body.trim().length < 2}>שמירה כתבנית</button>
            </div>
          </div>
          {loadError && <p className="adm-error" role="alert">{loadError}</p>}

          <h3 className="adm-step"><span className="adm-step-n">1</span>למי</h3>
          <AudiencePicker meta={meta} value={audience} onChange={(a) => { setAudience(a); setLastSent(null); }} />
          {audienceReady && <ReachBox preview={reach.preview} single={single} inFeed={draft.inFeed} notch={isNotch} />}
          {reach.error && <p className="adm-error">{reach.error}</p>}

          <h3 className="adm-step"><span className="adm-step-n">2</span>מה</h3>
          <Content draft={draft} set={set} meta={meta} />
          <DisplayStylePicker draft={draft} set={set} meta={meta} />
          {hasVariable && <p className="adm-error">בשליחה ידנית אין משתנים כמו {"{firstName}"}. הם מתמלאים רק בהתראות אוטומטיות (לשונית &quot;אוטומציות&quot;). צריך לכתוב את הטקסט המלא.</p>}

          <h3 className="adm-step"><span className="adm-step-n">3</span>הגדרות מתקדמות</h3>
          <Presentation draft={draft} set={set} meta={meta} />

          <h3 className="adm-step"><span className="adm-step-n">4</span>מתי</h3>
          <div className="adm-row">
            <label className="adm-check"><input type="radio" name="when" checked={draft.when === "now"} onChange={() => set("when", "now")} />עכשיו</label>
            <label className="adm-check"><input type="radio" name="when" checked={draft.when === "later"} onChange={() => { set("when", "later"); if (!draft.scheduledFor) set("scheduledFor", israelNowLocal(60)); }} />בזמן מתוזמן (שעון ישראל)</label>
            {draft.when === "later" && <input className="adm-input adm-mono" style={{ width: "auto" }} type="datetime-local" min={israelNowLocal(2)} max={israelNowLocal(meta.maxScheduleDays * 1440)} value={draft.scheduledFor} onChange={(e) => set("scheduledFor", e.target.value)} aria-label="מועד שליחה" />}
          </div>
          <p className="adm-muted" style={{ fontSize: 13 }}>
            ברירת המחדל מכבדת את המשתמשים: מי שכיבה &quot;הודעות מצוות תבל&quot; באפליקציה לא יקבל התראה (רק פריט ב&quot;עדכונים&quot;), ובשעות השקט (22:00–08:00, שבת וחג) ההתראה תחכה לבוקר.
          </p>

          <div className="adm-send-box">
            <button className="adm-btn adm-btn-lg" disabled={busy || !contentReady || !audienceReady} onClick={openPreview}>{busy ? "רגע…" : "בדיקת קהל ושליחה"}</button>
            {!audienceReady && <small className="adm-muted">קודם בוחרים למי (שלב 1).</small>}
            {audienceReady && !contentReady && <small className="adm-muted">חסרים כותרת ותוכן (שלב 2).</small>}
            {sendError && <p className="adm-error" role="alert">{sendError}</p>}
            {flash && <p className="adm-ok" role="status">{flash}</p>}
            {lastSent && lastSent.status !== "SCHEDULED" && <SentResult a={lastSent} single={lastSent.audienceType === "USER"} />}
          </div>

          <TestSend meta={meta} draft={draft} contentReady={contentReady} audience={audience} onSent={loadHistory} />
        </section>
        <aside className="adm-notif-side">
          <PhonePreview draft={draft} meta={meta} />
        </aside>
      </div>
      <History data={history} reload={loadHistory} meta={meta} />
      {confirm && <SendConfirm preview={confirm.preview} audience={audience} draft={draft} meta={meta} onClose={() => setConfirm(null)} onSend={send} />}
    </>
  );
}

/** After a send: what really happened, devices first. */
function SentResult({ a, single }: { a: Announcement; single: boolean }) {
  const devices = a.devices ?? 0;
  return (
    <div className={`adm-reach ${devices === 0 ? "adm-reach-bad" : "adm-reach-ok"}`} role={devices === 0 ? "alert" : "status"} data-testid="sent-result" data-devices={devices}>
      <strong className="adm-reach-n">{a.isTest ? "הבדיקה נשלחה" : "ההתראה נשלחה"}: {devices === 0 ? "0 מכשירים — לא הגיעה לאף טלפון" : `ל-${devices} ${devices === 1 ? "מכשיר" : "מכשירים"}`}</strong>
      <span className="adm-reach-sub">{a.targetedUsers ?? 0} משתמשים · {a.noDevice ?? 0} בלי מכשיר רשום · {a.optedOut ?? 0} כיבו{a.inFeed ? " · נוספה ל\"עדכונים\"" : ""}</span>
      {devices === 0 && <p className="adm-reach-warn">{single ? NO_DEVICE_ONE : NO_DEVICE_MANY}</p>}
    </div>
  );
}

function Counter({ value, max }: { value: string; max: number }) {
  const n = [...value].length;
  return <small className={n > max ? "adm-error" : "adm-muted"} style={{ margin: 0 }}>{n}/{max}</small>;
}

/* ---------------------------------------------------------------- image: shrink in the browser, then upload */

const blobToBase64 = (blob: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result).replace(/^data:[^,]*,/, ""));
  reader.onerror = () => reject(new Error("read"));
  reader.readAsDataURL(blob);
});
async function decodeImage(file: File): Promise<{ draw: CanvasImageSource; w: number; h: number } | null> {
  try { const b = await createImageBitmap(file); return { draw: b, w: b.width, h: b.height }; } catch { /* fall through */ }
  try {
    const img = new Image();
    img.src = `data:${file.type || "image/jpeg"};base64,${await blobToBase64(file)}`;
    await img.decode();
    return { draw: img, w: img.naturalWidth, h: img.naturalHeight };
  } catch { return null; }
}
/**
 * Phone photos are usually bigger than the push limits (5MB, 2048px) or HEIC; the server only takes
 * JPEG/PNG/GIF within the limits, so anything else is scaled down and re-encoded as JPEG here first.
 */
async function uploadableBase64(file: File, maxBytes: number, maxSide: number): Promise<string> {
  const native = ["image/jpeg", "image/png", "image/gif"].includes(file.type);
  const img = await decodeImage(file);
  if (img === null) {
    if (native && file.size <= maxBytes) return blobToBase64(file);
    throw new ApiError(422, "IMAGE_INVALID", NOTIF_ERRORS.IMAGE_INVALID);
  }
  if (native && file.size <= maxBytes && img.w <= maxSide && img.h <= maxSide) return blobToBase64(file);
  const scale = Math.min(1, maxSide / Math.max(img.w, img.h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(img.w * scale));
  canvas.height = Math.max(1, Math.round(img.h * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ApiError(422, "IMAGE_INVALID", NOTIF_ERRORS.IMAGE_INVALID);
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img.draw, 0, 0, canvas.width, canvas.height);
  for (const q of [0.86, 0.75, 0.6, 0.45]) {
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", q));
    if (blob && blob.size <= maxBytes) return blobToBase64(blob);
  }
  throw new ApiError(413, "IMAGE_TOO_LARGE", NOTIF_ERRORS.IMAGE_TOO_LARGE);
}

function ImagePicker({ draft, set, meta }: { draft: Draft; set: SetDraft; meta: NotifMeta }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const upload = async (file: File | undefined) => {
    if (!file) return;
    setError(""); setUploading(true);
    try {
      const dataBase64 = await uploadableBase64(file, meta.image.maxBytes, meta.image.maxSide);
      const r = await api<{ image: UploadedImage }>("/notifications/images", { body: { dataBase64 } });
      set("image", r.image);
    } catch (e) { setError(errText(e)); } finally { setUploading(false); if (input.current) input.current.value = ""; }
  };
  return (
    <div className="adm-field adm-img-field">
      <span>תמונה (רשות)</span>
      <div className="adm-img-pick">
        {draft.image ? (
          <>
            <img className="adm-img-thumb" src={draft.image.url} alt="התמונה שהועלתה" data-testid="image-thumb" />
            <div className="adm-img-meta">
              <span className="adm-ok" style={{ margin: 0 }}>התמונה הועלתה ✓</span>
              <span className="adm-mono adm-muted">{draft.image.width}×{draft.image.height} · {Math.round(draft.image.bytes / 1024)}KB</span>
              <div className="adm-row">
                <button type="button" className="adm-btn-ghost" disabled={uploading} onClick={() => input.current?.click()}>החלפה</button>
                <button type="button" className="adm-btn-danger" disabled={uploading} onClick={() => set("image", null)}>הסרה</button>
              </div>
            </div>
          </>
        ) : (
          <button type="button" className="adm-img-drop" disabled={uploading} onClick={() => input.current?.click()}
            onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); void upload(e.dataTransfer.files?.[0]); }}>
            <span className="adm-img-plus" aria-hidden="true">＋</span>
            <span>{uploading ? "מעלה ומקטין את התמונה…" : "העלאת תמונה"}</span>
            <small className="adm-muted">לחיצה לבחירה או גרירה לכאן</small>
          </button>
        )}
        <input ref={input} className="adm-visually-hidden" type="file" accept="image/*" disabled={uploading}
          onChange={(e) => void upload(e.target.files?.[0])} aria-label="העלאת תמונה" data-testid="image-input" />
      </div>
      {error && <p className="adm-error" role="alert" style={{ marginBottom: 0 }}>{error}</p>}
      <small className="adm-muted" data-testid="image-explain">בבאנר הסגור iOS מציג תמונה קטנה; בלחיצה ארוכה/משיכה מטה היא מוצגת בגדול</small>
      {meta.notch && draft.displayStyle === "notch" && <small className="adm-muted" style={{ color: "var(--color-amber)" }} data-testid="image-notch-note">בסגנון נוטצ׳ התמונה לא מוצגת בנוטצ׳ עצמו — היא תופיע רק בהתראה הרגילה שנשלחת למכשירים שלא תומכים (fallback).</small>}
      <small className="adm-muted">כל תמונה (גם צילום מהטלפון): אם היא גדולה מ-5MB או מ-{meta.image.maxSide}px היא מוקטנת אוטומטית. נשמרת {meta.image.retentionDays} יום. {meta.capabilities.image?.note}</small>
    </div>
  );
}

function Content({ draft, set, meta }: { draft: Draft; set: SetDraft; meta: NotifMeta }) {
  return (
    <div className="adm-grid adm-grid-2">
      <label className="adm-field adm-span-2"><span className="adm-row" style={{ justifyContent: "space-between" }}>כותרת <Counter value={draft.title} max={meta.titleMax} /></span>
        <input className="adm-input" value={draft.title} maxLength={meta.titleMax + 10} onChange={(e) => set("title", e.target.value)} placeholder="למשל: חדש בתבל" data-testid="title" />
      </label>
      <label className="adm-field adm-span-2"><span className="adm-row" style={{ justifyContent: "space-between" }}>כותרת משנה (רשות) <Counter value={draft.subtitle} max={meta.titleMax} /></span>
        <input className="adm-input" value={draft.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="שורה שנייה מודגשת" data-testid="subtitle" />
      </label>
      <label className="adm-field adm-span-2"><span className="adm-row" style={{ justifyContent: "space-between" }}>תוכן <Counter value={draft.body} max={meta.bodyMax} /></span>
        <textarea className="adm-textarea" rows={3} value={draft.body} onChange={(e) => set("body", e.target.value)} placeholder="בלי סכומים, מספרי זהות או פרטים אישיים: ההתראה מוצגת גם על מסך נעול" data-testid="body" />
      </label>
      <ImagePicker draft={draft} set={set} meta={meta} />
      <label className="adm-field"><span>מסך שייפתח בנגיעה</span>
        <select className="adm-select" value={draft.route} onChange={(e) => set("route", e.target.value)} data-testid="route">
          {meta.routes.map((r) => <option key={r.route} value={r.route}>{r.label}</option>)}
        </select>
        <small className="adm-muted">{meta.capabilities.route?.note}</small>
      </label>
    </div>
  );
}

/* ---------------------------------------------------------------- display style: standard / animated notch */

const NOTCH_PRESETS: [number, string][] = [[1, "1 דק׳"], [10, "10 דק׳"], [30, "30 דק׳"], [60, "1 שעה"], [240, "4 שעות"], [480, "8 שעות"]];

/** Simple line glyphs for the notch icons (drawn here; no icon dependency). */
export function NotchGlyph({ id, size = 18 }: { id: string; size?: number }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const shapes: Record<string, ReactNode> = {
    megaphone: <><path {...p} d="M3 10v4h3l6 4V6L6 10H3z" /><path {...p} d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /></>,
    gift: <><rect {...p} x="3.5" y="9" width="17" height="11" rx="1.5" /><path {...p} d="M2.5 9h19M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 12 9 12 9zm0 0c1.5-3 5-3.5 5-1.2C17 9 12 9 12 9z" /></>,
    sparkles: <><path {...p} d="M10 3l1.8 5.2L17 10l-5.2 1.8L10 17l-1.8-5.2L3 10l5.2-1.8z" /><path {...p} d="M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z" /></>,
    bell: <><path {...p} d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path {...p} d="M10 20.5a2.2 2.2 0 0 0 4 0" /></>,
    star: <path {...p} d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z" />,
    tag: <><path {...p} d="M3.5 12.5V4h8.5l8.5 8.5-8.5 8.5z" /><circle {...p} cx="8" cy="8.5" r="1.3" /></>,
    info: <><circle {...p} cx="12" cy="12" r="8.5" /><path {...p} d="M12 11v5.5M12 7.6v.2" /></>,
    heart: <path {...p} d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">{shapes[id] ?? shapes.megaphone}</svg>;
}

function DisplayStylePicker({ draft, set, meta }: { draft: Draft; set: SetDraft; meta: NotifMeta }) {
  const n = meta.notch;
  const notch = !!n && draft.displayStyle === "notch";
  const presets = n ? NOTCH_PRESETS.filter(([m]) => m >= n.minMinutes && m <= n.maxMinutes) : [];
  const isPreset = presets.some(([m]) => m === draft.notchMinutes);
  return (
    <div className="adm-style" data-testid="display-style">
      <div className="adm-row" style={{ justifyContent: "space-between" }}>
        <span className="adm-style-label">סגנון תצוגה</span>
        {!n && <small className="adm-pill adm-pill-warn" data-testid="notch-unsupported">דורש עדכון שרת</small>}
      </div>
      <div className="adm-tabs adm-seg" role="radiogroup" aria-label="סגנון תצוגה">
        <button type="button" role="radio" aria-checked={!notch} className="adm-tab" onClick={() => set("displayStyle", "standard")} data-testid="style-standard">רגילה</button>
        <button type="button" role="radio" aria-checked={notch} className="adm-tab" disabled={!n} title={n ? undefined : "דורש עדכון שרת"}
          onClick={() => set("displayStyle", "notch")} data-testid="style-notch">נוטצ׳ מונפש</button>
      </div>
      {!n && <small className="adm-muted">נוטצ׳ מונפש (אי דינמי) יהיה זמין אחרי עדכון שרת החשבוניות. בינתיים כל ההתראות נשלחות בסגנון רגיל.</small>}
      {notch && n && (
        <div className="adm-style-body">
          <div className="adm-field">
            <span>כמה זמן להציג בנוטצ׳</span>
            <div className="adm-row" role="radiogroup" aria-label="כמה זמן להציג בנוטצ׳">
              {presets.map(([m, l]) => (
                <button key={m} type="button" role="radio" aria-checked={draft.notchMinutes === m} className="adm-tab adm-chip" onClick={() => set("notchMinutes", m)}>{l}</button>
              ))}
              <label className="adm-row adm-muted" style={{ gap: 6, fontSize: 13 }}>
                אחר:
                <input className="adm-input adm-mono" type="number" min={n.minMinutes} max={n.maxMinutes} step={1} style={{ width: 84, minHeight: 34 }}
                  value={draft.notchMinutes || ""} aria-label="משך מותאם בדקות" data-testid="notch-minutes" data-custom={!isPreset}
                  onChange={(e) => set("notchMinutes", Math.round(Number(e.target.value)) || 0)}
                  onBlur={() => set("notchMinutes", clampMinutes(draft.notchMinutes || n.defaultMinutes, meta))} />
                דק׳
              </label>
            </div>
            <small className="adm-muted">בין {n.minMinutes} ל-{n.maxMinutes} דקות ({minutesText(n.maxMinutes)}). ייעלם אחרי {minutesText(clampMinutes(draft.notchMinutes, meta))}.</small>
          </div>
          <div className="adm-field" style={{ marginTop: 10 }}>
            <span>סמל בנוטצ׳</span>
            <div className="adm-row adm-icon-pick" role="radiogroup" aria-label="סמל בנוטצ׳">
              {n.icons.map((i) => (
                <button key={i.id} type="button" role="radio" aria-checked={draft.notchIcon === i.id} className="adm-icon-btn" title={i.label} aria-label={i.label}
                  onClick={() => set("notchIcon", i.id)} data-testid={`notch-icon-${i.id}`}>
                  <NotchGlyph id={i.id} size={20} /><small>{i.label}</small>
                </button>
              ))}
            </div>
          </div>
          <p className="adm-muted adm-style-note">
            באייפון {n.minIos} ומעלה ההודעה תופיע באי הדינמי / בנוטצ׳ עם אנימציה ועל מסך הנעילה, ותיעלם אחרי הזמן שבחרת. מכשירים ישנים יותר או בלי הרשאה יקבלו התראה רגילה אוטומטית. תמונה לא מוצגת בנוטצ׳ (מגבלת Apple) — היא תופיע בהתראה הרגילה למכשירים שלא תומכים.
          </p>
        </div>
      )}
    </div>
  );
}

function presentationSummary(d: Draft, meta: NotifMeta): string[] {
  return [
    d.sound ? "צליל" : "שקט",
    d.interruptionLevel === "passive" ? "הפרעה: שקטה" : "הפרעה: רגילה",
    d.badgeMode === "leave" ? "סמל: לא משתנה" : d.badgeMode === "clear" ? "סמל: מתאפס" : `סמל: ${d.badge}`,
    `תוקף: ${TTL_OPTIONS.find(([s]) => s === d.ttlSeconds)?.[1] ?? `${Math.round(d.ttlSeconds / 3600)} שעות`}`,
    `עדיפות ${d.priority}`,
    `קיבוץ: ${d.threadId || meta.defaultThreadId}`,
    d.collapseKey ? `מחליפה: ${d.collapseKey}` : "לא מחליפה קודמת",
    d.inFeed ? "גם ב\"עדכונים\"" : "בלי \"עדכונים\"",
    ...(d.important ? ["חשוב"] : []),
  ];
}

function Presentation({ draft, set, meta }: { draft: Draft; set: SetDraft; meta: NotifMeta }) {
  const cap = meta.capabilities;
  const [open, setOpen] = useState(true);
  return (
    <div className="adm-adv" data-open={open}>
      <button type="button" className="adm-adv-head" aria-expanded={open} aria-controls="adm-adv-body" onClick={() => setOpen((o) => !o)}>
        <span className="adm-adv-chev" aria-hidden="true">{open ? "▾" : "◂"}</span>
        <span className="adm-adv-title">צליל, מספר על הסמל, רמת הפרעה, קיבוץ, החלפה, תוקף, עדיפות, &quot;עדכונים&quot;, חשוב</span>
        <span className="adm-adv-toggle">{open ? "הסתרה" : "פתיחה ועריכה"}</span>
      </button>
      <div className="adm-adv-summary" data-testid="adv-summary">{presentationSummary(draft, meta).map((s) => <span key={s} className="adm-pill">{s}</span>)}</div>
      {open && (
        <div id="adm-adv-body">
          <div className="adm-grid" style={{ marginTop: 12 }}>
            <label className="adm-field"><span>צליל</span>
              <select className="adm-select" value={draft.sound ? "1" : "0"} onChange={(e) => set("sound", e.target.value === "1")} data-testid="sound">
                <option value="1">צליל רגיל</option><option value="0">שקט</option>
              </select>
            </label>
            <label className="adm-field"><span>רמת הפרעה</span>
              <select className="adm-select" value={draft.interruptionLevel} onChange={(e) => set("interruptionLevel", e.target.value as Draft["interruptionLevel"])} data-testid="interruption">
                <option value="active">רגילה</option>
                <option value="passive">שקטה (בלי להדליק מסך)</option>
                <option value="time-sensitive" disabled>דחופה (Time Sensitive) — לא נתמך</option>
              </select>
              <small className="adm-muted">{cap.interruptionTimeSensitive?.note}</small>
            </label>
            <label className="adm-field"><span>מספר על סמל האפליקציה</span>
              <div className="adm-row" style={{ flexWrap: "nowrap" }}>
                <select className="adm-select" style={{ flex: 1, minWidth: 0 }} value={draft.badgeMode} onChange={(e) => set("badgeMode", e.target.value as Draft["badgeMode"])} data-testid="badge-mode">
                  <option value="leave">לא לשנות</option><option value="clear">לאפס</option><option value="set">לקבוע</option>
                </select>
                {draft.badgeMode === "set" && <input className="adm-input adm-mono" type="number" min={1} max={99} style={{ width: 80 }} value={draft.badge} onChange={(e) => set("badge", Math.max(1, Math.min(99, Number(e.target.value) || 1)))} aria-label="מספר" data-testid="badge" />}
              </div>
              {draft.badgeMode === "set" && <small className="adm-muted" style={{ color: "var(--color-amber)" }}>{cap.badge?.note}</small>}
            </label>
            <label className="adm-field"><span>תוקף (אם הטלפון לא מחובר)</span>
              <select className="adm-select" value={draft.ttlSeconds} onChange={(e) => set("ttlSeconds", Number(e.target.value))} data-testid="ttl">
                {TTL_OPTIONS.map(([s, l]) => <option key={s} value={s}>{l}</option>)}
              </select>
            </label>
            <label className="adm-field"><span>עדיפות</span>
              <select className="adm-select" value={draft.priority} onChange={(e) => set("priority", Number(e.target.value) as 5 | 10)} data-testid="priority">
                <option value={10}>מיד (10)</option><option value={5}>חוסך סוללה (5)</option>
              </select>
            </label>
            <label className="adm-field"><span>קיבוץ התראות (thread id)</span>
              <input className="adm-input adm-mono" dir="ltr" placeholder={meta.defaultThreadId} maxLength={40} value={draft.threadId} onChange={(e) => set("threadId", e.target.value.replace(/[^A-Za-z0-9_-]/g, ""))} data-testid="thread" />
            </label>
            <label className="adm-field"><span>מחליפה התראה קודמת עם המפתח</span>
              <input className="adm-input adm-mono" dir="ltr" placeholder="ללא" maxLength={40} value={draft.collapseKey} onChange={(e) => set("collapseKey", e.target.value.replace(/[^A-Za-z0-9_-]/g, ""))} data-testid="collapse" />
            </label>
          </div>
          <div className="adm-row" style={{ marginTop: 12, gap: 18 }}>
            <label className="adm-check"><input type="checkbox" checked={draft.inFeed} onChange={(e) => set("inFeed", e.target.checked)} data-testid="infeed" />להוסיף גם ל&quot;עדכונים&quot; באפליקציה</label>
            <label className="adm-check"><input type="checkbox" checked={draft.important} onChange={(e) => set("important", e.target.checked)} data-testid="important" />חשוב: לשלוח גם בשעות השקט ולמי שכיבה הודעות</label>
          </div>
          {draft.important && <p className="adm-muted" style={{ fontSize: 13, color: "var(--color-amber)" }}>רק לתקלה או שינוי מהותי בשירות. דורש אישור נוסף ונרשם ביומן. גם &quot;חשוב&quot; לא מגיע למכשיר שבו כובו ההתראות של העסק.</p>}
          <p className="adm-muted" style={{ fontSize: 12, marginTop: 10 }}>לא נתמך באפליקציה: {[cap.actions, cap.interruptionTimeSensitive].filter((c) => c && !c.supported).map((c) => c!.note).join(" · ")}</p>
        </div>
      )}
    </div>
  );
}

function PhonePreview({ draft, meta }: { draft: Draft; meta: NotifMeta }) {
  const [notchView, setNotchView] = useState<"island" | "lock">("island");
  const now = new Date().toLocaleTimeString("he-IL", { timeZone: "Asia/Jerusalem", hour: "2-digit", minute: "2-digit" });
  const route = meta.routes.find((r) => r.route === draft.route)?.label ?? draft.route;
  const title = draft.title.trim() || "כותרת ההתראה";
  const body = draft.body.trim() || "כאן יופיע התוכן…";
  const notch = !!meta.notch && draft.displayStyle === "notch";
  const minutes = minutesText(clampMinutes(draft.notchMinutes, meta));
  const banner = (
    <div className={`adm-phone-banner${draft.interruptionLevel === "passive" ? " adm-phone-passive" : ""}`} data-testid="preview-banner">
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
    </div>
  );
  return (
    <div className="adm-phone-wrap">
      {notch && (
        <div className="adm-tabs adm-seg adm-seg-sm" role="tablist" aria-label="תצוגת נוטצ׳">
          <button type="button" role="tab" aria-selected={notchView === "island"} className="adm-tab" onClick={() => setNotchView("island")}>אי דינמי</button>
          <button type="button" role="tab" aria-selected={notchView === "lock"} className="adm-tab" onClick={() => setNotchView("lock")}>מסך נעילה</button>
        </div>
      )}
      <div className="adm-phone" aria-label="תצוגה מקדימה של ההתראה">
        <div className="adm-phone-screen">
          {notch && notchView === "island" ? (
            <div className="adm-island-stage" data-testid="preview-island">
              <div className="adm-island" dir="rtl">
                <div className="adm-island-compact" aria-hidden="true">
                  <span className="adm-island-ico"><NotchGlyph id={draft.notchIcon} size={14} /></span>
                  <span className="adm-island-dot" />
                </div>
                <div className="adm-island-expanded">
                  <span className="adm-island-ico adm-island-ico-lg"><NotchGlyph id={draft.notchIcon} size={22} /></span>
                  <div className="adm-island-text">
                    <small>תבל</small>
                    <strong>{title}</strong>
                    <p>{body}</p>
                  </div>
                </div>
              </div>
              <div className="adm-phone-time adm-mono" style={{ marginTop: 56 }}>{now}</div>
              <p className="adm-island-cap">מוצג באי הדינמי עד {minutes}</p>
            </div>
          ) : notch ? (
            <>
              <div className="adm-phone-time adm-mono">{now}</div>
              <div className="adm-lock-card" data-testid="preview-lock" dir="rtl">
                <span className="adm-island-ico adm-island-ico-lg"><NotchGlyph id={draft.notchIcon} size={22} /></span>
                <div className="adm-island-text">
                  <small>תבל · {minutes}</small>
                  <strong>{title}</strong>
                  <p>{body}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="adm-phone-time adm-mono">{now}</div>
              {banner}
              {draft.image && (
                <div className="adm-phone-expanded" data-testid="preview-expanded">
                  <p className="adm-phone-exp-cap">פתוח (לחיצה ארוכה)</p>
                  <div className="adm-phone-banner">
                    <img className="adm-phone-image" src={draft.image.url} alt="תמונת ההתראה" style={{ marginTop: 0, marginBottom: 8 }} />
                    <strong className="adm-phone-exp-title">{title}</strong>
                    {draft.subtitle.trim() && <strong className="adm-phone-exp-title adm-phone-sub">{draft.subtitle.trim()}</strong>}
                    <p className="adm-phone-exp-body">{body}</p>
                    <span className="adm-phone-open">פתח</span>
                  </div>
                </div>
              )}
            </>
          )}
          <div className="adm-phone-meta">
            {draft.sound ? "🔔 צליל" : "🔕 שקט"} · {draft.interruptionLevel === "passive" ? "שקטה" : "רגילה"}
            {draft.badgeMode !== "leave" && ` · סמל: ${draft.badgeMode === "clear" ? "מתאפס" : draft.badge}`}
            {draft.important && " · חשוב"}
            {notch && ` · נוטצ׳ ${minutes}`}
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
      </div>
      {notch && (
        <div className="adm-fallback-prev">
          <p className="adm-eyebrow" style={{ margin: "0 0 6px" }}>מכשירים שלא תומכים יקבלו (רגילה)</p>
          {banner}
        </div>
      )}
      {draft.image && <p className="adm-muted" style={{ fontSize: 12 }}>התמונה תוצג רק בגרסת האפליקציה הבאה. בגרסה הנוכחית (TestFlight 15) תופיע ההתראה בלי תמונה.</p>}
    </div>
  );
}

/* ---------------------------------------------------------------- audience + user search */

function UserSearch({ mode, onPick, placeholder, autoFocus, testId }: {
  mode: "USER" | "BUSINESS"; onPick: (p: { value: string; label: string; userId: string }) => void; placeholder: string; autoFocus?: boolean; testId?: string;
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<AccountRow[]>([]);
  const [searched, setSearched] = useState("");
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) return;
    const t = setTimeout(() => {
      api<{ rows: AccountRow[] }>(`/accounts?q=${encodeURIComponent(term)}&limit=8`)
        .then((r) => { setResults(r.rows); setSearched(term); }).catch(() => { setResults([]); setSearched(term); });
    }, 250);
    return () => clearTimeout(t);
  }, [q]);
  const show = q.trim().length >= 2;
  return (
    <div className="adm-search">
      <input className="adm-input adm-search-input" type="search" placeholder={placeholder} value={q} autoFocus={autoFocus}
        onChange={(e) => { setQ(e.target.value); if (e.target.value.trim().length < 2) setResults([]); }} aria-label={placeholder} data-testid={testId} />
      {show && results.length > 0 && (
        <ul className="adm-pick">
          {results.flatMap((u) => mode === "USER"
            ? [<li key={u.userId}><button type="button" onClick={() => onPick({ value: u.userId, label: userLabel(u), userId: u.userId })}>{u.displayName ?? u.email} <span className="adm-mono adm-muted">{u.email}</span>{u.status !== "ACTIVE" && <span className="adm-pill adm-pill-bad" style={{ marginInlineStart: 6 }}>מושהה</span>}</button></li>]
            : u.businesses.map((b) => <li key={`${u.userId}-${b.businessId}`}><button type="button" onClick={() => onPick({ value: b.businessId, label: b.tradingName ?? b.legalName, userId: u.userId })}>{b.tradingName ?? b.legalName} <span className="adm-muted">· {u.displayName ?? u.email}</span></button></li>))}
        </ul>
      )}
      {show && searched === q.trim() && results.length === 0 && <p className="adm-muted" style={{ margin: "6px 0 0" }}>לא נמצא. אפשר לחפש לפי שם, מייל, שם עסק, ח.פ. או טלפון.</p>}
    </div>
  );
}

function AudiencePicker({ meta, value, onChange }: { meta: NotifMeta; value: AudiencePick; onChange: (a: AudiencePick) => void }) {
  const types: [AudiencePick["type"], string][] = [["USER", "משתמש מסוים"], ["BUSINESS", "עסק מסוים"], ["ALL", "כל המשתמשים"], ["PLAN", "לפי מסלול"], ["BUSINESS_TYPE", "לפי סוג עסק"]];
  return (
    <div>
      <div className="adm-tabs" role="radiogroup" aria-label="קהל" style={{ marginBottom: 10 }}>
        {types.map(([t, l]) => (
          <button key={t} type="button" role="radio" aria-checked={value.type === t} className="adm-tab"
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
          <div className="adm-chosen" data-testid="audience-chosen">
            <span className="adm-muted">{value.type === "USER" ? "נשלח אל:" : "נשלח לעסק:"}</span>
            <strong>{value.label}</strong>
            <button type="button" className="adm-link" onClick={() => onChange({ type: value.type, value: null, label: "" })}>החלפה</button>
          </div>
        ) : (
          <UserSearch key={value.type} mode={value.type} autoFocus testId="audience-search"
            placeholder={value.type === "USER" ? "חיפוש משתמש: שם, מייל, שם עסק או טלפון" : "חיפוש עסק: שם עסק, ח.פ. או בעלים"}
            onPick={(p) => onChange({ type: value.type, value: p.value, label: p.label })} />
        )
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- test send (separate from the real send) */

function TestSend({ meta, draft, contentReady, audience, onSent }: { meta: NotifMeta; draft: Draft; contentReady: boolean; audience: AudiencePick; onSent: () => void }) {
  // Remembered pick first, then the admin's own app user (if the admin e-mail is one). Mounted only
  // after meta loaded in the browser, so localStorage is there.
  const [recipient, setRecipient] = useState<TestRecipient | null>(() =>
    loadTestRecipient() ?? (meta.adminAppUser ? { userId: meta.adminAppUser.userId, label: `${userLabel(meta.adminAppUser)} — המייל שלך` } : null));
  const [changing, setChanging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Announcement | null>(null);
  const style: DisplayStyle | undefined = meta.notch ? draft.displayStyle : undefined;
  const reach = useReach(recipient ? { type: "USER", value: recipient.userId } : null, true, style);
  const pick = (r: TestRecipient) => { setRecipient(r); saveTestRecipient(r); setChanging(false); setResult(null); setError(""); };
  const sendTest = async () => {
    if (!recipient) return;
    setError(""); setResult(null); setBusy(true);
    try {
      const r = await api<{ announcement: Announcement }>("/notifications/test", { body: { ...payloadOf(draft), ...notchPayloadOf(draft, meta), testUserId: recipient.userId } });
      setResult(r.announcement); onSent();
    } catch (e) { setError(errText(e)); } finally { setBusy(false); }
  };
  return (
    <div className="adm-test-box" data-testid="test-box">
      <h3 className="adm-h3" style={{ margin: 0 }}>שליחת בדיקה ל...</h3>
      <p className="adm-muted" style={{ fontSize: 13, margin: "4px 0 10px" }}>בדיקה יוצאת מיד למשתמש אחד שבוחרים כאן (בלי שעות שקט), מסומנת &quot;בדיקה&quot;, ולא נוגעת בקהל של שלב 1.</p>
      {recipient && !changing ? (
        <div className="adm-chosen" data-testid="test-recipient">
          <span className="adm-muted">בדיקה אל:</span><strong>{recipient.label}</strong>
          <button type="button" className="adm-link" onClick={() => setChanging(true)}>החלפה</button>
        </div>
      ) : (
        <>
          <UserSearch mode="USER" testId="test-search" placeholder="למי לשלוח את הבדיקה? חיפוש משתמש באפליקציה" onPick={(p) => pick({ userId: p.value, label: p.label })} />
          <div className="adm-row" style={{ marginTop: 6 }}>
            {audience.type === "USER" && audience.value && <button type="button" className="adm-link" onClick={() => pick({ userId: audience.value!, label: audience.label })}>למשתמש שנבחר בשלב 1</button>}
            {meta.adminAppUser && <button type="button" className="adm-link" onClick={() => pick({ userId: meta.adminAppUser!.userId, label: `${userLabel(meta.adminAppUser!)} — המייל שלך` })}>למשתמש עם המייל שלי</button>}
            {recipient && <button type="button" className="adm-link" onClick={() => setChanging(false)}>ביטול</button>}
          </div>
        </>
      )}
      {recipient && !changing && <ReachBox preview={reach.preview} single inFeed={draft.inFeed} compact notch={style === "notch"} />}
      <div className="adm-row" style={{ marginTop: 10 }}>
        <button type="button" className="adm-btn-ghost" disabled={busy || !contentReady || !recipient || changing} onClick={sendTest} data-testid="test-send">
          {busy ? "שולח…" : recipient ? `שלח בדיקה ל-${recipient.label.split(" (")[0]}` : "שלח בדיקה"}
        </button>
        {!contentReady && <small className="adm-muted">חסרים כותרת ותוכן.</small>}
      </div>
      {error && <p className="adm-error" role="alert">{error}</p>}
      {result && <SentResult a={result} single />}
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
      <div className="adm-modal" style={{ maxWidth: 520 }}>
        <h2 className="adm-h2" id="adm-send-title">{draft.when === "later" ? "לתזמן את ההתראה?" : "לשלוח את ההתראה?"}</h2>
        <p className="adm-sub" style={{ color: "var(--color-stone)" }}><strong>{draft.title}</strong> — {audienceText(audience.type, audience.value, audience.label)}{draft.when === "later" && ` · ${draft.scheduledFor.replace("T", " ")} (שעון ישראל)`}</p>
        <ReachBox preview={preview} single={audience.type === "USER"} inFeed={draft.inFeed} notch={!!meta.notch && draft.displayStyle === "notch"} />
        <dl className="adm-kv" style={{ marginTop: 10 }}>
          <dt>משתמשים</dt><dd className="adm-mono">{preview.users}</dd>
          <dt>עסקים</dt><dd className="adm-mono">{preview.businesses}</dd>
          <dt>מכשירים שיקבלו התראה</dt><dd className="adm-mono">{preview.devices}</dd>
          <dt>כיבו הודעות מתבל</dt><dd className="adm-mono">{preview.optedOut}</dd>
          <dt>בלי מכשיר עם התראות פעילות</dt><dd className="adm-mono">{preview.noDevice}</dd>
          {meta.notch && <><dt>סגנון תצוגה</dt><dd data-testid="confirm-style">{draft.displayStyle === "notch" ? "נוטצ׳ מונפש (אי דינמי)" : "רגילה"}</dd></>}
          {meta.notch && draft.displayStyle === "notch" && <>
            <dt>משך בנוטצ׳</dt><dd data-testid="confirm-notch-minutes">{minutesText(clampMinutes(draft.notchMinutes, meta))}</dd>
            {typeof preview.notchDevices === "number" && <><dt>יקבלו נוטצ׳ / רגילה</dt><dd className="adm-mono">{preview.notchDevices} / {preview.fallbackDevices ?? Math.max(0, preview.devices - preview.notchDevices)}</dd></>}
          </>}
          {preview.deferredQuiet > 0 && draft.when === "now" && <><dt>יחכו לסוף שעות השקט</dt><dd className="adm-mono">{preview.deferredQuiet} (עד {fmtDateTime(preview.quietUntil)})</dd></>}
        </dl>
        <p className="adm-muted" style={{ fontSize: 13 }}>{draft.inFeed ? `כל ${preview.users} המשתמשים יראו אותה ב"עדכונים", גם בלי התראה בטלפון.` : "לא תתווסף ל\"עדכונים\"."}</p>
        {needWord && <label className="adm-field"><span>לשליחה לכולם יש להקליד: {meta.confirmWord}</span><input className="adm-input" value={word} onChange={(e) => setWord(e.target.value)} autoFocus /></label>}
        {draft.important && <label className="adm-field" style={{ marginTop: 8 }}><span>התראה &quot;חשובה&quot; עוקפת את שעות השקט ואת הבחירה של המשתמש. להקליד: {meta.importantWord}</span><input className="adm-input" value={importantWord} onChange={(e) => setImportantWord(e.target.value)} data-testid="important-word" /></label>}
        {error && <p className="adm-error" role="alert">{error}</p>}
        <div className="adm-row" style={{ marginTop: 16 }}>
          <button className="adm-btn" disabled={busy || !ok} onClick={go} data-testid="confirm-send">{busy ? "רגע…" : draft.when === "later" ? "תזמון" : preview.devices === 0 ? "לשלוח בכל זאת (רק ל\"עדכונים\")" : "שליחה"}</button>
          <button className="adm-btn-ghost" disabled={busy} onClick={onClose}>ביטול</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- history */

function settingsOf(a: Announcement, meta: NotifMeta): string[] {
  const out: string[] = [`מסך: ${meta.routes.find((r) => r.route === a.route)?.label ?? a.route}`];
  if (a.sound !== undefined) out.push(a.sound ? "צליל" : "שקט");
  if (a.interruptionLevel) out.push(a.interruptionLevel === "passive" ? "הפרעה שקטה" : "הפרעה רגילה");
  if (a.badge !== undefined && a.badge !== null) out.push(a.badge === 0 ? "סמל מתאפס" : `סמל ${a.badge}`);
  if (a.ttlSeconds) out.push(`תוקף ${TTL_OPTIONS.find(([s]) => s === a.ttlSeconds)?.[1] ?? `${Math.round(a.ttlSeconds / 3600)} ש׳`}`);
  if (a.priority) out.push(`עדיפות ${a.priority}`);
  if (a.threadId) out.push(`קיבוץ ${a.threadId}`);
  if (a.collapseKey) out.push(`מחליפה ${a.collapseKey}`);
  if (a.displayStyle === "notch") {
    const icon = meta.notch?.icons.find((i) => i.id === a.notchIcon)?.label ?? a.notchIcon;
    out.push(`נוטצ׳${a.notchMinutes ? ` ${minutesText(a.notchMinutes)}` : ""}${icon ? ` · סמל ${icon}` : ""}`);
  }
  return out;
}

function History({ data, reload, meta }: { data: { total: number; rows: Announcement[] } | null; reload: () => void; meta: NotifMeta }) {
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
          <table className="adm-table" data-testid="history">
            <thead><tr><th>מתי</th><th>התראה</th><th>קהל</th><th>מצב</th><th>משתמשים</th><th>מכשירים</th><th>נמסרו</th><th>נכשלו</th><th>ממתינות</th><th>נפתחו ב&quot;עדכונים&quot;</th><th /></tr></thead>
            <tbody>
              {rows.map((a) => {
                const [label, cls] = STATUS_HE[a.status] ?? [a.status, "adm-pill"];
                const noPhone = a.status === "SENT" && (a.devices ?? 0) === 0;
                return (
                  <tr key={a.id} style={{ cursor: "default" }} className={noPhone ? "adm-row-bad" : undefined}>
                    <td className="adm-mono">{fmtDateTime(a.sentAt ?? a.scheduledFor)}<br /><small className="adm-muted">{a.createdBy}</small></td>
                    <td style={{ minWidth: 260 }}>
                      <div className="adm-row" style={{ flexWrap: "nowrap", alignItems: "flex-start" }}>
                        {a.imageUrl && <img className="adm-hist-thumb" src={a.imageUrl} alt="" />}
                        <div><strong>{a.title}</strong>{a.subtitle && <div className="adm-muted">{a.subtitle}</div>}<div className="adm-muted" style={{ fontSize: 13 }}>{a.body}</div></div>
                      </div>
                      <div className="adm-row" style={{ marginTop: 4, gap: 4 }}>
                        {a.isTest && <span className="adm-pill">בדיקה</span>}{a.important && <span className="adm-pill adm-pill-warn">חשוב</span>}
                        {a.imageUrl && <span className="adm-pill">עם תמונה</span>}
                        {a.displayStyle === "notch" && <span className="adm-pill adm-pill-ok" data-testid="hist-notch">נוטצ׳{a.notchMinutes ? ` · ${minutesText(a.notchMinutes)}` : ""}</span>}
                        {!a.inFeed && <span className="adm-pill">בלי עדכונים</span>}{a.templateId && <span className="adm-pill">מתבנית v{a.templateVersion}</span>}
                      </div>
                      <div className="adm-hist-settings">{settingsOf(a, meta).join(" · ")}</div>
                      {a.displayStyle === "notch" && <NotchHistory a={a} />}
                    </td>
                    <td>{audienceText(a.audienceType, a.audienceValue)}{a.audienceValue && <div className="adm-mono adm-muted" style={{ fontSize: 11 }}>{a.audienceValue.slice(0, 8)}</div>}</td>
                    <td><span className={cls}>{label}</span>{a.lastError && <div className="adm-error" style={{ fontSize: 12 }}>{a.lastError}</div>}</td>
                    <td className="adm-mono">{a.targetedUsers ?? "—"}{a.optedOut ? <div className="adm-muted" style={{ fontSize: 12 }}>{a.optedOut} כיבו</div> : null}{a.noDevice ? <div className="adm-muted" style={{ fontSize: 12 }}>{a.noDevice} בלי מכשיר</div> : null}</td>
                    <td className="adm-mono">{noPhone ? <span className="adm-pill adm-pill-bad" title="אף טלפון לא קיבל את ההתראה — רק &quot;עדכונים&quot;">0 · לא הגיעה לטלפון</span> : <strong>{a.devices ?? "—"}</strong>}</td>
                    <td className="adm-mono">{a.delivery.delivered}</td>
                    <td className="adm-mono">{a.delivery.failed > 0 ? <span className="adm-pill adm-pill-bad">{a.delivery.failed}</span> : a.delivery.failed}</td>
                    <td className="adm-mono">{a.delivery.pending}</td>
                    <td className="adm-mono">{a.openedInApp}{a.delivery.openedPush ? <div className="adm-muted" style={{ fontSize: 12 }}>{a.delivery.openedPush} מההתראה</div> : null}</td>
                    <td>{a.status === "SCHEDULED" && <button className="adm-btn-danger" onClick={() => void cancel(a.id)}>ביטול</button>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="adm-muted" style={{ fontSize: 12, marginTop: 8 }}>&quot;מכשירים&quot; = כמה טלפונים רשומים להתראות היו אמורים לקבל אותה. &quot;נמסרו&quot; = Apple קיבלה את ההתראה למסירה. &quot;נפתחו&quot; סופר מי שפתח אותה ב&quot;עדכונים&quot;, ומגרסה 16 של האפליקציה גם נגיעה בהתראה עצמה.</p>
    </section>
  );
}

/** Split + live Live-Activity counts for one notch send. */
function NotchHistory({ a }: { a: Announcement }) {
  const split = a.notchDevices !== null && a.notchDevices !== undefined;
  const live = a.notch;
  if (!split && !live) return null;
  return (
    <div className="adm-hist-settings" data-testid="hist-notch-counts">
      {split && <span>נוטצ׳ {a.notchDevices} · רגילה (fallback) {a.notchFallback ?? 0}</span>}
      {live && <span>{split ? " — " : ""}הופעלו {live.started} · עברו לרגילה {live.fallback} · הסתיימו {live.ended}{live.pending ? ` · ממתינים ${live.pending}` : ""}{live.failed ? <> · <span className="adm-error">נכשלו {live.failed}</span></> : null}</span>}
    </div>
  );
}

/* ------------------------------------------------------------------ account drawer panel */

interface Panel {
  devices: { id: string; environment: string; appVersion: string | null; registeredAt: string; lastSeenAt: string; live: boolean; disabledReason: string | null; businesses: { businessId: string; on: boolean }[] }[];
  preferences: { disabledCategories: string[]; enabledKinds: string[]; quietHours: boolean; configured: boolean };
  recentPushes: { id: string; kind: string; title: string; status: string; createdAt: string; sentAt: string | null; lastError: string | null }[];
  announcements: { id: string; title: string; sentAt: string | null }[];
  businesses: { businessId: string; legalName: string }[];
  marketingConsent?: { granted: boolean; changedAt: string | null };
}
const CATEGORY_HE: Record<string, string> = { DOCUMENTS: "מסמכים", PAYMENTS: "תשלומים", CUSTOMERS: "לקוחות", TEAM: "צוות", SUBSCRIPTION: "מנוי", REPORTS: "דוחות", SECURITY: "אבטחה", ANNOUNCEMENTS: "הודעות מתבל" };
const PUSH_STATUS_HE: Record<string, string> = { PENDING: "ממתינה", LEASED: "בשליחה", SENT: "נמסרה", FAILED: "נכשלה", DROPPED: "המכשיר נותק" };

export function UserNotificationsPanel({ userId, onSend }: { userId: string; onSend: () => void }) {
  const [panel, setPanel] = useState<Panel | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { api<Panel>(`/users/${userId}/notifications`).then(setPanel).catch((e) => setError(msg(e))); }, [userId]);
  const name = (id: string) => panel?.businesses.find((b) => b.businessId === id)?.legalName ?? id.slice(0, 8);
  const live = panel?.devices.filter((d) => d.live).length ?? 0;
  return (
    <section className="adm-card" id="adm-user-notif">
      <div className="adm-row" style={{ justifyContent: "space-between" }}>
        <h3 className="adm-h3" style={{ margin: 0 }}>מכשירים והתראות</h3>
        <button className="adm-btn" onClick={onSend}>שלח התראה</button>
      </div>
      {error && <p className="adm-error">{error}</p>}
      {panel && (
        <>
          <div className={`adm-reach ${live === 0 ? "adm-reach-bad" : "adm-reach-ok"}`} data-testid="user-devices" data-devices={live}>
            <strong className="adm-reach-n">מכשירים רשומים: {live}</strong>
            {panel.devices.length > live && <span className="adm-reach-sub">ועוד {panel.devices.length - live} כבויים / מנותקים</span>}
            {live === 0 && <p className="adm-reach-warn">{NO_DEVICE_ONE}</p>}
          </div>
          {panel.devices.length > 0 && (
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
            <dt>הסכמה לדיוור שיווקי</dt><dd>{panel.marketingConsent?.granted ? `נתן/ה הסכמה (${fmtDateTime(panel.marketingConsent.changedAt)})` : "לא (ברירת מחדל)"}</dd>
            <dt>שעות שקט</dt><dd>{panel.preferences.quietHours ? "מכובדות (22:00–08:00, שבת וחג)" : "כבויות — התראות בכל שעה"}</dd>
          </dl>
          <h3 className="adm-h3" style={{ marginTop: 14 }}>התראות אחרונות</h3>
          {panel.recentPushes.length === 0 ? <p className="adm-muted">לא נשלחו התראות לטלפון ב-60 הימים האחרונים.</p> : (
            <ul className="adm-plain">{panel.recentPushes.map((p) => (
              <li key={p.id}><span className="adm-mono adm-muted">{fmtDateTime(p.sentAt ?? p.createdAt)}</span> {p.title} <span className="adm-pill">{PUSH_STATUS_HE[p.status] ?? p.status}</span>{p.kind === "ANNOUNCEMENT" && <span className="adm-pill" style={{ marginInlineStart: 4 }}>מהניהול</span>}</li>
            ))}</ul>
          )}
          {panel.announcements.length > 0 && <p className="adm-muted" style={{ fontSize: 13 }}>הודעות מהניהול שקיבל (כולל רק ב&quot;עדכונים&quot;): {panel.announcements.length}</p>}
        </>
      )}
    </section>
  );
}
