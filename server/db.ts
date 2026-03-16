import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import { resolve } from 'path'

const dbPath = resolve(process.env.DB_PATH || './data/gamble.db')

// Ensure data directory exists
import { mkdirSync } from 'fs'
import { dirname } from 'path'
mkdirSync(dirname(dbPath), { recursive: true })

const sqlite = new Database(dbPath)
sqlite.pragma('journal_mode = WAL')

export const db = drizzle(sqlite, { schema })

// Init tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    starting_pot INTEGER NOT NULL,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS spin_history (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    game_id TEXT NOT NULL,
    bet REAL NOT NULL,
    win REAL NOT NULL,
    net REAL NOT NULL,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS jackpot (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL DEFAULT 5000,
    updated_at INTEGER NOT NULL
  );
`)

// Ensure jackpot row exists
const existing = sqlite.prepare('SELECT id FROM jackpot WHERE id = 1').get()
if (!existing) {
  sqlite.prepare('INSERT INTO jackpot (id, amount, updated_at) VALUES (1, 5000, ?)').run(Date.now())
}
