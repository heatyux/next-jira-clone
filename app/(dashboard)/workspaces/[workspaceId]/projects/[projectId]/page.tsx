import { Pencil } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { getCurrent } from '@/features/auth/queries'
import { ProjectAvatar } from '@/features/projects/components/project-avatar'
import { getProject } from '@/features/projects/queries'
import { TaskViewSwitcher } from '@/features/tasks/components/task-view-switcher'

type ProjectIdPageProps = {
  params: Promise<{
    projectId: string
  }>
}

const ProjectIdPage = async ({ params }: ProjectIdPageProps) => {
  const user = await getCurrent()

  if (!user) {
    redirect('/sign-in')
  }

  const { projectId } = await params

  const project = await getProject({ projectId })

  if (!project) {
    notFound()
  }

  const projectSettingLink = `/workspaces/${project.workspaceId}/projects/${project.$id}/settings`

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-8"
          />
          <p className="text-lg font-semibold">{project.name}</p>
        </div>

        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link href={projectSettingLink}>
              <Pencil className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>

      <TaskViewSwitcher projectId={projectId} hideProjectFilter />
    </div>
  )
}

export default ProjectIdPage
