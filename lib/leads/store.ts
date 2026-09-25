/**
 * Where leads are kept. Server only.
 *
 * - DATABASE_URL set (a Neon Postgres connection string): one table, mt_leads,
 *   created on first use. This is what production should run on.
 * - Otherwise a JSON file (LEADS_FILE, default .data/leads.json). Fine for
 *   local work; on the host it can be wiped by a redeploy, which the dashboard
 *   warns about.
 *
 * Every write is a read-modify-write of one lead, serialised per lead inside
 * this process, so two saves from the same visitor can't overwrite each other.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import type { Lead } from "./types";

export type StoreKind = "postgres" | "file";

export function storeKind(): StoreKind {
  return process.env.DATABASE_URL ? "postgres" : "file";
}

// ---------------------------------------------------------------- Postgres

let schema: Promise<void> | null = null;

function db() {
  return neon(process.env.DATABASE_URL as string);
}

function ensureSchema(): Promise<void> {
  schema ??= (async () => {
    const sql = db();
    await sql`
      CREATE TABLE IF NOT EXISTS mt_leads (
        id         TEXT PRIMARY KEY,
        updated_at TIMESTAMPTZ NOT NULL,
        data       JSONB       NOT NULL
      )`;
    await sql`CREATE INDEX IF NOT EXISTS mt_leads_updated_at ON mt_leads (updated_at DESC)`;
  })().catch((err) => {
    schema = null; // try again on the next request rather than failing forever
    throw err;
  });
  return schema;
}

const pg = {
  async get(id: string): Promise<Lead | null> {
    await ensureSchema();
    const rows = await db()`SELECT data FROM mt_leads WHERE id = ${id}`;
    return (rows[0]?.data as Lead) ?? null;
  },
  async put(lead: Lead): Promise<void> {
    await ensureSchema();
    await db()`
      INSERT INTO mt_leads (id, updated_at, data)
      VALUES (${lead.id}, ${lead.updatedAt}, ${JSON.stringify(lead)}::jsonb)
      ON CONFLICT (id) DO UPDATE SET updated_at = EXCLUDED.updated_at, data = EXCLUDED.data`;
  },
  async list(limit: number): Promise<Lead[]> {
    await ensureSchema();
    const rows = await db()`SELECT data FROM mt_leads ORDER BY updated_at DESC LIMIT ${limit}`;
    return rows.map((r) => r.data as Lead);
  },
  async remove(id: string): Promise<void> {
    await ensureSchema();
    await db()`DELETE FROM mt_leads WHERE id = ${id}`;
  },
};

// ---------------------------------------------------------------- JSON file

/** Oldest leads past this are dropped from the file (never from Postgres). */
const FILE_CAP = 5000;

/*
 * The parsed file is cached, keyed by its modified time. Pages and API routes
 * can each get their own copy of this module (and a host may run more than one
 * process), so the cache is only trusted while the file on disk is unchanged.
 */
let cache: { mtime: number; map: Map<string, Lead> } | null = null;
let writing: Promise<void> = Promise.resolve();

function filePath() {
  return process.env.LEADS_FILE || path.join(process.cwd(), ".data", "leads.json");
}

async function mtimeOf(file: string): Promise<number> {
  try {
    return (await fs.stat(file)).mtimeMs;
  } catch {
    return 0;
  }
}

async function load(): Promise<Map<string, Lead>> {
  const file = filePath();
  const mtime = await mtimeOf(file);
  if (cache && cache.mtime === mtime) return cache.map;
  let map = new Map<string, Lead>();
  try {
    const list = JSON.parse(await fs.readFile(file, "utf8")) as Lead[];
    map = new Map(list.map((l) => [l.id, l]));
  } catch {
    /* no file yet (or unreadable): start empty */
  }
  cache = { mtime, map };
  return map;
}

/** Re-reads the file, applies `change`, writes it back. Queued, and written via a temp file so a crash never leaves half a file. */
function mutate(change: (map: Map<string, Lead>) => boolean): Promise<void> {
  writing = writing
    .catch(() => {})
    .then(async () => {
      const map = new Map(await load());
      if (!change(map)) return;
      const list = [...map.values()].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)).slice(0, FILE_CAP);
      const file = filePath();
      await fs.mkdir(path.dirname(file), { recursive: true });
      const tmp = `${file}.${process.pid}.tmp`;
      await fs.writeFile(tmp, JSON.stringify(list));
      await fs.rename(tmp, file);
      cache = { mtime: await mtimeOf(file), map: new Map(list.map((l) => [l.id, l])) };
    });
  return writing;
}

const file = {
  async get(id: string): Promise<Lead | null> {
    const lead = (await load()).get(id);
    return lead ? structuredClone(lead) : null;
  },
  async put(lead: Lead): Promise<void> {
    await mutate((map) => {
      map.set(lead.id, structuredClone(lead));
      return true;
    });
  },
  async list(limit: number): Promise<Lead[]> {
    return [...(await load()).values()]
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
      .slice(0, limit)
      .map((l) => structuredClone(l));
  },
  async remove(id: string): Promise<void> {
    await mutate((map) => map.delete(id));
  },
};

// ---------------------------------------------------------------- public API

function backend() {
  return storeKind() === "postgres" ? pg : file;
}

const locks = new Map<string, Promise<unknown>>();

/**
 * Read a lead, change it, write it back, one change at a time per lead.
 * `change` returns the new lead, or null to leave the store untouched.
 */
export async function updateLead(id: string, change: (prev: Lead | null) => Lead | null): Promise<Lead | null> {
  const before = locks.get(id) ?? Promise.resolve();
  const run = before.catch(() => {}).then(async () => {
    const next = change(await backend().get(id));
    if (next) await backend().put(next);
    return next;
  });
  locks.set(id, run);
  try {
    return await run;
  } finally {
    if (locks.get(id) === run) locks.delete(id);
  }
}

export function getLead(id: string): Promise<Lead | null> {
  return backend().get(id);
}

export function listLeads(limit = 3000): Promise<Lead[]> {
  return backend().list(limit);
}

export function deleteLead(id: string): Promise<void> {
  return backend().remove(id);
}
