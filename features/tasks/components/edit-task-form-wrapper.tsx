'use client'

import React from 'react'

import { Loader2 } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { useGetProjects } from '@/features/projects/api/use-get-projects'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'

import { useGetTask } from '../api/use-get-task'
import { EditTaskForm } from './edit-task-form'

type EditTaskFormWrapperProps = {
  id: string
  onCancel: () => void
}

export const EditTaskFormWrapper = ({
  id,
  onCancel,
}: EditTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId()

  const { data: task, isLoading: isLoadingTask } = useGetTask({ taskId: id })

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  })
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  })

  const projectOptions = projects?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }))

  const memberOptions = members?.documents.map((member) => ({
    id: member.$id,
    name: member.name,
  }))

  const isLoading = isLoadingTask || isLoadingProjects || isLoadingMembers

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!task) return null

  return (
    <EditTaskForm
      onCancel={onCancel}
      projectOptions={projectOptions ?? []}
      memberOptions={memberOptions ?? []}
      initialValues={task ?? []}
    />
  )
}
