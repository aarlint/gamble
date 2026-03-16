import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  startingPot: integer('starting_pot').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const spinHistory = sqliteTable('spin_history', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull(),
  gameId: text('game_id').notNull(),
  bet: real('bet').notNull(),
  win: real('win').notNull(),
  net: real('net').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const jackpotTable = sqliteTable('jackpot', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  amount: real('amount').notNull().default(5000),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})
