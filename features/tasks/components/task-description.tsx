import { useState } from 'react'

import { Pencil, XIcon } from 'lucide-react'

import { DottedSeparator } from '@/components/dotted-separator'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

import { useUpdateTask } from '../api/use-update-task'
import { Task } from '../types'

interface TaskDescriptionProps {
  task: Task
}

export const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(task.description)

  const { mutate: editTask, isPending } = useUpdateTask()

  const handleSave = () => {
    editTask(
      {
        json: { description: value },
        param: { taskId: task.$id },
      },
      {
        onSuccess: () => {
          setIsEditing(false)
        },
      },
    )
  }

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Overview</p>
        <Button
          disabled={isPending}
          variant="secondary"
          size="sm"
          onClick={() => {
            setValue(task.description)
            setIsEditing((preIsEditing) => !preIsEditing)
          }}
        >
          {isEditing ? (
            <XIcon className="size-4 mr-2" />
          ) : (
            <Pencil className="size-4 mr-2" />
          )}
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      <DottedSeparator className="my-4" />

      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            disabled={isPending}
            autoFocus
            value={value}
            rows={4}
            placeholder="Add a description..."
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            disabled={isPending}
            size="sm"
            className="w-fit ml-auto"
            onClick={handleSave}
          >
            {isPending ? 'Saveing...' : 'Save Changes'}
          </Button>
        </div>
      ) : (
        <div>
          {task.description || (
            <span className="text-muted-foreground italic">
              No description set...
            </span>
          )}
        </div>
      )}
    </div>
  )
}
