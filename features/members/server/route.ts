import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { Query } from 'node-appwrite'
import { z } from 'zod'

import { DATABASE_ID, MEMBERS_ID } from '@/config/db'
import { createAdminClient } from '@/lib/appwrite'
import { sessionMiddleware } from '@/lib/session-middleware'

import { getMember } from '../utils'

const app = new Hono().get(
  '/',
  sessionMiddleware,
  zValidator(
    'query',
    z.object({
      workspaceId: z.string(),
    }),
  ),
  async (ctx) => {
    const { users } = await createAdminClient()
    const databases = ctx.get('databases')
    const user = ctx.get('user')
    const { workspaceId } = ctx.req.valid('query')

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    })

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401)
    }

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal('workspaceId', workspaceId),
    ])

    const populatedMembers = await Promise.all(
      members.documents.map(async (member) => {
        const user = await users.get(member.userId)

        return {
          ...member,
          name: user.name,
          email: user.email,
        }
      }),
    )

    return ctx.json({
      data: {
        ...members,
        documents: populatedMembers,
      },
    })
  },
)

export default app
