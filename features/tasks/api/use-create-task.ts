import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

import { client } from '@/lib/hono'

type ResponseType = InferResponseType<typeof client.api.tasks.$post, 200>
type RequestType = InferRequestType<typeof client.api.tasks.$post>

export const useCreateTask = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks.$post({ json })

      if (!response.ok) {
        throw new Error('Failed to created tasks.')
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      toast.success('Task created.')

      queryClient.invalidateQueries({
        queryKey: ['tasks', data.workspaceId],
        exact: true,
      })
    },
    onError: (error) => {
      console.error('[CREATE_TASK]: ', error)

      toast.error('Failed to create task.')
    },
  })

  return mutation
}
