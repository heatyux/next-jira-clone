import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'nodejs'

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({ message: 'Hello from Hono!' })
})

app.get('/project/:projectId', (ctx) => {
  const { projectId } = ctx.req.param()
  return ctx.json({ projectId })
})

export const GET = handle(app)
