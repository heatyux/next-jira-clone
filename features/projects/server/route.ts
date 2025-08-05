import { zValidator } from '@hono/zod-validator'
import { endOfMonth, startOfMonth, subMonths } from 'date-fns'
import { Hono } from 'hono'
import { ID, Query } from 'node-appwrite'
import { z } from 'zod'

import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  PROJECTS_ID,
  TASKS_ID,
} from '@/config/db'
import { getMember } from '@/features/members/utils'
import { Task, TaskStatus } from '@/features/tasks/types'
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
  .get('/:projectId/analytics', sessionMiddleware, async (ctx) => {
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

    const now = new Date()
    const thisMonthStart = startOfMonth(now)
    const thisMonthEnd = endOfMonth(now)
    const lastMonthStart = startOfMonth(subMonths(now, 1))
    const lastMonthEnd = endOfMonth(subMonths(now, 1))

    const thisMonthTasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal('projectId', projectId),
        Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
      ],
    )

    const lastMonthTasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal('projectId', projectId),
        Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
      ],
    )

    const taskCount = thisMonthTasks.total
    const taskDifference = taskCount - lastMonthTasks.total

    const thisMonthAssignedTasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal('projectId', projectId),
        Query.equal('assigneeId', member.$id),
        Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
      ],
    )

    const lastMonthAssignedTasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal('projectId', projectId),
        Query.equal('assigneeId', member.$id),
        Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
      ],
    )

    const assignedTaskCount = thisMonthAssignedTasks.total
    const assignedTaskDifference =
      assignedTaskCount - lastMonthAssignedTasks.total

    const thisMonthIncompleteTasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal('projectId', projectId),
        Query.notEqual('status', TaskStatus.DONE),
        Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
      ],
    )

    const lastMonthIncompleteTasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal('projectId', projectId),
        Query.notEqual('status', TaskStatus.DONE),
        Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
      ],
    )

    const incompleteTaskCount = thisMonthIncompleteTasks.total
    const incompleteTaskDifference =
      incompleteTaskCount - lastMonthIncompleteTasks.total

    const thisMonthCompletedTasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal('projectId', projectId),
        Query.equal('status', TaskStatus.DONE),
        Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
      ],
    )

    const lastMonthCompletedTasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal('projectId', projectId),
        Query.equal('status', TaskStatus.DONE),
        Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
      ],
    )

    const completedTaskCount = thisMonthCompletedTasks.total
    const completedTaskDifference =
      completedTaskCount - lastMonthCompletedTasks.total

    const thisMonthOverdueTasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal('projectId', projectId),
        Query.notEqual('status', TaskStatus.DONE),
        Query.lessThan('dueDate', now.toISOString()),
        Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
      ],
    )

    const lastMonthOverdueTasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal('projectId', projectId),
        Query.notEqual('status', TaskStatus.DONE),
        Query.lessThan('dueDate', now.toISOString()),
        Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
      ],
    )

    const overdueTaskCount = thisMonthOverdueTasks.total
    const overdueTaskDifference = overdueTaskCount - lastMonthOverdueTasks.total

    return ctx.json({
      data: {
        taskCount,
        taskDifference,
        assignedTaskCount,
        assignedTaskDifference,
        incompleteTaskCount,
        incompleteTaskDifference,
        completedTaskCount,
        completedTaskDifference,
        overdueTaskCount,
        overdueTaskDifference,
      },
    })
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
