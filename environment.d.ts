// This file is needed to support autocomplete for process.env
export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // app base url
      NEXT_PUBLIC_APP_BASE_URL: string

      // appwrite projecty and key
      NEXT_PUBLIC_APPWRITE_PROJECT: string
      NEXT_PUBLIC_APPWRITE_ENDPOINT: string
      NEXT_APPWRITE_KEY: string

      // appwrite database ids
      NEXT_PUBLIC_APPWRITE_DATABASE_ID: string
      NEXT_PUBLIC_APPWRITE_WORKSPACES_ID: string
      NEXT_PUBLIC_APPWRITE_MEMBERS_ID: string

      // appwrite storage ids
      NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID: string
    }
  }
}
