'use client'

import { Loader2, PlusIcon } from 'lucide-react'
import { useQueryState } from 'nuqs'

import { DottedSeparator } from '@/components/dotted-separator'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'

import { useGetTasks } from '../api/use-get-tasks'
import { useCreateTaskModal } from '../hooks/use-create-task-modal'
import { useTaskFilters } from '../hooks/use-task-filters'
import { columns } from './columns'
import { DataFilters } from './data-filters'
import { DataTable } from './data-table'

export const TaskViewSwitcher = () => {
  const [view, setView] = useQueryState('task-view', { defaultValue: 'table' })

  const [{ projectId, status, assigneeId, dueDate }] = useTaskFilters()

  const workspaceId = useWorkspaceId()

  const { open } = useCreateTaskModal()
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    projectId,
    status,
    assigneeId,
    dueDate,
  })

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 w-full border rounded-lg"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger value="table" className="h-8 w-full lg:w-auto">
              Table
            </TabsTrigger>
            <TabsTrigger value="kanban" className="h-8 w-full lg:w-auto">
              Kanban
            </TabsTrigger>
            <TabsTrigger value="calendar" className="h-8 w-full lg:w-auto">
              Calendar
            </TabsTrigger>
          </TabsList>

          <Button onClick={open} size="sm" className="w-full lg:w-auto">
            <PlusIcon />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />

        <DataFilters />

        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              {JSON.stringify(tasks)}
            </TabsContent>
            <TabsContent value="calendar" className="mt-0">
              {JSON.stringify(tasks)}
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  )
}
