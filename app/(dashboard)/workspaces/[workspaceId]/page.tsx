import { redirect } from 'next/navigation'

import { getCurrent } from '@/features/auth/queries'

const WorkspaceIdPage = async () => {
  const user = await getCurrent()

  if (!user) {
    redirect('/sign-in')
  }

  return <>Workspace Id Page</>
}

export default WorkspaceIdPage
