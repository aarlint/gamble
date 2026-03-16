import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { db } from './db'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const app = new Hono()

// API routes
app.get('/api/health', (c) => c.json({ status: 'ok' }))

app.get('/api/jackpot', (c) => {
  const row = db.query('SELECT amount FROM jackpot WHERE id = 1').get() as { amount: number } | null
  return c.json({ amount: row?.amount ?? 5000 })
})

app.post('/api/jackpot', async (c) => {
  const { amount } = await c.req.json<{ amount: number }>()
  if (typeof amount !== 'number' || amount < 0) {
    return c.json({ error: 'Invalid amount' }, 400)
  }
  db.run('UPDATE jackpot SET amount = ?, updated_at = ? WHERE id = 1', [amount, Date.now()])
  return c.json({ ok: true })
})

app.post('/api/spins', async (c) => {
  const { id, sessionId, gameId, bet, win, net } = await c.req.json()
  db.run(
    'INSERT INTO spin_history (id, session_id, game_id, bet, win, net, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, sessionId, gameId, bet, win, net, Date.now()]
  )
  return c.json({ ok: true })
})

app.get('/api/stats', (c) => {
  const spins = db.query('SELECT * FROM spin_history ORDER BY created_at DESC LIMIT 100').all()
  return c.json({ spins })
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
