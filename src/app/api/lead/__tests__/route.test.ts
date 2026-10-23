import { test, beforeEach, mock } from "node:test";
import assert from "node:assert/strict";
import nodemailer from "nodemailer";
import { POST } from "../route";

const sent: { subject?: string }[] = [];
mock.method(nodemailer, "createTransport", () => ({ sendMail: async (m: { subject?: string }) => { sent.push(m); return {}; } }));

let ipN = 0;
const lead = () => new Request("http://x/api/lead", {
  method: "POST",
  headers: { "content-type": "application/json", "x-forwarded-for": `10.0.0.${++ipN}` },
  body: JSON.stringify({ name: "Dana", email: "dana@example.com", message: "hi", source: "contact" }),
});

beforeEach(() => {
  sent.length = 0;
  process.env.CRM_LEAD_URL = "https://crm.test/s/tevel/website-lead";
  process.env.CRM_LEAD_SECRET = "s3cret-s3cret-s3cret";
  process.env.GMAIL_USER = "u@gmail.com";
  process.env.GMAIL_APP_PASSWORD = "pw";
  mock.method(console, "error", () => {});
});

const withFetch = (impl: typeof fetch) => mock.method(globalThis, "fetch", impl);

test("CRM answers {ok:true} → no Gmail email, sends the secret header", async () => {
  let headers: Headers | undefined;
  withFetch(async (_u, init) => { headers = new Headers(init?.headers); return Response.json({ ok: true }); });
  const res = await POST(lead());
  assert.equal(res.status, 200);
  assert.equal(headers?.get("x-tevel-lead-secret"), "s3cret-s3cret-s3cret");
  assert.equal(sent.length, 0);
});

test("CRM 401 (bad secret) → Gmail fallback, flagged", async () => {
  withFetch(async () => Response.json({ ok: false, error: "unauthorized" }, { status: 401 }));
  const res = await POST(lead());
  assert.equal(res.status, 200);
  assert.equal(sent.length, 1);
  assert.match(sent[0].subject ?? "", /CRM לא זמין/);
});

test("CRM 200 with {ok:false} → Gmail fallback", async () => {
  withFetch(async () => Response.json({ ok: false }));
  await POST(lead());
  assert.equal(sent.length, 1);
});

test("CRM 200 non-JSON → Gmail fallback", async () => {
  withFetch(async () => new Response("<html>ngrok</html>"));
  await POST(lead());
  assert.equal(sent.length, 1);
});

test("CRM hangs → aborted after ~5s, Gmail fallback", async () => {
  withFetch((_u, init) => new Promise((_r, reject) => init?.signal?.addEventListener("abort", () => reject(init.signal!.reason))));
  const t = Date.now();
  await POST(lead());
  const ms = Date.now() - t;
  assert.ok(ms >= 4500 && ms < 7000, `took ${ms}ms`);
  assert.equal(sent.length, 1);
});

test("CRM not configured → plain Gmail email (no flag)", async () => {
  delete process.env.CRM_LEAD_URL;
  const f = withFetch(async () => Response.json({ ok: true }));
  await POST(lead());
  assert.equal(f.mock.callCount(), 0);
  assert.equal(sent.length, 1);
  assert.doesNotMatch(sent[0].subject ?? "", /CRM/);
});
