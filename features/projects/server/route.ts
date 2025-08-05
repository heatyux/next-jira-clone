import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { ID, Query } from 'node-appwrite'
import { z } from 'zod'

import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from '@/config/db'
import { getMember } from '@/features/members/utils'
import { sessionMiddleware } from '@/lib/session-middleware'

import { createProjectSchema, updateProjectSchema } from '../schema'
import { Project } from '../types'

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
  .get('/:projectId', sessionMiddleware, async (ctx) => {
    const databases = ctx.get('databases')
    const user = ctx.get('user')

    const { projectId } = ctx.req.param()

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId,
    )

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id,
    })

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401)
    }

    return ctx.json({ data: project })
  })
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
  .patch(
    '/:projectId',
    sessionMiddleware,
    zValidator('form', updateProjectSchema),
    async (ctx) => {
      const databases = ctx.get('databases')
      const storage = ctx.get('storage')
      const user = ctx.get('user')

      const { projectId } = ctx.req.param()
      const { name, image } = ctx.req.valid('form')

      const existingProject = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
      )

      const member = await getMember({
        databases,
        workspaceId: existingProject.workspaceId,
        userId: user.$id,
      })

      if (!member) {
        return ctx.json({ error: 'Unauthorized.' }, 401)
      }

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

      const project = await databases.updateDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
        {
          name,
          imageUrl: uploadedImageUrl,
        },
      )

      return ctx.json({ data: project })
    },
  )
  .delete('/:projectId', sessionMiddleware, async (ctx) => {
    const databases = ctx.get('databases')
    const user = ctx.get('user')

    const { projectId } = ctx.req.param()

    const existingProject = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId,
    )

    const member = await getMember({
      databases,
      workspaceId: existingProject.workspaceId,
      userId: user.$id,
    })

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401)
    }

    // TODO: delete tasks

    await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId)

    return ctx.json({
      data: {
        $id: existingProject.$id,
        workspaceId: existingProject.workspaceId,
      },
    })
  })

export default app
