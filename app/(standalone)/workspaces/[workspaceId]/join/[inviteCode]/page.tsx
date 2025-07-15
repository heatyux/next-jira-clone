import { redirect } from 'next/navigation'

import { getCurrent } from '@/features/auth/queries'
import { JoinWorkspaceForm } from '@/features/workspaces/components/join-workspace-form'
import { getWorkspaceInfo } from '@/features/workspaces/queries'

type WorkspaceIdJoinPageProps = {
  params: Promise<{ workspaceId: string }>
}

const WorkspaceIdJoinPage = async ({ params }: WorkspaceIdJoinPageProps) => {
  const user = await getCurrent()

  if (!user) {
    redirect('/sign-in')
  }

  const { workspaceId } = await params

  const workspace = await getWorkspaceInfo({ workspaceId })

  if (!workspace) {
    redirect('/')
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValues={workspace} />
    </div>
  )
}

export default WorkspaceIdJoinPage
