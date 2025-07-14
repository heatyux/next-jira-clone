import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { ID, Query } from 'node-appwrite'

import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  WORKSPACES_ID,
} from '@/config/db'
import { MemberRole } from '@/features/members/types'
import { getMember } from '@/features/members/utils'
import { sessionMiddleware } from '@/lib/session-middleware'
import { generateInviteCode } from '@/lib/utils'

import { createWorkspaceSchema, updateWorkspaceSchema } from '../schema'

const app = new Hono()
  .get('/', sessionMiddleware, async (ctx) => {
    const database = ctx.get('databases')
    const user = ctx.get('user')
    const members = await database.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal('userId', user.$id),
    ])

    if (members.total === 0) {
      return ctx.json({ data: { documents: [], total: 0 } })
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId)

    const workspaces = await database.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.contains('$id', workspaceIds), Query.orderDesc('$createdAt')],
    )

    return ctx.json({ data: workspaces })
  })
  .post(
    '/',
    zValidator('form', createWorkspaceSchema),
    sessionMiddleware,
    async (ctx) => {
      const database = ctx.get('databases')
      const storage = ctx.get('storage')
      const user = ctx.get('user')

      const { name, image } = ctx.req.valid('form')

      let uploadedImageUrl: string | undefined

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image,
        )

        const arrayBuffer = await storage.getFileView(
          IMAGES_BUCKET_ID,
          file.$id,
        )

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`
      }

      const workspace = await database.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
          inviteCode: generateInviteCode(6),
        },
      )

      await database.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        workspaceId: workspace.$id,
        userId: user.$id,
        role: MemberRole.ADMIN,
      })

      return ctx.json({ data: workspace })
    },
  )
  .patch(
    '/:workspaceId',
    sessionMiddleware,
    zValidator('form', updateWorkspaceSchema),
    async (ctx) => {
      const databases = ctx.get('databases')
      const storage = ctx.get('storage')
      const user = ctx.get('user')

      const { workspaceId } = ctx.req.param()
      const { name, image } = ctx.req.valid('form')

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      })

      if (!member || member.role !== MemberRole.ADMIN) {
        return ctx.json({ error: 'Unauthorized' }, 401)
      }

      let uploadedImageUrl: string | undefined

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image,
        )

        const arrayBuffer = await storage.getFileView(
          IMAGES_BUCKET_ID,
          file.$id,
        )

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`
      }
      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          name,
          iamgeUrl: uploadedImageUrl,
        },
      )

      return ctx.json({ data: workspace })
    },
  )

export default app
