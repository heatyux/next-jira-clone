import { Models } from 'node-appwrite'

export type Workspace = Models.Document & {
  name: string
  imageUrl?: string
  userId: string
  inviteCode: string
}
