'use server'

import { DATABASE_ID, PROJECTS_ID } from '@/config/db'
import { createSessionClient } from '@/lib/appwrite'

import { getMember } from '../members/utils'
import type { Project } from './types'

type getProjectProps = {
  projectId: string
}

export const getProject = async ({ projectId }: getProjectProps) => {
  try {
    const { account, databases } = await createSessionClient()

    const user = await account.get()

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
      return null
    }

    return project
  } catch {
    return null
  }
}
