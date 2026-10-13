import { createCipheriv, createDecipheriv, createHash, createHmac, hkdfSync, randomBytes, timingSafeEqual } from "node:crypto";

// Cloud mailbox crypto (docs: ~/tevel-crm/docs/tevel/public-links-he.md). The CRM has the same code
// (crm-fusion src/server/relay/protocol.ts); a shared test vector keeps both sides identical.
//  - One shared secret (RELAY_SHARED_SECRET, ≥ 32 chars) → three independent keys (HKDF-SHA256).
//  - CRM requests: HMAC-SHA256 over method, path+query, timestamp, nonce and the body's SHA-256.
//  - Everything stored in the blob store is sealed with AES-256-GCM, bound to its path (AAD).
//  - A package is stored under an id derived from the SHA-256 of the customer's token, never the token.

export const TOKEN_RE = /^[A-Za-z0-9_-]{43}$/;
export const PID_RE = /^[a-f0-9]{40}$/;
export const HASH_RE = /^[a-f0-9]{64}$/;

export type RelayKeys = { auth: Buffer; seal: Buffer; ids: Buffer };

export const sha256Hex = (data: string | Uint8Array) => createHash("sha256").update(data).digest("hex");

export const deriveKeys = (secret: string): RelayKeys => {
  const key = (info: string) => Buffer.from(hkdfSync("sha256", Buffer.from(secret, "utf8"), Buffer.from("tevel-relay-v1"), Buffer.from(info), 32));
  return { auth: key("request-auth"), seal: key("blob-at-rest"), ids: key("package-ids") };
};

export const packageId = (keys: RelayKeys, tokenHash: string) => createHmac("sha256", keys.ids).update(tokenHash).digest("hex").slice(0, 40);

export const canonicalRequest = (method: string, pathAndQuery: string, ts: string, nonce: string, bodySha256: string) =>
  ["TEVEL-RELAY-V1", method.toUpperCase(), pathAndQuery, ts, nonce, bodySha256].join("\n");

export const signRequest = (keys: RelayKeys, method: string, pathAndQuery: string, ts: string, nonce: string, body: Uint8Array | string) =>
  createHmac("sha256", keys.auth).update(canonicalRequest(method, pathAndQuery, ts, nonce, sha256Hex(body))).digest("hex");

export const safeEqualHex = (a: string, b: string) => {
  if (!/^[a-f0-9]+$/.test(a) || a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
};

const MAGIC = Buffer.from("TRB1");

export const seal = (keys: RelayKeys, path: string, plain: Uint8Array): Uint8Array => {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", keys.seal, iv);
  cipher.setAAD(Buffer.from(path));
  const body = Buffer.concat([cipher.update(plain), cipher.final()]);
  return new Uint8Array(Buffer.concat([MAGIC, iv, cipher.getAuthTag(), body]));
};

export const open = (keys: RelayKeys, path: string, sealed: Uint8Array): Uint8Array => {
  const data = Buffer.from(sealed);
  if (data.length < 32 || !data.subarray(0, 4).equals(MAGIC)) throw new Error("sealed blob: bad format");
  const decipher = createDecipheriv("aes-256-gcm", keys.seal, data.subarray(4, 16));
  decipher.setAAD(Buffer.from(path));
  decipher.setAuthTag(data.subarray(16, 32));
  return new Uint8Array(Buffer.concat([decipher.update(data.subarray(32)), decipher.final()]));
};

// Evidence keeps a coarse address only: IPv4 → a.b.c.0, IPv6 → the first three groups. The CRM masks it further
// to a.b.c.xxx on the evidence page, exactly like its own page does.
export const coarseIp = (raw: string | null | undefined): string | null => {
  const first = String(raw ?? "").split(",")[0].trim().replace(/^::ffff:/, "");
  const v4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.\d{1,3}$/.exec(first);
  if (v4) return `${v4[1]}.${v4[2]}.${v4[3]}.0`;
  if (/^[0-9a-f:]+$/i.test(first) && first.includes(":")) return `${first.split(":").filter(Boolean).slice(0, 3).join(":")}::`;
  return null;
};

export const randomId = (bytes = 16) => randomBytes(bytes).toString("hex");
