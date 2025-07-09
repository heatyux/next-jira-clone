import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { client } from '@/lib/hono'

type ResponseType = InferResponseType<(typeof client.api.auth.logout)['$post']>

export const useLogout = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType>({
    mutationFn: async () => {
      const response = await client.api.auth.logout.$post()

      if (!response.ok) {
        throw new Error('Failed to register!')
      }

      return await response.json()
    },
    onSuccess: () => {
      router.refresh()

      queryClient.invalidateQueries({
        queryKey: ['current'],
      })

      queryClient.invalidateQueries({
        queryKey: ['workspaces'],
      })
    },
    onError: (error) => {
      console.error('[REGISTER]: ', error)

      toast.error('Failed to register!')
    },
  })

  return mutation
}
