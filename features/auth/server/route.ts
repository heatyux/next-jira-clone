import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { deleteCookie, setCookie } from 'hono/cookie'
import { ID } from 'node-appwrite'

import { createAdminClient } from '@/lib/appwrite'
import { sessionMiddleware } from '@/lib/session-middleware'

import { AUTH_COOKIE } from '../constants'
import { signInFormSchema, signUpFormSchema } from '../schema'

const app = new Hono()
  .get('/current', sessionMiddleware, async (ctx) => {
    const user = ctx.get('user')

    return ctx.json({ data: user })
  })
  .post('/login', zValidator('json', signInFormSchema), async (ctx) => {
    const { email, password } = ctx.req.valid('json')

    const { account } = await createAdminClient()

    const session = await account.createEmailPasswordSession(email, password)

    setCookie(ctx, AUTH_COOKIE, session.secret, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
    })

    return ctx.json({ success: true })
  })
  .post('/register', zValidator('json', signUpFormSchema), async (ctx) => {
    const { name, email, password } = ctx.req.valid('json')

    const { account } = await createAdminClient()

    await account.create(ID.unique(), email, password, name)

    const session = await account.createEmailPasswordSession(email, password)

    setCookie(ctx, AUTH_COOKIE, session.secret, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return ctx.json({ success: true })
  })
  .post('/logout', sessionMiddleware, async (ctx) => {
    const account = ctx.get('account')

    deleteCookie(ctx, AUTH_COOKIE)
    await account.deleteSession('current')

    return ctx.json({ success: true })
  })

export default app
