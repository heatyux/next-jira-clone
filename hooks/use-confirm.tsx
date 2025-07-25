import { JSX, useState } from 'react'

import { VariantProps } from 'class-variance-authority'

import { ResponsiveModal } from '@/components/responsive-modal'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const useConfirm = (
  title: string,
  message: string,
  variant: VariantProps<typeof buttonVariants>['variant'] = 'primary',
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void
  } | null>(null)

  const confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve })
    })
  }

  const handleClose = () => {
    setPromise(null)
  }

  const handleCancel = () => {
    promise?.resolve(false)
    handleClose()
  }

  const handleConfirm = () => {
    promise?.resolve(true)
    handleClose()
  }

  const ConfirmationDialog = () => (
    <ResponsiveModal open={promise !== null} onOpenChange={handleClose}>
      <Card className="size-full border-none shadow-none">
        <CardContent className="pt-8">
          <CardHeader className="p-0">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>

          <div className="pt-4 w-full flex flex-col gap-y-2 lg:flex-row lg:gap-x-2 items-center justify-end">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-full lg:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant={variant}
              className="w-full lg:w-auto"
            >
              Confirm
            </Button>
          </div>
        </CardContent>
      </Card>
    </ResponsiveModal>
  )

  return [ConfirmationDialog, confirm]
}
