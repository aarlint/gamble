import { Database } from 'bun:sqlite'
import { resolve } from 'path'
import { mkdirSync } from 'fs'
import { dirname } from 'path'

const dbPath = resolve(process.env.DB_PATH || './data/gamble.db')
mkdirSync(dirname(dbPath), { recursive: true })

export const db = new Database(dbPath)
db.exec('PRAGMA journal_mode = WAL')

// Init tables
db.exec(`
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
const existing = db.query('SELECT id FROM jackpot WHERE id = 1').get()
if (!existing) {
  db.run('INSERT INTO jackpot (id, amount, updated_at) VALUES (1, 5000, ?)', [Date.now()])
}
