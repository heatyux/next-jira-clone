import { zValidator } from '@hono/zod-validator'
import { endOfMonth, startOfMonth, subMonths } from 'date-fns'
import { Hono } from 'hono'
import { ID, Query } from 'node-appwrite'
import { z } from 'zod'

import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  PROJECTS_ID,
  TASKS_ID,
  WORKSPACES_ID,
} from '@/config/db'
import { type Member, MemberRole } from '@/features/members/types'
import { getMember } from '@/features/members/utils'
import type { Project } from '@/features/projects/types'
import { type Task, TaskStatus } from '@/features/tasks/types'
import { sessionMiddleware } from '@/lib/session-middleware'
import { generateInviteCode } from '@/lib/utils'

import { createWorkspaceSchema, updateWorkspaceSchema } from '../schema'
import type { Workspace } from '../types'

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
  .get('/:workspaceId', sessionMiddleware, async (ctx) => {
    const databases = ctx.get('databases')
    const user = ctx.get('user')

    const { workspaceId } = ctx.req.param()

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    })

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401)
    }

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
    )

    return ctx.json({ data: workspace })
  })
  .get('/:workspaceId/info', sessionMiddleware, async (ctx) => {
    const databases = ctx.get('databases')

    const { workspaceId } = ctx.req.param()

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
    )

    return ctx.json({
      data: {
        $id: workspace.$id,
        name: workspace.name,
      },
    })
  })
  .get('/:workspaceId/analytics', sessionMiddleware, async (ctx) => {
    const databases = ctx.get('databases')
    const user = ctx.get('user')

    const { workspaceId } = ctx.req.param()

    const member = await getMember({
      databases,
      workspaceId,
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
        Query.equal('workspaceId', workspaceId),
        Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
      ],
    )

    const lastMonthTasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal('workspaceId', workspaceId),
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
        Query.equal('workspaceId', workspaceId),
        Query.equal('assigneeId', member.$id),
        Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
      ],
    )

    const lastMonthAssignedTasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal('workspaceId', workspaceId),
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
        Query.equal('workspaceId', workspaceId),
        Query.notEqual('status', TaskStatus.DONE),
        Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
      ],
    )

    const lastMonthIncompleteTasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal('workspaceId', workspaceId),
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
        Query.equal('workspaceId', workspaceId),
        Query.equal('status', TaskStatus.DONE),
        Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
      ],
    )

    const lastMonthCompletedTasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal('workspaceId', workspaceId),
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
        Query.equal('workspaceId', workspaceId),
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
        Query.equal('workspaceId', workspaceId),
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
    zValidator('form', createWorkspaceSchema),
    sessionMiddleware,
    async (ctx) => {
      const database = ctx.get('databases')
      const storage = ctx.get('storage')
      const user = ctx.get('user')

      const { name, image } = ctx.req.valid('form')

      let uploadedImageUrl: string | undefined

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
      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          name,
          imageUrl: uploadedImageUrl,
        },
      )

      return ctx.json({ data: workspace })
    },
  )
  .delete('/:workspaceId', sessionMiddleware, async (ctx) => {
    const databases = ctx.get('databases')
    const user = ctx.get('user')

    const { workspaceId } = ctx.req.param()

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    })

    if (!member || member.role !== MemberRole.ADMIN) {
      return ctx.json({ error: 'Unauthorized.' }, 401)
    }

    // Delete members, projects and tasks.
    const members = await databases.listDocuments<Member>(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal('workspaceId', workspaceId)],
    )

    const projects = await databases.listDocuments<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      [Query.equal('workspaceId', workspaceId)],
    )

    const tasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
      Query.equal('workspaceId', workspaceId),
    ])

    for (const member of members.documents) {
      await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, member.$id)
    }

    for (const project of projects.documents) {
      await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, project.$id)
    }

    for (const task of tasks.documents) {
      await databases.deleteDocument(DATABASE_ID, TASKS_ID, task.$id)
    }

    await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId)

    return ctx.json({ data: { $id: workspaceId } })
  })
  .post('/:workspaceId/resetInviteCode', sessionMiddleware, async (ctx) => {
    const databases = ctx.get('databases')
    const user = ctx.get('user')

    const { workspaceId } = ctx.req.param()

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    })

    if (!member || member.role !== MemberRole.ADMIN) {
      return ctx.json({ error: 'Unauthorized.' }, 401)
    }

    const workspace = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
      {
        inviteCode: generateInviteCode(6),
      },
    )

    return ctx.json({ data: workspace })
  })
  .post(
    '/:workspaceId/join',
    sessionMiddleware,
    zValidator(
      'json',
      z.object({
        code: z.string(),
      }),
    ),
    async (ctx) => {
      const databases = ctx.get('databases')
      const user = ctx.get('user')

      const { workspaceId } = ctx.req.param()
      const { code } = ctx.req.valid('json')

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      })

      if (member) {
        return ctx.json({ error: 'Already a member.' }, 400)
      }

      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
      )

      if (workspace.inviteCode !== code) {
        return ctx.json({ error: 'Invalid code.' }, 400)
      }

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        workspaceId,
        userId: user.$id,
        role: MemberRole.MEMBER,
      })

      return ctx.json({ data: workspace })
    },
  )

export default app
