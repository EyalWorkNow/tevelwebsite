import { safeEqualHex, signRequest } from "./crypto";
import {
  ackEvents, mailbox, maintenance, type Mailbox, openPackage, pendingEvents, purgePackage, queueLead, readPdf, recordDecline, recordSign,
  recordView, RelayError, saveSignedMeta, savePackage, savePart, claimNonce,
} from "./mailbox";

// Request handlers for /api/relay/* (the CRM only) and /api/sign (the customer's page). Plain Request → Response so
// tests run them without a server; the route files only forward.

const WINDOW_MS = 5 * 60_000;
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "cache-control": "no-store", "x-robots-tag": "noindex, nofollow" } });

// ---- rate limits (per instance; enough to blunt guessing and floods, the token space makes guessing hopeless) -------
const buckets = new Map<string, number[]>();
export const limited = (key: string, max: number, windowMs: number) => {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((at) => now - at < windowMs);
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 5000) buckets.clear();
  return recent.length > max;
};
export const resetLimitsForTests = () => buckets.clear();

const clientIp = (req: Request) => req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

// ---- the CRM's requests -------------------------------------------------------------------------------------------

type Verified = { box: Mailbox; body: Uint8Array };

export const verifyRelayRequest = async (req: Request, mutating: boolean): Promise<Verified | Response> => {
  const box = mailbox();
  if (!box) return json({ error: "relay_not_configured" }, 503);
  const ip = clientIp(req) ?? "unknown";
  if (limited(`relay:${ip}`, 600, 60_000)) return json({ error: "rate_limited" }, 429);
  const ts = req.headers.get("x-relay-ts") ?? "";
  const nonce = req.headers.get("x-relay-nonce") ?? "";
  const signature = (req.headers.get("x-relay-signature") ?? "").toLowerCase();
  const body = new Uint8Array(await req.arrayBuffer());
  if (!/^\d{13}$/.test(ts) || !/^[a-f0-9]{32}$/.test(nonce) || !/^[a-f0-9]{64}$/.test(signature)) {
    limited(`relay-bad:${ip}`, 30, 600_000);
    return json({ error: "unauthorized" }, 401);
  }
  const url = new URL(req.url);
  const expected = signRequest(box.keys, req.method, url.pathname + url.search, ts, nonce, body);
  if (!safeEqualHex(signature, expected)) {
    if (limited(`relay-bad:${ip}`, 30, 600_000)) return json({ error: "rate_limited" }, 429);
    return json({ error: "unauthorized" }, 401);
  }
  if (Math.abs(Date.now() - Number(ts)) > WINDOW_MS) return json({ error: "stale_request" }, 401);
  if (mutating && !(await claimNonce(box, nonce))) return json({ error: "replayed_request" }, 409);
  return { box, body };
};

const parse = (body: Uint8Array): Record<string, unknown> => {
  try { const value = JSON.parse(new TextDecoder().decode(body)); return value && typeof value === "object" ? value : {}; } catch { return {}; }
};

const guard = async (run: () => Promise<Response>) => {
  try { return await run(); } catch (error) {
    if (error instanceof RelayError) return json({ error: error.code }, error.status);
    console.error("[relay]", error);
    return json({ error: "server_error" }, 500);
  }
};

// GET  /api/relay/health                       is the mailbox configured (signed: full check)
// POST /api/relay/packages                     manifest (after its PDF parts)
// PUT  /api/relay/packages/<pid>/doc/<n>       a part of the document PDF (raw bytes)
// PUT  /api/relay/packages/<pid>/signed/<n>    a part of the signed copy
// POST /api/relay/packages/<pid>/signed        the signed copy's metadata (after its parts)
// DELETE /api/relay/packages/<pid>             purge everything of a package
// GET  /api/relay/events                       pending events (customer actions, queued leads)
// POST /api/relay/ack                          { ids, flag, complete }
// POST /api/relay/maintenance                  package list + cleanup
export const handleRelay = async (req: Request, path: string[]): Promise<Response> => guard(async () => {
  const method = req.method.toUpperCase();
  const route = path.join("/");
  if (route === "health" && method === "GET" && !req.headers.get("x-relay-signature")) return json({ service: "tevel-relay", configured: Boolean(mailbox()) });
  const mutating = method !== "GET";
  const verified = await verifyRelayRequest(req, mutating);
  if (verified instanceof Response) return verified;
  const { box, body } = verified;
  if (route === "health" && method === "GET") return json({ ok: true, service: "tevel-relay", store: box.store.kind, time: new Date().toISOString() });
  if (route === "packages" && method === "POST") return json({ ok: true, ...(await savePackage(box, parse(body))) });
  if (route === "events" && method === "GET") return json({ ok: true, ...(await pendingEvents(box)) });
  if (route === "ack" && method === "POST") return json({ ok: true, ...(await ackEvents(box, parse(body))) });
  if (route === "maintenance" && method === "POST") return json({ ok: true, ...(await maintenance(box)) });
  const [first, pid, kind, index] = path;
  if (first === "packages" && pid) {
    if (method === "DELETE" && path.length === 2) return json({ ok: true, ...(await purgePackage(box, pid)) });
    if (method === "PUT" && (kind === "doc" || kind === "signed") && index !== undefined && path.length === 4) {
      await savePart(box, pid, kind, Number(index), body);
      return json({ ok: true });
    }
    if (method === "POST" && kind === "signed" && path.length === 3) { await saveSignedMeta(box, pid, parse(body)); return json({ ok: true }); }
  }
  return json({ error: "not_found" }, 404);
});

// ---- the customer's page ------------------------------------------------------------------------------------------

// POST /api/sign { token, action: "view" | "sign" | "decline" | "pdf" | "signed-pdf" }. The token travels in the body,
// not the address, so it stays out of request logs.
export const handleSign = async (req: Request): Promise<Response> => guard(async () => {
  const box = mailbox();
  if (!box) return json({ ok: false, error: "השירות לא זמין כרגע. אפשר לנסות שוב מאוחר יותר." }, 503);
  const ip = clientIp(req);
  if (limited(`sign:${ip ?? "unknown"}`, 60, 60_000)) return json({ ok: false, error: "יותר מדי ניסיונות. אפשר לנסות שוב בעוד דקה." }, 429);
  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > 4_000_000) return json({ ok: false, error: "הקובץ גדול מדי" }, 413);
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ ok: false, error: "בקשה לא תקינה" }, 400); }
  const token = typeof body.token === "string" ? body.token : "";
  const opened = await openPackage(box, token);
  if (!opened.ok) {
    if (limited(`sign-miss:${ip ?? "unknown"}`, 20, 600_000)) return json({ ok: false, error: "יותר מדי ניסיונות. אפשר לנסות שוב מאוחר יותר." }, 429);
    return json({ ok: false, error: opened.message, code: opened.code }, 404);
  }
  const meta = { ip, userAgent: req.headers.get("user-agent") };
  switch (body.action) {
    case "view": return json({ ok: true, ...(await recordView(box, opened, meta)) });
    case "sign": {
      if (limited(`sign-act:${opened.pid}`, 10, 600_000)) return json({ ok: false, error: "יותר מדי ניסיונות. אפשר לנסות שוב בעוד כמה דקות." }, 429);
      const result = await recordSign(box, opened, body, meta);
      return json(result, result.ok ? 200 : 400);
    }
    case "decline": {
      const result = await recordDecline(box, opened, body, meta);
      return json(result, result.ok ? 200 : 400);
    }
    case "pdf":
    case "signed-pdf": {
      const signed = body.action === "signed-pdf";
      const meta2 = signed ? opened.signed : opened.manifest.doc;
      if (!meta2) return json({ ok: false, error: signed ? "העותק החתום עוד לא מוכן" : "המסמך עוד בהכנה. אפשר לרענן בעוד דקה." }, 404);
      if (opened.expired && !opened.action) return json({ ok: false, error: "תוקף הקישור פג. אפשר לבקש מהעסק קישור חדש." }, 410);
      const bytes = await readPdf(box, opened.pid, signed ? "signed" : "doc", meta2);
      return new Response(Buffer.from(bytes), { headers: {
        "content-type": contentTypeOf(meta2.fileName), "cache-control": "no-store", "x-robots-tag": "noindex, nofollow", "x-content-type-options": "nosniff",
        "content-disposition": `attachment; filename="document.pdf"; filename*=UTF-8''${encodeURIComponent(meta2.fileName)}`,
      } });
    }
    default: return json({ ok: false, error: "פעולה לא מוכרת" }, 400);
  }
});

// Files sent from the customer file keep their type; quotes, invoices and documents are PDFs.
const TYPES: Record<string, string> = { pdf: "application/pdf", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
const contentTypeOf = (name: string) => TYPES[name.split(".").pop()?.toLowerCase() ?? ""] ?? "application/octet-stream";

// Website lead fallback: queued for the CRM when it is unreachable (used by /api/lead).
export const queueLeadForCrm = async (lead: Record<string, unknown>): Promise<boolean> => {
  const box = mailbox();
  if (!box) return false;
  try { await queueLead(box, lead); return true; } catch (error) { console.error("[relay] lead queue failed:", error); return false; }
};
