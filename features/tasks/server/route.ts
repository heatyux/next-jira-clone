import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { ID, Query } from 'node-appwrite'
import { z } from 'zod'

import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from '@/config/db'
import { getMember } from '@/features/members/utils'
import { Project } from '@/features/projects/types'
import { createAdminClient } from '@/lib/appwrite'
import { sessionMiddleware } from '@/lib/session-middleware'

import { createTaskSchema } from '../schema'
import { TaskStatus } from '../types'

const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator(
      'query',
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      }),
    ),
    async (ctx) => {
      const { users } = await createAdminClient()
      const databases = ctx.get('databases')
      const user = ctx.get('user')

      const { workspaceId, projectId, assigneeId, status, search, dueDate } =
        ctx.req.valid('query')

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      })

      if (!member) {
        return ctx.json({ error: 'Unauthorized.' }, 401)
      }

      const query = [
        Query.equal('workspaceId', workspaceId),
        Query.orderDesc('$createdAt'),
      ]

      if (projectId) {
        query.push(Query.equal('projectId', projectId))
      }

      if (assigneeId) {
        query.push(Query.equal('assigneeId', assigneeId))
      }

      if (status) {
        query.push(Query.equal('status', status))
      }

      if (dueDate) {
        query.push(Query.equal('dueDate', dueDate))
      }

      if (search) {
        query.push(Query.search('name', search))
      }

      const tasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, query)

      const projectIds = tasks.documents.map((task) => task.projectId)
      const assigneeIds = tasks.documents.map((task) => task.assigneeId)

      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectIds.length > 0 ? [Query.contains('$id', projectIds)] : [],
      )

      const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeIds.length > 0 ? [Query.contains('$id', assigneeIds)] : [],
      )

      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.$id)

          return {
            ...member,
            name: user.name,
            email: user.email,
          }
        }),
      )

      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find(
          (project) => project.$id === task.projectId,
        )
        const assignee = assignees.find(
          (assignee) => assignee.$id === task.assigneeId,
        )

        return {
          ...task,
          project,
          assignee,
        }
      })

      return ctx.json({
        data: {
          ...tasks,
          documents: populatedTasks,
        },
      })
    },
  )
  .post(
    '/',
    sessionMiddleware,
    zValidator('json', createTaskSchema),
    async (ctx) => {
      const databases = ctx.get('databases')
      const user = ctx.get('user')

      const { name, status, workspaceId, projectId, dueDate, assigneeId } =
        ctx.req.valid('json')

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      })

      if (!member) {
        return ctx.json({ error: 'Unauthorized' }, 401)
      }

      const highestPositionTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal('status', status),
          Query.equal('projectId', projectId),
          Query.orderAsc('position'),
          Query.limit(1),
        ],
      )

      const newPosition =
        highestPositionTask.documents.length > 0
          ? highestPositionTask.documents[0].position + 1000
          : 1000

      const task = await databases.createDocument(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          name,
          status,
          workspaceId,
          projectId,
          dueDate,
          assigneeId,
          position: newPosition,
        },
      )

      return ctx.json({ data: task })
    },
  )

export default app
