'use client'

import { usePathname } from 'next/navigation'

import { UserButton } from '@/features/auth/components/user-button'

import { MobileSidebar } from './mobile-sidebar'

const pathnameMap = {
  tasks: {
    title: 'My Tasks',
    desctiption: 'View all of your tasks here.',
  },
  projects: {
    title: 'Projects',
    desctiption: 'View all of your projects here.',
  },
}

const defaultMap = {
  title: 'Home',
  desctiption: 'Monitor all of your projects and tasks here.',
}

export const Navbar = () => {
  const pathname = usePathname()
  const pathnameParts = pathname.split('/')
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap

  const { title, desctiption } = pathnameMap[pathnameKey] || defaultMap
  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{desctiption}</p>
      </div>

      <MobileSidebar />
      <UserButton />
    </nav>
  )
}
