import { notFound, redirect } from 'next/navigation'

import { getCurrent } from '@/features/auth/queries'
import { EditProjectForm } from '@/features/projects/components/edit-project-form'
import { getProject } from '@/features/projects/queries'

type ProjectIdSettingsPageProps = {
  params: Promise<{
    projectId: string
  }>
}

const ProjectIdSettingsPage = async ({
  params,
}: ProjectIdSettingsPageProps) => {
  const user = await getCurrent()

  if (!user) {
    redirect('/sign-in')
  }

  const { projectId } = await params

  const project = await getProject({ projectId })

  if (!project) {
    notFound()
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={project} />
    </div>
  )
}

export default ProjectIdSettingsPage
