'use client'

import { Settings, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from 'react-icons/go'

import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { cn } from '@/lib/utils'

const routes = [
  {
    label: 'Home',
    path: '',
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: 'My Tasks',
    path: '/tasks',
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: Settings,
    activeIcon: Settings,
  },
  {
    label: 'Members',
    path: '/members',
    icon: UserIcon,
    activeIcon: UserIcon,
  },
]

export const Navigation = () => {
  const pathname = usePathname()
  const workspaceId = useWorkspaceId()

  return (
    <ul className="flex flex-col">
      {routes.map((route) => {
        const fullHref = `/workspaces/${workspaceId}${route.path}`
        const isActive = pathname === fullHref
        const Icon = isActive ? route.activeIcon : route.icon

        return (
          <li key={fullHref}>
            <Link href={fullHref}>
              <div
                className={cn(
                  'flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500',
                  isActive &&
                    'bg-white shadow-sm hover:opacity-100 text-priamy',
                )}
              >
                <Icon className="size-5 text-neutral-500" />
                {route.label}
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
