'use client'

import { PropsWithChildren } from 'react'

import { ExternalLink, PencilIcon, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { useConfirm } from '@/hooks/use-confirm'

import { useDeleteTask } from '../api/use-delete-task'
import { useEditTaskModal } from '../hooks/use-edit-task-modal'

interface TaskActionsProps {
  id: string
  projectId: string
}

export const TaskActions = ({
  id,
  projectId,
  children,
}: PropsWithChildren<TaskActionsProps>) => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  const { open } = useEditTaskModal()

  const [ConfirmDialog, confirm] = useConfirm(
    'Delete task',
    'This action cannot be undone.',
    'destructive',
  )

  const { mutate: deleteTask, isPending } = useDeleteTask()

  const onDelete = async () => {
    const ok = await confirm()

    if (!ok) return

    deleteTask({ param: { taskId: id } })
  }

  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`)
  }

  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`)
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            disabled={isPending}
            className="font-medium p-[10px]"
            onClick={onOpenTask}
          >
            <ExternalLink className="size-4 mr-2 stroke-2" />
            Task Detail
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isPending}
            className="font-medium p-[10px]"
            onClick={onOpenProject}
          >
            <ExternalLink className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isPending}
            className="font-medium p-[10px]"
            onClick={() => open(id)}
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isPending}
            className="text-amber-700 focus:text-am-700 font-medium p-[10px]"
            onClick={onDelete}
          >
            <Trash className="size-4 mr-2 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog />
    </div>
  )
}
