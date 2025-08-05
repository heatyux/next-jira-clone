import { ChevronRight, Trash } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { ProjectAvatar } from '@/features/projects/components/project-avatar'
import type { Project } from '@/features/projects/types'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { useConfirm } from '@/hooks/use-confirm'

import { useDeleteTask } from '../api/use-delete-task'
import type { Task } from '../types'

interface TaskBreadcrumbsProps {
  project: Project
  task: Task
}

export const TaskBreadcrumbs = ({ project, task }: TaskBreadcrumbsProps) => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  const [ConfirmDialog, confirm] = useConfirm(
    'Delet task?',
    'This action cannot be undone.',
    'destructive',
  )

  const { mutate: deleteTask, isPending } = useDeleteTask()

  const handleDeleteTask = async () => {
    const ok = await confirm()

    if (!ok) return

    deleteTask(
      { param: { taskId: task.$id } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}/tasks`)
        },
      },
    )
  }

  return (
    <div className="flex items-center gap-x-2">
      <ProjectAvatar
        name={project.name}
        image={project.imageUrl}
        className="size-6 lg:size-8"
      />

      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project.name}
        </p>
      </Link>

      <ChevronRight className="size-4 lg:size-5 text-muted-foreground" />

      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>

      <Button
        disabled={isPending}
        variant="destructive"
        size="sm"
        className="ml-auto"
        onClick={handleDeleteTask}
      >
        <Trash className="size-4 ml-2" />
        <span className="hidden lg:block">Delete task</span>
      </Button>

      <ConfirmDialog />
    </div>
  )
}
