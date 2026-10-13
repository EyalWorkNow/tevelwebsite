import nodemailer from "nodemailer";
import { queueLeadForCrm } from "@/lib/relay/handlers";

// Leads from every site form → Tevel CRM (which emails the owner about every new lead).
// If the CRM is not configured or not reachable, the lead waits in the cloud mailbox (RELAY_SHARED_SECRET + Blob store,
// the CRM pulls it when it is back on) and also falls back to the Gmail email below, so nothing is lost.
// Env: CRM_LEAD_URL (https://<crm>/s/tevel/website-lead), CRM_LEAD_SECRET (server-only, never NEXT_PUBLIC_),
//      GMAIL_USER, GMAIL_APP_PASSWORD, LEAD_TO_EMAIL (defaults to GMAIL_USER) for the fallback.

const FIELDS: Record<string, string> = {
  name: "שם", company: "חברה", role: "תפקיד", email: "אימייל", phone: "טלפון",
  size: "גודל חברה", message: "מה מנסים לפתור", budget: "טווח תקציב", contact: "ערוץ מועדף",
};
const MAX = 2000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// ponytail: in-memory rate limit per IP — resets on redeploy and isn't shared across instances; move to Upstash/KV if abused.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return Response.json({ error: "bad_request" }, { status: 400 }); }

  // Honeypot: bots fill hidden fields; pretend success.
  if (typeof body.website === "string" && body.website) return Response.json({ ok: true });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

  const lead: Record<string, string> = {};
  for (const k of Object.keys(FIELDS)) {
    const v = body[k];
    if (typeof v === "string" && v.trim()) lead[k] = v.trim().slice(0, MAX);
  }
  const source = typeof body.source === "string" ? body.source.slice(0, 80) : "contact";

  if (!lead.email || !EMAIL_RE.test(lead.email)) return Response.json({ error: "invalid_email" }, { status: 400 });
  if (source === "contact" && !lead.name) return Response.json({ error: "missing_name" }, { status: 400 });

  const payload = crmPayload(lead, source, body, req, ip);
  const crm = await sendToCrm(payload);
  if (crm === "ok") return Response.json({ ok: true });
  // The CRM (on the office computer) is off or unreachable: the lead waits in the mailbox for it.
  const queued = await queueLeadForCrm(payload);

  const user = process.env.GMAIL_USER, pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    if (queued) return Response.json({ ok: true });
    // Don't lose the lead if mail isn't configured yet.
    console.error("[lead] GMAIL_USER / GMAIL_APP_PASSWORD missing — lead not emailed:", JSON.stringify({ source, ...lead }));
    return Response.json({ error: "mail_not_configured" }, { status: 503 });
  }

  const rows = Object.entries(lead).map(([k, v]) => `<tr><td style="padding:6px 12px;color:#666;white-space:nowrap">${FIELDS[k]}</td><td style="padding:6px 12px">${esc(v).replace(/\n/g, "<br>")}</td></tr>`).join("");
  const text = Object.entries(lead).map(([k, v]) => `${FIELDS[k]}: ${v}`).join("\n");

  try {
    await nodemailer.createTransport({ service: "gmail", auth: { user, pass } }).sendMail({
      from: `"אתר תבל" <${user}>`,
      to: process.env.LEAD_TO_EMAIL || user,
      replyTo: lead.email,
      subject: `${crm === "failed" ? (queued ? "[CRM לא זמין – ייקלט כשיחזור] " : "[CRM לא זמין] ") : ""}ליד חדש מהאתר (${source}): ${lead.name ?? lead.email}${lead.company ? ` — ${lead.company}` : ""}`,
      text: `מקור: ${source}\n\n${text}`,
      html: `<div dir="rtl" style="font-family:Arial,sans-serif"><h2 style="margin:0 0 12px">ליד חדש מהאתר</h2><p style="color:#666">מקור: ${esc(source)}</p><table style="border-collapse:collapse">${rows}</table></div>`,
    });
  } catch (e) {
    console.error("[lead] send failed:", e, JSON.stringify({ source, ...lead }));
    if (queued) return Response.json({ ok: true });
    return Response.json({ error: "send_failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}

const str = (v: unknown, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined);

// What the CRM's website-lead route receives (also what waits in the mailbox when the CRM is off).
function crmPayload(lead: Record<string, string>, source: string, body: Record<string, unknown>, req: Request, ip: string): Record<string, unknown> {
  const utmIn = body.utm && typeof body.utm === "object" ? (body.utm as Record<string, unknown>) : {};
  const utm: Record<string, string> = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid", "landing", "referrer"]) {
    const v = str(utmIn[k], 300); if (v) utm[k] = v;
  }
  // Pixel consent travels with the lead; IP / browser / page only when the visitor accepted (CRM → Meta Conversions API).
  const trackIn = body.tracking && typeof body.tracking === "object" ? (body.tracking as Record<string, unknown>) : {};
  const consent = trackIn.consent === true;
  const page = str(body.page, 200);
  const tracking = consent
    ? { consent: true, fbp: str(trackIn.fbp, 200), fbc: str(trackIn.fbc, 600), clientIp: ip === "local" ? undefined : ip,
        userAgent: str(req.headers.get("user-agent") ?? "", 500), eventSourceUrl: page ? `https://tevel.space${page.startsWith("/") ? page : `/${page}`}` : undefined }
    : { consent: false };
  // A submission id always travels, so a lead that reaches the CRM twice (slow answer + mailbox) is created once.
  const submissionId = str(body.submissionId, 100) ?? `srv-${crypto.randomUUID()}`;
  return { ...lead, source, submissionId, page: str(body.page, 200) ?? utm.landing, referrer: utm.referrer, utm, tracking };
}

// Server-to-server: the secret stays on Vercel. 8s budget so a sleeping CRM never blocks the visitor.
async function sendToCrm(payload: Record<string, unknown>): Promise<"ok" | "failed" | "off"> {
  const url = process.env.CRM_LEAD_URL, secret = process.env.CRM_LEAD_SECRET;
  if (!url || !secret) return "off";
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-tevel-lead-secret": secret, "ngrok-skip-browser-warning": "1" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (res.ok && data.ok) return "ok";
    console.error("[lead] CRM rejected:", res.status, data.error);
  } catch (e) {
    console.error("[lead] CRM unreachable:", e);
  }
  return "failed";
}
