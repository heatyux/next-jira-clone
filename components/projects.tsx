'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RiAddCircleFill } from 'react-icons/ri'

import { useGetProjects } from '@/features/projects/api/use-get-projects'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { cn } from '@/lib/utils'

export const Projects = () => {
  const pathname = usePathname()
  const workspaceId = useWorkspaceId()
  const projectId = null // TODO: Fetch project id using hook

  const { data: projects } = useGetProjects({ workspaceId })

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Projects</p>

        <button>
          <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
        </button>
      </div>

      {projects?.documents.map((project) => {
        const href = `/workspaces/${workspaceId}/proejcts/${projectId}`
        const isActive = pathname === href

        return (
          <Link href={href} key={project.$id}>
            <div
              className={cn(
                'flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-emerald-500',
                isActive && 'bg-white shadow-sm hover:opacity-100 text-primary',
              )}
            >
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
