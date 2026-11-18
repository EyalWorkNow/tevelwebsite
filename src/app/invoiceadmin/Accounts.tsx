"use client";
import { useEffect, useState } from "react";
import { api, ApiError } from "./api";
import type { Meta } from "./AdminApp";
import type { AudiencePick } from "./Notifications";
import { BUSINESS_STATUS_HE, BUSINESS_TYPE_HE, PLAN_HE, USER_STATUS_HE, fmtDate, fmtDateTime } from "./labels";

export interface AccountBusiness {
  businessId: string; legalName: string; tradingName: string | null; taxId: string | null; businessType: string;
  phone: string | null; email: string | null; status: string; role: string; plan: string | null;
  planCode: string | null; subscriptionStatus: string | null; periodEnd: string | null; billingProvider: string | null; documentCount: number;
}
export interface AccountRow {
  userId: string; email: string; displayName: string | null; status: string; isDemo: boolean;
  createdAt: string; lastActiveAt: string | null; businesses: AccountBusiness[];
}

const PAGE = 25;

export function StatusPill({ status, kind }: { status: string; kind: "user" | "business" }) {
  const label = (kind === "user" ? USER_STATUS_HE : BUSINESS_STATUS_HE)[status] ?? status;
  const cls = status === "ACTIVE" ? "adm-pill adm-pill-ok" : status === "INVITED" ? "adm-pill adm-pill-warn" : "adm-pill adm-pill-bad";
  return <span className={cls}>{label}</span>;
}
export function PlanPill({ plan }: { plan: string | null }) {
  return <span className={plan ? "adm-pill adm-pill-ok" : "adm-pill"}>{PLAN_HE[plan ?? "NONE"] ?? plan}</span>;
}

const notifyPick = (row: AccountRow): AudiencePick => ({ type: "USER", value: row.userId, label: `${row.displayName ?? row.email} (${row.email})` });

export default function Accounts({ meta, onOpen, refresh, onNotify }: { meta: Meta; onOpen: (userId: string) => void; refresh: number; onNotify: (a: AudiencePick) => void }) {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [plan, setPlan] = useState("");
  const [status, setStatus] = useState("");
  const [businessStatus, setBusinessStatus] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState<{ total: number; rows: AccountRow[] } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => { const t = setTimeout(() => { setDebounced(q.trim()); setOffset(0); }, 300); return () => clearTimeout(t); }, [q]);

  useEffect(() => {
    const params = new URLSearchParams({ limit: String(PAGE), offset: String(offset) });
    if (debounced) params.set("q", debounced);
    if (plan) params.set("plan", plan);
    if (status) params.set("status", status);
    if (businessStatus) params.set("businessStatus", businessStatus);
    if (businessType) params.set("businessType", businessType);
    let live = true;
    api<{ total: number; rows: AccountRow[] }>(`/accounts?${params}`)
      .then((d) => { if (live) { setData(d); setError(""); } })
      .catch((e) => { if (live) setError(e instanceof ApiError ? e.message : "שגיאה"); });
    return () => { live = false; };
  }, [debounced, plan, status, businessStatus, businessType, offset, refresh]);

  const filter = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => { setter(e.target.value); setOffset(0); };

  return (
    <section>
      <div className="adm-filters">
        <label className="adm-field"><span>חיפוש</span>
          <input className="adm-input" type="search" placeholder="שם, מייל, עסק, ח.פ / ע.מ, טלפון" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <label className="adm-field"><span>מסלול</span>
          <select className="adm-select" value={plan} onChange={filter(setPlan)}>
            <option value="">הכול</option>
            {[...meta.plans.map((p) => p.code), "NONE"].map((p) => <option key={p} value={p}>{PLAN_HE[p] ?? p}</option>)}
          </select>
        </label>
        <label className="adm-field"><span>סטטוס משתמש</span>
          <select className="adm-select" value={status} onChange={filter(setStatus)}>
            <option value="">הכול</option>
            {Object.entries(USER_STATUS_HE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="adm-field"><span>סטטוס עסק</span>
          <select className="adm-select" value={businessStatus} onChange={filter(setBusinessStatus)}>
            <option value="">הכול</option>
            {Object.entries(BUSINESS_STATUS_HE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="adm-field"><span>סוג עסק</span>
          <select className="adm-select" value={businessType} onChange={filter(setBusinessType)}>
            <option value="">הכול</option>
            {meta.businessTypes.map((t) => <option key={t} value={t}>{BUSINESS_TYPE_HE[t] ?? t}</option>)}
          </select>
        </label>
      </div>
      {error && <p className="adm-error" role="alert">{error}</p>}
      {data === null ? <p className="adm-muted">טוען…</p> : data.rows.length === 0 ? <p className="adm-muted">לא נמצאו חשבונות.</p> : (
        <>
          <div className="adm-table-wrap adm-hide-sm">
            <table className="adm-table">
              <thead><tr><th>משתמש</th><th>עסק</th><th>ח.פ / ע.מ</th><th>סוג</th><th>מסלול</th><th>סטטוס</th><th>מסמכים</th><th>נוצר</th><th>פעילות אחרונה</th><th /></tr></thead>
              <tbody>
                {data.rows.map((row) => {
                  const b = row.businesses;
                  return (
                    <tr key={row.userId} onClick={() => onOpen(row.userId)} tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") onOpen(row.userId); }}>
                      <td><div>{row.displayName ?? "—"}</div><div className="adm-muted adm-mono" style={{ fontSize: 12 }}>{row.email}</div></td>
                      <td>{b.length === 0 ? <span className="adm-muted">אין עסק</span> : b.map((x) => <div key={x.businessId}>{x.tradingName ?? x.legalName}</div>)}</td>
                      <td>{b.map((x) => <div key={x.businessId} className="adm-mono">{x.taxId ?? "—"}</div>)}</td>
                      <td>{b.map((x) => <div key={x.businessId}>{BUSINESS_TYPE_HE[x.businessType] ?? x.businessType}</div>)}</td>
                      <td>{b.map((x) => <div key={x.businessId}><PlanPill plan={x.plan} /></div>)}</td>
                      <td><StatusPill status={row.status} kind="user" />{b.filter((x) => x.status !== "ACTIVE").map((x) => <div key={x.businessId} style={{ marginTop: 4 }}><StatusPill status={x.status} kind="business" /></div>)}</td>
                      <td className="adm-mono">{b.reduce((n, x) => n + x.documentCount, 0)}</td>
                      <td className="adm-mono">{fmtDate(row.createdAt)}</td>
                      <td className="adm-mono">{fmtDateTime(row.lastActiveAt)}</td>
                      <td><button className="adm-btn-ghost adm-acc-notify" disabled={row.status !== "ACTIVE"} title={row.status !== "ACTIVE" ? "המשתמש מושהה" : "שליחת התראה למשתמש הזה"}
                        onClick={(e) => { e.stopPropagation(); onNotify(notifyPick(row)); }} onKeyDown={(e) => e.stopPropagation()} data-testid="row-notify">שלח התראה</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="adm-cards">
            {data.rows.map((row) => (
              <div key={row.userId} className="adm-acc-wrap">
                <button className="adm-acc-card" onClick={() => onOpen(row.userId)}>
                  <div className="adm-row" style={{ justifyContent: "space-between" }}><strong>{row.displayName ?? row.email}</strong><StatusPill status={row.status} kind="user" /></div>
                  <div className="adm-muted adm-mono" style={{ fontSize: 12 }}>{row.email}</div>
                  {row.businesses.map((x) => <div key={x.businessId} className="adm-row" style={{ marginTop: 6 }}>{x.tradingName ?? x.legalName} <PlanPill plan={x.plan} /></div>)}
                </button>
                <button className="adm-btn-ghost adm-acc-notify" disabled={row.status !== "ACTIVE"} onClick={() => onNotify(notifyPick(row))}>שלח התראה</button>
              </div>
            ))}
          </div>
          <div className="adm-pager">
            <span className="adm-muted">{offset + 1}–{offset + data.rows.length} מתוך {data.total}</span>
            <div className="adm-row">
              <button className="adm-btn-ghost" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE))}>הקודם</button>
              <button className="adm-btn-ghost" disabled={offset + PAGE >= data.total} onClick={() => setOffset(offset + PAGE)}>הבא</button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
