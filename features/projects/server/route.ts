import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { ID, Query } from 'node-appwrite'
import { z } from 'zod'

import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from '@/config/db'
import { getMember } from '@/features/members/utils'
import { sessionMiddleware } from '@/lib/session-middleware'

import { createProjectSchema } from '../schema'

const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator(
      'query',
      z.object({
        workspaceId: z.string(),
      }),
    ),
    async (ctx) => {
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

      const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
        Query.equal('workspaceId', workspaceId),
        Query.orderDesc('$createdAt'),
      ])

      return ctx.json({ data: projects })
    },
  )
  .post(
    '/',
    sessionMiddleware,
    zValidator('form', createProjectSchema),
    async (ctx) => {
      const databases = ctx.get('databases')
      const storage = ctx.get('storage')

      const { name, image, workspaceId } = ctx.req.valid('form')

      let uploadedImageUrl: undefined | string

      if (image instanceof File) {
        const fileExt = image.name.split('.').at(-1) ?? 'png'
        const fileName = `${ID.unique()}.${fileExt}`
        const renamedImage = new File([image], fileName, {
          type: image.type,
        })

        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          renamedImage,
        )

        const arrayBuffer = await storage.getFileView(
          IMAGES_BUCKET_ID,
          file.$id,
        )

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`
      }

      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        {
          name,
          workspaceId,
          imageUrl: uploadedImageUrl,
        },
      )

      return ctx.json({ data: project })
    },
  )

export default app
