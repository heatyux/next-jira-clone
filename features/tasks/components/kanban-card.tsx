import { MoreHorizontalIcon } from 'lucide-react'

import { DottedSeparator } from '@/components/dotted-separator'
import { MemberAvatar } from '@/features/members/components/member-avatar'
import { ProjectAvatar } from '@/features/projects/components/project-avatar'

import type { Task } from '../types'
import { TaskActions } from './task-actions'
import { TaskDate } from './task-date'

interface KanbanCardProps {
  task: Task
}

export const KanbanCard = ({ task }: KanbanCardProps) => {
  return (
    <div className="p-2.5 mb-1.5 space-y-3 bg-white rounded shadow-sm">
      <div className="flex justify-between gap-x-2">
        <p className="text-sm line-clamp-2">{task.name}</p>
        <TaskActions id={task.$id} projectId={task.projectId}>
          <MoreHorizontalIcon className="size-[18px] text-neutral-700 stroke-1 shrink-0 hover:opacity-75 transition cursor-pointer" />
        </TaskActions>
      </div>

      <DottedSeparator />

      <div className="flex items-center gap-x-1.5">
        <MemberAvatar
          name={task.assignee.name}
          fallbackClassName="text-[10px]"
        />
        <div aria-hidden className="size-1 rounded-full bg-neutral-300" />
        <TaskDate value={task.dueDate} className="text-xs" />
      </div>

      <div className="flex items-center gap-x-1.5">
        <ProjectAvatar
          name={task.project.name}
          image={task.project.imageUrl}
          className="text-[10px]"
        />
        <span className="text-xs font-medium">{task.project.name}</span>
      </div>
    </div>
  )
}
