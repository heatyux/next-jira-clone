'use client'

import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { DottedSeparator } from '@/components/dotted-separator'
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
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { cn } from '@/lib/utils'

import { useCreateTask } from '../api/use-create-task'
import { createTaskSchema } from '../schema'

type CreateTaskFormProps = {
  onCancel?: () => void
  projectOptions: { id: string; name: string; imageUrl: string }[]
  memberOptions: { id: string; name: string }[]
}

export const CreateTaskForm = ({ onCancel }: CreateTaskFormProps) => {
  const workspaceId = useWorkspaceId()

  const { mutate: createTask, isPending } = useCreateTask()

  const createTaskForm = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      name: '',
      workspaceId,
      dueDate: undefined,
    },
  })

  const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
    createTask(
      {
        json: values,
      },
      {
        onSuccess: () => {
          createTaskForm.reset()

          // TODO: Redirect to new task
        },
      },
    )
  }

  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create a new task</CardTitle>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <Form {...createTaskForm}>
          <form onSubmit={createTaskForm.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                disabled={isPending}
                control={createTaskForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter task name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isPending}
                control={createTaskForm.control}
                name="dueDate"
                render={() => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>{/* TODO: Date picker */}</FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DottedSeparator className="py-7" />

            <div className="flex items-center justify-between">
              <Button
                disabled={isPending}
                type="button"
                variant="secondary"
                size="lg"
                onClick={onCancel}
                className={cn(!onCancel && 'invisible')}
              >
                Cancel
              </Button>
              <Button disabled={isPending} type="submit" size="lg">
                Create Project
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
