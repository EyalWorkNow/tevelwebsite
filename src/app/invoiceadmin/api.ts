// Browser → invoice API (/platform-admin/*), credentials included: the admin session is an HttpOnly
// cookie set by the API host itself (Path=/platform-admin), so no secret ever lives on Vercel or in JS.
// tevel.space and invoice.crm.tevel.space are the same site, so the SameSite=Strict cookie is sent.
export const API_ORIGIN = (process.env.NEXT_PUBLIC_INVOICE_API_ORIGIN || "https://invoice.crm.tevel.space").replace(/\/$/, "");

let csrfToken = "";
export const setCsrf = (token: string) => { csrfToken = token; };

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}

export async function api<T = Record<string, unknown>>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const method = init.method ?? (init.body === undefined ? "GET" : "POST");
  const headers: Record<string, string> = {};
  if (method !== "GET") { headers["Content-Type"] = "application/json"; headers["X-CSRF-Token"] = csrfToken; }
  let response: Response;
  try {
    response = await fetch(`${API_ORIGIN}/platform-admin${path}`, {
      method, headers, credentials: "include", cache: "no-store",
      body: method === "GET" ? undefined : JSON.stringify(init.body ?? {}),
    });
  } catch {
    throw new ApiError(0, "NETWORK", "אין חיבור לשרת החשבוניות");
  }
  const json = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    const code = typeof json.error === "string" ? json.error : "ERROR";
    if (code === "UNAUTHENTICATED" && !path.startsWith("/auth/") && typeof window !== "undefined") {
      window.dispatchEvent(new Event("adm-expired"));
    }
    throw new ApiError(response.status, code, errorText(code, typeof json.message === "string" ? json.message : ""));
  }
  return json as T;
}

const ERRORS: Record<string, string> = {
  UNAUTHENTICATED: "פג תוקף הכניסה. צריך להתחבר מחדש.",
  CODE_INVALID: "הקוד שגוי. אפשר לנסות שוב.",
  CODE_LOCKED: "יותר מדי ניסיונות. צריך לבקש קוד חדש.",
  NO_PENDING_SIGN_IN: "הקוד פג או לא נשלח. צריך לבקש קוד חדש.",
  ORIGIN_FORBIDDEN: "הדף הזה לא מורשה לגשת לשרת.",
  RATE_LIMITED: "יותר מדי בקשות. כדאי לחכות דקה.",
  CSRF_INVALID: "פג תוקף הטופס. כדאי לרענן את הדף.",
  USER_EXISTS: "כבר קיים משתמש עם המייל הזה.",
  PASSWORD_POLICY: "הסיסמה חלשה מדי (לפחות 12 תווים).",
  PAID_PLAN_ACTIVE: "לעסק יש מנוי בתשלום פעיל. צריך לאשר החלפה במפורש.",
  NO_ACTIVE_SUBSCRIPTION: "אין לעסק מנוי פעיל לביטול.",
  BUSINESS_CLOSED: "העסק נסגר (החשבון נמחק) ולא ניתן לשנות אותו כאן.",
  USER_NOT_ACTIVE: "המשתמש מושהה. צריך להפעיל אותו קודם.",
  SUPABASE_ADMIN_NOT_CONFIGURED: "בשרת חסר SUPABASE_SERVICE_ROLE_KEY, ולכן אי אפשר ליצור משתמשים או לקבוע סיסמה.",
  SUPABASE_SUBJECT_UNKNOWN: "המשתמש עוד לא התחבר דרך Supabase. אפשר לשלוח לו קישור איפוס.",
  SUPABASE_USER_EXISTS: "המייל כבר רשום ב-Supabase.",
  NOT_FOUND: "לא נמצא.",
  NETWORK: "אין חיבור לשרת החשבוניות.",
};

function errorText(code: string, message: string): string {
  if (ERRORS[code]) return ERRORS[code];
  if (code === "VALIDATION" || code === "CONSTRAINT_VIOLATION") return `ערך לא תקין: ${message.replace(/^VALIDATION:\s*/, "")}`;
  return message || "שגיאה";
}
