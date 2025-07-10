import { PropsWithChildren } from 'react'

import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { useMedia } from 'react-use'

import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { Drawer, DrawerContent, DrawerTitle } from './ui/drawer'

type ResponsiveModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ResponsiveModal = ({
  children,
  open,
  onOpenChange,
}: PropsWithChildren<ResponsiveModalProps>) => {
  const isDesktop = useMedia('(min-width: 1024px)', true)

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <VisuallyHidden.Root>
          <DialogTitle />
        </VisuallyHidden.Root>
        <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto max-h-[85vh] hide-scrollbar">
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <VisuallyHidden.Root>
        <DrawerTitle />
      </VisuallyHidden.Root>
      <DrawerContent>
        <div className="overflow-auto hide-scrollbar max-h-[85vh]">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
