import { Hono } from 'hono'
import { handle } from 'hono/vercel'

import auth from '@/features/auth/server/route'
import members from '@/features/members/server/route'
import projects from '@/features/projects/server/route'
import tasks from '@/features/tasks/server/route'
import workspaces from '@/features/workspaces/server/route'

export const runtime = 'nodejs'

const app = new Hono().basePath('/api')

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route('/auth', auth)
  .route('/workspaces', workspaces)
  .route('/members', members)
  .route('/projects', projects)
  .route('/tasks', tasks)

export type AppType = typeof routes

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)
