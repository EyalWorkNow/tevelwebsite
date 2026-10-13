import type { FieldValue, RelayField, Signature } from "./types";

// The customer's values, cleaned and checked with the same rules as the CRM (crm-fusion src/domain/documents/fields.ts),
// so a signature accepted here is accepted when the CRM applies it.

const MAX_TEXT = 2000;
const MAX_DATA_URL = 600_000;
const MAX_PATHS = 400;
const PATH_RE = /^[MLQCZmlqcz0-9.,\s-]{1,20000}$/;
const DATA_URL_RE = /^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/;
const DATE_RE = /^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/;

export const isSignature = (value: unknown): value is Signature =>
  Boolean(value) && typeof value === "object" && ["DRAWN", "TYPED", "IMAGE"].includes(String((value as { kind?: unknown }).kind));

export const normalizeDate = (text: string): string | null => {
  const trimmed = text.trim();
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  const parts = iso ? [iso[3], iso[2], iso[1]] : DATE_RE.exec(trimmed)?.slice(1, 4);
  if (!parts) return null;
  const day = Number(parts[0]), month = Number(parts[1]);
  let year = Number(parts[2]);
  if (year < 100) year += 2000;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year}`;
};

export const isValidIsraeliId = (raw: string): boolean => {
  const digits = raw.replace(/[\s-]/g, "");
  if (!/^\d{5,9}$/.test(digits)) return false;
  const padded = digits.padStart(9, "0");
  if (/^0+$/.test(padded)) return false;
  let sum = 0;
  for (let index = 0; index < 9; index += 1) {
    const step = Number(padded[index]) * ((index % 2) + 1);
    sum += step > 9 ? step - 9 : step;
  }
  return sum % 10 === 0;
};

export const hasValue = (value: FieldValue | undefined): boolean => {
  if (value === null || value === undefined || value === false) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
};

export const sanitizeValue = (type: RelayField["type"], raw: unknown): FieldValue | undefined => {
  if (raw === null) return null;
  if (type === "CHECKBOX") return raw === true || raw === "true";
  if (type === "SIGNATURE" || type === "INITIALS" || type === "STAMP" || type === "IMAGE") {
    if (!raw || typeof raw !== "object") return undefined;
    const value = raw as Record<string, unknown>;
    if (value.kind === "TYPED" && typeof value.text === "string" && (type === "SIGNATURE" || type === "INITIALS")) return value.text.trim() ? { kind: "TYPED", text: value.text.trim().slice(0, 80) } : null;
    if (value.kind === "DRAWN" && Array.isArray(value.paths) && (type === "SIGNATURE" || type === "INITIALS")) {
      const paths = value.paths.filter((path): path is string => typeof path === "string" && PATH_RE.test(path)).slice(0, MAX_PATHS);
      const width = Number(value.width) > 0 ? Math.min(Number(value.width), 2000) : 500;
      const height = Number(value.height) > 0 ? Math.min(Number(value.height), 1000) : 160;
      return paths.length ? { kind: "DRAWN", paths, width, height } : null;
    }
    if (value.kind === "IMAGE" && typeof value.dataUrl === "string" && DATA_URL_RE.test(value.dataUrl) && value.dataUrl.length <= MAX_DATA_URL) return { kind: "IMAGE", dataUrl: value.dataUrl };
    return undefined;
  }
  if (typeof raw === "number") return String(raw);
  if (typeof raw !== "string") return undefined;
  return raw.slice(0, MAX_TEXT);
};

export const sanitizeValues = (fields: RelayField[], incoming: unknown): Record<string, FieldValue> => {
  const source = incoming && typeof incoming === "object" ? (incoming as Record<string, unknown>) : {};
  const out: Record<string, FieldValue> = {};
  for (const field of fields) {
    if (!(field.key in source)) continue;
    const value = sanitizeValue(field.type, source[field.key]);
    if (value !== undefined) out[field.key] = value;
  }
  return out;
};

export type FieldIssue = { key: string; label: string; message: string };

export const validateValues = (fields: RelayField[], values: Record<string, FieldValue>): FieldIssue[] => {
  const issues: FieldIssue[] = [];
  for (const field of fields) {
    const value = values[field.key];
    if (!hasValue(value)) {
      if (field.required) issues.push({ key: field.key, label: field.label, message: field.type === "CHECKBOX" ? "צריך לסמן" : field.type === "SIGNATURE" || field.type === "INITIALS" ? "חסרה חתימה" : "שדה חובה" });
      continue;
    }
    if (field.type === "DATE" && typeof value === "string" && !normalizeDate(value)) issues.push({ key: field.key, label: field.label, message: "תאריך לא תקין (למשל 05.03.2026)" });
    if (field.type === "ID_NUMBER" && typeof value === "string" && !isValidIsraeliId(value)) issues.push({ key: field.key, label: field.label, message: "מספר זהות לא תקין" });
    if (field.type === "NUMBER" && typeof value === "string" && !/^-?[\d,.\s₪%]+$/.test(value.trim())) issues.push({ key: field.key, label: field.label, message: "צריך מספר" });
    if (field.type === "CHOICE" && typeof value === "string" && field.options.length && !field.options.includes(value)) issues.push({ key: field.key, label: field.label, message: "בחירה לא מהרשימה" });
  }
  return issues;
};

export const isPreviewBot = (userAgent: string | null | undefined): boolean =>
  /bot|crawler|spider|facebookexternalhit|WhatsApp|Slackbot|TelegramBot|Discordbot|Googlebot|GoogleImageProxy|LinkedInBot|Twitterbot|preview|curl|wget|python-requests|HeadlessChrome/i.test(String(userAgent ?? ""));
