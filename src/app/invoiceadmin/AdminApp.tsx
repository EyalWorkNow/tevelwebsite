"use client";
import { useCallback, useEffect, useState } from "react";
import { TevelLogo } from "@/components/icons";
import { api, ApiError, setCsrf } from "./api";
import Accounts from "./Accounts";
import CreateUser from "./CreateUser";
import AuditLog from "./AuditLog";
import AccountDrawer from "./AccountDrawer";
import Notifications, { type AudiencePick } from "./Notifications";
import Automations from "./Automations";
import SystemPushes from "./SystemPushes";

export interface Meta {
  adminEmail: string;
  plans: { code: string; name: string; monthlyMinor: number; invoiceLimit: number | null }[];
  businessTypes: string[];
  authMode: "local" | "supabase";
  supabaseAdminConfigured: boolean;
}
interface SessionBody { email: string; csrfToken: string }

type Tab = "accounts" | "create" | "notifications" | "audit";

export default function AdminApp() {
  const [state, setState] = useState<"loading" | "out" | "in">("loading");
  const [meta, setMeta] = useState<Meta | null>(null);
  const [tab, setTab] = useState<Tab>("accounts");
  const [openUser, setOpenUser] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [preset, setPreset] = useState<AudiencePick | null>(null);
  const [notifTab, setNotifTab] = useState<"send" | "auto" | "system">("send");

  const enter = useCallback(async (session: SessionBody) => {
    setCsrf(session.csrfToken);
    setMeta(await api<Meta>("/meta"));
    setState("in");
  }, []);

  useEffect(() => {
    api<SessionBody>("/auth/session").then(enter).catch(() => setState("out"));
  }, [enter]);

  // Any 401 later (idle 30 min / 8 h cap) drops back to the sign-in screen.
  useEffect(() => {
    const onExpired = () => { setState("out"); setOpenUser(null); };
    window.addEventListener("adm-expired", onExpired);
    return () => window.removeEventListener("adm-expired", onExpired);
  }, []);

  const logout = async () => {
    await api("/auth/logout", { body: {} }).catch(() => undefined);
    setState("out");
    setMeta(null);
  };

  if (state === "loading") return <div className="adm-wrap"><p className="adm-muted" style={{ paddingTop: 80, textAlign: "center" }}>טוען…</p></div>;
  if (state === "out" || meta === null) return <SignIn onIn={enter} />;

  return (
    <div className="adm-wrap">
      <header className="adm-top">
        <div className="adm-brand"><TevelLogo className="h-7 w-auto" /><span>ניהול חשבוניות</span></div>
        <div className="adm-who"><span className="adm-mono">{meta.adminEmail}</span><button className="adm-btn-ghost" onClick={logout}>יציאה</button></div>
      </header>
      <p className="adm-eyebrow">תבל חשבוניות</p>
      <h1 className="adm-h1">משתמשים ועסקים</h1>
      <p className="adm-sub">כל פעולה כאן נרשמת ביומן הפעולות. נתוני הנהלת חשבונות לעולם לא נמחקים: השהיה חוסמת כניסה ושימוש, וניתן לבטל אותה.</p>
      {meta.authMode === "supabase" && !meta.supabaseAdminConfigured && (
        <div className="adm-card" role="status" style={{ borderColor: "var(--color-amber)" }}>
          <strong>חסר מפתח Supabase בשרת.</strong> הכניסה לאפליקציה עוברת דרך Supabase, ולכן יצירת משתמשים וקביעת סיסמה דורשות את SUPABASE_SERVICE_ROLE_KEY בשרת החשבוניות. שאר הפעולות עובדות.
        </div>
      )}
      <div className="adm-tabs" role="tablist">
        {([["accounts", "חשבונות"], ["create", "משתמש חדש"], ["notifications", "התראות"], ["audit", "יומן פעולות"]] as [Tab, string][]).map(([key, label]) => (
          <button key={key} role="tab" className="adm-tab" aria-selected={tab === key} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>
      {tab === "accounts" && <Accounts meta={meta} onOpen={setOpenUser} refresh={refresh} />}
      {tab === "create" && <CreateUser meta={meta} onCreated={(id) => { setRefresh((n) => n + 1); setTab("accounts"); setOpenUser(id); }} />}
      {tab === "notifications" && (
        <>
          <div className="adm-tabs adm-subtabs" role="tablist" aria-label="התראות">
            {([["send", "שליחה ידנית"], ["auto", "אוטומציות"], ["system", "התראות מערכת"]] as const).map(([key, label]) => (
              <button key={key} role="tab" className="adm-tab" aria-selected={notifTab === key} onClick={() => setNotifTab(key)}>{label}</button>
            ))}
          </div>
          {notifTab === "send" && <Notifications key={preset?.value ?? "new"} preset={preset} />}
          {notifTab === "auto" && <Automations />}
          {notifTab === "system" && <SystemPushes />}
        </>
      )}
      {tab === "audit" && <AuditLog />}
      {openUser !== null && <AccountDrawer meta={meta} userId={openUser} onClose={() => { setOpenUser(null); setRefresh((n) => n + 1); }}
        onNotify={(a) => { setPreset(a); setOpenUser(null); setTab("notifications"); setNotifTab("send"); }} />}
    </div>
  );
}

function SignIn({ onIn }: { onIn: (s: SessionBody) => Promise<void> }) {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError("");
    try { await api("/auth/start", { body: { email: email.trim() } }); setStep("code"); setCode(""); }
    catch (err) { setError(err instanceof ApiError ? err.message : "שגיאה"); }
    finally { setBusy(false); }
  };
  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError("");
    try { await onIn(await api<SessionBody>("/auth/verify", { body: { code: code.trim() } })); }
    catch (err) { setError(err instanceof ApiError ? err.message : "שגיאה"); }
    finally { setBusy(false); }
  };

  return (
    <div className="adm-wrap">
      <div className="adm-signin">
        <div className="adm-brand" style={{ marginBottom: 24 }}><TevelLogo className="h-8 w-auto" /></div>
        <section className="adm-card">
          <p className="adm-eyebrow">ניהול תבל חשבוניות</p>
          {step === "email" ? (
            <form onSubmit={send}>
              <h1 className="adm-h2">כניסה</h1>
              <p className="adm-sub">נשלח קוד חד-פעמי למייל. רק כתובות מורשות יקבלו קוד.</p>
              <label className="adm-field"><span>מייל</span>
                <input className="adm-input" dir="ltr" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              {error && <p className="adm-error" role="alert">{error}</p>}
              <div className="adm-row" style={{ marginTop: 14 }}><button className="adm-btn" disabled={busy || !email.includes("@")}>שליחת קוד</button></div>
            </form>
          ) : (
            <form onSubmit={verify}>
              <h1 className="adm-h2">קוד אימות</h1>
              <p className="adm-sub">אם הכתובת <span className="adm-mono">{email}</span> מורשית, נשלח אליה קוד בן 6 ספרות (תקף ל-10 דקות).</p>
              <label className="adm-field"><span>קוד</span>
                <input className="adm-input adm-mono" dir="ltr" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} autoFocus />
              </label>
              {error && <p className="adm-error" role="alert">{error}</p>}
              <div className="adm-row" style={{ marginTop: 14 }}>
                <button className="adm-btn" disabled={busy || code.length !== 6}>כניסה</button>
                <button type="button" className="adm-link" onClick={() => { setStep("email"); setError(""); }}>מייל אחר / קוד חדש</button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
