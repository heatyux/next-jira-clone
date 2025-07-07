import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'

import { client } from '@/lib/hono'

type ResponseType = InferResponseType<(typeof client.api.workspaces)['$post']>
type ResquestType = InferRequestType<typeof client.api.workspaces.$post>

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, ResquestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.workspaces.$post({ json })

      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['workspaces'],
      })
    },
  })

  return mutation
}
