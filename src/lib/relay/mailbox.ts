import { coarseIp, deriveKeys, HASH_RE, open, packageId, PID_RE, randomId, type RelayKeys, seal, sha256Hex, TOKEN_RE } from "./crypto";
import { isPreviewBot, sanitizeValues, validateValues, type FieldIssue } from "./fields";
import { relayStore, type RelayStore } from "./store";
import type { RelayAction, RelayEvent, RelayEvidence, RelayManifest, SignedMeta } from "./types";

// The cloud mailbox (docs: ~/tevel-crm/docs/tevel/public-links-he.md). The CRM on the owner's Mac pushes a signing
// package; the customer opens https://www.tevel.space/sign/<token>, looks, signs or declines; the CRM pulls the
// events and finishes the job (signed PDF, statuses, tasks) when it is on. The cloud never calls the Mac.
//
// Store layout (every blob sealed with AES-256-GCM, bound to its path):
//   relay/v1/pkg/<pid>/manifest            the package (pid = HMAC of the token's SHA-256; the token is never stored)
//   relay/v1/pkg/<pid>/doc/<n>             the document PDF, in parts (a request may carry ≤ 4.5 MB on Vercel)
//   relay/v1/pkg/<pid>/viewed              first view (write-once)
//   relay/v1/pkg/<pid>/action              the customer's one action: signed / declined (write-once = the lock)
//   relay/v1/pkg/<pid>/signed/<n>, signed-meta   the signed copy, pushed back by the CRM
//   relay/v1/evt/<time>-<id>               events waiting for the CRM (deleted on ack)
//   relay/v1/inbox                         "there is something to pull" (one cheap read per CRM poll)
//   relay/v1/nonce/<nonce>                 used request nonces (replay protection, cleaned by maintenance)

export const ROOT = "relay/v1";
export const MAX_PART_BYTES = 3_500_000;
export const MAX_PARTS = 24;
const MAX_LINK_DAYS = 90;

export class RelayError extends Error {
  constructor(public status: number, public code: string, message?: string) { super(message ?? code); }
}

export type Mailbox = { store: RelayStore; keys: RelayKeys };

export const mailbox = (): Mailbox | null => {
  const secret = process.env.RELAY_SHARED_SECRET ?? "";
  const store = relayStore();
  if (secret.length < 32 || !store) return null;
  return { store, keys: deriveKeys(secret) };
};

const pkgPath = (pid: string, name: string) => `${ROOT}/pkg/${pid}/${name}`;
const enc = (value: unknown) => new TextEncoder().encode(JSON.stringify(value));
const dec = <T,>(bytes: Uint8Array) => JSON.parse(new TextDecoder().decode(bytes)) as T;

const putJson = (box: Mailbox, path: string, value: unknown, overwrite = true) => box.store.put(path, seal(box.keys, path, enc(value)), { overwrite });
const getJson = async <T,>(box: Mailbox, path: string): Promise<T | null> => {
  const item = await box.store.get(path);
  return item ? dec<T>(open(box.keys, path, item.bytes)) : null;
};

const pidOf = (box: Mailbox, pid: string) => {
  if (!PID_RE.test(pid)) throw new RelayError(400, "bad_pid");
  return pid;
};

// ---- CRM side ---------------------------------------------------------------------------------------------------

const str = (value: unknown, max: number) => (typeof value === "string" ? value.slice(0, max) : "");

export const savePackage = async (box: Mailbox, input: unknown): Promise<{ pid: string }> => {
  const raw = (input && typeof input === "object" ? input : {}) as Partial<RelayManifest>;
  if (!HASH_RE.test(String(raw.tokenHash ?? ""))) throw new RelayError(400, "bad_token_hash");
  const expires = Date.parse(String(raw.expiresAt ?? ""));
  if (!Number.isFinite(expires) || expires < Date.now() - 60_000 || expires > Date.now() + MAX_LINK_DAYS * 86_400_000) throw new RelayError(400, "bad_expiry");
  const fields = Array.isArray(raw.fields) ? raw.fields.slice(0, 80).map((field) => ({
    key: str(field?.key, 80), type: field?.type, label: str(field?.label, 200), required: Boolean(field?.required),
    options: Array.isArray(field?.options) ? field.options.slice(0, 50).map((option) => str(option, 200)) : [],
  })).filter((field) => field.key) : [];
  const doc = raw.doc ? {
    parts: Math.trunc(Number(raw.doc.parts)), size: Math.trunc(Number(raw.doc.size)), sha256: String(raw.doc.sha256 ?? ""), fileName: str(raw.doc.fileName, 160) || "document.pdf",
  } : null;
  if (doc && (!(doc.parts >= 1 && doc.parts <= MAX_PARTS) || !HASH_RE.test(doc.sha256))) throw new RelayError(400, "bad_doc");
  const manifest: RelayManifest = {
    v: 1, tokenHash: String(raw.tokenHash), mode: raw.mode === "VIEW" ? "VIEW" : "SIGN",
    title: str(raw.title, 200), number: str(raw.number, 60), kindLabel: str(raw.kindLabel, 60) || "מסמך",
    business: { name: str(raw.business?.name, 120), accent: /^#[0-9a-f]{6}$/i.test(String(raw.business?.accent ?? "")) ? String(raw.business?.accent) : null, website: str(raw.business?.website, 200) || null },
    signerName: str(raw.signerName, 120), consentText: str(raw.consentText, 2000), contentHash: str(raw.contentHash, 128),
    createdAt: new Date().toISOString(), expiresAt: new Date(expires).toISOString(),
    commercial: raw.commercial && (raw.commercial.kind === "QUOTE" || raw.commercial.kind === "INVOICE") ? { kind: raw.commercial.kind, total: str(raw.commercial.total, 60) } : null,
    fields: fields as RelayManifest["fields"], values: sanitizeValues(fields as RelayManifest["fields"], raw.values), doc,
  };
  const pid = packageId(box.keys, manifest.tokenHash);
  if (doc) {
    // The parts went up first; the manifest is written last, so a package that exists is complete.
    const parts = await box.store.list(pkgPath(pid, "doc/"));
    if (parts.length < doc.parts) throw new RelayError(409, "doc_parts_missing");
  }
  await putJson(box, pkgPath(pid, "manifest"), manifest);
  return { pid };
};

export const savePart = async (box: Mailbox, pid: string, kind: "doc" | "signed", index: number, bytes: Uint8Array) => {
  pidOf(box, pid);
  if (!(Number.isInteger(index) && index >= 0 && index < MAX_PARTS)) throw new RelayError(400, "bad_part");
  if (!bytes.length || bytes.length > MAX_PART_BYTES + 1024) throw new RelayError(413, "bad_part_size");
  if (kind === "signed" && !(await box.store.get(pkgPath(pid, "manifest")))) throw new RelayError(404, "no_package");
  const path = pkgPath(pid, `${kind}/${String(index).padStart(2, "0")}`);
  await box.store.put(path, seal(box.keys, path, bytes));
};

export const saveSignedMeta = async (box: Mailbox, pid: string, input: unknown) => {
  pidOf(box, pid);
  const raw = (input && typeof input === "object" ? input : {}) as Partial<SignedMeta>;
  const meta: SignedMeta = { parts: Math.trunc(Number(raw.parts)), size: Math.trunc(Number(raw.size)), sha256: String(raw.sha256 ?? ""), fileName: str(raw.fileName, 160) || "signed.pdf", at: new Date().toISOString() };
  if (!(meta.parts >= 1 && meta.parts <= MAX_PARTS) || !HASH_RE.test(meta.sha256)) throw new RelayError(400, "bad_signed");
  const parts = await box.store.list(pkgPath(pid, "signed/"));
  if (parts.length < meta.parts) throw new RelayError(409, "signed_parts_missing");
  await putJson(box, pkgPath(pid, "signed-meta"), meta);
};

// The CRM's poll: one read of the inbox flag; the events are listed only when it is there.
export const pendingEvents = async (box: Mailbox, limit = 100): Promise<{ events: RelayEvent[]; flag: string | null; more: boolean }> => {
  const flag = await getJson<{ id: string }>(box, `${ROOT}/inbox`);
  if (!flag) return { events: [], flag: null, more: false };
  const items = (await box.store.list(`${ROOT}/evt/`)).sort((a, b) => a.path.localeCompare(b.path));
  const events: RelayEvent[] = [];
  for (const item of items.slice(0, limit)) {
    const event = await getJson<RelayEvent>(box, item.path).catch(() => null);
    if (event) events.push(event);
    else await box.store.del([item.path]); // unreadable (other secret): nothing anyone can use
  }
  return { events, flag: flag.id, more: items.length > limit };
};

// Acknowledged events are deleted. The flag goes only if nothing was written since the poll that saw it.
export const ackEvents = async (box: Mailbox, input: { ids?: unknown; flag?: unknown; complete?: unknown }) => {
  const ids = new Set((Array.isArray(input.ids) ? input.ids : []).map(String).filter((id) => /^[a-z0-9-]{8,80}$/.test(id)));
  const items = await box.store.list(`${ROOT}/evt/`);
  const done = items.filter((item) => ids.has(item.path.slice(item.path.lastIndexOf("/") + 1).split("_")[1] ?? ""));
  await box.store.del(done.map((item) => item.path));
  let flagCleared = false;
  if (input.complete === true && typeof input.flag === "string") {
    const flag = await getJson<{ id: string }>(box, `${ROOT}/inbox`);
    if (flag && flag.id === input.flag && items.length === done.length) { await box.store.del([`${ROOT}/inbox`]); flagCleared = true; }
  }
  return { deleted: done.length, flagCleared };
};

export const purgePackage = async (box: Mailbox, pid: string) => {
  pidOf(box, pid);
  const items = await box.store.list(`${ROOT}/pkg/${pid}/`);
  await box.store.del(items.map((item) => item.path));
  return { deleted: items.length };
};

// Housekeeping, called by the CRM a few times a day: what packages exist (so the CRM can push signed copies and
// purge old ones), old nonces removed, and packages far past any link's life removed even if the CRM never returns.
export const maintenance = async (box: Mailbox) => {
  const now = Date.now();
  const nonces = (await box.store.list(`${ROOT}/nonce/`)).filter((item) => now - item.uploadedAt > 15 * 60_000);
  await box.store.del(nonces.map((item) => item.path));
  const files = await box.store.list(`${ROOT}/pkg/`);
  const packages = new Map<string, { pid: string; files: string[]; createdAt: number }>();
  for (const file of files) {
    const [pid, ...rest] = file.path.slice(`${ROOT}/pkg/`.length).split("/");
    const entry = packages.get(pid) ?? { pid, files: [], createdAt: file.uploadedAt };
    entry.files.push(rest.join("/"));
    entry.createdAt = Math.min(entry.createdAt, file.uploadedAt);
    packages.set(pid, entry);
  }
  let abandoned = 0;
  for (const entry of packages.values()) {
    if (now - entry.createdAt > (MAX_LINK_DAYS + 90) * 86_400_000) { await purgePackage(box, entry.pid); packages.delete(entry.pid); abandoned += 1; }
  }
  return { packages: [...packages.values()].map((entry) => ({ pid: entry.pid, createdAt: new Date(entry.createdAt).toISOString(), files: entry.files.filter((name) => !name.startsWith("doc/") && !name.startsWith("signed/")), signedCopy: entry.files.includes("signed-meta") })), noncesDeleted: nonces.length, abandoned };
};

// Replay protection for requests that change something: a nonce can be used once.
export const claimNonce = async (box: Mailbox, nonce: string) => (await box.store.put(`${ROOT}/nonce/${nonce}`, new Uint8Array([1]), { overwrite: false })) === "ok";

const writeEvent = async (box: Mailbox, event: RelayEvent) => {
  const path = `${ROOT}/evt/${String(Date.now()).padStart(15, "0")}_${event.id}`;
  await putJson(box, path, event);
  await putJson(box, `${ROOT}/inbox`, { id: randomId(8) });
};

// Website leads that could not reach the CRM wait here (the CRM de-duplicates by the form's submission id).
export const queueLead = async (box: Mailbox, lead: Record<string, unknown>) => {
  await writeEvent(box, { id: randomId(), type: "lead", at: new Date().toISOString(), lead });
};

// ---- customer side ------------------------------------------------------------------------------------------------

export type Opened =
  | { ok: true; pid: string; tokenHash: string; manifest: RelayManifest; action: RelayAction | null; signed: SignedMeta | null; expired: boolean }
  | { ok: false; code: "BAD_TOKEN" | "NOT_FOUND"; message: string };

export const openPackage = async (box: Mailbox, token: string): Promise<Opened> => {
  if (!TOKEN_RE.test(token)) return { ok: false, code: "BAD_TOKEN", message: "הקישור לא תקין. כדאי לבקש מהעסק קישור חדש." };
  const tokenHash = sha256Hex(token);
  const pid = packageId(box.keys, tokenHash);
  const manifest = await getJson<RelayManifest>(box, pkgPath(pid, "manifest"));
  if (!manifest || manifest.tokenHash !== tokenHash) return { ok: false, code: "NOT_FOUND", message: "הקישור לא נמצא. ייתכן שהוחלף בקישור חדש או שהמסמך בוטל." };
  const [action, signed] = await Promise.all([getJson<RelayAction>(box, pkgPath(pid, "action")), getJson<SignedMeta>(box, pkgPath(pid, "signed-meta"))]);
  return { ok: true, pid, tokenHash, manifest, action, signed, expired: Date.now() > Date.parse(manifest.expiresAt) };
};

export const readPdf = async (box: Mailbox, pid: string, kind: "doc" | "signed", meta: { parts: number; sha256: string }) => {
  const chunks: Uint8Array[] = [];
  for (let index = 0; index < meta.parts; index += 1) {
    const path = pkgPath(pid, `${kind}/${String(index).padStart(2, "0")}`);
    const item = await box.store.get(path);
    if (!item) throw new RelayError(404, "pdf_missing");
    chunks.push(open(box.keys, path, item.bytes));
  }
  const bytes = new Uint8Array(Buffer.concat(chunks));
  if (sha256Hex(bytes) !== meta.sha256) throw new RelayError(500, "pdf_corrupt");
  return bytes;
};

export type Meta = { ip: string | null; userAgent: string | null };
const evidence = (meta: Meta, extra: Partial<RelayEvidence> = {}): RelayEvidence => ({
  ip: coarseIp(meta.ip), userAgent: meta.userAgent ? meta.userAgent.slice(0, 300) : null, viewedAt: null, consentHash: null, contentHash: null, site: "tevel.space", ...extra,
});

export const recordView = async (box: Mailbox, opened: Extract<Opened, { ok: true }>, meta: Meta) => {
  if (opened.action || opened.expired || isPreviewBot(meta.userAgent)) return { recorded: false };
  const path = pkgPath(opened.pid, "viewed");
  if (await box.store.get(path)) return { recorded: false };
  const at = new Date().toISOString();
  if ((await putJson(box, path, { at }, false)) === "exists") return { recorded: false };
  await writeEvent(box, { id: randomId(), type: "viewed", at, tokenHash: opened.tokenHash, evidence: evidence(meta, { viewedAt: at }) });
  return { recorded: true };
};

export type SignResult = { ok: true; at: string } | { ok: false; error: string; issues?: FieldIssue[]; reload?: boolean };

const closedMessage = (opened: Extract<Opened, { ok: true }>) =>
  opened.action?.type === "signed" ? "המסמך כבר נחתם" : opened.action?.type === "declined" ? "כבר נמסר שאינך מעוניין/ת. אם זו טעות, אפשר לפנות לעסק." : opened.expired ? "תוקף הקישור פג. אפשר לבקש מהעסק קישור חדש." : null;

export const recordSign = async (box: Mailbox, opened: Extract<Opened, { ok: true }>, body: Record<string, unknown>, meta: Meta): Promise<SignResult> => {
  const closed = closedMessage(opened);
  if (closed) return { ok: false, error: closed };
  const { manifest } = opened;
  if (manifest.mode !== "SIGN") return { ok: false, error: "את המסמך הזה אפשר רק לראות ולהוריד" };
  if (body.consent !== true) return { ok: false, error: "צריך לסמן את האישור לפני החתימה" };
  if (typeof body.contentHash === "string" && manifest.contentHash && body.contentHash !== manifest.contentHash) return { ok: false, error: "המסמך עודכן. מרעננים את הדף…", reload: true };
  const signerName = str(body.signerName, 120).trim() || manifest.signerName;
  if (!signerName) return { ok: false, error: "צריך למלא שם מלא" };
  const values = { ...manifest.values, ...sanitizeValues(manifest.fields, body.values) };
  const issues = validateValues(manifest.fields, values);
  if (issues.length) return { ok: false, error: `חסר: ${issues.map((issue) => issue.label).join(", ")}`, issues };
  const at = new Date().toISOString();
  if ((await putJson(box, pkgPath(opened.pid, "action"), { type: "signed", at, signerName } satisfies RelayAction, false)) === "exists") return { ok: false, error: "המסמך כבר נחתם" };
  const viewed = await getJson<{ at: string }>(box, pkgPath(opened.pid, "viewed")).catch(() => null);
  await writeEvent(box, {
    id: randomId(), type: "signed", at, tokenHash: opened.tokenHash, signerName, values, consent: true,
    evidence: evidence(meta, { viewedAt: viewed?.at ?? null, consentHash: sha256Hex(manifest.consentText), contentHash: manifest.contentHash || null }),
  });
  return { ok: true, at };
};

export const recordDecline = async (box: Mailbox, opened: Extract<Opened, { ok: true }>, body: Record<string, unknown>, meta: Meta): Promise<SignResult> => {
  const closed = closedMessage(opened);
  if (closed) return { ok: false, error: closed };
  if (opened.manifest.mode !== "SIGN") return { ok: false, error: "את המסמך הזה אפשר רק לראות ולהוריד" };
  const at = new Date().toISOString();
  if ((await putJson(box, pkgPath(opened.pid, "action"), { type: "declined", at } satisfies RelayAction, false)) === "exists") return { ok: false, error: "כבר התקבלה תשובה על המסמך" };
  await writeEvent(box, { id: randomId(), type: "declined", at, tokenHash: opened.tokenHash, reason: str(body.reason, 1000).trim(), evidence: evidence(meta) });
  return { ok: true, at };
};
