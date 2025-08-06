'use client'

import { useEffect, useState } from 'react'

import { CreateProjectModal } from '@/features/projects/components/create-project-modal'
import { CreateTaskModal } from '@/features/tasks/components/create-task-modal'
import { EditTaskModal } from '@/features/tasks/components/edit-task-modal'
import { CreateWorkspaceModal } from '@/features/workspaces/components/create-workspace-modal'

export const ModalProvider = () => {
  const [isMount, setIsMount] = useState(false)

  useEffect(() => {
    setIsMount(true)
  }, [])

  if (!isMount) {
    return null
  }

  return (
    <>
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <CreateTaskModal />
      <EditTaskModal />
    </>
  )
}
