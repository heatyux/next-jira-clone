'use server'

import { Query } from 'node-appwrite'

import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from '@/config/db'
import { createSessionClient } from '@/lib/appwrite'

import { getMember } from '../members/utils'
import { Workspace } from './types'

export const getWorkspaces = async () => {
  try {
    const { account, databases } = await createSessionClient()

    const user = await account.get()
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal('userId', user.$id),
    ])

    if (members.total === 0) {
      return { documents: [], total: 0 }
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId)

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.contains('$id', workspaceIds), Query.orderDesc('$createdAt')],
    )

    return workspaces
  } catch {
    return { documents: [], total: 0 }
  }
}

type GetWorkspaceProps = {
  workspaceId: string
}

export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps) => {
  try {
    const { account, databases } = await createSessionClient()

    const user = await account.get()
    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    })

    if (!member) {
      return null
    }

    const workspace = await databases.getDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
    )

    return workspace as Workspace
  } catch {
    return null
  }
}
