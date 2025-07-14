'use server'

import { cookies } from 'next/headers'
import { Account, Client, Databases, Query } from 'node-appwrite'

import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from '@/config/db'

import { AUTH_COOKIE } from '../auth/constants'
import { getMember } from '../members/utils'
import { Workspace } from './types'

export const getWorkspaces = async () => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT)

    const session = (await cookies()).get(AUTH_COOKIE)

    if (!session) {
      return { documents: [], total: 0 }
    }

    client.setSession(session.value)

    const account = new Account(client)
    const databases = new Databases(client)

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
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT)

    const session = (await cookies()).get(AUTH_COOKIE)

    if (!session) {
      return null
    }

    client.setSession(session.value)

    const account = new Account(client)
    const databases = new Databases(client)

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
