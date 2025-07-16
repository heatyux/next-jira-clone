import Image from 'next/image'
import Link from 'next/link'

import { DottedSeparator } from './dotted-separator'
import { Navigation } from './navigation'
import { Projects } from './projects'
import { WorkspacesSwitcher } from './workspaces-switcher'

export const Sidebar = () => {
  return (
    <aside className="h-full w-full p-4 bg-neutral-100">
      <Link href="/">
        <Image src="/logo.svg" alt="Logo" width={164} height={48} />
      </Link>

      <DottedSeparator className="my-4" />

      <WorkspacesSwitcher />

      <DottedSeparator className="my-4" />

      <Navigation />

      <DottedSeparator className="my-4" />

      <Projects />
    </aside>
  )
}
