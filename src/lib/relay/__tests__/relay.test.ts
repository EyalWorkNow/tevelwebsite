import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, beforeEach, describe, it } from "node:test";
import { createHash, randomBytes } from "node:crypto";

import { deriveKeys, packageId, randomId, sha256Hex, signRequest } from "../crypto";
import { handleRelay, handleSign, queueLeadForCrm, resetLimitsForTests } from "../handlers";
import { FsStore, setRelayStoreForTests } from "../store";

// Route handlers of the cloud mailbox with the folder store: CRM authentication, replay, expiry, the event flow.

const SECRET = "test-secret-0123456789-abcdefghijklmnopqrstuvwxyz";
const BASE = "https://www.tevel.space";
const keys = deriveKeys(SECRET);
let dir = "";

const relay = async (method: string, path: string, body?: unknown, options: { ts?: number; nonce?: string; secret?: string; raw?: Uint8Array } = {}) => {
  const bytes = options.raw ?? (body === undefined ? new Uint8Array() : new TextEncoder().encode(JSON.stringify(body)));
  const ts = String(options.ts ?? Date.now());
  const nonce = options.nonce ?? randomId();
  const signature = signRequest(options.secret ? deriveKeys(options.secret) : keys, method, path, ts, nonce, bytes);
  const req = new Request(`${BASE}${path}`, { method, body: method === "GET" ? undefined : Buffer.from(bytes), headers: { "x-relay-ts": ts, "x-relay-nonce": nonce, "x-relay-signature": signature, "x-real-ip": "10.0.0.1" } });
  const parts = path.split("?")[0].replace(/^\/api\/relay\//, "").split("/");
  const response = await handleRelay(req, parts);
  return { status: response.status, json: await response.json().catch(() => null), nonce };
};

const sign = async (body: Record<string, unknown>, ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1") => {
  const response = await handleSign(new Request(`${BASE}/api/sign`, { method: "POST", body: JSON.stringify(body), headers: { "content-type": "application/json", "user-agent": ua, "x-real-ip": "203.0.113.77" } }));
  const type = response.headers.get("content-type") ?? "";
  return { status: response.status, json: type.includes("json") ? await response.json() : null, bytes: type.includes("pdf") ? new Uint8Array(await response.arrayBuffer()) : null };
};

const FAKE_PDF = new TextEncoder().encode("%PDF-1.7\n" + "x".repeat(5000) + "\n%%EOF");

const pushPackage = async (overrides: Record<string, unknown> = {}) => {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = sha256Hex(token);
  const pid = packageId(keys, tokenHash);
  const put = await relay("PUT", `/api/relay/packages/${pid}/doc/0`, undefined, { raw: FAKE_PDF });
  assert.equal(put.status, 200);
  const manifest = {
    v: 1, tokenHash, mode: "SIGN", title: "TEST הצעת מחיר", number: "2026-9999", kindLabel: "הצעת מחיר", business: { name: "בית תוכנה תבל", accent: "#02BD8F", website: null },
    signerName: "ישראל ישראלי", consentText: "אני מאשר/ת", contentHash: "c".repeat(64), expiresAt: new Date(Date.now() + 7 * 86_400_000).toISOString(),
    commercial: { kind: "QUOTE", total: "₪1,180" },
    fields: [{ key: "signerName", type: "TEXT", label: "שם מלא", required: true, options: [] }, { key: "signature", type: "SIGNATURE", label: "חתימה", required: true, options: [] }],
    values: { signerName: "ישראל ישראלי" }, doc: { parts: 1, size: FAKE_PDF.length, sha256: sha256Hex(FAKE_PDF), fileName: "TEST.pdf" }, ...overrides,
  };
  const saved = await relay("POST", "/api/relay/packages", manifest);
  return { token, tokenHash, pid, saved };
};

const drawn = { kind: "DRAWN", paths: ["M10 10 L50 40 L90 20"], width: 600, height: 200 };

before(() => {
  dir = mkdtempSync(join(tmpdir(), "relay-test-"));
  process.env.RELAY_SHARED_SECRET = SECRET;
  setRelayStoreForTests(new FsStore(dir));
});
after(() => rmSync(dir, { recursive: true, force: true }));
beforeEach(() => resetLimitsForTests());

describe("crypto (shared test vector with the CRM)", () => {
  it("derives the same package id and request signature as crm-fusion", () => {
    const vectorKeys = deriveKeys("tevel-relay-test-vector-secret-0123456789");
    assert.equal(packageId(vectorKeys, "a".repeat(64)), "9b2f619a3e2e888e01df222e3c2441e07aa4d929");
    assert.equal(signRequest(vectorKeys, "POST", "/api/relay/ack", "1760000000000", "0".repeat(32), '{"ids":[]}'), "19e8e155756808d519c78f6a11a2a539c621ebf13c2a12fd830fbf097b072c78");
  });
});

describe("CRM authentication", () => {
  it("answers an unsigned health check without details, a signed one fully", async () => {
    const plain = await handleRelay(new Request(`${BASE}/api/relay/health`), ["health"]);
    assert.deepEqual(await plain.json(), { service: "tevel-relay", configured: true });
    const signed = await relay("GET", "/api/relay/health");
    assert.equal(signed.status, 200);
    assert.equal(signed.json.store, "fs");
  });
  it("refuses a wrong secret, missing headers and a stale timestamp", async () => {
    assert.equal((await relay("GET", "/api/relay/events", undefined, { secret: "another-secret-0123456789-abcdefghijklmnop" })).status, 401);
    const bare = await handleRelay(new Request(`${BASE}/api/relay/events`), ["events"]);
    assert.equal(bare.status, 401);
    assert.equal((await relay("GET", "/api/relay/events", undefined, { ts: Date.now() - 10 * 60_000 })).status, 401);
  });
  it("refuses a body changed after signing", async () => {
    const ts = String(Date.now()), nonce = randomId();
    const signature = signRequest(keys, "POST", "/api/relay/ack", ts, nonce, '{"ids":[]}');
    const response = await handleRelay(new Request(`${BASE}/api/relay/ack`, { method: "POST", body: '{"ids":["x"]}', headers: { "x-relay-ts": ts, "x-relay-nonce": nonce, "x-relay-signature": signature } }), ["ack"]);
    assert.equal(response.status, 401);
  });
  it("refuses a replayed request that changes something", async () => {
    const first = await relay("POST", "/api/relay/ack", { ids: [] });
    assert.equal(first.status, 200);
    const again = await relay("POST", "/api/relay/ack", { ids: [] }, { nonce: first.nonce });
    assert.equal(again.status, 409);
    assert.equal(again.json.error, "replayed_request");
  });
  it("is unavailable without a secret", async () => {
    const saved = process.env.RELAY_SHARED_SECRET;
    process.env.RELAY_SHARED_SECRET = "short";
    assert.equal((await relay("GET", "/api/relay/events")).status, 503);
    process.env.RELAY_SHARED_SECRET = saved;
  });
});

describe("packages and the customer's actions", () => {
  it("stores a package only after its PDF, and never stores the token", async () => {
    const tokenHash = sha256Hex("never-uploaded");
    const missing = await relay("POST", "/api/relay/packages", { tokenHash, expiresAt: new Date(Date.now() + 86_400_000).toISOString(), doc: { parts: 1, size: 1, sha256: "a".repeat(64), fileName: "x.pdf" } });
    assert.equal(missing.status, 409);
    const { token, saved } = await pushPackage();
    assert.equal(saved.status, 200);
    const files = await new FsStore(dir).list("relay/v1/");
    assert.ok(files.length > 0);
    for (const file of files) assert.ok(!file.path.includes(token) && !file.path.includes(sha256Hex(token)));
  });

  it("refuses an expiry in the past or too far ahead", async () => {
    const tokenHash = sha256Hex(randomId());
    assert.equal((await relay("POST", "/api/relay/packages", { tokenHash, expiresAt: new Date(Date.now() - 3_600_000).toISOString() })).status, 400);
    assert.equal((await relay("POST", "/api/relay/packages", { tokenHash, expiresAt: new Date(Date.now() + 400 * 86_400_000).toISOString() })).status, 400);
  });

  it("view → sign → the CRM pulls both events, acks them and the inbox empties", async () => {
    const { token, tokenHash } = await pushPackage();
    const pdf = await sign({ token, action: "pdf" });
    assert.equal(pdf.status, 200);
    assert.deepEqual(pdf.bytes, FAKE_PDF);
    assert.equal((await sign({ token, action: "view" })).json.recorded, true);
    assert.equal((await sign({ token, action: "view" })).json.recorded, false, "a second view is not a new event");
    const incomplete = await sign({ token, action: "sign", consent: true, values: { signerName: "ישראל ישראלי" } });
    assert.equal(incomplete.status, 400);
    assert.match(incomplete.json.error, /חתימה/);
    const noConsent = await sign({ token, action: "sign", values: { signature: drawn } });
    assert.equal(noConsent.json.error, "צריך לסמן את האישור לפני החתימה");
    const signed = await sign({ token, action: "sign", consent: true, contentHash: "c".repeat(64), values: { signature: drawn, unknownKey: "dropped" } });
    assert.equal(signed.status, 200, JSON.stringify(signed.json));
    const twice = await sign({ token, action: "sign", consent: true, values: { signature: drawn } });
    assert.equal(twice.json.error, "המסמך כבר נחתם");
    assert.equal((await sign({ token, action: "decline" })).json.ok, false);

    const pulled = await relay("GET", "/api/relay/events");
    const mine = pulled.json.events.filter((event: { tokenHash?: string }) => event.tokenHash === tokenHash);
    assert.deepEqual(mine.map((event: { type: string }) => event.type), ["viewed", "signed"]);
    const signedEvent = mine[1];
    assert.equal(signedEvent.signerName, "ישראל ישראלי");
    assert.deepEqual(signedEvent.values.signature, drawn);
    assert.equal(signedEvent.values.unknownKey, undefined);
    assert.equal(signedEvent.evidence.ip, "203.0.113.0", "only a coarse address is kept");
    assert.equal(signedEvent.evidence.consentHash, sha256Hex("אני מאשר/ת"));
    assert.ok(signedEvent.evidence.viewedAt);

    const ack = await relay("POST", "/api/relay/ack", { ids: pulled.json.events.map((event: { id: string }) => event.id), flag: pulled.json.flag, complete: true });
    assert.equal(ack.json.flagCleared, true);
    const empty = await relay("GET", "/api/relay/events");
    assert.deepEqual(empty.json.events, []);
    assert.equal(empty.json.flag, null);
  });

  it("keeps the inbox flag when an event arrived after the poll", async () => {
    const { token } = await pushPackage();
    await sign({ token, action: "view" });
    const pulled = await relay("GET", "/api/relay/events");
    await queueLeadForCrm({ email: "late@example.test", submissionId: "TEST-late" });
    const ack = await relay("POST", "/api/relay/ack", { ids: pulled.json.events.map((event: { id: string }) => event.id), flag: pulled.json.flag, complete: true });
    assert.equal(ack.json.flagCleared, false);
    const next = await relay("GET", "/api/relay/events");
    assert.deepEqual(next.json.events.map((event: { type: string }) => event.type), ["lead"]);
    await relay("POST", "/api/relay/ack", { ids: next.json.events.map((event: { id: string }) => event.id), flag: next.json.flag, complete: true });
  });

  it("decline is final and carries the reason", async () => {
    const { token, tokenHash } = await pushPackage();
    assert.equal((await sign({ token, action: "decline", reason: "יקר מדי" })).json.ok, true);
    assert.equal((await sign({ token, action: "sign", consent: true, values: { signature: drawn } })).json.ok, false);
    const pulled = await relay("GET", "/api/relay/events");
    const event = pulled.json.events.find((item: { tokenHash?: string; type: string }) => item.tokenHash === tokenHash && item.type === "declined");
    assert.equal(event.reason, "יקר מדי");
    await relay("POST", "/api/relay/ack", { ids: pulled.json.events.map((item: { id: string }) => item.id), flag: pulled.json.flag, complete: true });
  });

  it("a view-only document cannot be signed", async () => {
    const { token } = await pushPackage({ mode: "VIEW", fields: [] });
    assert.match((await sign({ token, action: "sign", consent: true })).json.error, /רק לראות/);
  });

  it("an expired link can no longer be signed", async () => {
    const { token } = await pushPackage({ expiresAt: new Date(Date.now() + 1500).toISOString() });
    await new Promise((resolve) => setTimeout(resolve, 1600));
    const late = await sign({ token, action: "sign", consent: true, values: { signature: drawn } });
    assert.match(late.json.error, /תוקף הקישור פג/);
    assert.equal((await sign({ token, action: "pdf" })).status, 410);
  });

  it("an unknown or malformed token gets the same answer as a replaced link", async () => {
    assert.equal((await sign({ token: randomBytes(32).toString("base64url"), action: "view" })).json.code, "NOT_FOUND");
    assert.equal((await sign({ token: "short", action: "view" })).json.code, "BAD_TOKEN");
  });

  it("link previews (bots) never count as a view", async () => {
    const { token } = await pushPackage();
    assert.equal((await sign({ token, action: "view" }, "WhatsApp/2.23.20.0")).json.recorded, false);
  });

  it("the signed copy goes up and down; purge removes everything", async () => {
    const { token, pid } = await pushPackage();
    await sign({ token, action: "sign", consent: true, values: { signature: drawn } });
    assert.equal((await sign({ token, action: "signed-pdf" })).status, 404);
    const signedPdf = new TextEncoder().encode("%PDF-1.7 signed copy %%EOF");
    assert.equal((await relay("PUT", `/api/relay/packages/${pid}/signed/0`, undefined, { raw: signedPdf })).status, 200);
    assert.equal((await relay("POST", `/api/relay/packages/${pid}/signed`, { parts: 1, size: signedPdf.length, sha256: createHash("sha256").update(signedPdf).digest("hex"), fileName: "TEST חתום.pdf" })).status, 200);
    assert.deepEqual((await sign({ token, action: "signed-pdf" })).bytes, signedPdf);
    const maintenance = await relay("POST", "/api/relay/maintenance", {});
    const entry = maintenance.json.packages.find((item: { pid: string }) => item.pid === pid);
    assert.ok(entry.signedCopy);
    assert.ok(entry.files.includes("action"));
    assert.equal((await relay("DELETE", `/api/relay/packages/${pid}`)).json.ok, true);
    assert.equal((await sign({ token, action: "view" })).json.code, "NOT_FOUND");
    assert.equal((await new FsStore(dir).list(`relay/v1/pkg/${pid}/`)).length, 0);
    const pulled = await relay("GET", "/api/relay/events");
    await relay("POST", "/api/relay/ack", { ids: pulled.json.events.map((item: { id: string }) => item.id), flag: pulled.json.flag, complete: true });
  });

  it("rejects a bad package id", async () => {
    assert.equal((await relay("DELETE", "/api/relay/packages/..%2F..%2Fetc")).status, 400);
  });
});
