import { useRouter } from 'next/navigation'

import { MemberAvatar } from '@/features/members/components/member-avatar'
import { ProjectAvatar } from '@/features/projects/components/project-avatar'
import type { Project } from '@/features/projects/types'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { cn } from '@/lib/utils'

import { TaskStatus } from '../types'

interface EventCardProps {
  id: string
  title: string
  assignee: any
  project: Project
  status: TaskStatus
}

const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: 'border-l-pink-500',
  [TaskStatus.TODO]: 'border-l-red-500',
  [TaskStatus.IN_PROGRESS]: 'border-l-yellow-500',
  [TaskStatus.IN_REVIEW]: 'border-l-blue-500',
  [TaskStatus.DONE]: 'border-l-emerald-500',
}

export const EventCard = ({
  id,
  status,
  title,
  assignee,
  project,
}: EventCardProps) => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()

    router.push(`/workspaces/${workspaceId}/tasks/${id}`)
  }

  return (
    <div className="px-2">
      <button
        onClick={onClick}
        className={cn(
          'p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition',
          statusColorMap[status],
        )}
      >
        <p>{title}</p>
        <div className="flex items-center gap-x-1">
          <MemberAvatar name={assignee?.name} />
          <div aria-hidden className="size-1 rounded-full bg-neutral-300" />
          <ProjectAvatar name={project?.name} image={project?.imageUrl} />
        </div>
      </button>
    </div>
  )
}
