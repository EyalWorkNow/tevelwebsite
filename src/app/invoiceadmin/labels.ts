export const BUSINESS_TYPE_HE: Record<string, string> = {
  OSEK_PATUR: "עוסק פטור",
  OSEK_MURSHE: "עוסק מורשה",
  COMPANY: 'חברה בע"מ',
  PARTNERSHIP: "שותפות",
  NONPROFIT: 'עמותה / מלכ"ר',
};
export const PLAN_HE: Record<string, string> = { START: "מתחילים", GROW: "צומחים", UNLIMITED: "בלי גבולות", NONE: "ללא מסלול" };
export const USER_STATUS_HE: Record<string, string> = { ACTIVE: "פעיל", DISABLED: "מושהה", INVITED: "הוזמן" };
export const BUSINESS_STATUS_HE: Record<string, string> = { ACTIVE: "פעיל", SUSPENDED: "מושהה", CLOSED: "נסגר" };
export const ROLE_HE: Record<string, string> = { OWNER: "בעלים", ADMIN: "מנהל", ACCOUNTANT: "רו״ח", EMPLOYEE: "עובד", READ_ONLY: "צפייה", CASHIER: "קופאי" };
export const PROVIDER_HE: Record<string, string> = { COMP: "הוענק ידנית", CARDCOM: "Cardcom", APPLE: "App Store" };
export const SUB_STATUS_HE: Record<string, string> = { ACTIVE: "פעיל", CANCELLED: "בוטל", PENDING: "ממתין", PAST_DUE: "בפיגור" };
export const ACTION_HE: Record<string, string> = {
  "admin.sign_in_code_sent": "נשלח קוד כניסה",
  "admin.sign_in": "כניסה לניהול",
  "admin.sign_in_failed": "קוד שגוי",
  "admin.sign_out": "יציאה מהניהול",
  "user.created": "משתמש נוצר",
  "user.updated": "פרטי משתמש עודכנו",
  "user.suspended": "משתמש הושהה",
  "user.reactivated": "משתמש הופעל",
  "user.sessions_revoked": "חיבורים נותקו",
  "user.password_reset": "איפוס סיסמה",
  "business.created": "עסק נוצר",
  "business.profile_updated": "פרטי עסק עודכנו",
  "business.suspended": "עסק הושהה",
  "business.reactivated": "עסק הופעל",
  "subscription.plan_set": "מסלול עודכן",
  "subscription.cancelled": "מנוי בוטל",
  "announcement.sent": "התראה נשלחה",
  "announcement.scheduled": "התראה תוזמנה",
  "announcement.dispatched": "התראה יצאה למכשירים",
  "announcement.test_sent": "התראת בדיקה",
  "announcement.cancelled": "התראה מתוזמנת בוטלה",
  "announcement.image_uploaded": "תמונה להתראה הועלתה",
  "announcement.template_created": "תבנית התראה נוצרה",
  "announcement.template_updated": "תבנית התראה עודכנה",
  "announcement.template_archived": "תבנית התראה הועברה לארכיון",
};

export const fmtDate = (iso: unknown): string => {
  if (typeof iso !== "string" || iso === "") return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  if (d.getUTCFullYear() >= 2100) return "ללא הגבלה";
  return d.toLocaleDateString("he-IL", { timeZone: "Asia/Jerusalem", day: "2-digit", month: "2-digit", year: "numeric" });
};
export const fmtDateTime = (iso: unknown): string => {
  if (typeof iso !== "string" || iso === "") return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("he-IL", { timeZone: "Asia/Jerusalem", day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
};
