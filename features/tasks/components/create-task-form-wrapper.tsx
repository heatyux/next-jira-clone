'use client'

import React from 'react'

import { Loader2 } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { useGetProjects } from '@/features/projects/api/use-get-projects'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'

import { TaskStatus } from '../types'
import { CreateTaskForm } from './create-task-form'

type CreateTaskFormWrapperProps = {
  initialStatus?: TaskStatus | null
  onCancel: () => void
}

export const CreateTaskFormWrapper = ({
  initialStatus,
  onCancel,
}: CreateTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId()

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

  const isLoading = isLoadingProjects || isLoadingMembers

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <CreateTaskForm
      initialStatus={initialStatus}
      onCancel={onCancel}
      projectOptions={projectOptions ?? []}
      memberOptions={memberOptions ?? []}
    />
  )
}
