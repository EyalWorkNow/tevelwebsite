// First-party attribution + Meta Pixel helpers (client only).
// Attribution stays in this tab's sessionStorage and is sent only together with a form the visitor submits.

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "3352872851581186";
export const CONSENT_KEY = "tevel-consent-v1";
const ATTRIBUTION_KEY = "tevel-attribution-v1";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"] as const;

type Fbq = ((...args: unknown[]) => void) & { callMethod?: unknown };
declare global { interface Window { fbq?: Fbq } }

export type Consent = "granted" | "denied" | null;

export function readConsent(): Consent {
  try { const v = localStorage.getItem(CONSENT_KEY); return v === "granted" || v === "denied" ? v : null; } catch { return null; }
}

export function writeConsent(value: "granted" | "denied") {
  try { localStorage.setItem(CONSENT_KEY, value); } catch {}
}

// First touch per session: a later internal navigation must not wipe the campaign that brought the visitor.
export function captureAttribution() {
  try {
    if (sessionStorage.getItem(ATTRIBUTION_KEY)) return;
    const query = new URLSearchParams(window.location.search);
    const data: Record<string, string> = {};
    for (const key of PARAMS) { const v = query.get(key); if (v) data[key] = v.slice(0, 200); }
    data.landing = window.location.pathname.slice(0, 200);
    if (document.referrer && !document.referrer.startsWith(window.location.origin)) data.referrer = document.referrer.slice(0, 300);
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(data));
  } catch {}
}

export function getAttribution(): Record<string, string> {
  try { return JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || "{}"); } catch { return {}; }
}

// Fires only when the visitor accepted the pixel (fbq exists only then).
export function trackLead(eventId?: string) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Lead", {}, eventId ? { eventID: eventId } : undefined);
  }
}
