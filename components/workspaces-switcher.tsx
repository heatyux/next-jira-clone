'use client'

import { useRouter } from 'next/navigation'
import { RiAddCircleFill } from 'react-icons/ri'

import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces'
import { WorkspaceAvatar } from '@/features/workspaces/components/workspace-avatar'
import { useCreateWorkspaceModal } from '@/features/workspaces/hooks/use-create-workspace-modal'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

export const WorkspacesSwitcher = () => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const { data: workspaces } = useGetWorkspaces()
  const { open } = useCreateWorkspaceModal()

  const onSelect = (id: string) => {
    router.push(`/workspaces/${id}`)
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
        <button onClick={open}>
          <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
        </button>
      </div>

      <Select onValueChange={onSelect} value={workspaceId}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium px-1 py-6">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>

        <SelectContent>
          {workspaces?.documents.map((workspace) => (
            <SelectItem key={workspace.$id} value={workspace.$id}>
              <div className="flex items-center gap-3 font-medium">
                <WorkspaceAvatar
                  name={workspace.name}
                  image={workspace.imageUrl}
                />
                <span className="truncate">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
