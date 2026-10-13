import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";

// Where the mailbox keeps its (already encrypted) blobs. Production: Vercel Blob (BLOB_READ_WRITE_TOKEN, a private
// store). Development and tests: a folder (RELAY_STORE=fs, RELAY_FS_DIR). Paths are plain "a/b/c" strings.

export type StoredItem = { path: string; uploadedAt: number; size: number };

export interface RelayStore {
  kind: "blob" | "fs";
  get(path: string): Promise<{ bytes: Uint8Array; uploadedAt: number } | null>;
  // overwrite: false = write-once (returns "exists" when something is already there).
  put(path: string, bytes: Uint8Array, options?: { overwrite?: boolean }): Promise<"ok" | "exists">;
  list(prefix: string): Promise<StoredItem[]>;
  del(paths: string[]): Promise<void>;
}

const SAFE = /^[a-z0-9][a-z0-9/_.-]*$/i;
const checked = (path: string) => {
  if (!SAFE.test(path) || path.includes("..")) throw new Error(`relay store: bad path ${path}`);
  return path;
};

export class FsStore implements RelayStore {
  kind = "fs" as const;
  constructor(private root: string) {}
  private file(path: string) { return join(this.root, ...checked(path).split("/")); }
  async get(path: string) {
    try {
      const file = this.file(path);
      const [bytes, info] = await Promise.all([readFile(file), stat(file)]);
      return { bytes: new Uint8Array(bytes), uploadedAt: info.mtimeMs };
    } catch { return null; }
  }
  async put(path: string, bytes: Uint8Array, options: { overwrite?: boolean } = {}) {
    const file = this.file(path);
    await mkdir(dirname(file), { recursive: true });
    try {
      await writeFile(file, bytes, { flag: options.overwrite === false ? "wx" : "w" });
      return "ok" as const;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "EEXIST") return "exists" as const;
      throw error;
    }
  }
  async list(prefix: string) {
    const out: StoredItem[] = [];
    const walk = async (dir: string) => {
      let entries: import("node:fs").Dirent[] = [];
      try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
      for (const entry of entries) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) await walk(full);
        else {
          const path = relative(this.root, full).split(sep).join("/");
          if (path.startsWith(prefix)) { const info = await stat(full); out.push({ path, uploadedAt: info.mtimeMs, size: info.size }); }
        }
      }
    };
    await walk(this.root);
    return out.sort((a, b) => a.path.localeCompare(b.path));
  }
  async del(paths: string[]) { await Promise.all(paths.map((path) => rm(this.file(path), { force: true }))); }
}

export class VercelBlobStore implements RelayStore {
  kind = "blob" as const;
  constructor(private access: "private" | "public") {}
  async get(path: string) {
    const { get } = await import("@vercel/blob");
    const result = await get(checked(path), { access: this.access, useCache: false });
    if (!result || result.statusCode !== 200) return null;
    return { bytes: new Uint8Array(await new Response(result.stream).arrayBuffer()), uploadedAt: new Date(result.blob.uploadedAt).getTime() };
  }
  async put(path: string, bytes: Uint8Array, options: { overwrite?: boolean } = {}) {
    const { put } = await import("@vercel/blob");
    try {
      await put(checked(path), Buffer.from(bytes), { access: this.access, addRandomSuffix: false, allowOverwrite: options.overwrite !== false, contentType: "application/octet-stream", cacheControlMaxAge: 60 });
      return "ok" as const;
    } catch (error) {
      if (options.overwrite === false && /exist/i.test(String((error as Error)?.message))) return "exists" as const;
      throw error;
    }
  }
  async list(prefix: string) {
    const { list } = await import("@vercel/blob");
    const out: StoredItem[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix, cursor, limit: 1000 });
      out.push(...page.blobs.map((blob) => ({ path: blob.pathname, uploadedAt: new Date(blob.uploadedAt).getTime(), size: blob.size })));
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return out;
  }
  async del(paths: string[]) {
    if (!paths.length) return;
    const { del } = await import("@vercel/blob");
    for (let index = 0; index < paths.length; index += 500) await del(paths.slice(index, index + 500).map(checked));
  }
}

let cached: RelayStore | null = null;
export const relayStore = (): RelayStore | null => {
  if (cached) return cached;
  if (process.env.RELAY_STORE === "fs") cached = new FsStore(process.env.RELAY_FS_DIR || join(process.cwd(), ".relay-store"));
  else if (process.env.BLOB_READ_WRITE_TOKEN) cached = new VercelBlobStore(process.env.RELAY_BLOB_ACCESS === "public" ? "public" : "private");
  return cached;
};
export const setRelayStoreForTests = (store: RelayStore | null) => { cached = store; };
