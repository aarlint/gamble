import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { db } from './db'
import { jackpotTable, spinHistory } from './schema'
import { eq, desc } from 'drizzle-orm'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const app = new Hono()

// API routes
app.get('/api/health', (c) => c.json({ status: 'ok' }))

app.get('/api/jackpot', async (c) => {
  const rows = await db.select().from(jackpotTable).where(eq(jackpotTable.id, 1))
  return c.json({ amount: rows[0]?.amount ?? 5000 })
})

app.post('/api/jackpot', async (c) => {
  const { amount } = await c.req.json<{ amount: number }>()
  if (typeof amount !== 'number' || amount < 0) {
    return c.json({ error: 'Invalid amount' }, 400)
  }
  await db
    .update(jackpotTable)
    .set({ amount, updatedAt: new Date() })
    .where(eq(jackpotTable.id, 1))
  return c.json({ ok: true })
})

app.post('/api/spins', async (c) => {
  const body = await c.req.json()
  const { id, sessionId, gameId, bet, win, net } = body
  await db.insert(spinHistory).values({
    id,
    sessionId,
    gameId,
    bet,
    win,
    net,
    createdAt: new Date(),
  })
  return c.json({ ok: true })
})

app.get('/api/stats', async (c) => {
  const recent = await db
    .select()
    .from(spinHistory)
    .orderBy(desc(spinHistory.createdAt))
    .limit(100)
  return c.json({ spins: recent })
})

// Serve static files from dist/
app.use('/*', serveStatic({ root: './dist' }))

// SPA fallback
app.get('*', (c) => {
  try {
    const html = readFileSync(resolve('./dist/index.html'), 'utf-8')
    return c.html(html)
  } catch {
    return c.text('Build not found. Run: bun run build', 404)
  }
})

const port = Number(process.env.PORT) || 3000
console.log(`Gamble server running on port ${port}`)

export default {
  port,
  fetch: app.fetch,
}
