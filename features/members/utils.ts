import { type Databases, Query } from 'node-appwrite'

import { DATABASE_ID, MEMBERS_ID } from '@/config/db'

interface GetMemberPrpos {
  databases: Databases
  workspaceId: string
  userId: string
}

export const getMember = async ({
  databases,
  workspaceId,
  userId,
}: GetMemberPrpos) => {
  const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
    Query.equal('workspaceId', workspaceId),
    Query.equal('userId', userId),
  ])

  return members.documents[0]
}
