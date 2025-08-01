'use client'

import { PropsWithChildren } from 'react'

import { ExternalLink, PencilIcon, Trash } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useConfirm } from '@/hooks/use-confirm'

import { useDeleteTask } from '../api/use-delete-task'

interface TaskActionsProps {
  id: string
  projectId: string
}

export const TaskActions = ({
  id,
  children,
}: PropsWithChildren<TaskActionsProps>) => {
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

  return (
    <div className="flex justify-end">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="font-medium p-[10px]">
            <ExternalLink className="size-4 mr-2 stroke-2" />
            Task Detail
          </DropdownMenuItem>
          <DropdownMenuItem className="font-medium p-[10px]">
            <ExternalLink className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem className="font-medium p-[10px]">
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
