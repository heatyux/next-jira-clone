'use client'

import { useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { DottedSeparator } from '@/components/dotted-separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useConfirm } from '@/hooks/use-confirm'
import { cn } from '@/lib/utils'

import { useDeleteWorkspace } from '../api/use-delete-workspace'
import { useUpdateWorkspace } from '../api/use-update-workspace'
import { updateWorkspaceSchema } from '../schema'
import { Workspace } from '../types'

type EditWorkspaceFormProps = {
  initialValues: Workspace
  onCancel?: () => void
}
export const EditWorkspaceForm = ({
  initialValues,
  onCancel,
}: EditWorkspaceFormProps) => {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const [DeleteDialog, confirmDelete] = useConfirm(
    'Delete Workspace',
    'This action cannot be undone.',
    'destructive',
  )

  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace()
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace()
  const isPending = isUpdatingWorkspace || isDeletingWorkspace

  const updateWorkspaceForm = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? '',
    },
  })

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : '',
    }

    updateWorkspace(
      {
        form: finalValues,
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: () => {
          router.refresh()
        },
      },
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_FILE_SIZE = 1 * 1024 * 1024 // 1MB in bytes
    const file = e.target.files?.[0]

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        return toast.error('Image size cannot exceed 1MB.')
      }

      updateWorkspaceForm.setValue('image', file)
    }
  }

  const handleDelete = async () => {
    const ok = await confirmDelete()

    if (!ok) {
      return
    }

    deleteWorkspace(
      { param: { workspaceId: initialValues.$id } },
      {
        onSuccess: () => {
          window.location.href = '/'
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Card className="size-full border-none shadow-none">
        <CardHeader className="flex items-center gap-x-4 p-7 space-y-0">
          <Button
            variant="secondary"
            size="sm"
            className="gap-x-1"
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${initialValues.$id}`)
            }
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValues.name}
          </CardTitle>
        </CardHeader>

        <div className="px-7">
          <DottedSeparator />
        </div>

        <CardContent>
          <Form {...updateWorkspaceForm}>
            <form onSubmit={updateWorkspaceForm.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  disabled={isPending}
                  control={updateWorkspaceForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter workspace name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isPending}
                  control={updateWorkspaceForm.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="size-[72px] relative rounded-md overflow-hidden">
                            <Image
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              alt="Workspace Lofo"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm">Workspace Icon</p>
                          <p className="text-xs text-muted-foreground">
                            JPG, PNG, or JPEG, max 1MB
                          </p>
                          <input
                            ref={inputRef}
                            type="file"
                            className="hidden"
                            accept=".jpg, .png, .jpeg"
                            disabled={isPending}
                            onChange={handleImageChange}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant="destructive"
                              size="xs"
                              className="w-fit mt-2"
                              onClick={() => {
                                field.onChange('')
                                if (inputRef.current) {
                                  inputRef.current.value = ''
                                }
                              }}
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              disabled={isPending}
                              type="button"
                              variant="tertiary"
                              size="xs"
                              className="w-fit mt-2"
                              onClick={() => inputRef.current?.click()}
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                      <FormMessage />
                    </div>
                  )}
                />
              </div>

              <DottedSeparator className="py-7" />

              <div className="flex items-center justify-between">
                <Button
                  disabled={isPending}
                  type="button"
                  size="lg"
                  variant="secondary"
                  onClick={onCancel}
                  className={cn(!onCancel && 'invisible')}
                >
                  Cancel
                </Button>
                <Button disabled={isPending} type="submit" size="lg">
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="size-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is irreversible and will remove all
              associated data.
            </p>

            <Button
              size="sm"
              variant="destructive"
              type="button"
              disabled={isPending}
              className="mt-6 w-fit ml-auto"
              onClick={handleDelete}
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>

      <DeleteDialog />
    </div>
  )
}
