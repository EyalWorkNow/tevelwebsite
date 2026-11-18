"use client";
import { useEffect, useState } from "react";
import { api, ApiError } from "./api";
import { ACTION_HE, fmtDateTime } from "./labels";

export interface AuditRow {
  id: string; occurredAt: string; adminEmail: string; action: string; targetType: string; targetId: string | null;
  userId: string | null; businessId: string | null; before: unknown; after: unknown; outcome: string; ip: string | null;
}

export function AuditTable({ rows }: { rows: AuditRow[] }) {
  if (rows.length === 0) return <p className="adm-muted">אין פעולות.</p>;
  return (
    <div className="adm-table-wrap">
      <table className="adm-table">
        <thead><tr><th>זמן</th><th>פעולה</th><th>מנהל</th><th>יעד</th><th>לפני / אחרי</th><th>IP</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ cursor: "default" }}>
              <td className="adm-mono" style={{ whiteSpace: "nowrap" }}>{fmtDateTime(r.occurredAt)}</td>
              <td>{ACTION_HE[r.action] ?? r.action}{r.outcome !== "OK" && <> <span className="adm-pill adm-pill-bad">נדחה</span></>}</td>
              <td className="adm-mono" style={{ fontSize: 12 }}>{r.adminEmail}</td>
              <td className="adm-mono" style={{ fontSize: 12 }}>{r.targetType}{r.targetId ? `: ${r.targetId.slice(0, 8)}` : ""}</td>
              <td>
                {(r.before !== null || r.after !== null) ? (
                  <details><summary className="adm-muted" style={{ cursor: "pointer" }}>פרטים</summary>
                    {r.before !== null && <pre className="adm-json">{"לפני: " + JSON.stringify(r.before, null, 1)}</pre>}
                    {r.after !== null && <pre className="adm-json">{"אחרי: " + JSON.stringify(r.after, null, 1)}</pre>}
                  </details>
                ) : <span className="adm-muted">—</span>}
              </td>
              <td className="adm-mono" style={{ fontSize: 12 }}>{r.ip ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AuditLog() {
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState<{ total: number; rows: AuditRow[] } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let live = true;
    api<{ total: number; rows: AuditRow[] }>(`/audit?limit=50&offset=${offset}`)
      .then((d) => { if (live) setData(d); })
      .catch((e) => { if (live) setError(e instanceof ApiError ? e.message : "שגיאה"); });
    return () => { live = false; };
  }, [offset]);
  return (
    <section>
      <p className="adm-sub">יומן לקריאה בלבד: אי אפשר לערוך או למחוק בו שורות, גם לא ממסד הנתונים.</p>
      {error && <p className="adm-error" role="alert">{error}</p>}
      {data === null ? <p className="adm-muted">טוען…</p> : (
        <>
          <AuditTable rows={data.rows} />
          <div className="adm-pager">
            <span className="adm-muted">{data.total} פעולות</span>
            <div className="adm-row">
              <button className="adm-btn-ghost" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - 50))}>חדשות יותר</button>
              <button className="adm-btn-ghost" disabled={offset + 50 >= data.total} onClick={() => setOffset(offset + 50)}>ישנות יותר</button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
