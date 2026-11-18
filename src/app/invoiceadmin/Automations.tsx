"use client";
// "התראות" → "אוטומציות": admin-defined automated notifications for the Tevel invoicing app.
// A rule = trigger (+ parameters) + audience + timing + content (with {variables}) + SERVICE/MARKETING;
// lifecycle draft → test-to-me → active ⇄ paused. Dry run ("who would get this now"), per-rule stats.
// Server: /platform-admin/notifications/automations/* (invoice repo, migration 0123,
// docs/operations/PLATFORM-ADMIN.md §Automations).
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from "react";
import { api, ApiError } from "./api";
import { BUSINESS_TYPE_HE, PLAN_HE, fmtDateTime } from "./labels";

interface Param { key: string; label: string; type: "int" | "time" | "weekday" | "datetime" | "bool"; min?: number; max?: number; default?: number | string | boolean; required?: boolean }
interface Variable { key: string; label: string; sample: string }
interface Trigger {
  id: string; group: "EVENT" | "BEHAVIOR" | "THRESHOLD" | "SCHEDULE"; label: string; description: string; source: string; scope: "BUSINESS" | "USER";
  params: Param[]; variables: Variable[]; defaultCategory: string; conversion: { code: string; label: string } | null;
}
interface AutoMeta {
  enabled: boolean; triggers: Trigger[]; categories: { id: string; label: string }[]; routes: { route: string; label: string }[];
  settings: { maxPerUserDay: number; maxPerUserWeek: number }; scheduleCatchUpHours: number; marketingConsentText: string; adminIsAppUser: boolean;
}
interface Audience {
  plans?: string[]; businessTypes?: string[]; vatReportDue?: boolean; lastSeenWithinDays?: number; inactiveForDays?: number;
  appVersionMin?: string; appVersionMax?: string; pushEnabled?: boolean; businessIds?: string[]; userIds?: string[];
}
interface Timing { mode: "IMMEDIATE" | "DELAY" | "FIXED_TIME"; delayMinutes?: number; atTime?: string; windowFrom: string; windowTo: string; respectQuietHours: boolean }
interface Content { title: string; subtitle: string | null; body: string; route: string; imageId: string | null; inFeed: boolean; sound: boolean }
interface Stats { sent: number; pending: number; skipped: number; delivered: number; opened: number; converted: number | null; conversionLabel: string | null; lastSentAt: string | null }
interface Rule {
  id: string; readyKey: string | null; name: string; description: string | null; purpose: "SERVICE" | "MARKETING"; category: string;
  triggerType: string; triggerParams: Record<string, number | string | boolean>; audience: Audience; timing: Timing; caps: { perUserDay?: number; perUserWeek?: number };
  content: Content; status: "DRAFT" | "ACTIVE" | "PAUSED" | "ARCHIVED"; version: number; testedVersion: number | null; activatedAt: string | null;
  lastEvaluatedAt: string | null; lastRun: { queued?: number; skipped?: number } | null; stats?: Stats; image?: { url: string | null } | null;
}
interface DryRun { recipients: number; businesses: number; withConsent: number | null; withDevice: number; capped: boolean; samples: { title: string; body: string }[]; note: string | null }

const STATUS: Record<Rule["status"], [string, string]> = {
  DRAFT: ["טיוטה", "adm-pill"], ACTIVE: ["פעיל", "adm-pill adm-pill-ok"], PAUSED: ["מושהה", "adm-pill adm-pill-warn"], ARCHIVED: ["בארכיון", "adm-pill"],
};
const GROUP_HE: Record<Trigger["group"], string> = { EVENT: "אירוע", BEHAVIOR: "התנהגות / חוסר פעילות", THRESHOLD: "סף", SCHEDULE: "תזמון" };
const WEEKDAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
const ERR: Record<string, string> = {
  AUTOMATION_TEST_REQUIRED: "קודם שולחים בדיקה אליי (לגרסה הנוכחית של הכלל), ורק אז מפעילים.",
  AUTOMATION_STATE: "אי אפשר במצב הנוכחי של הכלל.",
  ADMIN_NOT_APP_USER: "המייל שלך לא רשום כמשתמש באפליקציה, ולכן אין לאן לשלוח בדיקה.",
  CONFIRMATION_REQUIRED: "חסר אישור.",
};
const errText = (e: unknown) => (e instanceof ApiError ? (ERR[e.code] ?? e.message) : "שגיאה");

function fill(text: string, vars: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? "").replace(/\s+([,.:!?])/g, "$1").replace(/^[\s,.:–-]+/, "").replace(/\s{2,}/g, " ").trim();
}

function triggerSummary(t: Trigger | undefined, p: Rule["triggerParams"]): string {
  if (!t) return "";
  const bits = t.params.filter((x) => p[x.key] !== undefined && x.type !== "bool").map((x) =>
    x.type === "weekday" ? `יום ${WEEKDAYS[Number(p[x.key])]}` : `${x.label}: ${p[x.key]}`);
  return bits.length ? `${t.label} · ${bits.join(" · ")}` : t.label;
}

export default function Automations() {
  const [meta, setMeta] = useState<AutoMeta | null>(null);
  const [rows, setRows] = useState<Rule[] | null>(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Rule | "new" | null>(null);
  const [detail, setDetail] = useState<string | null>(null);

  const load = useCallback(() => {
    api<{ rows: Rule[] }>("/notifications/automations").then((r) => setRows(r.rows)).catch((e) => setError(errText(e)));
  }, []);
  useEffect(() => {
    api<AutoMeta>("/notifications/automations/meta").then(setMeta).catch((e) => setError(errText(e)));
    load();
  }, [load]);

  if (!meta) return error ? <p className="adm-error" role="alert">{error}</p> : <p className="adm-muted">טוען…</p>;
  const trig = (id: string) => meta.triggers.find((t) => t.id === id);

  if (editing !== null) {
    return <RuleBuilder meta={meta} rule={editing === "new" ? null : editing} onClose={(changed) => { setEditing(null); if (changed) load(); }} />;
  }

  return (
    <>
      {!meta.enabled && <div className="adm-card" role="status" style={{ borderColor: "var(--color-amber)" }}><strong>האוטומציות כבויות בשרת</strong> (PUSH_AUTOMATIONS_ENABLED=0). אפשר לערוך כללים, אבל שום כלל לא נשלח.</div>}
      <section className="adm-card">
        <div className="adm-row" style={{ justifyContent: "space-between" }}>
          <div>
            <h2 className="adm-h2" style={{ margin: 0 }}>אוטומציות</h2>
            <p className="adm-muted" style={{ margin: "4px 0 0", fontSize: 13 }}>
              כל כלל שולח לכל משתמש פעם אחת לכל אירוע. תקרה כללית: עד {meta.settings.maxPerUserDay} ביום ו-{meta.settings.maxPerUserWeek} בשבוע למשתמש. שעות השקט (22:00–08:00, שבת וחג) נשמרות.
            </p>
          </div>
          <div className="adm-row">
            <CapsEditor settings={meta.settings} onSaved={(s) => setMeta({ ...meta, settings: s })} />
            <button className="adm-btn" onClick={() => setEditing("new")}>כלל חדש</button>
          </div>
        </div>
        {error && <p className="adm-error" role="alert">{error}</p>}
        {rows === null ? <p className="adm-muted">טוען…</p> : (
          <div className="adm-table-wrap" style={{ marginTop: 12 }}>
            <table className="adm-table">
              <thead><tr><th>כלל</th><th>מתי</th><th>מצב</th><th>נשלחו</th><th>נמסרו</th><th>נפתחו</th><th>המרה</th><th>דולגו</th><th /></tr></thead>
              <tbody>
                {rows.map((r) => {
                  const [label, cls] = STATUS[r.status];
                  return (
                    <tr key={r.id} onClick={() => setDetail(detail === r.id ? null : r.id)}>
                      <td style={{ minWidth: 220 }}>
                        <strong>{r.name}</strong>
                        <div className="adm-row" style={{ marginTop: 4 }}>
                          <span className={r.purpose === "MARKETING" ? "adm-pill adm-pill-warn" : "adm-pill"}>{r.purpose === "MARKETING" ? "שיווק" : "שירות"}</span>
                          {r.readyKey && <span className="adm-pill">מוכן מראש</span>}
                          <span className="adm-pill">{meta.categories.find((c) => c.id === r.category)?.label ?? r.category}</span>
                        </div>
                        <div className="adm-muted" style={{ fontSize: 13, marginTop: 4 }}>{r.content.title}</div>
                      </td>
                      <td style={{ fontSize: 13 }}>{triggerSummary(trig(r.triggerType), r.triggerParams)}</td>
                      <td><span className={cls}>{label}</span>{r.status === "DRAFT" && r.testedVersion === r.version && <div className="adm-muted" style={{ fontSize: 12 }}>נבדק ✓</div>}</td>
                      <td className="adm-mono">{r.stats?.sent ?? 0}{r.stats?.pending ? <div className="adm-muted" style={{ fontSize: 12 }}>+{r.stats.pending} ממתינות</div> : null}</td>
                      <td className="adm-mono">{r.stats?.delivered ?? 0}</td>
                      <td className="adm-mono">{r.stats?.opened ?? 0}</td>
                      <td className="adm-mono">{r.stats?.converted ?? "—"}</td>
                      <td className="adm-mono">{r.stats?.skipped ?? 0}</td>
                      <td onClick={(e) => e.stopPropagation()}><RuleActions rule={r} meta={meta} onEdit={() => setEditing(r)} reload={load} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <p className="adm-muted" style={{ fontSize: 12, marginTop: 8 }}>
          &quot;נפתחו&quot; = נפתחה ב&quot;עדכונים&quot; או בנגיעה בהתראה (מגרסה 16 של האפליקציה). &quot;המרה&quot; = המטרה של הכלל קרתה אחרי השליחה (למשל הופק מסמך תוך 24 שעות).
        </p>
      </section>
      {detail && <RuleDetail key={detail} id={detail} meta={meta} />}
    </>
  );
}

function CapsEditor({ settings, onSaved }: { settings: AutoMeta["settings"]; onSaved: (s: AutoMeta["settings"]) => void }) {
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState(settings.maxPerUserDay);
  const [week, setWeek] = useState(settings.maxPerUserWeek);
  const [error, setError] = useState("");
  if (!open) return <button className="adm-btn-ghost" onClick={() => setOpen(true)}>תקרות</button>;
  const save = async () => {
    try {
      const r = await api<{ settings: AutoMeta["settings"] }>("/notifications/automations/settings", { method: "PATCH", body: { maxPerUserDay: day, maxPerUserWeek: week } });
      onSaved(r.settings); setOpen(false);
    } catch (e) { setError(errText(e)); }
  };
  return (
    <div className="adm-row">
      <label className="adm-check">ביום <input className="adm-input adm-mono" type="number" min={1} max={20} style={{ width: 64 }} value={day} onChange={(e) => setDay(Number(e.target.value))} /></label>
      <label className="adm-check">בשבוע <input className="adm-input adm-mono" type="number" min={1} max={50} style={{ width: 64 }} value={week} onChange={(e) => setWeek(Number(e.target.value))} /></label>
      <button className="adm-btn-ghost" onClick={save}>שמירה</button>
      {error && <span className="adm-error">{error}</span>}
    </div>
  );
}

function RuleActions({ rule, meta, onEdit, reload }: { rule: Rule; meta: AutoMeta; onEdit: () => void; reload: () => void }) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const act = async (action: "test" | "activate" | "pause" | "archive") => {
    setBusy(true); setNote("");
    try {
      if (action === "activate") {
        const d = await api<{ dryRun: DryRun }>(`/notifications/automations/${rule.id}/dry-run`, { body: {} });
        const consent = d.dryRun.withConsent !== null ? ` (מתוכם ${d.dryRun.withConsent} נתנו הסכמה לשיווק)` : "";
        if (!window.confirm(`להפעיל את "${rule.name}"?\nכרגע הכלל היה פונה ל-${d.dryRun.recipients} משתמשים${consent}.\n${d.dryRun.note ?? ""}`)) { setBusy(false); return; }
        await api(`/notifications/automations/${rule.id}/activate`, { body: { confirm: true } });
      } else if (action === "archive") {
        if (!window.confirm("להעביר לארכיון? הכלל יפסיק לפעול.")) { setBusy(false); return; }
        await api(`/notifications/automations/${rule.id}/archive`, { body: {} });
      } else {
        await api(`/notifications/automations/${rule.id}/${action}`, { body: {} });
        if (action === "test") setNote("נשלחה בדיקה");
      }
      reload();
    } catch (e) { setNote(errText(e)); } finally { setBusy(false); }
  };
  return (
    <div className="adm-row" style={{ flexWrap: "nowrap" }}>
      {rule.status === "ACTIVE" ? <button className="adm-btn-ghost" disabled={busy} onClick={() => void act("pause")}>השהיה</button>
        : <button className="adm-btn" disabled={busy} onClick={() => void act("activate")}>הפעלה</button>}
      <button className="adm-btn-ghost" disabled={busy || !meta.adminIsAppUser} onClick={() => void act("test")} title={meta.adminIsAppUser ? "" : ERR.ADMIN_NOT_APP_USER}>בדיקה אליי</button>
      <button className="adm-link" onClick={onEdit}>עריכה</button>
      {rule.status !== "ACTIVE" && <button className="adm-link" onClick={() => void act("archive")}>ארכיון</button>}
      {note && <small className="adm-muted">{note}</small>}
    </div>
  );
}

interface RecentSend { id: string; title: string; body: string; isTest: boolean; status: string; sentAt: string | null; scheduledFor: string; targetedUsers: number | null; devices: number | null; delivery: { delivered: number; pending: number; failed: number } ; openedInApp: number }

function RuleDetail({ id, meta }: { id: string; meta: AutoMeta }) {
  const [data, setData] = useState<{ rule: Rule; stats: Stats; skipReasons: Record<string, number>; recent: RecentSend[] } | null>(null);
  const [dry, setDry] = useState<DryRun | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { api<{ rule: Rule; stats: Stats; skipReasons: Record<string, number>; recent: RecentSend[] }>(`/notifications/automations/${id}`).then(setData).catch((e) => setError(errText(e))); }, [id]);
  const runDry = async () => { try { setDry((await api<{ dryRun: DryRun }>(`/notifications/automations/${id}/dry-run`, { body: {} })).dryRun); } catch (e) { setError(errText(e)); } };
  if (!data) return <section className="adm-card">{error ? <p className="adm-error">{error}</p> : <p className="adm-muted">טוען…</p>}</section>;
  const { rule, stats } = data;
  const SKIP_HE: Record<string, string> = { CAP_USER_DAY: "תקרה יומית למשתמש", CAP_USER_WEEK: "תקרה שבועית למשתמש", CAP_RULE_DAY: "תקרה יומית של הכלל", CAP_RULE_WEEK: "תקרה שבועית של הכלל", NO_CONSENT: "בלי הסכמה לשיווק" };
  return (
    <section className="adm-card">
      <div className="adm-row" style={{ justifyContent: "space-between" }}>
        <h3 className="adm-h3" style={{ margin: 0 }}>{rule.name} · גרסה {rule.version}</h3>
        <button className="adm-btn-ghost" onClick={() => void runDry()}>מי היה מקבל עכשיו?</button>
      </div>
      {rule.description && <p className="adm-muted">{rule.description}</p>}
      <dl className="adm-kv">
        <dt>טריגר</dt><dd>{triggerSummary(meta.triggers.find((t) => t.id === rule.triggerType), rule.triggerParams)}</dd>
        <dt>הופעל</dt><dd className="adm-mono">{fmtDateTime(rule.activatedAt)}</dd>
        <dt>נבדק לאחרונה</dt><dd className="adm-mono">{fmtDateTime(rule.lastEvaluatedAt)}</dd>
        <dt>נשלחו / נמסרו / נפתחו</dt><dd className="adm-mono">{stats.sent} / {stats.delivered} / {stats.opened}</dd>
        {stats.conversionLabel && <><dt>{stats.conversionLabel}</dt><dd className="adm-mono">{stats.converted}{stats.sent > 0 && ` (${Math.round(((stats.converted ?? 0) / stats.sent) * 100)}%)`}</dd></>}
        <dt>דולגו</dt><dd>{Object.keys(data.skipReasons).length === 0 ? "0" : Object.entries(data.skipReasons).map(([k, n]) => `${SKIP_HE[k] ?? k}: ${n}`).join(" · ")}</dd>
      </dl>
      {dry && (
        <div className="adm-card" style={{ marginTop: 10 }}>
          <strong>{dry.recipients}{dry.capped && "+"} משתמשים</strong> ב-{dry.businesses} עסקים · {dry.withDevice} עם מכשיר{dry.withConsent !== null && ` · ${dry.withConsent} עם הסכמה לשיווק`}
          {dry.note && <p className="adm-muted" style={{ fontSize: 13 }}>{dry.note}</p>}
          {dry.samples.map((s, i) => <p key={i} style={{ margin: "4px 0", fontSize: 13 }}><strong>{s.title}</strong> — {s.body}</p>)}
        </div>
      )}
      <h3 className="adm-h3" style={{ marginTop: 14 }}>שליחות אחרונות</h3>
      {data.recent.length === 0 ? <p className="adm-muted">עוד לא נשלח כלום.</p> : (
        <ul className="adm-plain">{data.recent.map((a) => (
          <li key={a.id}><span className="adm-mono adm-muted">{fmtDateTime(a.sentAt ?? a.scheduledFor)}</span> <strong>{a.title}</strong> — {a.body} {a.isTest && <span className="adm-pill">בדיקה</span>} <span className="adm-pill">{a.status === "SENT" ? `נמסרו ${a.delivery.delivered}` : a.status === "SCHEDULED" ? "ממתינה לחלון השליחה" : a.status}</span></li>
        ))}</ul>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ builder */

interface Form {
  name: string; description: string; purpose: "SERVICE" | "MARKETING"; category: string; triggerType: string; triggerParams: Record<string, number | string | boolean>;
  audience: Audience; timing: Timing; caps: { perUserDay?: number; perUserWeek?: number }; content: Content; image: { id: string; url: string } | null;
}

function emptyForm(meta: AutoMeta): Form {
  const t = meta.triggers.find((x) => x.id === "BEHAVIOR_NO_DOCUMENT") ?? meta.triggers[0];
  return {
    name: "", description: "", purpose: "SERVICE", category: t.defaultCategory, triggerType: t.id, triggerParams: defaults(t), audience: {},
    timing: { mode: "IMMEDIATE", windowFrom: "09:00", windowTo: "20:00", respectQuietHours: true }, caps: { perUserDay: 1 },
    content: { title: "", subtitle: null, body: "", route: "/home", imageId: null, inFeed: true, sound: true }, image: null,
  };
}
function defaults(t: Trigger): Record<string, number | string | boolean> {
  return Object.fromEntries(t.params.filter((p) => p.default !== undefined).map((p) => [p.key, p.default as number | string | boolean]));
}

function RuleBuilder({ meta, rule, onClose }: { meta: AutoMeta; rule: Rule | null; onClose: (changed: boolean) => void }) {
  const [f, setF] = useState<Form>(() => rule ? {
    name: rule.name, description: rule.description ?? "", purpose: rule.purpose, category: rule.category, triggerType: rule.triggerType,
    triggerParams: rule.triggerParams, audience: rule.audience, timing: rule.timing, caps: rule.caps, content: rule.content,
    image: rule.image?.url && rule.content.imageId ? { id: rule.content.imageId, url: rule.image.url } : null,
  } : emptyForm(meta));
  const [focus, setFocus] = useState<"title" | "body">("body");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const trigger = meta.triggers.find((t) => t.id === f.triggerType)!;
  const samples = Object.fromEntries(trigger.variables.map((v) => [v.key, v.sample]));
  const set = (patch: Partial<Form>) => setF((x) => ({ ...x, ...patch }));
  const setContent = (patch: Partial<Content>) => setF((x) => ({ ...x, content: { ...x.content, ...patch } }));
  const setAud = (patch: Partial<Audience>) => setF((x) => {
    const a: Audience = { ...x.audience, ...patch };
    for (const k of Object.keys(a) as (keyof Audience)[]) { const v = a[k]; if (v === undefined || v === "" || (Array.isArray(v) && v.length === 0)) delete a[k]; }
    return { ...x, audience: a };
  });

  const insertVar = (key: string) => {
    const ref = focus === "title" ? titleRef.current : bodyRef.current;
    const field = focus;
    const current = f.content[field];
    const at = ref?.selectionStart ?? current.length;
    setContent({ [field]: `${current.slice(0, at)}{${key}}${current.slice(at)}` } as Partial<Content>);
  };

  const pickTrigger = (id: string) => {
    const t = meta.triggers.find((x) => x.id === id)!;
    set({ triggerType: id, triggerParams: defaults(t), category: f.purpose === "MARKETING" ? "ANNOUNCEMENTS" : t.defaultCategory,
      timing: { ...f.timing, mode: t.group === "SCHEDULE" ? "IMMEDIATE" : f.timing.mode === "DELAY" && t.group !== "EVENT" ? "IMMEDIATE" : f.timing.mode } });
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
      const r = await api<{ image: { id: string; url: string } }>("/notifications/images", { body: { dataBase64 } });
      set({ image: r.image }); setContent({ imageId: r.image.id });
    } catch (e) { setError(errText(e)); }
  };

  const save = async () => {
    setBusy(true); setError("");
    try {
      const body = {
        name: f.name, description: f.description || null, purpose: f.purpose, category: f.category, triggerType: f.triggerType,
        triggerParams: f.triggerParams, audience: f.audience, timing: f.timing, caps: f.caps,
        content: { ...f.content, subtitle: f.content.subtitle?.trim() || null, threadId: null, collapseKey: null },
      };
      if (rule) await api(`/notifications/automations/${rule.id}`, { method: "PATCH", body });
      else await api("/notifications/automations", { body });
      onClose(true);
    } catch (e) { setError(errText(e)); setBusy(false); }
  };

  const groups = (["EVENT", "BEHAVIOR", "THRESHOLD", "SCHEDULE"] as const).map((g) => [g, meta.triggers.filter((t) => t.group === g)] as const);
  const csv = (v: string) => v.split(/[\s,]+/).map((x) => x.trim()).filter(Boolean);

  return (
    <div className="adm-notif">
      <section className="adm-card adm-notif-form">
        <div className="adm-row" style={{ justifyContent: "space-between" }}>
          <h2 className="adm-h2" style={{ margin: 0 }}>{rule ? `עריכת כלל · גרסה ${rule.version}` : "כלל אוטומטי חדש"}</h2>
          <button className="adm-link" onClick={() => onClose(false)}>חזרה לרשימה</button>
        </div>
        {rule?.status === "ACTIVE" && <p className="adm-muted" style={{ color: "var(--color-amber)" }}>הכלל פעיל: השינוי ייכנס לתוקף בהרצה הבאה (תוך דקה עד רבע שעה).</p>}
        <div className="adm-grid" style={{ marginTop: 12 }}>
          <label className="adm-field"><span>שם הכלל</span><input className="adm-input" value={f.name} onChange={(e) => set({ name: e.target.value })} placeholder="למשל: תזכורת לחשבונית פתוחה" /></label>
          <label className="adm-field"><span>תיאור (רשות)</span><input className="adm-input" value={f.description} onChange={(e) => set({ description: e.target.value })} /></label>
        </div>

        <hr className="adm-sep" />
        <h3 className="adm-h3">מתי זה קורה (טריגר)</h3>
        <select className="adm-select" value={f.triggerType} onChange={(e) => pickTrigger(e.target.value)} aria-label="טריגר">
          {groups.map(([g, list]) => <optgroup key={g} label={GROUP_HE[g]}>{list.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}</optgroup>)}
        </select>
        <p className="adm-muted" style={{ fontSize: 13 }}>{trigger.description}. נשלח ל{trigger.scope === "BUSINESS" ? "בעלים ולמנהלים של העסק" : "משתמש עצמו"}.</p>
        <div className="adm-grid">
          {trigger.params.map((p) => (
            <label key={p.key} className={p.type === "bool" ? "adm-check" : "adm-field"}>
              {p.type === "bool" ? (
                <><input type="checkbox" checked={f.triggerParams[p.key] === true} onChange={(e) => set({ triggerParams: { ...f.triggerParams, [p.key]: e.target.checked } })} />{p.label}</>
              ) : (
                <>
                  <span>{p.label}</span>
                  {p.type === "weekday" ? (
                    <select className="adm-select" value={Number(f.triggerParams[p.key] ?? 0)} onChange={(e) => set({ triggerParams: { ...f.triggerParams, [p.key]: Number(e.target.value) } })}>
                      {WEEKDAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
                    </select>
                  ) : p.type === "int" ? (
                    <input className="adm-input adm-mono" type="number" min={p.min} max={p.max} value={Number(f.triggerParams[p.key] ?? "")} onChange={(e) => set({ triggerParams: { ...f.triggerParams, [p.key]: Number(e.target.value) } })} />
                  ) : (
                    <input className="adm-input adm-mono" type={p.type === "time" ? "time" : "datetime-local"} value={String(f.triggerParams[p.key] ?? "")} onChange={(e) => set({ triggerParams: { ...f.triggerParams, [p.key]: e.target.value } })} />
                  )}
                </>
              )}
            </label>
          ))}
        </div>
        {trigger.group === "SCHEDULE" && <p className="adm-muted" style={{ fontSize: 13 }}>שעון ישראל, כולל מעבר לשעון קיץ/חורף. אם השרת היה למטה, התזמון נשלח עד {meta.scheduleCatchUpHours} שעות אחרי המועד.</p>}

        <hr className="adm-sep" />
        <h3 className="adm-h3">סוג ההודעה</h3>
        <div className="adm-row">
          <label className="adm-check"><input type="radio" checked={f.purpose === "SERVICE"} onChange={() => set({ purpose: "SERVICE", category: trigger.defaultCategory })} />שירות</label>
          <label className="adm-check"><input type="radio" checked={f.purpose === "MARKETING"} onChange={() => set({ purpose: "MARKETING", category: "ANNOUNCEMENTS", timing: { ...f.timing, respectQuietHours: true } })} />שיווק</label>
          {f.purpose === "SERVICE" && (
            <select className="adm-select" style={{ width: "auto" }} value={f.category} onChange={(e) => set({ category: e.target.value })} aria-label="קטגוריה">
              {meta.categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          )}
        </div>
        <p className="adm-muted" style={{ fontSize: 13 }}>
          {f.purpose === "SERVICE"
            ? "שירות: נשלח לפי הבחירה של המשתמש ב\"סוגי התראות\" לקטגוריה שנבחרה."
            : `שיווק (חוק התקשורת, סעיף 30א): נשלח רק למי שנתן הסכמה מפורשת באפליקציה ולא כיבה "הודעות מצוות תבל". אי אפשר לתת הסכמה בשם משתמש. נוסח ההסכמה: "${meta.marketingConsentText}"`}
        </p>

        <hr className="adm-sep" />
        <h3 className="adm-h3">למי (סינון — הכול רשות)</h3>
        <div className="adm-grid">
          <div className="adm-field"><span>מסלול</span>
            <div className="adm-row">{["START", "GROW", "UNLIMITED", "NONE"].map((p) => (
              <label key={p} className="adm-check"><input type="checkbox" checked={f.audience.plans?.includes(p) ?? false} onChange={(e) => setAud({ plans: e.target.checked ? [...(f.audience.plans ?? []), p] : (f.audience.plans ?? []).filter((x) => x !== p) })} />{PLAN_HE[p]}</label>
            ))}</div>
          </div>
          <div className="adm-field"><span>סוג עסק</span>
            <div className="adm-row">{Object.keys(BUSINESS_TYPE_HE).map((t) => (
              <label key={t} className="adm-check"><input type="checkbox" checked={f.audience.businessTypes?.includes(t) ?? false} onChange={(e) => setAud({ businessTypes: e.target.checked ? [...(f.audience.businessTypes ?? []), t] : (f.audience.businessTypes ?? []).filter((x) => x !== t) })} />{BUSINESS_TYPE_HE[t]}</label>
            ))}</div>
          </div>
          <label className="adm-check"><input type="checkbox" checked={f.audience.vatReportDue === true} onChange={(e) => setAud({ vatReportDue: e.target.checked || undefined })} />רק עסקים שחייבים בדיווח מע״מ החודש (חודשי, או דו-חודשי בחודשים האי-זוגיים)</label>
          <label className="adm-field"><span>פעיל ב-X הימים האחרונים</span><input className="adm-input adm-mono" type="number" min={1} max={365} value={f.audience.lastSeenWithinDays ?? ""} onChange={(e) => setAud({ lastSeenWithinDays: e.target.value ? Number(e.target.value) : undefined })} /></label>
          <label className="adm-field"><span>לא נכנס כבר X ימים</span><input className="adm-input adm-mono" type="number" min={1} max={365} value={f.audience.inactiveForDays ?? ""} onChange={(e) => setAud({ inactiveForDays: e.target.value ? Number(e.target.value) : undefined })} /></label>
          <label className="adm-field"><span>גרסת אפליקציה מינימלית</span><input className="adm-input adm-mono" dir="ltr" placeholder="1.0.16" value={f.audience.appVersionMin ?? ""} onChange={(e) => setAud({ appVersionMin: e.target.value || undefined })} /></label>
          <label className="adm-field"><span>גרסת אפליקציה מקסימלית</span><input className="adm-input adm-mono" dir="ltr" value={f.audience.appVersionMax ?? ""} onChange={(e) => setAud({ appVersionMax: e.target.value || undefined })} /></label>
          <label className="adm-field"><span>התראות בטלפון</span>
            <select className="adm-select" value={f.audience.pushEnabled === undefined ? "" : f.audience.pushEnabled ? "1" : "0"} onChange={(e) => setAud({ pushEnabled: e.target.value === "" ? undefined : e.target.value === "1" })}>
              <option value="">לא משנה</option><option value="1">רק עם התראות פעילות</option><option value="0">רק בלי (יראו ב&quot;עדכונים&quot;)</option>
            </select>
          </label>
          <label className="adm-field"><span>עסקים מסוימים (מזהים, מופרדים בפסיק)</span><input className="adm-input adm-mono" dir="ltr" value={(f.audience.businessIds ?? []).join(", ")} onChange={(e) => setAud({ businessIds: csv(e.target.value) })} /></label>
          <label className="adm-field"><span>משתמשים מסוימים (מזהים)</span><input className="adm-input adm-mono" dir="ltr" value={(f.audience.userIds ?? []).join(", ")} onChange={(e) => setAud({ userIds: csv(e.target.value) })} /></label>
        </div>

        <hr className="adm-sep" />
        <h3 className="adm-h3">תזמון</h3>
        {trigger.group === "SCHEDULE" ? <p className="adm-muted">נשלח במועד של התזמון.</p> : (
          <div className="adm-row">
            <label className="adm-check"><input type="radio" checked={f.timing.mode === "IMMEDIATE"} onChange={() => set({ timing: { ...f.timing, mode: "IMMEDIATE" } })} />מיד</label>
            {trigger.group === "EVENT" && <label className="adm-check"><input type="radio" checked={f.timing.mode === "DELAY"} onChange={() => set({ timing: { ...f.timing, mode: "DELAY", delayMinutes: f.timing.delayMinutes ?? 60 } })} />בהשהיה של</label>}
            {f.timing.mode === "DELAY" && <><input className="adm-input adm-mono" type="number" min={1} max={43200} style={{ width: 90 }} value={f.timing.delayMinutes ?? 60} onChange={(e) => set({ timing: { ...f.timing, delayMinutes: Number(e.target.value) } })} aria-label="דקות" /><span className="adm-muted">דקות</span></>}
            <label className="adm-check"><input type="radio" checked={f.timing.mode === "FIXED_TIME"} onChange={() => set({ timing: { ...f.timing, mode: "FIXED_TIME", atTime: f.timing.atTime ?? "10:00" } })} />בשעה קבועה</label>
            {f.timing.mode === "FIXED_TIME" && <input className="adm-input adm-mono" type="time" style={{ width: "auto" }} value={f.timing.atTime ?? "10:00"} onChange={(e) => set({ timing: { ...f.timing, atTime: e.target.value } })} aria-label="שעה" />}
          </div>
        )}
        <div className="adm-row" style={{ marginTop: 8 }}>
          {trigger.group !== "SCHEDULE" && <>
            <span className="adm-muted">חלון שליחה</span>
            <input className="adm-input adm-mono" type="time" style={{ width: "auto" }} value={f.timing.windowFrom} onChange={(e) => set({ timing: { ...f.timing, windowFrom: e.target.value } })} aria-label="מ-" />
            <span className="adm-muted">עד</span>
            <input className="adm-input adm-mono" type="time" style={{ width: "auto" }} value={f.timing.windowTo === "24:00" ? "23:59" : f.timing.windowTo} onChange={(e) => set({ timing: { ...f.timing, windowTo: e.target.value } })} aria-label="עד" />
          </>}
          <label className="adm-check"><input type="checkbox" checked={f.timing.respectQuietHours} disabled={f.purpose === "MARKETING"} onChange={(e) => set({ timing: { ...f.timing, respectQuietHours: e.target.checked } })} />לכבד שעות שקט (22:00–08:00, שבת וחג)</label>
        </div>
        <div className="adm-row" style={{ marginTop: 8 }}>
          <span className="adm-muted">תקרה לכלל הזה, למשתמש:</span>
          <input className="adm-input adm-mono" type="number" min={1} max={10} style={{ width: 70 }} value={f.caps.perUserDay ?? ""} onChange={(e) => set({ caps: { ...f.caps, perUserDay: e.target.value ? Number(e.target.value) : undefined } })} aria-label="ביום" /><span className="adm-muted">ביום</span>
          <input className="adm-input adm-mono" type="number" min={1} max={20} style={{ width: 70 }} value={f.caps.perUserWeek ?? ""} onChange={(e) => set({ caps: { ...f.caps, perUserWeek: e.target.value ? Number(e.target.value) : undefined } })} aria-label="בשבוע" /><span className="adm-muted">בשבוע</span>
        </div>

        <hr className="adm-sep" />
        <h3 className="adm-h3">תוכן</h3>
        <div className="adm-row" style={{ marginBottom: 8 }} aria-label="משתנים">
          {trigger.variables.map((v) => <button key={v.key} className="adm-tab" style={{ padding: "4px 10px", fontSize: 13 }} onClick={() => insertVar(v.key)} title={`לדוגמה: ${v.sample}`}>{v.label}</button>)}
        </div>
        <div className="adm-grid" style={{ gridTemplateColumns: "1fr" }}>
          <label className="adm-field"><span>כותרת (עד 60)</span><input ref={titleRef} className="adm-input" value={f.content.title} onFocus={() => setFocus("title")} onChange={(e) => setContent({ title: e.target.value })} /></label>
          <label className="adm-field"><span>תוכן (עד 180)</span><textarea ref={bodyRef} className="adm-textarea" rows={3} value={f.content.body} onFocus={() => setFocus("body")} onChange={(e) => setContent({ body: e.target.value })} /></label>
          <label className="adm-field"><span>מסך שייפתח</span>
            <select className="adm-select" value={f.content.route} onChange={(e) => setContent({ route: e.target.value })}>{meta.routes.map((r) => <option key={r.route} value={r.route}>{r.label}</option>)}</select>
          </label>
          <div className="adm-field"><span>תמונה (רשות, מגרסה 16 של האפליקציה; נשמרת 90 יום)</span>
            <div className="adm-row">
              <input type="file" accept="image/jpeg,image/png,image/gif" onChange={(e) => void upload(e.target.files?.[0])} aria-label="העלאת תמונה" />
              {f.image && <button className="adm-link" onClick={() => { set({ image: null }); setContent({ imageId: null }); }}>הסרה</button>}
            </div>
          </div>
          <div className="adm-row">
            <label className="adm-check"><input type="checkbox" checked={f.content.inFeed} onChange={(e) => setContent({ inFeed: e.target.checked })} />גם ב&quot;עדכונים&quot;</label>
            <label className="adm-check"><input type="checkbox" checked={f.content.sound} onChange={(e) => setContent({ sound: e.target.checked })} />עם צליל</label>
          </div>
        </div>
        {trigger.variables.some((v) => v.key === "amount") && /\{amount\}/.test(f.content.body + f.content.title) && <p className="adm-muted" style={{ color: "var(--color-amber)", fontSize: 13 }}>סכום יופיע גם על מסך נעול.</p>}
        {error && <p className="adm-error" role="alert">{error}</p>}
        <div className="adm-row" style={{ marginTop: 12 }}>
          <button className="adm-btn" disabled={busy || f.name.trim().length < 2 || f.content.title.trim().length < 2 || f.content.body.trim().length < 2} onClick={() => void save()}>{busy ? "שומר…" : rule ? "שמירת שינויים" : "שמירה כטיוטה"}</button>
          <button className="adm-btn-ghost" onClick={() => onClose(false)}>ביטול</button>
        </div>
        <p className="adm-muted" style={{ fontSize: 13 }}>אחרי השמירה: &quot;בדיקה אליי&quot; (עם נתוני דוגמה), ואז &quot;הפעלה&quot; — עם ספירה של מי היה מקבל עכשיו.</p>
      </section>
      <aside className="adm-notif-side">
        <div className="adm-phone" aria-label="תצוגה מקדימה עם נתוני דוגמה">
          <div className="adm-phone-screen">
            <div className="adm-phone-time adm-mono">09:00</div>
            <div className="adm-phone-banner">
              <div className="adm-phone-head"><span className="adm-phone-icon" aria-hidden="true">ת</span><span>תבל חשבוניות</span><span className="adm-phone-now">עכשיו</span></div>
              <div className="adm-phone-body">
                <div style={{ minWidth: 0, flex: 1 }}>
                  <strong>{fill(f.content.title, samples) || "כותרת"}</strong>
                  <p>{fill(f.content.body, samples) || "תוכן…"}</p>
                </div>
                {f.image && <img className="adm-phone-thumb" src={f.image.url} alt="" />}
              </div>
            </div>
            <div className="adm-phone-meta">{f.content.sound ? "🔔 צליל" : "🔕 שקט"} · {f.purpose === "MARKETING" ? "שיווק" : "שירות"}</div>
          </div>
          {f.content.inFeed && (
            <div className="adm-phone-feed">
              <p className="adm-eyebrow" style={{ margin: "0 0 6px" }}>ב&quot;עדכונים&quot; באפליקציה</p>
              <div className="adm-phone-feed-row"><span className="adm-phone-bell" aria-hidden="true">🔔</span>
                <div style={{ minWidth: 0 }}><div className="adm-phone-feed-title">{fill(f.content.title, samples)} · {fill(f.content.body, samples)}</div></div>
              </div>
            </div>
          )}
          <p className="adm-muted" style={{ fontSize: 12 }}>נתוני דוגמה: {trigger.variables.map((v) => `${v.label} = ${v.sample}`).join(" · ")}</p>
        </div>
      </aside>
    </div>
  );
}
