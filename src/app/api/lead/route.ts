import nodemailer from "nodemailer";

// Leads from every site form → Gmail inbox via SMTP (App Password).
// Env: GMAIL_USER, GMAIL_APP_PASSWORD, LEAD_TO_EMAIL (defaults to GMAIL_USER).

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

  const user = process.env.GMAIL_USER, pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
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
      subject: `ליד חדש מהאתר (${source}): ${lead.name ?? lead.email}${lead.company ? ` — ${lead.company}` : ""}`,
      text: `מקור: ${source}\n\n${text}`,
      html: `<div dir="rtl" style="font-family:Arial,sans-serif"><h2 style="margin:0 0 12px">ליד חדש מהאתר</h2><p style="color:#666">מקור: ${esc(source)}</p><table style="border-collapse:collapse">${rows}</table></div>`,
    });
  } catch (e) {
    console.error("[lead] send failed:", e, JSON.stringify({ source, ...lead }));
    return Response.json({ error: "send_failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
