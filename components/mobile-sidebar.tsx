'use client'

import { useEffect, useState } from 'react'

import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { MenuIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import { Sidebar } from './sidebar'

export const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <SheetTrigger asChild>
        <Button
          title="Open Menu"
          variant="secondary"
          size="icon"
          className="lg:hidden size-10"
        >
          <MenuIcon className="size-6 text-neutral-500" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SheetHeader>
          <VisuallyHidden.Root>
            <SheetTitle>Sidebar Menu</SheetTitle>
          </VisuallyHidden.Root>
          <VisuallyHidden.Root>
            <SheetDescription>
              Navigate throughout website using Sidebar Menu
            </SheetDescription>
          </VisuallyHidden.Root>
        </SheetHeader>

        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}
